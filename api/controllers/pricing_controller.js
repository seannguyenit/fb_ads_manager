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
    insert_pricing_history: (req, res) => {
        let data = req.body;
        // let is_admin = req.params.is_admin || false;
        let sql = 'INSERT INTO pricing_history SET ?;'
        db.query(sql, [data], (err, response) => {
            if (err) throw err
            res.json({ message: 'save success!' })
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
    // pricing_histories: (req, res) => {
    //     // data.pass = data.pass;
    //     let sql = 'select PH.*,U.username,U.real_name,P.name as pricing_name from pricing_history AS PH left join `user` AS U on U.id = PH.user_id left join pricing as P on P.id = PH.pricing_id where PH.user_id = ?'
    //     db.query(sql, [req.params.user_id], (err, response) => {
    //         if (err) throw err
    //         res.json(response)
    //     })
    // },
    pricing_histories: (req, res) => {
        let sql = 'select PH.*,  (select Date_add(pricing_history.time,interval sum(pricing_history.limit_day) day) as limit_time_ from pricing_history where pricing_history.user_id = ? and pricing_history.pricing_active = 1 and pricing_history.limit_day != 0 limit 1) as limit_time_,  (select Date_add(PH.time,interval sum(P.limit_day)  day) as limit_time from pricing_history AS PH left join history_login AS LG on LG.user_id = PH.user_id left join pricing AS P on P.id = PH.pricing_id where PH.user_id = ? AND PH.pricing_active = 1 and PH.limit_day = 0 limit 1) as limit_time,U.username,U.real_name,P.price,P.name as pricing_name from pricing_history AS PH left join `user` AS U on U.id = PH.user_id left join pricing as P on P.id = PH.pricing_id where PH.user_id = ? and PH.pricing_active = 1 GROUP BY PH.time order by PH.time DESC limit 10'
        db.query(sql, [Number(req.params.user_id),Number(req.params.user_id),Number(req.params.user_id)], (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    // pricing_histories: (req, res) => {
    //     // data.pass = data.pass;
    //     let sql = 'select PH.*,U.username,U.real_name,P.name as pricing_name from pricing_history AS PH left join `user` AS U on U.id = PH.user_id left join pricing as P on P.id = PH.pricing_id where PH.user_id = ? '
    //     db.query(sql, [req.params.user_id], (err, response) => {
    //         if (err) throw err
    //         res.json(response)
    //     })
    // },
    wrap_pricing_histories: (req, res) => {
        // data.pass = data.pass;
        let sql = 'select P.*,PH.created_at,U.username,U.real_name,P.name as pricing_name from pricing_history AS PH left join `user` AS U on U.id = PH.user_id left join pricing as P on P.id = PH.pricing_id where PH.user_id = ? and PH.pricing_active = 1 GROUP BY PH.pricing_id order by PH.pricing_id DESC LIMIT 1'
        db.query(sql, [Number(req.params.user_id)], (err, response) => {
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
        var action = "Mua Gói";
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
                        let sql_active = 'insert into history_login set user_id = ? ,action = ?, time = ?; '
                        db.query(sql_active, [data_money.user_id,action, data_money.time], (err, response) => {
                            if (err) throw err
                        res.json({ message: 'save success!' })
                        })
                    })
                })
            } else {
                res.json({ error: 'Không đủ tiền trong tk!' })
            }
        })
    },
}