'use strict'

const util = require('util')
const mysql = require('mysql')
const db = require('./../db')
const fs = require("fs");
var formidable = require('formidable');
const FormData = require('form-data');
// const bodyparser = require('body-parser');
// const multer = require('multer');

const multer = require('multer');

// const storage =  multer.diskStorage({ 
//     destination: function (req, file, next) {
//         next(null,`./lib/2022/6`);
//       },
//     filename: function (req, file, cb) {
//         // let time =Date.now();
//         cb(null,date+file.originalname);
//   }
// });
// const upload = multer(
//   {
//     storage: storage, fileFilter: (req, file, next) => {
//       next(null, true);
//     }, limits: { fileSize: 15 * 1000000 }
//   }
//   ).single('file');

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
        let sql = 'SELECT `menu`.`id`,`menu`.`name`,`menu`.`par_id`,`menu`.`order` FROM `menu` order by `menu`.`order`;'
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
    get_img_logo: (req, res) => {
        let sql = 'SELECT * from logo where type = 1 and active = 1 limit 1;'
        db.query(sql, (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    get_img_login: (req, res) => {
        let sql = 'SELECT * from logo where type = 2 and active = 1 limit 1;'
        db.query(sql, (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    get_img_loading: (req, res) => {
        let sql = 'SELECT * from logo where type = 3 and active = 1 limit 1;'
        db.query(sql, (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    edit_type_logo: (req, res) => {
        var active = req.params.active;
        if (Number(active) === 0) {
            active = 1
        } else {
            active = 0
        }
        let sql = 'update `logo` set `active` = ? where id = ?;'
        db.query(sql, [active, req.params.id], (err, response) => {
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
        let date = Date.now();
        const storage =  multer.diskStorage({ 
            destination: function (req, file, next) {
                next(null,`././static/lib/img`);
              },
            filename: function (req, file, cb) {
                // let time =Date.now();
                cb(null,date+".jpg");
          }
        });
        const upload = multer(
          {
            storage: storage, fileFilter: (req, file, next) => {
              next(null, true);
            }, limits: { fileSize: 15 * 1000000 }
          }
          ).single('file');
        upload(req, res, function (err) {})
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            const formData = new FormData();
            var f = fs.createReadStream(files.file.filepath);
            let logo_img = "../lib/img/"+date+".jpg";
            let logo_name = fields.name;
            let type = fields.type;
            let active = fields.active;
            let sql = 'insert into logo set logo_name = ?, logo_img = ?,active = ?,type = ? '
            db.query(sql, [logo_name, logo_img, active,type], (err, response) => {
                if (err) throw err
                res.json({ message: 'insert success!' })
            })

        })

    },
    insert_his_login: (req, res) => {
        var time = new Date().getTime() / 1000;
        var action =req.params.action;
        let sql = 'insert into history_login set user_id = ? ,action = ?, time = ?;'
        db.query(sql, [req.params.id,action,time], (err, response) => {
            if (err) throw err
            res.json({ message: 'insert success!' })
        })
    },
    list_history_login: (req, res) => {
        let sql = 'SELECT PH.*,P.username AS username FROM `history_login` AS PH left join user as P on PH.user_id = P.id where PH.user_id = ? order by `time` desc limit 10;'
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