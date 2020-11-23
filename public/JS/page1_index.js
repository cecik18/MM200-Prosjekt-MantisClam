//Login -------------------------------------------------------------------------------------------------------------------------------------

sessionStorage.clear();

const emailLogin = document.getElementById("loginEmail");
const passwordLogin = document.getElementById("loginPassword");

const loginFeedback = document.getElementById("loginFeedback");
const createFeedback = document.getElementById("createFeedback");


let credentials = null;

loginForm.onsubmit = submit;

async function submit(evt) {

    try {

        //Hindrer form fra å submittes
        evt.preventDefault();

        let username = emailLogin.value
        let password = passwordLogin.value

        //Brukernavn og passord blir omkodet til noe annet
        credentials = "Basic " + window.btoa(`${username}:${password}`)

        let config = {
            method: "GET",
            headers: {
                "content-type": "application/json",
                "authorization": credentials
            }
        }

        //Lagrer userid og går til page 2 om login blir godkjent
        let response = await fetch(`/user`, config)
        console.log(response.status);
        if (response.status === 200) {
            loginFeedback.innerHTML = "Login successful."
        } else if (response.status === 403) {
            loginFeedback.innerHTML = "Incorrect user/password."
        }
        let data = await response.json();
        console.log(data);

        //lagrer data i sessionstorage (sessionstorage fungerer likt som localstorage, men dataen blir slettet etter nettleser lukkes)
        let jsontext = JSON.stringify(data);
        sessionStorage.setItem("userData", jsontext);

        sessionStorage.setItem("fromIndex", true);

        //henter fra sessionstorage
        jsontext = sessionStorage.getItem("userData");
        let userData = JSON.parse(jsontext);
        console.log(userData);

        let userid = userData.userid;

        response = await fetch(`/list/${userid}`, config)
        console.log(response.status);
        data = await response.json();
        console.log(data);

        jsontext = JSON.stringify(data);
        sessionStorage.setItem("listData", jsontext);


        response = await fetch(`/listUpdate/${userid}`, config)
        console.log(response.status);
        data = await response.json();
        console.log(data);

        jsontext = JSON.stringify(data);
        sessionStorage.setItem("itemData", jsontext);

        location.href = "Page2_Lists.html"

    } catch (error) {
        console.error(error)
    }
}

// ------------------------------------------------------------------------------------------------------------------------------------------------

//Create ------------------------------------------------------------------------------------------------------------------------------------

const emailInput = document.getElementById("createEmail");
const passwordInput = document.getElementById("createPassword");

document.getElementById("createBTN").onclick = function (evt) {

    evt.preventDefault();

    if (emailInput.value.length < 3 && passwordInput.value.length < 3) {
        alert("At least 3 characters.");
        return
    }

    let body = {
        username: emailInput.value,
        password: passwordInput.value
    }
    let config = {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "authorization": credentials
        },
        body: JSON.stringify(body)
    }

    fetch("/user", config).then(resp => {
        console.log(resp.status);
        if (resp.status === 200) {
            createFeedback.innerHTML = "User created."
        } else if (resp.status === 409) {
            createFeedback.innerHTML = "User already exists."
        }
    })


}

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------