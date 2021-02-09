const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const web3 = new Web3(ganache.provider());
const compiledFactory = require('../ethereum/build/GameFactory.json');
const compiledGame = require('../ethereum/build/Game.json');

let accounts;
let factory;
let gameAddress;
let game;

beforeEach(async () => {
    // Gives 10 accounts with 100 ethers
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth
        .Contract(JSON.parse(compiledFactory.interface))
        .deploy({
            data: compiledFactory.bytecode
        })
        .send({
            from: accounts[0],
            gas: '1000000'
        });

    await factory.methods
        .createGame(web3.utils.toWei('1', 'ether'))
        .send({
            from: accounts[0],
            gas: '1000000'
        });

    const [gameAddress] = await factory.methods
        .getDeployedGames()
        .call();

    game = await new web3.eth
        .Contract(
            JSON.parse(compiledGame.interface),
            gameAddress
        );
});

describe('Games', () => {
    it('deploys a factory and a game', () => {
        assert.ok(factory.options.address);
        assert.ok(game.options.address);
    });

    
});
