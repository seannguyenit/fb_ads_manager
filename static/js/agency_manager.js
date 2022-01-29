'use strict'
init_agency_manager()

async function init_agency_manager() {
    init_agency_reg();
    init_agency_all();
}

async function init_agency_all() {
    var located = document.getElementById('table_data-reg').querySelector('body')
    located.innerHTML = '';
    let url = '/api/agency';
    let rs = await fetch(url /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
    if (rs) {
        rs.forEach(f => {
            located.innerHTML += `<tr>
                <td>${rs.indexOf(f) + 1}</td>
                <td>${f.user}</td>
                <td>${f.total_user}</td>
                <td>${f.total_money}</td>
                <td>${f.total_bonus}</td>
                <td>${f.time}</td>
            </tr>`
        })
    }
}

async function init_agency_reg() {
    var located = document.getElementById('table_data').querySelector('body')
    located.innerHTML = '';
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
    if (rs) {
        rs.forEach(f => {
            located.innerHTML += `<tr>
                    <td>${rs.indexOf(f) + 1}</td>
                    <td>${f.user}</td>
                    <td>${f.total}</td>
                    <td>${f.created_at}</td>
                    <td>${f.reg_at}</td>
                    <td>${button_action_tool(f.id, 'agency_approved', ['btn', 'btn-sm', 'btn-primary'], 'Duyệt')}</td>
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