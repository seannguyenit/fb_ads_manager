'use strict'
init_menu();
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

async function init_menu() {
    var menu = document.getElementById('main_menu');
    var cr_url = location.href;
    if (menu) {
        menu.innerHTML = '';
        var cr_user = get_cr_user();
        var lst_menu = await menu_get_current_menu(cr_user.id);
        if(!cr_url.includes('user_info') && lst_menu.filter(f=>{ return cr_url.includes(f.action)}).length == 0) {
            location.href = '/login'
        }
        lst_menu.forEach(item => {
            menu.innerHTML += `<a class="nav-link active title-nav${cr_url.includes(item.action) ? " selected" : ""}" aria-current="page" href="/home/${item.action}">${item.name}</a>`;
        });
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