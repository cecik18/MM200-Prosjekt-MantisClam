const database = require("./storagehandler")
const crypto = require('crypto');
const secret = process.env.hashSecret || require("../localenv").hashSecret;

class User {
    constructor(username, password) {
        this.username = username;
        this.password = crypto.createHmac('sha256', secret) //her krypteres passord, secret må stemme for å dekryptere
            .update(password)
            .digest('hex');
        this.valid = false;
    }

    async createUser() {
        try {
            let respons = await database.insertUser(this.username, this.password);
            return respons;
        } catch (error) {
            console.error(error)
        }
    }
}

module.exports = User