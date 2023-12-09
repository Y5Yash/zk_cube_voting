// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "../interfaces/IAnonAadhaarVerifier.sol";

contract Noob_Voting{
    address public anonAadhaarVerifierAddress;
    mapping(uint256=>uint256) public userVotes;
    mapping(uint256=>uint256) public candidateTally;

    constructor(address _anonAadhaarVerifierAddr) {
        anonAadhaarVerifierAddress = _anonAadhaarVerifierAddr;
    }

    function vote(uint256 voteVal, uint256[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[34] calldata _pubSignals) public {
        require(userVotes[_pubSignals[0]]==0, "Already voted, reverting");
        require(IAnonAadhaarVerifier(anonAadhaarVerifierAddress).verifyProof(_pA, _pB, _pC, _pubSignals), "Proof invalid");
        userVotes[_pubSignals[0]]=voteVal;
        candidateTally[voteVal]+=1;
    }
}