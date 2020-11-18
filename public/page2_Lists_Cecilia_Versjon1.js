
let addNewListButton = document.getElementById("addNewListButton");

//henter fra sessionstorage
jsontext = sessionStorage.getItem("userData");
let userData = JSON.parse(jsontext);
console.log(userData);

jsontext = sessionStorage.getItem("listData");
let listData = JSON.parse(jsontext);
console.log(listData);


let credentials = null;


        

addNewListButton.addEventListener('click', function (evt) {
    //console.log("Add new list");
    addNewListDiv();
    //Her blir inputfeltet tomt etter at man trykker på knappen
    document.getElementById("titleOfListInput").value = "";
});

let lists = [];
let index = 0;
let lastElement;

if (listData = null) {
lastElement = listData[listData.length - 1].listid;
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
    <button id="${index}" class="updateListButton" onclick="updateList(this.id)">Update</button>
    `;
    newListDiv.innerHTML = html;

    //Hvis inputfeltet er tomt får man beskjed om at man må angi en tittel
    if (titleOfListInput.value === '') {
        alert("You must give the list a title");
    } else {
        document.getElementById("container").appendChild(newListDiv);
        console.log(lastElement)
        lists.push({listid: lastElement, userid: userData.userid, listtitle: titleOfListInput.value});
        lastElement++;
        index++;
    }

    var close = document.getElementsByClassName("deleteListButton");
            for (i = 0; i < close.length; i++) {
              close[i].onclick = function(evt) {
                let div = this.parentElement;
                let target = evt.target.id;
                console.log(target);
                lists.splice(target, 1, "OBJECT DELETED");
                console.log(lists);
                div.style.display = "none";
            }
        }
        return lists;
}

//save and exit funksjon
  function saveChanges() {
      let check = lists.indexOf("OBJECT DELETED");
      while (check > -1) {
        lists.splice(check, 1)
        index--;
        check = lists.indexOf("OBJECT DELETED");
      }

        let jsontext = JSON.stringify(lists);
        sessionStorage.setItem("listData", jsontext);

        updateListCont();
  }

  async function updateListCont() {
      try {
           //legger nye lister inn i db -------------------------------------------------------------------------------------------------------
            
           jsontext = sessionStorage.getItem("listData");
           listData = JSON.parse(jsontext);
           console.log(listData)

           for (let list of lists) {
            
            let body = {
                userid: list.userid,
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
      } catch (error) {
          console.error(error)
      }
  }

//Er litt usikker på hvordan dette skal gjøres videre
async function updateList (clicked_id) {

    jsontext = JSON.stringify(listData[clicked_id]);
    sessionStorage.setItem("listData", jsontext);

    try {

        let userid = userData.userid;
        let listid = listData[clicked_id].listid;

        let config = {
            method: "GET",
            headers: {
                "content-type": "application/json",
                "authorization": credentials
            }
        }

            let response = await fetch(`/listUpdate/${listid}/${userid}`, config)
            console.log(response.status);
            let data = await response.json();
            console.log(data);

            let jsontext = JSON.stringify(data);
            sessionStorage.setItem("itemData", jsontext);
        
        } catch (error) {
            console.error(error)
        }


    //Finner id-en til update button som har blitt klikket på
    console.log(clicked_id)

    //Denne skal nok endres på
    location.href = "page3_Cecilia_Versjon1_Nora1.html";
}

storedItems();
async function storedItems() {
    try {
        jsontext = sessionStorage.getItem("userData");
        userData = JSON.parse(jsontext);

        jsontext = sessionStorage.getItem("listData");
        listData = JSON.parse(jsontext);

        for (let list of listData) {

    let newListDiv = document.createElement('div');
    newListDiv.id = index;

    //Denne legger til en "class" på div-en 
    newListDiv.classList.add("allLists");

    //Legger inn html som skal være med i div-en
    let html = `
    <p>${list.listtitle}</p>
    <button id="${index}" class="deleteListButton"">Delete</button>
    <button id="${index}" class="updateListButton" onclick="updateList(this.id)">Update</button>
    `;
    newListDiv.innerHTML = html;

        document.getElementById("container").appendChild(newListDiv);
        lists.push({listid: list.listid, userid: list.userid, listtitle: list.listtitle});
        index++;
    }

    var close = document.getElementsByClassName("deleteListButton");
            for (i = 0; i < close.length; i++) {
              close[i].onclick = function(evt) {
                let div = this.parentElement;
                let target = evt.target.id;
                console.log(target);
                lists.splice(target, 1, "OBJECT DELETED");
                console.log(lists);
                div.style.display = "none";
            }
        }
        return lists;

    } catch (error) {
        console.error(error)
    }
}

// STIAN -------------------------------------------------------------------------------------

let titleOfListInput = document.getElementById('titleOfListInput');


        //"hindrer" forbipassering av login (aka skrive inn url selv)
        if(!userData || !listData) {
          location.href = "index.html"
        }
        
        //---------------------------------------------------------------------------------------------------------------------------------



