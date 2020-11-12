const pg = require("pg");
const dbCredentials = process.env.DATABASE_URL || require("../localenv").credentials;

//hva gjør storagehandler? kobler seg til databasen
class StorageHandler {

    constructor(credentials) {
        this.credentials = {
            connectionString: credentials,
            ssl: {
                rejectUnauthorized: false
            }
        };
    }

    //hvor skal brukerinfo legges
    async insertUser(username, password) {
        const client = new pg.Client(this.credentials);
        let results = null;
        try {
            await client.connect();
            results = await client.query('INSERT INTO "Users"("username", "password") VALUES($1, $2) RETURNING *;', [username, password]);
            results = results.rows[0];
            client.end();
        } catch (err) {
            client.end();
            console.log(err);
            results = err;
        }

        return results;
    }

    async retrieveUser(username, password) {
        const client = new pg.Client(this.credentials);
        let results = null;
        try {
            await client.connect();
            results = await client.query('SELECT * FROM "Users" WHERE username=$1 AND password=$2;', [username, password]);
            results = results.rows[0];
            client.end();
        } catch (err) {
            client.end();
            results = err;
        }

        return results;
    }

}

module.exports = new StorageHandler(dbCredentials);