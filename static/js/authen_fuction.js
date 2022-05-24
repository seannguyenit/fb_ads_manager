`use strict`
init_authen();

function init_authen() {
    if (document.getElementById('current_username')) {
        if (!check_is_login()) {
            location.href = "/login";
        }
        var cr_u = get_cr_user();
        if (cr_u && cr_u.id > 0) {
            get_current_finance().then(rs => {
                var cr = document.getElementById('current_username');
                // let cr_money = get_format_VND(rs.money);
                // <input type="hidden" value="${cr_money}" id="current_money">
                // <a style="color:white">${money_bonus}</a>
                // let money_bonus = '(Bonus : ' + get_format_VND(rs.bonus)  + ' VNĐ)'
                // <a style="color:white" href="/home/user_info">${user_info}</a>
                let user_info = rs.username + ' ( ' + get_format_VND(rs.money) + ' VNĐ )';
                cr.innerHTML = `
                <a class="nav-link active" aria-current="page" onclick="acc_logout()" href="#">(Đăng xuất)</a>`;
            })
        }
    }
}

function check_is_login() {
    try {
        let cr_u = JSON.parse(getCookie('user'));
        //alert(cr_u);
        if (cr_u.id != undefined) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
}
function set_cr_user(user) {
    if (user) {
        //if (user.token) {
        setCookie('user', JSON.stringify(user));
        //}
    }
}
function get_cr_user() {
    try {
        return JSON.parse(getCookie('user'));
    } catch (error) {
        return {};
    }
}

async function get_current_finance() {
    var cr_u = get_cr_user();
    return await fetch(`/api/finance/${cr_u.id}` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data[0];
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}

async function menu_get_current_menu() {
    var cr_u = get_cr_user();
    return await fetch(`/api/menu/${cr_u.id}` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data[0];
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}

async function acc_logout() {
    //await check_authen();
    var user = get_cr_user('user');
    var url = `/api/logout`;
    var data = { user: user.id, token: user.token };
    let rs = await fetch(url, {
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
            console.error('Error:', error);
        });
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    location.href = '/';
}



function validateField(v, n) {
    if (v == undefined || v == null || v.length == 0) {
        alert(`${n} chưa được chọn !`);
        return false;
    }
    return true;
}

function validateSelect(v, n) {
    if (v == undefined || v == null || v.length == 0 || v == 0) {
        alert(`${n} chưa được chọn !`);
        return false;
    }
    return true;
}


/* helper method */
function setCookie(cname, cvalue) {
    const d = new Date();
    d.setTime(d.getTime() + (1 * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
