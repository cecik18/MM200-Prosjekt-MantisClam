const express = require('express');
const bodyParser = require('body-parser');
const server = express();

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  client.end();
});

server.use(bodyParser.json());
server.use(express.static('public'));

/* ************************************** */
server.set('port', (process.env.PORT || 8080));
server.listen(server.get('port'), function() {
    console.log('server running', server.get('port'));
});