const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors');
const path = require('path')
var server = require('http').createServer(app);
// var server2 = require('http').createServer(app);
require('dotenv').config

// Listen on a specific host via the HOST environment variable
// var host = process.env.HOST || '127.0.0.1';
// Listen on a specific port via the PORT environment variable
// var port2 = process.env.PORT || 3000;

// var cors_proxy = require('cors-anywhere');
// cors_proxy.createServer({
//     originWhitelist: [], // Allow all origins
//     requireHeader: ['origin', 'x-requested-with'],
//     removeHeaders: ['cookie', 'cookie2']
// }).listen(port2, function() {
//     console.log('Running CORS Anywhere on ' + ':' + port2);
// });


var corsAnywhere = require('./lib/cors-anywhere')
// .createServer({
//     originWhitelist: [], // Allow all origins
//     requireHeader: ['origin', 'x-requested-with'],
//     removeHeaders: ['cookie', 'cookie2']
// });
let proxy = corsAnywhere.createServer({
    originWhitelist: [], // Allow all origins
    requireHeader: [],
    removeHeaders: []
});
const port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors({
    origin: '*'
}));
let routes = require('./api/routes') //importing route
let p_routes = require('./public/routes') //importing route
routes(app)
p_routes(app)

app.use(express.static(path.join(__dirname, 'static')));

// app.all('/cors_anywhere', (req, res) => {
//     cors_proxy.emit('request', req, res);
// })

// cors_proxy.use(function(req, res, next) {
//     var index_ = req.url.indexOf('/https:');
//     var sliced_ = req.url.slice(index_ + 7,2);
//     console.log(sliced_);
//     next();
//   });


app.all('/proxy/:proxyUrl*', (req, res) => {
    if (req.url.indexOf('http') > -1) {
        req.url = req.url.replace('/proxy/https:/', '/https://'); // Strip '/proxy' from the front of the URL, else the proxy won't work.
        req.url = req.url.replace('/proxy/http:/', '/http://'); // Strip '/proxy' from the front of the URL, else the proxy won't work.
    } else {
        req.url = req.url.replace('/proxy/', '/http://'); // Strip '/proxy' from the front of the URL, else the proxy won't work.
    }
    // console.log('proxy get url : ', req.url);
    proxy.emit('request', req, res);
});


server.listen(port, () => {
    console.log('listening on *:3000');
});
console.log('RESTful API server started on: ' + port);
