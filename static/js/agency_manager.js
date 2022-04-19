'use strict'
init_agency_manager()

async function init_agency_manager() {
    init_agency_reg();
    init_agency_all();
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