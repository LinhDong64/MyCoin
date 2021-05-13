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

const validateTransaction = (transaction, aUnspentTxOuts)=>{
    if(!isValidTransactionStructure()){
        return false;
    }
    if(getTransactionId(transaction) !== transaction.id){
        console.log('invalid tx id: '+transaction.id);
        return false;
    }
    const hasValidTxIns = transaction.txIns
    .map((txIn)=>validateTxIn(txIn, transaction, aUnspentTxOuts))
    .reduce((a,b)=>a&&b, true);

    if(!hasValidTxIns){
        console.log('some of the txIns are invalid in tx: ' + transaction.id);
        return false;
    }
    const totalTxInValues = transaction.txIns
    .map((txIn)=>getTxInAmount(txIn, aUnspentTxOuts))
    .reduce((a,b)=> (a+b), 0);

    const totalTxOutValues = transaction.txOuts
    .map((txOut)=>txOut.amount)
    .reduce((a,b)=> (a+b), 0);

    if(totalTxInValues !== totalTxOutValues){
        console.log('totalTxOutValues !== totalTxInValues in tx: ' + transaction.id);
        return false;
    }
    return true;
};
exports.validateTransaction=validateTransaction;


