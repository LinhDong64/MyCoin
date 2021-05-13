const elliptic = require('elliptic');
const EC = new elliptic.ec('secp256k1');
const fs = require('fs');
const lodash = require('lodash');
const transaction = require('./transaction');
let walletIndex = 0;
let privateKeyLocation = process.env.PRIVATE_KEY || `node/wallet/private_key_${walletIndex}`;

const generatePrivateKey = () => {
    const keyPair = EC.genKeyPair();
    const privateKey = keyPair.getPrivate();
    return privateKey.toString(16);
}
exports.generatePrivateKey = generatePrivateKey;

const initWallet = () => {
    const newPrivateKey = generatePrivateKey();
    //console.log('private key: ', walletIndex);
    privateKeyLocation = process.env.PRIVATE_KEY || `node/wallet/private_key_${walletIndex}`;
    fs.writeFileSync(privateKeyLocation, newPrivateKey);
    walletIndex += 1;
}
exports.initWallet = initWallet;

const getPrivateFromWallet = () => {
    const buffer = fs.readFileSync(privateKeyLocation, 'utf-8');
    return buffer.toString();
}
exports.getPrivateFromWallet = getPrivateFromWallet;

const getPublicFromWallet = () => {
    const privateKey = getPrivateFromWallet();
    const key = EC.keyFromPrivate(privateKey, 'hex');
    return key.getPublic().encode('hex');
}
exports.getPublicFromWallet = getPublicFromWallet;

const getBalance = (address, unspentTxOuts) => {
    return lodash(findUnspentTxOuts(address, unspentTxOuts)).map((uTxO) => uTxO.mount).sum();
}
exports.getBalance = getBalance;

const findUnspentTxOuts = (ownerAddress, unspentTxOuts) => {
    return lodash.filter(unspentTxOuts, (uTxO) => uTxO.address === ownerAddress);
};
exports.findUnspentTxOuts = findUnspentTxOuts;

const findTxOutsForAmount = (amount, myUnspentTxOuts) => {
    let currentAmount = 0;
    const includedUnspentTxOuts = [];
    for (const myUnspentTxOut of myUnspentTxOuts) {
        includedUnspentTxOuts.push(myUnspentTxOut);
        currentAmount += myUnspentTxOut.amount;

        if (currentAmount >= amount) {
            const leftOverAmount = currentAmount - amount;
            return { includedUnspentTxOuts, leftOverAmount };
        }
    }

    const eMessage = 'Cannot create transaction from the available unspent transaction outputs.' + ' Required amount:' + amount + '. Available unspentTxOuts:' + JSON.stringify(myUnspentTxOuts);
    throw Error(eMessage);
}

const createTxOuts = (receiverAddress, myAddress, amount, leftOverAmount)=>{
    const txOut1=new transaction.TxOut(receiverAddress, amount);
    if(leftOverAmount === 0){
        return [txOut1];
    }else{
        const leftOverTx = new transaction.TxOut(myAddress, leftOverAmount);
        return[txOut1, leftOverTx];
    }
};

const filterTxPoolTxs=(unspentTxOuts, transactionPool)=>{
    const txIns = lodash(transactionPool)
    .map((tx)=>tx.txIns).flatten().value();

    const removable = [];
    for(const unspentTxOut of unspentTxOuts){
        const txIn= lodash.find(txIns, (aTxIn)=>{
            return aTxIn.txOutIndex === unspentTxOut.txOutIndex && aTxIn.txOutId === unspentTxOut.txOutId;
        });
        if(txIn === undefined){
        }else{
            removable.push(unspentTxOut);
        }
    }
    return lodash.without(unspentTxOuts, ...removable);
};

const createTransaction = (receiverAddress, amount, privateKey, unspentTxOuts, txPool)=>{
    console.log('txPool: %s', JSON.stringify(txPool));
    
    const myAddress = transaction.getPublic(privateKey);
    const myUnspentTxOutsA = unspentTxOuts.filter((uTxO)=>uTxO.address === myAddress);
    const myUnspentTxOuts = filterTxPoolTxs(myUnspentTxOutsA, txPool);

    const {includedUnspentTxOuts, leftOverAmount} = findTxOutsForAmount(amount, myUnspentTxOuts);
    const toUnsignedTxIn = (unspentTxOut)=>{
        const txIn = new transaction.TxIn();
        txIn.txOutId = unspentTxOut.txOutId;
        txIn.txOutIndex = unspentTxOut.txOutIndex;
        return txIn;
    };

    const unsignedTxIns = includedUnspentTxOuts.map(toUnsignedTxIn);
    const tx = new transaction.Transaction();
    tx.txIns=unsignedTxIns;
    tx.txOuts = createTxOuts(receiverAddress, myAddress, amount, leftOverAmount);
    tx.id = transaction.getTransactionId(tx);
    tx.txIns = tx.txIns.map((txIn, index)=>{
        txIn.signature = transaction.signTxIn(tx, index, privateKey, unspentTxOuts);
        return txIn;
    })
    return tx;
};

exports.createTransaction=createTransaction;