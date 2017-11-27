#!/usr/bin/env bash

# Uses the vagrant-triggers plugin (vagrant plugin install vagrant-triggers)
# Is triggered from Vagrantfile config.trigger.before statement

if [ -e /var/www/_backup/db_backup.sql ]
  then
    sudo psql -U root -d scotchbox -f /var/www/_backup/db_backup.sql
    echo "Imported db!"
fi