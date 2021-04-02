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

This app uses a React frontend and a Go backend behind an nginx proxy. Each
element is packaged into a Docker container and deployed to
[AWS LightSail][AWS_lightsail] via Docker Compose.

The Go package used by the backend is published [here][mtgserver]. It's a
stripped-down version of the model I wrote up [a while back][amulet_article].

[aws_lightsail]: https://lightsail.aws.amazon.com/
[mtgserver_readme]: https://github.com/charles-uno/mtgserver/blob/main/README.md
[amulet_article]: https://charles.uno/amulet-simulation/

## Usage

To run this code locally, use:
```
./deploy.sh localhost
```
Note that you must be logged in to Docker for this to work, and your Docker
username must match what's listed in `deploy.sh`.

To deploy to AWS, instead use:
```
./deploy.sh $ADDRESS $KEYFILE
```
Where `$ADDRESS` is the address of the instance you want to deploy to, and
`$KEYFILE` is a private key that grants passwordless access to that address.
(Note: AWS does this automatically.)

## HTTPS and SSL

We're set up to do HTTPS via Certbot in the nginx container. It seems to work
internally -- the server can talk to itself on port 443 via HTTPS. But ingress
is blocked. Looks like AWS prefers to have a load balancer set up in the GUI
(yuck). More information:

- [SSL/TLS certificates in Lightsail](https://lightsail.aws.amazon.com/ls/docs/en_us/articles/understanding-tls-ssl-certificates-in-lightsail-https)
- [Instance firewalls in Amazon Lightsail](https://lightsail.aws.amazon.com/ls/docs/en_us/articles/understanding-firewall-and-port-mappings-in-amazon-lightsail#specifying-ports)
