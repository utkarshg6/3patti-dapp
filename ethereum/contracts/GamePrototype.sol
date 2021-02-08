pragma solidity ^0.4.17;

// contract GameFactory {
//     address[] public deployedGames;

//     function createGame(uint256 minimum) public {
//         address newGame = new Game(minimum, msg.sender);
//         deployedGames.push(newGame);
//     }

//     function getDeployedGames() public view returns (address[]) {
//         return deployedGames;
//     }
// }

contract Game {
    address manager;
    uint256 minimumAmount;

    address[] public players;
    mapping(address => uint256) public playersMap;

    bool hasGameStarted;
    bool hasGameFinished;

    modifier restricted() {
        require(playersMap[msg.sender] >= minimumAmount);
        _;
    }

    // function Game(uint256 minimum, address creator) public {
    function Game(uint256 minimum) public {
        // manager = creator;
        manager = msg.sender;
        minimumAmount = minimum;

        hasGameStarted = false;
        hasGameFinished = false;
    }

    function gameStatus() public view returns (string) {
        if (hasGameStarted) {
            if (hasGameFinished) {
                return "Played and Finished";
            } else {
                return "Playing";
            }
        } else {
            if (hasGameFinished) {
                return "Not Played but Finished";
            } else {
                return "Game not Started";
            }
        }
    }

    function getPlayers() public view returns (address[]) {
        return players;
    }

    function enterGame() public payable {
        require(!hasGameStarted && !hasGameFinished);
        require(msg.value >= minimumAmount);

        players.push(msg.sender);
        playersMap[msg.sender] = msg.value;
    }

    function startGame() public {
        require(!hasGameStarted && !hasGameFinished);
        require(msg.sender == manager);

        hasGameStarted = true;
    }

    function saveGame(address[] currentAddresses, uint256[] currentStatus)
        public
    {
        require(hasGameStarted && !hasGameFinished);
        require(currentAddresses.length == currentStatus.length);

        uint256 sum = 0;
        uint256 i;
        for (i = 0; i < currentStatus.length; i++) {
            sum += currentStatus[i];
        }
        require(sum == address(this).balance);

        for (i = 0; i < currentAddresses.length; i++) {
            playersMap[currentAddresses[i]] = currentStatus[i];
        }
    }

    function endGame() public restricted {
        for (uint256 i = 0; i < players.length; i++) {
            address player = players[i];
            player.transfer(playersMap[player]);
            playersMap[player] = 0;
        }

        hasGameFinished = true;
    }
}
