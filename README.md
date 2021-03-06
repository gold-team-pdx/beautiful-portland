# Beautiful Portland 
Beautiful Portland is a nonprofit with a mission to distribute food to Portlanders experiencing food insecurity. Now the nonprofit Beautiful Portland needs a website to better coordinate volunteers in their mission to provide hot meals to the PDX residents who need them. Potential features would include a calendar for volunteer shift signups, a volunteer database, and blast emails.
<!--project description get from gold team selection presentation-->

## Project Sponsors

#### Beautiful Portland
Jennifer Skyler & Susan Hess Logeais
<!--title description get from sponsor presentation-->

## Team Letter F
We as a team are extremely excited about our project to develop a website for the local non-profit Beautiful Portland. We recognize what a special opportunity this is for us to not only grow as developers, but also support an extremely worthy cause. To that end, we intend to deliver a product that will help Beautiful Portland focus their efforts on aiding those in need. We will further improve our abilities in software development, from requirements gathering to deployment and everything in between. We will learn to work with outside stakeholders, and navigate the non-technical issues surrounding software products. We will learn to quickly adopt new technologies and integrate them into our project when needed. Most importantly, we will learn from each other, and work as a team to fulfill our stated goals.
We would like to thank Portland State University, as well as our sponsor Beautiful Portland, for this opportunity.

&emsp; &emsp; &mdash; Gold Team

## Project Participants
Team Lead:
* William Schmid

Team Members:
* David Gilmore
* Peyton Holbert
* Bailee Johnstone
* Colin McCoy
* Eduardo Robles
* Ronnie Song

## Link
[GitHub Repository](https://github.com/gold-team-pdx/beautiful-portland)

## pre-reqs

install:

- nodejs, latest
- yarn, latest
- docker and docker compose, latest

## installing docker

### Windows/MacOS

For these platforms, you should just need to install docker desktop - this should include docker compose

### Linux

For Linux, you'll need to install docker and docker compose separately. Beware that on Ubuntu at least, the
default docker apt package is *not* what you want; use docker.io with apt instead (`sudo apt-get install docker.io`).
See https://docs.docker.com/compose/install/ and https://docs.docker.com/install/linux/linux-postinstall/ for
instructions on installing docker compose and setting docker to be runnable without root (highly recommended
for the sake of our build tools).

## getting started

- cd `/path/to/beautiful-portland`
- `yarn bootstrap` to install and link all dependencies and child dependencies

### adding dependencies

- Decide whether it should live in the top level, or in only api or ui
- cd to packages/api or packages/ui depending on your decision
- yarn add {package}

## yarn scripts

- If you've just cloned the repo to a new development environment, or you want 
  a completely fresh build, run `yarn build`. Beware that this will also perform
  a `yarn clean`, wiping out any persistent data in your local s3 buckets.
- If you just want to pull down all the dependencies, run `yarn bootstrap`. 
- To start a local dev build, run `yarn start`.
- To avoid consuming resources on your machine when you're done running a dev build,
  run `yarn stop` to shut down the docker container.

## precommit hooks

For code consistency, we have a very basic `eslint` config set to scan and fix with the 
yarn script `yarn lint`. For convenience, this script is run as a precommit hook,
and all changes are staged in `git`. However, be aware that this means that any files
that you do not want to commit upstream should be properly gitignored or stashed 
prior to running `git commit`, lest they be staged by the precommit hook. You should still
`git add` your changed files ahead of time, or `git` may abandon the commit because
it doesn't see any changes.

The precommit also runs a 'yarn audit --fix', in an attempt to stay on top of any known
vulnerabilities in our npm packages. This is a good precaution, but we should still be
vigilant to any vulnerability warnings we might see in github or elsewhere, as `yarn audit`
is not perfect.

## docker container

The local dev build includes a docker container that emulates an aws s3 bucket. 
You can access this bucket at http://localhost:9001. The access key is `b@dpass`
and the secret key is `r3alb@dpass`. Any files you upload to this bucket will
persist, even if you shut down the docker container, until you run a `yarn clean`
or `yarn build`. If you have run a `yarn clean` or you've never run `yarn build`, 
you will need to run `yarn build` once to initialize the bucket.

## testing environment

The test webpage is at http://ec2-34-220-185-151.us-west-2.compute.amazonaws.com. 
The jenkins sever is at http://34.211.150.250:8080.
