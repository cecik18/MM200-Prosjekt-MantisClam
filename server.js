const express = require('express');
const bodyParser = require('body-parser');
const secureEndpoints = require("./modules/secureEndpoints")
const User = require("./modules/user")
const List = require("./modules/list")
const auth = require("./modules/auth");
const db = require("./modules/storagehandler");
const {
    Router
  } = require('express');
const secret = process.env.hashKey || require("./localenv").hashKey;
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
  const newUser = new User(req.body.username, req.body.password);
  let check = await db.retrieveUsername(newUser.username);
  if(!check) {
  await newUser.createUser();
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
  console.log(deletion);
  res.status(200).json(deletion).end();
  console.log("Deleted");
});

//sender ny liste til db
server.post("/list", async function (req, res) {
  
  let cleanse = await db.removeUnwantedLists(req.body.userid);

  let listid = req.body.listid;
  let userid = req.body.userid;
  let listTitle = req.body.listtitle;
  let cipherTitle = encrypt(listTitle, secret);
  console.log(cipherTitle)

  let newList = new List(listid, userid, cipherTitle,);

  let creation = await newList.createList();
    res.status(200).json(creation).end();
    console.log(cleanse);
    console.log("List created")
});


//Henter liste fra db
server.get("/list/:userid/", async function (req, res) {
    let cipherList = await db.retrieveList(req.params.userid);
    console.log(req.params.userid);
    console.log(cipherList);
    let listItems = [];
    for (let list of cipherList) {
        let listid = list.listid;
        let userid = list.userid;
        let title = decrypt(list.listtitle, secret);
        listItems.push({listid: listid, userid: userid, listtitle: title});
    }
    console.log(listItems);
    res.status(200).json(listItems).end();
});

//
server.post("/listUpdate", async function (req, res) {
    let cleanse = await db.removeUnwantedItems(req.body.listid, req.body.userid);
    let content = await db.updateContent(req.body.listid, req.body.userid, encrypt(req.body.listCont, secret));
    console.log(req.body);
    console.log(content)
    console.log(cleanse)
    res.status(200).json(content).end();
});

server.post("/cleanse", async function (req, res) {
  let cleanse = await db.removeAllUserItems(req.body.userid);
  console.log(cleanse)
  res.status(200).json(cleanse).end();
});

server.get("/listUpdate/:userid/", async function (req, res) {
    let cipherItem = await db.retrieveListItems(req.params.userid)
    console.log(cipherItem)
    let Items = [];
    for (let list of cipherItem) {
        let listid = list.listid;
        let userid = list.userid;
        let cont = decrypt(list.listcont, secret);
        Items.push({listid: listid, userid: userid, listCont: cont});
    }
    res.status(200).json(Items).end();
})

//sletter liste
server.post("/deleteUser", async function (req, res) {
  let deletion = await db.deleteList(req.body.listid, req.body.userid)
  console.log(deletion);
  res.status(200).json(deletion).end();
  console.log("Deleted");
});

server.listen(server.get('port'), function () {
  console.log('server running', server.get('port'));
});