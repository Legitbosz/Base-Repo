// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TipMultiJar
 * @notice Multiple tip jars in one contract — each creator gets their own jar
 */
contract TipMultiJar {
    struct Jar {
        address owner;
        string name;
        uint256 balance;
        uint256 tipCount;
        bool exists;
    }

    mapping(bytes32 => Jar) public jars;
    mapping(address => bytes32) public ownerToJar;
    bytes32[] public jarIds;

    uint256 public constant MIN_TIP = 0.0001 ether;

    event JarCreated(bytes32 indexed jarId, address indexed owner, string name);
    event TipReceived(bytes32 indexed jarId, address indexed sender, uint256 amount);
    event Withdrawn(bytes32 indexed jarId, address indexed owner, uint256 amount);

    function createJar(string memory _name) external {
        require(ownerToJar[msg.sender] == bytes32(0), "Already have a jar");
        bytes32 jarId = keccak256(abi.encodePacked(msg.sender, _name, block.timestamp));
        jars[jarId] = Jar(msg.sender, _name, 0, 0, true);
        ownerToJar[msg.sender] = jarId;
        jarIds.push(jarId);
        emit JarCreated(jarId, msg.sender, _name);
    }

    function tip(bytes32 jarId) external payable {
        require(jars[jarId].exists, "Jar not found");
        require(msg.value >= MIN_TIP, "Tip too small");
        jars[jarId].balance += msg.value;
        jars[jarId].tipCount++;
        emit TipReceived(jarId, msg.sender, msg.value);
    }

    function withdraw() external {
        bytes32 jarId = ownerToJar[msg.sender];
        require(jarId != bytes32(0), "No jar found");
        uint256 bal = jars[jarId].balance;
        require(bal > 0, "Nothing to withdraw");
        jars[jarId].balance = 0;
        payable(msg.sender).transfer(bal);
        emit Withdrawn(jarId, msg.sender, bal);
    }

    function getJar(bytes32 jarId) external view returns (Jar memory) {
        return jars[jarId];
    }

    function getMyJar() external view returns (Jar memory) {
        return jars[ownerToJar[msg.sender]];
    }

    function getJarCount() external view returns (uint256) {
        return jarIds.length;
    }
}
