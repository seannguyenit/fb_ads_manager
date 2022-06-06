'use strict'
get_user_limit();
update_history();
// init_all_money();
cr_month();

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
async function acc_get_agency() {
    return await fetch(`/api/accounts_agency` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}
async function acc_get_sub_agency() {
    return await fetch(`/api/accounts_sub_agency` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}


// cr_month
function cr_month() {
    let d = new Date();
    let month = d.getMonth() + 1;
    var cr = document.getElementById('month');
    cr.innerHTML = "Tổng nạp tháng " + month;
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
    document.getElementById('table_data').querySelector('tbody').innerHTML = '';
    // var cr = document.getElementById('search_table');
    var name = document.getElementById('username').value;
    var dt = await acc_get_byname(name);
    if (dt) {
        dt.forEach(item => {

            document.getElementById('table_data').querySelector('tbody').innerHTML += `
                <tr>
                    <td>${dt.indexOf(item) + 1}</td>    
                    <td>${item.username}</td> 
                    <td>${get_format_VND(item.money)}</td> 
                    <td>${get_format_VND(item.bonus)}</td> 
                    <td>${get_format_VND(item.money_month)}</td>  
                    <td>${format_time(item.created_at) || ''}</td>  
                    <td>${format_time(item.limit_time) || ''}</td>
                        <td>
                            ${button_action_tool(item.id, 'init_pricing_history', ['btn', 'btn-sm', 'btn-primary'], 'Gói DV')}
                            ${button_action_tool(item.id, 'init_money_history', ['btn', 'btn-sm', 'btn-primary'], 'LS Tiền')}
                            ${button_action_tool(item.id, 'open_modal', ['btn', 'btn-sm', 'btn-primary'], 'edit')}
                            ${button_action_tool(item.id, 'del_acc', ['btn', 'btn-sm', 'btn-danger'], 'delete')}
                        </td>
                </tr>`;
        });
    } else {
        document.getElementById('table_data').querySelector('tbody').innerHTML = 'Không Tìm Thấy Tên Phù Hợp';
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
            var date = new Date(item.limit_time).getTime();
            if (Number(date) != 0 && Number(date) < Number(today)) {
                id = item.id;
                //  alert(id);
                //  await history_update(item.id);
            }
        }
        )
    };
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
//     document.getElementById('table_data').querySelector('tbody').innerHTML = '';
//     var dt = await acc_get_all();
//     if (dt) {
//         dt.forEach(item => {
//             document.getElementById('table_data').querySelector('tbody').innerHTML += `
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
        $('#created_at').val(format_time(detail_dt.created_at) || '');
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
        $('#created_at').val("hôm nay");

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
    var rs_check = await check_username();
    if (!rs_check) {
        alert('email bị trùng !')
        return;
    }

    var url = `/api/accounts`;
    var meth = 'POST';
    const formData = new FormData();

    var data = { username: username, pass: pass, real_name: real_name, phone: '0', add: 'none' };
    if (id != 0) {
        meth = 'PUT';
        url = `/api/accounts/${id}`;
    } else {
        data.created_at = created_at;
    }

    let rs = await acc_save(url, data, meth);
    //add_menu_user
    var menu_sl = Array.prototype.map.call(document.querySelectorAll('input[data-id]'), (m) => { return [parseInt(m.dataset.id), m.checked ? 1 : 0, rs.id] });
    // let rs_per = await add_menu_user(menu_sl, rs.id);

    get_user_limit()
    init_users(cr_page, user_number_page);
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
    var created_at = new Date();
    var rs_check = await check_username();
    if (!rs_check) {
        alert('email bị trùng !')
        return;
    }

    var url = `/api/accounts`;
    var meth = 'POST';
    const formData = new FormData();
    var data = { username: username, pass: pass, real_name: real_name, phone: '0', add: 'none'};

    if (id != 0) {
        meth = 'PUT';
        url = `/api/accounts/${id}`;
    }else{
        data.created_at = created_at;
    }

    let rs = await acc_save(url, data, meth);
    //add_menu_user
    var menu_sl = Array.prototype.map.call(document.querySelectorAll('input[data-id]'), (m) => { return [parseInt(m.dataset.id), m.checked ? 1 : 0, rs.id] });
    // let rs_per = await add_menu_user(menu_sl, rs.id);

    // console.log('Success:', rs);
    // load_user();
    get_user_limit()
    init_users(cr_page, user_number_page);
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
    init_users(cr_page, user_number_page);
}

// show history pricing and name pricing
async function init_pricing_history(id) {
    var tb = document.getElementById('tb_pricing_his');
    var p = document.getElementById('pricing');
    tb.innerHTML = '';
    p.innerHTML = '';
    var data = await get_pricing_history(id);
    var data_limit = await get_wrap_pricing_history(id);
    var place = document.getElementById('wrap_pricing');
    var bt = document.getElementById('save_wrap_pricing');
    place.innerHTML = '';

    var data_pricing = await pricing_get_all();
    if (data_pricing) {
        place.innerHTML += `<option selected value="0">Open this select menu</option>`
        data_pricing.forEach(item => {
            place.innerHTML += `
            <option value="${item.id}">${item.name}</option>`
        });
        bt.innerHTML = `<button type="button"
                    class="btn btn-primary" onclick="save_pricing_(${id})" data-dismiss="modal">Mua</button>`
    }

    if (data_limit) {
        data_limit.forEach(f => {
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
    var bn_money = document.getElementById('save_edit_money');
    bn_money.innerHTML = `<button type="button" style="height: 30px;" class="btn btn-primary" onclick="save_edit_money(${id})"
    data-dismiss="modal">Save</button>`;
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
    if (page != null) {
        each_page = page;
    } else {
        each_page = 1;
    }
    var cr_page = (each_page - 1) * user_number_page;
    await paginate(each_page);
    // await user_limit(cr_page, user_number_page);
    await init_users(cr_page, user_number_page);
}

// PUSH (user_number_page,cr_page) TO API 
async function user_limit(cr_page, user_number_page) {
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
async function init_users(cr_page, user_number_page) {
    let md = document.getElementById('table_data').querySelector('tbody');
    let tu = document.getElementById('total_user');
    let ta = document.getElementById('total_agency');
    let tsa = document.getElementById('total_sub_agency');
    md.innerHTML = '';
    tu.innerHTML = '';
    ta.innerHTML = '';
    tsa.innerHTML = '';
    // total_agency.innerHTML = '';
    var user_list = await acc_get_all();
    var agency_list = await acc_get_agency();
    var sub_agency_list = await acc_get_sub_agency();
    // var sub_agency_list = await acc_get_sub_agency();
    if (user_list) {
        var user = Object.keys(user_list).length;
        total_user.innerHTML = `<h5>${user}</h5>`;

    }
    if (agency_list) {
        var agency = Object.keys(agency_list).length;
        total_agency.innerHTML = `<h5>${agency}</h5>`;
    }
    if (sub_agency_list) {
        var sub_agency = Object.keys(sub_agency_list).length;
        total_sub_agency.innerHTML = `<h5>${sub_agency}</h5>`;
    }
    var dt = await user_limit(cr_page, user_number_page);
    if (dt) {
        dt.forEach(item => {
            var today = new Date().getTime();
            var date = new Date(item.limit_time).getTime();

            // date_number = date.getTime();
            if (Number(date) > Number(today)) {
                var limit_date = format_time(item.limit_time);
            } else if (Number(date) != 0) {
                var limit_date = format_time(item.limit_time) + "(hết hạn)";
                // await history_update(item.id);
            } else {
                var limit_date = "";
            }
            document.getElementById('table_data').querySelector('tbody').innerHTML += `
            <tr>
                <td>${dt.indexOf(item) + 1}</td>    
                <td>${item.username}</td> 
                <td>${get_format_VND(item.money || '')}</td> 
                <td>${get_format_VND(item.bonus || '')}</td> 
                <td>${get_format_VND(item.money_month || '')}</td> 
                <td>${format_time(item.created_at) || ''}</td>  
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
async function paginate(each_page) {
    var name = document.getElementById('username').value;
    var user_some_list = await acc_get_all();
    var page = document.getElementById('paginate');
    page.innerHTML = "";

    if (name.length == 0) {
        // Create Redirect Back
        if (Number(each_page) > 1) {
            page.innerHTML += `<a class="font_size24" href="/home/users?page=${Number(each_page) - 1}"> << back </a>`;
        }
        var user_count = Object.keys(user_some_list).length;
        var user_page = Math.ceil(Number(user_count) / 10);
        //  Number mid 
        page.innerHTML += `<span class="font_size24">  ${each_page}  </span>`;

        // Create Redirect Next
        if (Number(each_page) < Number(user_page)) {
            page.innerHTML += `<a class="font_size24" href="/home/users?page=${1 + Number(each_page)}"> next >></a>`;
        }
        return;
    } else {
        page.innerHTML = "";
        return;
    }
}

// get data list pricing
async function pricing_get_all() {
    return await fetch(`/api/pricing` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}

// save wrap_pricing 
async function save_pricing_(id) {
    var pricing_id = document.getElementById("wrap_pricing").value;
    if (Number(pricing_id) === 0) {
        alert("Hãy chọn gói mà bạn muốn mua");
        return;
    }
    var user_id = id;
    var pricing_active = 1;
    var data = { user_id: user_id, pricing_id: pricing_id, pricing_active: pricing_active };
    var url = `/api/pricing_insert_wrap`;
    var meth = 'POST';

    var rs = await fetch(url, {
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
    get_user_limit()
    // init_users(cr_page, user_number_page);
}

// save edit money 
async function save_edit_money(id) {
    var edit_money = document.getElementById("edit_money").value;
    // var type = 0;
    // if(Number(edit_money) === 1){
    //     type = 1;
    // }else{
    //     type = 0;
    // }
    var money = document.getElementById("_money").value;
    if (Number(money) === 0 || Number(money) === null) {
        alert("Hãy nhận số tiền bạn muốn");
        return;
    }
    if (Number(edit_money) === 0) {
        alert("Hãy chọn trạng thái bạn muốn muốn");
        return;
    }
    var user_id = id;
    var data = { user_id: user_id, money: money, type: edit_money };
    var url = `/api/a_insert_money`;
    var meth = 'POST';

    var rs = await fetch(url, {
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
    if (rs.mess) {
        alert(rs.mess);
        return;
    }
    if (rs.ok = 1) {
        alert("thay đổi tiền thành công")
    }
    get_user_limit()
    // init_users(cr_page, user_number_page);
}

// async function total_user_agency(){
//     // var total_user = document.getElementById('total_user').children[1];
//     total_user.innerHTML = '';
//     // total_agency.innerHTML = '';
//     var user_list = await acc_get_all();
//     if(user_list){
//         var rs = Object.keys(user_list).length;
//         total_user.innerHTML = `<span>${rs} sssss</span>`;
//     }
// }

// Open modal manager Logo
function open_modal_logo() {
    window.location.href = 'm_logo'
}
