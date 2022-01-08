const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors');
const path = require('path')
var server = require('http').createServer(app);
var corsAnywhere = require('cors-anywhere')
// .createServer({
//     originWhitelist: [], // Allow all origins
//     requireHeader: ['origin', 'x-requested-with'],
//     removeHeaders: ['cookie', 'cookie2']
// });
let proxy = corsAnywhere.createServer({
    originWhitelist: ["https://phanmemnhatrang.xyz","http://phanmemnhatrang.xyz","http://phanmemnhatrang.xyz:3000","https://phanmemnhatrang.xyz:3000","https://phanmemnhatrang.xyz/proxy/"], // Allow all origins
    requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2']
});
require('dotenv').config
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
app.all('/proxy/:proxyUrl*', (req, res) => {
    req.url = req.url.replace('/proxy/https:/', '/https://'); // Strip '/proxy' from the front of the URL, else the proxy won't work.
    proxy.emit('request', req, res);
});


server.listen(port, () => {
    console.log('listening on *:3000');
});
console.log('RESTful API server started on: ' + port);
