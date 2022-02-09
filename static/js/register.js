'use strict'

init_register()
async function init_register() {
    var ref = new URL(window.location.href).searchParams.get("ref");
    if (ref) {
        document.getElementById('ref').value = ref;
    }
}


async function check_username() {
    var id = 0;
    var user_name = document.getElementById('user').value;
    var rs = await user_check_existed(id, user_name);
    if (!rs) return false;
    if (rs.existed > 0) return false;
    return true;
}

async function user_check_existed(id, username) {
    // var cr_u = get_cr_user();
    return await fetch(`/api/check_u/${id}/${username}` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data[0];
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}


async function register() {
    if (!check_username()) {
        alert('email bị trùng !')
        return;
    }

    if (document.getElementById('pass').value != document.getElementById('pass_confirm').value) {
        alert('Xác nhận mật khẩu không dúng !')
        return;
    }
    if (document.getElementById('pass').value.length == 0 || document.getElementById('user').value.length == 0 || document.getElementById('pass_confirm').value.length == 0) {
        alert('Chưa điền đủ thông tin !')
        return;
    }
    if (document.getElementById('user').value.indexOf('@') == -1) {
        alert('email không đúng !')
        return;
    }
    var user_ = document.getElementById('user').value;
    var pass_ = document.getElementById('pass').value;
    var ref_ = document.getElementById('ref').value;
    let rs = await fetch(`/api/reg_acc`, {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: user_, pass: pass_, ref: ref_ })
    })
        .then(response => response.json())
        .then(data => {
            return data
        })
        .catch(error => {
            console.error('Error:', error);
        });
    if (rs) {
        alert('Đăng ký thành công vui lòng vào email đã đăng ký để kích hoạt tài khoản !')
        location.href = '/login'
    }
}