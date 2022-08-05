'usertric'
init();
function init(){
    open_data_admin_contacts();
    open_data_admin_mbbank();
    
}

// Get infor admin contacts
async function get_admin_contacts() {
    return await fetch('/api/admin_contacts' /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}

// Get infor admin API MBbank
async function get_admin_bank() {
    return await fetch('/api/admin_bank' /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}

// init infor admin MBbank
async function open_data_admin_mbbank() {
    var data = await get_admin_bank();
    if (data) {
        data.forEach(f => {
           
            if(Number(f.type) === 1){
                if(Number(f.action) === 1){
                    var action = ` <button style="background-color: #383d52;padding: 5px;
                    margin-top: 10px;" onclick="edit_active(${f.id},${f.action})">On</button>`
                    document.getElementById('token_mbbank').value = `${f.token}`
                    document.getElementById('account_mbbank').value = `${f.account}`
                    document.getElementById('pass_mbbank').value = `${f.password}`
                    document.getElementById('action_mb').innerHTML =`${action}` 
                    document.getElementById('type_action_mb').innerHTML =`${f.action}`   
                }else{
                    var action = ` <button style="background-color: #383d52 ;   padding: 5px;
                    margin-top: 10px;" onclick="edit_active(${f.id},${f.action})">Off</button>`
                    document.getElementById('action_mb').innerHTML =`${action}`   
                    document.getElementById('type_action_mb').innerHTML =`${f.action}`   
                }
                                
            }
            if(Number(f.type) === 2){
                if(Number(f.action) === 1){
                    var action = ` <button style="background-color: #383d52;    padding: 5px;
                    margin-top: 10px;" onclick="edit_active(${f.id},${f.action})">On</button>`
                    document.getElementById('token_acbbank').value = `${f.token}`
                    document.getElementById('account_acbbank').value = `${f.account}`
                    document.getElementById('pass_acbbank').value = `${f.password}`
                    document.getElementById('action_acb').innerHTML =`${action}`
                    document.getElementById('type_action_acb').innerHTML =`${f.action}`   
                }else{
                    var action = ` <button style="background-color: #383d52;    padding: 5px;
                    margin-top: 10px;" onclick="edit_active(${f.id},${f.action})">Off</button>`
                    document.getElementById('action_acb').innerHTML =`${action}`
                    document.getElementById('type_action_acb').innerHTML =`${f.action}`   
                } 
               
            }
            if(Number(f.type) === 3){
                if(Number(f.action) === 1){
                    var action = ` <button style="background-color: #383d52;    padding: 5px;
                    margin-top: 10px;" onclick="edit_active(${f.id},${f.action})">On</button>`
                    document.getElementById('token_momo').value = `${f.token}`
                    document.getElementById('action_momo').innerHTML =`${action}`
                    document.getElementById('type_action_momo').innerHTML =`${f.action}`   
                }else{
                    var action = ` <button style="background-color: #383d52;    padding: 5px;
                    margin-top: 10px;" onclick="edit_active(${f.id},${f.action})">Off</button>`
                    document.getElementById('action_momo').innerHTML =`${action}`
                    document.getElementById('type_action_momo').innerHTML =`${f.action}`   
                }
               
            }
           
        })
    }
}

async function edit_active(id,action){
    var rs = await fetch(`/api/action_bank/${id}/${action}` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => { 
            console.warn(error);
            return undefined;
        });

        window.location.href = 'config_general';
}

// modal Show admin_mbbank
// async function open_modal_admin_mbbank(){
//     var data = await get_admin_bank();
//     if (data) {
//         data.forEach(f => {
//             if(Number(f.type) === 1 && Number(f.action) === 1 ){
//             document.getElementById('detail_action_mbbank').value = `${f.action}`;
//             document.getElementById('detail_token_mbbank').value = `${f.token}`;
//             document.getElementById('detail_account_mbbank').value = `${f.account}`;
//             document.getElementById('detail_pass_mbbank').value = `${f.password}`;
//             }
//         })
//     }
//     $('#mb_table').modal('show')
// }

// modal Show admin_acbbank
// async function open_modal_admin_acbbank(){
//     var data = await get_admin_bank();
//     if (data) {
//         data.forEach(f => {
//             if(Number(f.type) === 2 && Number(f.action) === 1){
//             document.getElementById('detail_action_acbbank').value = `${f.action}`;
//             document.getElementById('detail_token_acbbank').value = `${f.token}`
//             document.getElementById('detail_account_acbbank').value = `${f.account}`
//             document.getElementById('detail_pass_acbbank').value = `${f.password}`
//             }
//         })
//     }
//     $('#acb_table').modal('show')
// }

// modal Show admin_momo
// async function open_modal_admin_momo(){
//     var data = await get_admin_bank();
//     if (data) {
//         data.forEach(f => {
            
//             if(Number(f.type) === 3 && Number(f.action) === 1){
//             document.getElementById('detail_action_momo').value = `${f.action}`;
//             document.getElementById('detail_token_momo').value = `${f.token}`
           
//             }
//         })
//     }
//     $('#momo_table').modal('show')
// }

// Update data mbbank
async function save_admin_mbbank(){
    if (!confirm('Bạn có chắc chắn muốn thay đổi dữ liệu MB bank ?')) {
        return;
    }
    if(Number($("#type_action_mb").val()) === 0){
        alert("API MBbank không hoạt động");
        return;
    }
    var token = $("#token_mbbank").val();
    var account = $("#account_mbbank").val();
    var password = $("#pass_mbbank").val();

    var url = `/api/admin_bank`;
    var meth = 'POST';
    const formData = new FormData();

    var data = {token: token, account: account, password: password,type:1};

    let rs = await admin_bank_save(url, data, meth);
    init();
}

// Update data acbbank
async function save_admin_acbbank(){
    if (!confirm('Bạn có chắc chắn muốn thay đổi dữ liệu ACB bank?')) {
        return;
    }
    if(Number($("#type_action_acb").val()) === 0){
        alert("API ACBbank không hoạt động");
        return;
    }
    var token = $("#token_acbbank").val();
    var account = $("#account_acbbank").val();
    var password = $("#pass_acbbank").val();

    var url = `/api/admin_bank`;
    var meth = 'POST';
    const formData = new FormData();

    var data = {token: token, account: account, password: password,type:2};

    let rs = await admin_bank_save(url, data, meth);
    init();
}

// Update data momo
async function save_admin_momo(){
    if (!confirm('Bạn có chắc chắn muốn thay đổi dữ liệu MoMo?')) {
        return;
    }
    if(Number($("#type_action_momo").val()) === 0){
        alert("API MoMo không hoạt động");
        return;
    }
    var token = $("#token_momo").val();

    var url = `/api/admin_bank`;
    var meth = 'POST';
    const formData = new FormData();

    var data = {token: token,type:3};

    let rs = await admin_bank_save(url, data, meth);
    init();
}


// call api to update admin_bank
async function admin_bank_save(url, data, meth) {
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

// init infor admin contacts
async function open_data_admin_contacts() {
    var data = await get_admin_contacts();
    if (data) {
        data.forEach(f => {
            document.getElementById('name_admin').value = `${f.name}`
            document.getElementById('sdt_admim').value = `${f.phone}`
            document.getElementById('Email_admin').value = `${f.email}`
            document.getElementById('link_fb').value = `${f.facebook}`
            document.getElementById('link_zl').value = `${f.zalo}`
            document.getElementById('link_telegram').value = `${f.telegram}`
        })
    }
   
}

// modal Show admin_contacts
// async function open_modal_admin_contact(){
//     var data = await get_admin_contacts();
//     if (data) {
//         data.forEach(f => {
//             document.getElementById('detail_name_admin').value = `${f.name}`
//             document.getElementById('detail_sdt_admim').value = `${f.phone}`
//             document.getElementById('detail_email_admin').value = `${f.email}`
//             document.getElementById('detail_link_fb').value = `${f.facebook}`
//             document.getElementById('detail_link_zl').value = `${f.zalo}`
//         })
//     }
//     $('#money_table').modal('show');
// }

// Update data
async function save_admin_contacts(){
    if (!confirm('Bạn có chắc chắn muốn thay đổi dữ liệu hỗ trợ?')) {
        return;
    }
    // if (!validate_()) return;
    var name = $("#name_admin").val();
    var phone = $("#sdt_admim").val();
    var email = $("#Email_admin").val();
    var facebook = $("#link_fb").val();
    var zalo = $("#link_zl").val();
    var telegram = $("#link_telegram").val();

    var url = `/api/admin_contacts`;
    var meth = 'POST';
    const formData = new FormData();

    var data = { name: name, phone: phone, email: email, facebook:facebook, zalo:zalo,telegram:telegram};

    let rs = await admin_contacts_save(url, data, meth);
    init();
}


// call api to update admin_contacts
async function admin_contacts_save(url, data, meth) {
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

// function move_money_momo() {
//     $('#momo_table').modal('hide');
//     $('#move_money_momo_table').modal('show');
// }