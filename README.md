# Hobbies test app

This repository contains the Hobbies app implementation for the test assessment.

## Local development

Follow the steps below to run it locally.

Create a .env file from .env.sample and set your environment variables.

```bash
cp .env.sample .env
```


Run the local DB instance.
```bash
docker-compose up
```


Install dependencies and run the app.
```bash
npm install 

npm run dev
```

Optionally, create database migrations.

```bash
npm run prisma:generate

npm run prisma:migrate

```

## Deployment to AWS

To deploy, install [Pulumi](https://www.pulumi.com/docs/get-started/download-install/).

Configure AWS credentials.

```bash
aws configure
```

Set up a Pulumi stack and create config.

```bash
cd infra

pulumi stack init <your_stack_name>
pulumi stack select  <your_stack_name>
pulumi config set aws:region <your_aws_region>
pulumi config set db-name <your_db_name>
pulumi config set db-username <your_db_username>
pulumi config set --secret db-password <your_password>
pulumi config set db-schema <your_db_schema>

```

Deploy to AWS.

```bash
pulumi up --yes
```

Destroy the project and remove the stack.

```bash 
pulumi destroy --refresh --yes 

pulumi stack rm

```

