
let addNewListButton = document.getElementById("addNewListButton");

//henter fra sessionstorage
let jsontext = sessionStorage.getItem("userData");
let userData = JSON.parse(jsontext);
console.log(userData);

jsontext = sessionStorage.getItem("listData");
let listData = JSON.parse(jsontext);
console.log(listData);

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
    <button id="${index}" class="updateListButton" onclick="updateList(this.id)">View</button>
    `;
    newListDiv.innerHTML = html;

    //Hvis inputfeltet er tomt får man beskjed om at man må angi en tittel
    if (titleOfListInput.value.length < 2) {
        alert("At least 2 characters.");
    } else {
        document.getElementById("container").appendChild(newListDiv);
        if(listData.length > 0){
        lists.push({ listid: lists[lists.length - 1].listid + 1, userid: userData.userid, listtitle: titleOfListInput.value });
        } else {
        lists.push({ listid: index + 1, userid: userData.userid, listtitle: titleOfListInput.value });
        }
        console.log(lists)
        jsontext = JSON.stringify(lists);
        sessionStorage.setItem("listData", jsontext);
        index++;
    }

    let close = document.getElementsByClassName("deleteListButton");
    for (i = 0; i < close.length; i++) {
        close[i].onclick = function (evt) {
            let div = this.parentElement;
            let target = evt.target.id;
            console.log(target);
            lists.splice(target, 1, "OBJECT DELETED");
            console.log(lists);

            let check = lists.indexOf("OBJECT DELETED");
            while (check > -1) {
                lists.splice(check, 1)
                index--;
                check = lists.indexOf("OBJECT DELETED");
            }

            jsontext = JSON.stringify(lists);
            sessionStorage.setItem("listData", jsontext);

            jsontext = sessionStorage.getItem("itemData");
            itemData = JSON.parse(jsontext);
            console.log(itemData);
            sessionStorage.removeItem("itemData")

            let storage = [];

            if (itemData) {

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
    return lists;
}

//save funksjon
function saveChanges() {

    updateListTitle();

    updateListCont();

}

function updateListTitle() {
    //legger nye lister inn i db -------------------------------------------------------------------------------------------------------

    jsontext = sessionStorage.getItem("listData");
    listData = JSON.parse(jsontext);
    console.log(listData)

    if (listData.length > 0) {
        console.log("flere lists")

        for (let list of listData) {

            let body = {
                listid: list.listid,
                userid: userData.userid,
                listtitle: list.listtitle
            }
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
    } else {
        console.log("tom")

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
}

//legger nye lister inn i db -------------------------------------------------------------------------------------------------------
function updateListCont() {

    jsontext = sessionStorage.getItem("itemData");
    itemData = JSON.parse(jsontext);
    console.log(itemData)

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

    if (itemData) {
        console.log("flere items")

        for (let list of itemData) {

            body = {
                listid: list.listid,
                userid: userData.userid,
                listCont: list.listCont
            }
            config = {
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
    <button id="${index}" class="updateListButton" onclick="updateList(this.id)">View</button>
    `;
        newListDiv.innerHTML = html;

        document.getElementById("container").appendChild(newListDiv);
        lists.push({ listid: index + 1, userid: list.userid, listtitle: list.listtitle });
        index++;
    }

    let close = document.getElementsByClassName("deleteListButton");
    for (i = 0; i < close.length; i++) {
        close[i].onclick = function (evt) {
            let div = this.parentElement;
            let target = evt.target.id;
            console.log(target);
            lists.splice(target, 1, "OBJECT DELETED");
            console.log(lists);

            let check = lists.indexOf("OBJECT DELETED");
            while (check > -1) {
                lists.splice(check, 1)
                //importedListId--;
                index--;
                check = lists.indexOf("OBJECT DELETED");
            }

            jsontext = JSON.stringify(lists);
            sessionStorage.setItem("listData", jsontext);

            jsontext = sessionStorage.getItem("itemData");
            itemData = JSON.parse(jsontext);
            console.log(itemData);
            sessionStorage.removeItem("itemData")

            let storage = [];

            if (itemData) {

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


