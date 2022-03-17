'use strict'

const util = require('util')
const mysql = require('mysql')
const db = require('./../db')
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
        data.time = new Date().getTime() / 1000;
        var active = 0;
        if (req.body.active && req.body.active == 1) {
            active = 1;
        }
        data.active = active;
        data.money_bonus = (data.money / 100) * 10;
        let sql = 'insert into money_history SET ?;'
        db.query(sql, data, (err, response) => {
            if (err) throw err
            res.json({ ok: 1 })
        })
    },
    get_list_top_up: (req, res) => {
        let sql = 'select * from money_history where user_id = ? and `type` = 1 and money > 0 order by `time`;'
        db.query(sql, Number(req.params.user_id), (err, response) => {
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