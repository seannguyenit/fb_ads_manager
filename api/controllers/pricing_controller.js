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
            res.json({ message: 'Delete success!' })
        })
    },
    store: (req, res) => {
        let data = req.body;
        // data.pass = data.pass;
        let sql = 'INSERT INTO pricing SET ?;'
        db.query(sql, [data], (err, response) => {
            if (err) throw err
            res.json({ message: 'Delete success!' })
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
    }
}