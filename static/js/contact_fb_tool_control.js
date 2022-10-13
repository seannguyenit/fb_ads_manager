'use strict'

var Tool8_f_l = 1;
var Tool8_cr_card = 1;
// var cr_ads_id;
var Tool8_cr_token;

var Tool8_cr_video = {
    Tool8_cr_video1: null,
    Tool8_cr_video2: null,
    Tool8_cr_video3: null,
    Tool8_cr_video4: null,
    Tool8_cr_video5: null,
    Tool8_cr_video6: null,
    Tool8_cr_video7: null,
    Tool8_cr_video8: null
};

var Tool8_cr_time = new Date().getTime();


async function run_tool8_setup() {
    await Tool8_init_loading();
    await Tool8_init_default();
    await Tool8_check_service();
    // init_loading();
    await run_menu_tool8_inside();
    await Tool8_set_card(1);
    // $(`#Tool8_file-input${num}`).trigger('click');
    $(`#Tool8_nav-setcard1`).trigger('click');
}



async function run_menu_tool8_inside(e) {
    var target = 1;
    if (e) {
        target = Number(e.dataset.target || 1);
    }

    Array.from(document.getElementById('mini-menu-tool8').children).forEach(item => {
        if (Number(item.dataset.target) === target) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    for (let i = 1; i < 5; i++) {
        if (i === target) {
            Array.from(document.querySelectorAll(`[data-group="${i}"]`)).forEach(ele => {
                if (ele.classList.contains('d-flex')) {
                    ele.setAttribute('style', 'display=flex !important;')
                    // ele.style.display = 'flex';
                } else {
                    ele.setAttribute('style', 'display=block !important;')
                }
                Tool8_set_card((i * 2) - 1);
            })
        } else {
            Array.from(document.querySelectorAll(`[data-group="${i}"]`)).forEach(ele => {
                ele.setAttribute('style', 'display: none !important;')
            })
        }
    }

}

async function start_loading_bt() {
    document.getElementById('Tool8_btn_public').parentElement.style.opacity = "0.5";
    document.getElementById('Tool8_loading-element_bt').style.display = "block";
}


async function stop_loading_bt() {
    document.getElementById('Tool8_btn_public').parentElement.style.opacity = "1";
    document.getElementById('Tool8_loading-element_bt').style.display = "none";
}

async function Tool8_init_loading() {
    var text = await get_img_loading();
    var img = ""
    if (text && text[0]) {
        img = text[0].logo_img;
    }
    for (let index = 1; index < 9; index++) {
        if (document.getElementById(`Tool8_loading${index}`)) {
            document.getElementById(`Tool8_loading${index}`).innerHTML += `<div class="absolute_load" id="Tool8_loading${index}-element" style="display:none;"><img src="${img}" style="width: 50px;height: 50px;"/></div>`;
        }
    }
    if (document.getElementById('Tool8_btn_public') && document.getElementById('Tool8_btn_public').parentElement) {
        document.getElementById('Tool8_btn_public').parentElement.innerHTML += `<div class="absolute_load" id="Tool8_loading-element_bt" style="display:none;left:47%;top: 15%;"><img src="${img}" style="width: 50px;height: 50px;"/></div>`;
    }
}

async function Tool8_start_loading(num) {
    document.getElementById(`Tool8_loading${num}`).style.opacity = "0.5";
    document.getElementById(`Tool8_loading${num}-element`).style.display = "block";
}


async function Tool8_stop_loading(num) {
    document.getElementById(`Tool8_loading${num}`).style.opacity = "1";
    document.getElementById(`Tool8_loading${num}-element`).style.display = "none";
}

async function Tool8_check_service() {
    var dt = await Tool8_acc_get_detail();
    var today = new Date().getTime();
    var date = 0;
    if (dt) {
        if (dt.total_day) {
            if (dt.limit_time) {
                const _date = new Date(dt.limit_time);
                _date.setDate(_date.getDate() + dt.total_day);
                date = new Date(_date).getTime();
            } else {
                date = new Date(dt.limit_time_).getTime();
            }
        }
        else {
            date = new Date(dt.limit_time).getTime();
        }

        if (date === 0) {
            toast_error("Mua gói dịch vụ để sử dụng !");
            window.location.href = 'pricing';
        } else if (date <= today) {
            toast_error("Gói dịch vụ đã hết hạn !");
            window.location.href = 'pricing';
        }
    }
}


async function Tool8_get_user_info(token) {
    var url = `https://graph.facebook.com/v15.0/me?access_token=${token}`;

    return await fetch(
        r_url2,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url })
        }
    ).then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}

//fetch("https://graph.facebook.com/v15.0/150960240509430/accounts?limit=2&access_token=EAAPO8P5BZCqsBAHwGbcnj1btjqe6UAMfqbO6XZBLoRj2cVvVU6kVcVCZADrjJgaj3myI9ZCAqJAWCzwo1qQXfSYo6KVGWNCCTPCfZB0qzakZCYt5p8lLOrZC4Bg8DiLb3mU0YnsADKwZBci8ZBGFz8QQ1gnNwIQq3hQmwiUUko7Gcxa9eNp1WbAwSmZAGVn7521RV6KRRmnKx8fQZDZD")

async function Tool8_get_list_page(token, id) {
    var url = `https://graph.facebook.com/v15.0/${id}/accounts?limit=2000&access_token=${token}`;
    return await fetch(
        r_url2,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url })
        }
    )
        .then((response) => response.json())
        .then((data) => {
            return data.data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}

async function Tool8_init_default() {
    // start_loading();
    try {
        // document.getElementById('err_place').style.display = 'none';
        document.getElementById('rs_tb').innerHTML = '';
        Tool8_change_card_element();
        var now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        document.getElementById('schedule_time').value = now.toISOString().substring(0, 16);
        await Tool8_set_combobox_data();
        await Tool8_change_card_element();
    } catch (error) {
        // stop_loading();
    }
    Tool8_f_l = 0;

    // stop_loading();
}

async function Tool8_set_combobox_data() {
    // start_loading();
    // Tool8_cr_video.Tool8_cr_video1 = null;
    // Tool8_cr_video.Tool8_cr_video2 = null;
    await Tool8_load_lib_img(-1);
    var cr_page = get_page_value();
    for (let index = 1; index < 9; index++) {
        document.getElementById(`Tool8_link${index}`).value = `https://www.facebook.com/${cr_page}`;
        document.getElementById(`Tool8_img_${index}`).src = 'https://i.imgur.com/BDJYyka.jpg';
    }
    await Tool8_change_card_element();


}

async function Tool8_load_lib_img(vnum) {
    // var tk = get_token_user();
    var img_p = document.getElementById('Tool8_lib_img');
    img_p.innerHTML = '';
    if (Tool8_cr_video.Tool8_cr_video1 && Tool8_cr_video.Tool8_cr_video1.thumbnails.data) {
        Tool8_cr_video.Tool8_cr_video1.thumbnails.data.forEach(f => {
            img_p.innerHTML += ` <div class="ma-3"><div onclick="Tool8_change_img(this)" data-type="Tool8_video1"><img src="${f.uri}" alt=""
            style="border: 3px solid rgb(52, 152, 219); border-radius: 8px;"
            width="195px"
            height="250px"/></div></div>`;
        });
    }
    if (Tool8_cr_video.Tool8_cr_video2 && Tool8_cr_video.Tool8_cr_video2.thumbnails.data) {
        Tool8_cr_video.Tool8_cr_video2.thumbnails.data.forEach(f => {
            img_p.innerHTML += ` <div class="ma-3"><div onclick="Tool8_change_img(this)" data-type="Tool8_video2"><img src="${f.uri}" alt=""
            style="border: 3px solid rgb(52, 152, 219); border-radius: 8px;"
            width="195px"
            height="250px"/></div></div>`;
        });
    }

    if (Tool8_cr_video.Tool8_cr_video3 && Tool8_cr_video.Tool8_cr_video3.thumbnails.data) {
        Tool8_cr_video.Tool8_cr_video3.thumbnails.data.forEach(f => {
            img_p.innerHTML += ` <div class="ma-3"><div onclick="Tool8_change_img(this)" data-type="Tool8_video3"><img src="${f.uri}" alt=""
            style="border: 3px solid rgb(52, 152, 219); border-radius: 8px;"
            width="195px"
            height="250px"/></div></div>`;
        });
    }

    if (Tool8_cr_video.Tool8_cr_video4 && Tool8_cr_video.Tool8_cr_video4.thumbnails.data) {
        Tool8_cr_video.Tool8_cr_video4.thumbnails.data.forEach(f => {
            img_p.innerHTML += ` <div class="ma-3"><div onclick="Tool8_change_img(this)" data-type="Tool8_video4"><img src="${f.uri}" alt=""
            style="border: 3px solid rgb(52, 152, 219); border-radius: 8px;"
            width="195px"
            height="250px"/></div></div>`;
        });
    }

    if (Tool8_cr_video.Tool8_cr_video5 && Tool8_cr_video.Tool8_cr_video5.thumbnails.data) {
        Tool8_cr_video.Tool8_cr_video5.thumbnails.data.forEach(f => {
            img_p.innerHTML += ` <div class="ma-3"><div onclick="Tool8_change_img(this)" data-type="Tool8_video5"><img src="${f.uri}" alt=""
            style="border: 3px solid rgb(52, 152, 219); border-radius: 8px;"
            width="195px"
            height="250px"/></div></div>`;
        });
    }

    if (Tool8_cr_video.Tool8_cr_video6 && Tool8_cr_video.Tool8_cr_video6.thumbnails.data) {
        Tool8_cr_video.Tool8_cr_video6.thumbnails.data.forEach(f => {
            img_p.innerHTML += ` <div class="ma-3"><div onclick="Tool8_change_img(this)" data-type="Tool8_video6"><img src="${f.uri}" alt=""
            style="border: 3px solid rgb(52, 152, 219); border-radius: 8px;"
            width="195px"
            height="250px"/></div></div>`;
        });
    }

    if (Tool8_cr_video.Tool8_cr_video7 && Tool8_cr_video.Tool8_cr_video7.thumbnails.data) {
        Tool8_cr_video.Tool8_cr_video7.thumbnails.data.forEach(f => {
            img_p.innerHTML += ` <div class="ma-3"><div onclick="Tool8_change_img(this)" data-type="Tool8_video7"><img src="${f.uri}" alt=""
            style="border: 3px solid rgb(52, 152, 219); border-radius: 8px;"
            width="195px"
            height="250px"/></div></div>`;
        });
    }

    if (Tool8_cr_video.Tool8_cr_video8 && Tool8_cr_video.Tool8_cr_video8.thumbnails.data) {
        Tool8_cr_video.Tool8_cr_video8.thumbnails.data.forEach(f => {
            img_p.innerHTML += ` <div class="ma-3"><div onclick="Tool8_change_img(this)" data-type="Tool8_video8"><img src="${f.uri}" alt=""
            style="border: 3px solid rgb(52, 152, 219); border-radius: 8px;"
            width="195px"
            height="250px"/></div></div>`;
        });
    }

    var lst_img = await Tool8_get_img_acc_from_ad(get_token_ads(), get_token_user());
    if (lst_img) {
        lst_img.forEach(im => {
            img_p.innerHTML += ` <div class="ma-3"><div onclick="Tool8_change_img(this)" data-type="Tool8_image"><img src="${im.url}" alt=""
            style="border: 3px solid rgb(52, 152, 219); border-radius: 8px;"
            width="195px"
            height="250px"/></div></div>`;
        });
    }

    if (vnum !== -1) {
        img_p.querySelector(`[data-type="Tool8_video${vnum}"]`).classList.add('active');
        document.getElementById(`Tool8_img_${vnum}`).src = img_p.querySelector(`[data-type="Tool8_video${vnum}"]`).children[0].src
    } else {
        if (img_p.querySelector('[data-type="Tool8_image"]')) {
            img_p.querySelector('[data-type="Tool8_image"]').classList.add('active');
            Tool8_change_img_selected(img_p.querySelector('[data-type="Tool8_image"]'));
        }
    }

}

async function Tool8_change_title(num) {
    var title = document.getElementById(`Tool8_title${num}`).value;
    document.querySelector(`span[data-select="Tool8_review${num}"]`).innerText = title;
}

async function Tool8_change_button(num) {
    var select = $(`#Tool8_list_bts${num} :selected`).val();
    if (select == 'Like Page') {
        document.getElementById(`Tool8_link${num}`).parentElement.style.display = "none";
    } else {
        document.getElementById(`Tool8_link${num}`).parentElement.style.display = "block";
    }
    document.querySelectorAll(`button[data-select="Tool8_review${num}"]`).forEach(f => {
        f.innerText = select;
    });
}
// async function Tool8_change_token_selected() {
//     document.querySelector('span[data-select="review2"]').innerText = $('#list_pages :selected').data('name');
// }
async function Tool8_change_check_schedule() {
    $('#Tool8_schedule_time').prop('disabled', !$('#Tool8_is_schedule').is(':checked'));
}
async function Tool8_change_page_selected() {
    //document.querySelector('span[data-select="Tool8_review2"]').innerText = $('#Tool8_list_pages :selected').data('name');
    var p_id = get_page_value();
    for (let index = 1; index < 9; index++) {
        document.getElementById(`Tool8_link${index}`).value = `https://www.facebook.com/${p_id}`;
    }
}

async function Tool8_change_img(ele) {
    ele.querySelectorAll('[data-type="Tool8_img"]').forEach(e => {
        e.classList.remove('active');
    })
    ele.classList.add('active');
    Tool8_change_img_selected(ele);
    await Tool8_set_card(Tool8_cr_card);
    // $(`#Tool8_file-input${num}`).trigger('click');
    $(`#Tool8_nav-setcard${Tool8_cr_card}`).trigger('click');
}
async function Tool8_change_img_selected(ele) {
    if (!ele) return;
    if (Tool8_cr_card == 1 && Tool8_f_l == 0) {
        document.getElementById('Tool8_img_1').src = ele.querySelector('img').src;
    } else {
        document.getElementById(`Tool8_img_${Tool8_cr_card}`).src = ele.querySelector('img').src;
    }
}

async function Tool8_select_file(num) {
    await Tool8_set_card(num);
    $(`#Tool8_file-input${num}`).trigger('click');
    $(`#Tool8_nav-setcard${num}`).trigger('click');
}

async function Tool8_set_card(number) {
    Tool8_cr_card = number;
    for (let index = 1; index < 9; index++) {
        document.getElementById(`Tool8_nav-setcard${index}`).classList.replace('button-card-active', 'button-card-noactive');
        if (index === number) {
            document.getElementById(`Tool8_nav-setcard${index}`).classList.replace('button-card-noactive', 'button-card-active');
        }
    }
    await Tool8_change_card_element();
}

async function Tool8_change_card_element() {
    //Tool 8 khong can thiet doi theo hinh anh ma hien thi ra luon

    // var lib_ = document.getElementById('Tool8_lib_img').parentElement;
    // var tab_ = document.querySelectorAll('div[data-select="Tool8_card1"]');
    // var img_p = document.getElementById('Tool8_lib_img');
    // var lst_img = img_p.querySelectorAll('[data-type="Tool8_image"]');
    // if (Tool8_cr_card == 1) {
    //     // lib_.style.display = 'none';
    //     lst_img.forEach(f => { f.style.display = "none" });
    //     tab_.forEach(f => { f.style.display = "block" });
    // } else {
    //     // lib_.style.display = 'block';
    //     lst_img.forEach(f => { f.style.display = "block" });
    //     tab_.forEach(f => { f.style.display = "none" });
    // }
}

async function Tool8_PreviewImage(num) {
    console.log(num);
    Tool8_start_loading(num);
    try {
        var oFReader = new FileReader();
        oFReader.readAsDataURL(document.getElementById(`Tool8_file-input${num}`).files[0]);
        var s = Math.round(document.getElementById(`Tool8_file-input${num}`).files[0].size);
        if (s >= 100 * 1024 * 1024) {
            Tool8_stop_loading(num);
            mess_error('file bạn chọn vướt quá 100MB, load lại trang để tiếp tục !');
            toast_error('file bạn chọn vướt quá 100MB, load lại trang để tiếp tục !');
            return;
        }
        oFReader.onload = function (oFREvent) {
            // document.getElementById("img_1").src = oFREvent.target.result;
        };
        var new_obj = await Tool8_upload_and_return_url(document.getElementById(`Tool8_file-input${num}`), get_token_ads(), get_token_user(), num);
        if (new_obj) {
            document.getElementById(`Tool8_img_${num}`).src = new_obj.images[document.getElementById(`Tool8_file-input${num}`).files[0].name].url
            document.getElementById(`Tool8_img_${num}`).dataset.hash = new_obj.images[document.getElementById(`Tool8_file-input${num}`).files[0].name].hash
        }
        // console.log(new_obj);
    } catch (error) {
        Tool8_stop_loading(num);
    }

    Tool8_stop_loading(num);
};

async function Tool8_get_all_token() {
    var cr_u = await get_cr_user();
    return await fetch(`/api/token_fb/${cr_u.id}` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}

async function Tool8_get_pages_from_fb(token) {
    const url = `https://graph.facebook.com/v15.0/me/accounts?fields=access_token,id,name,picture&limit=1000&access_token=${token}`;
    return await fetch(
        r_url2,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url })
        }
    )
        .then((response) => response.json())
        .then((data) => {
            return data.data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}


async function Tool8_get_ads_acc_from_fb(token) {
    const url = `https://graph.facebook.com/v15.0/me/adaccounts?access_token=${token}`;
    return await fetch(
        r_url2,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url })
        }
    )
        .then((response) => response.json())
        .then((data) => {
            return data.data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}

async function Tool8_get_img_acc_from_ad(id, token) {
    const url = `https://graph.facebook.com/v15.0/act_${id}/adimages?access_token=${token}&fields=hash,url`;
    var rs = await fetch(
        r_url2,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url })
        }
    )
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
    if (rs.error) {
        if (rs.error.message) {
            toast_error(rs.error.message);
        } else {
            toast_error('Lỗi phần quyền trên page hoặc trên tk quản cáo !')
            // stop_loading();
        }
        return null;
    }
    return rs.data;
}

async function Tool8_upload_and_return_url(file_element, ads_id, token, card) {
    if (!file_element || !ads_id || !token) {
        toast_error('Chưa đầy đủ thông tin !');
        return;
    }
    // start_loading();
    const fileInput = file_element;
    const formData = new FormData();

    if (fileInput.files[0].type.includes('image') == true) {
        formData.append('file', fileInput.files[0]);


        var url = `https://graph.facebook.com/v15.0/act_${ads_id}/adimages?_app=ADS_MANAGER&_reqName=path:/act_${ads_id}/adimages&access_token=${token}`;
        formData.append('url', url);

        const options = {
            method: 'POST',
            enctype: 'multipart/form-data',
            body: formData
        };

        return await fetch('/api/fb/video', options)
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
    if (fileInput.files[0].type.includes('video') == true) {
        formData.append('file', fileInput.files[0]);

        var url_fb = `https://graph.facebook.com/v15.0/act_${ads_id}/advideos?access_token=${token}`;
        formData.append('url', url_fb)

        const options = {
            method: 'POST',
            enctype: 'multipart/form-data',
            body: formData
        };

        var vd_rs = await fetch('/api/fb/video', options)
            .then(response => response.json())
            .then(data => {
                return data;
            })
            .catch(error => {
                console.error('Error:', error);
            });

        if (vd_rs) {
            if (vd_rs.error) {
                toast_error((vd_rs.error.message) || 'Lỗi phân quyền trên page');
            } else {
                var new_id = vd_rs.id;
                if (new_id) {
                    var thumbnails_details = await Tool8_get_thumbnails_video(new_id);
                    Tool8_cr_video[`Tool8_cr_video${card}`] = thumbnails_details;
                    Tool8_load_lib_img(card)
                } else {
                    toast_error('Không up được video ! Kiểm tra đường truyền mạng hoặc phân quyền trên page ! Vui lòng tải lại (refresh) trang !')
                }
            }
        }
    }

}


async function Tool8_get_thumbnails_video(vid) {
    var token = get_page_token();
    var url = `https://graph.facebook.com/v15.0/${vid}?access_token=${token}&fields=["captions","description","id","length","spherical","thumbnails","title","updated_time","live_status"]`;
    //thumbnails
    var dt_rs = await Tool8_get_thumbnails_from_api(url);
    var count = 0;
    while ((!dt_rs.thumbnails) || ((dt_rs.thumbnails.data || []).length < 2 && count < 17)) {
        let w = await Tool8_waitingForNext(3000);
        dt_rs = await Tool8_get_thumbnails_from_api(url);
        count++;
    }
    return dt_rs;
}


async function Tool8_get_thumbnails_from_api(url) {
    return await fetch(
        r_url2,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url })
        }
    )
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}

async function Tool8_public_data() {
    var ads_id = get_token_ads();
    var data = Tool8_get_param_err();
    if (!data) {
        return;
    }
    var url = `https://graph.facebook.com/v15.0/act_${ads_id}/adcreatives`;

    let rs = await fetch(
        r_url,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url, data: data })
        }
    )
        .then(response => response.json())
        .then(d => {
            return d;
        })
        .catch(error => {
            console.error('Error:', error);
            // stop_loading();
        });
    return rs;
}


async function Tool8_get_step2(id) {
    // var token = get_token_user();
    var token = get_page_token();
    var url = `https://graph.facebook.com/v15.0/${id}?access_token=${token}&fields=effective_object_story_id`;
    return await fetch(
        r_url2,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url })
        }
    ).then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.warn(error);
            // stop_loading();
            return undefined;
        });
}


// async function Tool8_option_step3(op) {
//     // var token = get_token_user();
//     // var ads_id = get_token_ads();

//     var url = `${r_url}https://graph.facebook.com/v15.0/${op}`;
//     return await fetch(url, {
//         method: 'OPTIONS', // or 'PUT'
//     })
//         .then(response => response.text())
//         .then(r => {
//             return r;
//         })
//         .catch(error => {
//             stop_loading();
//             console.error('Error:', error);
//         });
// }


async function Tool8_post_step3(op) {
    var token = get_page_token();
    // var ads_id = get_token_ads();
    var data = { "access_token": token, "is_published": true }
    if ($('#Tool8_is_schedule').is(':checked') == true) {
        var timesta = Math.floor((new Date(document.getElementById('Tool8_schedule_time').value)).getTime() / 1000);
        console.log(timesta);
        data = { "access_token": token, "scheduled_publish_time": Number(timesta) }
    }
    var url = `https://graph.facebook.com/v15.0/${op}`;
    return await fetch(
        r_url,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url, data: data })
        }
    )
        .then(response => response.json())
        .then(d => {
            return d
        })
        .catch(error => {
            console.error('Error:', error);
            // stop_loading();
        });
}

async function Tool8_post_step3_pro5(op) {
    var token = get_page_token();
    // var ads_id = get_token_ads();
    var data = { "access_token": token, "is_published": true }
    if ($('#Tool8_is_schedule').is(':checked') == true) {
        var timesta = Math.floor((new Date(document.getElementById('Tool8_schedule_time').value)).getTime() / 1000);
        data = { "access_token": token, "scheduled_publish_time": Number(timesta) }
    }
    var url = `${r_url2}https://graph.facebook.com/v15.0/${op}`;
    return await fetch(
        r_url,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url, data: data })
        }
    )
        .then(response => response.json())
        .then(d => {
            return d
        })
        .catch(error => {
            console.error('Error:', error);
            // stop_loading();
        });
}


async function Tool8_run_public() {
    if (!confirm('Bạn có chắc chắn muốn public ?')) {
        return;
    }
    // document.getElementById('err_place').style.display = 'none';
    start_loading_bt();
    var check_request = await Tool8_start_request();
    if (!check_request) {
        return;
    }
    var rs = await Tool8_public_data();
    if (rs) {
        if (!rs.error) {
            let w = await Tool8_waitingForNext(5000);
            var s2 = await Tool8_get_step2(rs.id)
            console.log(s2);
            var co = 0;
            while ((!s2.effective_object_story_id) && co < 10) {
                let wfn = await Tool8_waitingForNext(10000);
                s2 = await Tool8_get_step2(rs.id)
                co++;
            }
            if (s2.effective_object_story_id) {
                try {
                    // var op = await Tool8_option_step3(s2.effective_object_story_id);
                    var s3 = await Tool8_post_step3(s2.effective_object_story_id);
                    if (s3.error) {
                        s3 = await Tool8_post_step3_pro5(s2.effective_object_story_id);
                        if (s3.error) {
                            //doi voi pro5 thi khong can cap nhat public
                            if (s3.error.code == 10) {
                                await Tool8_after_public(s2, check_request);
                            } else {
                                await Tool8_end_request(0, check_request.time);
                            }
                        }
                    } else {
                        await Tool8_after_public(s2, check_request);
                    }
                } catch (error) {
                    stop_loading_bt();
                }
            } else {
                toast_error('Đã xảy ra lỗi về phân quyền trên page !')
            }
        } else {
            if (rs.error.error_user_msg) {
                toast_error(rs.error.error_user_msg);
            } else {
                toast_error(JSON.stringify(rs.error));
            }
            await Tool8_end_request(0, check_request.time, JSON.stringify({ result: rs, param: { result: "none" } }))
            stop_loading_bt();
            return;
        }
    }
    stop_loading_bt();
}

async function Tool8_after_public(s2, check_request) {
    var row_rs = document.getElementById('rs_tb');
    var fb = get_token_user_text();
    var page_id = get_token_page_text();
    var link = `https://www.facebook.com/permalink.php?story_fbid=${s2.effective_object_story_id.split('_')[1]}&id=${s2.effective_object_story_id.split('_')[0]}`;
    row_rs.innerHTML += `<tr class="tr"><td class="text-left">${fb}</td><td class="text-left">${page_id}</td><td class="text-left"><a class="btn btn-primary" style="
    color: #fff;" href="${link}" id="rs_link" target="_blank">Link</a></td></tr>`;
    await Tool8_end_request(1, check_request.time);
}

async function Tool8_delay(delayInms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(2);
        }, delayInms);
    });
}
async function Tool8_waitingForNext(time) {
    // console.log('waiting...')
    let delayres = await Tool8_delay(time);
}


async function Tool8_start_request() {
    var cr_u = get_cr_user().id;
    var url = `/api/start_request`;
    let rs = await fetch(url, {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: cr_u })
    })
        .then(response => response.json())
        .then(d => {
            return d
        })
        .catch(error => {
            console.error('Error:', error);
        });
    if (rs.error) {
        toast_error(rs.error);
        return null;
    } else {
        return rs;
    }
}


async function Tool8_end_request(status, time, error = '') {
    if (!time) return;
    var cr_u = get_cr_user().id;
    var url = `/api/end_request/${time}`;
    let rs = await fetch(url, {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: cr_u, status: status, error: error })
    })
        .then(response => response.json())
        .then(d => {
            return d
        })
        .catch(error => {
            console.error('Error:', error);
        });
    if (rs.error) {
        toast_error(rs.error);
        return false;
    } else {
        return true;
    }
}

function Tool8_get_select_call_t(num) {
    var ele = document.getElementById(`Tool8_list_bts${num}`);
    return ele.options[ele.selectedIndex].value.toUpperCase().replace(' ', '_');
}

function Tool8_get_param_err() {
    var token = get_token_user();
    var page_id = get_page_value();
    var ads_id = get_token_ads();

    // var call_to_ac = Tool8_get_select_call_t();
    // var link = document.getElementById('link').value;
    // var title = document.getElementById('title').value;
    // var pic1 = document.getElementById('img_1').src;
    // var pic2 = document.getElementById('img_2').src;
    // var video1 = (cr_video1 || {}).id || undefined;
    // var video2 = (cr_video2 || {}).id || undefined;
    var mess = document.getElementById('post_message').value || '';

    var child_data = [];
    var err_item = [];
    for (let index = 1; index < 9; index++) {
        var it = {
            "call_to_action": {
                "type": Tool8_get_select_call_t(index),
                "value": {
                    "page": page_id
                }
            },
            "link": document.getElementById(`Tool8_link${index}`).value,
            "name": document.getElementById(`Tool8_title${index}`).value,
            "picture": document.getElementById(`Tool8_img_${index}`).src
        };
        if (it.call_to_action.type != 'LIKE_PAGE') {
            var ty = it.call_to_action.type;
            it.call_to_action = { type: ty };
        }
        var vd = Tool8_cr_video[`Tool8_cr_video${index}`];
        if (vd) {
            it.video_id = vd.id;
        }
        if (it.picture === 'https://i.imgur.com/BDJYyka.jpg') {
            err_item.push(index);
        }
        child_data.push(it);
    }

    if (err_item.length > 0) {
        toast_error(`Các ô ${err_item.join(',')} chưa chọn hình !`)
        return null;
    }

    var data = {
        "access_token": token,
        "object_story_spec": {
            "link_data": {
                "child_attachments": child_data,
                "message": mess,
                "multi_share_end_card": false,
                "multi_share_optimized": true
            },
            "page_id": page_id
        }
    };

    // if (video1) {
    //     //video_id	"669722817375557"
    //     data.object_story_spec.link_data.child_attachments[0].video_id = video1;
    // }
    // if (video2) {
    //     data.object_story_spec.link_data.child_attachments[1].video_id = video2;
    // }

    return data;
}

async function Tool8_acc_get_detail() {
    var cr_u = get_cr_user();
    return await fetch(`/api/accounts/${cr_u.id}` /*, options */)
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
