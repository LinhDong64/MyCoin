const CryptoJS = require("crypto-js");
const ecdsa = require("elliptic");
const lodash = require("lodash");
const ec = new ecdsa.ec('secp256k1');
const COINBASE_AMOUNT = 50;

class UnspentTxOut {
    constructor(txOutId, txOutIndex, address, amount) {
        this.txOutId = txOutId;
        this.txOutIndex = txOutIndex;
        this.address = address;
        this.amount = amount;
    }
}
exports.UnspentTxOut = UnspentTxOut;

class TxIn { };
exports.TxIn = TxIn;

class TxOut {
    constructor(address, amount) {
        this.address = address;
        this.amount = amount;
    }
}
exports.TxOut = TxOut;

class Transaction {
}
exports.Transaction = Transaction;

const getTransactionId = (transaction) => {
    const txInContent = transaction.txIns
        .map((txIn) => txIn.txOutId + txIn.txOutIndex)
        .reduce((a, b) => a + b, '');

    const txOutContent = transaction.txOuts
        .map((txOut) => txOut.address + txOut.amount)
        .reduce((a, b) => a + b, '');

    return CryptoJS.SHA256(txInContent, txOutContent).toString();
}
exports.getTransactionId = getTransactionId;

const validateTransaction = (transaction, aUnspentTxOuts) => {
    if (!isValidTransactionStructure()) {
        return false;
    }
    if (getTransactionId(transaction) !== transaction.id) {
        console.log('invalid tx id: ' + transaction.id);
        return false;
    }
    const hasValidTxIns = transaction.txIns
        .map((txIn) => validateTxIn(txIn, transaction, aUnspentTxOuts))
        .reduce((a, b) => a && b, true);

    if (!hasValidTxIns) {
        console.log('some of the txIns are invalid in tx: ' + transaction.id);
        return false;
    }
    const totalTxInValues = transaction.txIns
        .map((txIn) => getTxInAmount(txIn, aUnspentTxOuts))
        .reduce((a, b) => (a + b), 0);

    const totalTxOutValues = transaction.txOuts
        .map((txOut) => txOut.amount)
        .reduce((a, b) => (a + b), 0);

    if (totalTxInValues !== totalTxOutValues) {
        console.log('totalTxOutValues !== totalTxInValues in tx: ' + transaction.id);
        return false;
    }
    return true;
};
exports.validateTransaction = validateTransaction;

const validateBlockTransactions = (aTransactions, aUnspentTxOuts, blockIndex) => {
    const coinbaseTx = aTransactions[0];
    if (!validateCoinbaseTx(coinbaseTx, blockIndex)) {
        console.log('invalid coinbase transaction: ' + JSON.stringify(coinbaseTx));
        return false;
    }

    const txIns = lodash(aTransactions)
        .map((tx) => tx.txIns)
        .flatten().value();

    if (hasDuplicates(txIns)) {
        return false;
    }

    const normalTransactions = aTransactions.slice(1);
    return normalTransactions.map((tx) => validateTransaction(tx, aUnspentTxOuts))
        .reduce((a, b) => (a && b), true);
}

const hasDuplicates = (txIns) => {
    const groups = lodash.countBy(txIns, (txIn) => txIn.txOutId + txIn.txOutIndex);
    return lodash(groups).map((value, key) => {
        if (value > 1) {
            console.log('duplicate txIn: ' + key);
            return true;
        } else {
            return false;
        }
    }).includes(true);
};
exports.hasDuplicates = hasDuplicates;

const validateCoinbaseTx = (transaction, blockIndex) => {
    if (transaction == null) {
        console.log('the first transaction in the block must be coinbase transaction');
        return false;
    }
    if (getTransactionId(transaction) !== transaction.id) {
        console.log('invalid coinbase tx id: ' + transaction.id);
        return false;
    }
    if (transaction.txIns.length !== 1) {
        console.log('one txIn must be specified in the coinbase transaction');
        return false;
    }
    if(transaction.txOuts[0].amount !== COINBASE_AMOUNT){
        console.log('invalid coinbase amount in coinbase transaction');
        return false;
    }
    if (transaction.txOuts.length !== 1) {
        console.log('invalid number of txOuts in coinbase transaction');
        return false;
    }
    if (transaction.txIns[0].txOutIndex !== blockIndex) {
        console.log('the txIn signature in coinbase tx must be the block height');
        return false;
    }
    return true;
}

const validateTxIn = (txIn, transaction, aUnspentTxOuts)=>{
    const referencedUTxOut = aUnspentTxOuts.find((uTxO)=>uTxO.txOutId === txIn.txOutId && uTxO.txOutIndex === txIn.txOutIndex);
    if(referencedUTxOut === null){
        console.log('referenced txOut not found: ' + JSON.stringify(txIn));
        return false;
    }
    const address = referencedUTxOut.address;
    const key = ec.keyFromPublic(add, 'hex');
    const validSignature = key.verify(transaction.id, txIn.signature);
    if(!validSignature){
        console.log('invalid txIn signature: %s txId: %s address: %s', txIn.signature, transaction.id, referencedUTxOut.address);
        return false;
    }
    return true;
};

const getTxInAmount = (txIn, aUnspentTxOuts)=>{
    return findUnspentTxOut(txIn.txOutId, txIn.txOutIndex, aUnspentTxOuts).amount;
};

const findUnspentTxOut = (transactionId, index, aUnspentTxOuts)=>{
    return aUnspentTxOuts.find((uTxO)=> uTxO.txOutId === transactionId && uTxO.txOutIndex===index);
};

const getCoinbaseTransaction = (address, blockIndex)=>{
    const t = new Transaction();
    const txIn= new TxIn();

    txIn.signature = '';
    txIn.txOutId = '';
    txIn.txOutIndex = blockIndex;
    t.txIns = [txIn];
    t.txOuts = [new TxOut(address, COINBASE_AMOUNT)];
    t.id = getTransactionId(t);
    
    return t;
}
exports.getCoinbaseTransaction=getCoinbaseTransaction;