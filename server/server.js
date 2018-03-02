const express = require('express')
const app = express()

//app.get('/', function (req, res) {
//  res.send('Hello World!')
//});

app.use(express.static('./../static'));

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/sanslanguedeboite';
// Use connect method to connect to the Server
MongoClient.connect(url, function (err, client) {
  if (err) throw err;
  console.log("Connecté à la base de données située à l'adresse "+url);
  var db = client.db('sanslanguedeboite');

  db.collection('secteurs').findOne({}, function (findErr, result) {
    if (findErr) throw findErr;
    console.log(result.name);
    console.log(result._id);
    client.close();
  });
}); 

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

