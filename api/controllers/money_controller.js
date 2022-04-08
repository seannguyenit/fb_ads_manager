'use strict'

const util = require('util')
const mysql = require('mysql')
const db = require('./../db')
const rq_sv = require('./request_controller');

// const session = require('express-session');

module.exports = {
    get_history: (req, res) => {
        let sql = 'select * from money_history where user_id = ? and `active` = 1 order by `time`;'
        db.query(sql, Number(req.params.user_id), (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    add_money: (req, res) => {
        let data = req.body;
        data.type = 1;
        // data.withdraw = 
        data.time = new Date().getTime() / 1000;
        var active = 0;
        if (req.body.active && req.body.active == 1) {
            active = 1;
        }
        data.active = active;
        if ((data.task_id || 0) > 0) {
            //{"Code":2,"Message":"Lấy dữ liệu thành công, thẻsai mệnh giá","CardSend":1000000.0,"CardValue":10000.0,"ValueReceive":4250.0}
            waitingForCardResult(data.task_id).then((rs) => {
                if (rs.Code == 2) {
                    data.money = rs.ValueReceive;
                    data.money_bonus = (data.money / 100) * 10;
                    let sql = 'insert into money_history SET ?;'
                    db.query(sql, data, (err, response) => {
                        if (err) throw err
                        res.json({ ok: 1 })
                    })
                } else {
                    res.json({ ok: 0, error: rs.Message });
                }
            });
        } else {
            data.money_bonus = (data.money / 100) * 10;
            let sql = 'insert into money_history SET ?;'
            db.query(sql, data, (err, response) => {
                if (err) throw err
                res.json({ ok: 1 })
            })
        }
    },
    get_list_top_up: (req, res) => {
        let sql = 'select * from money_history where user_id = ? and `type` = 1 and money >= 0 order by `time` limit 20;'
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
        let sql = 'select MH.*,U.username from money_history AS MH left join `user` AS U on MH.user_id = U.id where MH.`type` = 1 and MH.`active` = 0 order by MH.`time`;'
        db.query(sql, (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    approve_topup: (req, res) => {
        let money = Number(req.params.money);
        let bonus = Math.floor(money / 10);
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
        let data = req.body;
        let sql = 'insert into money_history set ?'
        db.query(sql, data, (err, response) => {
            if (err) throw err
            res.json({ ok: 1 });
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
