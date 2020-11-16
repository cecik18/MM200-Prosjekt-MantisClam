const express = require('express');
const bodyParser = require('body-parser');
const secureEndpoints = require("./modules/secureEndpoints")
const User = require("./modules/user")
const auth = require("./modules/auth");
const db = require("./modules/storagehandler");
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
  let check = await db.retrieveUsername(newUser.username);
  if(!check) {
  await newUser.create();
    res.status(200).json(newUser).end();
    console.log("User created")
  } else {
    res.status(409).end()
  }
});

//Henter bruker fra db
server.get("/user", auth, async function (req, res) {
    let requestUser = req.user;// Kommer fra linje 14 i auth.js
    res.status(200).json({ username: requestUser.username, userid: requestUser.userid }).end();
    console.log(requestUser);
});

//sletter bruker
server.post("/deleteUser", async function (req, res) {
  let deletion = await db.deleteUser(req.body.userid, req.body.username)
  res.status(200).json(deletion).end();
  console.log("Deleted");
});


server.listen(server.get('port'), function () {
  console.log('server running', server.get('port'));
});