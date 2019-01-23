var fs = require('fs');
var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');

var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;

var mongoHost = process.env.MONGO_HOST;
var mongoPort = process.env.MONGO_PORT || '27027';
var mongoUsername = process.env.MONGO_USERNAME;
var mongoPassword = process.env.MONGO_PASSWORD;
var mongoDBName = process.env.MONGO_DB_NAME;

var mongoURL = "mongodb://" +
  mongoUsername + ":" + mongoPassword + "@" + mongoHost + ":" + mongoPort + "/" + mongoDBName;

var mongoDB = null;

var app = express();
var port = process.env.PORT || 3000;

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.get(['/', '/plants'], function (req, res, next) {
  var plantCollection = mongoDB.collection('plants');
  plantCollection.find({}).toArray(function (err, plantDocs) {
    if (err) {
      res.status(500).send("Error communicating with DB.");
    }
    res.status(200).render('plantPage', {
      plants: plantDocs
    });
  });
});

app.get('/plants/:plant', function (req, res, next) {
  var plant = req.params.plant.toLowerCase();
  var plantCollection = mongoDB.collection('plants');
  plantCollection.find({ name: plant }).toArray(function (err, plantDocs) {
    if (err) {
      res.status(500).send("Error communicating with DB.");
    }
    else if (peopleDocs.length > 0) {
      res.status(200).render('plantPage', plantDocs[0]);
    }
    else {
      next();
    }
  });
});

app.post('/plants/:name/', function (req, res, next) {

});

app.get('*', function (req, res, next) {
  res.status(404).render('404');
});

// MongoClient.connect(mongoURL, function (err, client) {
//     if (err) {
//         throw err;
//     }
//     mongoDB = client.db(mongoDBName);
//     app.listen(port, function () {
//         console.log("== Server is listening on port", port);
//     });
// });

app.listen(port, function () {
  console.log("== Server is listening on port", port);
});