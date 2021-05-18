const express = require('express');
const morgan = require('morgan');
const wallet = require('./wallet');
const fs = require('fs');
const httpPort = parseInt(process.env.HTTP_PORT) || 3001;
const cors = require('cors');// To pass original cors

const lodash = require("lodash");
const blockchain = require("./blockchain");
const p2p = require("./p2p");
const transactionPool = require("./transactionPool");
const p2pPort = parseInt(process.env.P2P_PORT) || 6001;


const initHttpServer = (myHttpPort) => {
    const app = express();
    app.use(express.json());
    app.use(morgan('dev'));
    app.use(cors());

    app.use((err, req, res, next) => {
        if (err) {
            res.status(400).send(err.message);
        }
    });

    app.post('/access-wallet', (req, res)=>{
        const key = req.body.key;
        wallet.updatePrivatKeyFile(key);
        res.json({'state': true});
    })

    app.get('/key', (req, res) => {
        wallet.initWallet();
        const filename = 'private_key';
        const filePath = `./node/wallet/${filename}`;
        res.download(filePath);
    })

    app.get('/blocks', (req, res) => {
        res.send(blockchain.getBlockchain());
    });

    app.get('/block/:hash', (req, res) => {
        const block = lodash.find(blockchain.getBlockchain(), { 'hash': req.params.hash });
        res.send(block);
    });

    app.get('/transaction/:id', (req, res) => {
        const tx = lodash(blockchain.getBlockchain())
            .map((blocks) => blocks.data)
            .flatten()
            .find({ 'id': req.params.id });
        res.send(tx);
    });

    app.get('/address/:address', (req, res) => {
        const unspentTxOuts = lodash.filter(blockchain.getUnspentTxOuts(), (uTxO) => uTxO.address === req.params.address);
        res.send({ 'unspentTxOuts': unspentTxOuts });
    });

    app.get('/unspentTransactionOutputs', (req, res) => {
        res.send(blockchain.getUnspentTxOuts());
    });

    app.get('/myUnspentTransactionOutputs', (req, res) => {
        res.send(blockchain.getMyUnspentTransactionOutputs());
    });

    app.post('/mineRawBlock', (req, res) => {
        if (req.body.data == null) {
            res.send('data parameter is missing');
            return;
        }
        const newBlock = blockchain.generateRawNextBlock(req.body.data);
        if (newBlock === null) {
            res.status(400).send('could not generate block');
        }
        else {
            res.send(newBlock);
        }
    });

    app.post('/mineBlock', (req, res) => {
        const newBlock = blockchain.generateNextBlock();
        if (newBlock === null) {
            res.status(400).send('could not generate block');
        }
        else {
            res.send(newBlock);
        }
    });

    app.get('/balance', (req, res) => {
        const balance = blockchain.getAccountBalance();
        res.send({ 'balance': balance });
    });

    app.get('/address', (req, res) => {
        const address = wallet.getPublicFromWallet();
        res.send({ 'address': address });
    });

    app.post('/mineTransaction', (req, res) => {
        const address = req.body.address;
        const amount = req.body.amount;
        try {
            const resp = blockchain.generatenextBlockWithTransaction(address, amount);
            res.send(resp);
        }
        catch (e) {
            console.log(e.message);
            res.status(400).send(e.message);
        }
    });

    app.post('/sendTransaction', (req, res) => {
        try {
            const address = req.body.address;
            const amount = req.body.amount;
            if (address === undefined || amount === undefined) {
                throw Error('invalid address or amount');
            }
            const resp = blockchain.sendTransaction(address, amount);
            res.send(resp);
        }
        catch (e) {
            console.log(e.message);
            res.status(400).send(e.message);
        }
    });

    app.get('/transactionPool', (req, res) => {
        res.send(transactionPool.getTransactionPool());
    });

    app.get('/peers', (req, res) => {
        res.send(p2p.getSockets().map((s) => s._socket.remoteAddress + ':' + s._socket.remotePort));
    });

    app.post('/addPeer', (req, res) => {
        p2p.connectToPeers(req.body.peer);
        res.send();
    });

    app.post('/stop', (req, res) => {
        res.send({ 'msg': 'stopping server' });
        process.exit();
    });

    app.listen(myHttpPort, () => {
        console.log('Listening http on port: ', + myHttpPort)
    })
}

initHttpServer(httpPort);
p2p.initP2PServer(p2pPort);