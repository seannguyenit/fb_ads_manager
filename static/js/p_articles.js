'use strict'

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

// show list data articles
async function init_articles() {
    main_table.innerHTML = '';
    var dt = await articles_get_all();
    if (dt) {
        dt.forEach(item => {
            if(item.video){
                main_table.innerHTML += '';
            }else{
                main_table.innerHTML += `
                <div style=" box-shadow: 0 5px 15px 5px rgb(80 102 224/8%) !important;padding:1vw;" class="mb-3 box_articles">
                    <div class="with100 box-content">
                        <div class="box-left"><img style="border-radius: 50%;" width="50px" height="50px" src="../img/avatar.png" alt=""></div>
                        <div class="box-right"><span style="font-weight:bolder">${item.name}</span> 
                                <p>${new Date(Number(item.time * 1000 || 0)).toLocaleString()}</p>
                        </div>
                    </div>
                    <div class="with100" style="padding:1vw">
                            <h5>${item.headline}</h5>
                            <p>
                            <textarea disabled class="form-control input_user none_from" name="contacts" id="" value="" cols="60" rows="5"
                            >${item.content}</textarea>
                            </p>
                    </div>
                </div                
`;
            }
        
            
        });

    }
}

function open_modal() {
    $('#contacts_ticket').modal('show');
}

async function save_ticket() {
    var cr_u = get_cr_user();
    var user_id = cr_u.id;
    var content = $('#contacts').val();

    var rs = await ticket_save_({ user_id: user_id, content: content });
    alert('Đẫ Gửi Yêu Cầu Thành Công !');
    $('#contacts_ticket').modal('hide');
}

async function ticket_save_(data) {
    return await fetch('/api/contacts_ticket', {
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
