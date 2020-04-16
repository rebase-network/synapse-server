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
yarn start:dev:db
yarn typeorm:migration:run
yarn start:dev:db:seed

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
yarn typeorm:migration:generate
```

## Test

```bash
# unit tests
yarn test

# e2e tests
yarn test:e2e

# test coverage
yarn test:cov
```

## License

[MIT licensed](LICENSE).
