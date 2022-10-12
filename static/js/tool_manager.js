'use strict'


/* tool */
async function tool_get_all() {
    return await fetch(`/api/tool` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
            
        });
}

async function tool_get_detail(id) {
    // var cr_u = get_cr_user();
    return await fetch(`/api/tool/${id}` /*, options */)
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

async function tool_save(url, data, meth) {
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


async function tool_del(id) {
    var url = `/api/tool/${id}`;
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

async function init_tool() {
    main_table.innerHTML = '';
    var dt = await tool_get_all();
    if (dt) {
        dt.forEach(item => {
            main_table.innerHTML += `
            <tr class="table_admin">
                <td>${dt.indexOf(item) + 1}</td>    
                <td>${item.name}</td>     
                <td>${item.symbol||''}</td>     
                <td>${item.order}</td>
                <td>
                    ${button_action_tool(item.id, 'open_modal_tool', ['btn', 'btn-sm', 'btn-primary'], '<i class="fa fa-history" aria-hidden="true"></i>')}
                    ${button_action_tool(item.id, 'del_tool', ['btn', 'btn-sm', 'btn-danger'], '<i class="fa fa-trash" aria-hidden="true"></i>')}
                </td>
            </tr>
        `;
        });
        // smoothy_ui_table();
        // if(Number(dt.length) != 0 ){
        //     showing.innerHTML = "Showing 1 to "+ dt.length + " of " + dt.length + " entries";
        // }
        // else{
        //     showing.innerHTML = "";
        // }
    }
}
async function open_modal_tool(params) {
    if (params != 0) {
        var detail_dt = await tool_get_detail(params);
        $('#tool_id').val(detail_dt.id || 0);
        $('#name').val(detail_dt.name || '');
        $('#symbol').val(detail_dt.symbol || '');
        $('#order').val(detail_dt.order || 0);
    } else {
        $('#tool_id').val(0);
        $('#symbol').val('');
        $('#name').val('');
        $('#order').val(0);
    }
    $('#tool_details').modal('show');

}
async function save_tool() {
    if (!confirm('Bạn có chắc chắn muốn thay đổi dữ liệu ?')) {
        return;
    }
    if (!validate_()) return;
    var id = $("#tool_id").val()
    var name = $("#name").val()
    var symbol = $("#symbol").val()
    var order = $("#order").val()

    var url = `/api/tool`;
    var meth = 'POST';
    // const formData = new FormData();

    if (id != 0) {
        meth = 'PUT';
        url = `/api/tool/${id}`;
    }
    var data = { name: name, order: order, symbol: symbol };

    let rs = await tool_save(url, data, meth);
    // console.log('Success:', rs);
    // load_user();
    init_tool();
};

async function del_tool(id) {
    if (!confirm('Bạn có chắc chắn muốn thay đổi dữ liệu ?')) {
        return;
    }
    await tool_del(id);
    // const formData = new FormData();
    // console.log('Success:', rs);
    init_tool();
}


async function get_tool_history(user_id) {
    return await fetch(`/api/tool_public/${user_id}` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}

// Get Data (tool_history join user join tool) Desc limit 1
async function get_wrap_tool_history(user_id) {
    return await fetch(`/api/wrap_tool_public/${user_id}` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}