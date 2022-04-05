'use strict'

init_withdraw_money();

///api/money_ticket2

async function init_withdraw_money() {
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
            // <td>${get_format_VND(f.withdraw)}</td>
        })
    }
    var cr_u = get_cr_user();
    document.getElementById('des').value = get_number_by_id(cr_u.id);
}

function open_ticket() {
    $('#money_ticket').modal('show');
}

async function save_ticket2() {
    var money = 0;
    var method = 2;
    // if($('#money_withdraw').val() > )
    var withdraw = $('#money_withdraw').val();
    var des = $('#des').val();
    var user_id = get_cr_user().id;
    if (money.length == 0 || des.length == 0) {
        alert('Chưa nhập đúng thông tin !')
        return;
    }
    var rs = await ticket_save_({ money: money, method: method, des: des, user_id: user_id, withdraw: withdraw});
    // var rs = await ticket_save_({des:des, user_id:user_id});
    alert('Xong !');
    $('#money_ticket').modal('hide');
    init_withdraw_money();
}

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
