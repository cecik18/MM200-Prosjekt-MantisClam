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
    async insertUser(userid, email, password) {
        const client = new pg.Client(this.credentials);
        let results = null;
        try {
            await client.connect();
            results = await client.query('INSERT INTO "public"."Users"("userid", "email", "password") VALUES($1, $2, $3) RETURNING *;', [userid, email, password]);
            results = results.rows[0].message;
            client.end();
        } catch (err) {
            client.end();
            console.log(err);
            results = err;
        }

        return results;
    }

    async retrieveUser(userid, email, password) {
        const client = new pg.Client(this.credentials);
        let results = null;
        try {
            await client.connect();
            results = await client.query('SELECT * from "public"."Users"("userid", "email", "password") VALUES($1, $2, $3) RETURNING *;', [userid, email, password]);
            results = results.rows[0].message;
            client.end();
        } catch (err) {
            client.end();
            results = err;
        }

        return results;
    }


}

module.exports = new StorageHandler(dbCredentials);