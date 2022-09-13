'use strict'

const util = require('util')
const mysql = require('mysql')
const db = require('./../db')
const rq_sv = require('./request_controller');
const { get, post } = require('./request_controller');

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
                    data.active = 0;
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
            data.money_bonus = (data.money / 100) * 10;
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
        get_current_finance(req.body.user_id, (vl) => {
            let money_bonus = vl[0].bonus;
            if (Number(req.body.withdraw) > Number(money_bonus)) {
                res.json({ mess: "số dư trong tài khoảng không đủ" })
            }
            else {

                vl.forEach(f => {
                    if (req.body.transactionID === f.transactionID) {
                        return;
                    }
                })
                let data = req.body;
                var active = 1;
                // nếu là yêu cầu rút tiền thì số tiên nạp sẽ là 0
                if (req.body.withdraw) {
                    data.money = 0;
                    active = 0;
                }
                // data.money = Number(req.body.money) - Number(total_money_today);
                data.type = 1;
                data.procedure = 1;
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

                // if(Number(agency) === 1){
                data.money_bonus = (data.money / 100) * 10;
                // }else{
                // data.money_bonus = 0;
                // }
                let sql = 'insert into money_history SET ?;'
                db.query(sql, data, (err, response) => {
                    if (err) throw err
                    res.json({ ok: 1 })
                })

            }
        });

    },
    add_money_momo: (req, res) => {
        get_current_finance(req.body.user_id, (vl) => {
            let agency = vl[0].is_agency
            let data = req.body;
            var active = 1;
            data.type = 1;
            data.procedure = 2;

            data.active = active;
            // if(Number(agency) === 1){
            data.money_bonus = (data.money / 100) * 10;
            // }else{
            //     data.money_bonus = 0;
            // }
            let sql = 'insert into money_history SET ?;'
            db.query(sql, data, (err, response) => {
                if (err) throw err
                res.json({ ok: 1 })
            })

            // }
        });

    },
    add_money_acbbank: (req, res) => {
        get_current_finance(req.body.user_id, (vl) => {
            let agency = vl[0].is_agency
            let data = req.body;
            var active = 1;
            data.type = 1;
            data.procedure = 3;

            data.active = active;
            // if(Number(agency) === 1){
            data.money_bonus = (data.money / 100) * 10;
            // }else{
            //     data.money_bonus = 0;
            // }

            let sql = 'insert into money_history SET ?;'
            db.query(sql, data, (err, response) => {
                if (err) throw err
                res.json({ ok: 1 })
            })
            // }
        })
    },
    get_list_money_history_limit: (req, res) => {
        let sql = 'select * from money_history where user_id = ? and `type` = 1 and method = 2 order by `time` DESC limit 1 ;'
        db.query(sql, Number(req.params.user_id), (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    get_list_top_up: (req, res) => {
        let sql = 'select MH.*,U.username from money_history as MH left join user as U on MH.user_id = U.id where MH.user_id = ? and `type` = 1 and money >= 0 and task_id IS NULL and (method = 1 or method = 0) order by `id` DESC limit 10;'
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
    get_transid: (req, res) => {
        let sql = 'select transactionID from money_history where (transactionID is not null and length(transactionID) > 1);'
        db.query(sql, (err, response) => {
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
    search_his_card: (req, res) => {
        let username = '%' + req.params.username + '%';
        let sql = 'SELECT MH.*,CH.Pin,CH.Seri,CH.Success,U.username FROM `money_history` as MH left JOIN `user` as U on MH.user_id = U.id LEFT JOIN `card_history` as CH on MH.task_id = CH.TaskId WHERE `task_id` IS NOT NULL and CH.Success = 1 and U.username like ?;'
        // , get_all_bonus() AS all_bonus, get_all_month_money() AS all_month_money, get_all_withdraw_money() AS all_withdraw_money
        db.query(sql, username, (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },

    his_card: (req, res) => {
        let sql = 'SELECT MH.*,CH.Pin,CH.Seri,CH.Success,U.username FROM `money_history` as MH left JOIN `user` as U on MH.user_id = U.id LEFT JOIN `card_history` as CH on MH.task_id = CH.TaskId WHERE `task_id` IS NOT NULL and CH.Success = 1 ORDER BY time DESC ;'
        // , get_all_bonus() AS all_bonus, get_all_month_money() AS all_month_money, get_all_withdraw_money() AS all_withdraw_money
        db.query(sql, (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    search_his_banking: (req, res) => {
        let username = '%' + req.params.username + '%';
        let sql = 'SELECT MH.*,U.username FROM `money_history` as MH left JOIN `user` as U on MH.user_id = U.id WHERE `procedure` != 0 and U.username like ?;'
        // , get_all_bonus() AS all_bonus, get_all_month_money() AS all_month_money, get_all_withdraw_money() AS all_withdraw_money
        db.query(sql, username, (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },

    his_banking: (req, res) => {
        let sql = 'SELECT MH.*,U.username FROM `money_history` as MH left JOIN `user` as U on MH.user_id = U.id WHERE `procedure` != 0 ORDER BY time DESC;'
        // , get_all_bonus() AS all_bonus, get_all_month_money() AS all_month_money, get_all_withdraw_money() AS all_withdraw_money
        db.query(sql, (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    successfully_topup: (req, res) => {
        let money_history = req.body;
        console.log('Receive receipt : ', money_history);
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

    },
    cron_money: (req, res) => {
        insert_acb_bank();
    }
}

async function insert_acb_bank() {
    let sql_admin_bank = 'SELECT * FROM admin_bank;'
    db.query(sql_admin_bank, (err, response) => {
        var infor_acbbank = response;
        var action_acb = "";
        var token_bank = "";
        var account = "";
        var password = "";
        var finfo = infor_acbbank.find(f => ((Number(f.action) === 1) && (Number(f.type) === 2)));
        if (finfo) {
            token_bank = finfo.token;
            account = finfo.account;
            password = finfo.password;
            action_acb = finfo.action;
        }
        if (Number(action_acb) === 0) {
            return;
        }

        get(`https://api.web2m.com/historyapimbv3/${password}/${account}/${token_bank}`).then(rs_acb_bank => {
            let sql = 'SELECT * FROM `user` WHERE `active` = 1';
            db.query(sql, (err, response) => {
                run_by_all_user(response)
            })

        });

    })


    // }

}

async function ticket_save_acb(money, method, des, user_id, time, transactionID) {
    get_current_finance(req.body.user_id, (vl) => {
        let agency = vl[0].is_agency
        let data = req.body;
        var active = 1;
        data.type = 1;
        data.procedure = 3;

        data.active = active;
        // if(Number(agency) === 1){
        data.money_bonus = (data.money / 100) * 10;
        // }else{
        //     data.money_bonus = 0;
        // }

        let sql = 'insert into money_history SET ?;'
        db.query(sql, data, (err, response) => {
            console.log('insert money to db !', new Date());
        })
        // }
    })
}

async function run_by_all_user(users) {
    for (let index = 0; index < users.length; index++) {
        const cr_u = users[index];
        var d = new Date();
        let y = d.getFullYear();
        let m = (d.getMonth() + 1) < 10 ? `0${d.getMonth() + 1}` : (d.getMonth() + 1);
        let dd = (d.getDate()) < 10 ? `0${d.getDate()}` : (d.getDate());
        var today = `${y}-${m}-${dd}`;
        var today_ = "";
        var method = 1;
        let sql_trasn = 'select transactionID from money_history where (transactionID is not null and length(transactionID) > 1);'
        db.query(sql_trasn, (err, response) => {
            var list_topup_ = response;
            if (rs_acb_bank) {
                if (rs_acb_bank.status) {
                    var stt_rs = 0;
                    for (let index_acb = 0; index_acb < rs_acb_bank.transactions.length; index_acb++) {
                        const f = rs_acb_bank.transactions[index_acb];
                        if (f.transactionID && f.transactionID.length > 0 && f.type === "IN" && !list_topup_.includes(f.transactionID) && check_user_id_in_des(f.description, cr_u.id)) {
                            let dd_ = f.transactionDate.substring(0, 2);
                            let m_ = f.transactionDate.substring(3, 5);
                            let y_ = f.transactionDate.substring(6, 10);
                            today_ = `${y_}-${m_}-${dd_}`;
                            ticket_save_acb(f.amount, method, cr_u.id, cr_u.id, Number(new Date().getTime() / 1000), f.transactionID);
                        }
                    }
                }
            }
        })
    }
}

function check_user_id_in_des(description, user_id) {
    try {
        var des = description.toLowerCase()
        var number = des.indexOf('napthe');
        var d = des.substring(Number(number) + 6, Number(number) + 10);
        return d === id_user;
    } catch (error) {
        console.log(error);
    }
    return false;
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

function get_current_finance_topup_bank(time, id, callback) {
    let sql = 'select *,get_topup_money_mbbank_today(`money_history`.`user_id`,?) as get_topup_money_mbbank_today,get_topup_money_momo_today(`money_history`.`user_id`,?) as get_topup_money_momo_today,get_topup_money_abcbank_today(`money_history`.`user_id`,?) as get_topup_money_abcbank_today,get_current_money(`money_history`.`user_id`) as money,get_current_bonus(`money_history`.`user_id`) as bonus from `money_history` where `user_id` = ? and `procedure` != 0 and time = ?;'
    db.query(sql, [time, time, time, Number(id), time], (err, response) => {
        if (err) throw err
        callback(response)
    })
}
// function get_current_finance_tranid_bank(time, id, callback) {
//     let sql = 'select id,username,get_topup_money_mbbank_today(`user`.`id`,?) as get_topup_money_mbbank_today,get_topup_money_momo_today(`user`.`id`,?) as get_topup_money_momo_today,get_topup_money_abcbank_today(`user`.`id`,?) as get_topup_money_abcbank_today,get_current_money(`user`.`id`) as money,get_current_bonus(`user`.`id`) as bonus from `user` where id = ? limit 1'
//     db.query(sql, [time,time,time, Number(id)], (err, response) => {
//         if (err) throw err
//         callback(response)
//     })
// }
function get_current_finance(id, callback) {
    let sql = 'select *,get_current_money(`user`.`id`) as money,get_current_bonus(`user`.`id`) as bonus from `user` where id = ? limit 1'
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
