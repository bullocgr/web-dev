// var path = require('path');
// var express = require('express');
// var app = express();
// var exphbs = require('express-handlebars');
// var port = process.env.PORT || 3000;
// var plantData = require('./plantData');

// app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
// app.set('view engine', 'handlebars');

// app.use(express.static('public'));

// app.get(['/', '/index.html'], function (req, res, next) {
//     res.status(200).render('plantPage', {
//         plants: plantData
//     })
// });

// app.get('*', function (req, res) {
//     res.status(404).render('404', {});
// });

// app.listen(port, function () {
//     console.log("== Server is listening on port", port);
// });







var path = require('path');
var express = require('express');
var app = express();
var exphbs = require('express-handlebars');
var port = process.env.PORT || 3000;
var plantData = require('./plantData');

var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;

var mongoHost = "classmongo.engr.oregonstate.edu";
var mongoPort = process.env.MONGO_PORT || '27017';
var mongoUsername = "cs290_noonanj";
var mongoPassword = "cs290_noonanj";
var mongoDBName = "cs290_noonanj";

var mongoURL = "mongodb://" +
    mongoUsername + ":" + mongoPassword + "@" + mongoHost + ":" + mongoPort + "/" + mongoDBName;

var mongoDB = null;

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());

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
        else if (plantDocs.length > 0) {
            res.status(200).render('plantPage', plantDocs[0]);
        }
        else {
            next();
        }
    });
});

app.post('/plants/addPlant', function (req, res, next) {
    //var plant = req.params.plant.toLowerCase();
    console.log("ADDING A NEW PLANT", req.body);

    if (req.body && req.body.photoURL && req.body.about && req.body.name) {
        var plantCollection = mongoDB.collection('plants');
        plantCollection.insertOne({
            "photoURL": req.body.photoURL,
            "about": req.body.about,
            "name": req.body.name
            },
            function (err, result) {
                if (err) {
                    res.status(500).send("Error deleting plant");
                }
                else if (result.matchedCount > 0) {
                    res.status(200).send("Success");
                }
                else {
                    next();
                }
            }
        );
    }
});

app.post('/plants/deletePlant', function (req, res, next) {
    //var plant = req.params.plant.toLowerCase();
    if (req.body.name) {
        var plantCollection = mongoDB.collection('plants');
        plantCollection.deleteOne(
            { "name": req.body.name },
            function (err, result) {
                if (err) {
                    res.status(500).send("Error deleting plant");
                }
                else if (result.matchedCount > 0) {
                    res.status(200).send("Success");
                }
                else {
                    next();
                }
            }
        );
    }
});

app.post('/plants/:plant/renamePlant', function (req, res, next) {
    var plant = req.params.plant;
    console.log("RENAME: ", req.body.name);
    console.log("OLDNAME: ", plant);
    if (req.body.name) {
        var plantCollection = mongoDB.collection('plants');
        plantCollection.updateOne(
            { "name": plant },
            { "$set": { "name": req.body.name}}
            // function (err, result) {
            //     if (err) {
            //         res.status(500).send("Error renaming plant");
            //     }
            //     else if (result.matchedCount > 0) {
            //         res.status(200).send("Success");
            //     }
            //     else {
            //         next();
            //     }
            // }
        );
    }
});

app.get('*', function (req, res, next) {
    res.status(404).render('404');
});

MongoClient.connect(mongoURL, function (err, client) {
    if (err) {
        throw err;
    }
    mongoDB = mongoDBDatabase = client.db(mongoDBName);
    app.listen(port, function () {
        console.log("== Server is listening on port", port);
    });
});








// var path = require('path');
// var express = require('express');
// var exphbs = require('express-handlebars');
// var bodyParser = require('body-parser');
// var MongoClient = require('mongodb').MongoClient;


// var plantData = require('./plantData');


// var mongoHost = "classmongo.engr.oregonstate.edu"; //classmongo.engr.oregonstate.edu
// var mongoPort = process.env.MONGO_PORT || '27017';
// var mongoUsername = "cs290_noonanj"; //cs290_noonanj
// var mongoPassword = "cs290_noonanj"; //cs290_noonanj
// var mongoDBName = "cs290_noonanj"; //cs290_noonanj

// var mongoURL = "mongodb://" + mongoUsername + ":" + mongoPassword + "@" + mongoHost + ":" + mongoPort + "/" + mongoDBName;

// var mongoDB = null;



// var app = express();
// var port = process.env.PORT || 3005;

// app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
// app.set('view engine', 'handlebars');

// app.use(bodyParser.json());

// app.use(express.static('public'));

// app.get('/', function (req, res, next) {
//     var plantCollection = mongoDB.collection('plantData');
//     plantCollection.find({ id: "name" }).toArray(function (err, plantData) {
//         if (err) {
//             res.status(500).send("Error fetching plant from DB.");
//         } else if (plantData.length > 0) {
//             res.status(200).render('plantPage', plantData[0]);
//         }
//     });
// });

// app.get('/name', function (req, res) {
//     var plantCollection = mongoDB.collection('plantData');
//     plantCollection.find({ id: "name" }).toArray(function (err, plantData) {
//         if (err) {
//             res.status(500).send("Error fetching plant from DB.");
//         } else if (plantData.length > 0) {
//             res.status(200).render('plantPage', plantData[0]);
//         }
//     });
// });

// app.get('/funny', function (req, res) {
//     var plantCollection = mongoDB.collection('plantData');
//     plantCollection.find({ id: "funny" }).toArray(function (err, plantData) {
//         if (err) {
//             res.status(500).send("Error fetching plant from DB.");
//         } else if (plantData.length > 0) {
//             res.status(200).render('plantPage', plantData[0]);
//         }
//     });
// });

// app.get('/new', function (req, res) {
//     var plantCollection = mongoDB.collection('plantData');
//     plantCollection.find({ id: "new" }).toArray(function (err, plantData) {
//         if (err) {
//             res.status(500).send("Error fetching plant from DB.");
//         } else if (plantData.length > 0) {
//             res.status(200).render('plantPage', plantData[0]);
//         }
//     });
// });

// app.get('/plants/:plant', function (req, res, next) {
//     var plant = req.params.plant.toLowerCase();
//     var plantCollection = mongoDB.collection('plantData');
//     plantCollection.find({ name: plant }).toArray(function (err, plantDocs) {
//         console.log(plantDocs);
//         if (err) {
//             res.status(500).send("Error fetching plant from DB.");
//         } else if (plantDocs.length > 0) {
//             res.status(200).render('plantPage', plantDocs[0]);
//         } else {
//             next();
//         }
//     });
// });

// app.post('/plants/:plant/addReview', function (req, res, next) {
//     var plant = req.params.plant.toLowerCase();
//     if (req.body && req.body.reviewContent && req.body.author) {
//         var review = {
//             reviewContent: req.body.reviewContent,
//             author: req.body.author
//         };
//         var plantCollection = mongoDB.collection('plantData');
//         plantCollection.updateOne(
//             { name: plant },
//             { $push: { reviews: review } },
//             function (err, result) {
//                 if (err) {
//                     res.status.send(500).send("Error inserting photo into DB.")
//                 } else {
//                     if (result.matchedCount > 0) {
//                         res.status(200).end();
//                     } else {
//                         next();
//                     }
//                 }
//             }
//         );
//     } else {
//         res.status(400).send("Request needs a JSON body with caption and photoURL.")
//     }
// });

// app.get('*', function (req, res) {
//     res.status(404).render('404');
// });



// MongoClient.connect(mongoURL, function (err, client) {
//     if (err) {
//         throw err;
//     }

//     mongoDB = client.db(mongoDBName);
//     app.listen(port, function () {
//         console.log("== Server listening on port", port);
//     });

// })
