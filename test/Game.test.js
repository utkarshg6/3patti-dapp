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

    [gameAddress] = await factory.methods
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

    it('marks caller as the game manager', async () => {
        const manager = await game.methods
            .manager()
            .call();
        assert.equal(manager, accounts[0]);
    });

    it('allows users to enter the game and mark them as players along with the correct amount', async () => {
        const account = accounts[1];
        const amount = web3.utils.toWei('1.1', 'ether');

        const transaction = await game.methods
            .enterGame()
            .send({
                from: account,
                value: amount,
                gas: '1000000'
            });

        const isPlaying = await game.methods
            .isPlaying(account)
            .call();

        const playerAddress = await game.methods
            .players(0)
            .call();

        const amountWagered = await game.methods
            .wageredAmount(account)
            .call();

        assert.ok(transaction);
        assert.ok(isPlaying);
        assert.equal(playerAddress, account);
        assert.equal(amountWagered, amount);
    });

    it('requires a minimum amount to enter', async () => {
        const account = accounts[1];
        const amount = web3.utils.toWei('0.9', 'ether');

        try {
            await game.methods
                .enterGame()
                .send({
                    from: account,
                    value: amount,
                    gas: '1000000',
                })
            assert(false);
        } catch (error) {

            assert(error);
            const isPlaying = await game.methods
                .isPlaying(account)
                .call();

            assert.ok(!isPlaying);
        }
    });

    it('allows the manager to start a game', async () => {
        const managerAccount = accounts[0];
        const account_1 = accounts[1];
        const account_2 = accounts[2];
        const amount = web3.utils.toWei('1.1', 'ether');

        await game.methods
            .enterGame()
            .send({
                from: account_1,
                value: amount,
                gas: '1000000'
            });

        await game.methods
            .enterGame()
            .send({
                from: account_2,
                value: amount,
                gas: '1000000'
            });

        const gameInitialStatus = await game.methods
            .gameStatus()
            .call();

        await game.methods
            .startGame()
            .send({
                from: managerAccount,
                gas: '1000000'
            })

        const gameFinalStatus = await game.methods
            .gameStatus()
            .call();

        assert.equal(gameInitialStatus, "Game not Started");
        assert.equal(gameFinalStatus, "Playing");

    });

    it('does not allows anyone else to start a game', async () => {
        // const managerAccount = accounts[0];
        const account_1 = accounts[1];
        const account_2 = accounts[2];
        const amount = web3.utils.toWei('1.1', 'ether');

        await game.methods
            .enterGame()
            .send({
                from: account_1,
                value: amount,
                gas: '1000000'
            });

        await game.methods
            .enterGame()
            .send({
                from: account_2,
                value: amount,
                gas: '1000000'
            });

        const gameInitialStatus = await game.methods
            .gameStatus()
            .call();

        try {
            await game.methods
                .startGame()
                .send({
                    from: account_1,
                    gas: '1000000'
                })
            assert(false);
        } catch (error) {
            assert(error);
        }

        const gameFinalStatus = await game.methods
            .gameStatus()
            .call();

        assert.equal(gameInitialStatus, "Game not Started");
        assert.equal(gameFinalStatus, "Game not Started");

    });

    it('allows the manager to save a game', async () => {
        const managerAccount = accounts[0];
        const account_1 = accounts[1];
        const account_2 = accounts[2];
        const amount = web3.utils.toWei('1.1', 'ether');

        await game.methods
            .enterGame()
            .send({
                from: account_1,
                value: amount,
                gas: '1000000'
            });

        await game.methods
            .enterGame()
            .send({
                from: account_2,
                value: amount,
                gas: '1000000'
            });

        await game.methods
            .startGame()
            .send({
                from: managerAccount,
                gas: '1000000'
            })

        await game.methods
            .saveGame([account_1, account_2], [web3.utils.toWei('2', 'ether'), web3.utils.toWei('.2', 'ether')])
            .send({
                from: managerAccount,
                gas: '1000000'
            });

        account_1_balance = await game.methods
            .wageredAmount(account_1)
            .call();

        account_2_balance = await game.methods
            .wageredAmount(account_2)
            .call();

        assert.equal(account_1_balance, web3.utils.toWei('2', 'ether'));
        assert.equal(account_2_balance, web3.utils.toWei('.2', 'ether'));
    });

    it('allows the manager to end a game', async () => {
        const managerAccount = accounts[0];
        const account_1 = accounts[1];
        const account_2 = accounts[2];
        const amount = web3.utils.toWei('1.1', 'ether');

        await game.methods
            .enterGame()
            .send({
                from: account_1,
                value: amount,
                gas: '1000000'
            });

        await game.methods
            .enterGame()
            .send({
                from: account_2,
                value: amount,
                gas: '1000000'
            });

        await game.methods
            .startGame()
            .send({
                from: managerAccount,
                gas: '1000000'
            })

        await game.methods
            .saveGame([account_1, account_2], [web3.utils.toWei('2', 'ether'), web3.utils.toWei('.2', 'ether')])
            .send({
                from: managerAccount,
                gas: '1000000'
            });

        await game.methods
            .endGame()
            .send({
                from: managerAccount,
                gas: '1000000'
            });

        const account_1_finalBalance = await web3.eth.getBalance(account_1);
        const account_2_finalBalance = await web3.eth.getBalance(account_2);

        assert.ok(account_1_finalBalance > account_2_finalBalance);
    });

});
