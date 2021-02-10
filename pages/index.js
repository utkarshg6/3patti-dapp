import React, { Component } from 'react';
// import ethereum from "../ethereum/MetaMask";
import factory from '../ethereum/factory';

class ComponentIndex extends Component {

    // getAccounts = async () => {
    //     const accounts = await ethereum.request({ method: 'eth_accounts' })
    //     console.log("From Index.js:", accounts[0] || "No Account Received");
    // }

    async componentDidMount() {
        const games = await factory.methods.getDeployedGames().call();

        console.log(games);
    }

    render() {
        return <div>Games Index!</div>
    }
}

export default ComponentIndex;
