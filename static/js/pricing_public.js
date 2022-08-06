'use strict'
// show_pricing()
init_default();

async function init_default() {
    const color_pring = [
        '',
        'background: rgba(0, 0, 0, 0) linear-gradient(45deg, rgb(255, 95, 109), rgb(255, 195, 113)) repeat scroll 0% 0%;',
        'background: rgba(0, 0, 0, 0) linear-gradient(45deg, rgb(47, 244, 253), rgb(56, 164, 255)) repeat scroll 0% 0%;',
        'background: rgba(0, 0, 0, 0) linear-gradient(45deg, rgb(55, 166, 250), rgb(170, 18, 210)) repeat scroll 0% 0%;',
        'background: rgba(0, 0, 0, 0) linear-gradient(45deg, rgb(0, 160, 199), rgb(0, 60, 252)) repeat scroll 0% 0%;',
        'background: rgba(0, 0, 0, 0) linear-gradient(45deg, rgb(46, 244, 255), rgb(139, 220, 147)) repeat scroll 0% 0%;',
    ]
    var option_pricing = document.getElementById('option_pricing');
    var place_ = document.getElementById('main_content');
    var btnsave = document.getElementById('btnSave');
    
    place_.innerHTML = '';
    var data = await pricing_get_all();
    if (data) {
        data.forEach(item => {
            //         place_.innerHTML += ` <div class="col-md-4">
            //     <div style="background-color: #fff;box-shadow: rgba(80, 102, 224, 0.08) 0px 5px 15px 5px;margin: 0;
            //     margin-top: 0px;
            //     margin-bottom: 40px;
            //   padding: 0;
            //   border: 0;
            //   outline: none; position: relative;" class="pricing">
            //         <div style="background: rgba(0, 0, 0, 0) linear-gradient(45deg, rgb(55, 166, 250), rgb(170, 18, 210)) repeat scroll 0% 0%;color:white;height: 160px;
            //         width: 100%;" class="pricing_title">
            //         <i class=" pd_r_5 fa fa-shopping-cart" aria-hidden="true"></i>
            //         ${item.name}
            //         </div>

            //         <div class="pricing_benefit">

            //             <div class="pricing_benefit_item">
            //                 <div><i class="fa fa-facebook" aria-hidden="true"></i> <span>${item.limit_fb} </span>FB account</div>
            //                 <div><i class="fa fa-clock-o" aria-hidden="true"></i> <span>${item.limit_day} </span>Ngày</div>
            //                 <div><i class="fa fa-database" aria-hidden="true"></i> <span>${item.limit_request} </span>Request/Ngày</div>
            //             </div>
            //         </div>
            //         <div class="pricing_cost">
            //             ${get_format_VND(item.price)} VNĐ
            //             <br>
            //             <br>
            //         </div>
            //         </div>
            //         <div class="text-center absolute_buy mt-2 mb-2"><button style="border-radius: 25px;" onclick="order_pricing(${item.id},'${item.name}',${item.price},${item.limit_day},${item.level},${item.limit_fb},${item.limit_request})" class="btn btn-primary" data-lang="">  <i class=" pd_r_5 fa fa-shopping-cart" aria-hidden="true"></i></button></div>
            // </div>`;
            // var s = 1;
            // alert(s++);
            // ${item.id},'${item.name}',${item.price},${item.limit_day},${item.level},${item.limit_fb},${item.limit_request}
            option_pricing.innerHTML +=`<option value="${item.id}"> ${item.name} (  ${item.limit_day} <span data-lang="day"> Ngày</span> )</option>`;
            place_.innerHTML += `    
            <div class="my-4 col-sm-6 col-md-4 col-lg-3 col-12">
            <div class="rounded-xl boxShadow-hover c-pointer pos-relative v-card v-sheet theme--light pb-6">
              <div
                style="height: 160px; width: 100%;${color_pring[data.indexOf(item) + 1]}">
                <div class="d-flex justify-center align-center" style="height: 100%;">
                  <h4 class="text-center white--text">
                  ${item.name} (  ${item.limit_day} <span data-lang="day"> Ngày</span> )
                  </h4>
                </div>
              </div>
              <div class="px-4">
                <div class="d-flex justify-center">
                  <p class="mb-0 white--text rounded-xl"
                    style="font-size: 24px; position: relative; top: -25px; background-color: rgb(73, 102, 170); padding: 4px 24px;">
                    ${get_format_VND(item.price)} VNĐ
                  </p>
                </div>
                <div class="d-flex justify-center">
                  <h5 style="color: rgb(88, 108, 155);"><span data-lang="rights.">Quyền Lợi</span></h5>
                </div>
                <div class="d-flex justify-center">
                  <div>
                    <div class="d-flex align-center animation-content mt-2">
                      <div><i aria-hidden="true" class="v-icon notranslate mb-1 fas fa-users theme--light"
                          style="font-size: 14px; color: rgb(60, 138, 205); caret-color: rgb(60, 138, 205);"></i>
                      </div>
                      <div class="ml-3">
                      ${item.limit_day} <span data-lang="day_usage"> ngày dùng</span>
                      </div>
                    </div>
                    <div class="d-flex align-center animation-content mt-2">
                      <div><i aria-hidden="true"
                          class="v-icon notranslate mb-1 fab fa-facebook theme--light"
                          style="font-size: 14px; color: rgb(60, 138, 205); caret-color: rgb(60, 138, 205);"></i>
                      </div>
                      <div class="ml-3">
                      ${item.limit_fb} Facebook Accounts
                      </div>
                       
                    </div>
                    <div class="d-flex align-center animation-content mt-2">
                      <div><i aria-hidden="true"
                          class="v-icon notranslate mb-1 fab fa-facebook theme--light"
                          style="font-size: 14px; color: rgb(60, 138, 205); caret-color: rgb(60, 138, 205);"></i>
                      </div>
                      <div class="ml-3">
                      ${item.limit_request} <span data-lang="request_day"></span>
                      </div>
                       
                    </div>
                    <div class="d-flex align-center animation-content mt-2">
                      <div><i aria-hidden="true"
                          class="v-icon notranslate mb-1 fab fa-facebook theme--light"
                          style="font-size: 14px; color: rgb(60, 138, 205); caret-color: rgb(60, 138, 205);"></i>
                      </div>
                      <div class="ml-3">
                      ${item.limit_request} post / day
                      </div>
                    </div>
                  </div>
                </div>
                <div icon="" class="d-flex justify-center"
                  style="position: absolute; right: 42%; bottom: -20px;"><button onclick="order_pricing(${item.id},'${item.name}',${item.price},${item.limit_day},${item.level},${item.limit_fb},${item.limit_request})" type="button"
                    class="boxShadow rounded-xl v-btn v-btn--is-elevated v-btn--has-bg theme--light v-size--default"
                    style="height: 44px; width: 45px; background-color: rgb(0, 116, 223); border-color: rgb(0, 116, 223); min-width: 42px !important;"><span
                      class="v-btn__content"><i aria-hidden="true"
                        class="v-icon notranslate fas fa-shopping-cart theme--light"
                        style="font-size: 18px; color: rgb(255, 255, 255); caret-color: rgb(255, 255, 255);"></i></span></button>
                </div>
              </div>
            </div>
          </div>
    
    `;

        });
    }
}

async function check_order_pricing(){
    var id_p =  $('#option_pricing').val();
    var data = await pricing_get_all();
    if (data) {
        data.forEach(item => {
            if(Number(item.id) === Number(id_p)){
             order_pricing(item.id,item.name,item.price,item.limit_day,item.level,item.limit_fb,item.limit_request);
            }
        })
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

async function order_pricing(id, name, price, day, level, limit_fb, limit_request) {
    if (!confirm(`Bạn có chắc chắn muốn gia hạn gói ${name} ?`)) {
        return;
    }


    var pricing_active = 1;
    var cr_u = get_cr_user().id;
    var type = 0;
    // var data = await get_pricing_history(cr_u);
    // var add = $("#add").val()
    var rs = await get_wrap_pricing_history(cr_u);
    if (rs) {
        rs.forEach(f => {
            if (Number(f.level) < Number(level)) {
                type = 2;
            } else {
                type = 1;
            }
        })


    }
    var url = `/api/pricing_public`;
    var meth = 'POST';

    var data_pricing = { user_id: cr_u, pricing_id: id, pricing_active: pricing_active, limit_day: day, type: type, level: level, limit_fb: limit_fb, limit_request: limit_request };
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
        toast_error(rs.error);
        // location.reload();
        // alert(rs.error);
    } else {
        // var mess = 'Gia hạn thành công !'
        // toast_success(mess);
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

 function open_modal() {
    $('#pricing_ticket').modal('show');
}