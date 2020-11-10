const database = require("./storagehandler")
const crypto = require('crypto');
const secret = process.env.hashSecret || require("../localenv").hashSecret;
/*
const secret = 'abcdefg';
const hash = crypto.createHmac('sha256', secret)
                   .update('I love cupcakes')
                   .digest('hex');
*/
class User {
    constructor(email, password) {
        this.email = email;
        this.password = crypto.createHmac('sha256', secret) //her krypteres passord, secret må stemme for å dekryptere
            .update(password)
            .digest('hex');
            this.userid = crypto.createHmac('sha256', secret) //her krypteres userid, secret må stemme for å dekryptere
            .update(email)
            .digest('hex');
        this.valid = false
    }

    async create() {
        try {
            let respons = await database.insertUser(this.userid, this.email, this.password);
        } catch (error) {
            console.error(error)
        }
    }

}


module.exports = User