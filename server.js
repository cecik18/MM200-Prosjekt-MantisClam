const express = require('express');
const bodyParser = require('body-parser');
const {
  Router
} = require('express');
const secureEndpoints = require("./modules/secureEndpoints")
const user = require("./modules/user")
const {
    encrypt,
    decrypt
} = require("./modules/cesarcipher");

const credentials = process.env.DATABASE_URL;

const db = new(require("./modules/storagehandler"))(credentials);

const server = express();
const port = (process.env.PORT || 8080);


server.set('port', port);
server.use(express.static('public'));
server.use(bodyParser.json());
// https://expressjs.com/en/guide/routing.html
server.use("/secure", secureEndpoints);


server.post("/user", async function (req, res) {
  const newUser = new user(req.body.email, req.body.password);
  await newUser.create();
  res.status(200).json(newUser).end();
});


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