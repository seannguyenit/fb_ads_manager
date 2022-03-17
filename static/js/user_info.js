'use strict'
const r_url = "/proxy/";
// const r_url = `https://arthurtech.xyz/`;
// const r_url = `${window.location.protocol}//${window.location.hostname}/proxy/`;





load_token();

async function add_token() {
    var token = document.getElementById('token_fb').value;
    if (!token || token.length == 0) return;
    // var data_tk = await get_all_token();
    // if(data_tk.length >= 1){
    //     alert('Hệ thống đang thử nghiệm tối đa được 1 fb !')
    //     return;
    // }
    var data_fb = await get_user_info_from_fb(token);
    if (data_fb) {
        if (data_fb.error) {
            alert('Token đã hết hạn vui lòng nhập lại !')
        } else {
            await save_token({ token: token, name: data_fb.name, fb_id: data_fb.id, picture: data_fb.picture.data.url });
            await load_token();
        }
    } else {
        alert('Token đã hết hạn vui lòng nhập lại !')
    }
    document.getElementById('token_fb').value = '';
}

async function del_token(id) {
    await delete_token(id);
    load_token();
}

async function load_token() {
    var place = document.getElementById('list_data_token');
    place.innerHTML = '';
    var data_tk = await get_all_token();
    if (data_tk) {
        data_tk.forEach(item => {
            place.innerHTML += `<div class="table table-bordered">
                <div>
                    <div class="d-flex justify-content-between">
                        <div>
                            <img width="50" height="50" src="${item.picture}" />
                            <span style="color: white;"
                                class="control-label text-uppercase">${item.name}</span>
                        </div>
                        <button onclick="del_token(${item.id})" class="btn btn-danger">Xóa</button>
                    </div>
                </div>
            </div>`;
        });
    }
}

async function get_all_token() {
    var cr_u = await get_cr_user();
    return await fetch(`/api/token_fb/${cr_u.id}` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}


async function save_token(data) {
    var cr_u = await get_cr_user();
    data.user_id = cr_u.id;
    return await fetch(`/api/token_fb`, {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            return data
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


async function delete_token(id) {
    return await fetch(`/api/token_fb/${id}`, {
        method: 'DELETE', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(data => {
            return data
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


async function get_user_info_from_fb(token) {
    const url = `${r_url}https://graph.facebook.com/v12.0/me?fields=name,picture&access_token=${token}`;
    return await fetch(url /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}

async function change_pass() {
    var pass_ = document.getElementById('old_pass').value;
    var new_pass_ = document.getElementById('new_pass').value;
    var confirm_pass = document.getElementById('confirm_pass').value;
    if (confirm_pass != new_pass_) {
        alert('Mật khẩu xác nhận chưa đúng !')
        return;
    }
    var cr_u = await get_cr_user();
    if (!cr_u) return;
    let rs = await fetch(`/api/change_acc/${cr_u.id}`, {
        method: 'PUT', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pass: pass_, new_pass: new_pass_ })
    })
        .then(response => response.json())
        .then(data => {
            return data
        })
        .catch(error => {
            console.error('Error:', error);
        });
    if (rs.error) {
        alert(rs.error);
    } else {
        alert('Đổi mật khẩu thành công ! Quay lại trang đăng nhập !')
        window.location.href = '/login'
    }
}