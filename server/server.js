const express = require('express');
const app = express();
var bodyParser = require('body-parser')
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

//app.get('/', function (req, res) {
//  res.send('Hello World!')
//});

app.use(express.static('./../static'));

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:22018/sanslanguedeboite';

// Use connect method to connect to the Server

app.listen(2018, function () {
  console.log('Sans langue de boite listening on port 2018!');
});

// Requête de la liste des entreprises
app.get('/companiesList', function (req, res) {
  console.log("J'ai reçu une requête de liste des entreprises !");

  MongoClient.connect(url, function (err, client) {
    if (err) {
      return res.status(500).send(err);
    }
    console.log("Connecté à la base de données située à l'adresse " + url);
    var db = client.db('sanslanguedeboite');

    db.collection('entreprises').find({}).toArray(function (findErr, result) {
      if (findErr) throw findErr;
      client.close();
      console.log("Voici la liste des entreprises...");
      res.send(result);
    });

  });
});

// Envoi d'un avis
app.post("/submitFeedback", function (req, res) {
  console.log("POST request received.");
  console.log("req.body : " + req.body);
  MongoClient.connect(url, function (err, client) {
    if (err) {
      return res.status(500).send(err);
    }
    console.log("Connecté à la base de données située à l'adresse " + url);
    var db = client.db('sanslanguedeboite');
    db.collection("entreprises").insertOne(req.body, function (err, res) {
      if (err) throw err;
      console.log("J'ai bien ajouté un avis");
    });
    res.status(200);
    res.send("OK");
  });

});

/* Requête du détail d'une entreprise
app.get('/companyDetail/:company', function (req, res) {
  console.log("J'ai reçu une requête de détail pour l'entreprise " + req.params.company);
  MongoClient.connect(url, function (err, client) {
    if (err) {
      return res.status(500).send(err);
    }
    console.log("Connecté à la base de données située à l'adresse " + url);
    var db = client.db('sanslanguedeboite');

    db.collection('entreprises').find({nom: req.params.company}).toArray(function (findErr, result) {
      if (findErr) throw findErr;
      client.close();
      console.log("Voici le détail pour l'entreprise "+req.params.company);
      res.send(result);
    });

  });
});
*/


app.get('*', function (req, res) {
  console.log("req.query.recherche =" + req.query.recherche);
});

