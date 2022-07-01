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
                document.getElementById('token_mbbank').value = `${f.token}`
                document.getElementById('account_mbbank').value = `${f.account}`
                document.getElementById('pass_mbbank').value = `${f.password}`
            }
            if(Number(f.type) === 2){
                document.getElementById('token_acbbank').value = `${f.token}`
                document.getElementById('account_acbbank').value = `${f.account}`
                document.getElementById('pass_acbbank').value = `${f.password}`
            }
            if(Number(f.type) === 3){
                document.getElementById('token_momo').value = `${f.token}`
            }
           
        })
    }
}

// modal Show admin_mbbank
async function open_modal_admin_mbbank(){
    var data = await get_admin_bank();
    if (data) {
        data.forEach(f => {
            if(Number(f.type) === 1){
            document.getElementById('detail_token_mbbank').value = `${f.token}`
            document.getElementById('detail_account_mbbank').value = `${f.account}`
            document.getElementById('detail_pass_mbbank').value = `${f.password}`
            }
        })
    }
    $('#mb_table').modal('show')
}

// modal Show admin_acbbank
async function open_modal_admin_acbbank(){
    var data = await get_admin_bank();
    if (data) {
        data.forEach(f => {
            if(Number(f.type) === 2){
            document.getElementById('detail_token_acbbank').value = `${f.token}`
            document.getElementById('detail_account_acbbank').value = `${f.account}`
            document.getElementById('detail_pass_acbbank').value = `${f.password}`
            }
        })
    }
    $('#acb_table').modal('show')
}

// modal Show admin_momo
async function open_modal_admin_momo(){
    var data = await get_admin_bank();
    if (data) {
        data.forEach(f => {
            if(Number(f.type) === 3){
            document.getElementById('detail_token_momo').value = `${f.token}`
            }
        })
    }
    $('#momo_table').modal('show')
}

// Update data mbbank
async function save_admin_mbbank(){
    if (!confirm('Bạn có chắc chắn muốn thay đổi dữ liệu ?')) {
        return;
    }
    if (!validate_()) return;
    var token = $("#detail_token_mbbank").val();
    var account = $("#detail_account_mbbank").val();
    var password = $("#detail_pass_mbbank").val();

    var url = `/api/admin_bank`;
    var meth = 'POST';
    const formData = new FormData();

    var data = {token: token, account: account, password: password,type:1};

    let rs = await admin_bank_save(url, data, meth);
    init();
}

// Update data acbbank
async function save_admin_acbbank(){
    if (!confirm('Bạn có chắc chắn muốn thay đổi dữ liệu ?')) {
        return;
    }
    if (!validate_()) return;
    var token = $("#detail_token_acbbank").val();
    var account = $("#detail_account_acbbank").val();
    var password = $("#detail_pass_acbbank").val();

    var url = `/api/admin_bank`;
    var meth = 'POST';
    const formData = new FormData();

    var data = {token: token, account: account, password: password,type:2};

    let rs = await admin_bank_save(url, data, meth);
    init();
}

// Update data momo
async function save_admin_momo(){
    if (!confirm('Bạn có chắc chắn muốn thay đổi dữ liệu ?')) {
        return;
    }
    if (!validate_()) return;
    var token = $("#detail_token_momo").val();

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
        })
    }
   
}

// modal Show admin_contacts
async function open_modal_admin_contact(){
    var data = await get_admin_contacts();
    if (data) {
        data.forEach(f => {
            document.getElementById('detail_name_admin').value = `${f.name}`
            document.getElementById('detail_sdt_admim').value = `${f.phone}`
            document.getElementById('detail_email_admin').value = `${f.email}`
            document.getElementById('detail_link_fb').value = `${f.facebook}`
            document.getElementById('detail_link_zl').value = `${f.zalo}`
        })
    }
    $('#money_table').modal('show');
}

// Update data
async function save_admin_contacts(){
    if (!confirm('Bạn có chắc chắn muốn thay đổi dữ liệu ?')) {
        return;
    }
    if (!validate_()) return;
    var name = $("#detail_name_admin").val();
    var phone = $("#detail_sdt_admim").val();
    var email = $("#detail_email_admin").val();
    var facebook = $("#detail_link_fb").val();
    var zalo = $("#detail_link_zl").val();

    var url = `/api/admin_contacts`;
    var meth = 'POST';
    const formData = new FormData();

    var data = { name: name, phone: phone, email: email, facebook:facebook, zalo:zalo};

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

function move_money_momo() {
    $('#momo_table').modal('hide');
    $('#move_money_momo_table').modal('show');
}