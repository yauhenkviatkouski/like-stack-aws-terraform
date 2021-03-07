data "archive_file" "lambda_subscriber_zip" {
  type        = "zip"
  source_file = "${path.module}/lambdas/lambda-subscriber.js"
  output_path = "${path.module}/lambdas/lambda-subscriber.zip"
}

data "archive_file" "lambda_notifier_zip" {
  type        = "zip"
  source_dir = "${path.module}/lambdas/lambda-notifier"
  output_path = "${path.module}/lambdas/lambda-notifier.zip"
}

data "local_file" "input_variables" {
    filename = "${path.module}/../tfvars.json"
}