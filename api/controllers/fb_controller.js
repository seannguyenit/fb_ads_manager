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
            res.json({ result: r.data });
        });
    },
    post_video: function (req, res) {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            const formData = new FormData();
            var f = fs.createReadStream(files.file.filepath);
            fs.unlinkSync(files.file.filepath);
            formData.append('file', f, {
                filename: files.file.originalFilename
            })
            rq_sv.post(fields.url, formData).then((r) => {
                res.json(r);
            })
        });
    }
}