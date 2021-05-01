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

To deploy to AWS, use:
```
./deploy.sh $ADDRESS $KEYFILE
```
Where `$ADDRESS` is the address of the instance you want to deploy to, and
`$KEYFILE` is a private key that grants passwordless access to that address,
which AWS provides under the [Account page][aws_account]. To use HTTPS, you'll
also need to [add a firewall rule][aws_firewall] to expose port 443.

Note: in order to push the Docker images, you'll need to be logged into Docker
(`docker login`) and your Docker username must match what's listed in
`deploy.sh`.

[aws_account]: https://lightsail.aws.amazon.com/ls/webapp/account/keys
[aws_firewall]: https://aws.amazon.com/blogs/compute/enhancing-site-security-with-new-lightsail-firewall-features/

It's also possible to "deploy" locally, via:
```
./deploy.sh localhost
```
Local deployment does the same build (so you must still be logged in to Docker)
but does not touch your deployed instance. It also runs Docker Compose
interactively for verbose output.


## HTTPS and SSL

AWS suggests setting up a load balancer in the GUI to enable HTTPS. We're
working on getting Certbot running alongside nginx instead. More information:

- [SSL/TLS certificates in Lightsail](https://lightsail.aws.amazon.com/ls/docs/en_us/articles/understanding-tls-ssl-certificates-in-lightsail-https)
- [Certbot Rate Limits](https://letsencrypt.org/docs/rate-limits/)
