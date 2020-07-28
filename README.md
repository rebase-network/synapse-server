# Synapse Server

## Description

Synapse Server for caching cell data from CKB blockchain and providing query service.

## Installation

```bash
yarn
```

## Setup

```bash
# database
yarn pretypeorm
yarn build
yarn db:mig:r
yarn db:seed

# env
cp .env.example .env

## Running the app

# development
yarn start

# watch mode
yarn start:dev

# production mode
yarn start:prod
```

## DB commands

```bash
# generate migration
yarn db:mig:g
```

## API test

Go to `/api` to test api with swagger UI

## Test

```bash
# unit tests
yarn test

# e2e tests
yarn test:e2e

# test coverage
yarn test:cov
```
## docker-compose
Go inside of directory, cd /
Run this command docker-compose up -d

## License

[MIT licensed](LICENSE).
