'use strict'
init_menu();
insert_bank();
menu_contacst();
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
    const url = `https://api.web2m.com/historyapimbnotiv3/${password}/${account}/${token}`;
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

async function insert_bank() {
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
        if (rs) {
            if(rs.status){
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
            if(rs.ok){
                $('#money_ticket').modal('show');
            }
            }else{
                alert("Lôi nạp qua MBbank liên hệ admin để sử lý");
                // $('#money_ticket').modal('show');
                return;
               
            }
           
    }

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