'use strict'

init_page();

async function init_page() {
    await init_menu()
    await Promise.all([
        menu_contacst(),
        init_bank_topup(),
    ]);
}

async function check_admin() {
    var user = get_cr_user();
    if (user && user.id) {
        var user_is_ad = await fetch(`/api/check_admin/${user.id}` /*, options */)
            .then((response) => response.json())
            .then((data) => {
                return data;
            })
            .catch((error) => {
                console.warn(error);
                return undefined;
            });
        return user_is_ad[0].is_admin || 0;
    }
    return 0;
}



function init_bank_topup() {
    var cr_user = get_cr_user();
    if (cr_user && cr_user.is_admin === 1) return;
    if (window.location.href.includes('localhost')) return;
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
    var menu_user_mobie = document.getElementById('menu_user_mobie');
    var menu_ = document.getElementById('menu_money');
    var menu_bank = document.getElementById('menu_bank');
    var menu_general = document.getElementById('menu_');
    var menu_user = document.getElementById('main_menu__');
    var list_menu_user = document.getElementById('list_menu_user');
    var cr_url = location.href;
    var cr_url_menu = location.pathname;
    // alert(cr_url_menu)
    if (menu || menu_user) {
        // menu.innerHTML = '';
        // menu_user.innerHTML = '';
        var cr_user = get_cr_user();
        if (!cr_user) {
            location.href = '/login'
        }

        var lst_menu = await menu_get_current_menu(cr_user.id);
        var is_ad = await check_admin();
        if (!cr_url.includes('user_info') && lst_menu.filter(f => { return cr_url.includes(f.action) }).length == 0) {
            location.href = '/login'
        }
        if (is_ad === 0) {
            if (lst_menu.filter(ft => ft.id_admin === 1).length > 0) {
                location.href = '/login'
            }
        }
        if (menu || menu_user) {
            //     lst_menu.forEach(item => {
            //         if (item.type === 0) {
            //             menu.innerHTML += `<a class="nav-link active title-nav${cr_url.includes(item.action) ? " selected" : ""}" aria-current="page" href="/home/${item.action}" data-lang="${item.name}">${item.name}</a>`;
            //         }
            //     });
            // } else {
            lst_menu.forEach(item => {
                if (item.type === 0) {
                    var style_ = ""
                    if (cr_url_menu === `/home/${item.action}`) {
                        style_ = 'nuxt-link-active';
                    }
                    if (menu_user_mobie) {
                        menu_user_mobie.innerHTML += `
                        <div id="activeMenu" class="d-flex mt-4 ml-2" style="width: 100%;">
                            <a class="text-decoration-none ml-4" style="color: rgb(45, 52, 54);font-size:16px;" aria-current="page" href="/home/${item.action}">
                            <div  class="d-flex align-center ${style_}"><i aria-hidden="true" class="v-icon notranslate mr-1 ${item.icon} theme--light" style="font-size: 20px; "></i><span class="ml-6" data-lang="${item.name}">${item.name}</span></div>
                            </a>
                        </div>
                        `;
                    }
                    if (menu_user) {

                        menu_user.innerHTML += `<a style="max-height: 56px !important;padding-left:15px"
                        class="
                               text-decoration-none
                               white--text
                               ml-4 ml-sm-4 ml-lg-0
                               d-none d-md-block
                               " aria-current="page" href="/home/${item.action}">
                       <div class="white--text d-flex align-center ${style_}"><i aria-hidden="true" class=" notranslate mr-1 ${item.icon} theme--light" style="font-size: 19px;"></i><span style="font-size: 16px;" data-lang="${item.name}">${item.name}</span></div>
                   </a> `;
                    }
                    if (menu) {
                        menu.innerHTML += `
                        <li class="slide">
                                    <a class="side-menu__item"aria-current="page" href="/home/${item.action}" data-lang="${item.name}">
                                        <img src="${item.icon}" alt="" class="side-menu__icon"> <span
                                            class="side-menu__label">${item.name}</span>
                                    </a>
                        </li>
                        `
                        // menu.innerHTML += `<a style=" color: #fff ;padding: 1rem 1rem !important" class="nav-link font-weight-bold text_black_mobie active title-nav${cr_url.includes(item.action) ? " selected" : ""}" aria-current="page" href="/home/${item.action}" data-lang="${item.name}">${item.name}</a>`;
                    }

                }

                if (item.type === 1 && menu_) {
                    menu_.innerHTML += `
                    <li><a class="slide-item" aria-current="page" href="/home/${item.action}" data-lang="${item.name}">
                    ${item.name}</a></li>
                    `
                    // menu_.innerHTML += `
                    //     <a style="background-color: #2a2e3f; color: #ffff;" class="nav-link font-weight-bold dropdown-item active title-nav${cr_url.includes(item.action) ? " selected" : ""}" aria-current="page" href="/home/${item.action}" data-lang="${item.name}">${item.name}</a>
                    // `;
                    //     // <a class="dropdown-item" href="#">Action</a>
                }
                if (item.type === 2 && menu_general) {
                    menu_general.innerHTML += `
                    <li><a class="slide-item" aria-current="page" href="/home/${item.action}" data-lang="${item.name}">
                    ${item.name}</a></li>
                    `;
                    //     // <a class="dropdown-item" href="#">Action</a>
                }
                if (item.type === 3 && menu_bank) {
                    menu_bank.innerHTML += `
                    <li><a class="slide-item" aria-current="page" href="/home/${item.action}" data-lang="${item.name}">
                    ${item.name}</a></li>
                    `;
                    //     // <a class="dropdown-item" href="#">Action</a>
                }
                if (item.type === 4 && list_menu_user) {
                    list_menu_user.innerHTML += `
                    <li><a class="slide-item" aria-current="page" href="/home/${item.action}" data-lang="${item.name}">
                    ${item.name}</a></li>
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
async function list_topup_momo(id, proce) {
    return await fetch(`/api/list_topup_momo/${id}/${proce}` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });

}

async function list_tranid() {
    return await fetch(`/api/tranid_acb` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}

async function list_topup_today(id, time, proce) {
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
    var action_mb = "";
    var token_bank = "";
    var account = "";
    var password = "";
    infor_mbbank.forEach(f => {
        if (Number(f.action) === 1) {
            if (Number(f.type) === 1) {
                token_bank = f.token;
                account = f.account;
                password = f.password;
                action_mb = f.action;
            }
        }

    })

    if (Number(action_mb) === 0) {
        return;
    }
    var rs_bank = await get_api_mb_bank(token_bank, account, password);
    var cr_u = get_cr_user();
    var id_user = get_number_by_id(cr_u.id)
    var d = new Date();
    let y = d.getFullYear();
    let m = (d.getMonth() + 1) < 10 ? `0${d.getMonth() + 1}` : (d.getMonth() + 1);
    let dd = (d.getDate()) < 10 ? `0${d.getDate()}` : (d.getDate());
    // let dd = '02'
    var today = `${y}-${m}-${dd}`;
    var today_ = "";
    var method = 1;
    var user_id = get_cr_user().id;
    var list_topup_ = await list_topup_today(user_id, Number(new Date(today).getTime() / 1000), 1);

    if (rs_bank) {
        if (rs_bank.status) {
            rs_bank.transactions.forEach(async (f) => {
                if (f.type === "IN") {
                    var des = f.description.toLowerCase()
                    var number = des.indexOf('napthe');
                    var description = des.substring(Number(number) + 6, Number(number) + 10)
                    if (description === id_user) {
                        let dd_ = f.transactionDate.substring(0, 2);
                        let m_ = f.transactionDate.substring(3, 5);
                        let y_ = f.transactionDate.substring(6, 10);
                        today_ = `${y_}-${m_}-${dd_}`;
                        if (Number(new Date(today_).getTime() / 1000) === Number(new Date(today).getTime() / 1000)) {
                            if (list_topup_) {
                                var list_count = Object.keys(list_topup_).length;
                                if (Number(list_count) === 0) {
                                    var rs = await ticket_save_mb({ money: f.amount, method: method, des: id_user, user_id: user_id, time: Number(new Date(today_).getTime() / 1000), transactionID: f.transactionID });
                                    if (rs.ok) {
                                        if (Array.from(document.getElementById("bank_money_ticket").attributes).findIndex(s => s.name === 'open') === 1) {
                                            return;
                                        } else {
                                            document.getElementById("bank_money_ticket").showModal();
                                        }
                                    }
                                } else {
                                    let list_tranid = list_topup_.filter(s => (s.transactionID).toString() === (f.transactionID).toString())
                                    let list_count_tranid = Object.keys(list_tranid).length;
                                    if (Number(list_count_tranid) > 0) {
                                        return;
                                    } else {
                                        var rss = await ticket_save_mb({ money: f.amount, method: method, des: id_user, user_id: user_id, time: Number(new Date(today_).getTime() / 1000), transactionID: f.transactionID });
                                        if (rss.ok) {
                                            if (Array.from(document.getElementById("bank_money_ticket").attributes).findIndex(s => s.name === 'open') === 1) {
                                                return;
                                            } else {
                                                document.getElementById("bank_money_ticket").showModal();
                                            }
                                        }
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

async function insert_acb_bank() {

    var infor_acbbank = await get_admin_bank();
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
    var rs_acb_bank = await get_api_acb_bank(token_bank, account, password);
    var cr_u = get_cr_user();
    var id_user = get_number_by_id(cr_u.id)
    var d = new Date();
    let y = d.getFullYear();
    let m = (d.getMonth() + 1) < 10 ? `0${d.getMonth() + 1}` : (d.getMonth() + 1);
    let dd = (d.getDate()) < 10 ? `0${d.getDate()}` : (d.getDate());
    var today = `${y}-${m}-${dd}`;
    var today_ = "";
    var method = 1;
    var user_id = get_cr_user().id;
    var list_topup_ = await list_tranid();
    if (rs_acb_bank) {
        if (rs_acb_bank.status) {
            var stt_rs = 0;
            for (let index_acb = 0; index_acb < rs_acb_bank.transactions.length; index_acb++) {
                const f = rs_acb_bank.transactions[index_acb];
                if (f.transactionID && f.transactionID.length > 0 && f.type === "IN" && !list_topup_.includes(f.transactionID) && check_user_id_in_des(f.description, user_id)) {
                    let dd_ = f.transactionDate.substring(0, 2);
                    let m_ = f.transactionDate.substring(3, 5);
                    let y_ = f.transactionDate.substring(6, 10);
                    today_ = `${y_}-${m_}-${dd_}`;
                    var rss = await ticket_save_acb({ money: f.amount, method: method, des: id_user, user_id: user_id, time: Number(new Date(today_).getTime() / 1000), transactionID: f.transactionID });
                    if (rss.ok) {
                        stt_rs = 1;
                    }
                }
            }
            if (stt_rs === 1) {
                if (Array.from(document.getElementById("bank_money_ticket").attributes).findIndex(s => s.name === 'open') === 1) {
                    return;
                } else {
                    document.getElementById("bank_money_ticket").showModal();
                }
            }
        }
    }

    // }

}



async function insert_momo_bank() {
    var infor_momo = await get_admin_bank();
    var action_momo = "";
    var token_bank = "";
    var account = "";
    var password = "";
    infor_momo.forEach(f => {
        if (Number(f.action) === 1) {
            if (Number(f.type) === 3) {
                token_bank = f.token;
                account = f.account;
                password = f.password;
                action_momo = f.action;
            }
        }
    })
    if (Number(action_momo) === 0) {
        return;
    }
    var rs_momo = await get_api_momo_bank(token_bank);
    var cr_u = get_cr_user();
    var id_user = get_number_by_id(cr_u.id)
    var total = 0;
    var d = new Date();
    let y = d.getFullYear();
    let m = (d.getMonth() + 1) < 10 ? `0${d.getMonth() + 1}` : (d.getMonth() + 1);
    let dd = (d.getDate()) < 10 ? `0${d.getDate()}` : (d.getDate());
    var star_today = `${y}-${m}-${dd} 00:00:00`;
    var end_today = `${y}-${m}-${dd} 23:59:59`;
    var today = `${y}-${m}-${dd}`;
    // var data = await get_api_mb_bank();
    var today_ = "";
    var method = 1;
    var user_id = get_cr_user().id;
    var list_topup_ = await list_topup_momo(user_id, 2);
    if (rs_momo) {
        if (rs_momo.momoMsg && rs_momo.momoMsg.tranList) {
            rs_momo.momoMsg.tranList.forEach(async (f) => {


                // var list_topup_ = await list_topup_today(user_id,Number(new Date(today).getTime() / 1000),2);
                if (Number(f.io) === 1) {
                    var des = f.comment.toLowerCase()
                    var number = des.indexOf('napthe');
                    var description = des.substring(Number(number) + 6, Number(number) + 10)
                    if (description === id_user) {

                        today_ = f.clientTime;
                        if (Number(new Date(star_today).getTime() / 1000) < Number(new Date(today_).getTime() / 1000) < Number(new Date(end_today).getTime() / 1000)) {
                            if (list_topup_) {
                                // var list_count = Object.keys(list_topup_).length;
                                // if(Number(list_count) === 0){
                                //     var rs = await ticket_save_momo({ money: f.amount, method: method, des: id_user, user_id: user_id, time: Number(new Date(today).getTime() / 1000),transactionID:f.tranId });
                                //     if (rs.ok) {
                                //         //  $('#bank_money_ticket').modal('show')
                                //          document.getElementById("bank_money_ticket").showModal();
                                //         }
                                // }else{
                                let list_tranid = list_topup_.filter(s => (s.transactionID).toString() === (f.tranId).toString())
                                let list_count_tranid = Object.keys(list_tranid).length;
                                if (Number(list_count_tranid) > 0) {
                                    return;
                                } else {
                                    var rss = await ticket_save_momo({ money: f.amount, method: method, des: id_user, user_id: user_id, time: Number(new Date(today).getTime() / 1000), transactionID: f.tranId });
                                    if (rss.ok) {
                                        if (Array.from(document.getElementById("bank_money_ticket").attributes).findIndex(s => s.name === 'open') === 1) {
                                            return;
                                        } else {
                                            document.getElementById("bank_money_ticket").showModal();
                                        }
                                    }

                                }

                                // }

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






