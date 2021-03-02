# AWS Practice

Deploying some code to AWS!

For this to work, you have to be logged into docker. The login username also must match the username provided in `build.sh`.
```
docker login
```

Also: install the Elastic Beanstalk CLI. The web app is a mess. On Mac OS:
```
brew update && brew install awsebcli
```


Tutorial [here](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/docker.html) is helpful. Notably, Docker deploys don't use `appspec.yml`. Also notable that AWS documentation suggests you can run a deployment with `docker-compose.yml` but I was unable to get it to work.

Also: the tutorial uses `Dockerrun.aws.json` version 1 syntax. For multiple containers, you need version 2.

Possible to convert (more or less) `docker-compose.yml` to `Dockerrun.aws.json` with `container-transform` (installed via `pip3`). 
