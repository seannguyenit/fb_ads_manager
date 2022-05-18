'use strict'

// change the password
async function recovery_save(){
    let urlString = location.href;
    let paramString = urlString.split('?')[1];
    let queryString = new URLSearchParams(paramString);

    for (let pair of queryString.entries()) {
    var key_page = ("Key is: " + pair[0]);
    var page = (pair[1]);
    }
    var key_recovery = "";
    if(page != null){
        key_recovery = page;
    }
    var password = document.getElementById('new_pass').value;
    var pass_confirm =document.getElementById('pass_confirm').value;
    if (pass_confirm != password) {
        alert('Mật khẩu xác nhận chưa đúng !')
        return;
    }
    let rs = await fetch('/api/recovery_save', {
        method: 'PUT', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pass: password, key_recovery: key_recovery })
    })
        .then(response => response.json())
        .then(data => {
            return data
        })
        .catch(error => {
            console.error('Error:', error);
        });
    if (rs.error) {
        alert(rs.error);
    } else {
        alert('Đổi mật khẩu thành công ! Quay lại trang đăng nhập !');
        window.location.href = '/login'
    }
}