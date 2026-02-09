# The Hobbies app overview

Here you can find the app sample:
http://hobbies-alb-aacf86b-1219020769.eu-central-1.elb.amazonaws.com/

## Back-end
The back-end was written using the Nest.js framework, which might be too much for this project. I did it on purpose because it has a rich ecosystem and a CLI with code generation.

I also used Prisma ORM for database access because it is simple to install and manage, and it has its own GUI (Prisma Studio).

## Front-end
The front-end was built with React, Tailwind CSS, and some Headless UI components.
It is a basic SPA that provides a UI and interacts with the API.

## Infrastructure
I used an IaC tool called [Pulumi](https://www.pulumi.com/) because it is simple and powerful. It lets you create and manage cloud services in a much simpler way, as a developer friendly alternative to Terraform.


## Summary
This is a working sample, but it still has room for improvement. Some parts were intentionally simplified to reduce development time and keep it straightforward.
For example:
- Creating and deploying the whole app from the monorepo
- Serving static files from the back-end
- The lack of security packages like Helmet, API rate limiting, etc.
- The front-end architecture is too straightforward, not easily extendable, and neglects some basic principles such as DRY
- The AWS infrastructure is too simple and should be improved for production-ready apps

So I wouldn't use this approach in production, it's meant for a general overview.