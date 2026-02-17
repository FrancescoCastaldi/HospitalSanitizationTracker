// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SanitizationTracker {
    // Strutture dati
    struct Area {
        uint256 id;
        string name;
        bool active;
        bool exists;
    }
    
    struct Operator {
        address wallet;
        string name;
        bool active;
        bool exists;
    }
    
    struct SanitizationEvent {
        uint256 areaId;
        address operatorAddress;
        uint256 timestamp;
        string outcome;
        string notes;
    }
    
    // State variables
    address public admin;
    mapping(uint256 => Area) public areas;
    mapping(address => Operator) public operators;
    mapping(uint256 => SanitizationEvent[]) public areaEvents;
    
    // Events
    event AreaRegistered(uint256 indexed areaId, string name);
    event OperatorRegistered(address indexed operatorAddress, string name);
    event AreaSanitized(uint256 indexed areaId, address indexed operatorAddress, string outcome);
    
    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }
    
    modifier onlyActiveOperator() {
        require(operators[msg.sender].exists, "Operator not registered");
        require(operators[msg.sender].active, "Operator not active");
        _;
    }
    
    // Constructor
    constructor() {
        admin = msg.sender;
    }
    
    // Admin functions
    function registerArea(uint256 _id, string memory _name) public onlyAdmin {
        require(!areas[_id].exists, "Area already exists");
        areas[_id] = Area(_id, _name, true, true);
        emit AreaRegistered(_id, _name);
    }
    
    function setAreaActive(uint256 _id, bool _active) public onlyAdmin {
        require(areas[_id].exists, "Area does not exist");
        areas[_id].active = _active;
    }
    
    function registerOperator(address _wallet, string memory _name) public onlyAdmin {
        require(!operators[_wallet].exists, "Operator already exists");
        operators[_wallet] = Operator(_wallet, _name, true, true);
        emit OperatorRegistered(_wallet, _name);
    }
    
    function setOperatorActive(address _wallet, bool _active) public onlyAdmin {
        require(operators[_wallet].exists, "Operator does not exist");
        operators[_wallet].active = _active;
    }
    
    // Operator functions
    function sanitize(uint256 _areaId, string memory _outcome, string memory _notes) 
        public 
        onlyActiveOperator 
    {
        require(areas[_areaId].exists, "Area does not exist");
        require(areas[_areaId].active, "Area is not active");
        
        SanitizationEvent memory newEvent = SanitizationEvent({
            areaId: _areaId,
            operatorAddress: msg.sender,
            timestamp: block.timestamp,
            outcome: _outcome,
            notes: _notes
        });
        
        areaEvents[_areaId].push(newEvent);
        emit AreaSanitized(_areaId, msg.sender, _outcome);
    }
    
    // View functions
    function getAreaEvents(uint256 _areaId) public view returns (SanitizationEvent[] memory) {
        return areaEvents[_areaId];
    }
    
    function getEventCount(uint256 _areaId) public view returns (uint256) {
        return areaEvents[_areaId].length;
    }
    
    function getLastSanitization(uint256 _areaId) public view returns (SanitizationEvent memory) {
        require(areaEvents[_areaId].length > 0, "No events for this area");
        return areaEvents[_areaId][areaEvents[_areaId].length - 1];
    }
}
