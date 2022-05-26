const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors');
const path = require('path')
var server = require('http').createServer(app);
// var server2 = require('http').createServer(app);
require('dotenv').config

const port = process.env.PORT || 3000


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors({
    origin: '*'
}));

let routes = require('./api/routes') //importing route
let p_routes = require('./public/routes') //importing route

routes(app)
p_routes(app)

// app.use('/change-lang/:lang', (req, res) => { 
//     res.cookie('lang', req.params.lang, { maxAge: 900000 });
//     res.redirect('back');
// });

app.use(express.static(path.join(__dirname, 'static')));

server.listen(port, () => {
    console.log('listening on *:3000'); 
});
console.log('RESTful API server started on: ' + port);
