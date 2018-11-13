/*
 * Write your server code in this file.  Don't forget to add your name and
 * @oregonstate.edu email address below.
 *
 * name: Grace Bullock 
 * email: bullocgr@oregonstate.edu
 */

var http = require('http');
var fs = require('fs');
const PORT = process.env.PORT || 3000;


function requestHandler(req, res) {
    res.statusCode = 200;
    var url = req.url;
    console.log("url: ", req.url);

    switch(url) {
        case '/index.html':
            res.end(fs.readFileSync('public/index.html'));
            console.log("Reading index.html");
            break;
        case '/':
            res.end(fs.readFileSync('public/index.html'));
            console.log("Reading index.html");
            break;
        case '/style.css':
            res.end(fs.readFileSync('public/style.css'));
            console.log("Reading style.css");
            break;
        case '/index.js':
            res.end(fs.readFileSync('public/index.js'));
            console.log("Reading index.js");
            break;
        case '/benny.jpg':
            res.end(fs.readFileSync('public/benny.jpg'));
            console.log("Reading benny.jpg");
            break;
        default:
            res.end(fs.readFileSync('public/404.html'));
            // console.log("Reading error");
            res.statusCode = 404;
            break;
    }
    console.log(res.statusCode);

}

var server = http.createServer(requestHandler);
//need to tell the server to start listening

server.listen(3000, function (err) {
    if (err) {
        throw err;
    }
    console.log("server is listening on port 3000");
});
//this tells the server to listen
