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
cd app/front/app
npm start
```

To run the whole app, you'll need to have Docker and Docker Compose installed.
The commands below will imitate the GitHub Actions deployment locally:
```
make local
make prep
make build
make deploy
make test
make promote
```

## Blue Green Deployment

These commands can then be repeated to see blue and green deployments running in
parallel.

## To Do

- Handling for adding keys to `.env`
- Update the "read more" to talk about blue/green deployment.
- Store "read more" as text or Markdown. Parse autocard links dynamically.
- Refactor the React code into multiple files for legibility and maintenance.
- Add API tests, probably in Tavern.
- Add React tests. Unit for sure, integration would be nice too.
- Add a [badge][status_badge] for workflow status.
- Get HTTPS up and running, probably via [Certbot][certbot].


[status_badge]: https://docs.github.com/en/actions/monitoring-and-troubleshooting-workflows/adding-a-workflow-status-badge
- [certbot](https://letsencrypt.org/docs/rate-limits/)
