'use strict'

const util = require('util')
const mysql = require('mysql')
const db = require('./../db')
const rq_sv = require('./request_controller');

// const session = require('express-session');

module.exports = {
    get_history: (req, res) => {
        let sql = 'select * from money_history where user_id = ? and `active` = 1 order by `time` desc;'
        db.query(sql, Number(req.params.user_id), (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    edit_money_byadmin: (req, res) => {
        if (Number(req.body.type) === 2) {
            get_current_finance(req.body.user_id, (vl) => {
                let money_bonus = vl[0].money;
                if (Number(req.body.money) > Number(money_bonus)) {
                    res.json({ mess: "số dư trong tài khoảng không đủ" })
                } else {
                    var data = req.body;
                    data.time = new Date().getTime() / 1000;
                    data.active = 1;
                    let sql = 'insert into money_history SET ?;'
                    db.query(sql, data, (err, response) => {
                        if (err) throw err
                        res.json({ ok: 1 })
                    })
                }
            })
        } else {
            var data = req.body;
            data.time = new Date().getTime() / 1000;
            data.active = 1;
            let sql = 'insert into money_history SET ?;'
            db.query(sql, data, (err, response) => {
                if (err) throw err
                res.json({ ok: 1 })
            })
        }

    },
    add_money: (req, res) => {
        get_current_finance(req.body.user_id, (vl) => {
            let money_bonus = vl[0].bonus;
            if (Number(req.body.withdraw) > Number(money_bonus)) {
                res.json({ mess: "số dư trong tài khoảng không đủ" })
            }
            else {
                let data = req.body;
                data.type = 1;
                // data.withdraw = 
                data.time = new Date().getTime() / 1000;
                // data.time = new Date().getTime()
                var active = 0;
                if (req.body.active && req.body.active == 1) {
                    active = 1;
                }
                data.active = active;
                // if ((data.task_id || 0) > 0) {
                //{"Code":2,"Message":"Lấy dữ liệu thành công, thẻsai mệnh giá","CardSend":1000000.0,"CardValue":10000.0,"ValueReceive":4250.0}
                // waitingForCardResult(data.task_id).then((rs) => {
                // if (rs.Code == 2) {
                // get_history_card(data.task_id, (rs) => {
                //     // data.money = rs.ValueReceive;
                //     data.money = rs.amount;
                //     data.money_bonus = (data.money / 100) * 10;
                //     let sql = 'insert into money_history SET ?;'
                //     db.query(sql, data, (err, response) => {
                //         if (err) throw err
                //         res.json({ ok: 1 })
                //     })
                // });
                // } 
                // else {
                //     res.json({ ok: 0, error: rs.Message });
                // }
                // });
                // } else {
                data.money_bonus = (data.money / 100) * 10;
                let sql = 'insert into money_history SET ?;'
                db.query(sql, data, (err, response) => {
                    if (err) throw err
                    res.json({ ok: 1 })
                })
                // }
            }
        });

    },
    get_list_money_history_limit: (req, res) => {
        let sql = 'select * from money_history where user_id = ? and `type` = 1 and method = 2 order by `time` DESC limit 1 ;'
        db.query(sql, Number(req.params.user_id), (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    get_list_top_up: (req, res) => {
        let sql = 'select * from money_history where user_id = ? and `type` = 1 and money >= 0 order by `time` DESC limit 20 ;'
        db.query(sql, Number(req.params.user_id), (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    get_list_withdraw: (req, res) => {
        let sql = 'select * from money_history where id = ? limit 1;'
        db.query(sql, Number(req.params.id), (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    get_list_reg: (req, res) => {
        let sql = 'select MH.*,U.username,U.is_agency from money_history AS MH left join `user` AS U on MH.user_id = U.id where (CAST(MH.time AS decimal(13,3)) >= ? and CAST(MH.time AS decimal(13,3)) <= ?) and MH.`type` = 1 and MH.`active` = 0 and method = 1 order by MH.`time`;'
        db.query(sql, [req.params.from, req.params.to], (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    get_list_reg2: (req, res) => {
        let sql = 'select MH.*,U.username,U.is_agency from money_history AS MH left join `user` AS U on MH.user_id = U.id where (CAST(MH.time AS decimal(13,3)) >= ? and CAST(MH.time AS decimal(13,3)) <= ?) and MH.`type` = 1 and MH.`active` = 0 and method = 2 order by MH.`time`;'
        db.query(sql, [req.params.from, req.params.to], (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    approve_topup: (req, res) => {
        let money = Number(req.params.money);
        let bonus = 0;
        if (Number(req.params.is_agency) == 1) {
            bonus = Math.floor(money / 10);
        }
        let sql = 'update money_history set `active` = 1,`money` = ?,`money_bonus` = ?, time = UNIX_TIMESTAMP() where id = ?;'
        db.query(sql, [money, bonus, Number(req.params.id)], (err, response) => {
            if (err) throw err
            res.json({ ok: 1 });
        })
    },
    approve2_topup: (req, res) => {
        let money = Number(req.params.money);
        let sql = 'update money_history set `active` = 1,`withdraw` = ?, time = UNIX_TIMESTAMP() where id = ?;'
        db.query(sql, [money, Number(req.params.id)], (err, response) => {
            if (err) throw err
            res.json({ ok: 1 });
        })
    },
    cancel_topup: (req, res) => {
        let sql = 'delete from money_history where id = ?;'
        db.query(sql, [Number(req.params.id)], (err, response) => {
            if (err) throw err
            res.json({ ok: 1 });
        })
    },
    successfully_topup: (req, res) => {
        let money_history = req.body;
        console.log('Receive receipt : ',money_history);
        if (money_history) {
            insert_history_card(money_history, (rs) => {
                var err = '';
                var money = 0;
                var money_bonus = 0;
                if (rs.ok = 1) {
                    if (money_history.Success == false) {
                        err = 'Gạch thẻ lỗi';
                    } else {
                        money = money_history.amount;
                        money_bonus = (money / 100) * 10;
                    }
                    let sql1 = 'update money_history set money = ?,money_bonus = ?,error = ? where task_id = ?;'
                    db.query(sql1, [Number(money), Number(money_bonus), err, Number(money_history.TaskId)], (err, response) => {
                        if (err) throw err
                        res.json({ code: 1 })
                    })
                }
            })
        }
    },
    add_money_ticket: (req, res) => {
        let money_history = req.body;
        let sql = 'select * from user where id = ? limit 1';
        db.query(sql, [Number(money_history.user_id)], (err, response) => {
            if (err) throw err;
            var par_id = response[0].par_id;
            if (par_id > 0) {
                req.body.money_bonus = (money_history.money / 100) * 10;
            } else {
                req.body.money_bonus = 0;
            }
            let sql1 = 'insert into money_history SET ?;'
            db.query(sql1, money_history, (err, response) => {
                if (err) throw err
                res.json({ ok: 1 })
            })
        })

    }
}

async function waitingForCardResult(task_id) {
    var info = await rq_sv.get(`https://api.autocard365.com/api/checktask/${task_id}`);
    var count = 0;
    while (Number(info.data.Code) < 2 && count < 30) {
        await waitingForNext(5000);
        info = await rq_sv.get(`https://api.autocard365.com/api/checktask/${task_id}`);
        count++;
    }
    return info.data;
}

function insert_history_card(data, callback) {
    let sql = 'insert into card_history set ?'
    db.query(sql, data, (err, response) => {
        if (err) throw err
        callback({ ok: 1 })
    })
}

function get_current_finance(id, callback) {
    let sql = 'select id,username,get_current_money(`user`.`id`) as money,get_current_bonus(`user`.`id`) as bonus from `user` where id = ? limit 1'
    db.query(sql, [Number(id)], (err, response) => {
        if (err) throw err
        callback(response)
    })
}

async function delay(delayInms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(2);
        }, delayInms);
    });
}
async function waitingForNext(time) {
    // console.log('waiting...')
    let delayres = await delay(time);
}
