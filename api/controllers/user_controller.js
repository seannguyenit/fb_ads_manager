'use strict'
const util = require('util')
const mysql = require('mysql')
// const nodeMailer = require('nodemailer')
const db = require('./../db')
const path = require('path')
const mail_config = require('./email_controller')

module.exports = {
    get: (req, res) => {
        let sql = 'CALL `user_getall`(0)'
        db.query(sql, (err, response) => {
            if (err) throw err
            res.json(response)
        })
        // let sql = 'CALL `user_getbyname`(?)';
    },
    get_all_money: (req, res) => {
        var time_from = req.params.from;
        var time_to = req.params.to;
        // if(time_from === time_to){
        //     time_to = time_to + 0.0001;
        // };
        let sql = 'SELECT get_all_money(?,?) AS all_money, get_all_bonus(?,?) AS all_bonus, get_all_withdraw_money(?,?) AS all_withdraw_money LIMIT 1;'
        // , get_all_bonus() AS all_bonus, get_all_month_money() AS all_month_money, get_all_withdraw_money() AS all_withdraw_money
        db.query(sql, [time_from, time_to, time_from, time_to, time_from, time_to], (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    get_allmoney_today_money: (req, res) => {
        var from_allmoney = '2022-05-01 00:00:00';
        var time_from_allmoney = Number(new Date(from_allmoney).getTime() / 1000);
        var time_to_allmoney = Number(new Date().getTime() / 1000);

        var now_t = new Date();
        var m = (now_t.getMonth() + 1) < 10 ? `0${now_t.getMonth() + 1}` : (now_t.getMonth() + 1);
        var y = now_t.getFullYear();
        var d = now_t.getDate();
        var today = `${y}-${m}-${d}`;

        var s_today = `${y}-${m}-${d} 00:00:00`;
        var e_today = `${y}-${m}-${d} 23:59:59`;
        var star_today = Number(new Date(s_today).getTime() / 1000);
        var end_today = Number(new Date(e_today).getTime() / 1000);
        // if(time_from === time_to){
        //     time_to = time_to + 0.0001;
        // };
        let sql = 'SELECT get_all_money(?,?) AS all_money, get_all_current_money() AS all_current_money, get_all_use_money(?,?) AS all_use_money, ( SELECT COUNT(`user`.`id`) FROM `user` WHERE `user`.`active` = 1 and date(`user`.`created_at`) = ?) AS today_user, get_all_money(?,?) AS today_topup,  get_all_use_money(?,?) AS today_use_money LIMIT 1;'
        db.query(sql, [time_from_allmoney, time_to_allmoney, time_from_allmoney, time_to_allmoney, today, star_today, end_today, star_today, end_today], (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    get_agency: (req, res) => {
        let sql = 'SELECT * FROM `user` WHERE is_agency = 1 AND active = 1;'
        // , get_all_bonus() AS all_bonus, get_all_month_money() AS all_month_money, get_all_withdraw_money() AS all_withdraw_money
        db.query(sql, (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    get_sub_agency: (req, res) => {
        let sql = 'SELECT * FROM `user` WHERE par_id != 0 AND active = 1;'
        // , get_all_bonus() AS all_bonus, get_all_month_money() AS all_month_money, get_all_withdraw_money() AS all_withdraw_money
        db.query(sql, (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    get2: (req, res) => {
        let sql = 'CALL `user_getalllimit`(?,?)'
        db.query(sql, [req.params.cr_page, req.params.user_number_page], (err, response) => {
            if (err) throw err
            res.json(response)
        })
        // let sql = 'CALL `user_getbyname`(?)';

    },
    detail: (req, res) => {
        let sql = 'CALL `user_getdetail`(?)'
        db.query(sql, [req.params.id], (err, response) => {
            if (err) throw err
            var dt = response[0][0];
            res.json(dt);
        })
    },
    get_byname: (req, res) => {
        let username = '%' + req.params.username + '%';
        let sql = 'CALL `user_getbyname`(?)'
        db.query(sql, [username], (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },

    update: (req, res) => {
        let data = req.body;
        let userId = req.params.id;
        let sql = 'UPDATE user SET ? WHERE id = ?;'
        db.query(sql, [data, userId], (err, response) => {
            if (err) throw err
            let sql1 = 'call user_getdetail(?);'
            db.query(sql1, [req.params.id], (err, response) => {
                if (err) throw err
                var dt = response[0][0];
                res.json(dt)
            })
        })
    },
    store: (req, res) => {
        let data = req.body;
        let sql = 'INSERT INTO user SET ?;'
        db.query(sql, [data], (err, response) => {
            if (err) throw err
            let sql2 = 'call user_getdetail(last_insert_id());'
            db.query(sql2, [data], (err, response) => {
                if (err) throw err
                res.json(response[0][0])
            })
        })
    },
    delete: (req, res) => {
        let sql = 'DELETE FROM user WHERE id = ?'
        db.query(sql, [req.params.id], (err, response) => {
            if (err) throw err
            res.json({ message: 'Delete success!' })
        })
    },
    update_history: (req, res) => {
        var active = 0;
        let sql = 'Update pricing_history SET pricing_active = ? WHERE user_id = ?'
        db.query(sql, [active, req.params.id], (err, response) => {
            if (err) throw err
            res.json({ message: 'Update success!' })
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
        let key_active = uuidv4();
        let sql = 'INSERT INTO `user` SET `username` = ?,key_active = ?,`active` = 0,pass = ?,par_id = (select tem.id from `user` as tem where tem.ref = ? limit 1);'
        let ok = 0;
        db.query(sql, [data.user, key_active, data.pass, data.ref], (err, response) => {
            if (err) throw err
            mail_config.sendMail(data.user, key_active).then(() => {
                ok = 1
            }).catch((error) => {
                ok = 0
            }).finally(() => {
                res.json({ ok: ok })
            });
        })
    },
    recovery: (req, res) => {
        let key_recovery = uuidv4();
        let sql = 'Update `user` SET key_recovery = ? WHERE username = ?;'
        let ok = 0;
        db.query(sql, [key_recovery, req.params.username], (err, response) => {
            if (err) throw err
            mail_config.sendMail_recovery(req.params.username, key_recovery).then(() => {
                ok = 1
            }).catch((error) => {
                ok = 0
            }).finally(() => {
                res.json({ ok: ok })
            });
        })
    },
    recovery_save: (req, res) => {
        let key_recovery = req.body.key_recovery;
        let pass = req.body.pass;
        let sql = 'Update `user` SET pass = ? WHERE key_recovery = ?;'
        db.query(sql, [pass, key_recovery], (err, response) => {
            if (err) throw err
            if (response.affectedRows == 1) {
                res.json({ ok: 1 })
            } else {
                res.json({ error: 'Thay đổi mật khẩu không thành công !' })
            }
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
    start_request: (req, res) => {
        let data = req.body;
        let sql_current_pricing = 'SELECT P.*,(SELECT count(id) as existed FROM request_history where user_id = ? and date(FROM_UNIXTIME(`time`)) = date(now()) and `status` = 1) as number_today,Date_add(PH.time,interval sum(P.limit_day) day) as limit_time FROM (select TB1.id,PRC.name,TB1.user_id,TB1.pricing_id,TB1.pricing_active,TB1.time,TB1.created_at,TB1.type,if(TB1.limit_day = 0,PRC.limit_day,TB1.limit_day) as limit_day,if(TB1.limit_fb = 0,PRC.limit_fb,TB1.limit_fb) as limit_fb,if(TB1.limit_request = 0,PRC.limit_request,TB1.limit_request) as limit_request,if(TB1.level = 0,PRC.level,TB1.level) as level from (SELECT * FROM pricing_history where user_id = ? order by time desc limit 1) as TB1 left join pricing AS PRC on TB1.pricing_id = PRC.id) as PH left join pricing AS P on P.id = PH.pricing_id where PH.user_id = ? and P.active = 1 order by PH.time desc limit 1;'
        db.query(sql_current_pricing, [Number(data.user_id), Number(data.user_id), Number(data.user_id)], (err, response) => {
            if (err) throw error
            if (response[0]) {
                let limit_time = Number(response[0].limit_time || 0);
                let limit_request = response[0].limit_request || 0;
                let number_today = response[0].number_today || 0;
                let now_ = Math.floor(new Date().getTime() / 1000);
                if (limit_time < now_) {
                    res.json({ error: 'Bạn chưa đăng ký gia hạn !' })
                }
                if (number_today >= limit_request) {
                    res.json({ error: 'Đã đạt tối đa request hôm nay !' })
                }
                let sql = 'INSERT INTO request_history SET time = ?,user_id = ?;'
                let t_ = Number(Math.floor(new Date().getTime() / 1000));
                db.query(sql, [t_, Number(data.user_id)], (err, response) => {
                    if (err) throw err
                    res.json({ time: t_ })
                })
            } else {
                res.json({ error: 'Bạn chưa đăng ký gia hạn !' })
            }
        })
    },
    end_request: (req, res) => {
        let data = req.body;
        let sql = 'update request_history SET status = ?,error = ? where user_id = ? and time = ? and status is NULL;'
        db.query(sql, [Number(data.status), data.error, Number(data.user_id), Number(req.params.time),], (err, response) => {
            if (err) throw err
            res.json({ ok: 1 })
        })
    },
    active_email: (req, res) => {
        let key_active = req.params.key_active;
        let sql = 'UPDATE `user` SET `active` = 1 WHERE key_active = ?;'
        db.query(sql, [key_active], (err, response) => {
            if (err) throw err
            if (response.affectedRows == 1) {
                res.sendFile(path.join(__dirname, '../../view/notice.html'))
            } else {
                res.json({ error: 'Kích hoạt không thành công !' })
            }
        })
    },
    get_current_finance: (req, res) => {
        let sql = 'select id,username,get_current_money(`user`.`id`) as money,get_current_bonus(`user`.`id`) as bonus from `user` where id = ? limit 1'
        db.query(sql, [Number(req.params.id)], (err, response) => {
            if (err) {
                res.json({ ok: 0 })
            } else {
                res.json(response)
            }
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
        var time = new Date().getTime() / 1000;
        let sql = 'INSERT INTO user_token_fb SET ?;'
        db.query(sql, [data], (err, response) => {
            if (err) throw err
            let sql_active = 'insert into history_login set user_id = ? ,action = ?, time = ?, active = ?; '
            db.query(sql_active, [data.user_id, "Gia Hạn Token", time, data.token], (err, response) => {
                if (err) throw err
                res.json({ ok: 1 });
            })
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
        let sql = 'select count(A.id) as existed from `user` AS A where A.username = ? and A.id != ? and A.active = 1;'
        db.query(sql, [req.params.username, Number(req.params.id)], (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    user_check: (req, res) => {
        let sql = 'select * from `user` where user.username = ? and user.is_admin = 0 limit 1;'
        db.query(sql, [req.params.username], (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    get_all_agency: (req, res) => {
        let sql = 'CALL `user_getbyagency`(0)';
        db.query(sql, (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    get_user_by_agency: (req, res) => {
        let sql = 'SELECT * from user where active = 1 and par_id = ?'
        db.query(sql, [Number(req.params.id)], (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    get_bychildname: (req, res) => {
        let username = '%' + req.params.username + '%';
        let sql = 'SELECT `user`.`id`,`user`.`username`,(SELECT sum(money) FROM money_history where `active` = 1 and `type` =  1 and user_id = `user`.id) as total, `user`.`ref`, `user`.`is_agency`, `user`.`created_at` from `user` where `user`.par_id = ? and active = 1 and `user`.username like ?';
        db.query(sql, [Number(req.params.id), username], (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    get_childbycreated: (req, res) => {
        let sql = 'SELECT `user`.`id`,`user`.`username`,(SELECT sum(money) FROM money_history where `active` = 1 and `type` =  1 and user_id = `user`.id) as total, `user`.`ref`, `user`.`is_agency`, `user`.`created_at` from `user` where `user`.par_id = ? and active = 1 and (`user`.created_at >= ? and `user`.created_at <= ?);';
        db.query(sql, [Number(req.params.id), req.params.from, req.params.to], (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    get_agency_child: (req, res) => {
        let sql = 'SELECT `user`.`username`,`user`.`id`,(SELECT sum(money) FROM money_history where `active` = 1 and `type` =  1 and user_id = `user`.id) as total, `user`.`ref`, `user`.`is_agency`, `user`.`created_at` from `user` where `user`.par_id = ? and active = 1'
        db.query(sql, [Number(req.params.id)], (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    get_agency_count: (req, res) => {
        let sql = 'select (select count(id) from user where active = 1 and par_id = ?) as number_user,count(MH.id) as topup_time,SUM(MH.money) as topup_money from money_history AS MH where active = 1 and type = 1 and MH.user_id = ?;'
        db.query(sql, [Number(req.params.id), Number(req.params.id)], (err, response) => {
            if (err) throw err
            res.json(response[0])
        })
    },
    get_agency_info: (req, res) => {
        let sql = 'SELECT `user`.`username`, `user`.`ref`, `user`.`is_agency`, `user`.`agency_time` from `user` where `user`.id = ? and active = 1 and is_agency = 1 limit 1'
        db.query(sql, [Number(req.params.id)], (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    // get_agency_info_by_user: (req, res) => {
    //     get_infor_agency(req.params.id,(rs) => {
    //         var par_id = rs[0].par_id;
    //         if(par_id){
    //             let sql = 'SELECT * from `user` where `user`.id = ? and active = 1 limit 1'
    //             db.query(sql, [Number(par_id)], (err, response) => {
    //                 if (err) throw err
    //                 res.json(response)
    //             })
    //         }
    //     })


    //     // let sql = 'SELECT `user`.`username`, `user`.`ref`, `user`.`is_agency`, `user`.`agency_time` from `user` where `user`.id = ? and active = 1 limit 1'
    //     // db.query(sql, [Number(req.params.id)], (err, response) => {
    //     //     if (err) throw err
    //     //     res.json(response)
    //     // })
    // },
    get_all_agency_reg: (req, res) => {
        let sql = 'SELECT `user`.`id`,get_current_money(`user`.`id`) as money, `user`.`username`, `user`.`is_admin`, `user`.`active`, `user`.`real_name`, `user`.`phone`, `user`.`add`, `user`.`created_at`, `user`.`created_by`, `user`.`is_public`, `user`.`par_id`, `user`.`ref`, `user`.`is_agency`, `user`.`agency_time` FROM `user` where is_agency = 0 and `user`.`agency_time` is not null and active = 1'
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
    },
    agency_cancel: (req, res) => {
        let sql = 'update `user` set is_agency = NULL, agency_time = UNIX_TIMESTAMP() ,ref = NULL where id = ?;'
        db.query(sql, [Number(req.params.id)], (err, response) => {
            if (err) throw err
            res.json({ ok: 1 });
        })
    },
    // agency_move_money: (req, res) => {
    //             let data = req.body;
    //             data.time = new Date().getTime() / 1000;
    //             let sql = 'insert into contacts SET ?;'
    //                 db.query(sql, data, (err, response) => {
    //                     if (err) throw err
    //                     res.json({ok:1})
    //                 })
    // },
    admin_contacts: (req, res) => {
        let sql = 'SELECT * FROM admin_contacts limit 1;'
        db.query(sql, (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    list_topup_today: (req, res) => {
        let sql = 'SELECT * FROM `money_history` where `user_id` = ? and `procedure` = ?;'
        db.query(sql, [req.params.id, req.params.proce], (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    list_topup_momo: (req, res) => {
        let sql = 'SELECT money_history.id,money_history.procedure,money_history.transactionID FROM `money_history` where `user_id` = ? and `procedure` = ?;'
        db.query(sql, [req.params.id, req.params.proce], (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    admin_bank: (req, res) => {
        let sql = 'SELECT * FROM admin_bank;'
        db.query(sql, (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    update_admin_bank: (req, res) => {
        let sql = 'UPDATE admin_bank SET ? where type = ?'
        db.query(sql, [req.body, req.body.type], (err, response) => {
            if (err) throw err
            res.json({ mess: "update success" });
        })
    },
    edit_action_bank: (req, res) => {
        var action = req.params.action;
        if (Number(action) === 0) {
            action = 1
        } else {
            action = 0
        }
        let sql = 'update `admin_bank` set `action` = ? where id = ?;'
        db.query(sql, [action, req.params.id], (err, response) => {
            if (err) throw err
            res.json({ message: 'Success!' })
        })
    },
    update_admin_contacts: (req, res) => {
        let sql = 'UPDATE admin_contacts SET ? where id = 1'
        db.query(sql, req.body, (err, response) => {
            if (err) throw err
            res.json({ mess: "update success" });
        })
    },
    del_contacts: (req, res) => {
        let sql = 'delete from contacts where id = ?;'
        db.query(sql, [req.params.id], (err, response) => {
            if (err) throw err
            res.json({ ok: 1 })
        })
    },

    get_articles: (req, res) => {
        let sql = 'select * from articles where `active` = 1 order by `time` DESC limit 20;'
        db.query(sql, (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    insert_articles: (req, res) => {
        let data = req.body;
        // data.pass = data.pass;
        data.active = 1;
        data.time = new Date().getTime() / 1000;
        let sql = 'INSERT INTO articles SET ?;'
        db.query(sql, [data], (err, response) => {
            if (err) throw err
            res.json({ message: 'save success!' })
        })
    },
    detail_articles: (req, res) => {
        // let is_admin = req.params.is_admin || false;
        let sql = 'select * from articles where `active` = 1 and `id` = ? limit 1;'
        db.query(sql, [req.params.id], (err, response) => {
            if (err) throw err
            res.json(response[0])
        })
    },
    update_articles: (req, res) => {
        let data = req.body;
        data.time = new Date().getTime() / 1000;
        let id = req.params.id;
        let sql = 'UPDATE articles SET ? WHERE id = ?;'
        db.query(sql, [data, id], (err, response) => {
            if (err) throw err
            res.json({ message: 'save success!' })
        })
    },
    delete_articles: (req, res) => {
        let sql = 'UPDATE pricing SET `active` = 0 WHERE id = ?;'
        db.query(sql, [req.params.id], (err, response) => {
            if (err) throw err
            res.json({ message: 'Delete success!' })
        })
    },

}

function uuidv4() {
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if (d > 0) {//Use timestamp until depleted
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

// function get_infor_agency(id, callback) {
//     let sql = 'select * from user where id = ? and active  = 1'
//     db.query(sql, [Number(id)], (err, response) => {
//         if (err) throw err
//         callback(response)
//     })
// }
