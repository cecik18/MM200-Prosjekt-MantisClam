const { use } = require("./secureEndpoints");
const database = require("./storagehandler")

class List {
    constructor(listTitle, listCont, userid) {
        this.listTitle = listTitle;
        this.listCont = listCont;
        this.userid = userid;
    }

    async createList() {
        try {
            let respons = await database.insertList(this.listTitle, this.listCont, this.userid);
            return respons;
        } catch (error) {
            console.error(error)
        }
    }
}

module.exports = List