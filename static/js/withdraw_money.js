'use strict'

init_withdraw_money();
show_money_bonus();
show_ticket_money();

///api/money_ticket2
///api/finance

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

// show MoneyBonus  
function show_money_bonus() {
    get_current_finance().then(rs => {
        var cr = document.getElementById('current_bonus');
        let money_bonus = 'Bonus Money : ' + get_format_VND(rs.bonus)  + ' VNĐ';
        cr.innerHTML = `${money_bonus}`;
    })
}

/**
 * show TicketMoney 
 * 
 * onlick(money_bonus) 
 *  */
function show_ticket_money() {
    get_current_finance().then(rs => {
        var crs = document.getElementById('ticket_money');
        let id = get_number_by_id(rs.id);
        crs.innerHTML = `
        <div class="modal fade" id="money_ticket" tabindex="-1" role="dialog" aria-labelledby="money_ticket" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Phiếu rút Tiền</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                </div>
                <div class="modal-body d-flex">
                    <div class="col-md-12">
                        <label for="des" class="form-label">Mã chuyển khoản</label>
                        <input disabled type="text" class="form-control" value="${id}" id="des" required>
                        <label for="" class="form-label">Nhập Tiền</label>
                        <input  type="number" value="0" class="form-control" id="money_withdraw" required>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button onclick="save_ticket2()" type="button" class="btn btn-primary">Save</button>
                </div>
            </div>
        </div>
    </div>
        `;
    })
}

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
        })
    }
    var cr_u = get_cr_user();
    // document.getElementById('des').value = get_number_by_id(cr_u.id);
}

function open_ticket() {

    get_money_history_limit_top_up().then(rs => {
        if (rs == null) {
            $('#money_ticket').modal('show');
        }else{
            if (Number(rs.active) != 1){
                alert('Bạn đã gửi yêu cầu rút tiền hãy chờ xét duyệt . '); 
            }
            else{
                $('#money_ticket').modal('show');}
            }
        }
    )
}

async function save_ticket2() {

    var money = 0;
    var method = 2;
    var withdraw = $('#money_withdraw').val();
    if (Number(withdraw) == 0) {
        alert('hãy nhập số tiền bn muốn rút')
        return;
    }
    var des = $('#des').val();
    var user_id = get_cr_user().id;
    if (money.length == 0 || des.length == 0) {
        alert('Chưa nhập đúng thông tin !')
        return;
    }
     var rs = await ticket_save_({ money: money, method: method, des: des, user_id: user_id, withdraw: withdraw});
    // var rs = await ticket_save_({des:des, user_id:user_id});
        let mess = rs.mess;
        if(mess != null){
            alert(mess);
            return;
        }
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

// GET limit 1 LIST DATA Money_history by id 
async function get_money_history_limit_top_up() {
    var cr_u = get_cr_user();
    if (cr_u) {
        let rs = await fetch(`/api/money_history_topup/${cr_u.id}` /*, options */)
            .then((response) => response.json())
            .then((data) => {
                return data[0];
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