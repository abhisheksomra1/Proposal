# Decentralized Voting DAO Application

This project is a simple decentralized voting application that simulates a basic Decentralized Autonomous Organization (DAO) mechanism using smart contracts on the Ethereum blockchain.

## Functional Overview

The application allows users to:
- Create proposals.
- Vote on proposals (*for* or *against*).
- Retrieve voting results and proposal statuses.

### Key Features
1. **Proposal Creation**: Any user can create a proposal.
2. **Voting**: Users can vote *for* or *against* a proposal.
3. **Proposal Status**: Proposals can be active or closed based on expiration time.
4. **Vote Tallying**: The contract tallies votes for and against proposals.

---

## Technical Overview

The contract is written in Solidity and deployed using **Hardhat**. Below are the contract's key functionalities:
- **Proposal Creation**: A proposal has an ID, description, expiration timestamp, and vote counts.
- **Voting**: Users can vote on proposals, and each user can vote only once per proposal.
- **Proposal Status**: Proposals are considered active if they haven't expired.
- **Vote Counting**: Votes for and against each proposal are tracked.

---

## Setup and Installation

--Install Dependencies
npm install

--Compile the smart contract
npx hardhat compile

--Deploy the contract on Ethereum Testnet 
npx hardhat run --network goerli scripts/deploy.js

--Verify Deployment on Etherscan
npm install --save-dev @nomiclabs/hardhat-etherscan

