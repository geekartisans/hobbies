import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

// Configuration
const config = new pulumi.Config();
const dbPassword = config.requireSecret("db-password");
const dbUsername = config.require("db-username");
const dbName = config.require("db-name");
const dbSchema = config.require("db-schema");

// VPC and Networking
const vpc = new awsx.ec2.Vpc("hobbies-vpc", {
  numberOfAvailabilityZones: 2,
  enableDnsHostnames: true,
  enableDnsSupport: true,
  natGateways: {
    strategy: "Single",
  },
  tags: {
    Name: "hobbies-vpc",
  },
});

// Security Groups
const albSecurityGroup = new aws.ec2.SecurityGroup("alb-sg", {
  vpcId: vpc.vpcId,
  description: "Security group for Application Load Balancer",
  ingress: [
    {
      protocol: "tcp",
      fromPort: 80,
      toPort: 80,
      cidrBlocks: ["0.0.0.0/0"],
      description: "HTTP from anywhere",
    },
    {
      protocol: "tcp",
      fromPort: 443,
      toPort: 443,
      cidrBlocks: ["0.0.0.0/0"],
      description: "HTTPS from anywhere",
    },
  ],
  egress: [
    {
      protocol: "-1",
      fromPort: 0,
      toPort: 0,
      cidrBlocks: ["0.0.0.0/0"],
      description: "Allow all outbound traffic",
    },
  ],
  tags: {
    Name: "hobbies-alb-sg",
  },
});

const ecsSecurityGroup = new aws.ec2.SecurityGroup("ecs-sg", {
  vpcId: vpc.vpcId,
  description: "Security group for ECS tasks",
  ingress: [
    {
      protocol: "tcp",
      fromPort: 3000,
      toPort: 3000,
      securityGroups: [albSecurityGroup.id],
      description: "Allow traffic from ALB",
    },
  ],
  egress: [
    {
      protocol: "-1",
      fromPort: 0,
      toPort: 0,
      cidrBlocks: ["0.0.0.0/0"],
      description: "Allow all outbound traffic",
    },
  ],
  tags: {
    Name: "hobbies-ecs-sg",
  },
});

const rdsSecurityGroup = new aws.ec2.SecurityGroup("rds-sg", {
  vpcId: vpc.vpcId,
  description: "Security group for RDS PostgreSQL",
  ingress: [
    {
      protocol: "tcp",
      fromPort: 5432,
      toPort: 5432,
      securityGroups: [ecsSecurityGroup.id],
      description: "PostgreSQL from ECS tasks",
    },
  ],
  egress: [
    {
      protocol: "-1",
      fromPort: 0,
      toPort: 0,
      cidrBlocks: ["0.0.0.0/0"],
      description: "Allow all outbound traffic",
    },
  ],
  tags: {
    Name: "hobbies-rds-sg",
  },
});

// RDS Subnet Group
const dbSubnetGroup = new aws.rds.SubnetGroup("hobbies-db-subnet", {
  subnetIds: vpc.privateSubnetIds,
  tags: {
    Name: "hobbies-db-subnet-group",
  },
});

// RDS PostgreSQL Instance (Free tier eligible)
const db = new aws.rds.Instance("hobbies-db", {
  engine: "postgres",
  engineVersion: "16.11",
  instanceClass: "db.t3.micro",
  allocatedStorage: 10,
  storageType: "gp2",
  dbName: dbName,
  username: dbUsername,
  password: dbPassword,
  dbSubnetGroupName: dbSubnetGroup.name,
  vpcSecurityGroupIds: [rdsSecurityGroup.id],
  caCertIdentifier: "rds-ca-rsa2048-g1",
  publiclyAccessible: false,
  skipFinalSnapshot: true, // For dev/test - set to false in production
  backupRetentionPeriod: 7,
  tags: {
    Name: "hobbies-postgres",
  },
});

// ECR Repository for Docker images
const repo = new awsx.ecr.Repository("hobbies-repo", {
  forceDelete: true, // Allow deletion even if images exist
});

// Build and push Docker image
const image = new awsx.ecr.Image("hobbies-image", {
  repositoryUrl: repo.url,
  context: "../",
  dockerfile: "../Dockerfile",
  platform: "linux/amd64",
});

// ECS Cluster
const cluster = new aws.ecs.Cluster("hobbies-cluster", {
  tags: {
    Name: "hobbies-cluster",
  },
});

// IAM Role for ECS Task Execution
const executionRole = new aws.iam.Role("ecs-execution-role", {
  assumeRolePolicy: JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Action: "sts:AssumeRole",
        Effect: "Allow",
        Principal: {
          Service: "ecs-tasks.amazonaws.com",
        },
      },
    ],
  }),
});

new aws.iam.RolePolicyAttachment("ecs-execution-role-policy", {
  role: executionRole.name,
  policyArn:
    "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy",
});

// IAM Role for ECS Task
const taskRole = new aws.iam.Role("ecs-task-role", {
  assumeRolePolicy: JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Action: "sts:AssumeRole",
        Effect: "Allow",
        Principal: {
          Service: "ecs-tasks.amazonaws.com",
        },
      },
    ],
  }),
});

// CloudWatch Log Group
const logGroup = new aws.cloudwatch.LogGroup("hobbies-logs", {
  retentionInDays: 7,
  tags: {
    Name: "hobbies-logs",
  },
});

// Application Load Balancer
const alb = new aws.lb.LoadBalancer("hobbies-alb", {
  loadBalancerType: "application",
  securityGroups: [albSecurityGroup.id],
  subnets: vpc.publicSubnetIds,
  tags: {
    Name: "hobbies-alb",
  },
});

// Target Group
const targetGroup = new aws.lb.TargetGroup("hobbies-tg", {
  port: 3000,
  protocol: "HTTP",
  vpcId: vpc.vpcId,
  targetType: "ip",
  healthCheck: {
    enabled: true,
    path: "/api",
    interval: 30,
    timeout: 5,
    healthyThreshold: 2,
    unhealthyThreshold: 3,
  },
  tags: {
    Name: "hobbies-target-group",
  },
});

// ALB Listener
const listener = new aws.lb.Listener("hobbies-listener", {
  loadBalancerArn: alb.arn,
  port: 80,
  protocol: "HTTP",
  defaultActions: [
    {
      type: "forward",
      targetGroupArn: targetGroup.arn,
    },
  ],
});

// ECS Task Definition
const taskDefinition = new aws.ecs.TaskDefinition("hobbies-task", {
  family: "hobbies-app",
  cpu: "256", // 0.25 vCPU
  memory: "512", // 512 MB
  networkMode: "awsvpc",
  requiresCompatibilities: ["FARGATE"],
  executionRoleArn: executionRole.arn,
  taskRoleArn: taskRole.arn,
  containerDefinitions: pulumi
    .all([
      image.imageUri,
      db.endpoint,
      db.dbName,
      dbUsername,
      dbPassword,
      logGroup.name,
    ])
    .apply(([imageUri, dbEndpoint, dbNameVal, dbUser, dbPass, logGroupName]) =>
      JSON.stringify([
        {
          name: "hobbies-app",
          image: imageUri,
          portMappings: [
            {
              containerPort: 3000,
              protocol: "tcp",
            },
          ],
          environment: [
            {
              name: "NODE_ENV",
              value: "production",
            },
            {
              name: "APP_PORT",
              value: "3000",
            },
            {
              name: "DATABASE_URL",
              value: `postgresql://${dbUser}:${dbPass}@${dbEndpoint}/${dbNameVal}?schema=${dbSchema}&sslmode=no-verify`,
            },
          ],
          logConfiguration: {
            logDriver: "awslogs",
            options: {
              "awslogs-group": logGroupName,
              "awslogs-region": "eu-central-1",
              "awslogs-stream-prefix": "hobbies",
            },
          },
        },
      ]),
    ),
});

// ECS Service
const service = new aws.ecs.Service(
  "hobbies-service",
  {
    cluster: cluster.arn,
    taskDefinition: taskDefinition.arn,
    desiredCount: 1, // single instance
    launchType: "FARGATE",
    networkConfiguration: {
      subnets: vpc.privateSubnetIds,
      securityGroups: [ecsSecurityGroup.id],
      assignPublicIp: false,
    },
    loadBalancers: [
      {
        targetGroupArn: targetGroup.arn,
        containerName: "hobbies-app",
        containerPort: 3000,
      },
    ],
  },
  {
    dependsOn: [listener],
  },
);

export const vpcId = vpc.vpcId;
export const albUrl = pulumi.interpolate`http://${alb.dnsName}`;
export const dbEndpoint = db.endpoint;
export const ecrRepositoryUrl = repo.url;
export const clusterName = cluster.name;
export const serviceName = service.name;
