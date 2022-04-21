'use strict'
init_agency_manager()

async function init_agency_manager() {
    init_agency_reg();
    init_agency_all();
    cr_month();
}

async function init_agency_all() {

    let url = '/api/agency';
    let rs = await fetch(url /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data[0];
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
    let located = document.getElementById('table_data').children[1]
    located.innerHTML = '';
    if (rs) {
        rs.forEach(f => {
            located.innerHTML += `<tr>
                <td>${rs.indexOf(f) + 1}</td>
                <td>${f.username}</td>
                <td>${get_format_VND(f.total_user || 0)}</td>
                <td>${get_format_VND(f.total_money || 0)}</td>
                <td>${get_format_VND(f.total_bonus || 0)}</td>
                <td>${get_format_VND(f.total_month || 0)}</td>
                <td>${format_time(f.agency_time)}</td>
            </tr>`
        })
    }
    if(Number(rs.length) != 0 ){
        document.getElementById('showing').innerHTML = "Showing 1 to "+ rs.length + " of " + rs.length + " entries";
    }else{
        document.getElementById('showing').innerHTML = "";
    }
}

async function init_agency_reg() {
    let url = '/api/agency_reg';
    let rs = await fetch(url /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
    let located = document.getElementById('table_data_reg').children[1]
    located.innerHTML = '';
    if (rs) {
        rs.forEach(f => {
            located.innerHTML += `<tr>
                    <td>${rs.indexOf(f) + 1}</td>
                    <td>${f.username}</td>
                    <td>${get_format_VND(f.money || 0)}</td>
                    <td>${format_time(f.created_at)}</td>
                    <td>${format_time(f.agency_time)}</td>
                    <td>
                    ${button_action_tool(f.id, 'agency_approved', ['btn', 'btn-sm', 'btn-primary'], 'Duyệt')}
                    ${button_action_tool(f.id, 'agency_cancel', ['btn', 'btn-sm', 'btn-danger'], 'Hủy')}
                    </td>
                </tr>`
        })
    }
    if(Number(rs.length) != 0 ){
        document.getElementById('showing1').innerHTML = "Showing 1 to "+ rs.length + " of " + rs.length + " entries";
    }else{
        document.getElementById('showing1').innerHTML = "";
    }
}

async function agency_approved(id) {
    if (!confirm(`Bạn có chắc chắn muốn đồng ý ?`)) {
        return;
    }
    var cr_u = get_cr_user();
    if (cr_u) {
        await fetch(`/api/agency_m/${id}`, {
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
    init_agency_manager();
}


async function agency_cancel(id) {
    if (!confirm(`Bạn có chắc chắn muốn hủy ?`)) {
        return;
    }
    var cr_u = get_cr_user();
    if (cr_u) {
        await fetch(`/api/agency_m/cancel/${id}`, {
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
    init_agency_manager();
}

// cr_month
function cr_month(){
    let d = new Date();
    let month = d.getMonth() + 1 ;
   var cr_ = document.getElementById('month_');
   cr_.innerHTML = "Tổng tiền nạp trong tháng " + month;
}

// Get money all User
async function get_all_money() {
    return await fetch(`/api/agency_allmoney` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}

//Show Data money all User
async function open_data_money() {
    var data = await get_all_money();
    var placed = document.getElementById('table_data_money');
    placed.innerHTML = '';
    if (data) {
        data.forEach(f => {
            placed.innerHTML += `
            <tr>
                <td>${get_format_VND(f.all_money)} VNĐ</td>
                <td>${get_format_VND(f.all_month_money)} VNĐ</td>
                <td>${get_format_VND(f.all_bonus)} VNĐ</td>
                <td>${get_format_VND(f.all_withdraw_money)} VNĐ</td>
            </tr>`
        })
    }
    $('#money_table').modal('show')
}