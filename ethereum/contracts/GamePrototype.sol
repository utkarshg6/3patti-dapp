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
    mapping(address => bool) public isPlaying;
    mapping(address => uint256) public amount;

    bool hasGameStarted;
    bool hasGameFinished;

    modifier playerOnly() {
        require(isPlaying[msg.sender] == true);
        _;
    }

    modifier managerOnly() {
        require(msg.sender == manager);
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
        amount[msg.sender] = msg.value;
        isPlaying[msg.sender] = true;
    }

    function startGame() public managerOnly {
        require(!hasGameStarted && !hasGameFinished);
        require(msg.sender == manager);

        hasGameStarted = true;
    }

    function saveGame(address[] currentAddresses, uint256[] currentStatus)
        public
        managerOnly
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
            amount[currentAddresses[i]] = currentStatus[i];
        }
    }

    function endGame() public managerOnly {
        for (uint256 i = 0; i < players.length; i++) {
            address player = players[i];
            player.transfer(amount[player]);
            amount[player] = 0;
            isPlaying[player] = false;
        }

        hasGameFinished = true;
    }
}
