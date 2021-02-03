pragma solidity ^0.4.17;

contract GameFactory {
    address[] public deployedGames;

    function create_game(uint256 minimum) public {
        address newGame = new Game(minimum, msg.sender);
        deployedGames.push(newGame);
    }

    function get_deployed_games() public view returns (address[]) {
        return deployedGames;
    }
}

contract Game {

    address manager;    
    uint minimum_amount;
    address[] public players;
    mapping(address => uint) public players_map;
    
    modifier restricted() {
        require(players_map[msg.sender] >= minimum_amount);
        _;
    }
    
    function Game(uint minimum, address creator) public {
        minimum_amount = minimum;
        manager = creator;
    }
    
    function enter() public payable {
        require(msg.value >= minimum_amount);
        
        players.push(msg.sender);
        players_map[msg.sender] = msg.value;
    }
    
    function get_players() public view returns(address[]) {
        return players;
    }
    
    function end_game() public restricted {
        for (uint i=0; i<players.length; i++) {
            address player = players[i];
            player.transfer(players_map[player]);
            players_map[player] = 0;
        }
    }
}