'use strict'


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

async function init_users() {
    main_table.innerHTML = '';
    var dt = await acc_get_all();
    if (dt) {
        dt.forEach(item => {
            main_table.innerHTML += `
            <tr>
                <td>${dt.indexOf(item) + 1}</td>    
                <td>${item.username}</td>    
                <td>${item.real_name}</td>    
                <td>${item.phone}</td>    
                <td>${item.add}</td>
                <td>
                    ${button_action_tool(item.id, 'open_modal', ['btn', 'btn-sm', 'btn-primary'], 'edit')}
                    ${button_action_tool(item.id, 'del_acc', ['btn', 'btn-sm', 'btn-danger'], 'delete')}
                </td>
            </tr>
        `;
        });
        smoothy_ui_table();
    }
}
async function open_modal(params) {
    var menu = await menu_get_template();
    var per_place = document.getElementById('permiss_place');
    per_place.innerHTML = '';
    menu.forEach(f => {
        per_place.innerHTML += `<div class="form-check">
                            <input class="form-check-input" data-id="${f.id}" type="checkbox" ${f.stt == 1 ? "checked" : ""}>
                            <label class="form-check-label" for="invalidCheck">
                              ${f.name}
                            </label>
                        </div>`;
    });
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
    let rs_per = await add_menu_user(menu_sl, rs.id);

    // console.log('Success:', rs);
    // load_user();
    init_users();
};

async function del_acc(id) {
    if (!confirm('Bạn có chắc chắn muốn thay đổi dữ liệu ?')) {
        return;
    }
    await acc_del(id);
    // const formData = new FormData();
    // console.log('Success:', rs);
    init_users();
}