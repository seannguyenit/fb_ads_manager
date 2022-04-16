'use strict'
const util = require('util')
const mysql = require('mysql')
const nodeMailer = require('nodemailer')
const db = require('./../db')
const path = require('path')

module.exports = {
    get: (req, res) => {
        let sql = 'CALL `user_getall`(0)'
        db.query(sql, (err, response) => {
            if (err) throw err
            res.json(response)
        })
        // let sql = 'CALL `user_getbyname`(?)';
        
    },
    get2: (req, res) => {
        let sql = 'CALL `user_getalllimit`(?,?)'
        db.query(sql,[req.params.cr_page,req.params.user_number_page] ,(err, response) => {
            if (err) throw err
            res.json(response)
        })
        // let sql = 'CALL `user_getbyname`(?)';
        
    },
    detail: (req, res) => {
        let sql = 'CALL `user_getdetail`(?)'
        db.query(sql, [req.params.id], (err, response) => {
            if (err) throw err
            var dt = response[0][0];
            res.json(dt);
        })
    },
    get_byname: (req, res) => {
        let username = '%'+req.params.username+'%';
        let sql = 'CALL `user_getbyname`(?)'
        db.query(sql, [username], (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    update: (req, res) => {
        let data = req.body;
        let userId = req.params.id;
        let sql = 'UPDATE user SET ? WHERE id = ?;'
        db.query(sql, [data, userId], (err, response) => {
            if (err) throw err
            let sql1 = 'call user_getdetail(?);'
            db.query(sql1, [req.params.id], (err, response) => {
                if (err) throw err
                var dt = response[0][0];
                res.json(dt)
            })
        })
    },
    store: (req, res) => {
        let data = req.body;
        let sql = 'INSERT INTO user SET ?;'
        db.query(sql, [data], (err, response) => {
            if (err) throw err
            let sql2 = 'call user_getdetail(last_insert_id());'
            db.query(sql2, [data], (err, response) => {
                if (err) throw err
                res.json(response[0][0])
            })
        })
    },
    delete: (req, res) => {
        let sql = 'DELETE FROM user WHERE id = ?'
        db.query(sql, [req.params.id], (err, response) => {
            if (err) throw err
            res.json({ message: 'Delete success!' })
        })
    },
    delete_history: (req, res) => {
        let sql = 'DELETE FROM pricing_history WHERE user_id = ?'
        db.query(sql, [req.params.id], (err, response) => {
            if (err) throw err
            res.json({ message: 'Delete success!' })
        })
    },
    login: (req, res) => {
        let data = req.body;
        let sql = 'CALL `login`(?,?)'
        try {
            db.query(sql, [data.user, data.pass], (err, response) => {
                if (err) throw err
                let dt = response[0][0];
                if (dt) {
                    res.json({ ok: 1, data: response[0][0] });
                } else {
                    res.json({ ok: 0 });
                }
            })
        } catch (error) {
        }
    },
    logout: (req, res) => {
        let data = req.body;
        let sql = 'CALL `logout`(?,?)'
        try {
            db.query(sql, [data.user, data.token], (err, response) => {
                if (err) throw err
                res.json({ ok: 1 });
            })
        } catch (error) {
        }
    },
    register: (req, res) => {
        let data = req.body;
        let key_active = uuidv4();
        let sql = 'INSERT INTO `user` SET `username` = ?,key_active = ?,`active` = 0,pass = ?,par_id = (select tem.id from `user` as tem where tem.ref = ? limit 1);'
        let ok = 0;
        db.query(sql, [data.user, key_active, data.pass, data.ref], (err, response) => {
            if (err) throw err
            sendMail(data.user, key_active).then(() => {
                ok = 1
            }).catch((error) => {
                ok = 0
            }).finally(() => {
                res.json({ ok: ok })
            });
        })
    },
    change_pass: (req, res) => {
        let old_pass = req.body.pass;
        let new_pass = req.body.new_pass;
        let userId = req.params.id;
        let sql = 'UPDATE user SET pass = ? WHERE id = ? and pass = ?;'
        db.query(sql, [new_pass, userId, old_pass], (err, response) => {
            if (err) throw err
            if (response.affectedRows == 1) {
                res.json({ ok: 1 })
            } else {
                res.json({ error: 'Thay đổi mật khẩu không thành công !' })
            }
        })
    },
    start_request: (req, res) => {
        let data = req.body;
        let sql_current_pricing = 'call get_current_pricing_info(?)'
        db.query(sql_current_pricing, [Number(data.user_id)], (err, response) => {
            if (err) throw error
            if (response[0][0]) {
                let limit_time = Number(response[0][0].limit_time || 0);
                let limit_request = response[0][0].limit_request || 0;
                let number_today = response[0][0].number_today || 0;
                let now_ = Math.floor(new Date().getTime() / 1000);
                if (limit_time < now_) {
                    res.json({ error: 'Bạn chưa đăng ký gia hạn !' })
                }
                if (number_today >= limit_request) {
                    res.json({ error: 'Đã đạt tối đa request hôm nay !' })
                }
                let sql = 'INSERT INTO request_history SET time = ?,user_id = ?;'
                let t_ = Number(Math.floor(new Date().getTime() / 1000));
                db.query(sql, [t_, Number(data.user_id)], (err, response) => {
                    if (err) throw err
                    res.json({ time: t_ })
                })
            } else {
                res.json({ error: 'Bạn chưa đăng ký gia hạn !' })
            }
        })
    },
    end_request: (req, res) => {
        let data = req.body;
        let sql = 'update request_history SET status = ?,error = ? where user_id = ? and time = ? and status is NULL;'
        db.query(sql, [Number(data.status), data.error, Number(data.user_id), Number(req.params.time),], (err, response) => {
            if (err) throw err
            res.json({ ok: 1 })
        })
    },
    active_email: (req, res) => {
        let key_active = req.params.key_active;
        let sql = 'UPDATE `user` SET `active` = 1 WHERE key_active = ?;'
        db.query(sql, [key_active], (err, response) => {
            if (err) throw err
            if (response.affectedRows == 1) {
                res.sendFile(path.join(__dirname, '../../view/notice.html'))
            } else {
                res.json({ error: 'Kích hoạt không thành công !' })
            }
        })
    },
    get_current_finance: (req, res) => {
        let sql = 'select id,username,get_current_money(`user`.`id`) as money,get_current_bonus(`user`.`id`) as bonus from `user` where id = ? limit 1'
        db.query(sql, [Number(req.params.id)], (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    get_sd: async (req, res) => {
        let data = req.body;
        try {
            db.query(sql, [data.user, data.token], (err, response) => {
                if (err) throw err
                res.json({ ok: 1 });
            })
        } catch (error) {
        }
    },
    store_token: (req, res) => {
        let data = req.body;
        let sql = 'INSERT INTO user_token_fb SET ?;'
        db.query(sql, [data], (err, response) => {
            if (err) throw err
            res.json({ ok: 1 });
        })
    },
    del_token: (req, res) => {
        let sql = 'delete from user_token_fb where id = ?;'
        db.query(sql, [req.params.id], (err, response) => {
            if (err) throw err
            res.json({ ok: 1 });
        })
    },
    get_all_token: (req, res) => {
        let sql = 'select * from user_token_fb where user_id = ?'
        db.query(sql, [req.params.id], (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    user_check_existed: (req, res) => {
        let sql = 'select count(A.id) as existed from `user` AS A where A.username = ? and A.id != ? and A.active = 1;'
        db.query(sql, [req.params.username, Number(req.params.id)], (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    get_all_agency: (req, res) => {
        let sql = 'SELECT `user`.`id`, `user`.`username`, `user`.`is_admin`, `user`.`active`, `user`.`real_name`, `user`.`phone`, `user`.`add`, `user`.`created_at`, `user`.`created_by`, `user`.`is_public`, `user`.`par_id`, `user`.`ref`, `user`.`is_agency`, `user`.`agency_time` FROM `user` where is_agency = 1 and active = 1'
        db.query(sql, [], (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    get_agency_child: (req, res) => {
        let sql = 'SELECT `user`.`username`,(SELECT sum(money) FROM money_history where `active` = 1 and `type` =  1 and user_id = `user`.id) as total, `user`.`ref`, `user`.`is_agency`, `user`.`created_at` from `user` where `user`.par_id = ? and active = 1'
        db.query(sql, [Number(req.params.id)], (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    get_agency_count: (req, res) => {
        let sql = 'select (select count(id) from user where active = 1 and par_id = ?) as number_user,count(MH.id) as topup_time,SUM(MH.money) as topup_money from money_history AS MH where active = 1 and type = 1 and MH.user_id = ?;'
        db.query(sql, [Number(req.params.id), Number(req.params.id)], (err, response) => {
            if (err) throw err
            res.json(response[0])
        })
    },
    get_agency_info: (req, res) => {
        let sql = 'SELECT `user`.`username`, `user`.`ref`, `user`.`is_agency`, `user`.`agency_time` from `user` where `user`.id = ? and active = 1 limit 1'
        db.query(sql, [Number(req.params.id)], (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    get_all_agency_reg: (req, res) => {
        let sql = 'SELECT `user`.`id`, `user`.`username`, `user`.`is_admin`, `user`.`active`, `user`.`real_name`, `user`.`phone`, `user`.`add`, `user`.`created_at`, `user`.`created_by`, `user`.`is_public`, `user`.`par_id`, `user`.`ref`, `user`.`is_agency`, `user`.`agency_time` FROM `user` where is_agency = 0 and `user`.`agency_time` is not null and active = 1'
        db.query(sql, [], (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    agency_reg: (req, res) => {
        let sql = 'update `user` set is_agency = 0, agency_time = UNIX_TIMESTAMP() where id = ?;'
        db.query(sql, [Number(req.params.id)], (err, response) => {
            if (err) throw err
            res.json({ ok: 1 });
        })
    },
    agency_app: (req, res) => {
        let sql = 'update `user` set is_agency = 1, agency_time = UNIX_TIMESTAMP() ,ref = (LEFT(MD5(RAND()), 8)) where id = ?;'
        db.query(sql, [Number(req.params.id)], (err, response) => {
            if (err) throw err
            res.json({ ok: 1 });
        })
    },
    agency_cancel: (req, res) => {
        let sql = 'update `user` set is_agency = NULL, agency_time = UNIX_TIMESTAMP() ,ref = NULL where id = ?;'
        db.query(sql, [Number(req.params.id)], (err, response) => {
            if (err) throw err
            res.json({ ok: 1 });
        })
    }
}

function sendMail(to, key_active) {
    // Những thông tin dưới đây các bạn có thể ném nó vào biến môi trường env nhé.
    // Vì để demo nên mình để các biến const ở đây.
    const adminEmail = 'tool264sp@gmail.com'
    const adminPassword = '#@*7LRmrfNZcn*@)'
    // Mình sử dụng host của google - gmail
    const mailHost = 'smtp.gmail.com'
    // 587 là một cổng tiêu chuẩn và phổ biến trong giao thức SMTP
    const mailPort = 587
    // Khởi tạo một thằng transporter object sử dụng chuẩn giao thức truyền tải SMTP với các thông tin cấu hình ở trên.
    const transporter = nodeMailer.createTransport({
        host: mailHost,
        port: mailPort,
        secure: false, // nếu các bạn dùng port 465 (smtps) thì để true, còn lại hãy để false cho tất cả các port khác
        auth: {
            user: adminEmail,
            pass: adminPassword
        }
    })

    const options = {
        from: adminEmail, // địa chỉ admin email bạn dùng để gửi
        to: to, // địa chỉ gửi đến
        subject: 'Đăng ký thành công tool264.com', // Tiêu đề của mail
        html: `<h3>Chao mừng bạn đã đăng ký tool264.com</h3><div>Bấm vào link để kích hoạt tài khoản: </div><a target="_blank" href="https://tool264.com/account/activate/${key_active}">Kích hoạt</a>` // Phần nội dung mail mình sẽ dùng html thay vì thuần văn bản thông thường.
    }

    // hàm transporter.sendMail() này sẽ trả về cho chúng ta một Promise
    return transporter.sendMail(options)
}

function uuidv4() {
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if (d > 0) {//Use timestamp until depleted
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}
