// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TipWhitelist
 * @notice Only approved addresses can tip — exclusive tip jar
 */
contract TipWhitelist {
    address public owner;

    mapping(address => bool) public whitelist;
    mapping(address => uint256) public totalTipped;

    uint256 public totalReceived;
    uint256 public tipCount;
    uint256 public constant MIN_TIP = 0.0001 ether;

    event AddedToWhitelist(address indexed addr);
    event RemovedFromWhitelist(address indexed addr);
    event TipReceived(address indexed sender, uint256 amount);
    event Withdrawn(address indexed owner, uint256 amount);

    modifier onlyOwner() { require(msg.sender == owner, "Not owner"); _; }
    modifier onlyWhitelisted() { require(whitelist[msg.sender], "Not whitelisted"); _; }

    constructor() {
        owner = msg.sender;
        whitelist[msg.sender] = true;
    }

    function addToWhitelist(address _addr) external onlyOwner {
        whitelist[_addr] = true;
        emit AddedToWhitelist(_addr);
    }

    function addBatch(address[] memory _addrs) external onlyOwner {
        for (uint i = 0; i < _addrs.length; i++) {
            whitelist[_addrs[i]] = true;
            emit AddedToWhitelist(_addrs[i]);
        }
    }

    function removeFromWhitelist(address _addr) external onlyOwner {
        whitelist[_addr] = false;
        emit RemovedFromWhitelist(_addr);
    }

    function tip() external payable onlyWhitelisted {
        require(msg.value >= MIN_TIP, "Tip too small");
        totalTipped[msg.sender] += msg.value;
        totalReceived += msg.value;
        tipCount++;
        emit TipReceived(msg.sender, msg.value);
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

    function isWhitelisted(address _addr) external view returns (bool) {
        return whitelist[_addr];
    }
}
