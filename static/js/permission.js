'use strict'

init_menu();
// insert_bank();
menu_contacst();
init_bank_topup();
function init_bank_topup() {
    insert_mb_bank();
    insert_acb_bank();
      insert_momo_bank();
    // ii();
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
async function get_admin_bank() {
    return await fetch('/api/admin_bank' /*, options */)
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
async function get_api_mb_bank(token_bank, account, password) {
    const url = `https://api.web2m.com/historyapimbv3/${password}/${account}/${token_bank}`;
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
            return data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}

// get_api_abc_bank();
async function get_api_acb_bank(token_bank, account, password) {
    const url = `https://api.web2m.com/historyapiacbv3/${password}/${account}/${token_bank}`;
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
            return data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}

// get_api_momo_bank();
async function get_api_momo_bank(token_bank) {
    const url = `https://api.web2m.com/historyapimomo/${token_bank}`;
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
            return data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}

async function list_topup_today(id,time,proce){
    return await fetch(`/api/list_topup_today/${id}/${time}/${proce}` /*, options */)
    .then((response) => response.json())
    .then((data) => {
        return data;
    })
    .catch((error) => {
        console.warn(error);
        return undefined;
    });
}
// async function ii(){
//     var d = new Date();
//     let y = d.getFullYear();
//     let m = (d.getMonth() + 1) < 10 ? `0${d.getMonth() + 1}` : (d.getMonth() + 1);
//     let dd = d.getDate();
//     var today = `${y}-${m}-${dd}`;
//     var today_ = "";
//     // var data = await get_api_mb_bank();
//     var method = 1;
//     var user_id = get_cr_user().id;
//     var rs = await list_topup_today(user_id,Number(new Date(today).getTime() / 1000));
//     if(rs){
//         alert('co')
//     }else{
//         alert('ko')
//     }
// }

async function insert_mb_bank() {
    var infor_mbbank = await get_admin_bank();
  
        var token_bank = "";
        var account = "";
        var password = "";
        infor_mbbank.forEach(f => {
            if (Number(f.type) === 1) {
            token_bank = f.token;
            account = f.account;
            password = f.password;}
        })
        var rs_bank = await get_api_mb_bank(token_bank, account, password);
        var cr_u = get_cr_user();
        var id_user = get_number_by_id(cr_u.id)
        var d = new Date();
        let y = d.getFullYear();
        let m = (d.getMonth() + 1) < 10 ? `0${d.getMonth() + 1}` : (d.getMonth() + 1);
        let dd = d.getDate();
        var today = `${y}-${m}-${dd}`;
        var today_ = "";
        var method = 1;
        var user_id = get_cr_user().id;
        var is_admin = get_cr_user().is_admin
        if (is_admin === 1) {
            return;
        }
        if (rs_bank) {
            if (rs_bank.status) {
                rs_bank.transactions.forEach( async (f) => {
                    var list_topup_ = await list_topup_today(user_id,Number(new Date(today).getTime() / 1000),1);
                    if (f.type === "IN") {
                        var des =f.description
                        var number =des.indexOf('m2v');
                        var description = des.substring(Number(number) + 3,Number(number) + 7)
                        if (description === id_user) {
                            let dd_ = f.transactionDate.substring(0, 2);
                            let m_ = f.transactionDate.substring(3, 5);
                            let y_ = f.transactionDate.substring(6, 10);
                            today_ = `${y_}-${m_}-${dd_}`;
                            if (Number(new Date(today_).getTime() / 1000) === Number(new Date(today).getTime() / 1000)) {
                                if(list_topup_){
                                    var list_count = Object.keys(list_topup_).length;
                                    if(Number(list_count) === 0){
                                        var rs = await ticket_save_mb({ money: f.amount, method: method, des: id_user, user_id: user_id, time: Number(new Date(today_).getTime() / 1000),transactionID:f.transactionID });
                                        if (rs.ok) {
                                             $('#bank_money_ticket').modal('show');}
                                    }else{
                                        let list_tranid =  list_topup_.filter(s => Number(s.transactionID) === f.transactionID)
                                        let list_count_tranid = Object.keys(list_tranid).length;
                                        if(Number(list_count_tranid) === 1){
                                            return;
                                        }else{
                                            var rss = await ticket_save_mb({ money: f.amount, method: method, des: id_user, user_id: user_id, time: Number(new Date(today_).getTime() / 1000),transactionID:f.transactionID });
                                            if (rss.ok) {
                                                $('#bank_money_ticket').modal('show');}
                                        }
                                       
                                    }
                                   
                                }
                              
                            }
                        }
                    }
                })
            }

        }
    // }
}

async function insert_acb_bank() {
    var infor_acbbank = await get_admin_bank();
   
        var token_bank = "";
        var account = "";
        var password = "";
        infor_acbbank.forEach(f => {
            if (Number(f.type) === 2) {
            token_bank = f.token;
            account = f.account;
            password = f.password;}
        })
        var rs_acb_bank = await get_api_acb_bank(token_bank, account, password);
        var cr_u = get_cr_user();
        var id_user = get_number_by_id(cr_u.id)
        var d = new Date();
        let y = d.getFullYear();
        let m = (d.getMonth() + 1) < 10 ? `0${d.getMonth() + 1}` : (d.getMonth() + 1);
        let dd = d.getDate();
        var today = `${y}-${m}-${dd}`;
        var today_ = "";
        var method = 1;
        var user_id = get_cr_user().id;
        var is_admin = get_cr_user().is_admin
        if (is_admin === 1) {
            return;
        }
        if (rs_acb_bank) {
            if (rs_acb_bank.status) {
                rs_acb_bank.transactions.forEach( async (f) => {
                    var list_topup_ = await list_topup_today(user_id,Number(new Date(today).getTime() / 1000),3);
                    if (f.type === "IN") {
                        var des =f.description
                        var number =des.indexOf('m2v');
                        var description = des.substring(Number(number) + 3,Number(number) + 7)
                        if (description === id_user) {
                            let dd_ = f.transactionDate.substring(0, 2);
                            let m_ = f.transactionDate.substring(3, 5);
                            let y_ = f.transactionDate.substring(6, 10);
                            today_ = `${y_}-${m_}-${dd_}`;
                            if (Number(new Date(today_).getTime() / 1000) === Number(new Date(today).getTime() / 1000)) {
                                if(list_topup_){
                                    var list_count = Object.keys(list_topup_).length;
                                    if(Number(list_count) === 0){
                                        var rs = await ticket_save_acb({ money: f.amount, method: method, des: id_user, user_id: user_id, time: Number(new Date(today_).getTime() / 1000),transactionID:f.transactionID });
                                        if (rs.ok) {
                                             $('#bank_money_ticket').modal('show');}
                                    }else{
                                        let list_tranid =  list_topup_.filter(s => Number(s.transactionID) === f.transactionID)
                                        let list_count_tranid = Object.keys(list_tranid).length;
                                        if(Number(list_count_tranid) === 1){
                                            return;
                                        }else{
                                            var rss = await ticket_save_acb({ money: f.amount, method: method, des: id_user, user_id: user_id, time: Number(new Date(today_).getTime() / 1000),transactionID:f.transactionID });
                                            if (rss.ok) {
                                                $('#bank_money_ticket').modal('show');}
                                        }
                                       
                                    }
                                   
                                }
                              
                            }
                        }
                    }
                })
            }
        }

    // }

}



async function insert_momo_bank() {
    var infor_momo = await get_admin_bank();
    
        var token_bank = "";
        var account = "";
        var password = "";
        infor_momo.forEach(f => {
            if (Number(f.type) === 3) {
            token_bank = f.token;
            account = f.account;
            password = f.password;}
        })
        var rs_momo = await get_api_momo_bank(token_bank);
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
        var today_ = "";
        var method = 1;
        var user_id = get_cr_user().id;
        var is_admin = get_cr_user().is_admin
        if (is_admin === 1) {
            return;            //     var b =Number(new Date('2021-11-16 00:00:00').getTime() / 1000);
        }
        if (rs_momo) {
            if (rs_momo.momoMsg) {
                rs_momo.momoMsg.tranList.forEach(async (f) => {
                    var list_topup_ = await list_topup_today(user_id,Number(new Date(today).getTime() / 1000),2);
                    if (Number(f.io) === 1) {
                        var des =f.comment
                        var number =des.indexOf('m2v');
                        var description = des.substring(Number(number) + 3,Number(number) + 7)
                        if (description === id_user) {;
                           today_ = f.finishTime;
                            if (Number(new Date(star_today).getTime() / 1000) < Number(new Date(today_).getTime() / 1000) < Number(new Date(end_today).getTime() / 1000)) {
                                if(list_topup_){
                                    var list_count = Object.keys(list_topup_).length;
                                    if(Number(list_count) === 0){
                                        var rs = await ticket_save_momo({ money: f.amount, method: method, des: id_user, user_id: user_id, time: Number(new Date(today_).getTime() / 1000),transactionID:f.tranId });
                                        if (rs.ok) {
                                             $('#bank_money_ticket').modal('show');}
                                    }else{
                                        let list_tranid =  list_topup_.filter(s => Number(s.transactionID) === f.tranId)
                                        let list_count_tranid = Object.keys(list_tranid).length;
                                        if(Number(list_count_tranid) === 1){
                                            return;
                                        }else{
                                            var rss = await ticket_save_acb({ money: f.amount, method: method, des: id_user, user_id: user_id, time: Number(new Date(today_).getTime() / 1000),transactionID:f.tranId });
                                            if (rss.ok) {
                                                $('#bank_money_ticket').modal('show');}
                                        }
                                       
                                    }
                                   
                                }
                            }
                        }
                    }
                })
            }
            // var rs = await ticket_save_momo({ money: total, method: method, des: id_user, user_id: user_id, time: Number(new Date(today).getTime() / 1000) });
            // if (rs.ok) {
            //     $('#bank_money_ticket').modal('show');
            // }
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

async function ticket_save_mb(data) {
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






