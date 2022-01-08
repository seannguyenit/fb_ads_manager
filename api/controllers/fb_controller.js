'use strict'

const util = require('util')
const mysql = require('mysql')
const db = require('./../db')
// const session = require('express-session');

module.exports = {
    get_fb_api: function (req, res) {
        // const response = await fetch(req.params.url)
        console.log(response)
        res.json(response)
    }
}