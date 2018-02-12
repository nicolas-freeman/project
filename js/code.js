
// AUTORUN

// checkIfLoggedIn();

var user = {};

// FONCTIONS


function onSignIn(googleUser) {
    console.log("onSignIn");
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    user.ID = profile.getId();
    console.log('Name: ' + profile.getName());
    user.name = profile.getName();
    console.log('Image URL: ' + profile.getImageUrl());
    user.photoURL = profile.getImageUrl();
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    user.email = profile.getEmail();
    // Store the entity object in sessionStorage where it will be accessible from all pages of the site.
    sessionStorage.setItem('user', JSON.stringify(user));
    // Redirection vers l'accueil du site
    window.location.href = 'index.html';
    console.log("endOnSignIn");
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
    sessionStorage.removeItem('user')
    // Redirection vers l'accueil du site
    window.location.href = 'index.html';
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

function checkIfLoggedIn() {
    if (sessionStorage.getItem('user') == null && window.location.href.indexOf('login.html') < 0) { // Si non connecté et pas sur la page de connexion
        // Redirection vers la page de connexion
        window.location.href = 'login.html';
    } else { // Si connecté ou sur la page de connexion
        var user = {};
        user = JSON.parse(sessionStorage.getItem('user'));
    }
}

// Si connecté, on remplace connexion par déconnexion (texte et lien) dans la barre de navigation, et vice-versa
function replaceLog() {

    if (sessionStorage.getItem('user') == null) { // Si non connecté
        var log = document.getElementById("log");
        console.log("Not logged in");
        log.innerHTML = log.innerHTML.replace("Déconnexion", "Connexion"); // On modifie le texte du bouton
        log.href = "login.html"; // On modifie le lien du bouton

    } else { // Si connecté
        var log = document.getElementById("log");
        console.log("Logged in");
        log.innerHTML = log.innerHTML.replace("Connexion", "Déconnexion"); // On modifie le texte du bouton
        log.href = "logout.html"; // On modifie le lien du bouton
    }
}
