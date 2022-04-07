'use strict'
var cr_id = 0;

init_withdraw_manager()

async function init_withdraw_manager() {
init_withdraw_all();
}

async function init_withdraw_all() {

    let url = '/api/topup_m';
    let rs = await fetch(url /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
    let located = document.getElementById('table_data_reg2').children[1]
    located.innerHTML = '';
    if (rs) {
        rs.forEach(f => {
            if (f.method  != 1) {
                located.innerHTML += `<tr>
                <td>${rs.indexOf(f) + 1}</td>
                <td>${f.username}</td>
                <td>${(f.withdraw || 0) > 0 ? (get_format_VND(f.withdraw || 0)) : 'Chưa nhập'}</td>
                <td>${format_time(f.time)}</td>
                <td>${f.des}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="open_approved(${f.des},${f.id},${f.withdraw})">Duyệt</button>
                    <button class="btn btn-sm btn-danger" onclick="topup_cancel(${f.id})">Hủy</button>
                </td>
               
            </tr>`
            
            }
        })
    }
}

async function open_approved(des,id,withdraw) {
    cr_id = id;
    document.getElementById('des').value = get_number_by_id(des);
    document.getElementById('money').value = withdraw;  
     
    $('#app').modal('show');
}

////////// 
async function withdraw_approved() {
    var id = cr_id;
    var money = document.getElementById('money').value;
    if (money <= 0) {
        alert('Số tiền phải lớn hơn 0 !')
        return;
    }
    if (!confirm(`Bạn có chắc chắn muốn đồng ý ?`)) {
        return;
    }
    var cr_u = get_cr_user();
    if (cr_u) {
        await fetch(`/api/topup2_m/${id}/${money}`, {
            method: 'PUT', // or 'PUT'
        })
            .then(response => response.text())
            .then(r => {
                return r;
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    alert('Xong !')
    location.reload();
}

async function topup_cancel(id) {
    if (!confirm(`Bạn có chắc chắn muốn hủy ?`)) {
        return;
    }
    var cr_u = get_cr_user();
    if (cr_u) {
        await fetch(`/api/topup_m/cancel/${id}`, {
            method: 'POST', // or 'PUT'
        })
            .then(response => response.text())
            .then(r => {
                return r;
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    alert('Xong !')
    location.reload();
}