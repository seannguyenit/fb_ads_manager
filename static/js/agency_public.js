'use strict'

init_agency_public();

async function init_agency_public() {
    let cr_info = await get_cr_agency_info();
    if (cr_info) {
        $('#link_ref').val(`http://tool264.com/register?ref=${info.ref || ''}`);
        $('#lb_stt').text(get_lb_stt(cr_info));
        get_lb_btn(cr_info);
    }
}

function get_lb_stt(info) {
    var lb = 'Chưa đăng ký';
    if (info.agency_time) {
        if (info.is_agency == 1) {
            lb = 'Đã là đại lý !'
        } else {
            lb = 'Đang chờ xét duyệt !'
        }
    }
    return lb;
}

function get_lb_btn(info) {
    if (info.agency_time) {
        if (info.is_agency != null) {
            document.getElementById('btn_reg').style.enabled = 'false';
            if(info.is_agency == 0){
                document.getElementById('btn_reg').innerText = 'Đang chờ xét duyệt !'
            }else{
                document.getElementById('btn_reg').innerText = 'Đã là đại lý !'
            }
        }
    }
}

async function get_cr_agency_info() {
    var cr_u = get_cr_user();
    await fetch(`/api/agency/${cr_u.id}`, {
        method: 'GET', // or 'PUT'
    })
        .then(response => response.json())
        .then(r => {
            return r[0];
        })
        .catch(error => {
            console.log('Error:', error);
        });
}

async function agency_register() {
    if (!confirm(`Bạn có chắc chắn muốn đăng ký làm đại lý ?`)) {
        return;
    }
    var cr_u = get_cr_user();
    if (cr_u) {
        await fetch(`/api/agency/${cr_u.id}`, {
            method: 'PUT', // or 'PUT'
        })
            .then(response => response.text())
            .then(r => {
                alert('Đăng ký thành công ! Vui lòng chờ quản trị viên xét duyệt !')
                return r;
            })
            .catch(error => {
                console.log('Error:', error);
            });
    }
}