# AWS S3 bucket for static hosting
terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "3.29.0"
    }
  }
}

resource "aws_s3_bucket" "ls-app-aws-client" {
  bucket = "ls-app-aws-client"
  acl = "public-read"
  force_destroy = true


  policy = <<EOF
{
  "Version": "2008-10-17",
  "Statement": [
    {
      "Sid": "PublicReadForGetBucketObjects",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::ls-app-aws-client/*"
    }
  ]
}
EOF

  website {
    index_document = "index.html"
  }
}

locals {
	# Maps file extensions to mime types
	# Need to add more if needed
  mime_type_mappings = {
    html = "text/html",
    js   = "text/javascript",
    css  = "text/css"
  }
}

resource "aws_s3_bucket_object" "build_objects" {
  for_each = fileset("${path.module}/build/", "*")
  bucket = aws_s3_bucket.ls-app-aws-client.id
  key = each.value
  source = "${path.module}/build/${each.value}"
  etag = filemd5("${path.module}/build/${each.value}")
  content_type = lookup(local.mime_type_mappings, concat(regexall("\\.([^\\.]*)$", each.value), [[""]])[0][0], "application/octet-stream")
}

resource "local_file" "output_variables" {
    content     =  <<EOF
  {
    "website_endpoint": "${aws_s3_bucket.ls-app-aws-client.website_endpoint}",
    "website_id": "${aws_s3_bucket.ls-app-aws-client.id}",
    "website_arn": "${aws_s3_bucket.ls-app-aws-client.arn}"
  }
  EOF
    filename = "${path.module}/output_variables.json"
}
