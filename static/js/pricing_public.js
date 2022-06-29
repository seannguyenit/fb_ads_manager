'use strict'
// show_pricing()
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
            <i class=" pd_r_5 fa fa-shopping-cart" aria-hidden="true"></i>
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
            <div class="text-center mt-2 mb-2"><button onclick="order_pricing(${item.id},'${item.name}',${item.price},${item.limit_day},${item.level})" class="btn btn-primary" data-lang="buy_now">Mua ngay</button></div>
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

async function acc_get_detail() {
    var cr = get_cr_user();
    return await fetch(`/api/accounts/${cr.id}` /*, options */)
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

async function order_pricing(id, name, price,day,level) {
    if (!confirm(`Bạn có chắc chắn muốn gia hạn gói ${name} ?`)) {
        return;
    }
    

    var pricing_active = 1; 
    var cr_u = get_cr_user().id;
    var type = 0;
    // var data = await get_pricing_history(cr_u);
    // var add = $("#add").val()
    var rs = await get_wrap_pricing_history(cr_u);
    if(rs){
        rs.forEach(f => {
            if(Number(f.level) < Number(level)){
            type = 2;
        }else{
            type = 1;
        }
        })
       
       
    }
    var url = `/api/pricing_public`;
    var meth = 'POST';

    var data_pricing = { user_id: cr_u, pricing_id: id, pricing_active: pricing_active,limit_day:day,type : type};
    var data_money = { user_id: cr_u, money: price };
    var data = { data_money: data_money, data_pricing: data_pricing }
    var rs = await fetch(url, {
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
    if (rs.error) {
        alert(rs.error);
    } else {
        alert('Gia hạn thành công !')
        location.reload();
    }
}

// Get Data (pricing_history join user join pricing) Desc limit 1
async function get_wrap_pricing_history(user_id) {
    return await fetch(`/api/wrap_pricing_public/${user_id}` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}

// show name pricing
// async function show_pricing(){
//     var cr_u = get_cr_user();
//     var data_limit = await get_wrap_pricing_history(cr_u.id);
//     var p = document.getElementById("r_pricing");
//     p.innerHTML = '';
//     if(data_limit) {
//         data_limit.forEach(f =>{
//             p.innerHTML = `<h5 class="pd_l_15">Đang sử dụng : ${f.pricing_name} <h5>`
//         });
//     }
// }

