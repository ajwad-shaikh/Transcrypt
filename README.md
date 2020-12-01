# Transcrypt

> A Hyperledger Blockchain based platform to verify academic transcripts.

## Modules

1. ### `transcrypt-contract`
    - The chaincode for the Transcrypt Smart Contract
1. ### `transcrypt-server`
    - The backend server that communicates with the blockchain network
1. ### `transcrypt-ui`
    - The React Application that acts as a graphical user interface to the platform

## Getting Started

- Follow [this Hyperledger Fabric Tutorial](https://hyperledger-fabric.readthedocs.io/en/release-1.2/write_first_app.html) to install the necesary prerequisites and dependencies up until _Querying the Ledger_

- You should have a folder `fabric-samples` on your system after you follow the tutorial.

```sh

# navigate to fabric samples
cd fabric-samples

# clone this repo
git clone https://github.com/ajwad-shaikh/Transcrypt.git

cd Transcrypt

# start Hyperledger Fabric Network
cd transcrypt-server
./startFabric.sh
# this takes a while to happen as multiple containers are spun up in action and the smartcontract chaincode from transcrypt-contract is deployed to the network

cd src

# install dependencies
npm install

# enroll an admin user to the network
node enrollAdmin.js

# register a user (appUser) on the network whose identity our app will use
node registerUser.js

# start the  backend server
node backend.js
# should display `Listening on port 4001` on the console, you might want to boot up another terminal for the next steps

# moving on to the frontend now
cd ../../transcrypt-ui

# install dependencies
npm install

# start React development server
npm start

```

- You can now access the interface at http://localhost:3000
