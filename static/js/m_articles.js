'usertric'

// call api get articles
async function articles_get_all() {
    return await fetch(`/api/articles` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}
function _open_(){
    $('#_table_').modal('show');
}

// show list data articles
async function init_articles(){
    main_table.innerHTML = '';
    main_table_video.innerHTML = '';
    var dt = await articles_get_all();
    // const date = new Date();
    // date.setDate(date.getDate() + 30);
    // alert(date);
    if (dt) {
        dt.forEach(item => {
            if(item.video){
                main_table_video.innerHTML +=` <tr>
                <td>${dt.indexOf(item) + 1}</td>         
                <td maxlength="20">${item.content_video}</td>
                <td><span>${item.video}</span></td>
                <td>${new Date(Number(item.time * 1000 || 0)).toLocaleString()}</td>
                <td>
                    ${button_action_tool(item.id, 'open_modal_video', ['btn', 'btn-sm', 'btn-primary'], '<i class="fa fa-history" aria-hidden="true"></i>')}
                    ${button_action_tool(item.id, 'del_articles', ['btn', 'btn-sm', 'btn-danger'], '<i class="fa fa-trash" aria-hidden="true"></i>')}
                </td>
            </tr>`;
            }else{
                main_table.innerHTML += `
                <tr>
                    <td>${dt.indexOf(item) + 1}</td>    
                    <td>${item.name}</td>       
                    <td maxlength="20">${item.headline}</td>
                    <td><span>${item.content}</span></td>
                    <td>${new Date(Number(item.time * 1000 || 0)).toLocaleString()}</td>
                    <td>
                        ${button_action_tool(item.id, 'open_modal_articles', ['btn', 'btn-sm', 'btn-primary'], '<i class="fa fa-history" aria-hidden="true"></i>')}
                        ${button_action_tool(item.id, 'del_articles', ['btn', 'btn-sm', 'btn-danger'], '<i class="fa fa-trash" aria-hidden="true"></i>')}
                    </td>
                </tr>
            `;
            }
           
        });
        // smoothy_ui_table();
        // if(Number(dt.length) != 0 ){
        //     showing.innerHTML = "Showing 1 to "+ dt.length + " of " + dt.length + " entries";
        // }
        // else{
        //     showing.innerHTML = "";
        // }
    }
}

// call api get data articles by id
async function articles_get_detail(id) {
    // var cr_u = get_cr_user();
    return await fetch(`/api/articles/${id}` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            if (data != undefined) {
                return data || {};
            }
        })
        .catch((error) => {
            console.warn(error);
        });
}

// show model articles
async function open_modal_articles(params) {
    if (params != 0) {
        var detail_dt = await articles_get_detail(params);
        $('#articles_id').val(detail_dt.id || 0);
        $('#name').val(detail_dt.name || 'Quản Trị Viên');
        $('#headline').val(detail_dt.headline || '');
        $('#content').val(detail_dt.content || '');
        $('#video').val(detail_dt.video || '');
    } else {
        $('#articles_id').val(0);
        $('#name').val('Quản Trị Viên');
        $('#headline').val('');
        $('#content').val('');
        $('#video').val('');

    }
    $('#articles_details').modal('show');

}

// show model video
async function open_modal_video(params) {
    if (params != 0) {
        var detail_dt = await articles_get_detail(params);
        $('#articles_id').val(detail_dt.id || 0);
        $('#content_video').val(detail_dt.content_video || '');
        $('#video').val(detail_dt.video || '');
    } else {
        $('#articles_id').val(0);
        $('#content_video').val('');
        $('#video').val('');

    }
    $('#video_details').modal('show');

}

// save data articles
async function save_articles() {
    if (!confirm('Bạn có chắc chắn muốn thay đổi dữ liệu ?')) {
        return;
    }
    if (!validate_()) return;
    var id = $("#articles_id").val()
    var name = $("#name").val()
    var headline = $("#headline").val()
    var content = $("#content").val()
    var content_video = $("#content_video").val()
    var video = $("#video").val()
    // alert(content);
    // return;
    var url = `/api/articles`;
    var meth = 'POST';
    // const formData = new FormData();

    if (id != 0) {
        meth = 'PUT';
        url = `/api/articles/${id}`;
    }
    var data = { name: name, headline: headline, content: content,content_video:content_video,video:video};

    let rs = await articles_save(url, data, meth);
    // console.log('Success:', rs);
    // load_user();
    init_articles();
};

// call api chuyển data để insert hay edit
async function articles_save(url, data, meth) {
    return await fetch(url, {
        method: meth, // or 'PUT'
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

// delete data articles by id
async function del_articles(id) {
    if (!confirm('Bạn có chắc chắn muốn thay đổi dữ liệu ?')) {
        return;
    }
    await articles_del(id);
    // const formData = new FormData();
    // console.log('Success:', rs);
    init_articles();
}

// call api delete articles
async function articles_del(id) {
    var url = `/api/articles/${id}`;
    var meth = 'PUT';
    return await fetch(url, {
        method: meth, // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ active: false })
    })
        .then(response => response.json())
        .then(result => {
            return result;
        })
        .catch(error => {
            console.error('Error:', error);
        });
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