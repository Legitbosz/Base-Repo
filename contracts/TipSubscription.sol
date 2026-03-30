// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TipSubscription
 * @notice Tippers pre-fund a subscription — owner pulls payment each period
 */
contract TipSubscription {
    address public owner;

    struct Subscriber {
        uint256 balance;
        uint256 tipAmount;
        uint256 lastPaid;
        uint256 period; // in seconds
        bool active;
    }

    mapping(address => Subscriber) public subscribers;
    address[] public subscriberList;

    uint256 public constant MIN_TIP = 0.0001 ether;
    uint256 public constant MIN_PERIOD = 1 days;

    event Subscribed(address indexed subscriber, uint256 amount, uint256 period);
    event PaymentCollected(address indexed subscriber, uint256 amount);
    event Unsubscribed(address indexed subscriber);
    event Withdrawn(address indexed owner, uint256 amount);

    modifier onlyOwner() { require(msg.sender == owner, "Not owner"); _; }

    constructor() { owner = msg.sender; }

    // Subscriber funds the contract and sets tip amount + period
    function subscribe(uint256 _tipAmount, uint256 _periodDays) external payable {
        require(msg.value >= _tipAmount, "Fund at least one period");
        require(_tipAmount >= MIN_TIP, "Tip too small");
        require(_periodDays >= 1, "Min 1 day period");

        if (!subscribers[msg.sender].active) {
            subscriberList.push(msg.sender);
        }

        subscribers[msg.sender] = Subscriber(
            msg.value, _tipAmount,
            block.timestamp,
            _periodDays * 1 days,
            true
        );

        emit Subscribed(msg.sender, _tipAmount, _periodDays * 1 days);
    }

    // Top up subscription balance
    function topUp() external payable {
        require(subscribers[msg.sender].active, "Not subscribed");
        subscribers[msg.sender].balance += msg.value;
    }

    // Owner collects due payments from all subscribers
    function collectPayments() external onlyOwner {
        for (uint i = 0; i < subscriberList.length; i++) {
            address addr = subscriberList[i];
            Subscriber storage s = subscribers[addr];
            if (!s.active) continue;
            if (block.timestamp < s.lastPaid + s.period) continue;
            if (s.balance < s.tipAmount) {
                s.active = false;
                continue;
            }
            s.balance -= s.tipAmount;
            s.lastPaid = block.timestamp;
            emit PaymentCollected(addr, s.tipAmount);
        }
    }

    function unsubscribe() external {
        require(subscribers[msg.sender].active, "Not subscribed");
        uint256 refund = subscribers[msg.sender].balance;
        subscribers[msg.sender].active = false;
        subscribers[msg.sender].balance = 0;
        if (refund > 0) payable(msg.sender).transfer(refund);
        emit Unsubscribed(msg.sender);
    }

    function withdraw() external onlyOwner {
        uint256 bal = address(this).balance;
        require(bal > 0, "Nothing to withdraw");
        payable(owner).transfer(bal);
        emit Withdrawn(owner, bal);
    }

    function getSubscriber(address _addr) external view returns (Subscriber memory) {
        return subscribers[_addr];
    }

    function getSubscriberCount() external view returns (uint256) {
        return subscriberList.length;
    }
}
