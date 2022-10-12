'use strict'

const util = require('util')
const mysql = require('mysql')
const db = require('./../db')
// const session = require('express-session');

module.exports = {
    get: (req, res) => {
        let sql = 'select * from tool where `active` = 1;'
        db.query(sql, (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    detail: (req, res) => {
        // let is_admin = req.params.is_admin || false;
        let sql = 'select * from tool where `active` = 1 and `id` = ? limit 1;'
        db.query(sql, [req.params.id], (err, response) => {
            if (err) throw err
            res.json(response[0])
        })
    },
    get_tool_pricing_stt: (req, res) => {
        let pricing_id = Number(req.params.id);
        let sql = 'select * from tool_pricing where `pricing_id` = ?;'
        db.query(sql, [pricing_id], (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    check_symbol_tool: (req, res) => {
        // let is_admin = req.params.is_admin || false;
        let sql = 'select TP.*,T.symbol,T.name from tool_pricing as TP left join tool AS T on T.id = TP.tool_id where TP.pricing_id = (SELECT pricing_id FROM pricing_history where user_id = ? order by `time` desc limit 1) and T.symbol = ?;'
        db.query(sql, [Number(req.params.user_id), req.params.symbol], (err, response) => {
            if (err) throw err
            res.json(response[0])
        })
    },
    get_all_tool_pricing: (req, res) => {
        let sql = 'select TP.*,T.name as tool_name from tool_pricing as TP left join tool as T on T.id = TP.tool_id;'
        db.query(sql, (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    insert_tool_pricing: (req, res) => {
        let data = req.body;
        // let is_admin = req.params.is_admin || false;
        let sql = 'INSERT INTO tool_pricing SET ?;'
        db.query(sql, [data], (err, response) => {
            if (err) throw err
            res.json({ message: 'save success!' })
        })
    },
    update: (req, res) => {
        let data = req.body;
        let toolId = req.params.id;
        let sql = 'UPDATE tool SET ? WHERE id = ?;'
        db.query(sql, [data, toolId], (err, response) => {
            if (err) throw err
            res.json({ message: 'save success!' })
        })
    },
    store: (req, res) => {
        let data = req.body;
        // data.pass = data.pass;
        let sql = 'INSERT INTO tool SET ?;'
        db.query(sql, [data], (err, response) => {
            if (err) throw err
            res.json({ message: 'save success!' })
        })
    },
    delete_directly: (req, res) => {
        let sql = 'DELETE FROM tool WHERE id = ?'
        db.query(sql, [req.params.id], (err, response) => {
            if (err) throw err
            res.json({ message: 'Delete success!' })
        })
    },
    delete: (req, res) => {
        let sql = 'UPDATE tool SET `active` = 0 WHERE id = ?;'
        db.query(sql, [req.params.id], (err, response) => {
            if (err) throw err
            res.json({ message: 'Delete success!' })
        })
    },
    delete_tool_pricing: (req, res) => {
        let tool_id = Number(req.params.id);
        let pricing_id = Number(req.body.pricing_id);
        let sql = 'DELETE FROM tool_pricing WHERE tool_id = ? and pricing_id = ?'
        db.query(sql, [tool_id, pricing_id], (err, response) => {
            if (err) throw err
            res.json({ message: 'Delete success!' })
        })
    }
}