'use strict'
init_menu();
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