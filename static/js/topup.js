'use strict'

init_top_up();
init_money();

///api/money_ticket

async function init_top_up() {
    var data = await get_money_top_up();
    var placed = document.getElementById('tb_money_his');
    placed.innerHTML = '';
    if (data) {
        data.forEach(f => {
            placed.innerHTML += `
            <tr>
                <td>${data.indexOf(f) + 1}</td>
                <td>${get_format_VND(f.money)}</td>
                <td>${new Date(Number(f.time * 1000 || 0)).toLocaleString()}</td>
                <td>${(f.active == 1 ? 'Đã duyệt' : 'Chưa duyệt')}</td>
                <td>${get_format_VND(f.withdraw)}</td>
            </tr>`
            //  <td>${(f.time)}</td>
        })
    }
    var cr_u = get_cr_user();
    // document.getElementById('des').value = get_number_by_id(cr_u.id);
    document.getElementById('ticket_number').innerText = get_number_by_id(cr_u.id);
}

function open_ticket() {
    $('#money_ticket').modal('show');
}
async function save_ticket() {
    if (!confirm('Bạn muốn gửi yêu cầu nạp tiền ?')) {
        return;
    }
    var money = 0;
    var method = 1;
    // var money = $('#money').val();
    var cr_u = get_cr_user();
    var des = get_number_by_id(cr_u.id);
    // var des = $('#des').val();
    var user_id = get_cr_user().id;
    if (money.length == 0 || des.length == 0) {
        alert('Chưa nhập đúng thông tin !')
        return;
    }
    var rs = await ticket_save_({ money: money,  method: method, des: des, user_id: user_id});
    // var rs = await ticket_save_({des:des, user_id:user_id});
    alert('Xong !');
    $('#money_ticket').modal('hide');
    init_top_up();
}

// async function save_ticket2() {
    
  
//     // document.getElementById('des').value = get_number_by_id(cr_u.id);
//     var money = 0;
//     var method = 2;
//     // var money = $('#money').val();
//     var des = $('#des').val();

//     var user_id = get_cr_user().id;
//     if (money.length == 0 || des.length == 0) {
//         alert('Chưa nhập đúng thông tin !')
//         return;
//     }
//     var rs = await ticket_save_({ money: money, method: method, des: des, user_id: user_id});
//     // var rs = await ticket_save_({des:des, user_id:user_id});
//     alert('Xong !');
//     // $('#money_ticket').modal('hide');
//     init_top_up();
// }

async function get_money_top_up() {
    var cr_u = get_cr_user();
    if (cr_u) {
        let rs = await fetch(`/api/money_topup/${cr_u.id}` /*, options */)
            .then((response) => response.json())
            .then((data) => {
                return data;
            })
            .catch((error) => {
                console.log(error);
                return undefined;
            });
        return rs;
    }
}


async function ticket_save_(data) {
    return await fetch('/api/money_ticket', {
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

async function get_current_finance() {
    var cr_u = get_cr_user();
    return await fetch(`/api/finance/${cr_u.id}` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data[0];
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}
function init_money() {
            get_current_finance().then(rs => {
                var cr = document.getElementById('cr_money_');
                // let cr_money = get_format_VND(rs.money);
                // <input type="hidden" value="${cr_money}" id="current_money">
                // <a style="color:white">${money_bonus}</a>
                // let money_bonus = '(Bonus : ' + get_format_VND(rs.bonus)  + ' VNĐ)'
                // <a style="color:white" href="/home/user_info">${user_info}</a>
                let user_info = rs.username + ' ( ' + get_format_VND(rs.money) + ' VNĐ )';
                cr.innerHTML = `
                ${user_info}`;
            })
}