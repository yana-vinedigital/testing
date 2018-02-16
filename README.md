Seatfrog Website V2
========================

Welcome to the second iteration of Seatfrog's website! Below are install and deployment instructions.
If you're making changes to anything in this repo from a configuration/dependency perspective, be sure to update this file!

Dependencies
========================

* Nodejs and NPM
  * https://nodejs.org/
* Homebrew
  * To install the dependencies: http://brew.sh/
  * `$ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`
* Imagemagick
  * `$ brew install imagemagick`

Installation
========================

Homebrew
- An easy way to install node and npm is via Homebrew. Visit http://brew.sh/ and follow instructions for your platform
- `$ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`  
- Once installed (or if already installed), open terminal and type `brew doctor` (no backticks).
- Address any issues and follow with `brew update` as required.

Nodejs and NPM
- Open the Terminal app and type `brew install node`
- Check that node is installed using `node -v`
- Check that npm is installed using `npm -v`
- To uninstall node `brew uninstall node`

Dependencies
- Navigate to the repository folder (that has package.json)
- Run `npm install` to install all dependencies (including gulp)
- Check gulp version with `gulp -v`
- You will need `4.0.0-alpha.2` or higher to build the project

Gulp
========================

Commands
- `gulp build` : build for local development and testing
- `gulp server` : will create a localhost on 8080 for testing
- `gulp default` : runs the build task then creates a server on localhost:8080, which watches for changes and rebuilds accordingly
- `gulp prod` : builds the files for production release

Deployment
========================

*IMPORTANT*
- When deploying, make sure GA account UA-ID is `UA-63649453-2`
- Also make sure the robots.txt file is set to index all

Process
- At this stage, we don't have any CI/CD in place, so all deployments are done manually
- The site is hosted on AWS, using two S3 buckets; one for seatfrog.com, and one for www.seatfrog.com
- We're also updating the old siteground hosting while we wait for all DNS records to 100% propagate
- Proceess is to redirect traffic from one bucket to the other while files are updated
- Once the update is complete, reverse the redirect and update the other bucket
- Siteground updates can be completed using FTP

Troubleshooting
========================

If `gulp build` fails due to broken packages:

```
npm outdated        # list installed versions and available updates
npm install -g npm-check-updates
ncu                 # short for 'npm-check-updates'. list modules
ncu -u              # update module versions in package.json
npm i               # short for 'npm install'. install new versions
ncu                 # check everything is fine
npm outdated 	    # check everything is fine
```

