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
echo "PATH IS $PATH"

apt-get update && apt-get install -y tzdata libpq-dev unzip xvfb libnss3 libgconf-2-4 libxss1 fonts-liberation

gem install bundler
bundle install
npm install
yarn install

cp config/database.yml.example config/database.yml
cp .env.sample .env

# Install chrome and chrome driver
if [ ! -f /usr/bin/google-chrome ]; then
  curl -sS -o - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add
  echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list
  apt-get -y update
  apt-get -y install google-chrome-stable
fi

if [ ! -f /opt/bin/chromedriver ]; then
  CHROME_DRIVER_VERSION=`curl -sS chromedriver.storage.googleapis.com/LATEST_RELEASE`
  wget -N http://chromedriver.storage.googleapis.com/$CHROME_DRIVER_VERSION/chromedriver_linux64.zip -P /tmp/
  mkdir -p /opt/bin
  unzip -o /tmp/chromedriver_linux64.zip -d /opt/bin
  rm /tmp/chromedriver_linux64.zip
  chmod a+x /opt/bin/chromedriver
fi 

if [ ! -f /opt/bin/chromedriver-bin ]; then
  mv /opt/bin/chromedriver /opt/bin/chromedriver-bin
  echo "#!/bin/bash" > /opt/bin/chromedriver
  echo "/opt/bin/chromedriver-bin --whitelisted-ips='' \$*" >> /opt/bin/chromedriver
  chmod a+x /opt/bin/chromedriver
fi 

if [ ! -f /usr/bin/google-chrome-binary ]; then 
  mv /usr/bin/google-chrome /usr/bin/google-chrome-binary
  echo "#!/bin/bash" > /usr/bin/google-chrome
  echo "/usr/bin/google-chrome-binary --no-sandbox \$*" >> /usr/bin/google-chrome
  chmod a+x /usr/bin/google-chrome
fi

export PATH="$PATH:/opt/bin"
 echo "PATH IS $PATH"

bundle exec rake --trace fulcrum:setup db:setup
xvfb-run bundle exec rake travis
bundle exec codeclimate-test-reporter
