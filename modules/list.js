const database = require("./storagehandler");

class List {
    constructor(userid, listTitle) {
        this.listTitle = listTitle;
        this.userid = userid;
    }

    async createList() {
        try {
            let respons = await database.insertList(this.userid, this.listTitle,);
            return respons;
        } catch (error) {
            console.error(error)
        }
    }
}

module.exports = List