# CKB Cache Layer

## Description

CKB Cache Layer is used as the cache layer of [Synapse extension](https://github.com/rebase-network/synapse-extension), it caches cell and block data from CKB blockchain and providing query service.


## Local setup
If you want to use it for local development with Synapse extension.

1. Start ckb node and miner

https://docs.nervos.org/docs/basics/guides/devchain

2. Start ckb-cache-layer (this project)

```bash
git clone git@github.com:rebase-network/ckb-cache-layer.git
yarn
cp .env.example .env
yarn pretypeorm
docker-compose up -d
yarn db:mig:g
yarn db:mig:r
yarn start:dev
```

You will see the following logs if you are running successfully:
```bash
log:
updateBlockInfo: 37.671ms
****************** End block 1 ******************
updateBlockInfo: 26.848ms
****************** End block 2 ******************
```

## Deploy to production

```bash
cp .env.example .env
yarn pretypeorm
docker-compose up -d
yarn db:mig:g
yarn db:mig:r
yarn build
yarn start:prod
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

## License

[MIT licensed](LICENSE).
