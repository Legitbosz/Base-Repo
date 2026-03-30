// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TipMessage
 * @notice Send ETH tips with on-chain messages — public or private
 */
contract TipMessage {
    address public owner;

    struct Message {
        address sender;
        uint256 amount;
        string message;
        bool isPrivate;
        uint256 timestamp;
    }

    Message[] public messages;
    mapping(address => uint256[]) public myMessages;

    uint256 public totalReceived;
    uint256 public constant MIN_TIP = 0.0001 ether;
    uint256 public constant MAX_MSG_LENGTH = 500;

    event TipWithMessage(address indexed sender, uint256 amount, bool isPrivate, uint256 msgId);
    event Withdrawn(address indexed owner, uint256 amount);

    modifier onlyOwner() { require(msg.sender == owner, "Not owner"); _; }

    constructor() { owner = msg.sender; }

    function tipWithMessage(string memory _message, bool _isPrivate) external payable {
        require(msg.value >= MIN_TIP, "Tip too small");
        require(bytes(_message).length <= MAX_MSG_LENGTH, "Message too long");

        uint256 msgId = messages.length;
        messages.push(Message(msg.sender, msg.value, _message, _isPrivate, block.timestamp));
        myMessages[msg.sender].push(msgId);
        totalReceived += msg.value;

        emit TipWithMessage(msg.sender, msg.value, _isPrivate, msgId);
    }

    // Get all public messages
    function getPublicMessages(uint256 offset, uint256 limit) external view returns (Message[] memory) {
        uint256 count = 0;
        for (uint i = 0; i < messages.length; i++) {
            if (!messages[i].isPrivate) count++;
        }

        uint256 end = offset + limit > count ? count : offset + limit;
        Message[] memory result = new Message[](end - offset);
        uint256 idx = 0;
        uint256 pub = 0;

        for (uint i = 0; i < messages.length && idx < result.length; i++) {
            if (!messages[i].isPrivate) {
                if (pub >= offset) result[idx++] = messages[i];
                pub++;
            }
        }
        return result;
    }

    // Sender can view their own private messages
    function getMyMessages() external view returns (uint256[] memory) {
        return myMessages[msg.sender];
    }

    function getMessage(uint256 _id) external view returns (Message memory) {
        Message memory m = messages[_id];
        require(!m.isPrivate || m.sender == msg.sender || msg.sender == owner, "Private message");
        return m;
    }

    function getMessageCount() external view returns (uint256) {
        return messages.length;
    }

    function withdraw() external onlyOwner {
        uint256 bal = address(this).balance;
        require(bal > 0, "Nothing to withdraw");
        payable(owner).transfer(bal);
        emit Withdrawn(owner, bal);
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
