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

    //henter user fra db
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

    //henter kun username for å sjekke om det allerede finnes i db
    async retrieveUsername(username) {
        const client = new pg.Client(this.credentials);
        let results = null;
        try {
            await client.connect();
            results = await client.query('SELECT * FROM "Users" WHERE username=$1;', [username]);
            results = results.rows[0];
            client.end();
        } catch (err) {
            client.end();
            results = err;
        }

        return results;
    }

    //Sletter bruker fra db
    async deleteUser(userid, username) {
        const client = new pg.Client(this.credentials);
        let deletion = null;
        try {
            await client.connect();
            deletion = await client.query('DELETE FROM "Users" WHERE userid=$1 AND username=$2;', [userid, username]);
            deletion = await client.query('DELETE FROM "Lists" WHERE userid=$1;', [userid]);
            deletion = await client.query('DELETE FROM "ListItems" WHERE userid=$1;', [userid]);
            client.end();
        } catch (err) {
            client.end();
        }

        return;
    }

    //legger inn listeinfo
    async insertList(listid, userid, listTitle) {
        const client = new pg.Client(this.credentials);
        let results = null;
        try {
            await client.connect();
            results = await client.query('INSERT INTO "Lists"("listid", "userid", "listtitle") VALUES($1, $2, $3) RETURNING *;', [listid, userid, listTitle]);
            results = results.rows;
            client.end();
        } catch (err) {
            client.end();
            console.log(err);
            results = err;
        }

        return results;
    }

    //henter liste
    async retrieveList(userid) {
        const client = new pg.Client(this.credentials);
        let results = null;
        try {
            await client.connect();
            results = await client.query('SELECT * FROM "Lists" WHERE userid=$1;', [userid]);
            results = results.rows;
            client.end();
        } catch (err) {
            client.end();
            results = err;
        }

        return results;
    }

    //Oppdaterer list content
    async updateContent(listid, userid, listCont) {
        const client = new pg.Client(this.credentials);
        let results = null;
        try {
            await client.connect();
            results = await client.query('INSERT INTO "ListItems"("listid", "userid", "listcont") VALUES($1, $2, $3) RETURNING *;', [listid, userid, listCont]);
            results = results.rows;
            client.end();
        } catch (err) {
            client.end();
            console.log(err);
            results = err;
        }

        return results;
    }

    //Renser opp
    async removeUnwantedItems(listid, userid) {
        const client = new pg.Client(this.credentials);
        let deletion = null;
        try {
            await client.connect();
            deletion = await client.query('DELETE FROM "ListItems" WHERE listid=$1 AND userid=$2;', [listid, userid]);
            client.end();
        } catch (err) {
            client.end();
            console.log(err);
        }

        return;
    }

    async removeAllUnwantedItems(userid) {
        const client = new pg.Client(this.credentials);
        let deletion = null;
        try {
            await client.connect();
            deletion = await client.query('DELETE FROM "ListItems" WHERE userid=$1;', [userid]);
            client.end();
        } catch (err) {
            client.end();
            console.log(err);
        }

        return;
    }

    async removeAllUserItems(userid) {
        const client = new pg.Client(this.credentials);
        let deletion = null;
        try {
            await client.connect();
            deletion = await client.query('DELETE FROM "ListItems" WHERE userid=$1;', [userid]);
            client.end();
        } catch (err) {
            client.end();
            console.log(err);
        }

        return;
    }

    //Renser opp
    async removeUnwantedLists(userid) {
        const client = new pg.Client(this.credentials);
        let deletion = null;
        try {
            await client.connect();
            deletion = await client.query('DELETE FROM "Lists" WHERE userid=$1;', [userid]);
            client.end();
        } catch (err) {
            client.end();
            console.log(err);
        }

        return;
    }

    //henter listeitems
    async retrieveListItems(userid) {
        const client = new pg.Client(this.credentials);
        let results = null;
        try {
            await client.connect();
            results = await client.query('SELECT * FROM "ListItems" WHERE userid=$1;', [userid]);
            results = results.rows;
            client.end();
        } catch (err) {
            client.end();
            results = err;
        }

        return results;
    }

    //sletter liste
    async deleteList(listid, userid) {
        const client = new pg.Client(this.credentials);
        let results = null;
        try {
            await client.connect();
            results = await client.query('DELETE FROM "Lists" WHERE listid=$1 AND userid=$2;', [listid, userid]);
            results = results.rows;
            client.end();
        } catch (err) {
            client.end();
            results = err;
        }

        return results;
    }
}

module.exports = new StorageHandler(dbCredentials);