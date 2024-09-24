// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract VotingDAO {
    
    struct Proposal {
        uint id;
        string description;
        uint expirationTimestamp;
        uint forVotes;
        uint againstVotes;
        bool exists;
    }

    // Proposal data
    mapping(uint => Proposal) public proposals;
    uint public proposalCount;

    // Tracking votes per proposal
    mapping(uint => mapping(address => bool)) public hasVoted;

    event ProposalCreated(uint proposalId, address creator);
    event VoteCast(address voter, uint proposalId, bool inFavor);

    // Create a proposal
    function createProposal(string memory _description, uint _duration) public {
        uint expirationTime = block.timestamp + _duration;
        proposals[proposalCount] = Proposal(proposalCount, _description, expirationTime, 0, 0, true);
        emit ProposalCreated(proposalCount, msg.sender);
        proposalCount++;
    }

    // Cast a vote (for or against)
    function vote(uint _proposalId, bool _inFavor) public {
        require(proposals[_proposalId].exists, "Proposal does not exist");
        require(block.timestamp < proposals[_proposalId].expirationTimestamp, "Proposal has expired");
        require(!hasVoted[_proposalId][msg.sender], "You have already voted");

        hasVoted[_proposalId][msg.sender] = true;

        if (_inFavor) {
            proposals[_proposalId].forVotes++;
        } else {
            proposals[_proposalId].againstVotes++;
        }

        emit VoteCast(msg.sender, _proposalId, _inFavor);
    }

    // Check if proposal is active or closed
    function isProposalActive(uint _proposalId) public view returns (bool) {
        require(proposals[_proposalId].exists, "Proposal does not exist");
        return block.timestamp < proposals[_proposalId].expirationTimestamp;
    }

    // Get current vote counts
    function getVoteCounts(uint _proposalId) public view returns (uint forVotes, uint againstVotes) {
        require(proposals[_proposalId].exists, "Proposal does not exist");
        return (proposals[_proposalId].forVotes, proposals[_proposalId].againstVotes);
    }

    // Retrieve proposal details
    function getProposal(uint _proposalId) public view returns (Proposal memory) {
        require(proposals[_proposalId].exists, "Proposal does not exist");
        return proposals[_proposalId];
    }
}
