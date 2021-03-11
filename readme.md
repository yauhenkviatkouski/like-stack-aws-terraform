
![Diagram](https://user-images.githubusercontent.com/47756969/110864397-18294400-82d3-11eb-9a13-c9fed4d11362.jpg)

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
