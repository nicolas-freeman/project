//// INITIALISATION ////

var user = {};
if (sessionStorage.getItem('user') == null) { // Si non connecté
} else { // Si connecté
    user = JSON.parse(sessionStorage.getItem('user'));
}
var slider = 0;
var output = 0;

$("#navLoginCard").toggle();
$("#navLoginCard").removeClass("invisible");


checkIfLoggedIn();


if (window.location.href.search("recherche=") > 0) {
    sessionStorage.setItem("searchValue", window.location.href.substr(window.location.href.search("recherche=") + 10, window.location.href.length)) // Tout ce qui est après "?recherche=" est enregistré dans searchValue 
    window.location.href = 'entreprises.html';  //Redirection vers la page entreprises
}


function init() {
    gapi.load('auth2', function () { // Ready. });
        gapi.auth2.init({
            client_id: '86515575791-2qr4ukigk6qrjcotvqp5u04l60k67k4b.apps.googleusercontent.com',
            /*This two lines are important not to get profile info from your users
            fetch_basic_profile: false,
            scope: 'email' */
        });
    });
}

// Lancement de la recherche si on est sur la page entreprises et qu'il y a une recherche à lancer...
function initSearch() {
    console.log("initSearch executed");
    if (sessionStorage.getItem('searchValue') !== null) {
        searchValue = sessionStorage.getItem('searchValue');
        document.getElementById("myInput").value = searchValue;
        console.log("myInput value set!");
        sessionStorage.removeItem('searchValue');
        console.log("Recherche : " + searchValue);
        $(".company").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(searchValue) > -1)
        });
    }
}
if (window.location.href.indexOf('entreprises.html') > 0) {
    initSearch();
}

if ((window.location.href.indexOf('avis.html') > 0) && (window.location.href.indexOf('salary=') > 0)) {
    $("#feedbackSuccessAlert").addClass("collapse.show"); // On affiche l'alerte de succès de feedback si elle n'était pas affichée
    $("#feedbackSuccessAlert").removeClass("collapse"); // On affiche l'alerte de succès de feedback si elle n'était pas affichée
}

// BARRE DE NAVIGATION

// Si on clique en dehors du navLoginCard, on cache le navLoginCard
$("html").click(function (e) {
    if (e.target.id != "navLoginCard" && e.target.id != "nav-profile-img") {
        //console.log("You clicked outside navLoginCard and navProfileImg");
        $("#navLoginCard").toggle(false);
        console.log(e.target.id);
    } else {
        //console.log('You clicked inside navLoginCard');
    }
});

$("#nav-profile-img").click(function () {
    $("#navLoginCard").toggle();
});

// Une fois la page chargée...
// window.onload = nomdefonction();


// REPAIR BROKEN IMAGES

function imgError(image) {
    image.onerror = "";
    image.src = "./images/noimage.png";
    return true;
}


// NOUVEAU SCRIPT LOGIN

var googleUser = {};
var startApp = function () {
    console.log("executing startApp...");
    gapi.load('auth2', function () {
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        auth2 = gapi.auth2.init({
            client_id: '86515575791-2qr4ukigk6qrjcotvqp5u04l60k67k4b.apps.googleusercontent.com',
            cookiepolicy: 'single_host_origin',
            // Request scopes in addition to 'profile' and 'email'
            //scope: 'additional_scope'
        });
        onSignin(document.getElementById('customBtn'));
    });
};

function onSignin(element) {
    console.log("executing onSignin...");
    auth2.attachClickHandler(element, {},
        function signedIn(googleUser) {
            console.log("signedIn");
            $("#loggedOutAlert").removeClass("collapse.show"); // On cache l'alerte de déconnexion si elle était affichée
            $("#loggedOutAlert").addClass("collapse"); // On cache l'alerte de déconnexion si elle était affichée
            document.getElementById('name').innerText = "Connecté en tant que " +
                googleUser.getBasicProfile().getName();
            // Récupération des infos de l'utilisateur
            var profile = googleUser.getBasicProfile();
            console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
            user.ID = profile.getId();
            console.log('Name: ' + profile.getName());
            user.name = profile.getName();
            console.log('Image URL: ' + profile.getImageUrl());
            user.photoURL = profile.getImageUrl();
            console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
            user.email = profile.getEmail();

            // Stockage des infos dans sessionStorage, qui sera accessible depuis n'importe quelle page du site
            sessionStorage.setItem('user', JSON.stringify(user));

            // Mise à jour de la barre de navigation pour prendre en compte la connexion
            log.innerHTML = log.innerHTML.replace("Connexion", "Déconnexion"); // On modifie le texte du bouton
            log.href = "login.html"; // On modifie le lien du bouton | To update
            document.getElementById('profile-img').src = user.photoURL; // On remplace l'image de profil de la page
            document.getElementById('nav-profile-img').src = user.photoURL; // On remplace l'image de profil de la barre de navigation
            $("#logoutButton").addClass("collapse.show"); // On affiche le bouton de déconnexion
            $("#logoutButton").removeClass("collapse"); // On affiche le bouton de déconnexion
            console.log("Bouton de déconnexion affiché");

            if (sessionStorage.getItem('user') !== null && user.email.split("@").pop() !== "essec.edu") { // Si connecté avec un compte non ESSEC
                $("#notESSECAlert").addClass("collapse.show"); // On affiche l'alerte demandant la connexion avec un compte ESSEC
                $("#notESSECAlert").removeClass("collapse"); // On affiche l'alerte demandant la connexion avec un compte ESSEC
                console.log("Alerte de connexion avec un compte non ESSEC affichée");
            }

            // Redirection vers l'accueil du site
            // window.location.href = 'index.html';

            console.log("endOfSignIn");
        }, function (error) {
            alert(JSON.stringify(error, undefined, 2));
        });
}


// FONCTIONS

function checkIfLoggedIn() {
    if (sessionStorage.getItem('user') == null && window.location.href.indexOf('login.html') < 0) { // Si non connecté et pas sur la page de connexion
        // Redirection vers la page de connexion
        window.location.href = 'login.html';
    } else if (sessionStorage.getItem('user') !== null && user.email.split("@").pop() == "essec.edu") { // Si connecté avec un compte ESSEC
        // On ne fait rien
    } else if (sessionStorage.getItem('user') !== null && user.email.split("@").pop() !== "essec.edu" && window.location.href.indexOf('login.html') < 0) { // Si connecté avec un compte non ESSEC et pas sur la page de connexion
        // Redirection vers la page de connexion
        window.location.href = 'login.html';
    } else if (sessionStorage.getItem('user') !== null && user.email.split("@").pop() !== "essec.edu") { // Si connecté avec un compte non ESSEC
        $("#notESSECAlert").addClass("collapse.show"); // On affiche l'alerte demandant la connexion avec un compte ESSEC
        $("#notESSECAlert").removeClass("collapse"); // On affiche l'alerte demandant la connexion avec un compte ESSEC
    }
    else { // Sinon
    }
}

function updateLogin() {

    if (sessionStorage.getItem('user') == null) { // Si non connecté
        var log = document.getElementById("log");
        log.innerHTML = log.innerHTML.replace("Déconnexion", "Connexion"); // On modifie le texte du bouton 
        log.href = "login.html"; // On modifie le lien du bouton
        if (sessionStorage.logOut == "true" && window.location.href.indexOf('login.html') >= 1) { // Si on vient de se déconnecter et sur la page de login
            $("#loggedOutAlert").addClass("collapse.show"); // On affiche l'alerte de déconnexion
            $("#loggedOutAlert").removeClass("collapse"); // On affiche l'alerte de déconnexion
            sessionStorage.setItem('logOut', false); // "On ne vient plus de se déconnecter"
        }
    }
    else { // Si connecté
        document.getElementById('nav-profile-img').src = user.photoURL; // On remplace l'image de profil de la barre de navigation
        document.getElementById('profile-img').src = user.photoURL; // On remplace l'image de profil de la page
        document.getElementById('name').innerText = "Connecté en tant que " + user.name;
        $("#logoutButton").addClass("collapse.show"); // On affiche le bouton de déconnexion
        $("#logoutButton").removeClass("collapse"); // On affiche le bouton de déconnexion
        var log = document.getElementById("log");
        log.innerHTML = log.innerHTML.replace("Connexion", "Déconnexion"); // On modifie le texte du bouton
        log.href = "login.html"; // On modifie le lien du bouton
        if (sessionStorage.getItem('user') !== null && user.email.split("@").pop() !== "essec.edu") { // Si connecté avec un compte non ESSEC
            $("#notESSECAlert").addClass("collapse.show"); // On affiche l'alerte demandant la connexion avec un compte ESSEC
            $("#notESSECAlert").removeClass("collapse"); // On affiche l'alerte demandant la connexion avec un compte ESSEC
        }
    }
}

function precisionRound(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
    sessionStorage.removeItem('user');
    sessionStorage.setItem('logOut', true);
    // Redirection vers la page de connexion
    window.location.href = 'login.html';
}



// RECHERCHE 

$(document).ready(function () {
    $("#myInput").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        console.log("Recherche : " + value);
        $(".company").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});

// Navbar search

var navBarSearchButton = document.getElementById("navBarSearchButton")
function navBarSearch() {
    var itemToSearch = document.getElementById("navBarInput").value;
    console.log("itemToSearch= " + itemToSearch);
    sessionStorage.setItem("searchValue", itemToSearch);
    console.log("sessionStorage.searchValue= " + sessionStorage.searchValue);
    console.log("About to redirect...")
    window.location.href = "entreprises.html";
}

// SLIDERS


if (window.location.href.indexOf('avis.html') > 0) {
    var slider = document.getElementById("feedback-interest");
    var output = document.getElementById("DP");
    output.innerHTML = slider.value;
    slider.oninput = function () {
        output.innerHTML = this.value;
    }
}
if (window.location.href.indexOf('avis.html') > 0) {
    var slidert = document.getElementById("feedback-atmosphere");
    var outputt = document.getElementById("DT");
    outputt.innerHTML = slidert.value;
    slidert.oninput = function () {
        outputt.innerHTML = this.value;
    }
}
if (window.location.href.indexOf('avis.html') > 0) {
    var sliderq = document.getElementById("feedback-premises");
    var outputq = document.getElementById("DQ");
    outputq.innerHTML = sliderq.value;
    sliderq.oninput = function () {
        outputq.innerHTML = this.value;
    }
}
if (window.location.href.indexOf('avis.html') > 0) {
    var sliderc = document.getElementById("feedback-total");
    var outputc = document.getElementById("DC");
    outputc.innerHTML = sliderq.value;
    sliderc.oninput = function () {
        outputc.innerHTML = this.value;
    }
}

// Update the current slider value (each time you drag the slider handle)

// REQUÊTES

// Envoi du formulaire d'avis
function submitFeedback() {
    console.log("submitting feedback...");

    const req = new XMLHttpRequest();

    req.onreadystatechange = function (event) {
        // XMLHttpRequest.DONE === 4
        if (this.readyState === XMLHttpRequest.DONE) {
            if (this.status === 200) {
                // console.log("Réponse reçue: %s", this.responseText);
            } else {
            }
        }

    };

    var content = {}
    content.name = document.getElementById("feedback-company-name").value;
    content.vertical = document.getElementById("feedback-company-vertical").value;
    content.salary = parseInt(document.getElementById("feedback-salary").value);
    content.time = parseInt(document.getElementById("feedback-time").value);
    content.interest = parseInt(document.getElementById("feedback-interest").value);
    content.atmosphere = parseInt(document.getElementById("feedback-atmosphere").value);
    content.premises = parseInt(document.getElementById("feedback-premises").value);
    content.total = parseInt(document.getElementById("feedback-total").value);
    content.email = user.email;
    // console.log("posting " + content);
    // console.log("JSON = " + JSON.stringify(content));
    req.open('POST', '/submitFeedback', true);
    req.setRequestHeader("Content-type", "application/json");
    var data = JSON.stringify(content);
    req.send(data);
}

//Requête de la liste des entreprises
function requestCompanies() {
    // Ici, la requête sera émise de façon asynchrone.
    console.log("sending request...");
    const req = new XMLHttpRequest();

    req.onreadystatechange = function (event) {
        // XMLHttpRequest.DONE === 4
        if (this.readyState === XMLHttpRequest.DONE) {
            if (req.status === 200) {
                // console.log("Réponse reçue: %s", req.responseText);
                //       sessionStorage.setItem("entreprises", req.responseText);
                var parsed = JSON.parse(req.responseText);

                var totalToAdd;
                var companiesList = [];

                parsed.forEach(avis => {
                    if (window[removeDiacritics(avis.name.toLowerCase().replace(" ", ""))] == null) {
                        window[removeDiacritics(avis.name.toLowerCase().replace(" ", ""))] = avis;
                        window[removeDiacritics(avis.name.toLowerCase().replace(" ", ""))].count = 1;
                        companiesList.push(removeDiacritics(avis.name.toLowerCase().replace(" ", "")));
                    }
                    else {
                        window[removeDiacritics(avis.name.toLowerCase().replace(" ", ""))].count++;
                        window[removeDiacritics(avis.name.toLowerCase().replace(" ", ""))].salary += avis.salary;
                        window[removeDiacritics(avis.name.toLowerCase().replace(" ", ""))].time += avis.time;
                        window[removeDiacritics(avis.name.toLowerCase().replace(" ", ""))].interest += avis.interest;
                        window[removeDiacritics(avis.name.toLowerCase().replace(" ", ""))].atmosphere += avis.atmosphere;
                        window[removeDiacritics(avis.name.toLowerCase().replace(" ", ""))].premises += avis.premises;
                        window[removeDiacritics(avis.name.toLowerCase().replace(" ", ""))].total += avis.total;
                    }
                });

                companiesList.forEach(entreprise => {
                    // console.log("element :" + entreprise);
                    window[entreprise].salary /= window[entreprise].count;
                    window[entreprise].time /= window[entreprise].count;
                    window[entreprise].interest /= window[entreprise].count;
                    window[entreprise].atmosphere /= window[entreprise].count;
                    window[entreprise].premises /= window[entreprise].count;
                    window[entreprise].total /= window[entreprise].count;
                    var elementToAdd = `<div class='card company company-small' id='`+removeDiacritics(window[entreprise].name.toLowerCase().replace(" ", ""))+`'>
                    <div class='row'>
                        <div class='col-12'>
                            <div class='row card-top-small'>
                                <img class='card-img-top' src='//logo.clearbit.com/`+ removeDiacritics(window[entreprise].name.toLowerCase().replace(" ", "")) + `.com' alt='Card image cap' onerror='imgError(this);'>
                                <div class='card-title'>
                                    <h5>`+ window[entreprise].name + `</h5>
                                </div>
                            </div>
                            <div class='card-body'>
                                <p class='card-text'>`+ window[entreprise].vertical + `</p>
                            </div>
                        </div>
                    </div>
                    <p class='card-footer'>
                        <small class='text-muted'>`+ window[entreprise].count + ` avis</small>
                    </p>
                </div>`;
                    // console.log("elementToAdd =" + elementToAdd);
                    totalToAdd = (totalToAdd == undefined) ? elementToAdd : totalToAdd + elementToAdd;
                    // console.log("totalToAdd =" + totalToAdd);
                });

                document.getElementById("entreprises").innerHTML = totalToAdd;

                if (document.getElementById("myInput").value !== "") { // On lance la recherche si besoin
                    ("Recherche : " + document.getElementById("myInput").value);
                    $(".company").filter(function () {
                        $(this).toggle($(this).text().toLowerCase().indexOf(document.getElementById("myInput").value) > -1)
                    });
                }

                // Ajout du listener sur chaque entreprise, qui demande le détail lors du clic
                $(".company").click(function (e) {
                    console.log("User clicked on " + e.currentTarget.id);
                    if (e.currentTarget.classList.contains("company-big")) { // Si la card est déjà agrandie, on la remet dans son état initial (petit)
                        e.currentTarget.classList.toggle("company-big");
                        e.currentTarget.classList.toggle("company-small");
                        e.currentTarget.innerHTML = `
            <div class='row'>
                <div class='col-12'>
                    <div class='row card-top-small'>
                        <img class='card-img-top' src='//logo.clearbit.com/`+ removeDiacritics(window[e.currentTarget.id].name.toLowerCase().replace(" ", "")) + `.com' alt='Card image cap' onerror='imgError(this);'>
                        <div class='card-title'>
                            <h5>`+ window[e.currentTarget.id].name + `</h5>
                        </div>
                    </div>
                    <div class='card-body'>
                        <p class='card-text'>`+ window[e.currentTarget.id].vertical + `</p>
                    </div>
                </div>
            </div>
            <p class='card-footer'>
                <small class='text-muted'>`+ window[e.currentTarget.id].count + ` avis</small>
            </p>`;
                    } else { // Si la card n'est pas agrandie,  on agrandit la card
                        e.currentTarget.classList.toggle("company-big");
                        e.currentTarget.classList.toggle("company-small");
                        e.currentTarget.innerHTML = `
                            <div class='row'>
                                <div class='col-12 col-lg-5 col-xl-3'>
                                    <div class='card-top-big'>
                                        <img class='card-img-top' src='//logo.clearbit.com/`+ removeDiacritics(window[e.currentTarget.id].name.toLowerCase().replace(" ", "")) + `.com' alt='Card image cap' onerror='imgError(this);'>
                                        <div class='card-title'>
                                            <h5>`+ window[e.currentTarget.id].name + `</h5>
                                        </div>
                                    </div>
                                    <div class='card-body'>
                                        <p class='card-text'>`+ window[e.currentTarget.id].vertical + `</p>
                                    </div>
                                </div>
                                <div class='col-12 col-lg-6 col-xl-9 grades'>
                                    <div class='row'>
                                        <div class='col-12 col-md-7 grade-col'>
                                            <p>Indemnité mensuelle brute</p>
                                        </div>
                                        <div class='col-9 col-lg-4 grade-col'>
                                            <div class='progress'>
                                                <div class='progress-bar salary-bar' role='progressbar' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100' style='width: 0%; background-color: orange;'>
                                                    <span class='sr-only'>0% Complete</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class='col-3 col-lg-1 grade-col score-col'>
                                            <p></p>
                                            <div class='salary'>0€</div>
                                            <p></p>
                                        </div>
                                    </div>
                                    <div class='row'>
                                        <div class='col-12 col-lg-7 grade-col'>
                                            <p>Durée moyenne d'une journée de travail</p>
                                        </div>
                                        <div class='col-9 col-lg-4 grade-col'>
                                            <div class='progress'>
                                                <div class='progress-bar time-bar' role='progressbar' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100' style='width: 0%; background-color: gray;'>
                                                    <span class='sr-only'>0% Complete</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class='col-3 col-lg-1 grade-col score-col'>
                                            <p></p>
                                            <div class='time'>0h</div>
                                            <p></p>
                                        </div>
                                    </div>
                                    <div class='row'>
                                        <div class='col-12 col-lg-7 grade-col'>
                                            <p>Intérêt des missions proposées</p>
                                        </div>
                                        <div class='col-9 col-lg-4 grade-col'>
                                            <div class='progress'>
                                                <div class='progress-bar interest-bar' role='progressbar' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100' style='width: 0%; background-color: orange;'>
                                                    <span class='sr-only'>0% Complete</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class='col-3 col-lg-1 grade-col interest-grade score-col'>
                                            <p>0/20 </p>
                                        </div>
                                    </div>
                                    <div class='row'>
                                        <div class='col-12 col-lg-7 grade-col'>
                                            <p>Ambiance</p>
                                        </div>
                                        <div class='col-9 col-lg-4 grade-col'>
                                            <div class='progress'>
                                                <div class='progress-bar atmosphere-bar' role='progressbar' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100' style='width: 0%; background-color: orange;'>
                                                    <span class='sr-only'>0% Complete</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class='col-3 col-lg-1 grade-col atmosphere-grade score-col'>
                                            <p>0/20 </p>
                                        </div>
                                    </div>
                                    <div class='row'>
                                        <div class='col-12 col-lg-7 grade-col'>
                                            <p>Locaux</p>
                                        </div>
                                        <div class='col-9 col-lg-4 grade-col'>
                                            <div class='progress'>
                                                <div class='progress-bar premises-bar' role='progressbar' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100' style='width: 0%; background-color: orange;'>
                                                    <span class='sr-only'>0% Complete</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class='col-3 col-lg-1 grade-col premises-grade score-col'>
                                            <p>0/20 </p>
                                        </div>
                                    </div>
                                    <div class='row'>
                                        <div class='col-12 col-lg-7 grade-col'>
                                            <p>Note générale</p>
                                        </div>
                                        <div class='col-9 col-lg-4 grade-col'>
                                            <div class='progress'>
                                                <div class='progress-bar total-bar' role='progressbar' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100' style='width: 0%; background-color: orange;'>
                                                    <span class='sr-only'>0% Complete</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class='col-3 col-lg-1 grade-col total-grade score-col'>
                                            <p>0/20 </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p class='card-footer'>
                                <small class='text-muted'>`+ window[e.currentTarget.id].count + ` avis</small>
                            </p>
                        `;


                        $("#" + e.currentTarget.id).find(".card-title").css("margin-left", "5.5px");

                        // Indemnité mensuelle brute
                        $("#" + e.currentTarget.id).find(".salary").text(precisionRound(window[e.currentTarget.id].salary, 0) + "€");
                        $("#" + e.currentTarget.id).find(".salary-bar").css("width", window[e.currentTarget.id].salary / 50 + "%");
                        if ((window[e.currentTarget.id].salary / 250) < 7) {
                            $("#" + e.currentTarget.id).find(".salary-bar").css("background-color", "red");
                        } else if ((window[e.currentTarget.id].salary / 250) > 14) {
                            $("#" + e.currentTarget.id).find(".salary-bar").css("background-color", "green");
                        } else {
                            $("#" + e.currentTarget.id).find(".salary-bar").css("background-color", "orange");
                        }

                        // Durée moyenne d'une journée de travail
                        $("#" + e.currentTarget.id).find(".time").text(window[e.currentTarget.id].time == 17 ? precisionRound(window[e.currentTarget.id].time, 0) + "+h" : precisionRound(window[e.currentTarget.id].time, 0) + "h");
                        $("#" + e.currentTarget.id).find(".time-bar").css("width", window[e.currentTarget.id].time / 17 * 100 + "%");
                        $("#" + e.currentTarget.id).find(".time-bar").css("background-color", "gray");

                        // Intérêt des missions proposées
                        $("#" + e.currentTarget.id).find(".interest-bar").css("width", window[e.currentTarget.id].interest * 5 + "%");
                        $("#" + e.currentTarget.id).find(".interest-grade").html("<p>" + precisionRound(window[e.currentTarget.id].interest, 1) + "/20 </p>");
                        if (window[e.currentTarget.id].interest < 7) {
                            $("#" + e.currentTarget.id).find(".interest-bar").css("background-color", "red");
                        } else if (window[e.currentTarget.id].interest > 14) {
                            $("#" + e.currentTarget.id).find(".interest-bar").css("background-color", "green");
                        } else {
                            $("#" + e.currentTarget.id).find(".interest-bar").css("background-color", "orange");
                        }

                        // Ambiance
                        $("#" + e.currentTarget.id).find(".atmosphere-bar").css("width", window[e.currentTarget.id].atmosphere * 5 + "%");
                        $("#" + e.currentTarget.id).find(".atmosphere-grade").html("<p>" + precisionRound(window[e.currentTarget.id].atmosphere, 1) + "/20 </p>");
                        if (window[e.currentTarget.id].atmosphere < 7) {
                            $("#" + e.currentTarget.id).find(".atmosphere-bar").css("background-color", "red");
                        } else if (window[e.currentTarget.id].atmosphere > 14) {
                            $("#" + e.currentTarget.id).find(".atmosphere-bar").css("background-color", "green");
                        } else {
                            $("#" + e.currentTarget.id).find(".atmosphere-bar").css("background-color", "orange");
                        }

                        // Locaux
                        $("#" + e.currentTarget.id).find(".premises-bar").css("width", window[e.currentTarget.id].premises * 5 + "%");
                        $("#" + e.currentTarget.id).find(".premises-grade").html("<p>" + precisionRound(window[e.currentTarget.id].premises, 1) + "/20 </p>");
                        if (window[e.currentTarget.id].premises < 7) {
                            $("#" + e.currentTarget.id).find(".premises-bar").css("background-color", "red");
                        } else if (window[e.currentTarget.id].premises > 14) {
                            $("#" + e.currentTarget.id).find(".premises-bar").css("background-color", "green");
                        } else {
                            $("#" + e.currentTarget.id).find(".premises-bar").css("background-color", "orange");
                        }

                        // Note générale
                        $("#" + e.currentTarget.id).find(".total-bar").css("width", window[e.currentTarget.id].total * 5 + "%");
                        $("#" + e.currentTarget.id).find(".total-grade").html("<p>" + precisionRound(window[e.currentTarget.id].total, 1) + "/20 </p>");
                        if (window[e.currentTarget.id].total < 7) {
                            $("#" + e.currentTarget.id).find(".total-bar").css("background-color", "red");
                        } else if (window[e.currentTarget.id].total > 14) {
                            $("#" + e.currentTarget.id).find(".total-bar").css("background-color", "green");
                        } else {
                            $("#" + e.currentTarget.id).find(".total-bar").css("background-color", "orange");
                        }
                    }
                });
            } else {
                console.log("Statut de la réponse: %d (%s)", req.status, req.statusText);
                document.getElementById("entreprises").innerHTML = "<div class='alert alert-danger'> Erreur lors de la connexion à la base de données !<br><a id='dbErrorLink' onclick='requestCompanies();'>Cliquez ici pour réessayer</a></div>";
            }
        }
    };
    req.open('GET', './companiesList', true);
    req.send(null);
}

// POUR ENLEVER LES ACCENTS :

/*
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var defaultDiacriticsRemovalMap = [
    { 'base': 'A', 'letters': '\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F' },
    { 'base': 'AA', 'letters': '\uA732' },
    { 'base': 'AE', 'letters': '\u00C6\u01FC\u01E2' },
    { 'base': 'AO', 'letters': '\uA734' },
    { 'base': 'AU', 'letters': '\uA736' },
    { 'base': 'AV', 'letters': '\uA738\uA73A' },
    { 'base': 'AY', 'letters': '\uA73C' },
    { 'base': 'B', 'letters': '\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181' },
    { 'base': 'C', 'letters': '\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E' },
    { 'base': 'D', 'letters': '\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779\u00D0' },
    { 'base': 'DZ', 'letters': '\u01F1\u01C4' },
    { 'base': 'Dz', 'letters': '\u01F2\u01C5' },
    { 'base': 'E', 'letters': '\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E' },
    { 'base': 'F', 'letters': '\u0046\u24BB\uFF26\u1E1E\u0191\uA77B' },
    { 'base': 'G', 'letters': '\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E' },
    { 'base': 'H', 'letters': '\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D' },
    { 'base': 'I', 'letters': '\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197' },
    { 'base': 'J', 'letters': '\u004A\u24BF\uFF2A\u0134\u0248' },
    { 'base': 'K', 'letters': '\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2' },
    { 'base': 'L', 'letters': '\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780' },
    { 'base': 'LJ', 'letters': '\u01C7' },
    { 'base': 'Lj', 'letters': '\u01C8' },
    { 'base': 'M', 'letters': '\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C' },
    { 'base': 'N', 'letters': '\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4' },
    { 'base': 'NJ', 'letters': '\u01CA' },
    { 'base': 'Nj', 'letters': '\u01CB' },
    { 'base': 'O', 'letters': '\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C' },
    { 'base': 'OI', 'letters': '\u01A2' },
    { 'base': 'OO', 'letters': '\uA74E' },
    { 'base': 'OU', 'letters': '\u0222' },
    { 'base': 'OE', 'letters': '\u008C\u0152' },
    { 'base': 'oe', 'letters': '\u009C\u0153' },
    { 'base': 'P', 'letters': '\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754' },
    { 'base': 'Q', 'letters': '\u0051\u24C6\uFF31\uA756\uA758\u024A' },
    { 'base': 'R', 'letters': '\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782' },
    { 'base': 'S', 'letters': '\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784' },
    { 'base': 'T', 'letters': '\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786' },
    { 'base': 'TZ', 'letters': '\uA728' },
    { 'base': 'U', 'letters': '\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244' },
    { 'base': 'V', 'letters': '\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245' },
    { 'base': 'VY', 'letters': '\uA760' },
    { 'base': 'W', 'letters': '\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72' },
    { 'base': 'X', 'letters': '\u0058\u24CD\uFF38\u1E8A\u1E8C' },
    { 'base': 'Y', 'letters': '\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE' },
    { 'base': 'Z', 'letters': '\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762' },
    { 'base': 'a', 'letters': '\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250' },
    { 'base': 'aa', 'letters': '\uA733' },
    { 'base': 'ae', 'letters': '\u00E6\u01FD\u01E3' },
    { 'base': 'ao', 'letters': '\uA735' },
    { 'base': 'au', 'letters': '\uA737' },
    { 'base': 'av', 'letters': '\uA739\uA73B' },
    { 'base': 'ay', 'letters': '\uA73D' },
    { 'base': 'b', 'letters': '\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253' },
    { 'base': 'c', 'letters': '\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184' },
    { 'base': 'd', 'letters': '\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A' },
    { 'base': 'dz', 'letters': '\u01F3\u01C6' },
    { 'base': 'e', 'letters': '\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD' },
    { 'base': 'f', 'letters': '\u0066\u24D5\uFF46\u1E1F\u0192\uA77C' },
    { 'base': 'g', 'letters': '\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F' },
    { 'base': 'h', 'letters': '\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265' },
    { 'base': 'hv', 'letters': '\u0195' },
    { 'base': 'i', 'letters': '\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131' },
    { 'base': 'j', 'letters': '\u006A\u24D9\uFF4A\u0135\u01F0\u0249' },
    { 'base': 'k', 'letters': '\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3' },
    { 'base': 'l', 'letters': '\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747' },
    { 'base': 'lj', 'letters': '\u01C9' },
    { 'base': 'm', 'letters': '\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F' },
    { 'base': 'n', 'letters': '\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5' },
    { 'base': 'nj', 'letters': '\u01CC' },
    { 'base': 'o', 'letters': '\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275' },
    { 'base': 'oi', 'letters': '\u01A3' },
    { 'base': 'ou', 'letters': '\u0223' },
    { 'base': 'oo', 'letters': '\uA74F' },
    { 'base': 'p', 'letters': '\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755' },
    { 'base': 'q', 'letters': '\u0071\u24E0\uFF51\u024B\uA757\uA759' },
    { 'base': 'r', 'letters': '\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783' },
    { 'base': 's', 'letters': '\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B' },
    { 'base': 't', 'letters': '\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787' },
    { 'base': 'tz', 'letters': '\uA729' },
    { 'base': 'u', 'letters': '\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289' },
    { 'base': 'v', 'letters': '\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C' },
    { 'base': 'vy', 'letters': '\uA761' },
    { 'base': 'w', 'letters': '\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73' },
    { 'base': 'x', 'letters': '\u0078\u24E7\uFF58\u1E8B\u1E8D' },
    { 'base': 'y', 'letters': '\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF' },
    { 'base': 'z', 'letters': '\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763' }
];

var diacriticsMap = {};
for (var i = 0; i < defaultDiacriticsRemovalMap.length; i++) {
    var letters = defaultDiacriticsRemovalMap[i].letters;
    for (var j = 0; j < letters.length; j++) {
        diacriticsMap[letters[j]] = defaultDiacriticsRemovalMap[i].base;
    }
}

// "what?" version ... http://jsperf.com/diacritics/12
function removeDiacritics(str) {
    return str.replace(/[^\u0000-\u007E]/g, function (a) {
        return diacriticsMap[a] || a;
    });
}    
