data "archive_file" "lambda_subscriber_zip" {
  type        = "zip"
  source_file = "${path.module}/lambdas/lambda-subscriber.js"
  output_path = "${path.module}/lambdas/lambda-subscriber.zip"
}

data "archive_file" "lambda_notifyer_zip" {
  type        = "zip"
  source_file = "${path.module}/lambdas/lambda-notifyer.js"
  output_path = "${path.module}/lambdas/lambda-notifyer.zip"
}