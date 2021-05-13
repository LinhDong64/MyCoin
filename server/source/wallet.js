const elliptic = require('elliptic');
const EC = new elliptic.ec('secp256k1');
const fs = require('fs');
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
exports.initWallet=initWallet;

const getPrivateFromWallet = ()=>{
    const buffer = fs.readFileSync(privateKeyLocation, 'utf-8');
    return buffer.toString();
}
exports.getPrivateFromWallet = getPrivateFromWallet;

const getPublicFromWallet = ()=>{
    const privateKey = getPrivateFromWallet();
    const key = EC.keyFromPrivate(privateKey,'hex');
    return key.getPublic().encode('hex');
}
exports.getPublicFromWallet=getPublicFromWallet;
