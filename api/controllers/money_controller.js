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
        data.active = 0;
        data.money_bonus = (data.money / 100) * 10;
        let sql = 'insert into money_history SET ?;'
        db.query(sql, req.body, (err, response) => {
            if (err) throw err
            res.json({ ok: 1 })
        })
    },
    get_list_top_up: (req, res) => {
        let sql = 'select * from money_history where user_id = ? and `type` = 1 order by `time`;'
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
        let sql = 'update money_history set `active` = 1, time = UNIX_TIMESTAMP() where id = ?;'
        db.query(sql, [Number(req.params.id)], (err, response) => {
            if (err) throw err
            res.json({ ok: 1 });
        })
    }
}