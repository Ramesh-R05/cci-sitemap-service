# Sitemap Service Pipeline

This Branch is created to maintain the deployment pipeline from shippable separate to master branch


## Jobs file

Shippable currently support 8 types of jobs:

* deploy: This managed job type is used to for deploying your application or service to any supported Container Service, including Amazon Elastic Compute Service (ECS), Google Container Engine (GKE), Joyent Triton, Azure Container Service (ACS), Docker Cloud and Docker Data Center.
* manifest: This managed job type is used for creating and versioning an application or service definition. Your service definition consists of one or more Docker images, options you want to run your containers with, and environment parameters.
* provision: This managed job type is used to create objects on a supported Container Service.
* release: This managed job type is used to perform release management. You can apply semantic versioning to your services or entire application at any stage of your pipeline.
* runSh: This is an unmanaged job that can be configured to do almost anything with custom shell scripts.
* runCI: This unmanaged job is used to connect Shippable CI to the rest of your pipeline.
* runCLI: This unmanaged job is like runSh, but with the addition of automatically configured CLI tools.
* jenkinsJob: This managed job type allows you to connect an existing Jenkins job to your Shippable pipeline.

for further details refer to [Jobs](http://docs.shippable.com/pipelines/jobs/overview/)

## Resources file

Shippable currently support 14 types of resources:

* ciRepo: Represents a project in Shippable CI
* cliConfig: Configuration information for command-line tools
* cluster: Cluster that defines a container service
* dockerOptions: Options for docker images
* file: Specifies a file
* gitRepo: Source repository for your code
* image: Docker image definition
* integration: Credentials for third party services
* loadBalancer: AWS Classic and Application Load Balancers, or Google Container Engine (GKE) services.
* notification: Notifications for job success or failure
* params: Parameters for your apps/services/microservices
* replicas: Number of copies of the service to run
* time: Trigger a job at a specific day and time
* version: Semantic versions

for further details refer to [Resources](http://docs.shippable.com/pipelines/resources/overview/)
