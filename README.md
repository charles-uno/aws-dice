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


## Next Steps

- Add a nice popup (or something) for an "about" section.
- Update the copyright to make it clear that WOTC owns the images! Look at what Scryfall does.
- Make the deck list visible.
- Put the graph above the play details. Probably want to move up the outcome as well. Maybe hide the play details by default?

---

Gonna put this under a "read more" button somewhere

### About the Model

The computer uses an exhaustive search algorithm to consider all possible
sequences of legal plays. Whenever it's presented with a choice, it clones the
whole game and tries all options simultaneously. Exhaustive search is
computationally demanding, but it's also straightforward, flexible, and
guaranteed to cast Primeval Titan on the earliest possible turn.

For example, an experienced player can generally eyeball whether to choose land
or nonland for Abundant Harvest. But spelling out that choice explicitly for
the computer would be tedious and fragile -- a calculation based on what turn
it is, what's in our hand, and even the contents of the deck. Instead of all
that, the computer makes two clones of the game. The first chooses land, the
second chooses nonland, and they proceed independently from there. If either
clone ends up casting turn-three Primeval Titan down the line, it's pretty safe
to say that a human player could have done so as well.

That said, please don't expect the computer to teach you good sequencing! If
it's possible to cast Primeval Titan on turn three, the computer is guaranteed
to find a way to do so. But there are often several different ways to get
there, and there's no guarantee the computer will pick the best one.



It's notorious for skipping "unnecessary" land drops and casting extra copies of Summoner's Pact.




Computer doesn't know the difference between a good line and a nonsense line that gets there on the same turn.
