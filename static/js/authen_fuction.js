`use strict`
init_authen();
init_logo();

function change_lang(lang) {
    setCookie('lang', lang, 90000);
    // if(lang === "en")
    // {
    //     document.getElementById('img_lang').innerHTML=`<img width="20px" height="20px"
    //     src="../img/usa.jpg" alt="">`;
    // }
    location.reload();
}

async function init_logo() {
    var data_img = await get_img_login();
    if (data_img) {
        data_img.forEach(item => {
            if (document.getElementById('image_login')) {
                document.getElementById('image_login').innerHTML = `<img src="${item.logo_img}" width="400px" alt="m2v.me entrance">`;
            }

        })
    }
    var data = await get_img_logo();
    if (data) {
        data.forEach(item => {
            if (document.getElementById('img_logo')) {
                document.getElementById('img_logo').innerHTML = `<img width="100%" height="100%"
                src="${item.logo_img}" alt="">`;
            }
            if (document.getElementById('menu_img_logo')) {
                document.getElementById('menu_img_logo').innerHTML = `<img width="100%" height="100%"
                src="${item.logo_img}" alt="">`;
            }
            if (document.getElementById('logo_login_center')) {
                document.getElementById('logo_login_center').innerHTML = ` <img src="${item.logo_img}" width="100%" height="100%" alt="logo m2v.me" />`;
            }
            if (document.getElementById('img_logo_admin')) {
                document.getElementById('img_logo_admin').innerHTML = `<img height="68.99px"
                src="${item.logo_img}" alt="">`;
            }
        })
    }
}

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
                cr.innerHTML = "";
                //  `
                // <a class="nav-link active" aria-current="page" onclick="acc_logout()" href="#" data-lang="Logout"></a>`;
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

async function get_img_login() {
    return await fetch(`/api/init_img_login` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}

async function get_img_logo() {
    return await fetch(`/api/init_logo` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}

async function get_current_finance() {
    var cr_u = get_cr_user();
    var data = await fetch(`/api/finance/${cr_u.id}` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data[0];
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
    if (data.ok === 0) {
        return null;
    } else {
        return data;
    }
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
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
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
