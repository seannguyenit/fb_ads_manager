'usertric'

// call api get articles
async function articles_get_all() {
    return await fetch(`/api/articles` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}

// show list data articles
async function init_articles(){
    main_table.innerHTML = '';
    var dt = await articles_get_all();
    if (dt) {
        dt.forEach(item => {
            main_table.innerHTML += `
            <tr>
                <td>${dt.indexOf(item) + 1}</td>    
                <td>${item.name}</td>       
                <td maxlength="20">${item.headline}</td>
                <td><span>${item.content}</span></td>
                <td>${new Date(Number(item.time * 1000 || 0)).toLocaleString()}</td>
                <td>
                    ${button_action_tool(item.id, 'open_modal_articles', ['btn', 'btn-sm', 'btn-primary'], 'edit')}
                    ${button_action_tool(item.id, 'del_articles', ['btn', 'btn-sm', 'btn-danger'], 'delete')}
                </td>
            </tr>
        `;
        });
        // smoothy_ui_table();
        if(Number(dt.length) != 0 ){
            showing.innerHTML = "Showing 1 to "+ dt.length + " of " + dt.length + " entries";
        }
        else{
            showing.innerHTML = "";
        }
    }
}

// call api get data articles by id
async function articles_get_detail(id) {
    // var cr_u = get_cr_user();
    return await fetch(`/api/articles/${id}` /*, options */)
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

// show model articles
async function open_modal_articles(params) {
    if (params != 0) {
        var detail_dt = await articles_get_detail(params);
        $('#articles_id').val(detail_dt.id || 0);
        $('#name').val(detail_dt.name || 'Quản Trị Viên');
        $('#headline').val(detail_dt.headline || '');
        $('#content').val(detail_dt.content || '');
    } else {
        $('#articles_id').val(0);
        $('#name').val('Quản Trị Viên');
        $('#headline').val('');
        $('#content').val('');

    }
    $('#articles_details').modal('show');

}

// save data articles
async function save_articles() {
    if (!confirm('Bạn có chắc chắn muốn thay đổi dữ liệu ?')) {
        return;
    }
    if (!validate_()) return;
    var id = $("#articles_id").val()
    var name = $("#name").val()
    var headline = $("#headline").val()
    var content = $("#content").val()
    // alert(content);
    // return;
    var url = `/api/articles`;
    var meth = 'POST';
    // const formData = new FormData();

    if (id != 0) {
        meth = 'PUT';
        url = `/api/articles/${id}`;
    }
    var data = { name: name, headline: headline, content: content};

    let rs = await articles_save(url, data, meth);
    // console.log('Success:', rs);
    // load_user();
    init_articles();
};

// call api chuyển data để insert hay edit
async function articles_save(url, data, meth) {
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

// delete data articles by id
async function del_articles(id) {
    if (!confirm('Bạn có chắc chắn muốn thay đổi dữ liệu ?')) {
        return;
    }
    await articles_del(id);
    // const formData = new FormData();
    // console.log('Success:', rs);
    init_articles();
}

// call api delete articles
async function articles_del(id) {
    var url = `/api/articles/${id}`;
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