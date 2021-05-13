const express = require('express');
const morgan = require('morgan');
const wallet = require('./wallet');
const fs = require('fs');
const httpPort = parseInt(process.env.HTTP_PORT) || 3001;
const cors = require('cors');// To pass original cors


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

    app.get('/key', (req, res) => {
        wallet.initWallet();
        const filename = 'private_key_0';
        const filePath = `./node/wallet/${filename}`;
        res.download(filePath);

    })

    app.post('/', (req, res) => {
        const privateKey = req.body.privateKey;
        const testFolder = './node/wallet/';

        fs.readdir(testFolder, (err, files) => {
            files.forEach(file => {
               let buffer = fs.readFileSync(`./node/wallet/${file}`, 'utf-8');
               if(privateKey.localeCompare(buffer.toString()) === 0){
                   return res.json({'isCorrectKey':true});
               }
           });
           return res.json({'isCorrectKey':false});
        });

        //return res.json({'isCorrectKey': false});
    })

    app.listen(myHttpPort, () => {
        console.log('Listening http on port: ', + myHttpPort)
    })
}

initHttpServer(httpPort);