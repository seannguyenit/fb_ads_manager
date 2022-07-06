const api_key = 'dcb530c301ca974aa784087db6da0c89';
var data_;

init_default();
async function init_default() {
    start_loading();
    var url = `https://api.autocard365.com/api/cardrate?apikey=${api_key}`;
    let data = await fetch(
        '/api/fproxy',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url })
        }
    ).then(response => response.json()).then(rs => { return rs });
    if (data && data.Code == 1) {
        data.Data.forEach((fe) => {
            fe.prices = fe.prices.filter(ft => { return ft.price < 200000 });
        });
        data_ = data.Data.sort();
        init_type();
    }
    stop_loading();
}

function init_type() {
    var card_type_place = document.getElementById('card_type_place');
    card_type_place.innerHTML = '';
    if (!data_) return;
    card_type_place.innerHTML +=`<option selected>---- Chọn loại thẻ ---</option>`;
    data_.forEach(f => {
        if (f.status) {
           
            card_type_place.innerHTML +=`<option data-name="${f.name}" ${data_.indexOf(f) == 0 ? 'checked' : ''} name="card_type" id="${f.name}" data_="${f.name}" value="${f.id}">${f.name}</option>`;
            // card_type_place.innerHTML += `<div class="form-check form-check-inline">
            //     <label class="form-check-label">
            //     <input class="form-check-input" onchange="init_card_price()" data-name="${f.name}" type="radio" ${data_.indexOf(f) == 0 ? 'checked' : ''} name="card_type" id="card_type_${data_.indexOf(f) + 1}"
            //     value="${f.id}"> ${f.name}
            //     </label>
            //     </div>`;
            init_card_price();
        }
    });
}

async function init_card_price() {
    var card_price_place = document.getElementById('card_price_place');
    card_price_place.innerHTML = '<option selected>---- Chọn mệnh giá thẻ ---</option>';
    if (!data_) return;
    var card_type =  document.getElementById('card_type_place').querySelector("option:checked").value;
    // console.log(card_type)45
    var prices_obj = data_.find(f => { return Number(f.id) == Number(card_type) });
    if(!prices_obj){
        return;
    }
    var prices = prices_obj.prices;
    // card_price_place.innerHTML +=``;
    if (prices && card_type) {
        prices = prices.sort((a, b) => a.price - b.price);
        prices.forEach(p => {
            if (p.status) {
            card_price_place.innerHTML +=`<option data-rate="${p.rate}"  ${prices.indexOf(p) == 0 ? 'checked' : ''} name="price" id="${p.rate}" data_="${p.rate}" value="${p.price}">Thẻ ${get_format_VND(p.price)} VNĐ (-${p.rate}%) -- Nhận ${get_format_VND((p.price * (100 - p.rate) / 100))} VNĐ</p></option>`;
            //     card_price_place.innerHTML += `<div class="form-check form-check-inline">
            // <label class="form-check-label">
            // <input class="form-check-input" onchange="show_info()" data-rate="${p.rate}" type="radio" ${prices.indexOf(p) == 0 ? 'checked' : ''} name="price" id="price_${prices.indexOf(p) + 1}"
            // value="${p.price}"> ${get_format_VND(p.price)} (-${p.rate}%)
            // </label>
            // </div>`;
            }
        })
    }
    show_info();
}

async function show_info() {
    var real_get = document.getElementById('card_price_place').querySelector("option:checked").value - Math.floor((document.getElementById('card_price_place').querySelector("option:checked").value) / 100) * document.getElementById('card_price_place').querySelector("option:checked").id;
    var places = document.getElementById('text_info').querySelectorAll('span');
    places[0].innerText = document.getElementById('card_type_place').querySelector("option:checked").id;
    places[1].innerText = document.getElementById('card_price_place').querySelector("option:checked").value;
    places[2].innerText = document.getElementById('card_price_place').querySelector("option:checked").id;
    places[3].innerText = get_format_VND(real_get);
}

async function go_money() {
    var t = document.getElementById('text_info').innerText;
    if (!confirm(t + '?')) {
        return;
    }
    var cr_u = get_cr_user();
    if (!cr_u) return;
    start_loading();
    var card_type = document.getElementById('card_type_place').value;
    var card_value = document.getElementById('card_price_place').value;
    var seri = document.getElementById('seri').value;
    var pin = document.getElementById('pin').value;
    if (seri.length === 0 || pin.length === 0) {
        alert('Vui lòng nhập thẻ !');
        return;
    }
    var data = { ApiKey: api_key, Pin: pin, Seri: seri, CardType: card_type, CardValue: card_value, requestid: `${cr_u.id},${Math.floor((new Date()).getTime() / 1000)}` }
    var rs = await fetch(
        '/api/fproxy_post',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: 'http://api.autocard365.com/api/card', data: data })
        }
    ).then(response => response.json())
        .then(result => {
            return result;
        })
        .catch(error => {
            stop_loading();
            console.error('Error:', error);
        });
    if (rs) {
        if (rs.Code == 1) {
            // var money = document.getElementById('card_price_place').querySelector('input:checked').value - Math.floor((document.getElementById('card_price_place').querySelector('input:checked').value) / 100) * document.getElementById('card_price_place').querySelector('input:checked').dataset.rate;
            //var money = document.getElementById('card_price_place').querySelector('input:checked').value - Math.floor((document.getElementById('card_price_place').querySelector('input:checked').value) / 100) * document.getElementById('card_price_place').querySelector('input:checked').dataset.rate;
            var rs_save = await ticket_save_({ money: 0, des: 'Thẻ cào', user_id: cr_u.id, active: 1, task_id: rs.TaskId, type: 1, time: Math.floor((new Date()).getTime() / 1000) });
            stop_loading();
            alert('Thẻ nạp thành công vui lòng chờ 3-5 phút để tiền về tài khoản ! Nếu sau đó tk chưa có tiền vui lòng liên hệ admin !')
        } else {
            if (rs.Message && rs.Message.length > 0) {
                stop_loading();
                alert(rs.Message);
            } else {
                stop_loading();
                alert('Thẻ bị lỗi !')
            }
        }
    } else {
        stop_loading();
        alert('Nạp thất bại ! Thẻ bị lỗi !');
    }
    stop_loading();
}

async function ticket_save_(data) {
    return await fetch('/api/money_success_ticket', {
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

