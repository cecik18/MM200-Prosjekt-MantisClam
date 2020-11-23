
let addNewListButton = document.getElementById("addNewListButton");

//henter fra sessionstorage
let jsontext = sessionStorage.getItem("userData");
let userData = JSON.parse(jsontext);
console.log(userData);

jsontext = sessionStorage.getItem("listData");
let listData = JSON.parse(jsontext);
console.log(listData);

let check = listData.indexOf("OBJECT DELETED");
while (check > -1) {
    listData.splice(check, 1)
    check = listData.indexOf("OBJECT DELETED");
}

jsontext = JSON.stringify(listData);
sessionStorage.setItem("listData", jsontext);

let credentials = null;

function updateList(clicked_id) {

    //Finner id-en til update button som har blitt klikket på
    console.log(clicked_id)

    jsontext = JSON.stringify(clicked_id);
    sessionStorage.setItem("clickedID", jsontext);

    location.href = "Page3_Items.html";
}


addNewListButton.addEventListener('click', function () {
    //console.log("Add new list");
    addNewListDiv();
    //Her blir inputfeltet tomt etter at man trykker på knappen
    document.getElementById("titleOfListInput").value = "";
});

let lists = [];
let index = 0;

let lastListIndex = 0;

//hvis man ikke kommer fra index, aka kommer fra page 3, settes lists til det som allerede er i storage for å fortsette der den ender.
if (!sessionStorage.getItem("fromIndex")) {
    jsontext = sessionStorage.getItem("listData");
    listData = JSON.parse(jsontext);
    lists = listData
}

//setter index til å være største listeid fra listData for å fortsette derfra og unngå dupliseringer.
if (listData.length > 0) {
    let maxStorage = [];
    for (let i = 0; i < listData.length; i++) {
        maxStorage.push(listData[i].listid)
    }
    let maxValue = max(maxStorage)
    lastListIndex = maxValue;
}

function max(array) {
    let max = array[0];
    for (let i = 1; i < array.length; i++) {
        if (array[i] > max) {
            max = array[i];
        }
    }
    return max;
}

//Funksjon for å legge til en ny div når bruker trykker på "add" knappen
function addNewListDiv() {

    //Lager en ny div
    let newListDiv = document.createElement('div');
    newListDiv.id = index;

    //Denne legger til en "class" på div-en 
    newListDiv.classList.add("allLists");

    //Legger inn html som skal være med i div-en
    let html = `
    <p>${titleOfListInput.value}</p>
    <button id="${index}" class="deleteListButton"">Delete</button>
    <button id="${index}" class="updateListButton" onclick="updateList(this.id)">Open</button>
    `;
    newListDiv.innerHTML = html;

    //Hvis inputfeltet er tomt får man beskjed om at man må angi en tittel
    if (titleOfListInput.value.length < 2) {
        alert("At least 2 characters.");
    } else {
        document.getElementById("container").appendChild(newListDiv);
        lists.push({ listid: lastListIndex + 1, userid: userData.userid, listtitle: titleOfListInput.value });
        console.log(lists)
        lastListIndex++;
        index++;
    }

    let deleteOnClick = document.getElementsByClassName("deleteListButton");
    for (i = 0; i < deleteOnClick.length; i++) {
        deleteOnClick[i].onclick = function (evt) {
            let div = this.parentElement;
            let target = evt.target.id;
            console.log(target);
            lists.splice(target, 1, "OBJECT DELETED");
            console.log(lists);

            jsontext = JSON.stringify(lists);
            sessionStorage.setItem("listData", jsontext);

            jsontext = sessionStorage.getItem("itemData");
            itemData = JSON.parse(jsontext);
            console.log(itemData);
            sessionStorage.removeItem("itemData")

            let storage = [];

            if (itemData) {

                //Hvis en liste fjernes fra sessionstorage fjernes også items i den lista
                for (let i = 0; i < lists.length; i++) {
                    for (let j = 0; j < itemData.length; j++) {
                        if (lists[i].listid === itemData[j].listid) {
                            storage.push(itemData[j])
                            jsontext = JSON.stringify(storage);
                            sessionStorage.setItem("itemData", jsontext);
                        }
                    }
                }
            }

            div.style.display = "none";

            sessionStorage.getItem("itemData")
        }
    }
    jsontext = JSON.stringify(lists);
    sessionStorage.setItem("listData", jsontext);
    return lists;
}

//save funksjon
function saveChanges() {

    cleanseLists();

    cleanseItems();

    updateListTitle();

    updateListCont();
}

function cleanseLists() {
    let body = {
        userid: userData.userid
    }
    let config = {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "authorization": credentials
        },
        body: JSON.stringify(body)
    }

    fetch("/cleanseLists", config).then(resp => {
        console.log(resp.status);
    })
}

function cleanseItems() {
    let body = {
        userid: userData.userid
    }
    console.log(body)
    let config = {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "authorization": credentials
        },
        body: JSON.stringify(body)
    }

    fetch("/cleanseItems", config).then(resp => {
        console.log(resp.status);
    })
}

function updateListTitle() {
    //legger nye lister inn i db -------------------------------------------------------------------------------------------------------

    jsontext = sessionStorage.getItem("listData");
    listData = JSON.parse(jsontext);
    console.log(listData)

    if (listData.length > 0) {
        console.log("flere lists")

        for (let list of listData) {

            if (list === "OBJECT DELETED") {
                continue;
            }

            let body = {
                listid: list.listid,
                userid: userData.userid,
                listtitle: list.listtitle
            }
            console.log(body);
            let config = {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "authorization": credentials
                },
                body: JSON.stringify(body)
            }

            fetch("/list", config).then(resp => {
                console.log(resp.status);
            })
        }
    }
}

//legger nye lister inn i db -------------------------------------------------------------------------------------------------------
function updateListCont() {

    jsontext = sessionStorage.getItem("itemData");
    itemData = JSON.parse(jsontext);
    console.log(itemData)

    if(itemData.length > 0) {

        for (let list of itemData) {

            if (list === "OBJECT DELETED") {
                continue;
            }

            let body = {
                listid: list.listid,
                userid: userData.userid,
                listCont: list.listCont
            }
            let config = {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "authorization": credentials
                },
                body: JSON.stringify(body)
            }
            console.log(body)

            fetch("/listUpdate", config).then(resp => {
                console.log(resp.status);
            })
        }
    }
}

storedItems();
function storedItems() {

    lists = []

    jsontext = sessionStorage.getItem("userData");
    userData = JSON.parse(jsontext);

    jsontext = sessionStorage.getItem("listData");
    listData = JSON.parse(jsontext);

    for (let list of listData) {

        if (!list.listid) {
            continue;
        }

        let newListDiv = document.createElement('div');
        newListDiv.id = index;

        //Denne legger til en "class" på div-en 
        newListDiv.classList.add("allLists");

        //Legger inn html som skal være med i div-en
        let html = `
    <p>${list.listtitle}</p>
    <button id="${index}" class="deleteListButton"">Delete</button>
    <button id="${index}" class="updateListButton" onclick="updateList(this.id)">Open</button>
    `;
        newListDiv.innerHTML = html;

        document.getElementById("container").appendChild(newListDiv);
        lists.push({ listid: list.listid, userid: list.userid, listtitle: list.listtitle });
        index++;
    }

    let deleteOnClick = document.getElementsByClassName("deleteListButton");
    for (i = 0; i < deleteOnClick.length; i++) {
        deleteOnClick[i].onclick = function (evt) {
            let div = this.parentElement;
            let target = evt.target.id;
            console.log(target);
            lists.splice(target, 1, "OBJECT DELETED");
            console.log(lists);

            jsontext = JSON.stringify(lists);
            sessionStorage.setItem("listData", jsontext);

            jsontext = sessionStorage.getItem("itemData");
            itemData = JSON.parse(jsontext);
            console.log(itemData);
            sessionStorage.removeItem("itemData")

            let storage = [];

            if (itemData) {

                //Hvis en liste fjernes fra sessionstorage fjernes også items i den lista
                for (let i = 0; i < lists.length; i++) {
                    for (let j = 0; j < itemData.length; j++) {
                        if (lists[i].listid === itemData[j].listid) {
                            storage.push(itemData[j])
                            jsontext = JSON.stringify(storage);
                            sessionStorage.setItem("itemData", jsontext);
                        }
                    }
                }
            }

            div.style.display = "none";

            sessionStorage.getItem("itemData")
        }
    }
    if (sessionStorage.getItem("fromIndex")) {
        jsontext = JSON.stringify(lists);
        sessionStorage.setItem("listData", jsontext);
    }
    return lists;
}



//"hindrer" forbipassering av login (aka skrive inn url selv)
if (!userData) {
    location.href = "index.html"
}

//sign out------------------------------------------------------------------------------------------------------------
document.getElementById("signOutButton").onclick = function (evt) {

    sessionStorage.clear();

    location.href = "index.html";
}
//-------------------------------------------------------------------------------------------------------------

//Delete user
document.getElementById("deleteUserButton").onclick = async function (evt) {

    try {

        let confirmation = prompt('Confirm action by typing: "DELETE USER"');
        console.log(confirmation);

        if (confirmation === "DELETE USER") {

            let body = {
                username: userData.username,
                userid: userData.userid
            }
            let config = {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "authorization": credentials
                },
                body: JSON.stringify(body)
            }
            console.log(config);

            fetch("/deleteUser", config).then(resp => {
                console.log(resp.status);
            })
            sessionStorage.clear();
            location.href = "index.html"
        }

    } catch (error) {
        console.error(error)
    }
}


