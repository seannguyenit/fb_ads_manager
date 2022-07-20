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
    var data = await get_admin_contacts();
        if (data) {
            data.forEach(f => {
                if(phone_admin){
                    phone_admin.innerHTML = `
                    ${f.phone} (Vui lòng gửi tin nhắn)`;
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
                
            })
        }
}

function model_pricing(){
    window.location.href = 'pricing';
}

document.getElementById('cover_menu').addEventListener('click', () => {
    close_menu();
})

document.getElementById('menu_control').addEventListener('click', () => {
    let as = document.querySelector('aside');
    if (as.classList.contains('v-navigation-drawer--open')) {
        close_menu();
    } else {
        open_menu();
    }
})


function open_menu() {
    let as = document.querySelector('aside');
    as.classList.replace('v-navigation-drawer--close', 'v-navigation-drawer--open');
    as.style.transform = 'translateX(0%)';
    document.getElementById('cover_menu').style.display = 'block'
}

function close_menu() {
    let as = document.querySelector('aside');
    as.classList.replace('v-navigation-drawer--open', 'v-navigation-drawer--close');
    as.style.transform = 'translateX(-100%)';
    document.getElementById('cover_menu').style.display = 'none'
}