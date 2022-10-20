// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

/**
 * @title MemorialWall - A memorial wall for you to leave messages for your loved ones.
 * @author @dweng0
 */
contract MemorialWall {
    // event to emit when a new message is added to the wall
    event NewMemoryMessage(
        address indexed author,
        string message,
        string name,
        string imageHash,
        uint256 timestamp
    );

    // event to emit when we get a response on the withdrawal
     event Response(bool success, bytes data);
      
    // Memo struct
    struct MemoryMessage {
        string message;
        string name;
        string imageHash;
        address author;
        uint256 timestamp;
    }

    // list of all messages to go on the wall
    MemoryMessage[] public messages;

    // address of contract deployer
    address payable owner;

    // constructor
    constructor() {
        owner = payable(msg.sender);
    }

    /**
     * @dev add a new message to the wall
     * @param _message the message to add
     * @param _name the name of the author
     */
    function addMemory(string memory _message, string memory _name, string memory _imageHash) public payable {

        //check value
        require(msg.value > 0 ether, "You must donate to add a memory to the wall");

        // add message to messages array
        messages.push(MemoryMessage(_message, _name, _imageHash, msg.sender, block.timestamp));

        // emit event
        emit NewMemoryMessage(msg.sender, _message, _name, _imageHash, block.timestamp);
    }

    /**
    * @dev Change ownership of the memorial wall
    * @param _newOwner the address of the new owner
    */
    function changeOwner(address payable _newOwner) public {
        require(msg.sender == owner, "Only the owner can change ownership");
        owner = _newOwner;
    }

    /**
     * @dev Return owner address 
     * @return address of owner
     */
    function getOwner() external view returns (address) {
        return owner;
    }

    /**
     * @dev get all the messages on the wall
     */
    function getMemories() public view returns (MemoryMessage[] memory) {
        return messages;
    }

    /**
     * @dev withdraw donations
     */
    function withdrawDonations() public {       
        require(msg.sender == owner, "Only the owner can withdraw donations");

        (bool success, bytes memory data) = owner.call{value: address(this).balance}(new bytes(0));

        emit Response(success, data);
        // check the transfer was successful
        require(success, "Transfer failed.");
    }
}
