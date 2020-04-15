# On production or stage environments however you actually often want to auto run your migration scrips before starting your API server after/on deploy.

# env-variable RUN_MIGRATIONS=<0|1>to control if the migration should be auto run or not.

#!/bin/bash
set -e
set -x
if [ "$RUN_MIGRATIONS" ]; then
  echo "RUNNING MIGRATIONS";
  npm run typeorm:migration:run
fi
echo "START SERVER";
npm run start:prod