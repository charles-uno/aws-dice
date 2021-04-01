# MTG Flashcards

The MTG deck [Amulet Titan][amulet_mtggoldfish] is known for its complex play
patterns in the first few turns of the game. This app presents users with
sample opening hands, then solves for the ideal sequence of plays to cast the
titular titan as quickly as possible. Users can run the same opening hand back
multiple times to get a sense for how things tend to play out.

[amulet_mtggoldfish]: https://www.mtggoldfish.com/archetype/amulet-titan

For more information about the underlying model, see my write-up from
[a while back][amulet_article].

## Implementation

This app uses a React frontend and a Go backend behind an nginx proxy. Each element is packaged into a Docker container and deployed to AWS LightSail via Docker Compose.

The Go package used by the backend is published [here][mtgserver]. It's a stripped-down version of the model I wrote up [a while back][amulet_article].

[mtgserver_readme]: https://github.com/charles-uno/mtgserver/blob/main/README.md
[amulet_article]: https://charles.uno/amulet-simulation/

## Usage

To run this code yourself, follow the steps below:

1. Get yourself a server to run on. I use [AWS Lightsail][aws_lightsail]. Also get a private key set up for passwordless access to that server.







[aws_lightsail]: https://lightsail.aws.amazon.com/


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
