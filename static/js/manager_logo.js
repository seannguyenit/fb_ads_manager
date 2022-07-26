'use strict'
// const https = require('htpps');
init_logo();
// call api get list Logo
async function logo_get_all(){
    return await fetch(`/api/menu_logo` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => { 
            console.warn(error);
            return undefined;
        });
}

// show List Logo

async function init_logo(){
 var dt = await logo_get_all();
 main_table.innerHTML = '';
 if (dt) {
    dt.forEach(item => {
        if(Number(item.active) === 1){
            var action = ` <button style="background-color: gray;padding: 5px;
            margin-top: 10px;" onclick="edit_active(${item.id},${item.active})">On</button>`
        }else{
            var action = ` <button style="background-color: gray;padding: 5px;
            margin-top: 10px;" onclick="edit_active(${item.id},${item.active})">Off</button>`
        }
        if(Number(item.type) === 1 ){
            var type = `<span>Main Logo</span>`
        }if(Number(item.type) === 2){
            var type = `<span>Image Login</span>`
        }
        if(Number(item.type) === 3){
            var type = `<span>Loading Page</span>`
        }
            
        main_table.innerHTML += `
            <tr class="table_admin">
                <td>${dt.indexOf(item) + 1}</td>    
                <td>${item.logo_name}</td> 
                <td class="text_center"> <img src="${item.logo_img}" height="100vw" width="200vw" alt="logo tool264.com" /></td> 
                <td>
                    ${action}
                </td>   
                <td>
                    ${type}
                </td>
                    <td >
                        ${button_action_tool(item.id, 'logo_del', ['btn', 'btn-sm', 'btn-danger'], '<i class="fa fa-trash" aria-hidden="true"></i>')}
                    </td>
            </tr>`;
                });                
        }else{
            main_table.innerHTML = 'Không Tìm Thấy Tên Phù Hợp';
        }
}

// Edit type
async function edit_active(id,active){
    var rs = await fetch(`/api/menu_logo/${id}/${active}` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => { 
            console.warn(error);
            return undefined;
        });

        window.location.href = 'm_logo';
}

// Open mopdal
async function open_modal(params) {

    if (params != 0) {

    } else {
        $('#id').val(0);
        $('#logo_name').val('');
        $('#logo_img').val('');
        $('#type').val('');

    }
    $('#user_details').modal('show');

}

async function save_(){
    if (!confirm('Bạn có chắc chắn muốn thay đổi dữ liệu ?')) {
        return;
    }
    if (!validate_()) return;
    var id = $("#user_id").val();
    var logo_name = $("#logo_name").val();
    var logo_img = document.getElementById("logo_img_").files[0];
    var type = document.getElementById("type").value;
    const formData = new FormData();
    if(logo_img){
    formData.append('file', logo_img);
    formData.append('name', logo_name);
    formData.append('active', active);
    formData.append('type', type);
    const options = {
        method: 'POST',
        enctype: 'multipart/form-data',
        body: formData
    };
    var rs =  await fetch('/api/logo', options)
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

    init_logo();
}

//
async function del_logo(id) {
    var url = `/api/menu_logo/${id}`;
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

//
async function logo_del(id) {
    if (!confirm('Bạn có chắc chắn muốn XÓa dữ liệu ?')) {
        return;
    }
    await del_logo(id);
    init_logo();
}
