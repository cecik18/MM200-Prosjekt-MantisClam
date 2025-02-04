//henter fra sessionstorage
let jsontext = sessionStorage.getItem("userData");
let userData = JSON.parse(jsontext);
console.log(userData);
let credentials = null;

sessionStorage.removeItem("fromIndex")

//henter fra sessionstorage
jsontext = sessionStorage.getItem("listData");
let listData = JSON.parse(jsontext);
console.log(listData);

//henter fra sessionstorage
jsontext = sessionStorage.getItem("itemData");
let itemData = JSON.parse(jsontext);
console.log(itemData);

//henter fra sessionstorage
jsontext = sessionStorage.getItem("clickedID");
let clickedID = JSON.parse(jsontext);
console.log(clickedID);

//henter fra sessionstorage
jsontext = sessionStorage.getItem("selectedList");
let selectedList = JSON.parse(jsontext);
console.log(selectedList);

let newListItemInput = document.getElementById("newListItemInput");

let titleOfList = document.getElementById("titleOfList")
titleOfList.innerHTML = listData[clickedID].listtitle;
// --------------------------------------------------------------------------------------------------------------------------------------------------



// Lager tomt array for items. hvis selectedList eksisterer (aka det finnes innhold i databasen eller sessionstorage), setter array til å være lik det for å fortsette derfra
let items = []; 
if (selectedList) {
    items = selectedList;
}
let index = 0;

//Lager nytt item i listen ved å trykke på knappen add list item
function NewListItem() {
    let list = document.createElement("li");
    list.id = index;
    let inputValue = document.getElementById("newListItemInput").value;
    let textNode = document.createTextNode(inputValue);
    let htmlDelete = '<button id="' + index + '" class="deleteListItemButton">Delete list item</button>';  //Delete knapp
    list.innerHTML = htmlDelete;
    list.appendChild(textNode);
    if (inputValue.length < 2) {
        alert("At least 2 characters.");
    } else {
        document.getElementById("listOfListItems").appendChild(list);
        items.push({ listid: listData[clickedID].listid, userid: userData.userid, listCont: inputValue }); //dytter data om listen inn i items array
        console.log(items);
        jsontext = JSON.stringify(items);
        sessionStorage.setItem("selectedList", jsontext);
        index++;
    }
    document.getElementById("newListItemInput").value = "";

    //lukke funksjon, erstatter array ojektet med "OBJECT DELETED"
    let deleteOnClick = document.getElementsByClassName("deleteListItemButton");
    for (i = 0; i < deleteOnClick.length; i++) {
        deleteOnClick[i].onclick = function (evt) {
            let div = this.parentElement;
            let target = evt.target.id;
            items.splice(target, 1, "OBJECT DELETED");
            console.log(target);
            console.log(items.length);
            console.log(items);
            jsontext = JSON.stringify(items);
            sessionStorage.setItem("selectedList", jsontext);
            div.style.display = "none";
        }
    }

    return items;
}

//--------------------------------------------------------------------------------------------------------------------------------

//save and exit funksjon------------------------------------------------------------------------------------------------------------
function saveChanges() {

    
    console.log(itemData);
    itemData = itemData.concat(items);
    console.log(itemData);

    jsontext = JSON.stringify(itemData);
    sessionStorage.setItem("itemData", jsontext);

    sessionStorage.removeItem("clickedID");

    sessionStorage.removeItem("selectedList");

    location.href = "../Page2_Lists.html";
}
//----------------------------------------------------------------------------------------------------------------------------------------------------


//Lager listene som er i databasen allerede--------------------omtrent samme funksjon som newListItem men litt andre variabler-----------------------------------------

// hvis selectedList har items i seg, lag de
if (selectedList.length > 0) {
    storedItems();
}


function storedItems() {

    items = [];

    jsontext = sessionStorage.getItem("selectedList");
    selectedList = JSON.parse(jsontext);
    console.log(selectedList);

    for (let item of selectedList) {
        if (item.listid === listData[clickedID].listid) {
            let list = document.createElement("li");
            list.id = index;
            let inputValue = item.listCont;
            let textNode = document.createTextNode(inputValue);
            let htmlDelete = '<button id="' + index + '" class="deleteListItemButton">Delete list item</button>';
            list.innerHTML = htmlDelete;
            list.appendChild(textNode);
            document.getElementById("listOfListItems").appendChild(list);
            items.push({ listid: item.listid, userid: userData.userid, listCont: inputValue });
            console.log(items)
            index++;
        }
    }

    let deleteOnClick = document.getElementsByClassName("deleteListItemButton");
    for (i = 0; i < deleteOnClick.length; i++) {
        deleteOnClick[i].onclick = function (evt) {
            let div = this.parentElement;
            let target = evt.target.id;
            items.splice(target, 1, "OBJECT DELETED");
            console.log(target);
            console.log(items.length);
            console.log(items);
            jsontext = JSON.stringify(items);
            sessionStorage.setItem("selectedList", jsontext);
            div.style.display = "none";
        }
    }
    return items;
}
//------------------------------------------------------------------------------------------------------------

//"hindrer forbipassering av login"
if (!userData) {
    location.href = "index.html"
}


//sign out------------------------------------------------------------------------------------------------------------
document.getElementById("signOutButton").onclick = function (evt) {

    sessionStorage.clear();

    location.href = "index.html";
}
//-------------------------------------------------------------------------------------------------------------

// her starter koden for Delete user---------------------------------------------------------------------------
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
      //------------------------------------------------------------------------------------------------------------