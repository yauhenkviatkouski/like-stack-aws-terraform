# Request-response system - training application with following main technologies:
- Server  
nodejs, mongoDB, express, graphql with apollo-server, passport
- Client  
react, graphql with apollo-client, sass
- Email-notification microservice  
aws (sns, sqs, lambda, s3, dynamoDB), nodemailer
- Development  
terraform, localstack, docker, docker-compose
- Deploy  
 managing cloud applications using Terraform and heroku
- Demo  
https://like-stack-client-dock.herokuapp.com/

![110864397-18294400-82d3-11eb-9a13-c9fed4d11362](https://user-images.githubusercontent.com/47756969/114667688-739e8580-9d08-11eb-9c27-c04b7ed00ee5.jpg)

## Prerequirements:

- terraform
- aws cli
- heroku
- docker & docker-compose

### Start for development:

- local file with terraform variables (tfvars.json) should be in the root of project
- docker-compose up from `/root` folder
- terraform apply from `/terraform_local` folder (terraform should be initialized)

### Deployment

#### Deploy client & api to heroku

- `cd like-stack-api/ && npm run deploy:heroku && ../cd like-stack-client/ && npm run deploy:heroku`

#### Sttart AWS services on production

- terraform apply from `/terraform_remote` folder (terraform should be initialized)
