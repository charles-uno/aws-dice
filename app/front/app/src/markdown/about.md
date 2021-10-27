## About the Model

The MTG deck [Amulet Titan](https://www.mtggoldfish.com/archetype/amulet-titan) is known for its complex play patterns.
This app presents users with sample opening hands, then shuffles the deck and solves for a sequence of plays to cast the titular [[Titan:Primeval Titan]] as quickly as possible.
Think of it like mulligan flashcards: decide for yourself whether you would keep the hand, then play it out a few times to see what the numbers say!

Sequencing is determined via exhaustive search.
Whenever the computer is faced with a choice, it tries both options and keeps whichever works out best.
For example, an experienced player can generally eyeball whether to choose land or nonland for [[Abundant Harvest]], but spelling out the logic explicitly for the computer is tedious and fragile.
Instead of worrying about strategy and synergy, the computer splits the game into two copies.
The first chooses land, the second chooses nonland, and they proceed independently from there.
If either copy ends up casting turn-three [[Primeval Titan]] down the line, it's pretty safe
to say that a human player could have done so as well.

Exhaustive search is straightforward and flexible, but also computationally demanding.
Several approximations are made in the interest of performance.
Oddball singletons like [[Boros Garrison]], [[Cavern of Souls]], and [[Vesuva]] are excluded.
[[Colorless:Radiant Fountain]] [[lands:Sunhome, Fortress of the Legion]] are all represented by [[Wastes]].
[[Nongreen:Valakut, the Molten Pinnacle]] [[tapped:Bojuka Bog]] [[lands:Tolaria West]] are all represented by [[Bojuka Bog]] (no transmuting allowed).
These approximations can make opening hands look a bit odd, but the resulting numbers turn out to be nearly identical.

That said, please don't expect the computer to teach you good sequencing!
If it's possible to cast [[Primeval Titan]] on turn three, this model is guaranteed to find a way to do so.
But there are often several different ways to get there.
There's no guarantee the computer will pick the best one.
Several corrections are included to suppress non-human play patterns, but from time to time it'll still choose a "solution" that's needlessly bizarre or reckless.
Consider it a starting point, not an authority.

Below is the list used by this app.
Don't worry too much about a difference here or there.
Considering similar cards together helps the model run faster.
Numbers look pretty much the same if (for example) we swap out an [[Explore]] for an [[Azusa:Azusa, Lost but Seeking]].

| N | Card Name                                                                               |
|--:|:----------------------------------------------------------------------------------------|
| 4 | [[Abundant Harvest]]                                                                    |
| 4 | [[Amulet of Vigor]]                                                                     |
| 4 | [[Arboreal Grazer]]                                                                     |
| 4 | [[Dryad of the Ilysian Grove]]                                                          |
| 4 | [[Explore]]                                                                             |
| 4 | [[Primeval Titan]]                                                                      |
| 4 | [[Summoner's Pact]]                                                                     |
| 5 | [[Bojuka Bog]] (includes [[Tolaria West]] and [[Valakut:Valakut, the Molten Pinnacle]]) |
| 4 | [[Castle Garenbrig]]                                                                    |
| 6 | [[Forest]] (includes [[Breeding Pool]] and [[Misty Rainforest]])                        |
| 8 | [[Simic Growth Chamber]] (includes [[Gruul Turf]], etc)                                 |
| 4 | [[Urza's Saga]]                                                                         |
| 5 | [[Wastes]] (includes [[Radiant Fountain]], etc)                                         |

## Implementation

This app uses a React front end and a Go back end behind an Nginx load balancer.
Each component is built into its own container; containers are managed using Docker Compose.
Updates are deployed to AWS on commit via GitHub Actions.

Source code is available [here](https://github.com/charles-uno/aws-practice/blob/main/README.md).
Front-end, back-end, load balancer, and deployment are all contained in the same repo.
The back-end model is a stripped-down version from my previous work [here](https://charles.uno/amulet-simulation) and [here](https://charles.uno/valakut-simulation).

## Fine Print

This page &copy; Charles Fyfe 2021, along with the source code linked above.
Card names and images owned by [Wizards of the Coast](https://magic.wizards.com).
This site is not affiliated.
