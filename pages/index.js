import React, { Component } from 'react';
// import ethereum from "../ethereum/MetaMask";
import { Card, Button } from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Layout from '../components/layout';

class ComponentIndex extends Component {

    static async getInitialProps() {
        // Only a Next.js feature and not related to React
        const games = await factory.methods.getDeployedGames().call();

        return { games: games };
    }

    renderGames() {
        const items = this.props.games.map((address) => {
            return {
                header: address,
                description: <a>View Game</a>,
                fluid: true,
            };
        });

        return <Card.Group items={items} />;
    }

    // getAccounts = async () => {
    //     const accounts = await ethereum.request({ method: 'eth_accounts' })
    //     console.log("From Index.js:", accounts[0] || "No Account Received");
    // }

    render() {
        return (
            <Layout>
                <div>
                    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"></link>
                    <h3>Games</h3>
                    {this.renderGames()}
                    <Button
                        content="New Game"
                        icon="add circle"
                        primary
                    />
                </div>
            </Layout>
        );
    }
}

export default ComponentIndex;
