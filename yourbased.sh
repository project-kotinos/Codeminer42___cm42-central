#!/usr/bin/env bash
set -ex
export DEBIAN_FRONTEND=noninteractive
export CI=true
export TRAVIS=true
export CONTINUOUS_INTEGRATION=true
export USER=travis
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
export RAILS_ENV=test
export RACK_ENV=test
export MERB_ENV=test

#install:
bundle install
npm install
npm install --global yarn
yarn install

#before_script:
cp config/database.yml.example config/database.yml
cp .env.sample .env
ln -s /usr/lib/chromium-browser/chromedriver ~/bin/chromedriver
"export DISPLAY=:99.0"
"sh -e /etc/init.d/xvfb start"
"bundle exec rake --trace fulcrum:setup db:setup"

#script:
"bundle exec rake travis"
"bundle exec codeclimate-test-reporter"
