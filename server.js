const express = require('express');
const bodyParser = require('body-parser');
const secureEndpoints = require("./modules/secureEndpoints")
const User = require("./modules/user")
const auth = require("./modules/auth");
const {
    Router
  } = require('express');

const server = express();
const port = (process.env.PORT || 8080);


server.set('port', port);
server.use(express.static('public'));
server.use(bodyParser.json());
// https://expressjs.com/en/guide/routing.html
server.use("/secure", secureEndpoints);

//sender ny bruker til db
server.post("/user", async function (req, res) {
  const newUser = new User(req.body.username, req.body.password);
  await newUser.create();
  res.status(200).json(newUser).end();
});

server.get("/user", auth, async function (req, res) {
    let requestUser = req.user;// Kommer fra linje 14 i auth.js
    res.status(200).json(requestUser).end();
    console.log(requestUser);
});

server.listen(server.get('port'), function () {
  console.log('server running', server.get('port'));
});