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
    address public manager;
    uint256 public minimumAmount;

    address[] public players;
    mapping(address => bool) public isPlaying;
    mapping(address => uint256) public wageredAmount;

    bool hasGameStarted;
    bool hasGameEnded;

    modifier playerOnly() {
        require(isPlaying[msg.sender] == true);
        _;
    }

    modifier managerOnly() {
        require(msg.sender == manager);
        _;
    }

    function Game(uint256 minimum, address creator) public {
        manager = creator;
        minimumAmount = minimum;

        hasGameStarted = false;
        hasGameEnded = false;
    }

    function gameStatus() public view returns (string) {
        if (hasGameStarted) {
            if (hasGameEnded) {
                return "Played and Ended";
            } else {
                return "Playing";
            }
        } else {
            if (hasGameEnded) {
                return "Not Played but Ended";
            } else {
                return "Game not Started";
            }
        }
    }

    function getPlayers() public view returns (address[]) {
        return players;
    }

    function enterGame() public payable {
        require(!hasGameStarted && !hasGameEnded);
        require(msg.value >= minimumAmount);

        players.push(msg.sender);
        wageredAmount[msg.sender] = msg.value;
        isPlaying[msg.sender] = true;
    }

    function startGame() public managerOnly {
        require(msg.sender == manager);
        require(!hasGameStarted && !hasGameEnded);
        require(players.length >= 2);

        hasGameStarted = true;
    }

    function verifyStatus(address[] addresses, uint256[] amounts)
        private
        view
        returns (bool)
    {
        require(addresses.length == amounts.length);
        uint256 len = addresses.length;

        bool addressFlag = true;
        bool amountFlag;

        uint256 sum = 0;
        for (uint256 i = 0; i < len; i++) {
            if (!isPlaying[addresses[i]]) {
                addressFlag = false;
            }
            sum += amounts[i];
        }
        amountFlag = sum == address(this).balance;

        return addressFlag && amountFlag;
    }

    function saveGame(address[] currentAddresses, uint256[] currentAmounts)
        public
        managerOnly
    {
        require(hasGameStarted && !hasGameEnded);
        require(verifyStatus(currentAddresses, currentAmounts));

        for (uint256 i = 0; i < currentAddresses.length; i++) {
            wageredAmount[currentAddresses[i]] = currentAmounts[i];
        }
    }

    function endGame() public managerOnly {
        for (uint256 i = 0; i < players.length; i++) {
            address player = players[i];
            player.transfer(wageredAmount[player]);
            wageredAmount[player] = 0;
            isPlaying[player] = false;
        }

        hasGameEnded = true;
    }
}
