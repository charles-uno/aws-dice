# MTG Flashcards

The MTG deck [Amulet Titan][amulet_mtggoldfish] is known for its complex play
patterns in the first few turns of the game. This app presents users with
sample opening hands, then solves for a sequence of plays to cast the titular
Titan as quickly as possible. Users can run the same opening hand back multiple
times to get a sense for how things tend to play out.

[amulet_mtggoldfish]: https://www.mtggoldfish.com/archetype/amulet-titan

## Implementation

This app uses a React frontend and a Go backend behind an nginx proxy. Each
element is packaged into a Docker container; those containers are managed using
Docker Compose. Updates are deployed to [AWS LightSail][AWS_lightsail] on
commit via GitHub Actions. The backend is a slimmed-down version of the one I
wrote up [a while back][amulet_article].

[aws_lightsail]: https://lightsail.aws.amazon.com/
[amulet_article]: https://charles.uno/amulet-simulation/

## Setup

To deploy to AWS, you need an instance, of course. Grab the IP address and SSH
key from your [AWS account][aws_account] and add them to the repo as secrets
named `AWS_ADDRESS` and `AWS_KEY`. You'll also need to add HTTPS access to your
[AWS network settings][aws_firewall].

[aws_account]: https://lightsail.aws.amazon.com/ls/webapp/account/keys
[aws_firewall]: https://aws.amazon.com/blogs/compute/enhancing-site-security-with-new-lightsail-firewall-features/

If you want to develop the front end on your machine directly (recommended)
you'll need to [install ReactJS][install_react].

[install_react]: https://reactjs.org/docs/getting-started.html

## Workflow

To tinker with the front end, you can run it in development mode on your local
machine. Running directly on the machine (rather than inside a container)
allows changes to show up automatically while you work, rather than needing to
re-build repeatedly.
```
cd front/app
npm start
```
To run the whole app, we need to build our images and push them to `docker.io`:
```
export DOCKER_USER=...
export DOCKER_PASS=...
scripts/build.sh
```
Then pull them back down with Docker Compose. Notably, `DOCKER_USER` above must
match the username in `docker-compose.yml`
```
docker-compose pull
docker-compose up
```
A heads up, though: we're not yet set up to handle branches. Docker Compose
will pull down whatever image was pushed most recently. If you need to run
`docker-compose pull` manually in production, make sure that the `main` branch
is the last one to have been built.

## HTTPS and SSL

HTTPS is a work in progress.

AWS suggests setting up a load balancer in the GUI to enable HTTPS. We're
working on getting Certbot running alongside nginx instead. More information:

- [SSL/TLS certificates in Lightsail](https://lightsail.aws.amazon.com/ls/docs/en_us/articles/understanding-tls-ssl-certificates-in-lightsail-https)
- [Certbot Rate Limits](https://letsencrypt.org/docs/rate-limits/)
