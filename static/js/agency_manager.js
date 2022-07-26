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
            located.innerHTML += `<tr class="table_admin">
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
    // if(Number(rs.length) != 0 ){
    //     document.getElementById('showing').innerHTML = "Showing 1 to "+ rs.length + " of " + rs.length + " entries";
    // }else{
    //     document.getElementById('showing').innerHTML = "";
    // }
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
            located.innerHTML += `<tr class="table_admin">
                    <td>${rs.indexOf(f) + 1}</td>
                    <td>${f.username}</td>
                    <td>${get_format_VND(f.money || 0)}</td>
                    <td>${format_time(f.created_at)}</td>
                    <td>${format_time(f.agency_time)}</td>
                    <td>
                    ${button_action_tool(f.id, 'agency_approved', ['btn', 'btn-sm', 'btn-primary'], '<i class="fa fa-check" aria-hidden="true"></i>')}
                    ${button_action_tool(f.id, 'agency_cancel', ['btn', 'btn-sm', 'btn-danger'], '<i class="fa fa-trash" aria-hidden="true"></i>')}
                    </td>
                </tr>`
        })
    }
    // if(Number(rs.length) != 0 ){
    //     document.getElementById('showing1').innerHTML = "Showing 1 to "+ rs.length + " of " + rs.length + " entries";
    // }else{
    //     document.getElementById('showing1').innerHTML = "";
    // }
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
    var mess = 'Xong !';
    toast_success(mess);
    // alert('Xong !')
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
    // alert('Xong !')
    var mess = 'Xong !';
    toast_success(mess);
    init_agency_manager();
}

// Get contacts all User
// async function get_all_contacts() {
//     return await fetch('/api/contacts' /*, options */)
//         .then((response) => response.json())
//         .then((data) => {
//             return data;
//         })
//         .catch((error) => {
//             console.warn(error);
//             return undefined;
//         });
// }

// //Show Data contacts all User
// async function open_data_contacts() {
//     var data = await get_all_contacts();
//     var placed = document.getElementById('table_data_money');
//     placed.innerHTML = '';
//     if (data) {
//         data.forEach(f => {
//             placed.innerHTML += `
//             <tr>
//                 <td>${f.username}</td>
//                 <td>${f.content}</td>
//                 <td>${new Date(Number(f.time * 1000 || 0)).toLocaleString()}</td>
//                 <td> ${button_action_tool(f.id, 'del_contacts', ['btn', 'btn-sm', 'btn-danger'], 'delete')}</td>
//             </tr>`
//         })
//     }
//     $('#money_table').modal('show')
// }

// async function del_contacts(id){
//     if (!confirm(`Bạn có chắc chắn muốn hủy ?`)) {
//         return;
//     }
//     await contacts_del(id);
//     alert('Xong !')
//     open_data_contacts();
// }

// async function contacts_del(id) {
//     var url = `/api/contacts/${id}`;
//     var meth = 'PUT';
//     return await fetch(url, {
//         method: meth, // or 'PUT'
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         // body: JSON.stringify({ active: false })
//     })
//         .then(response => response.json())
//         .then(result => {
//             return result;
//         })
//         .catch(error => {
//             console.error('Error:', error);
//         });
// }