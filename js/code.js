
// AUTORUN

var user = {};
if (sessionStorage.getItem('user') == null) { // Si non connecté
} else { // Si connecté
    user = JSON.parse(sessionStorage.getItem('user'));
}


// checkIfLoggedIn();


// NOUVEAU SCRIPT LOGIN

var googleUser = {};
var startApp = function () {
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
    console.log(element.id);
    auth2.attachClickHandler(element, {},
        function (googleUser) {
            document.getElementById('name').innerText = "Connecté en tant que " +
                googleUser.getBasicProfile().getName();
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
            // window.location.href = 'index.html';
            document.getElementById('profile-img').src = user.photoURL; // On remplace l'image de profil de la page
            document.getElementById('nav-profile-img').src = user.photoURL; // On remplace l'image de profil de la barre de navigation
            console.log("endOfSignIn");
        }, function (error) {
            alert(JSON.stringify(error, undefined, 2));
        });
}


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
        user = JSON.parse(sessionStorage.getItem('user'));
    }
}

// Une fois la page chargée, si connecté, on remplace connexion par déconnexion (texte et lien) dans la barre de navigation, et vice-versa
window.onload = function () {
    if (sessionStorage.getItem('user') == null) { // Si non connecté
        var log = document.getElementById("log");
        console.log("Not logged in");
        log.innerHTML = log.innerHTML.replace("Déconnexion", "Connexion"); // On modifie le texte du bouton
        log.href = "login.html"; // On modifie le lien du bouton
    }
    else { // Sinon
        if (window.location.href.indexOf('login.html') >= 1) { // Si connecté et sur la page de login
            document.getElementById('profile-img').src = user.photoURL; // On remplace l'image de profil de la page
            document.getElementById('name').innerText = "Connecté en tant que " + user.name;
        }
        var log = document.getElementById("log");
        console.log("Logged in");
        log.innerHTML = log.innerHTML.replace("Connexion", "Déconnexion"); // On modifie le texte du bouton
        log.href = "logout.html"; // On modifie le lien du bouton
        var link = document.getElementById('nav-profile-img');
        console.log(link);
        document.getElementById('nav-profile-img').src = user.photoURL; // On remplace l'image de profil de la barre de navigation
    }
}