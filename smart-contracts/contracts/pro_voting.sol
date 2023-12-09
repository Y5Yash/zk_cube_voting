// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../interfaces/IAnonAadhaarVerifier.sol";

interface SemaphoreInterface {
    function createGroup(
        uint256 groupId,
        uint256 merkleTreeDepth,
        address admin
    ) external;

    function addMember(uint256 groupId, uint256 identityCommitment) external;

    function verifyProof(
        uint256 groupId,
        uint256 merkleTreeRoot,
        uint256 signal,
        uint256 nullifierHash,
        uint256 externalNullifier,
        uint256[8] calldata proof
    ) external;
}

contract Pro_Voting {
    address public semaphoreAddress;
    address public anonAadhaarVerifierAddress;
    uint256 public groupId;
    uint256 public merkleTreeDepth;

    // mapping (bytes32 => bool) public registeredList;
    mapping (uint256 => bool) public isNullifiedList;   // comment this line and uncomment above line on prod version
    mapping (uint256 => uint256) public candidatesTally;

    constructor(address _semaphoreAddress, uint256 _groupId, uint256 _merkleTreeDepth, address _anonAadhaarVerifierAddress) {
        groupId = _groupId;
        semaphoreAddress = _semaphoreAddress;
        merkleTreeDepth = _merkleTreeDepth;
        SemaphoreInterface(semaphoreAddress).createGroup(groupId, merkleTreeDepth, address(this));
        anonAadhaarVerifierAddress = _anonAadhaarVerifierAddress;
    }

    function register(
        uint256 _identityCommitment,
        uint256[2] calldata _pA,
        uint[2][2] calldata _pB,
        uint[2] calldata _pC,
        uint[34] calldata _pubSignals
        ) external {
        require(!isNullifiedList[_pubSignals[0]], "Already voted, reverting");
        isNullifiedList[_pubSignals[0]]=true;
        require(IAnonAadhaarVerifier(anonAadhaarVerifierAddress).verifyProof(_pA, _pB, _pC, _pubSignals), "Proof invalid");

        // Add the member
        SemaphoreInterface(semaphoreAddress).addMember(groupId, _identityCommitment);

    }

    function vote(
        uint256 _merkleTreeRoot,
        uint256 _signal,
        uint256 _nullifierHash,
        uint256 _externalNullifier,
        uint256[8] calldata _proof
        ) external {

        require(_externalNullifier == 1, "The external nullifier is required to be 1.");

        SemaphoreInterface(semaphoreAddress).verifyProof(groupId, _merkleTreeRoot, _signal, _nullifierHash, _externalNullifier, _proof);

        candidatesTally[_signal]++;
    }
}

// Semaphore Address: 0x3889927F0B5Eb1a02C6E2C20b39a1Bd4EAd76131