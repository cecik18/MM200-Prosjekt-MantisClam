//henter fra sessionstorage
        let jsontext = sessionStorage.getItem("userData");
        let userData = JSON.parse(jsontext);
        console.log(userData);
        let credentials = null;

        //henter fra sessionstorage
        jsontext = sessionStorage.getItem("listData");
        let listData = JSON.parse(jsontext);
        console.log(listData);

        //henter fra sessionstorage
        jsontext = sessionStorage.getItem("clickedID");
        let clickedID = JSON.parse(jsontext);
        console.log(clickedID);

        //henter fra sessionstorage
        jsontext = sessionStorage.getItem("itemData");
        let itemData = JSON.parse(jsontext);
        console.log(itemData);

        let newListItemInput = document.getElementById("newListItemInput");
        // --------------------------------------------------------------------------------------------------------------------------------------------------



        // Lager nytt liste objekt og legger det i sessionstorage -------------------------------------------------------------------------------------
        let tasks = [];
        let index = 0;

        function NewListItem() {
            let li = document.createElement("li");
            let inputValue = document.getElementById("newListItemInput").value;
            let t = document.createTextNode(inputValue);
            let htmlDelete = '<button id="' + index + '" class="deleteListItemButton">Delete list item</button>';  //Delete knapp
            li.innerHTML = htmlDelete;
            li.appendChild(t);
            if (inputValue.length < 2) {
                alert("At least 2 characters.");
            } else {
                document.getElementById("listOfListItems").appendChild(li);
                tasks.push({ listid: listData[clickedID].listid, userid: userData.userid, listCont: inputValue });
                console.log(tasks);

                let temp = tasks.concat(itemData);
                jsontext = JSON.stringify(temp);
                sessionStorage.setItem("itemData", jsontext);

                index++;
            }
            document.getElementById("newListItemInput").value = "";

            var close = document.getElementsByClassName("deleteListItemButton");
            for (i = 0; i < close.length; i++) {
                close[i].onclick = function (evt) {
                    let div = this.parentElement;
                    let target = evt.target.id;
                    tasks.splice(target, 1, "OBJECT DELETED");
                    console.log(tasks.length);
                    console.log(tasks);

                    div.style.display = "none";
                }
            }
            return tasks;
        }

        //--------------------------------------------------------------------------------------------------------------------------------

        //save and exit funksjon------------------------------------------------------------------------------------------------------------
        function saveChanges() {

            let check = tasks.indexOf("OBJECT DELETED");
            while (check > -1) {
                tasks.splice(check, 1)
                check = tasks.indexOf("OBJECT DELETED");
            }

            if (tasks.length > 0) {

                for (let list of tasks) {

                    let body = {
                        listid: listData[clickedID].listid,
                        userid: userData.userid,
                        listCont: list.listCont
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

                    fetch("/listUpdate", config).then(resp => {
                        console.log(resp.status);
                    })
                }
            } else {
                let body = {
                    listid: listData[clickedID].listid,
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

                fetch("/deleteItems", config).then(resp => {
                    console.log(resp.status);
                })
            }

            sessionStorage.removeItem("clickedID");
            location.href = "../Page2_Lists.html";
        }
        //----------------------------------------------------------------------------------------------------------------------------------------------------


        //Lager listene som er i databasen allerede------------------------------------------------------------------------------------------------------------

        if (listData.length > 0) {
            storedItems();
        }

        async function storedItems() {
            try {

                jsontext = sessionStorage.getItem("itemData");
                itemData = JSON.parse(jsontext);
                console.log(itemData);

                let storage = [];

                for (let i = 0; i < itemData.length; i++) {
                    if (itemData[i].listid === listData[clickedID].listid) {
                        storage.push(itemData[i])
                    }
                }
                let items = storage;

                for (let item of items) {

                    let li = document.createElement("li");
                    let inputValue = item.listCont;
                    let t = document.createTextNode(inputValue);
                    let htmlDelete = '<button id="' + index + '" class="deleteListItemButton">Delete list item</button>';
                    li.innerHTML = htmlDelete;
                    li.appendChild(t);
                    document.getElementById("listOfListItems").appendChild(li);
                    tasks.push({ listid: item.listid, userid: userData.userid, listCont: inputValue });
                    console.log(tasks)

                    index++;

                }

                var close = document.getElementsByClassName("deleteListItemButton");
                for (i = 0; i < close.length; i++) {
                    close[i].onclick = function (evt) {
                        let div = this.parentElement;
                        let target = evt.target.id;
                        tasks.splice(target, 1, "OBJECT DELETED");
                        console.log(tasks.length);
                        console.log(tasks);
                        div.style.display = "none";
                    }
                }
                return tasks;
            }
            catch (err) {
                console.log(err);
            }
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

        //Delete user------------------------------------------------------------------------------------------------------------
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