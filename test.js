const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VotingDAO Contract", function () {
  let VotingDAO, votingDAO, owner, addr1, addr2;

  beforeEach(async function () {
    // Deploy the contract before each test
    VotingDAO = await ethers.getContractFactory("VotingDAO");
    votingDAO = await VotingDAO.deploy();
    [owner, addr1, addr2] = await ethers.getSigners();
  });

  it("Should create a proposal", async function () {
    const description = "Proposal 1";
    const duration = 60; // 60 seconds
    await votingDAO.createProposal(description, duration);
    const proposal = await votingDAO.getProposal(0);

    expect(proposal.id).to.equal(0);
    expect(proposal.description).to.equal(description);
    expect(proposal.expirationTimestamp).to.be.gt(0);
  });

  it("Should emit ProposalCreated event when proposal is created", async function () {
    const description = "Proposal 1";
    const duration = 60;
    await expect(votingDAO.createProposal(description, duration))
      .to.emit(votingDAO, "ProposalCreated")
      .withArgs(0, owner.address);
  });

  it("Should allow voting for a proposal", async function () {
    const description = "Proposal 1";
    const duration = 60;
    await votingDAO.createProposal(description, duration);
    
    await votingDAO.vote(0, true);
    const proposal = await votingDAO.getProposal(0);

    expect(proposal.forVotes).to.equal(1);
    expect(proposal.againstVotes).to.equal(0);
  });

  it("Should not allow double voting", async function () {
    const description = "Proposal 1";
    const duration = 60;
    await votingDAO.createProposal(description, duration);
    
    await votingDAO.vote(0, true);
    await expect(votingDAO.vote(0, true)).to.be.revertedWith("You have already voted");
  });

  it("Should not allow voting after proposal expiration", async function () {
    const description = "Proposal 1";
    const duration = 1; // 1 second duration
    await votingDAO.createProposal(description, duration);
    
    // Wait for the proposal to expire
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    await expect(votingDAO.vote(0, true)).to.be.revertedWith("Proposal has expired");
  });

  it("Should allow retrieving vote counts", async function () {
    const description = "Proposal 1";
    const duration = 60;
    await votingDAO.createProposal(description, duration);
    
    await votingDAO.vote(0, true); // Owner votes for
    await votingDAO.connect(addr1).vote(0, false); // Addr1 votes against
    
    const [forVotes, againstVotes] = await votingDAO.getVoteCounts(0);

    expect(forVotes).to.equal(1);
    expect(againstVotes).to.equal(1);
  });

  it("Should check if proposal is active", async function () {
    const description = "Proposal 1";
    const duration = 60;
    await votingDAO.createProposal(description, duration);
    
    const isActive = await votingDAO.isProposalActive(0);
    expect(isActive).to.equal(true);

    // Wait for expiration
    await new Promise((resolve) => setTimeout(resolve, 60000));

    const isStillActive = await votingDAO.isProposalActive(0);
    expect(isStillActive).to.equal(false);
  });
});
