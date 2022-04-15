'use strict'


/* pricing */
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

async function pricing_get_detail(id) {
    // var cr_u = get_cr_user();
    return await fetch(`/api/pricing/${id}` /*, options */)
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

async function pricing_save(url, data, meth) {
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


async function pricing_del(id) {
    var url = `/api/pricing/${id}`;
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

async function init_pricing() {
    main_table.innerHTML = '';
    var dt = await pricing_get_all();
    if (dt) {
        dt.forEach(item => {
            main_table.innerHTML += `
            <tr>
                <td>${dt.indexOf(item) + 1}</td>    
                <td>${item.name}</td>     
                <td>${get_format_VND(item.price)}</td>    
                <td>${item.limit_fb}</td>
                <td>${item.limit_request}</td>
                <td>${item.limit_day}</td>
                <td>${item.level}</td>
                <td>
                    ${button_action_tool(item.id, 'open_modal_pricing', ['btn', 'btn-sm', 'btn-primary'], 'edit')}
                    ${button_action_tool(item.id, 'del_pricing', ['btn', 'btn-sm', 'btn-danger'], 'delete')}
                </td>
            </tr>
        `;
        });
        smoothy_ui_table();
    }
}
async function open_modal_pricing(params) {
    if (params != 0) {
        var detail_dt = await pricing_get_detail(params);
        $('#pricing_id').val(detail_dt.id || 0);
        $('#name').val(detail_dt.name || '');
        $('#des').val(detail_dt.des || '');
        $('#price').val(detail_dt.price || 0);
        $('#limit_fb').val(detail_dt.limit_fb || 0);
        $('#limit_request').val(detail_dt.limit_request || 0);
        $('#limit_day').val(detail_dt.limit_day || 0);
        $('#level').val(detail_dt.level || 0);
    } else {
        $('#pricing_id').val(0);
        $('#name').val('');
        $('#des').val('');
        $('#price').val(0);
        $('#limit_fb').val(0);
        $('#limit_request').val(0);
        $('#limit_day').val(0);
        $('#level').val(0);

    }
    $('#pricing_details').modal('show');

}
async function save_pricing() {
    if (!confirm('Bạn có chắc chắn muốn thay đổi dữ liệu ?')) {
        return;
    }
    if (!validate_()) return;
    var id = $("#pricing_id").val()
    var name = $("#name").val()
    var price = $("#price").val()
    var des = $("#des").val()
    var limit_fb = $("#limit_fb").val()
    var limit_day = $("#limit_day").val()
    var limit_request = $("#limit_request").val()
    var level = $("#level").val()

    var url = `/api/pricing`;
    var meth = 'POST';
    // const formData = new FormData();

    if (id != 0) {
        meth = 'PUT';
        url = `/api/pricing/${id}`;
    }
    var data = { name: name, price: price, des: des, limit_fb: limit_fb, limit_day: limit_day, level: level, limit_request: limit_request };

    let rs = await pricing_save(url, data, meth);
    // console.log('Success:', rs);
    // load_user();
    init_pricing();
};

async function del_pricing(id) {
    if (!confirm('Bạn có chắc chắn muốn thay đổi dữ liệu ?')) {
        return;
    }
    await pricing_del(id);
    // const formData = new FormData();
    // console.log('Success:', rs);
    init_pricing();
}


async function get_pricing_history(user_id) {
    return await fetch(`/api/pricing_public/${user_id}` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}

// async function get_wrap_pricing_history(user_id) {
//     return await fetch(`/api/wrap_pricing_public/${user_id}` /*, options */)
//         .then((response) => response.json())
//         .then((data) => {
//             return data;
//         })
//         .catch((error) => {
//             console.warn(error);
//             return undefined;
//         });
// }