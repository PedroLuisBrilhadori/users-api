## Description

A user-api using:

- [Nest](https://github.com/nestjs/nest)
- [MongoDB](https://www.mongodb.com/)
- [RabbitMQ](https://www.rabbitmq.com/)

## Pre-Requisites

- [docker](https://docs.docker.com/get-docker/)
- [docker compose](https://docs.docker.com/compose/)

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
yarn docker:dev

# production
yarn docker:prod

```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn docker:e2e

# test coverage
$ yarn test:cov
```
