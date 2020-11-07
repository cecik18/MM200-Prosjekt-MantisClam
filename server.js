const express = require('express');
const bodyParser = require('body-parser');

const {
    Router
  } = require('express');
  const secureEndpoints = require("./modules/secureEndpoints")
  const user = require("./modules/user")

const pg = require("pg");
const {
    encrypt,
    decrypt
} = require("./modules/cesarcipher");

const credentials = process.env.DATABASE_URL;

const db = new(require("./modules/storagehandler"))(credentials);

const server = express();
server.set('port', (process.env.PORT || 8080));
server.use(express.static('public'));
server.use(bodyParser.json());


// 1. Lagre meldinger ?

let meldinger = [];

server.post("/user", async function (req, res) {

    const inputEmailLogin = req.body.inputEmailLogin;
    const inputPasswordLogin = req.body.inputPasswordLogin;
    const cipherText = encrypt(inputEmailLogin, inputPasswordLogin);

    let result = await db.saveUser(cipherText);
    if (result instanceof Error) {
        res.status(500).end()
    } else {
        res.status(200).json({
            "loginId": result
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