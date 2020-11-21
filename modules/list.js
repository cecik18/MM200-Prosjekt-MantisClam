const database = require("./storagehandler");

class List {
    constructor(listid, userid, listTitle) {
        this.listid = listid;
        this.userid = userid;
        this.listTitle = listTitle;
    }

    async createList() {
        try {
            let respons = await database.insertList(this.listid, this.userid, this.listTitle,);
            return respons;
        } catch (error) {
            console.error(error)
        }
    }
}

module.exports = List