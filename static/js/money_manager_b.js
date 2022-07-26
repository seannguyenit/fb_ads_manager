'use strict'
var cr_id = 0;

init_withdraw_manager()
// init_date();
async function init_withdraw_manager() {
init_withdraw_all();
// init_date();
}

async function init_date(){
    var to = document.getElementById('to_date').value;
    var from = document.getElementById('from_date').value;
    var date = document.getElementById('date_');
    var time_from = from;
    var time_to = to;
    if(from === ""){
        var now_t = new Date();
        var m = (now_t.getMonth() + 1) < 10 ? `0${now_t.getMonth() + 1}` : (now_t.getMonth() + 1);
        var y = now_t.getFullYear();
        var d = now_t.getDate() - 7;
        if(d <= 0 ){
            m = "0"+(m - 1) 
            d = 30 + d;
        }
        from = `${y}-${m}-${d}`;
        time_from = from;
            // alert(time_from);
            // return
    }
    if(to === ""){
        var now_t = new Date();
        var m = (now_t.getMonth() + 1) < 10 ? `0${now_t.getMonth() + 1}` : (now_t.getMonth() + 1);
        var y = now_t.getFullYear();
        var d = now_t.getDate();
        to = `${y}-${m}-${d}`;
        time_to = to;
    }
    // alert(from);
    // alert(time_to);
     date.innerHTML = `<span>từ ${time_from} đến ${time_to}</span>`;
}

async function init_withdraw_all() {
    init_date();
    var to = document.getElementById('to_date').value;
    var from = document.getElementById('from_date').value;
        // var time_from1 = new Date(from).getTime()/1000;
        // var time_to1 = new Date(to).getTime()/1000;
    var time_from = Number(new Date(from).getTime()/1000);
    var time_to = Number(new Date(to).getTime()/1000);
    if(from === ""){
        var now_t = new Date();
        var m = (now_t.getMonth() + 1) < 10 ? `0${now_t.getMonth() + 1}` : (now_t.getMonth() + 1);
        var y = now_t.getFullYear();
        var d = now_t.getDate() - 7;
        if(Number(d) <= 0 ){
            m = "0"+(m - 1) 
            d = 30 + d;
        }
        from = `${y}-${m}-${d}`;
        time_from = Number(new Date(from).getTime()/1000);
            // alert(time_from);
            // return
    }
    if(to === ""){
        time_to =  Number(new Date().getTime() / 1000);
    }

    let url = `/api/topup_m2/${time_from}/${time_to}`;
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
                located.innerHTML += `<tr  class="table_admin">
                <td>${rs.indexOf(f) + 1}</td>
                <td>${f.username}</td>
                <td>${(f.withdraw || 0) > 0 ? (get_format_VND(f.withdraw || 0)) : 'Chưa nhập'}</td>
                <td>${format_time(f.time)}</td>
                <td>${f.des}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="open_approved(${f.des},${f.id},${f.withdraw})"><i class="fa fa-check" aria-hidden="true"></i></button>
                    <button class="btn btn-sm btn-danger" onclick="topup_cancel(${f.id})"><i class="fa fa-trash" aria-hidden="true"></i></button>
                </td>
               
            </tr>`
        })
    }    
    // if(Number(rs.length) != 0 ){
    //     document.getElementById('showing').innerHTML = "Showing 1 to "+ rs.length + " of " + rs.length + " entries";
    // }
    // else{
    //     document.getElementById('showing').innerHTML = "";
    // }
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