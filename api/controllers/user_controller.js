'use strict'

const util = require('util')
const mysql = require('mysql')
const db = require('./../db')
// const session = require('express-session');

module.exports = {
    get: (req, res) => {
        let sql = 'CALL `user_getall`(0)'
        db.query(sql, (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    detail: (req, res) => {
        // let is_admin = req.params.is_admin || false;
        let sql = 'CALL `user_getdetail`(?)'
        db.query(sql, [req.params.id], (err, response) => {
            if (err) throw err
            var dt = response[0][0];
            // if(is_admin){
            //     dt.pass = dt.pass;
            // }else{

            // }
            res.json(dt);
        })
    },
    update: (req, res) => {
        let data = req.body;
        let userId = req.params.id;
        let sql = 'UPDATE user SET ? WHERE id = ?;'
        db.query(sql, [data, userId], (err, response) => {
            if (err) throw err
            // var dt = response[0][0];
            // res.json(dt)
        })
        let sql1 = 'call user_getdetail(?);'
        db.query(sql1, [req.params.id], (err, response) => {
            if (err) throw err
            var dt = response[0][0];
            res.json(dt)
        })
    },
    store: (req, res) => {
        let data = req.body;
        data.pass = data.pass;
        let sql = 'INSERT INTO user SET ?;'
        db.query(sql, [data], (err, response) => {
            if (err) throw err
            // var dt = response[0][0];
            // res.json(dt)
        })
        let sql2 = 'call user_getdetail(last_insert_id());'
        db.query(sql2, [data], (err, response) => {
            if (err) throw err
            var dt = response[0][0];
            res.json(dt)
        })
    },
    delete: (req, res) => {
        let sql = 'DELETE FROM user WHERE id = ?'
        db.query(sql, [req.params.id], (err, response) => {
            if (err) throw err
            res.json({ message: 'Delete success!' })
        })
    },
    login: (req, res) => {
        var er = '';
        let data = req.body;
        let sql = 'CALL `login`(?,?)'
        try {
            db.query(sql, [data.user, data.pass], (err, response) => {
                if (err) throw err
                // console.log(response);
                let dt = response[0][0];
                if (dt) {
                    res.json({ ok: 1, data: response[0][0] });
                } else {
                    res.json({ ok: 0 });
                }
            })
        } catch (error) {
            er = error;
        }
    },
    logout: (req, res) => {
        let data = req.body;
        let sql = 'CALL `logout`(?,?)'
        try {
            db.query(sql, [data.user, data.token], (err, response) => {
                if (err) throw err
                // console.log(response);
                res.json({ ok: 1 });
            })
        } catch (error) {
            er = error;
        }
    },
    get_sd: async (req, res) => {
        let data = req.body;
        // let sql = 'CALL `logout`(?,?)'
        try {
            db.query(sql, [data.user, data.token], (err, response) => {
                if (err) throw err
                // console.log(response);
                res.json({ ok: 1 });
            })
        } catch (error) {
            er = error;
        }
    },
    store_token: (req, res) => {
        let data = req.body;
        let sql = 'INSERT INTO user_token_fb SET ?;'
        db.query(sql, [data], (err, response) => {
            if (err) throw err
            res.json({ ok: 1 });
        })
    },
    del_token: (req, res) => {
        let sql = 'delete from user_token_fb where id = ?;'
        db.query(sql, [req.params.id], (err, response) => {
            if (err) throw err
            res.json({ ok: 1 });
        })
    },
    get_all_token: (req, res) => {
        let sql = 'select * from user_token_fb where user_id = ?'
        db.query(sql,[req.params.id], (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    user_check_existed: (req, res) => {
        let sql = 'call user_check_existed(?,?);'
        db.query(sql,[req.params.id,req.params.username], (err, response) => {
            if (err) throw err
            res.json(response)
        })
    }
}


// async function get_content() {
//     var url = 'http://postshare.co.kr/archives/406545?nt=m1';
//     return await fetch(url).then(function (response) {
//         // The API call was successful!
//         return response.text();
//     }).then(async function (html) {
//         console.log(html);
//         return html;
//         // Convert the HTML string into a document object
//         // var parser = new DOMParser();
//         // var doc = parser.parseFromString(html, 'text/html');
//         // await remove_href(doc);
//         // await remove_script(doc);
//         // await change_src_image(doc);
//         // var title = doc.title;
//         // var body_ = await get_main_intelligent(doc);

//         // var media_ = doc.body.querySelector('article').querySelectorAll('img');
//         // // console.log(media_);
//         // return { title: title, content: body_, media: media_ };

//     }).catch(function (err) {
//         // There was an error
//         console.warn('Something went wrong.', err);
//     });
// }
