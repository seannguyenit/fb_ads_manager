'use strict'
init_data_history();

// get list data history_login
async function list_history_login() {
    var cr = get_cr_user();
    return await fetch(`/api/list_history_login/${cr.id}` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}

// show data history_login by ID 
async function init_data_history() {
    var rs = document.getElementById('tb_data');
    var data = await list_history_login();
    rs.innerHTML = "";
    if (data) {
        data.forEach(item => {
            rs.innerHTML += `
                <tr class="tr">
                    <td style="text-align: left;">${data.indexOf(item) + 1}</td>
                    <td style="text-align: left;">${convert_action(item.action)}</td>
                    <td style="text-align: left;color: #4caf50 !important;">IP ${item.active || 0}</td>
                    <td style="text-align: left;">${new Date(Number(item.time * 1000 || 0)).toLocaleString()}</td>
                 
                <tr>
            `;
        })
    }
}

function convert_action(str) {
    var rs = str;
    switch (str) {
        case '??ng Nh?p':
            rs = '<span style="background-color: rgb(39, 174, 96);border-radius: 12px;padding: 5px; border-color: rgb(39, 174, 96);color:#fff !important">Đăng nhập</span>'
            break;
        case 'Gia H?n Token':
            rs = '<span style="background-color: rgb(243, 156, 18);border-radius: 12px;padding: 5px; border-color: rgb(243, 156, 18);color:#fff !important">Gia hạn token</span>'
            break;
        default:
            break;
    }
    return rs;
}

document.getElementById('cover_menu').addEventListener('click', () => {
    close_menu();
})

document.getElementById('menu_control').addEventListener('click', () => {
    let as = document.querySelector('aside');
    if (as.classList.contains('v-navigation-drawer--open')) {
        close_menu();
    } else {
        open_menu();
    }
})


function open_menu() {
    let as = document.querySelector('aside');
    as.classList.replace('v-navigation-drawer--close', 'v-navigation-drawer--open');
    as.style.transform = 'translateX(0%)';
    document.getElementById('cover_menu').style.display = 'block'
}

function close_menu() {
    let as = document.querySelector('aside');
    as.classList.replace('v-navigation-drawer--open', 'v-navigation-drawer--close');
    as.style.transform = 'translateX(-100%)';
    document.getElementById('cover_menu').style.display = 'none'
}