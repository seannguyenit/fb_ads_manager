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
                <div class="pricing_benefit_title">
                    Lợi ích
                </div>
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
