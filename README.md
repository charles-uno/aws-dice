# AWS Practice

Deploying some code to AWS!

For this to work, you have to be logged into docker. The login username also must match the username provided in `build.sh`.
```
docker login
```

## AWS Lightsail

Lightsail seems to be the best (read: cheapest) way to fire up something little. Just a bare bones Linux instance.

- Fire up an Amazon Linux instance and note its address
- Download a key from the [AWS account page][aws_account_page] and set its permissions to `0400`
- Copy `setup.sh` over to the instance and run it




https://lightsail.aws.amazon.com/ls/webapp/account/keys



Need to install Docker Compose on the image, per instructions [here][install_docker_compose].

[install_docker_compose]: https://gist.github.com/npearce/6f3c7826c7499587f00957fee62f8ee9

## AWS Elastic Beanstalk

Install the Elastic Beanstalk CLI. The web app is a mess. On Mac OS:

```
brew update && brew install awsebcli
```

Tutorial [here](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/docker.html) is helpful. Notably, Docker deploys don't use `appspec.yml`. Also notable that AWS documentation suggests you can run a deployment with `docker-compose.yml` but I was unable to get it to work.

Also: the tutorial uses `Dockerrun.aws.json` version 1 syntax. For multiple containers, you need version 2.

Possible to convert (more or less) `docker-compose.yml` to `Dockerrun.aws.json` with `container-transform` (installed via `pip3`).
