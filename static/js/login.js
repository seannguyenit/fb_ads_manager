'use strict'

async function acc_login(user, pass) {
    var url = `/api/login`;
    var data = { user: user, pass: pass };
    return await fetch(url, {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {
            return result;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
async function ip_addres(){
    return await fetch('https://api.ipify.org/?format=json')
    .then((response) => response.json())
    .then((data) => {
        return data;
    })
    .catch((error) => {
        console.warn(error);
        return undefined;
    });
}

async function history_login(id) {
    var ip_addr = await ip_addres();
    var action = "Đăng Nhập";
    return await fetch(`/api/history_login/${id}/${action}/${ip_addr.ip}` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}