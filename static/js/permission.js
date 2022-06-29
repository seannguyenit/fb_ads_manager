'use strict'
init_menu();
// insert_bank();
menu_contacst();
// init_bank_topup();
function init_bank_topup() {
    insert_momo_bank();
    insert_mb_bank();
    insert_acb_bank();
}
// history_login()
/* menu */
async function menu_get_template() {
    return await fetch(`/api/menu` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}

async function menu_get_current_menu(id) {
    return await fetch(`/api/menu/${id}` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data[0];
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}

// Get infor admin contacts
async function get_admin_contacts() {
    return await fetch('/api/admin_contacts' /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}

async function menu_contacst() {
    var menu_contacts = document.getElementById('menu_contacts');
    var data = await get_admin_contacts();
    if (menu_contacts) {
        if (data) {
            data.forEach(f => {
                menu_contacts.innerHTML = `
            <a style="background-color: #2a2e3f;" class="nav-link dropdown-item active title-nav" href="${f.facebook}" target="blank"><i class="pd_r_5 fa fa-facebook-square" aria-hidden="true"></i>Facebook</a>
            <a style="background-color: #2a2e3f;" class="nav-link dropdown-item active title-nav" href="${f.zalo}" target="blank"><i class="pd_r_5 fa fa-whatsapp" aria-hidden="true"></i>Zalo</a>
            `;
            })
        }
    }
}

async function init_menu() {
    var menu = document.getElementById('main_menu');
    // var menu = document.getElementById('main_menu');
    var menu_ = document.getElementById('menu_money');
    var menu_general = document.getElementById('menu_');
    var cr_url = location.href;
    if (menu) {
        menu.innerHTML = '';
        var cr_user = get_cr_user();
        var lst_menu = await menu_get_current_menu(cr_user.id);
        if (!cr_url.includes('user_info') && lst_menu.filter(f => { return cr_url.includes(f.action) }).length == 0) {
            location.href = '/login'
        }
        if (menu) {
            //     lst_menu.forEach(item => {
            //         if (item.type === 0) {
            //             menu.innerHTML += `<a class="nav-link active title-nav${cr_url.includes(item.action) ? " selected" : ""}" aria-current="page" href="/home/${item.action}" data-lang="${item.name}">${item.name}</a>`;
            //         }
            //     });
            // } else {
            lst_menu.forEach(item => {
                if (item.type === 0) {
                    menu.innerHTML += `<a class="nav-link active title-nav${cr_url.includes(item.action) ? " selected" : ""}" aria-current="page" href="/home/${item.action}" data-lang="${item.name}">${item.name}</a>`;
                }

                if (item.type === 1 && menu_) {
                    menu_.innerHTML += `
                        <a style="background-color: #2a2e3f;" class="nav-link dropdown-item active title-nav${cr_url.includes(item.action) ? " selected" : ""}" aria-current="page" href="/home/${item.action}" data-lang="${item.name}">${item.name}</a>
                    `;
                    //     // <a class="dropdown-item" href="#">Action</a>
                }
                if (item.type === 2 && menu_general) {
                    menu_general.innerHTML += `
                        <a style="background-color: #2a2e3f;" class="nav-link dropdown-item active title-nav${cr_url.includes(item.action) ? " selected" : ""}" aria-current="page" href="/home/${item.action}" data-lang="${item.name}">${item.name}</a>
                    `;
                    //     // <a class="dropdown-item" href="#">Action</a>
                }
                // menu.innerHTML += `<a class="nav-link active title-nav${cr_url.includes(item.action) ? " selected" : ""}" aria-current="page" href="/home/${item.action}">${item.name}</a>`;
            }
            );
        }

    }
}


async function add_menu_user(data, user_id) {
    return await fetch(`/api/menu_user/${user_id}`, {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {
            return result;
        })
        .catch(error => {
            console.log('Error:', error);
        });
}


// async function history_login(){
//     var cr_user = get_cr_user();
//     return await fetch(`/api/history_login/${cr_user.id}` /*, options */)
//         .then((response) => response.json())
//         .then((data) => {
//             return data;
//         })
//         .catch((error) => {
//             console.warn(error);
//             return undefined;
//         });
// }
// Get infor admin API MBbank
async function get_admin_mbbank() {
    return await fetch('/api/admin_mbbank' /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}

// get_api_mb_bank();
async function get_api_mb_bank(token, account, password) {
    const url = `https://api.web2m.com/historyapimbv3/${password}/${account}/${token}`;
    return await fetch(
        '/api/fproxy',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url })
        }
    )
        .then((response) => response.json())
        .then((data) => {
            return data.data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}

// get_api_abc_bank();
async function get_api_acb_bank(token, account, password) {
    const url = `https://api.web2m.com/historyapiacbv3/${password}/${account}/${token}`;
    return await fetch(
        '/api/fproxy',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url })
        }
    )
        .then((response) => response.json())
        .then((data) => {
            return data.data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}

// get_api_momo_bank();
async function get_api_momo_bank(token) {
    const url = `https://api.web2m.com/historyapimomo/${token}`;
    return await fetch(
        '/api/fproxy',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url })
        }
    )
        .then((response) => response.json())
        .then((data) => {
            return data.data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}

async function insert_mb_bank() {
    var infor_mbbank = await get_admin_mbbank();
    if (infor_mbbank) {
        var token = "";
        var account = "";
        var password = "";
        infor_mbbank.forEach(f => {
            token = f.token;
            account = f.account;
            password = f.password;
        })
        var rs = await get_api_mb_bank(token, account, password);
        var cr_u = get_cr_user();
        var id_user = get_number_by_id(cr_u.id)
        var total = 0;
        var d = new Date();
        let y = d.getFullYear();
        let m = (d.getMonth() + 1) < 10 ? `0${d.getMonth() + 1}` : (d.getMonth() + 1);
        let dd = d.getDate();
        var today = `${y}-${m}-${dd}`;
        var today_ = "";
        // var data = await get_api_mb_bank();
        var method = 1;
        var user_id = get_cr_user().id;
        var is_admin = get_cr_user().is_admin
        if (is_admin === 1) {
            return;
        }
        if (rs) {
            if (rs.status) {
                rs.transactions.forEach(f => {
                    if (f.type === "IN") {
                        if (f.description === id_user) {
                            let dd_ = f.transactionDate.substring(0, 2);
                            let m_ = f.transactionDate.substring(3, 5);
                            let y_ = f.transactionDate.substring(6, 10);
                            today_ = `${y_}-${m_}-${dd_}`;
                            if (Number(new Date(today_).getTime() / 1000) === Number(new Date(today).getTime() / 1000)) {
                                total = Number(total) + Number(f.amount)
                            }
                        }
                    }
                })
            }
            var rs = await ticket_save_({ money: total, method: method, des: id_user, user_id: user_id, time: Number(new Date(today_).getTime() / 1000) });
            if (rs.ok) {
                $('#money_ticket').modal('show');
            }
        } else {
            alert("Lôi nạp qua MBbank liên hệ admin để sử lý");
            return;

        }

    }

}

async function insert_acb_bank() {
    var infor_mbbank = await get_admin_mbbank();
    if (infor_mbbank) {
        var token = "";
        var account = "";
        var password = "";
        infor_mbbank.forEach(f => {
            token = f.token;
            account = f.account;
            password = f.password;
        })
        var rs = await get_api_acb_bank(token, account, password);
        var cr_u = get_cr_user();
        var id_user = get_number_by_id(cr_u.id)
        var total = 0;
        var d = new Date();
        let y = d.getFullYear();
        let m = (d.getMonth() + 1) < 10 ? `0${d.getMonth() + 1}` : (d.getMonth() + 1);
        let dd = d.getDate();
        var today = `${y}-${m}-${dd}`;
        var today_ = "";
        // var data = await get_api_mb_bank();
        var method = 1;
        var user_id = get_cr_user().id;
        var is_admin = get_cr_user().is_admin
        if (is_admin === 1) {
            return;
        }
        if (rs) {
            if (rs.status) {
                rs.transactions.forEach(f => {
                    if (f.type === "IN") {
                        if (f.description === id_user) {
                            let dd_ = f.transactionDate.substring(0, 2);
                            let m_ = f.transactionDate.substring(3, 5);
                            let y_ = f.transactionDate.substring(6, 10);
                            today_ = `${y_}-${m_}-${dd_}`;
                            if (Number(new Date(today_).getTime() / 1000) === Number(new Date(today).getTime() / 1000)) {
                                total = Number(total) + Number(f.amount)
                            }
                        }
                    }
                })
            }
            var rs = await ticket_save_({ money: total, method: method, des: id_user, user_id: user_id, time: Number(new Date(today_).getTime() / 1000) });
            if (rs.ok) {
                $('#money_ticket').modal('show');
            }
        } else {
            alert("Lôi nạp qua ACBbank liên hệ admin để sử lý");
            return;

        }

    }

}



async function insert_momo_bank() {
    var infor_mbbank = await get_admin_mbbank();
    if (infor_mbbank) {
        var token = "";
        var account = "";
        var password = "";
        infor_mbbank.forEach(f => {
            token = f.token;
            account = f.account;
            password = f.password;
        })
        var rs = await get_api_momo_bank(token);
        var cr_u = get_cr_user();
        var id_user = get_number_by_id(cr_u.id)
        var total = 0;
        var d = new Date();
        let y = d.getFullYear();
        let m = (d.getMonth() + 1) < 10 ? `0${d.getMonth() + 1}` : (d.getMonth() + 1);
        let dd = d.getDate();
        var star_today = `${y}-${m}-${dd} 00:00:00`;
        var end_today = `${y}-${m}-${dd} 23:59:59`;
        var today = `${y}-${m}-${dd}`;
        // var data = await get_api_mb_bank();
        var method = 1;
        var user_id = get_cr_user().id;
        var is_admin = get_cr_user().is_admin
        if (is_admin === 1) {
            return;            //     var b =Number(new Date('2021-11-16 00:00:00').getTime() / 1000);
        }
        if (rs) {
            if (rs.momoMsg) {
                rs.momoMsg.tranList.forEach(f => {
                    if (Number(f.io) === 1) {
                        if (f.desc === id_user) {;
                          var today_ = f.finishTime;
                            if (Number(new Date(star_today).getTime() / 1000) < Number(new Date(today_).getTime() / 1000) < Number(new Date(end_today).getTime() / 1000)) {
                                total = Number(total) + Number(f.amount)
                                // aler(total)
                            }
                        }
                    }
                })
            }
            var rs = await ticket_save_momo({ money: total, method: method, des: id_user, user_id: user_id, time: Number(new Date(today).getTime() / 1000) });
            if (rs.ok) {
                $('#bank_money_ticket').modal('show');
            }
        } else {
            alert("Lôi nạp qua MOMO liên hệ admin để sử lý");
            return;

        }


    }

}

async function ticket_save_momo(data) {
    return await fetch('/api/money_momo_ticket', {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            if (data != undefined) {
                return data || {};
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

async function ticket_save_(data) {
    return await fetch('/api/money_ticket', {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            if (data != undefined) {
                return data || {};
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

async function ticket_save_acb(data) {
    return await fetch('/api/money_acb_ticket', {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            if (data != undefined) {
                return data || {};
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}




// const test = {
//     "momoMsg": {
//         "begin": 1637065331000,
//         "end": 1637324531306,
//         "tranList": [
//             {
//                 "ID": "dc4cdde2-a68d-47b2-8812-4323f3f22af8",
//                 "user": "0902506099",
//                 "commandInd": "1637068479813000000_e9a5576f",
//                 "tranId": 18505079635,
//                 "clientTime": 1637068479958,
//                 "ackTime": 1637068482017,
//                 "finishTime": 1656383207562,
//                 "tranType": 2018,
//                 "io": -1,
//                 "partnerId": "01208077478",
//                 "partnerCode": "momo",
//                 "partnerName": "NGUYỄN TRỌNG VỸ",
//                 "amount": 100,
//                 "comment": "CRON2",
//                 "status": 999,
//                 "ownerNumber": "0902506099",
//                 "ownerName": "NGUYỄN TRỌNG VỸ",
//                 "moneySource": 1,
//                 "desc": "0002",
//                 "serviceMode": "transfer_p2p",
//                 "originalAmount": 100,
//                 "serviceId": "transfer_p2p",
//                 "quantity": 1,
//                 "lastUpdate": 1637068482017,
//                 "share": "0.0",
//                 "receiverType": 1,
//                 "extras": "{\"loanId\":0,\"appSendChat\":false,\"loanIds\":[],\"stickers\":\"\",\"themeUrl\":\"https://cdn.mservice.com.vn/app/img/transfer/theme/Corona_750x260.png\",\"vpc_CardType\":\"SML\",\"vpc_TicketNo\":\"1.53.7.50\",\"vpc_PaymentGateway\":\"\",\"origMSource\":1,\"lixi_total\":0.0,\"lixi_count\":1,\"lixi_parent_id\":\"3c1e064a-eabd-448f-82fd-f7a50a3fe86e\",\"lixi_isFixed\":true,\"app_version\":30270,\"request_id_backend\":\"1637068481829_0902506099\",\"business_trans_id\":\"1637068481829_0902506099\",\"ispayment\":2,\"money_source\":1,\"ORIGINAL_PARTNER_ID\":\"0708077478\",\"FEE_BANK\":0.0,\"FEE_MOMO\":0.0}",
//                 "channel": "END_USER",
//                 "otpType": "NA",
//                 "ipAddress": "21.192.45.78",
//                 "enableOptions": {
//                     "voucher": true,
//                     "discount": true,
//                     "prepaid": true,
//                     "desc": ""
//                 },
//                 "_class": "mservice.backend.entity.msg.TranHisMsg"
//             },
           
//             {
//                 "ID": "a19c0e84-f08c-49f3-9417-a1c25b5e8dc1",
//                 "user": "0902506099",
//                 "commandInd": "1637070959481000000_5c3de2f4",
//                 "tranId": 18505998875,
//                 "clientTime": 1637070959545,
//                 "ackTime": 1637070960148,
//                 "finishTime": 1656383207562,
//                 "tranType": 2018,
//                 "io": 1,
//                 "partnerId": "01208077478",
//                 "partnerCode": "momo",
//                 "partnerName": "NGUYỄN TRỌNG VỸ",
//                 "amount": 110000,
//                 "comment": "web2m",
//                 "status": 999,
//                 "moneySource": 1,
//                 "desc": "0002",
//                 "originalAmount": 100,
//                 "serviceId": "transfer_p2p",
//                 "lastUpdate": 1637070960148,
//                 "receiverType": 1,
//                 "extras": "{\"vpc_CardType\":\"SML\",\"vpc_TicketNo\":\"115.79.139.158\",\"receiverMembers\":[{\"receiverNumber\":\"0902506099\",\"receiverName\":\"NGUYỄN TRỌNG VỸ\",\"originalAmount\":100.0}],\"loanId\":0,\"contact\":[],\"origMSource\":1,\"lixi_total\":0.0,\"lixi_count\":1,\"lixi_parent_id\":\"1e22be25-402b-4e45-b402-5c570155c2a9\",\"lixi_isFixed\":true,\"app_version\":30261,\"request_id_backend\":\"1637070959842_01208077478\",\"business_trans_id\":\"1637070959842_01208077478\",\"ispayment\":2,\"money_source\":1,\"ORIGINAL_PARTNER_ID\":\"0902506099\",\"FEE_BANK\":0.0,\"FEE_MOMO\":0.0}",
//                 "channel": "END_USER",
//                 "otpType": "NA",
//                 "ipAddress": "N/A",
//                 "enableOptions": {
//                     "voucher": true,
//                     "discount": true,
//                     "prepaid": true,
//                     "desc": ""
//                 },
//                 "_class": "mservice.backend.entity.msg.TranHisMsg"
//             },
//             {
//                 "ID": "a19c0e84-f08c-49f3-9417-a1c25b5e8dc1",
//                 "user": "0902506099",
//                 "commandInd": "1637070959481000000_5c3de2f4",
//                 "tranId": 18505998875,
//                 "clientTime": 1637070959545,
//                 "ackTime": 1637070960148,
//                 "finishTime": 1656383207562,
//                 "tranType": 2018,
//                 "io": 1,
//                 "partnerId": "01208077478",
//                 "partnerCode": "momo",
//                 "partnerName": "NGUYỄN TRỌNG VỸ",
//                 "amount": 100000,
//                 "comment": "web2m",
//                 "status": 999,
//                 "moneySource": 1,
//                 "desc": "0002",
//                 "originalAmount": 100,
//                 "serviceId": "transfer_p2p",
//                 "lastUpdate": 1637070960148,
//                 "receiverType": 1,
//                 "extras": "{\"vpc_CardType\":\"SML\",\"vpc_TicketNo\":\"115.79.139.158\",\"receiverMembers\":[{\"receiverNumber\":\"0902506099\",\"receiverName\":\"NGUYỄN TRỌNG VỸ\",\"originalAmount\":100.0}],\"loanId\":0,\"contact\":[],\"origMSource\":1,\"lixi_total\":0.0,\"lixi_count\":1,\"lixi_parent_id\":\"1e22be25-402b-4e45-b402-5c570155c2a9\",\"lixi_isFixed\":true,\"app_version\":30261,\"request_id_backend\":\"1637070959842_01208077478\",\"business_trans_id\":\"1637070959842_01208077478\",\"ispayment\":2,\"money_source\":1,\"ORIGINAL_PARTNER_ID\":\"0902506099\",\"FEE_BANK\":0.0,\"FEE_MOMO\":0.0}",
//                 "channel": "END_USER",
//                 "otpType": "NA",
//                 "ipAddress": "N/A",
//                 "enableOptions": {
//                     "voucher": true,
//                     "discount": true,
//                     "prepaid": true,
//                     "desc": ""
//                 },
//                 "_class": "mservice.backend.entity.msg.TranHisMsg"
//             },
//             {
//                 "ID": "a19c0e84-f08c-49f3-9417-a1c25b5e8dc1",
//                 "user": "0902506099",
//                 "commandInd": "1637070959481000000_5c3de2f4",
//                 "tranId": 18505998875,
//                 "clientTime": 1637070959545,
//                 "ackTime": 1637070960148,
//                 "finishTime": 1656383207562,
//                 "tranType": 2018,
//                 "io": 1,
//                 "partnerId": "01208077478",
//                 "partnerCode": "momo",
//                 "partnerName": "NGUYỄN TRỌNG VỸ",
//                 "amount": 100000,
//                 "comment": "web2m",
//                 "status": 999,
//                 "moneySource": 1,
//                 "desc": "0002",
//                 "originalAmount": 100,
//                 "serviceId": "transfer_p2p",
//                 "lastUpdate": 1637070960148,
//                 "receiverType": 1,
//                 "extras": "{\"vpc_CardType\":\"SML\",\"vpc_TicketNo\":\"115.79.139.158\",\"receiverMembers\":[{\"receiverNumber\":\"0902506099\",\"receiverName\":\"NGUYỄN TRỌNG VỸ\",\"originalAmount\":100.0}],\"loanId\":0,\"contact\":[],\"origMSource\":1,\"lixi_total\":0.0,\"lixi_count\":1,\"lixi_parent_id\":\"1e22be25-402b-4e45-b402-5c570155c2a9\",\"lixi_isFixed\":true,\"app_version\":30261,\"request_id_backend\":\"1637070959842_01208077478\",\"business_trans_id\":\"1637070959842_01208077478\",\"ispayment\":2,\"money_source\":1,\"ORIGINAL_PARTNER_ID\":\"0902506099\",\"FEE_BANK\":0.0,\"FEE_MOMO\":0.0}",
//                 "channel": "END_USER",
//                 "otpType": "NA",
//                 "ipAddress": "N/A",
//                 "enableOptions": {
//                     "voucher": true,
//                     "discount": true,
//                     "prepaid": true,
//                     "desc": ""
//                 },
//                 "_class": "mservice.backend.entity.msg.TranHisMsg"
//             },
//             {
//                 "ID": "a19c0e84-f08c-49f3-9417-a1c25b5e8dc1",
//                 "user": "0902506099",
//                 "commandInd": "1637070959481000000_5c3de2f4",
//                 "tranId": 18505998875,
//                 "clientTime": 1637070959545,
//                 "ackTime": 1637070960148,
//                 "finishTime": 1656383207562,
//                 "tranType": 2018,
//                 "io": 1,
//                 "partnerId": "01208077478",
//                 "partnerCode": "momo",
//                 "partnerName": "NGUYỄN TRỌNG VỸ",
//                 "amount": 100000,
//                 "comment": "web2m",
//                 "status": 999,
//                 "moneySource": 1,
//                 "desc": "0002",
//                 "originalAmount": 100,
//                 "serviceId": "transfer_p2p",
//                 "lastUpdate": 1637070960148,
//                 "receiverType": 1,
//                 "extras": "{\"vpc_CardType\":\"SML\",\"vpc_TicketNo\":\"115.79.139.158\",\"receiverMembers\":[{\"receiverNumber\":\"0902506099\",\"receiverName\":\"NGUYỄN TRỌNG VỸ\",\"originalAmount\":100.0}],\"loanId\":0,\"contact\":[],\"origMSource\":1,\"lixi_total\":0.0,\"lixi_count\":1,\"lixi_parent_id\":\"1e22be25-402b-4e45-b402-5c570155c2a9\",\"lixi_isFixed\":true,\"app_version\":30261,\"request_id_backend\":\"1637070959842_01208077478\",\"business_trans_id\":\"1637070959842_01208077478\",\"ispayment\":2,\"money_source\":1,\"ORIGINAL_PARTNER_ID\":\"0902506099\",\"FEE_BANK\":0.0,\"FEE_MOMO\":0.0}",
//                 "channel": "END_USER",
//                 "otpType": "NA",
//                 "ipAddress": "N/A",
//                 "enableOptions": {
//                     "voucher": true,
//                     "discount": true,
//                     "prepaid": true,
//                     "desc": ""
//                 },
//                 "_class": "mservice.backend.entity.msg.TranHisMsg"
//             },
//             {
//                 "ID": "a19c0e84-f08c-49f3-9417-a1c25b5e8dc1",
//                 "user": "0902506099",
//                 "commandInd": "1637070959481000000_5c3de2f4",
//                 "tranId": 18505998875,
//                 "clientTime": 1637070959545,
//                 "ackTime": 1637070960148,
//                 "finishTime": 1656383207562,
//                 "tranType": 2018,
//                 "io": 1,
//                 "partnerId": "01208077478",
//                 "partnerCode": "momo",
//                 "partnerName": "NGUYỄN TRỌNG VỸ",
//                 "amount": 100000,
//                 "comment": "web2m",
//                 "status": 999,
//                 "moneySource": 1,
//                 "desc": "0002",
//                 "originalAmount": 100,
//                 "serviceId": "transfer_p2p",
//                 "lastUpdate": 1637070960148,
//                 "receiverType": 1,
//                 "extras": "{\"vpc_CardType\":\"SML\",\"vpc_TicketNo\":\"115.79.139.158\",\"receiverMembers\":[{\"receiverNumber\":\"0902506099\",\"receiverName\":\"NGUYỄN TRỌNG VỸ\",\"originalAmount\":100.0}],\"loanId\":0,\"contact\":[],\"origMSource\":1,\"lixi_total\":0.0,\"lixi_count\":1,\"lixi_parent_id\":\"1e22be25-402b-4e45-b402-5c570155c2a9\",\"lixi_isFixed\":true,\"app_version\":30261,\"request_id_backend\":\"1637070959842_01208077478\",\"business_trans_id\":\"1637070959842_01208077478\",\"ispayment\":2,\"money_source\":1,\"ORIGINAL_PARTNER_ID\":\"0902506099\",\"FEE_BANK\":0.0,\"FEE_MOMO\":0.0}",
//                 "channel": "END_USER",
//                 "otpType": "NA",
//                 "ipAddress": "N/A",
//                 "enableOptions": {
//                     "voucher": true,
//                     "discount": true,
//                     "prepaid": true,
//                     "desc": ""
//                 },
//                 "_class": "mservice.backend.entity.msg.TranHisMsg"
//             },
//             {
//                 "ID": "c63095b4-357a-448b-9a83-90436297c02e",
//                 "user": "0902506099",
//                 "commandInd": "1637137203093000000_d071d061",
//                 "tranId": 18526479133,
//                 "clientTime": 1637137203238,
//                 "ackTime": 1637137205376,
//                 "finishTime": 3656383207562,
//                 "tranType": 2018,
//                 "io": 1,
//                 "partnerId": "01663476266",
//                 "partnerCode": "momo",
//                 "partnerName": "NGUYỄN VĂN DƯƠNG",
//                 "amount": 50000,
//                 "comment": "Duong +1 momo",
//                 "status": 999,
//                 "moneySource": 1,
//                 "desc": "0002",
//                 "originalAmount": 50000,
//                 "serviceId": "transfer_p2p",
//                 "lastUpdate": 1637137205376,
//                 "receiverType": 8,
//                 "extras": "{\"loanId\":0,\"appSendChat\":false,\"loanIds\":[],\"stickers\":\"\",\"themeUrl\":\"https://cdn.mservice.com.vn/app/img/transfer/theme/Corona_750x260.png\",\"vpc_CardType\":\"SML\",\"vpc_TicketNo\":\"42.112.234.56\",\"vpc_PaymentGateway\":\"\",\"origMSource\":1,\"lixi_total\":0.0,\"lixi_count\":1,\"lixi_parent_id\":\"031815c0-d6c8-49b1-be58-c5d444e6036a\",\"lixi_isFixed\":true,\"app_version\":30270,\"request_id_backend\":\"1637137205094_01663476266\",\"business_trans_id\":\"1637137205094_01663476266\",\"ispayment\":2,\"money_source\":1,\"ORIGINAL_PARTNER_ID\":\"0902506099\",\"FEE_BANK\":0.0,\"FEE_MOMO\":0.0}",
//                 "channel": "END_USER",
//                 "otpType": "NA",
//                 "ipAddress": "N/A",
//                 "enableOptions": {
//                     "voucher": true,
//                     "discount": true,
//                     "prepaid": true,
//                     "desc": ""
//                 },
//                 "_class": "mservice.backend.entity.msg.TranHisMsg"
//             }
//         ]
//     }
// }