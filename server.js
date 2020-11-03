const express = require('express');
const bodyParser = require('body-parser');
const pg = require("pg");
const {
    encrypt,
    decrypt
} = require("./modules/cesarcipher");

const credentials = process.env.DATABASE_URL || require("./NEI").credentials;

const db = new(require("./modules/storagehandler"))(credentials);

const server = express();
server.set('port', (process.env.PORT || 8080));
server.use(express.static('public'));
server.use(bodyParser.json());


// 1. Lagre meldinger ?

let meldinger = [];

server.post("/secret", async function (req, res) {

    const message = req.body.message;
    const secretKey = req.body.secretKey;
    const cipherText = encrypt(message, secretKey);

    let result = await db.saveSecret(cipherText);
    if (result instanceof Error) {
        res.status(500).end()
    } else {
        res.status(200).json({
            "secretId": result
        }).end();
    }

});

// 2. Hente meldinger ?

server.get("/secret/:id/:key", async function (req, res) {

    const cipherText = await db.retrieveSecret(req.params.id);
    const message = decrypt(cipherText, req.params.key);

    res.status(200).json({
        message: message
    }).end()

});



server.listen(server.get('port'), function () {
    console.log('server running', server.get('port'));
});