'use strict'

init_default();

async function init_default() {
    var place_ = document.getElementById('main_content');
    place_.innerHTML = '';
    var data = await pricing_get_all();
    if (data) {
        data.forEach(item => {
            place_.innerHTML += ` <div class="col-md-4">
        <div class="pricing">
            <div class="pricing_title">
                ${item.name}
            </div>

            <div class="pricing_benefit">
                
                <div class="pricing_benefit_item">
                    <div><i class="fa fa-facebook" aria-hidden="true"></i> <span>${item.limit_fb} </span>FB account</div>
                    <div><i class="fa fa-clock-o" aria-hidden="true"></i> <span>${item.limit_day} </span>Ngày</div>
                    <div><i class="fa fa-database" aria-hidden="true"></i> <span>${item.limit_request} </span>Request/Ngày</div>
                </div>
            </div>
            <div class="pricing_cost">
                ${get_format_VND(item.price)} VNĐ
            </div>
            </div>
            <div class="text-center mt-2 mb-2"><button onclick="order_pricing(${item.id},'${item.name}')" class="btn btn-primary">Mua ngay</button></div>
    </div>`;
        });
    }
}

async function pricing_get_all() {
    return await fetch(`/api/pricing` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}



async function order_pricing(id, name) {
    if (!confirm(`Bạn có chắc chắn muốn gia hạn gói ${name} ?`)) {
        return;
    }
    var cr_u = get_cr_user().id;
    // var add = $("#add").val()

    var url = `/api/accounts`;
    var meth = 'POST';

    meth = 'POST';
    url = `/api/pricing_public`;
    var data = { user_id: cr_u, pricing_id: id };
    await fetch(url, {
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
    alert('Gia hạn thành công !')
}