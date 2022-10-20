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
        uint256 timestamp
    );

    // event to emit when we get a response on the withdrawal
     event Response(bool success, bytes data);
      
    // Memo struct
    struct MemoryMessage {
        string message;
        string name;
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
    function addMessage(string memory _message, string memory _name) public payable {

        //check value
        require(msg.value > 0 ether, "You must donate to add a message");

        // add message to messages array
        messages.push(MemoryMessage(_message, _name, msg.sender, block.timestamp));

        // emit event
        emit NewMemoryMessage(msg.sender, _message, _name, block.timestamp);
    }

    /**
     * @dev get all the messages on the wall
     */
    function getMessages() public view returns (MemoryMessage[] memory) {
        return messages;
    }

    /**
     * @dev withdraw donations
     */
    function withdraw() public {       
        require(msg.sender == owner, "Only the owner can withdraw donations");

        (bool success, bytes memory data) = owner.call{value: address(this).balance}(new bytes(0));

        emit Response(success, data);
        // check the transfer was successful
        require(success, "Transfer failed.");
    }
}
