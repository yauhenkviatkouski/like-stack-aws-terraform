# terraform apply -var-file="vars.tfvars"

terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "3.29.0"
    }
  }
}


resource "aws_sns_topic" "results_updates" {
  name = "results-updates-topic"
}

resource "aws_sqs_queue" "results_updates_queue" {
    name = "results-updates-queue"
    visibility_timeout_seconds = 300

    tags = {
        Environment = "dev"
    }
}


resource "aws_sns_topic_subscription" "results_updates_sqs_target" {
    topic_arn = aws_sns_topic.results_updates.arn
    protocol  = "sqs"
    endpoint  = aws_sqs_queue.results_updates_queue.arn
}

resource "aws_sqs_queue_policy" "results_updates_queue_policy" {
    queue_url = aws_sqs_queue.results_updates_queue.id

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
      "Resource": "${aws_sqs_queue.results_updates_queue.arn}",
      "Condition": {
        "ArnEquals": {
          "aws:SourceArn": "${aws_sns_topic.results_updates.arn}"
        }
      }
    }
  ]
}
POLICY
}

resource "aws_lambda_function" "results_updates_lambda" {
  filename         = "${path.module}/lambda/example.zip"
  function_name    = "example_lambda_name"
  role             = aws_iam_role.lambda_role.arn
  handler          = "example.handler"
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  runtime          = "nodejs12.x"
}

resource "aws_lambda_event_source_mapping" "results_updates_lambda" {
  event_source_arn = aws_sqs_queue.results_updates_queue.arn
  function_name    = aws_lambda_function.results_updates_lambda.arn
}

resource "aws_iam_role" "lambda_role" {
    name = "LambdaRole"
    assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
        "Action": "sts:AssumeRole",
        "Effect": "Allow",
        "Principal": {
            "Service": "lambda.amazonaws.com"
        }
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "lambda_role_sqs_policy" {
    name = "AllowSQSPermissions"
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
      "Resource": "*"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "lambda_role_logs_policy" {
    name = "LambdaRolePolicy"
    role = aws_iam_role.lambda_role.id
    policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
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