'use strict'
// const https = require('htpps');

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
init_logo();
async function init_logo(){
 var dt = await logo_get_all();
 main_table.innerHTML = '';
 if (dt) {
    dt.forEach(item => {
        if(item.type === 1){
            var action = ` <button onclick="edit_type(${item.id},${item.type})">On</button>`
        }else{
            var action = ` <button onclick="edit_type(${item.id},${item.type})">Off</button>`
        }
            
        main_table.innerHTML += `
            <tr>
                <td>${dt.indexOf(item) + 1}</td>    
                <td>${item.logo_name}</td> 
                <td> <img src="../img/${item.logo_img}" height="100vw" width="200vw" alt="logo tool264.com" /></td>    
                <td>
                    ${action}
                </td>
                    <td>
                        ${button_action_tool(item.id, 'open_modal', ['btn', 'btn-sm', 'btn-primary'], 'edit')}
                        ${button_action_tool(item.id, 'logo_del', ['btn', 'btn-sm', 'btn-danger'], 'delete')}
                    </td>
            </tr>`;
                });                
        }else{
            main_table.innerHTML = 'Không Tìm Thấy Tên Phù Hợp';
        }
}

// Edit type
async function edit_type(id,type){
    var rs = await fetch(`/api/menu_logo/${id}/${type}` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => { 
            console.warn(error);
            return undefined;
        });
        init_logo();
}

// Open mopdal
async function open_modal(params) {

    if (params != 0) {
        // var detail_dt = await acc_get_detail(params);
        // $('#id').val(detail_dt.id || 0);
        // $('#logo_name').val(detail_dt.username || '');
        // $('#logo_img').val(detail_dt.pass || '');
        // $('#type').val(detail_dt.real_name || '');
        // if (detail_dt.id != 0) {
        //     var data_per = await menu_get_current_menu(detail_dt.id);
        //     data_per.forEach(r => {
        //         if (r.stt == 1) {
        //             var sl_per = document.querySelector(`input[data-id="${r.menu_id}"]`);
        //             if (sl_per) {
        //                 sl_per.checked = true;
        //             }
        //         }
        //     });
        // }
    } else {
        $('#id').val(0);
        $('#logo_name').val('');
        $('#logo_img').val('');
        $('#type').val('');

    }
    $('#user_details').modal('show');

}

//
document.querySelector("#logo_img").addEventListener("change", function(){
    const reader = new FileReader();
    
    reader.addEventListener("load",()=>{
        localStorage.setItem("recent-image", reader.result);
    });
    reader.readAsDataURL(this.files[0]);
}) ;
const url_img =  localStorage.getItem("recent-image");
// var mess = document.getElementById("type").value;
// // save_(url_img, "./img/"+1+".jpg");
// alert(mess);

//
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

//
async function save_(){
    // document.querySelector("#logo_img").addEventListener("change", function(){
    //     // const reader = new FileReader();
    //     console.log(this.files);
    // })    
    const url_img =  localStorage.getItem("recent-image");

    if(url_img){
        document.querySelector("#imgs").setAttribute("src",url_img);
    }
    // const fs = require('fs');
    // var fullurrl = url;
    // var localpath = fs.createWriteStream(path);
    // var rs = https.get(fullurrl, (response)=>{
    //     console.log(response);
    //     response.pipe(localpath);
    // })
    if (!confirm('Bạn có chắc chắn muốn thay đổi dữ liệu ?')) {
        return;
    }
    if (!validate_()) return;
    var id = $("#user_id").val();
    var logo_name = $("#logo_name").val();
    var logo_img = "right.jpg";
    var type = document.getElementById("type").value;

    var url = `/api/logo`;
    var meth = 'POST';
    const formData = new FormData();

    if (id != 0) {
        meth = 'PUT';
        url = `/api/logo/${id}`;
    }
    var data = { logo_name: logo_name, logo_img: logo_img, type: type};

    let rs = await acc_save(url, data, meth);
    //add_menu_user
    var menu_sl = Array.prototype.map.call(document.querySelectorAll('input[data-id]'), (m) => { return [parseInt(m.dataset.id), m.checked ? 1 : 0, rs.id] });
    // let rs_per = await add_menu_user(menu_sl, rs.id);

    // console.log('Success:', rs);
    // load_user();
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
