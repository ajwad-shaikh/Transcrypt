'use strict';
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const Fabric_Client = require('fabric-client');
const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

// Fabric stuff
// setup the fabric network
const fabric_client = new Fabric_Client();
const channel = fabric_client.newChannel('mychannel');
const peer = fabric_client.newPeer('grpc://localhost:7051');
channel.addPeer(peer);
const order = fabric_client.newOrderer('grpc://localhost:7050');
channel.addOrderer(order);

// Express stuff
const port = 4001;
const app = express();
const server = http.createServer(app);

const io = socketIO(server);

// This method checks if the given car exists and executes callback depending on success / failure
async function carExists(contract, carID, success, failure) {
    contract.evaluateTransaction('queryCar', carID).then((response) => {
        if (response) {
            success();
        } else {
            failure();
        }
    })
        .catch(() => {
            failure();
        });
}

// This method queries the peer to retrieve the information as defined in the request argument
async function query(request, socket) {
    // sends a proposal to one or more endorsing peers that will be handled by the chaincode
    const { contract, fcn, args } = request;

    socket.emit('RESPONSE', {
        type: 'FEED',
        payload: 'Sending query to peers',
    });

    const query_responses = await contract.evaluateTransaction(fcn, args);

    if (query_responses) {
        let data = JSON.parse(query_responses.toString());
        socket.emit('RESPONSE', { type: 'END', payload: 'Data retrieved' });
        if (!data.length) {
            // additional data for response for query single
            data = [{ Key: request.args[0], Record: data }];
        }
        console.log(`query completed, data: ${data}`);
        socket.emit('RESPONSE', { type: 'INFO', payload: data });
    } else {
        // If no payloads returned
        console.log('No payloads were returned from query');
        socket.emit('RESPONSE', {
            type: 'ERROR',
            payload: 'No payloads were returned from query',
        });
    }
}

// This method invoke chaincode on the peer using the data specified in the request argument
async function invoke( request, socket) {
    const { contract, fcn, args } = request;

    //we want the send transaction first, so that we know where to check status
    socket.emit('RESPONSE', {
        type: 'FEED',
        payload: 'Sending transaction',
    });

    // send the transaction proposal to the peers
    await contract.submitTransaction(fcn, ...args);

    socket.emit('RESPONSE', {
        type: 'FEED',
        payload: 'Transaction Submitted!',
    });


    query({
        contract,
        chaincodeId: 'fabcar',
        fcn: 'queryCar',
        args: [args[0]],
    },
    socket
    );
}

// This method takes in the the socket (to respond to client) and the name of the user to be enrolled. It returns the user if successful
// Default user is 'appUser' as there are no other users enrolled.
async function getParameters(socket, user) {
    // load the network configuration
    const ccpPath = path.resolve(
        __dirname,
        '..',
        '..',
        '..',
        'test-network',
        'organizations',
        'peerOrganizations',
        'org1.example.com',
        'connection-org1.json'
    );
    let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const identity = await wallet.get('appUser');
    if (!identity) {
        console.log(
            'An identity for the user "appUser" does not exist in the wallet'
        );
        console.log('Run the registerUser.js application before retrying');
        return;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();

    // Create a new gateway for connecting to our peer node.
    await gateway.connect(ccp, {
        wallet,
        identity: user,
        discovery: { enabled: true, asLocalhost: true },
    });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('mychannel');

    // Get the contract from the network.
    const contract = network.getContract('fabcar');

    return { gateway, contract };
}

io.on('connection', async (socket) => {
    console.log(`Connected to client with socket ID ${socket.id}`);
    socket.emit('RESPONSE', {
        type: 'FEED',
        payload: `Connected to server with socket ID ${socket.id}`,
    });

    // enroll user when client connects, default user is appUser
    let { gateway, contract } = await getParameters(socket, 'appUser');

    socket.on('REQUEST', (req) => {
        switch (req.action) {
        case 'QUERY':
            socket.emit('RESPONSE', {
                type: 'START',
                payload: `Request for QUERY for ${req.data.ID} received`,
            });
            carExists(
                contract,
                req.data.ID,
                () => {
                    query(
                        {
                            contract,
                            chaincodeId: 'fabcar',
                            fcn: 'queryCar',
                            args: [req.data.ID],
                        },
                        socket
                    );
                },
                () => {
                    socket.emit('RESPONSE', {
                        type: 'ERROR',
                        payload: `${req.data.ID} DOES NOT EXIST!`,
                    });
                }
            );
            break;

        case 'QUERYALL':
            socket.emit('RESPONSE', {
                type: 'START',
                payload: 'Request for QUERY All received',
            });
            query(
                {
                    contract,
                    chaincodeId: 'fabcar',
                    fcn: 'queryAllCars',
                    args: [],
                },
                socket
            );
            break;

        case 'TRANSFER':
            socket.emit('RESPONSE', {
                type: 'START',
                payload: `Request for TRANSFER for ${req.data.ID} to ${req.data.newOwner} received`,
            });
            carExists(
                contract,
                req.data.ID,
                () => {
                    invoke(
                        {
                            contract,
                            chaincodeId: 'fabcar',
                            fcn: 'changeCarOwner',
                            args: [req.data.ID, req.data.newOwner],
                            chainId: 'mychannel',
                        },
                        socket
                    );
                },
                () => {
                    socket.emit('RESPONSE', {
                        type: 'ERROR',
                        payload: `${req.data.ID} DOES NOT EXIST!`,
                    });
                }
            );
            break;
        case 'CREATE':
            socket.emit('RESPONSE', {
                type: 'START',
                payload: `Request for CREATE for ${req.data.ID} received`,
            });
            carExists(
                contract,
                req.data.ID,
                () => {
                    socket.emit('RESPONSE', {
                        type: 'ERROR',
                        payload: `${req.data.ID} ALREADY EXISTS!`,
                    });
                },
                () => {
                    invoke(
                        {
                            contract,
                            chaincodeId: 'fabcar',
                            fcn: 'createCar',
                            args: [
                                req.data.ID,
                                req.data.make,
                                req.data.model,
                                req.data.color,
                                req.data.owner,
                            ],
                            chainId: 'mychannel',
                        },
                        socket
                    );
                }
            );
            break;
        }
    });

    socket.on('disconnect', async () => {
        await gateway.disconnect();
        console.log(`Disconnected to client ${socket.id}`);
    });
});

server.listen(port, () => console.log(`Listening on port ${port}`));