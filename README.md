# Rails React Recipe
Simple example of a Ruby on Rails web application with a React frontend where you can View, Create and Delete recipes.

This [tutorial](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-ruby-on-rails-project-with-a-react-frontend "DigitalOcean - How to set up a Ruby on Rails project with a React frontend") was used as a guide with initial setup.

The functionality has been extended beyond the tutorial to include editing a recipe.

## Set Up
### Prerequisites
* Ubuntu 18.04
* [Node.js and npm](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-18-04 "How to install Node.js on Ubuntu 18.04")
* [Yarn](https://yarnpkg.com/en/docs/install#debian-stable)
* [Ruby v2.6.3 Rails v5.2.3](https://www.digitalocean.com/community/tutorials/how-to-install-ruby-on-rails-with-rbenv-on-ubuntu-18-04 "How to install Ruby on Rails with rbenv on Ubuntu 18.04")
* PostgreSQL [Follow steps 1 and 2](https://www.digitalocean.com/community/tutorials/how-to-use-postgresql-with-your-ruby-on-rails-application-on-ubuntu-18-04)

**Note your PostgreSQL role name should match your Ubuntu username**

### Install Frontend Dependencies
* React Router
* Bootstrap
* jQuery
* Popper
```
$ yarn add react-router-dom bootstrap jquery popper.js
```
You should see the above dependcies in `~/rails_react_reciple/package.json`

### Database Set Up
If you followed the attached guide on how to install PostgreSQL you should have made a super user and an associated password. We will need to alter `~/rails_react_reciple/config/database.yml` so that Rails will use your recently created PostgreSQL role.

First we will store this password in an environment variable
```
$ echo 'export RAILS_REACT_RECIPE_DATABASE_PASSWORD="PostgreSQL_Role_Password"' >> ~/.bashrc
$ source ~/.bashrc
```

Now we will tell Rails about your user and password by editing `~/rails_react_reciple/config/database.yml`. Look for the following line "`pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>`" and underneath you will enter the following (replacing the username *claire* with your username)
```yaml
username: claire
password: <%= ENV['RAILS_REACT_RECIPE_DATABASE_PASSWORD' %>
```

It's time to create the databases
```
$ rails db:create
```

You should see the following output
```
Created database 'rails_react_recipe_development'
Created database 'rails_react_recipe_test'
```

Run migrations
```
$ rails db:migrate
```

Seed database with initial 9 recipes (optional). It will run the code found in `~/rails_react_recipe/db/seeds.rb`. Feel free to skip this or enter your own data to be seeded.
```
$ rails db:seed
```

## Run
To run your server locally
```
$ rails server --binding=127.0.0.1
```

By default the application will listen on port 3000 so to see the application running go to http://localhost:3000

To shut down the server use `Ctrl-C`

**Note**

If you see the following error `FATAL: Listen error: unable to monitor directories for changes.` when trying to spin up the server, you will need to alter your system limit on the number of files that your machine can monitor
```
$ echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

## Usage
The application is a simple example of connecting a React frontent with a Ruby on Rails application.

You may now View, Create, Edit and Delete recipes.
You may also upload images per recipe.