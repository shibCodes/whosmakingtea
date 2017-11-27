#!/usr/bin/env bash

# Uses the vagrant-triggers plugin (vagrant plugin install vagrant-triggers)
# Is triggered from Vagrantfile config.trigger.before statement

sudo mkdir -p /var/www/_dbbackups
echo "Backing up db..."

# Migrate older versions back
if [ -e /var/www/_dbbackups/db_backup.sql ]
  then
  	thedate=$(date +"%Y-%m-%d_%s")
    sudo cp /var/www/_dbbackups/db_backup.sql /var/www/_dbbackups/db_backup_${thedate}.sql
fi

# Now save the latest version
sudo pg_dump -U root --clean scotchbox > /var/www/_dbbackups/db_backup.sql
sudo chmod 773 /var/www/_dbbackups/db_backup.sql

# Done
echo "DB backup done."