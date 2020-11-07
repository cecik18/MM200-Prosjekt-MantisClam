const database = require("./storagehandler")
const {
    encrypt,
    decrypt
} = require("./modules/cesarcipher");
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
        this.password = password;
        this.valid = false
    }

    async create() {
        try {
            let respons = await database.insertUser(this.email, this.password);
        } catch (error) {
            console.error(error)
        }
    }

}


module.exports = User