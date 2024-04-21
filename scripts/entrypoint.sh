#!/bin/bash

echo 'Waiting for 15s for database to be ready...';

sleep 15;

npm run db:migrate

echo "yes" | npx tsx prisma/seeds/index.ts

if [ $? -eq 0 ]; then
    echo "#### Database seeding is succeeded. ####"
else
    echo "#### Seed command failed. ####"
fi

npm run db:studio &
db_studio_exit_status=$?

if [ $db_studio_exit_status -eq 0 ]; then
    echo "#### Prisma studio is starting... ####"
else
    echo "#### Prisma studio failed with exit status $db_studio_exit_status. ####"
fi

npm run start