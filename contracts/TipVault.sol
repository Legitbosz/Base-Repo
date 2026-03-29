// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TipVault
 * @notice Tips are locked for a set duration before owner can withdraw
 */
contract TipVault {
    address public owner;
    uint256 public unlockTime;
    uint256 public lockDuration;
    uint256 public totalReceived;
    uint256 public tipCount;

    event TipReceived(address indexed sender, uint256 amount);
    event Withdrawn(address indexed owner, uint256 amount);
    event LockExtended(uint256 newUnlockTime);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(uint256 _lockDays) {
        owner = msg.sender;
        lockDuration = _lockDays * 1 days;
        unlockTime = block.timestamp + lockDuration;
    }

    receive() external payable {
        require(msg.value > 0, "No ETH sent");
        totalReceived += msg.value;
        tipCount++;
        emit TipReceived(msg.sender, msg.value);
    }

    function tip() external payable {
        require(msg.value > 0, "No ETH sent");
        totalReceived += msg.value;
        tipCount++;
        emit TipReceived(msg.sender, msg.value);
    }

    function withdraw() external onlyOwner {
        require(block.timestamp >= unlockTime, "Vault is still locked");
        uint256 bal = address(this).balance;
        require(bal > 0, "Nothing to withdraw");
        payable(owner).transfer(bal);
        // Reset lock after withdrawal
        unlockTime = block.timestamp + lockDuration;
        emit Withdrawn(owner, bal);
    }

    function extendLock(uint256 _extraDays) external onlyOwner {
        unlockTime += _extraDays * 1 days;
        emit LockExtended(unlockTime);
    }

    function timeUntilUnlock() external view returns (uint256) {
        if (block.timestamp >= unlockTime) return 0;
        return unlockTime - block.timestamp;
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
