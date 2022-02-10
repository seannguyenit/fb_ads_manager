'use strict'

const util = require('util')
const mysql = require('mysql')
const db = require('./../db')
// const session = require('express-session');

module.exports = {
    get: (req, res) => {
        let sql = 'select * from pricing where `active` = 1;'
        db.query(sql, (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    detail: (req, res) => {
        // let is_admin = req.params.is_admin || false;
        let sql = 'select * from pricing where `active` = 1 and `id` = ? limit 1;'
        db.query(sql, [req.params.id], (err, response) => {
            if (err) throw err
            res.json(response[0])
        })
    },
    update: (req, res) => {
        let data = req.body;
        let pricingId = req.params.id;
        let sql = 'UPDATE pricing SET ? WHERE id = ?;'
        db.query(sql, [data, pricingId], (err, response) => {
            if (err) throw err
            res.json({ message: 'save success!' })
        })
    },
    store: (req, res) => {
        let data = req.body;
        // data.pass = data.pass;
        let sql = 'INSERT INTO pricing SET ?;'
        db.query(sql, [data], (err, response) => {
            if (err) throw err
            res.json({ message: 'save success!' })
        })
    },
    delete_directly: (req, res) => {
        let sql = 'DELETE FROM pricing WHERE id = ?'
        db.query(sql, [req.params.id], (err, response) => {
            if (err) throw err
            res.json({ message: 'Delete success!' })
        })
    },
    delete: (req, res) => {
        let sql = 'UPDATE pricing SET `active` = 0 WHERE id = ?;'
        db.query(sql, [req.params.id], (err, response) => {
            if (err) throw err
            res.json({ message: 'Delete success!' })
        })
    },
    pricing_histories: (req, res) => {
        // data.pass = data.pass;
        let sql = 'select PH.*,U.username,U.real_name,P.name as pricing_name from pricing_history AS PH left join `user` AS U on U.id = PH.user_id left join pricing as P on P.id = PH.pricing_id where PH.user_id = ?'
        db.query(sql, [req.params.user_id], (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    order_pricing: (req, res) => {
        var data_money = req.body.data_money;
        var data_pricing = req.body.data_pricing;
        data_money.type = 0;
        data_money.time = new Date().getTime() / 1000;
        data_money.active = 1;
        data_money.money_bonus = 0;
        let sql_check = 'SELECT get_current_money(?) as rmn;'
        db.query(sql_check, [Number(data_money.user_id)], (err, response) => {
            if (err) throw err
            if (response[0] && (response[0].rmn >= data_money.money)) {
                let sql_money = 'insert into money_history SET ?;'
                db.query(sql_money, data_money, (err, response) => {
                    if (err) throw err
                    let sql = 'INSERT INTO pricing_history SET ?;'
                    db.query(sql, [data_pricing], (err, response) => {
                        if (err) throw err
                        res.json({ message: 'save success!' })
                    })
                })
            } else {
                res.json({ error: 'Không đủ tiền trong tk!' })
            }
        })
    },
}