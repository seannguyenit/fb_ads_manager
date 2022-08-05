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
    var phone_admin = document.getElementById("phone_admin");
    var name_admin = document.getElementById("nameadmin");
    var email_admin = document.getElementById("email_admin");
    var facebook_admin =  document.getElementById("facebook_admin");
    var zalo_admin = document.getElementById("zalo_admin");
    var telegram_admin = document.getElementById("telegram_admin");
    var data = await get_admin_contacts();
        if (data) {
            data.forEach(f => {
                if(phone_admin){
                    phone_admin.innerHTML = `
                    ${f.phone} (<span data-lang="sendmessage">(Vui lòng gửi tin nhắn)</span>)`;
                }
               if(email_admin){
                email_admin.innerHTML = `
                ${f.email}`;
               }
                if(facebook_admin){
                    facebook_admin.innerHTML = `
                    <a href="${f.facebook}" target="blank">Facebook</a>`;
                }
                if(zalo_admin){
                    zalo_admin.innerHTML = `
                    <a href="${f.zalo}" target="blank">Zalo</a>`;
                }
                if(name_admin){
                    name_admin.innerHTML=`${f.name}`
                }
                if(telegram_admin){
                    telegram_admin.innerHTML=` <a href="${f.telegram}" target="blank">Telegram</a>`;
                }
                
            })
        }
}

function model_pricing(){
    window.location.href = 'pricing';
}

