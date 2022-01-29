'use strict'

const util = require('util')
const mysql = require('mysql')
const db = require('./../db')
// const session = require('express-session');

module.exports = {
    get_template: (req, res) => {
        let sql = 'CALL `get_all_menu_template`();'
        db.query(sql, (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    get_by_user: (req, res) => {
        let sql = 'CALL `get_all_menu_by_user`(?);'
        db.query(sql, [req.params.id], (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    add_menu: (req, res) => {
        // var data = JSON.stringify(req.body)
        let sql = 'delete from user_menu where `user_menu`.`user_id` = ?'
        db.query(sql, [req.params.user_id], (err, response) => {
            if (err) throw err
            // res.json({ message: 'Insert success!' })
        })
        sql = 'INSERT INTO `user_menu`(`menu_id`,`stt`,`user_id`) VALUES ?;'
        db.query(sql, [req.body], (err, response) => {
            if (err) throw err
            res.json({ message: 'Insert success!' })
        })
    },
    get_all_config: (req, res) => {
        let sql = 'select * from web_config order by `order`'
        db.query(sql, (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    update_config: (req, res) => {
        let sql = 'update `web_config` set ? where id = ?'
        db.query(sql, [req.body, req.params.id], (err, response) => {
            if (err) throw err
            res.json({ message: 'Success!' })
        })
    }
}