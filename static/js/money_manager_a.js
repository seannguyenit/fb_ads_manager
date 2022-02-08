'use strict'
init_topup_manager()

async function init_topup_manager() {
    init_topup_all();
}

async function init_topup_all() {

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
    let located = document.getElementById('table_data_reg').children[1]
    located.innerHTML = '';
    if (rs) {
        rs.forEach(f => {
            located.innerHTML += `<tr>
                <td>${rs.indexOf(f) + 1}</td>
                <td>${f.username}</td>
                <td>${get_format_VND(f.money || 0)}</td>
                <td>${format_time(f.time)}</td>
                <td>${button_action_tool(f.id, 'topup_approved', ['btn', 'btn-sm', 'btn-primary'], 'Duyệt')}</td>
            </tr>`
        })
    }
}

// async function init_topup_reg() {
//     let url = '/api/topup_reg';
//     let rs = await fetch(url /*, options */)
//         .then((response) => response.json())
//         .then((data) => {
//             return data;
//         })
//         .catch((error) => {
//             console.warn(error);
//             return undefined;
//         });
//     let located = document.getElementById('table_data_reg').children[1]
//     located.innerHTML = '';
//     if (rs) {
//         rs.forEach(f => {
//             located.innerHTML += `<tr>
//                     <td>${rs.indexOf(f) + 1}</td>
//                     <td>${f.username}</td>
//                     <td>${f.total||0}</td>
//                     <td>${format_time(f.created_at)}</td>
//                     <td>${format_time(f.topup_time)}</td>
//                     <td>${button_action_tool(f.id, 'topup_approved', ['btn', 'btn-sm', 'btn-primary'], 'Duyệt')}</td>
//                 </tr>`
//         })
//     }
// }

async function topup_approved(id) {
    if (!confirm(`Bạn có chắc chắn muốn đồng ý ?`)) {
        return;
    }
    var cr_u = get_cr_user();
    if (cr_u) {
        await fetch(`/api/topup_m/${id}`, {
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
    init_topup_manager();
}