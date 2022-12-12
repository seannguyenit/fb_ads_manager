'use strict'

const util = require('util')
const mysql = require('mysql')
const db = require('./../db')
const rq_sv = require('./request_controller');
var formidable = require('formidable');
const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');

module.exports = {
    get_fb_api: function (req, res) {
        // const response = await fetch(req.params.url)
        //console.log(response)
        //res.json(response)
    },
    get_url: (req, res) => {
        var url = req.body.url;
        axios.get(url).then((r) => {
            res.json(r.data);
        }).catch(function (error) {
            res.json(error.response.data);
            // console.log(error);
        });
    },
    post_url: (req, res) => {
        var url = req.body.url;
        var data = req.body.data;
        axios.post(url, data).then((r) => {
            res.json(r.data);
        }).catch(function (error) {
            res.json(error.response.data);
            // console.log(error);
        });
    },
    post_video: function (req, res) {
        var form = new formidable.IncomingForm();
        //form.parse(req, function (err, fields, files) {
        const formData = new FormData();
        var f_name = req.file.destination + req.file.filename;
        var f = fs.createReadStream(f_name);
        formData.append('file', f, {
            filename: req.file.originalname
        })
        rq_sv.post(req.body.url, formData).then((r) => {
            fs.unlinkSync(f_name);
            res.json(r);
        })
        // });
    }
}