'use strict'
get_user_limit();
update_history();

/* account */
async function acc_get_all() {
    return await fetch(`/api/accounts` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data[0];
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}


async function acc_get_detail(id) {
    // var cr_u = get_cr_user();
    return await fetch(`/api/accounts/${id}` /*, options */)
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

// GET LIST DATA SEARCH_NAME
async function acc_get_byname(username) {
    // var cr_u = get_cr_user();
    return await fetch(`/api/accounts_search/${username}` /*, options */)
    .then((response) => response.json())
    .then((data) => {
        return data[0];
    })
    .catch((error) => {
        console.warn(error);
        return undefined;
    });
}

// SHOW LIST DATA SEARCH
async function init_users_byname() {
    main_table.innerHTML = '';
    // var cr = document.getElementById('search_table');
    var name = document.getElementById('username').value;
    var dt = await acc_get_byname(name);
    if (dt) {
            dt.forEach(item => {
                
                main_table.innerHTML += `
                    <tr>
                        <td>${dt.indexOf(item) + 1}</td>    
                        <td>${item.username}</td> 
                        <td>${get_format_VND(item.money)}</td> 
                        <td>${get_format_VND(item.bonus)}</td> 
                        <td>${get_format_VND(item.money_month)}</td>  
                        <td>${item.real_name}</td>    
                        <td>${item.phone}</td>    
                        <td>${item.add}</td>
                        <td>${format_time(item.limit_time)}</td>
                        <td>
                            ${button_action_tool(item.id, 'init_pricing_history', ['btn', 'btn-sm', 'btn-primary'], 'Gói DV')}
                            ${button_action_tool(item.id, 'init_money_history', ['btn', 'btn-sm', 'btn-primary'], 'LS Tiền')}
                            ${button_action_tool(item.id, 'open_modal', ['btn', 'btn-sm', 'btn-primary'], 'edit')}
                            ${button_action_tool(item.id, 'del_acc', ['btn', 'btn-sm', 'btn-danger'], 'delete')}
                        </td>
                    </tr>
                `;
                });                
            }
}


async function acc_save(url, data, meth) {
    return await fetch(url, {
        method: meth, // or 'PUT'
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

async function update_history() {
    var data = await acc_get_all();
    var id = 0;
    if (data) {
        data.forEach(item => {
            var today = new Date().getTime();
            var  date = new Date(item.limit_time).getTime();
            if( Number(date) != 0 && Number(date) < Number(today) ){
                 id = item.id;
            }
        }
    )};
     await history_update(id);
    //  alert(id);
}

async function history_update(id) {
    var url = `/api/accounts_history/${id}`;
    var meth = 'PUT';
    return await fetch(url, {
        method: meth, // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ active: false })
    })
        .then(response => response.json())
        .then(result => {
            return result;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


async function acc_del(id) {
    var url = `/api/accounts/${id}`;
    var meth = 'PUT';
    return await fetch(url, {
        method: meth, // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ active: false })
    })
        .then(response => response.json())
        .then(result => {
            return result;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// PUSH SEARCH_NAME TO API
async function acc_search(username) {
    var url = `/api/accounts_search/${username}`;
    var meth = 'PUT';
    return await fetch(url, {
        method: meth, // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ active: false })
    })
        .then(response => response.json())
        .then(result => {
            return result;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// async function init_users() {
//     main_table.innerHTML = '';
//     var dt = await acc_get_all();
//     if (dt) {
//         dt.forEach(item => {
//             main_table.innerHTML += `
//             <tr>
//                 <td>${dt.indexOf(item) + 1}</td>    
//                 <td>${item.username}</td> 
//                 <td>${get_format_VND(item.money)}</td> 
//                 <td>${get_format_VND(item.bonus)}</td> 
//                 <td>${get_format_VND(item.money_month)}</td> 
//                 <td>${item.real_name}</td>    
//                 <td>${item.phone}</td>    
//                 <td>${item.add}</td>
//                 <td>${format_time(item.limit_time)}</td>
//                 <td>
//                     ${button_action_tool(item.id, 'init_pricing_history', ['btn', 'btn-sm', 'btn-primary'], 'Gói DV')}
//                     ${button_action_tool(item.id, 'init_money_history', ['btn', 'btn-sm', 'btn-primary'], 'LS Tiền')}
//                     ${button_action_tool(item.id, 'open_modal', ['btn', 'btn-sm', 'btn-primary'], 'edit')}
//                     ${button_action_tool(item.id, 'del_acc', ['btn', 'btn-sm', 'btn-danger'], 'delete')}
//                 </td>
//             </tr>
//         `;
//         });
//         smoothy_ui_table();
//     }
// }
async function open_modal(params) {
    // var menu = await menu_get_template();
    // var per_place = document.getElementById('permiss_place');
    // per_place.innerHTML = '';
    // menu.forEach(f => {
    //     per_place.innerHTML += `<div class="form-check">
    //                         <input class="form-check-input" data-id="${f.id}" type="checkbox" ${f.stt == 1 ? "checked" : ""}>
    //                         <label class="form-check-label" for="invalidCheck">
    //                           ${f.name}
    //                         </label>
    //                     </div>`;
    // });
    if (params != 0) {
        var detail_dt = await acc_get_detail(params);
        $('#user_id').val(detail_dt.id || 0);
        $('#user').val(detail_dt.username || '');
        $('#pass').val(detail_dt.pass || '');
        $('#real_name').val(detail_dt.real_name || '');
        $('#phone').val(detail_dt.phone || '');
        $('#add').val(detail_dt.add || '');
        if (detail_dt.id != 0) {
            var data_per = await menu_get_current_menu(detail_dt.id);
            data_per.forEach(r => {
                if (r.stt == 1) {
                    var sl_per = document.querySelector(`input[data-id="${r.menu_id}"]`);
                    if (sl_per) {
                        sl_per.checked = true;
                    }
                }
            });
        }
    } else {
        $('#user_id').val(0);
        $('#user').val('');
        $('#pass').val('');
        $('#real_name').val('');
        $('#phone').val('');
        $('#add').val('');

    }
    $('#user_details').modal('show');

}

async function save__() {
    if (!confirm('Bạn có chắc chắn muốn lưu dữ liệu ?')) {
        return;
    }
    if (!validate_()) return;
    var id = $("#user_id").val()
    var username = $("#user").val()
    var pass = $("#pass").val()
    var real_name = $("#real_name").val()
    var phone = $("#phone").val()
    var add = $("#add").val()
    var rs_check = await check_username();
    if (!rs_check) {
        alert('email bị trùng !')
        return;
    }

    var url = `/api/accounts`;
    var meth = 'POST';
    const formData = new FormData();

    if (id != 0) {
        meth = 'PUT';
        url = `/api/accounts/${id}`;
    }
    var data = { username: username, pass: pass, real_name: real_name, phone: phone, add: add };

    let rs = await acc_save(url, data, meth);
    //add_menu_user
    var menu_sl = Array.prototype.map.call(document.querySelectorAll('input[data-id]'), (m) => { return [parseInt(m.dataset.id), m.checked ? 1 : 0, rs.id] });
    // let rs_per = await add_menu_user(menu_sl, rs.id);

    get_user_limit()
    init_users(cr_page,user_number_page);
    // init_users(cr_page,user_number_page);
};
async function save_() {
    if (!confirm('Bạn có chắc chắn muốn thay đổi dữ liệu ?')) {
        return;
    }
    if (!validate_()) return;
    var id = $("#user_id").val()
    var username = $("#user").val()
    var pass = $("#pass").val()
    var real_name = $("#real_name").val()
    var phone = $("#phone").val()
    var add = $("#add").val()
    var rs_check = await check_username();
    if (!rs_check) {
        alert('email bị trùng !')
        return;
    }

    var url = `/api/accounts`;
    var meth = 'POST';
    const formData = new FormData();

    if (id != 0) {
        meth = 'PUT';
        url = `/api/accounts/${id}`;
    }
    var data = { username: username, pass: pass, real_name: real_name, phone: phone, add: add };

    let rs = await acc_save(url, data, meth);
    //add_menu_user
    var menu_sl = Array.prototype.map.call(document.querySelectorAll('input[data-id]'), (m) => { return [parseInt(m.dataset.id), m.checked ? 1 : 0, rs.id] });
    // let rs_per = await add_menu_user(menu_sl, rs.id);

    // console.log('Success:', rs);
    // load_user();
    init_users();
};

/// input search name 
async function search_acc() {
    
    var username = $('#username').val();
    if (username.length == 0) {
        // var username = $('#username').val();
        alert('Bạn hãy nhập tên muốn tìm !!');
        return;
    }
    await acc_search(username);
    init_users_byname();
    paginate();
}

async function del_acc(id) {
    if (!confirm('Bạn có chắc chắn muốn XÓa dữ liệu ?')) {
        return;
    }
    await acc_del(id);
    get_user_limit()
    init_users(cr_page,user_number_page);
}

// show history pricing and name pricing
async function init_pricing_history(id) {
    var tb = document.getElementById('tb_pricing_his');
    var p = document.getElementById('pricing');
    tb.innerHTML = '';
    p.innerHTML = '';
    var data = await get_pricing_history(id);
    var data_limit = await get_wrap_pricing_history(id);
    
    if(data_limit) {
        data_limit.forEach(f =>{
            p.innerHTML = `<h5 class="pd_l_15">Sử dụng : ${f.pricing_name} <h5>
            <span class="pd_l_15 font_size15">Lịch sử sẽ tự động xóa sau khi đã quá hạn</span>`
        });
    }
    if (data) {
        data.forEach(f => {
            tb.innerHTML += `<tr><td>${data.indexOf(f) + 1}</td><td>${format_time(f.time)}</td><td>${f.pricing_name}</td></tr>`
        });
    }
    $('#pricing_history_modal').modal('show')
}


async function init_money_history(id) {
    const types = ['Mua gói', 'Nạp']
    var tb = document.getElementById('tb_money_his');
    tb.innerHTML = '';
    var data = await get_money_history(id);
    if (data) {
        data.forEach(f => {
            tb.innerHTML += `<tr>
            <td>${data.indexOf(f) + 1}</td>
            <td>${types[f.type] || ''}</td>
            <td>${(f.type == 0 ? '-' : '+') + (f.money)}</td>
            <td>${format_time(f.time)}</td>
            </tr>`
        });
    }
    $('#money_history').modal('show')
}

async function check_username() {
    var id = $('#user_id').val();
    var user_name = $('#user').val();
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

// 
async function get_user_limit() {
    let urlString = location.href;
    let paramString = urlString.split('?')[1];
    let queryString = new URLSearchParams(paramString);

    for (let pair of queryString.entries()) {
    var key_page = ("Key is: " + pair[0]);
    var page = (pair[1]);
    }
    var user_number_page = 10;
    var each_page = 0;
    if(page != null){
       each_page = page;
    }else{
        each_page = 1;
    }
    var cr_page = (each_page - 1) * user_number_page;
    await paginate(each_page);
    await user_limit(cr_page,user_number_page);
    await init_users(cr_page,user_number_page);
}

// PUSH (user_number_page,cr_page) TO API 
async function user_limit(cr_page,user_number_page){
    return await fetch(`/api/accounts/${cr_page}/${user_number_page}`)
    .then((response) => response.json())
    .then((data) => {
        return data[0];
    })
    .catch((error) => {
        console.warn(error);
        return undefined;
    });
}


// show Lits DATA all
async function init_users(cr_page,user_number_page) {
    main_table.innerHTML = '';
    var dt = await user_limit(cr_page,user_number_page);
    if (dt) {
        dt.forEach(item => {
           var today = new Date().getTime();
           var  date = new Date(item.limit_time).getTime();
           
            // date_number = date.getTime();
            if(Number(date) > Number(today)){
                var  limit_date = format_time(item.limit_time);
            }else if( Number(date) != 0){
                var  limit_date = format_time(item.limit_time) + "(hết hạn)";
            }else{
                var  limit_date = "";
            }
            main_table.innerHTML += `
            <tr>
                <td>${dt.indexOf(item) + 1}</td>    
                <td>${item.username}</td> 
                <td>${get_format_VND(item.money)}</td> 
                <td>${get_format_VND(item.bonus)}</td> 
                <td>${get_format_VND(item.money_month)}</td> 
                <td>${item.real_name}</td>    
                <td>${item.phone}</td>    
                <td>${item.add}</td>
                <td>${limit_date}</td>
                <td>
                    ${button_action_tool(item.id, 'init_pricing_history', ['btn', 'btn-sm', 'btn-primary'], 'Gói DV')}
                    ${button_action_tool(item.id, 'init_money_history', ['btn', 'btn-sm', 'btn-primary'], 'LS Tiền')}
                    ${button_action_tool(item.id, 'open_modal', ['btn', 'btn-sm', 'btn-primary'], 'edit')}
                    ${button_action_tool(item.id, 'del_acc', ['btn', 'btn-sm', 'btn-danger'], 'delete')}
                </td>
            </tr>
        `;
        });
    }
    // paginate(each_page);
}

/// Cearte  Page Paginate
async function paginate(each_page){
    var name = document.getElementById('username').value;
    var user_some_list = await acc_get_all();
    var page = document.getElementById('paginate');
    page.innerHTML ="";
     
    if (name.length == 0){
        // Create Redirect Back
        if (Number(each_page) > 1) {
            page.innerHTML += `<a class="font_size24" href="/home/users?page=${Number(each_page) -1 }"> << back </a>`;
        }
        var user_count =  Object.keys(user_some_list).length;
        var user_page = Math.ceil(Number(user_count) / 10);
        //  Number mid 
            page.innerHTML += `<span class="font_size24">  ${each_page}  </span>`;

        // Create Redirect Next
        if (Number(each_page) < Number(user_page)) {
            page.innerHTML += `<a class="font_size24" href="/home/users?page=${1 + Number(each_page) }"> next >></a>`;
        }
        return;
    }else{
        page.innerHTML ="";
        return;
    }
     
     // Create Redirect Back
    // if (Number(each_page) > 1) {
    //     page.innerHTML += `<a class="font_size24" href="/home/users?page=${Number(each_page) -1 }"> << back </a>`;
    // }
    // var user_count =  Object.keys(user_some_list).length;
    // var user_page = Math.ceil(Number(user_count) / 10);
    //  Number mid 
        // page.innerHTML += `<span class="font_size24">  ${each_page}  </span>`;

    // Create Redirect Next
    // if (Number(each_page) < Number(user_page)) {
    //     page.innerHTML += `<a class="font_size24" href="/home/users?page=${1 + Number(each_page) }"> next >></a>`;
    // }
    // alert(user_page);
}
