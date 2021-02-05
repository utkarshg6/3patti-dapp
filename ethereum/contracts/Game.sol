pragma solidity ^0.4.17;

contract GameFactory {
    address[] public deployedGames;

    function createGame(uint256 minimum) public {
        address newGame = new Game(minimum, msg.sender);
        deployedGames.push(newGame);
    }

    function getDeployedGames() public view returns (address[]) {
        return deployedGames;
    }
}

contract Game {
    address manager;
    uint256 minimumAmount;
    address[] public players;
    mapping(address => uint256) public playersMap;

    modifier restricted() {
        require(playersMap[msg.sender] >= minimumAmount);
        _;
    }

    function Game(uint256 minimum, address creator) public {
        minimumAmount = minimum;
        manager = creator;
    }

    function enter() public payable {
        require(msg.value >= minimumAmount);

        players.push(msg.sender);
        playersMap[msg.sender] = msg.value;
    }

    function getPlayers() public view returns (address[]) {
        return players;
    }

    function endGame() public restricted {
        for (uint256 i = 0; i < players.length; i++) {
            address player = players[i];
            player.transfer(playersMap[player]);
            playersMap[player] = 0;
        }
    }
}
