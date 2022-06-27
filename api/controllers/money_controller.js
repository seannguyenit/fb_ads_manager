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
    agency_move_money: (req, res) => {
        get_current_finance(req.body.data_agency.user_id, (vl) => {
            let money_cr = vl[0].money;
            if (Number(req.body.data_agency.money) > Number(money_cr)) {
                res.json({ mess: "số dư trong tài khoảng không đủ" })
            }
            else {
                let data_agency = req.body.data_agency;
                let data_user = req.body.data_user;
                data_agency.time = new Date().getTime() / 1000;
                data_user.time = new Date().getTime() / 1000;
                data_agency.type = 0;
                data_user.type = 1;
                data_user.active = 1;
                data_agency.active = 1;
                let sql_agency = 'insert into money_history SET ?;'
                db.query(sql_agency, data_agency, (err, response) => {
                    if (err) throw err
                    let sql_user = 'insert into money_history SET ?;'
                    db.query(sql_user, data_user, (err, response) => {
                        if (err) throw err
                        res.json({ mess: "success" })
                    })
                })
            }
        })
    },
    add_money: (req, res) => {
        get_current_finance_topup_bank(req.body.time, req.body.user_id, (vl) => {
            let money_bonus = vl[0].bonus;
            if (Number(req.body.withdraw) > Number(money_bonus)) {
                res.json({ mess: "số dư trong tài khoảng không đủ" })
            }
            else {
                let total_money_today = vl[0].total_money_today
                // Nếu đại lý rút tiền thì số tiền mặc định nạp trong ngày sẽ luôn lớn hơn số tiền đã nạp có ở DB trong ngày
                if(req.body.withdraw){
                    req.body.money = Number(total_money_today) + 1;
                }
                if (Number(req.body.money) > Number(total_money_today)) {
                    let data = req.body;
                    var active = 1;
                    // nếu là yêu cầu rút tiền thì số tiên nạp sẽ là 0
                    if(req.body.withdraw){
                        data.money = 0;
                        active = 0;
                    }
                    data.money = Number(req.body.money) - Number(total_money_today);
                    data.type = 1;
                    // data.withdraw = 
                    if (data.time) {
                        data.time = data.time;
                    } else {
                        data.time = new Date().getTime() / 1000;
                    }
                    // data.time = new Date().getTime()
                    
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
                } else {
                    res.json({ mess: "0" })
                }

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
        let sql = 'select * from money_history where user_id = ? and `type` = 1 and money >= 0 and task_id IS NULL and (method = 1 or method = 0) order by `time` DESC limit 10 ;'
        db.query(sql, Number(req.params.user_id), (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    get_list_top_up_card: (req, res) => {
        let sql = 'select MH.*,CH.* from money_history as MH LEFT JOIN card_history as CH ON MH.task_id = CH.TaskId where user_id = ? and `type` = 1 and money >= 0 and task_id IS NOT NULL and method != 2 order by `time` DESC limit 10;'
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
        let card_history = req.data;
        let money_history = req.body;
        if (card_history != null) {
            insert_history_card(card_history, (rs) => {
                if (rs.ok = 1) {
                    money_history.type = 1;
                    money_history.time = new Date().getTime() / 1000;
                    var active = 0;
                    if (req.body.active && req.body.active == 1) {
                        active = 1;
                    }
                    money_history.active = active;
                    money_history.money = card_history.amount;
                    money_history.money_bonus = (money_history.money / 100) * 10;

                    let sql1 = 'insert into money_history SET ?;'
                    db.query(sql1, money_history, (err, response) => {
                        if (err) throw err
                        res.json({ mess: 1 })
                    })
                }
            })
        }

        // money_history.type = 1;
        // money_history.time = new Date().getTime() / 1000;
        // var active = 0;
        // if (req.body.active && req.body.active == 1) {
        //     active = 1;
        // }
        // money_history.active = active;
        // money_history.money = card_history.amount;
        // money_history.money_bonus = (money_history.money / 100) * 10;
        // let sql1 = 'insert into money_history SET ?;'
        // db.query(sql1, money_history, (err, response) => {
        //     if (err) throw err
        //     res.json({ ok: 1 })
        // })
    }
}
// async function get_current_finance_(res,req) {
//     return 
// }

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

function get_current_finance_topup_bank(time, id, callback) {
    let sql = 'select id,username,get_topup_money_today(`user`.`id`,?) as total_money_today,get_current_money(`user`.`id`) as money,get_current_bonus(`user`.`id`) as bonus from `user` where id = ? limit 1'
    db.query(sql, [time, Number(id)], (err, response) => {
        if (err) throw err
        callback(response)
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
