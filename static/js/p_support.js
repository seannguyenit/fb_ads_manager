'use strict'
menu_contacst();
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

async function menu_contacst() {
    var data = await get_admin_contacts();
        if (data) {
            data.forEach(f => {
                document.getElementById("phone_admin").innerHTML = `
               ${f.phone} (Vui lòng gửi tin nhắn)`;
                document.getElementById("email_admin").innerHTML = `
                ${f.email}`;
                document.getElementById("facebook_admin").innerHTML = `
                <a href="${f.facebook}" target="blank">Facebook</a>`;
                document.getElementById("zalo_admin").innerHTML = `
                <a href="${f.zalo}" target="blank">Zalo</a>`;
            })
        }
}