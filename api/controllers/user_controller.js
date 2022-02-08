'use strict'

const util = require('util')
const mysql = require('mysql')
const db = require('./../db')

module.exports = {
    get: (req, res) => {
        let sql = 'CALL `user_getall`(0)'
        db.query(sql, (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    detail: (req, res) => {
        let sql = 'CALL `user_getdetail`(?)'
        db.query(sql, [req.params.id], (err, response) => {
            if (err) throw err
            var dt = response[0][0];
            res.json(dt);
        })
    },
    update: (req, res) => {
        let data = req.body;
        let userId = req.params.id;
        let sql = 'UPDATE user SET ? WHERE id = ?;'
        db.query(sql, [data, userId], (err, response) => {
            if (err) throw err
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
        let sql = 'INSERT INTO user SET ?;'
        db.query(sql, [data], (err, response) => {
            if (err) throw err
        })
        let sql2 = 'call user_getdetail(last_insert_id());'
        db.query(sql2, [data], (err, response) => {
            if (err) throw err
            res.json(response[0][0])
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
        let data = req.body;
        let sql = 'CALL `login`(?,?)'
        try {
            db.query(sql, [data.user, data.pass], (err, response) => {
                if (err) throw err
                let dt = response[0][0];
                if (dt) {
                    res.json({ ok: 1, data: response[0][0] });
                } else {
                    res.json({ ok: 0 });
                }
            })
        } catch (error) {
        }
    },
    logout: (req, res) => {
        let data = req.body;
        let sql = 'CALL `logout`(?,?)'
        try {
            db.query(sql, [data.user, data.token], (err, response) => {
                if (err) throw err
                res.json({ ok: 1 });
            })
        } catch (error) {
        }
    },
    register: (req, res) => {
        let data = req.body;
        let sql = 'INSERT INTO `user` SET `username` = ?,pass = ?,par_id = (select tem.id from `user` as tem where tem.ref = ? limit 1);'
        db.query(sql, [data.user, data.pass, data.ref], (err, response) => {
            if (err) throw err
            res.json({ ok: 1 })
        })
    },
    change_pass: (req, res) => {
        let old_pass = req.body.pass;
        let new_pass = req.body.new_pass;
        let userId = req.params.id;
        let sql = 'UPDATE user SET pass = ? WHERE id = ? and pass = ?;'
        db.query(sql, [new_pass, userId, old_pass], (err, response) => {
            if (err) throw err
            if (response.affectedRows == 1) {
                res.json({ ok: 1 })
            } else {
                res.json({ error: 'Thay đổi mật khẩu không thành công !' })
            }
        })
    },
    get_current_finance: (req, res) => {
        let sql = 'select id,username,get_current_money(`user`.`id`) as money,get_current_bonus(`user`.`id`) as bonus from `user` where id = ? limit 1'
        db.query(sql, [Number(req.params.id)], (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    get_sd: async (req, res) => {
        let data = req.body;
        try {
            db.query(sql, [data.user, data.token], (err, response) => {
                if (err) throw err
                res.json({ ok: 1 });
            })
        } catch (error) {
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
        db.query(sql, [req.params.id], (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    user_check_existed: (req, res) => {
        let sql = 'call user_check_existed(?,?);'
        db.query(sql, [req.params.id, req.params.username], (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    get_all_agency: (req, res) => {
        let sql = 'SELECT `user`.`id`, `user`.`username`, `user`.`is_admin`, `user`.`active`, `user`.`real_name`, `user`.`phone`, `user`.`add`, `user`.`created_at`, `user`.`created_by`, `user`.`is_public`, `user`.`par_id`, `user`.`ref`, `user`.`is_agency`, `user`.`agency_time` FROM `user` where is_agency = 1 and active = 1'
        db.query(sql, [], (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    get_agency_info: (req, res) => {
        let sql = 'SELECT `user`.`username`, `user`.`ref`, `user`.`is_agency`, `user`.`agency_time` from `user` where `user`.id = ? and active = 1 limit 1'
        db.query(sql, [Number(req.params.id)], (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    get_all_agency_reg: (req, res) => {
        let sql = 'SELECT `user`.`id`, `user`.`username`, `user`.`is_admin`, `user`.`active`, `user`.`real_name`, `user`.`phone`, `user`.`add`, `user`.`created_at`, `user`.`created_by`, `user`.`is_public`, `user`.`par_id`, `user`.`ref`, `user`.`is_agency`, `user`.`agency_time` FROM `user` where is_agency = 0 and `user`.`agency_time` is not null and active = 1'
        db.query(sql, [], (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    agency_reg: (req, res) => {
        let sql = 'update `user` set is_agency = 0, agency_time = UNIX_TIMESTAMP() where id = ?;'
        db.query(sql, [Number(req.params.id)], (err, response) => {
            if (err) throw err
            res.json({ ok: 1 });
        })
    },
    agency_app: (req, res) => {
        let sql = 'update `user` set is_agency = 1, agency_time = UNIX_TIMESTAMP() ,ref = (LEFT(MD5(RAND()), 8)) where id = ?;'
        db.query(sql, [Number(req.params.id)], (err, response) => {
            if (err) throw err
            res.json({ ok: 1 });
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
