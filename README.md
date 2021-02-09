# Decentralized Teen Patti

A decentralized web app where you can play the card game _Teen Patti_.

## Summary

- [Getting Started](README.md#getting-started)
- [Dependencies](README.md#dependencies)
- [Sequence of Events](README.md#sequence-of-events)
- [Game Status](README.md#game-status)
- [Tests](README.md#tests)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to install either `npm` or `yarn` to build this project. Here are the link to resources to get started.

- [`npm`](https://www.npmjs.com/get-npm)
- [`yarn`](https://classic.yarnpkg.com/en/docs/install/#windows-stable)

### Installing

First of all clone the repository using the following command.

```bash
git clone https://github.com/utkarshg6/3patti-dapp.git
```

#### Installing through `npm`

In case you are installing through `npm` follow the instructions below. If you are installing through `yarn` then jump ahead to [installation through `yarn`.](README.md#installation-through-yarn)

```bash
npm i
```

#### Installation through `yarn`

To install the dependencies you can do it by using the following command.

```bash
yarn
```

### Compiling Contracts

This command will recreate the `build` folder inside the `ethereum` and will create JSON files for the compiled Contract of only `Game.sol`.

```zsh
npm run compile
```

### Running Tests

This command will run all tests for the project through mocha.

```zsh
npm run test
```

## Dependencies

You may find the dependencies inside the [`package.json`](package.json) file.

## Sequence of Events

1. Factory Initialization
2. Game Contract Initialization (with minimum balance and manager)
3. Players enter the game.
4. Game is started by the Manager.
5. Game is saved by the Manager.
6. Game is Ended by the Manager.

## Game Status

| Has Game Ended | Has Game Started |        Status        |
| :------------: | :--------------: | :------------------: |
|    `false`     |     `false`      |   Game Not Started   |
|    `false`     |      `true`      |       Playing        |
|     `true`     |     `false`      | Not Played but Ended |
|     `true`     |      `true`      |   Played and Ended   |

## Tests

1. deploys a factory and a game
2. marks caller as the game manager
3. allows users to enter the game and mark them as players along with the correct amount
4. requires a minimum amount to enter
5. allows the manager to start a game
6. does not allows anyone else to start a game
7. allows the manager to save a game
8. allows the manager to end a game
