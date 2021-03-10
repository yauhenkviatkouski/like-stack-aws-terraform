## Notification microservice for lsapp

uses amazon web services:

- sns
- sqs
- lambda
- dynamoDB

install dependencies for lambda notifier before deploying via terraform
npm i nodemailer-smtp-transport nodemailer --prefix ./
