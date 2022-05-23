'use strict'

init_agency_public();

async function init_agency_public() {
    let cr_info = await get_cr_agency_info();
    if (cr_info) {
        $('#link_ref').val((!cr_info.ref) ? '' : `http://tool264.com/register?ref=${cr_info.ref}`);
        $('#lb_stt').text(get_lb_stt(cr_info));
        get_lb_btn(cr_info);
    }
    await get_agency_count();
    await get_agency_child();
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
            document.getElementById('btn_reg').disabled = 'true';
            if (info.is_agency == 0) {
                document.getElementById('btn_reg').innerText = 'Đang chờ xét duyệt !'
            } else {
                document.getElementById('btn_reg').innerText = 'Đã là đại lý !'
            }
        }
    }
}

async function get_cr_agency_info() {
    var cr_u = get_cr_user();
    var rs = await fetch(`/api/agency/${cr_u.id}`, {
        method: 'GET', // or 'PUT'
    })
        .then(response => response.json())
        .then(r => {
            return r[0];
        })
        .catch(error => {
            console.log('Error:', error);
        });
    return rs;
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
    location.reload();
}

async function get_agency_child() {
    document.getElementById('table_dt').innerHTML = '';
    var cr_u = get_cr_user();
    if (cr_u) {
        var rs = await fetch(`/api/agency_child/${cr_u.id}`, {
            method: 'GET', // or 'PUT'
        })
            .then(response => response.json())
            .then(r => {
                return r;
            })
            .catch(error => {
                console.log('Error:', error);
            });
        if (rs && rs.length > 0) {
            rs.forEach(it => {
                document.getElementById('table_dt').innerHTML += `
                    <tr>
                        <td>${rs.indexOf(it) + 1}</td>    
                        <td>${it.username}</td>
                        <td>${get_format_VND(it.total || 0)}</td>
                        <td>${format_time(it.created_at)}</td>
                    </tr>
                `;

            });
        }
    }
}


async function get_agency_count() {
    var cr_u = get_cr_user();
    if (cr_u) {
        var rs = await fetch(`/api/agency_count/${cr_u.id}`, {
            method: 'GET', // or 'PUT'
        })
            .then(response => response.json())
            .then(r => {
                return r;
            })
            .catch(error => {
                console.log('Error:', error);
            });
        if (rs) {
            var arr_e = document.getElementsByClassName('box-agency');
            arr_e[0].children[0].innerText = get_format_VND(rs.topup_money || 0);
            arr_e[1].children[0].innerText = rs.topup_time;
            arr_e[2].children[0].innerText = rs.number_user;
        }
    }
}

// function open_modal() {
//     $('#contacts_ticket').modal('show');
// }

// async function save_ticket() {
//     var cr_u = get_cr_user();
//     var user_id = cr_u.id;
//     var content = $('#contacts').val();
    
//      var rs = await ticket_save_({ user_id: user_id, content: content});
//         alert('Đẫ Gửi Yêu Cầu Thành Công !');
//         $('#contacts_ticket').modal('hide');
// }

// async function ticket_save_(data) {
//     return await fetch('/api/contacts_ticket', {
//         method: 'POST', // or 'PUT'
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data)
//     })
//         .then(response => response.json())
//         .then(data => {
//             if (data != undefined) {
//                 return data || {};
//             }
//         })
//         .catch(error => {
//             console.error('Error:', error);
//         });
// }