const express = require('express');
const bodyParser = require('body-parser');
const secureEndpoints = require("./modules/secureEndpoints")
const database = require("./modules/storagehandler")
const user = require("./modules/user")
const {
    Router
  } = require('express');
const {
    encrypt,
    decrypt
} = require("./modules/cesarcipher");

const server = express();
const port = (process.env.PORT || 8080);


server.set('port', port);
server.use(express.static('public'));
server.use(bodyParser.json());
// https://expressjs.com/en/guide/routing.html
server.use("/secure", secureEndpoints);

//sender ny bruker til db
server.post("/user", async function (req, res) {
  const newUser = new user(req.body.userid, req.body.email, req.body.password);
  await newUser.create();
  res.status(200).json(newUser).end();
});

server.get("/user/:userid/:email/:password", async function (req, res) {
    const userData = await database.retrieveUser(req.params.userid, req.params.email, req.params.password);
    res.status(200).json({
        userData: userData
    }).end()

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