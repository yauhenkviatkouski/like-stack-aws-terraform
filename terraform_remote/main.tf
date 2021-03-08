provider "aws" {
  region  = "eu-west-1"
  access_key = "AKIAZ7QHKGC2KGQ63INL"
  secret_key = "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"
}

module "lamda_and_sqs" {
  source = "../notification-service"
}

module "static_web_hosting" {
  source = "../like-stack-client"
}