'use strict'

init_agency_public();
// show_infor_agency();

async function init_agency_public() {
    let cr_info = await get_cr_agency_info();
    if (cr_info) {
        $('#link_ref').val((!cr_info.ref) ? '' : `http://tool264.com/register?ref=${cr_info.ref}`);
        $('#name_agency').val(cr_info.username);
        $('#id_agency').val("000" + cr_info.is_agency);
        $('#des_agency').val(cr_info.ref);
        document.getElementById('btn_money').disabled = false;
        document.getElementById('created_day').innerHTML = `${new Date(Number(cr_info.agency_time * 1000 || 0)).toLocaleString()}`
        get_lb_stt(cr_info);
        get_lb_btn(cr_info);
        btn_withdraw();
    }

    await get_agency_count();
    await get_agency_child();

}
function btn_withdraw() {
   document.getElementById('btn_withdraw').innerHTML= `<a class="form_control float_left_m btn btn-primary" href="./withdraw" data-lang="Rút_Tiền">â</a> `;
   
}

function get_lb_stt(info) {
    // document.getElementById('lb_stt').innerHTML = `<span data-lang="unregistered">Chưa đăng ký<span>`;
    if (info.agency_time) {
        if (info.is_agency == 1) {
            document.getElementById('lb_stt').innerHTML = `<span data-lang="was_agency">Đã là đại lý !</span>`
        } else {
            document.getElementById('lb_stt').innerHTML = `<span data-lang="waiting_for_review">Đang chờ xét duyệt !<span>`
        }
    }
}

function get_lb_btn(info) {
    if (info.agency_time) {
        if (info.is_agency != null) {
            document.getElementById('btn_reg').disabled = 'true';
            if (info.is_agency == 0) {
                document.getElementById('btn_reg').innerHTML = `<span data-lang="waiting_for_review">Đang chờ xét duyệt<span>`
            } else {
                document.getElementById('btn_reg').innerHTML = `<span data-lang="was_agency">Đã là đại lý</span>`
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
                        <td>
                        ${button_action_tool(it.id, 'open_modal', ['btn', 'btn-sm', 'btn-primary'], '<i class="fa fa-usd" aria-hidden="true"></i>')}
                        </td>
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

// call api show option select email
async function get_user_by_agency_info(id_u) {
    var list_user = document.getElementById('option_user');
    if(list_user.value){
        list_user.innerHTML ="";
    }
    var cr_u = get_cr_user();
    if (cr_u) {
        var rs = await fetch(`/api/user_by_agency/${cr_u.id}`, {
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
            // list_user.innerHTML += `<option selected>---- Chọn email cần chuyển ---</option>`;
            rs.forEach(f => {
                if(id_u != 0) {
                    if(Number(id_u) === Number(f.id)){
                        list_user.innerHTML = `<option selected value="${f.id}">${f.username}</option>`;
                    }
                }
                else{
                    list_user.innerHTML += `<option value="${f.id}">${f.username}</option>`
                }
              
            })
        }
    }
}

async function open_modal(id_u) {
    $('#money_ticket').modal('show');
    await get_user_by_agency_info(id_u);
   
}

// move money to agency => user child
async function save_ticket() {
    if (!confirm('Bạn có chắc chắn muốn lưu dữ liệu ?')) {
        return;
    }
    var cr_u = get_cr_user();
    var agency_id = cr_u.id;
    var user_id = $('#option_user').val();
    var money = $('#money').val();
    if (Number(money) < 10000) {
        alert("Vui lòng chuyển từ 10.000 VNĐ trở lên");
        return;
    }

    var data_agency = ({ user_id: agency_id, money: money });
    var data_user = ({ user_id: user_id, money: money })
    var rs = await ticket_save_({ data_agency: data_agency, data_user: data_user });
    if (rs) {
        alert(rs.mess);
    }

    $('#money_ticket').modal('hide');
}

// move from data api
async function ticket_save_(data) {
    return await fetch('/api/agency_move_money', {
        method: 'POST', // or 'PUT'
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

/// input search name 
async function search_acc() {

    var username = $('#username').val();
    if (username.length == 0) {
        // var username = $('#username').val();
        alert('Bạn hãy nhập tên muốn tìm !!');
        return;
    }
    // await acc_search(username);
    get_agency_bychild(username);
}

// show  lisst data sreach by name child
async function get_agency_bychild(username) {
    document.getElementById('table_dt').innerHTML = '';
    var cr_u = get_cr_user();
    // call  api email_child_search
    var rs = await fetch(`/api/email_child_search/${username}/${cr_u.id}`, {
        method: 'GET', // or 'PUT'
    })
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => {
            console.log('Error:', error);
        });
    if (rs) {
        rs.forEach(it => {
            document.getElementById('table_dt').innerHTML += `
                    <tr>
                        <td>${rs.indexOf(it) + 1}</td>    
                        <td>${it.username}</td>
                        <td>${get_format_VND(it.total || 0)}</td>
                        <td>${format_time(it.created_at)}</td>
                        <td>
                        ${button_action_tool(it.id, 'open_modal', ['btn', 'btn-sm', 'btn-primary'], '<i class="fa fa-usd" aria-hidden="true"></i>')}
                        </td>
                    </tr>
                `;

        });
    }
}
// async function get_cr_agency_info_by_user() {
//     var cr_u = get_cr_user();
//     var rs = await fetch(`/api/infor_agency/${cr_u.id}`, {
//         method: 'GET', // or 'PUT'
//     })
//         .then(response => response.json())
//         .then(r => {
//             return r[0];
//         })
//         .catch(error => {
//             console.log('Error:', error);
//         });
//     return rs;
// }

// async function show_infor_agency(){
//  let rs = await  get_cr_agency_info_by_user();
//  if(rs){
//     alert("ci");
//  }
// }

// show  lisst data sreach by created child
async function search_acc_by_created() {
    document.getElementById('table_dt').innerHTML = '';
    var to = document.getElementById('to_date').value;
    var from = document.getElementById('from_date').value;
    var cr_u = get_cr_user();
    // var time_from1 = new Date(from).getTime()/1000;
    // var time_to1 = new Date(to).getTime()/1000;
    var time_from = from+' 00:00:00';
    var time_to = to+' 23:59:00';
// alert(time_from);
// alert(time_to);

//call to api created_child_search
    var rs = await fetch(`/api/created_child_search/${time_from}/${time_to}/${cr_u.id}` , {
        method: 'GET', // or 'PUT'
    }/*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });

    if (rs) {
        rs.forEach(it => {
        document.getElementById('table_dt').innerHTML += `
            <tr>
                <td>${rs.indexOf(it) + 1}</td>    
                <td>${it.username}</td>
                <td>${get_format_VND(it.total || 0)}</td>
                <td>${format_time(it.created_at)}</td>
            </tr>
            `
        })
    }
}