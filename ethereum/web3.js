import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
    // We are in the Browser and MetaMask is installed
    web3 = new Web3(window.ethereum);
} else {
    // We are on the server *OR* the user is not running MetaMask
    const provider = new Web3.providers.HttpProvider(
        'https://rinkeby.infura.io/v3/4c9dbcebabde4043b654f13bbc6e9703'
    );

    web3 = new Web3(provider);
}

export default web3;
