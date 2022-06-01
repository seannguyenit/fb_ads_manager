'use strict'

const util = require('util')
const mysql = require('mysql')
const db = require('./../db')
const fs = require("fs");
// const bodyparser = require('body-parser');
// const multer = require('multer');



// const storage = multer.diskStorage({
//     destination: function (req, file, next) {
//         next(null, path.join(__dirname, 'img'));
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.fieldname + '--' + '.png');
//     }
// });
// const upload = multer({
//     storage: storage, fileFilter: (req, file, next) => {
//         next(null, true);
//     }, limits: { fileSize: 15 * 1000000 }
// }).single('logo_img');


module.exports = {
    get_template: (req, res) => {
        let sql = 'SELECT `menu`.`id`,`menu`.`name`,`menu`.`par_id`,`menu`.`order` FROM `fb_ads_management`.`menu` order by `menu`.`order`;'
        db.query(sql, (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    get_logo: (req, res) => {
        let sql = 'SELECT * from logo;'
        db.query(sql, (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    edit_type_logo: (req, res) => {
        var type = req.params.type;
        if (Number(type) === 0) {
            type = 1
        } else {
            type = 0
        }
        let sql = 'update `logo` set `type` = ? where id = ?;'
        db.query(sql, [type, req.params.id], (err, response) => {
            if (err) throw err
            res.json({ message: 'Success!' })
        })
    },
    get_by_user: (req, res) => {
        let sql = 'CALL `get_all_menu_by_user`(?);'
        db.query(sql, [req.params.id], (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    add_menu: (req, res) => {
        // var data = JSON.stringify(req.body)
        let sql = 'delete from user_menu where `user_menu`.`user_id` = ?'
        db.query(sql, [req.params.user_id], (err, response) => {
            if (err) throw err
            // res.json({ message: 'Insert success!' })
        })
        sql = 'INSERT INTO `user_menu`(`menu_id`,`stt`,`user_id`) VALUES ?;'
        db.query(sql, [req.body], (err, response) => {
            if (err) throw err
            res.json({ message: 'Insert success!' })
        })
    },
    get_all_config: (req, res) => {
        let sql = 'select * from web_config order by `order`'
        db.query(sql, (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    update_config: (req, res) => {
        let sql = 'update `web_config` set ? where id = ?'
        db.query(sql, [req.body, req.params.id], (err, response) => {
            if (err) throw err
            res.json({ message: 'Success!' })
        })
    },
    del_logo: (req, res) => {
        let sql = 'DELETE FROM logo WHERE id = ?'
        db.query(sql, [req.params.id], (err, response) => {
            if (err) throw err
            res.json({ message: 'Delete success!' })
        })
    },
    insert_logo: (req, res) => {
        let logo_name = "2";
        let type = 0;
        // upload(req, res, function (err) {
            
        // })
        logo_name = req.body.logo_name;
        type = req.body.type;
        let logo_img = req.file.originalname + '--' + '.png';
        let sql = 'insert into logo set logo_name = ?, logo_img = ?, type = ? '
        db.query(sql, [logo_name, logo_img, type], (err, response) => {
            if (err) throw err
            res.json({ message: 'insert success!' })
            // window.location.href = 'm_logo';
        })

        //   console.log(req.file); // ------> line 270 of my original server1.js file
        //     // if(err){
        //     alert("err");
        //     return;
        // }
        // else{
        //     alert("thanh cong");
        // }


        // var form = new formidable.IncomingForm();
        // form.parse(req, function (err, fields, files) {})
        // let data = req.file;
        // data.logo_img = data.files[0];

    },
    insert_his_login: (req, res) => {
        var time = new Date().getTime() / 1000;
        let sql = 'insert into history_login set user_id = ? , time = ?;'
        db.query(sql, [req.params.id, time], (err, response) => {
            if (err) throw err
            res.json({ message: 'insert success!' })
        })
    },
    list_history_login: (req, res) => {
        var time = new Date().getTime() / 1000;
        let sql = 'SELECT PH.*,P.username AS username FROM `history_login` AS PH left join user as P on PH.user_id = P.id where PH.user_id = ? order by `time` desc limit 20;'
        db.query(sql, [req.params.id], (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    lang_lib: (req, res) => {
        var name_lib = 'vi';
        if (req.params.lang == 'en') {
            name_lib = 'en';
        }
        fs.readFile(`././locales/${name_lib}.json`, "utf8", (err, jsonString) => {
            if (err) {
                console.log("Error reading file from disk:", err);
                res.json({});
            }
            try {
                const customer = JSON.parse(jsonString);
                res.json(customer);
            } catch (err) {
                console.log("Error parsing JSON string:", err);
                res.json({});
            }
        });
    }
}