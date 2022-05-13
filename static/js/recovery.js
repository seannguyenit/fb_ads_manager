'use strict'


async function recovery_() {
    var username = document.getElementById('user').value;
    var rs = await user_check(username);
    if(!rs){
        alert("Không tìm thấy tài khoảng vui lòng nhập lại !");
        return;
    }
    let rss = update_key_recovery(username);
    if (rss) {
        // location.href = '/register/success'
        location.href = '/recovery/success';
    }
}

// call to api check(email or usename)
async function user_check(username) {
    // var cr_u = get_cr_user();
    return await fetch(`/api/check_user/${username}` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data[0];
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}

// call to api update key_recovery and message email
async function update_key_recovery(username) {
    // var cr_u = get_cr_user();
    return await fetch(`/api/update_user/${username}` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data[0];
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}




