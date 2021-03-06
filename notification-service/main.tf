# provider "aws" {
#    region = "eu-west-1"
# }

terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "3.29.0"
    }
  }
}

resource "aws_dynamodb_table" "subscribers_db" {
  name             = "subscribers_db"
  hash_key         = "questionId"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  attribute {
    name = "questionId"
    type = "S"
  }
}

resource "aws_iam_role" "lambda_role" {
    name = "lambda_role"
    assume_role_policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Action": "sts:AssumeRole",
        "Principal": {
          "Service": "lambda.amazonaws.com"
        },
        "Effect": "Allow",
        "Sid": ""
      }
    ]
}
EOF
}

resource "aws_iam_role_policy" "lambda_subscriber_dynamo_policy" {
  name = "lambda_subscriber_dynamo_policy"
  role = aws_iam_role.lambda_role.id
  policy = <<EOF
{  
  "Version": "2012-10-17",
  "Statement":[{
    "Effect": "Allow",
    "Action": [
     "dynamodb:BatchGetItem",
     "dynamodb:GetItem",
     "dynamodb:Query",
     "dynamodb:Scan",
     "dynamodb:BatchWriteItem",
     "dynamodb:PutItem",
     "dynamodb:UpdateItem"
    ],
    "Resource": "${aws_dynamodb_table.subscribers_db.arn}"
   }
  ]
}
EOF
}

resource "aws_iam_role_policy" "lambdas_policy" {
    name = "lambdas_policy"
    role = aws_iam_role.lambda_role.id
    policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "sqs:ChangeMessageVisibility",
        "sqs:DeleteMessage",
        "sqs:GetQueueAttributes",
        "sqs:ReceiveMessage"
      ],
      "Effect": "Allow",
      "Resource": [
        "${aws_sqs_queue.subscribers_queue.arn}",
        "${aws_sqs_queue.notifications_queue.arn}"
      ]
    },
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Effect": "Allow",
      "Resource": "*"
    }
  ]
}
EOF
}

resource "aws_lambda_function" "lambda_subscriber" {

  function_name = "lambda_subscriber"
  filename         = "${path.module}/lambdas/lambda-subscriber.zip"
  role          = aws_iam_role.lambda_role.arn
  handler       = "lambda-subscriber.handler"
  source_code_hash = data.archive_file.lambda_subscriber_zip.output_base64sha256
  runtime       = "nodejs12.x"
}

resource "aws_lambda_event_source_mapping" "lambda_subscriber" {
  event_source_arn = aws_sqs_queue.subscribers_queue.arn
  function_name    = aws_lambda_function.lambda_subscriber.arn
}

resource "aws_sqs_queue" "subscribers_queue" {
    name = "subscribers_queue"
    visibility_timeout_seconds = 300
    tags = {
        Environment = "production"
    }
}

// "Principal": { "AWS": "arn:aws:iam::686136373428:user/like-stack-api-dock" },
resource "aws_sqs_queue_policy" "subscribers_queue_policy" {
    queue_url = aws_sqs_queue.subscribers_queue.id

    policy = <<POLICY
{
  "Version": "2012-10-17",
  "Id": "sqspolicy",
  "Statement": [
    {
      "Sid": "First",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "sqs:SendMessage",
      "Resource": "${aws_sqs_queue.subscribers_queue.arn}",
      "Condition": {
         "ArnEquals": {
          "aws:SourceArn": "${aws_sns_topic.subscribe_to_question.arn}"
        }
      }
    }
  ]
}
POLICY
}

resource "aws_lambda_function" "lambda_notifyer" {

  function_name = "lambda_notifyer"
  filename         = "${path.module}/lambdas/lambda-notifyer.zip"
  role          = aws_iam_role.lambda_role.arn
  handler       = "lambda-notifyer.handler"
  source_code_hash = data.archive_file.lambda_notifyer_zip.output_base64sha256
  runtime       = "nodejs12.x"
}

resource "aws_lambda_event_source_mapping" "lambda_notifyer" {
  event_source_arn = aws_sqs_queue.notifications_queue.arn
  function_name    = aws_lambda_function.lambda_notifyer.arn
}

resource "aws_sqs_queue" "notifications_queue" {
    name = "notifications_queue"
    visibility_timeout_seconds = 300
    tags = {
        Environment = "production"
    }
}

resource "aws_sqs_queue_policy" "notifications_queue_policy" {
    queue_url = aws_sqs_queue.notifications_queue.id

    policy = <<POLICY
{
  "Version": "2012-10-17",
  "Id": "sqspolicy",
  "Statement": [
    {
      "Sid": "First",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "sqs:SendMessage",
      "Resource": "${aws_sqs_queue.notifications_queue.arn}",
      "Condition": {
         "ArnEquals": {
          "aws:SourceArn": "${aws_sns_topic.send_notification.arn}"
        }
      }
    }
  ]
}
POLICY
}

resource "aws_sns_topic" "subscribe_to_question" {
  name = "subscribe_to_question"
}

resource "aws_sns_topic_subscription" "subscribe_to_question" {
    topic_arn = aws_sns_topic.subscribe_to_question.arn
    protocol  = "sqs"
    endpoint  = aws_sqs_queue.subscribers_queue.arn
}

resource "aws_sns_topic" "send_notification" {
  name = "send_notification"
}

resource "aws_sns_topic_subscription" "send_notification" {
    topic_arn = aws_sns_topic.send_notification.arn
    protocol  = "sqs"
    endpoint  = aws_sqs_queue.notifications_queue.arn
}

output "subscribers_queue_url" {
  value = aws_sqs_queue.notifications_queue.id
}

resource "local_file" "output_variables" {
    content     =  <<EOF
  {
    "aws_sns_topic_send_notification": "${aws_sns_topic.send_notification.id}",
    "aws_sns_topic_subscribe_to_question": "${aws_sns_topic.subscribe_to_question.id}"
  
  }
  EOF
    filename = "${path.module}/output_variables.json"
}

