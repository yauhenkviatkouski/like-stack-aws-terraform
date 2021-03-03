data "archive_file" "lambda_zip" {
  type        = "zip"
  source_file = "${path.module}/lambda/example.js"
  output_path = "${path.module}/lambda/example.zip"
}