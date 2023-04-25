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
$ yarn docker:dev
```

## Stop the app

```bash
$ yarn docker:dev:remove
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn docker:e2e

# stop e2e tests
$ yarn docker:e2e:remove

# test coverage
$ yarn test:cov
```
