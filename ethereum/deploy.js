const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/GameFactory.json');

const provider = new HDWalletProvider(
    'annual bar actual payment beach pumpkin shop tone message bunker put lamp',
    'https://rinkeby.infura.io/v3/4c9dbcebabde4043b654f13bbc6e9703',
    1
)

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account', accounts[0]);

    const result = await new web3.eth
        .Contract(JSON.parse(compiledFactory.interface))
        .deploy({
            data: compiledFactory.bytecode
        })
        .send({
            from: accounts[0],
            gas: '1000000'
        })

    console.log("Contract deployed to", result.options.address);
};

deploy();

// Attempting to deploy from account 0x17403D9cb75F9A55232D10Ea0066821035c21852
// Contract deployed to 0x9E8f844dc81e212461096EA557C41d4d93c3504f
