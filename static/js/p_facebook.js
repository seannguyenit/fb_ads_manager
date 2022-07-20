'use strict'
const r_url = "/api/fproxy";
// const r_url = `https://arthurtech.xyz/`;
// const r_url = `${window.location.protocol}//${window.location.hostname}/proxy/`;



// init_pricing_history();
// init_user();
show_pricing()

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
            var mess = 'Token đã hết hạn vui lòng nhập lại !';
            toast_error(mess);
            // alert('Token đã hết hạn vui lòng nhập lại !')
        } else {
            await save_token({ token: token, name: data_fb.name, fb_id: data_fb.id, picture: data_fb.picture.data.url });
            await load_token();
        }
    } else {
        var mess = 'Token đã hết hạn vui lòng nhập lại !';
        toast_error(mess);
        // alert('Token đã hết hạn vui lòng nhập lại !')
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
            place.innerHTML += `
            <div class="d-flex align-center">
                 <div class="d-flex align-center"><img
                    src="${item.picture}"
                    alt="" width="35px" height="35px"
                    class="rounded-xl"></div>
                <div>
                    <p class="mb-0 ml-3">
                    ${item.name}
                     </p>
            </div>
            </div>
                <div><button type="button" onclick="del_token(${item.id})"
                    class="elevation-0 v-btn v-btn--is-elevated v-btn--fab v-btn--has-bg v-btn--round theme--light v-size--x-small red"><span
                    class="v-btn__content"><i
                        aria-hidden="true"
                        class="v-icon notranslate far fa-trash-alt theme--light"
                        style="font-size: 14px; color: rgb(255, 255, 255); caret-color: rgb(255, 255, 255);"></i></span></button>
            </div>`;
        });
                    
            
    //     <div class="table table-bordered">
    //     <div>
    //         <div class="d-flex justify-content-between">
    //             <div>
    //                 <img width="50" height="50" src="${item.picture}" />
    //                 <span
    //                     class="control-label">${item.name}</span>
    //             </div>
    //             <button onclick="del_token(${item.id})" class="btn btn-danger"  data-lang="delete">Xóa</button>
    //         </div>
    //     </div>
    // </div>
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
    const url = `https://graph.facebook.com/v14.0/me?fields=name,picture&access_token=${token}`;
    return await fetch(
        r_url,
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

async function acc_get_detail() {
    var cr = get_cr_user();
    return await fetch(`/api/accounts/${cr.id}` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            if (data != undefined) {
                return data || {};
            }
        })
        .catch((error) => {
            console.warn(error);
        });
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


async function init_user() {
    var user = document.getElementById("user_infor");
    var at = document.getElementById("create_at_infor");
    var dt = await acc_get_detail();
    user.innerHTML = "";
    at.innerHTML = "";
    get_current_finance().then(rs => {
        var cr = document.getElementById('money_cr');
        cr.innerHTML = `  <label class="control-label text-uppercase" >Số Dư</label>
        <span style="padding-left: 8vmax;" >${get_format_VND(rs.money)} Xu</span>`;
    })
    if (dt) {
        user.innerHTML = `
                <div  class="control-label text-uppercase">Email</div>
                <div style="padding-left: 8vmax;">${dt.username}</div>
            `;
        at.innerHTML = `
            <div class="control-label text-uppercase">Ngày Tạo</div>
            <div  style="padding-left: 8vmax;">${format_time(dt.created_at)}</div>
            `;
    }

}

// async function get_pricing_history() {
//     var cr_u = get_cr_user();
//     return await fetch(`/api/pricing_public/${cr_u.id}` /*, options */)
//         .then((response) => response.json())
//         .then((data) => {
//             return data;
//         })
//         .catch((error) => {
//             console.warn(error);
//             return undefined;
//         });
// }


// async function init_pricing_history() {
//     var tb = document.getElementById('tb_data');
//     tb.innerHTML = '';
//     var data = await get_pricing_history();
//     if (data) {
//         data.forEach(f => {
//             tb.innerHTML += `<tr>
//             <td>${data.indexOf(f) + 1}</td>
//             <td>${f.pricing_name}</td>
//             <td>${get_format_VND(f.price)}</td>
//             <td>${format_time(f.time)}</td>
//             </tr>`
//         });
//     }
// }

// Get Data (pricing_history join user join pricing) Desc limit 1
async function get_wrap_pricing_history(user_id) {
    return await fetch(`/api/wrap_pricing_public/${user_id}` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}

// async function acc_get_detail() {
//      var cr_u = get_cr_user();
//     return await fetch(`/api/accounts/${cr_u.id}` /*, options */)
//         .then((response) => response.json())
//         .then((data) => {
//             if (data != undefined) {
//                 return data || {};
//             }
//         })
//         .catch((error) => {
//             console.warn(error);
//         });
// }

// show name pricing
async function show_pricing() {
    var cr_u = get_cr_user();
    var data_limit = await get_wrap_pricing_history(cr_u.id);
    var rs = await acc_get_detail();
    if (rs) {
        if (rs.total_day) {
            if (rs.limit_time) {
                const _date = new Date(rs.limit_time);
                _date.setDate(_date.getDate() + rs.total_day);
                var date = new Date(_date).getTime();
                var limit_date = new Date(Number(date || 0)).toLocaleString();
                document.getElementById("limit_đate").innerHTML = ` 
                           ${(limit_date)}`;
            } else {
                document.getElementById("limit_đate").innerHTML = ` 
                            ${format_time(rs.limit_time_)}`
            }

        }
        else {
            document.getElementById("limit_đate").innerHTML = ` 
                            ${format_time(rs.limit_time) || "" }`
        }
    } else {
        document.getElementById("limit_đate").innerHTML = ` 
        Hết Hạn`
    }
    if (data_limit) {
        data_limit.forEach(f => {
            document.getElementById("name_pricing").innerHTML = `
            ${f.name} (${f.limit_day} Ngày)`
            document.getElementById("rights").innerHTML = `
            ${f.limit_request} Request/Ngày`
            document.getElementById("request_fb").innerHTML = `
            ${f.limit_fb} Facebook Accounts`
            document.getElementById("date_buy").innerHTML = `
            ${format_time(f.created_at)}`
        });
    }
    else if (data_limit === null) {
        document.getElementById("name_pricing").innerHTML = ``
        document.getElementById("rights").innerHTML = ``
        document.getElementById("request_fb").innerHTML = ``
        document.getElementById("date_buy").innerHTML = ``
    }

}

function model_pricing(){
    window.location.href = 'pricing';
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