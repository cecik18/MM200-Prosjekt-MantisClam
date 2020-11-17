const database = require("./storagehandler");

class List {
    constructor(listTitle, userid) {
        this.listTitle = listTitle;
        this.userid = userid;
    }

    async createList() {
        try {
            let respons = await database.insertList(this.listTitle, this.userid);
            return respons;
        } catch (error) {
            console.error(error)
        }
    }
}

module.exports = List