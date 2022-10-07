'use strict'

var f_l = 1;
var cr_card = 1;
// var cr_ads_id;
var cr_token;

var cr_video1;
var cr_video2;
var cr_time = new Date().getTime();

const r_url = "/api/fproxy_post";
const r_url2 = "/api/fproxy";
// const r_url = `${window.location.protocol}//${window.location.hostname}/proxy/`;


const option_get = {
    "credentials": "omit",
    "headers": {
        "Origin": window.location.origin,
        "Sec-Fetch-Site": "cross-site",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9,vi;q=0.8",
        "Access-Control-Request-Headers": "x-requested-with"
    },
    "method": "GET",
    "mode": "cors"
};


init_default();
check_service();
run_menu_tool();
async function run_menu_tool(e) {
    var cr_ele = e;
    var target = "tool2";
    if (cr_ele) {
        target = cr_ele.dataset.target
        //change show content tool
        var tab_content = document.getElementById('tool2');
        tab_content.style.display = 'none';
        var Tool8_tab_content = document.getElementById('tool8');
        Tool8_tab_content.style.display = 'none';
        document.getElementById(target).style.display = 'block';
        //

        //change menu tool
        if (cr_ele.classList.contains('active')) return;
        Array.from(cr_ele.parentElement.getElementsByClassName('active')).forEach(m => {
            m.classList.remove('active');
        })
        cr_ele.classList.add('active');
        //
    }
    //change img lib
    Array.from(document.querySelectorAll(`[data-tool]`)).forEach((it) => {
        if (target === it.dataset.tool) {
            it.classList.remove('hidden-element');
        } else {
            it.classList.add('hidden-element');
        }
    })
    //

    if (target === "tool8") {
        run_tool8_setup();
    }
}



async function acc_get_detail() {
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

async function check_service() {
    var dt = await acc_get_detail();
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


async function get_user_info(token) {
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

async function get_list_page(token, id) {
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

async function init_default() {
    // start_loading();
    try {
        // document.getElementById('err_place').style.display = 'none';
        document.getElementById('rs_tb').innerHTML = '';
        change_card_element();
        var now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        document.getElementById('schedule_time').value = now.toISOString().substring(0, 16);
        // document.getElementById('schedule_time').value = new Date(Date.now()).toISOString().substr(0, 16);
        var combo_fb = document.getElementById('list_fb');
        combo_fb.innerHTML = '';

        document.getElementById('lib_img').innerHTML = '';
        var lst_cr_token = await get_all_token();
        if (lst_cr_token) {
            await lst_cr_token.forEach(f => {
                combo_fb.innerHTML += `<option data-token="${f.token}" ${lst_cr_token.indexOf(f) == 0 ? "selected" : ""} value="${f.id}" data-img_src="${f.picture}">${f.name}</option>`;
            });
            await set_combobox_data();
        }
        await change_card_element();
    } catch (error) {
        // stop_loading();
    }
    f_l = 0;

    // stop_loading();
}

async function set_combobox_data() {
    // start_loading();
    cr_video1 = null;
    cr_video2 = null;
    var f = get_token_user();
    var combo_pages = document.getElementById('list_pages');
    combo_pages.innerHTML = '';
    var combo_ads = document.getElementById('list_ads');
    combo_ads.innerHTML = '';
    var data_pages = await get_pages_from_fb(f);
    if (data_pages) {
        try {
            data_pages.forEach(page => {
                combo_pages.innerHTML += `<option data-name="${page.name}" data-token="${page.access_token}" value="${page.id}" data-img_src="${page.picture.data.url}">${page.name}</option>`;
            });
            var data_ads_acc = await get_ads_acc_from_fb(f);
            if (data_ads_acc) {
                data_ads_acc.forEach(ad => {
                    combo_ads.innerHTML += `<option value="${ad.account_id}" data-img_src="../img/avatar_user.png">${ad.account_id}</option>`;
                });
            }
            change_page_selected();
            await load_lib_img();
            var cr_page = get_page_value();
            document.getElementById('link').value = `https://www.facebook.com/${cr_page}`;
        } catch (error) {
            var mess = 'Token đã hết hạn hoặc chưa nhập token vui lòng kiểm tra lại !'
            toast_error(mess)
            mess_error(mess)
            // if (document.getElementById('error_token')) {
            //     document.getElementById('err_place').style.display = 'block';
            //     document.getElementById('error_token').innerText = mess;
            // }
            // toast_error('Token đã hết hạn hoặc chưa nhập token vui lòng kiểm tra lại !')
        }
        await change_card_element();
        document.getElementById('img_1').src = 'https://i.imgur.com/BDJYyka.jpg';
        document.getElementById('img_2').src = document.querySelector('div[class="img_item active"]').children[0].src;
    } else {
        var mess = 'Token đã hết hạn hoặc chưa nhập token vui lòng kiểm tra lại !'
        toast_error(mess)
        mess_error(mess)
        // if (document.getElementById('error_token')) {
        //     document.getElementById('err_place').style.display = 'block';
        //     document.getElementById('error_token').innerText = mess;
        // }
        // toast_error('Token đã hết hạn hoặc chưa nhập token vui lòng kiểm tra lại !')
    }
    // stop_loading();


}

async function load_lib_img(v1) {
    var tk = get_token_user();
    var img_p = document.getElementById('lib_img');
    img_p.innerHTML = '';
    if (cr_video1 && cr_video1.thumbnails.data) {
        cr_video1.thumbnails.data.forEach(f => {
            img_p.innerHTML += ` <div class="ma-3"><div onclick="change_img(this)" data-type="video1"><img src="${f.uri}" alt=""
            style="border: 3px solid rgb(52, 152, 219); border-radius: 8px;"
            width="195px"
            height="250px"/></div></div>`;
        });
    }
    if (cr_video2 && cr_video2.thumbnails.data) {
        cr_video2.thumbnails.data.forEach(f => {
            img_p.innerHTML += ` <div class="ma-3"><div onclick="change_img(this)" data-type="video2"><img src="${f.uri}" alt=""
            style="border: 3px solid rgb(52, 152, 219); border-radius: 8px;"
            width="195px"
            height="250px"/></div></div>`;
        });
    }

    var lst_img = await get_img_acc_from_ad(get_token_ads(), tk);
    if (lst_img) {
        lst_img.forEach(im => {
            img_p.innerHTML += ` <div class="ma-3"><div onclick="change_img(this)" data-type="image"><img src="${im.url}" alt=""
            style="border: 3px solid rgb(52, 152, 219); border-radius: 8px;"
            width="195px"
            height="250px"/></div></div>`;
        });
    }

    if (v1 == true) {
        img_p.querySelector('[data-type="video1"]').classList.add('active');
        document.getElementById('img_1').src = img_p.querySelector('[data-type="video1"]').children[0].src
    }
    else if (v1 == false) {
        img_p.querySelector('[data-type="video2"]').classList.add('active');
        document.getElementById('img_2').src = img_p.querySelector('[data-type="video2"]').children[0].src
    } else {
        if (img_p.querySelector('[data-type="image"]')) {
            img_p.querySelector('[data-type="image"]').classList.add('active');
            change_img_selected(img_p.querySelector('[data-type="image"]'));
        }
    }

}

async function change_title() {
    var title = document.getElementById('title').value;
    document.querySelector('span[data-select="review1"]').innerText = title;
}

async function change_button() {
    var select = $("#list_bts :selected").val();
    if (select == 'Like Page') {
        document.getElementById('link').parentElement.style.display = "none";
    } else {
        document.getElementById('link').parentElement.style.display = "block";
    }
    document.querySelectorAll('button[data-select="review"]').forEach(f => {
        f.innerText = select;
    });
}
// async function change_token_selected() {
//     document.querySelector('span[data-select="review2"]').innerText = $('#list_pages :selected').data('name');
// }
async function change_check_schedule() {
    $('#schedule_time').prop('disabled', !$('#is_schedule').is(':checked'));
}
async function change_page_selected() {
    document.querySelector('span[data-select="review2"]').innerText = $('#list_pages :selected').data('name');
    var p_id = get_page_value();
    document.getElementById('link').value = `https://www.facebook.com/${p_id}`;
}

async function change_img(ele) {
    ele.querySelector('img').classList.remove('active');
    ele.classList.add('active');
    change_img_selected(ele);
}
async function change_img_selected(ele) {
    if (!ele) return;
    if (cr_card == 1 && f_l == 0) {
        document.getElementById('img_1').src = ele.querySelector('img').src;
    } else {
        document.getElementById('img_2').src = ele.querySelector('img').src;
    }
}

async function select_file() {
    await set_card(1);
    $('#file-input').trigger('click');
    $('#nav-home-tab').trigger('click');
}
async function select_file1() {
    await set_card(2);
    $('#file-input1').trigger('click');
    $('#nav-profile-tab').trigger('click');
}

async function set_card(number) {
    cr_card = number;
    if (cr_card === 1) {
        document.getElementById('nav-profile-tab').classList.replace('button-card-active', 'button-card-noactive');
        document.getElementById('nav-home-tab').classList.replace('button-card-noactive', 'button-card-active');
    } else {
        document.getElementById('nav-profile-tab').classList.replace('button-card-noactive', 'button-card-active');
        document.getElementById('nav-home-tab').classList.replace('button-card-active', 'button-card-noactive');
    }
    await change_card_element();
}

async function change_card_element() {
    var lib_ = document.getElementById('lib_img').parentElement;
    var tab_ = document.querySelectorAll('div[data-select="card1"]');
    var img_p = document.getElementById('lib_img');
    var lst_img = img_p.querySelectorAll('[data-type="image"]');
    if (cr_card == 1) {
        // lib_.style.display = 'none';
        lst_img.forEach(f => { f.style.display = "none" });
        tab_.forEach(f => { f.style.display = "block" });
    } else {
        // lib_.style.display = 'block';
        lst_img.forEach(f => { f.style.display = "block" });
        tab_.forEach(f => { f.style.display = "none" });
    }


}

async function PreviewImage() {
    const card = 1;
    start_loading1();
    try {
        var oFReader = new FileReader();
        oFReader.readAsDataURL(document.getElementById("file-input").files[0]);
        var s = Math.round(document.getElementById("file-input").files[0].size);
        if (s >= 100*1024*1024) {
            stop_loading1();
            mess_error('file bạn chọn vướt quá 100MB, load lại trang để tiếp tục !');
            toast_error('file bạn chọn vướt quá 100MB, load lại trang để tiếp tục !');
            return;
        }
        else{
        oFReader.onload = function (oFREvent) {
            // document.getElementById("img_1").src = oFREvent.target.result;
        };
        var new_obj = await upload_and_return_url(document.getElementById("file-input"), get_token_ads(), get_token_user(), 1);
        if (new_obj) {
            document.getElementById("img_1").src = new_obj.images[document.getElementById("file-input").files[0].name].url
            document.getElementById("img_1").dataset.hash = new_obj.images[document.getElementById("file-input").files[0].name].hash
        }
    }
        // console.log(new_obj);
    } catch (error) {
        stop_loading1();
    }

    stop_loading1();
};

async function PreviewImage1() {
    const card = 2;
    start_loading2();
    try {
        var oFReader = new FileReader();
        oFReader.readAsDataURL(document.getElementById("file-input1").files[0]);
        var s = Math.round(document.getElementById("file-input1").files[0].size );
        if (s >= 100*1024*1024) {
            stop_loading2();
            mess_error('file bạn chọn vướt quá 100MB, load lại trang để tiếp tục !')
            toast_error('file bạn chọn vướt quá 100MB, load lại trang để tiếp tục !');
            return;
        } 
        else{
        oFReader.onload = function (oFREvent) {
            // document.getElementById("img_2").src = oFREvent.target.result;
        };
        var new_obj = await upload_and_return_url(document.getElementById("file-input1"), get_token_ads(), get_token_user(), 2);
        if (new_obj) {
            document.getElementById("img_2").src = new_obj.images[document.getElementById("file-input1").files[0].name].url
            document.getElementById("img_2").dataset.hash = new_obj.images[document.getElementById("file-input1").files[0].name].hash
        }
        }
        console.log(new_obj);
    } catch (error) {
        stop_loading2();
    }

    stop_loading2();

};

async function get_all_token() {
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

async function get_pages_from_fb(token) {
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


async function get_ads_acc_from_fb(token) {
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

async function get_img_acc_from_ad(id, token) {
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
            mess_error(rs.error.message);
        } else {
            toast_error('Lỗi phần quyền trên page hoặc trên tài khoản ADS !');
            mess_error('Lỗi phần quyền trên page hoặc trên tài khoản ADS !');
            // stop_loading();
        }
        return null;
    }
    return rs.data;
}

async function upload_and_return_url(file_element, ads_id, token, card) {
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
                mess_error((vd_rs.error.message) || 'Lỗi phân quyền trên page');
                toast_error((vd_rs.error.message) || 'Lỗi phân quyền trên page');
            } else {
                var new_id = vd_rs.id;
                if (new_id) {
                    var thumbnails_details = await get_thumbnails_video(new_id);
                    if (card == 1) {
                        cr_video1 = thumbnails_details;
                        load_lib_img(true)
                    } else {
                        cr_video2 = thumbnails_details;
                        load_lib_img(false)
                    }
                } else {
                    mess_error('Không up được video ! Kiểm tra đường truyền mạng hoặc phân quyền trên page ! Vui lòng tải lại (refresh) trang !')
                    toast_error('Không up được video ! Kiểm tra đường truyền mạng hoặc phân quyền trên page ! Vui lòng tải lại (refresh) trang !')
                }
            }
        }
    }

}


async function get_thumbnails_video(vid) {
    var token = get_page_token();
    var url = `https://graph.facebook.com/v15.0/${vid}?access_token=${token}&fields=["captions","description","id","length","spherical","thumbnails","title","updated_time","live_status"]`;
    //thumbnails
    var dt_rs = await get_thumbnails_from_api(url);
    var count = 0;
    while ((!dt_rs.thumbnails) || ((dt_rs.thumbnails.data || []).length < 2 && count < 17)) {
        let w = await waitingForNext(3000);
        dt_rs = await get_thumbnails_from_api(url);
        count++;
    }
    return dt_rs;
}


async function get_thumbnails_from_api(url) {
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

async function public_data() {
    // start_loading();

    var token = get_token_user();
    var page_id = get_page_value();
    var ads_id = get_token_ads();
    var call_to_ac = get_select_call_t();
    var link = document.getElementById('link').value;
    var title = document.getElementById('title').value;
    var pic1 = document.getElementById('img_1').src;
    var pic2 = document.getElementById('img_2').src;
    var video1 = (cr_video1 || {}).id || undefined;
    var video2 = (cr_video2 || {}).id || undefined;
    var mess = document.getElementById('post_message').value || '';
    var data = {
        "access_token": token,
        "object_story_spec": {
            "link_data": {
                "child_attachments": [
                    {
                        "call_to_action": {
                            "type": call_to_ac,
                            "value": {
                                "page": page_id
                            }
                        },
                        "link": link,
                        "name": title,
                        "picture": pic1
                    },
                    {
                        "call_to_action": {
                            "type": call_to_ac,
                            "value": {
                                "page": page_id
                            }
                        },
                        "link": link,
                        "name": title,
                        "picture": pic2
                    }
                ],
                "message": mess,
                "multi_share_end_card": false,
                "multi_share_optimized": true
            },
            "page_id": page_id
        }
    };

    if (video1) {
        //video_id	"669722817375557"
        data.object_story_spec.link_data.child_attachments[0].video_id = video1;
    }
    if (video2) {
        data.object_story_spec.link_data.child_attachments[1].video_id = video2;
    }

    if (pic1 == 'https://i.imgur.com/BDJYyka.jpg') {
        toast_error('Chưa chọn file video ở ô 1 !');
        return;
    }
    if (pic2 == 'https://i.imgur.com/BDJYyka.jpg') {
        toast_error('Chưa chọn file hình ảnh ở ô 2 !');
        return;
    }

    if (call_to_ac != 'LIKE_PAGE') {
        data.object_story_spec.link_data.child_attachments[0].call_to_action = { type: call_to_ac };
        data.object_story_spec.link_data.child_attachments[1].call_to_action = { type: call_to_ac };
    }

    //data.object_story_spec.link_data.child_attachments = [...data.object_story_spec.link_data.child_attachments,...data.object_story_spec.link_data.child_attachments];

    // console.log(data);
    var url = `https://graph.facebook.com/v15.0/act_${ads_id}/adcreatives`;

    let rs = await await fetch(
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


async function get_step2(id) {
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


// async function option_step3(op) {
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


async function post_step3(op) {
    var token = get_page_token();
    // var ads_id = get_token_ads();
    var data = { "access_token": token, "is_published": true }
    if ($('#is_schedule').is(':checked') == true) {
        var timesta = Math.floor((new Date(document.getElementById('schedule_time').value)).getTime() / 1000);
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

async function post_step3_pro5(op) {
    var token = get_page_token();
    // var ads_id = get_token_ads();
    var data = { "access_token": token, "is_published": true }
    if ($('#is_schedule').is(':checked') == true) {
        var timesta = Math.floor((new Date(document.getElementById('schedule_time').value)).getTime() / 1000);
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


async function run_public() {
    if (!confirm('Bạn có chắc chắn muốn public ?')) {
        return;
    }
    // document.getElementById('err_place').style.display = 'none';
    start_loading3();
    var check_request = await start_request();
    if (!check_request) {
        return;
    }
    var rs = await public_data();
    if (rs) {
        if (!rs.error) {
            let w = await waitingForNext(5000);
            var s2 = await get_step2(rs.id)
            console.log(s2);
            var co = 0;
            while ((!s2.effective_object_story_id) && co < 10) {
                let wfn = await waitingForNext(10000);
                s2 = await get_step2(rs.id)
                co++;
            }
            if (s2.effective_object_story_id) {
                try {
                    // var op = await option_step3(s2.effective_object_story_id);
                    var s3 = await post_step3(s2.effective_object_story_id);
                    if (s3.error) {
                        s3 = await post_step3_pro5(s2.effective_object_story_id);
                        if (s3.error) {
                            //doi voi pro5 thi khong can cap nhat public
                            if (s3.error.code == 10) {
                                await after_public(s2, check_request);
                            } else {
                                await end_request(0, check_request.time);
                            }
                        }
                    } else {
                        await after_public(s2, check_request);
                    }
                } catch (error) {
                    stop_loading3();
                }
            } else {
                mess_error('Đã xảy ra lỗi về phân quyền trên page !')
                toast_error('Đã xảy ra lỗi về phân quyền trên page !')
            }
        } else {
            if (rs.error.error_user_msg) {
                mess_error(rs.error.error_user_msg);
                toast_error(rs.error.error_user_msg);
            } else {
                mess_error(JSON.stringify(rs.error));
                toast_error(JSON.stringify(rs.error));
            }
            await end_request(0, check_request.time, JSON.stringify({ result: rs, param: get_param_err() }))
            stop_loading3();
            return;
        }
    }
    stop_loading3();
}

async function after_public(s2, check_request) {
    var row_rs = document.getElementById('rs_tb');
    var fb = get_token_user_text();
    var page_id = get_token_page_text();
    var link = `https://www.facebook.com/permalink.php?story_fbid=${s2.effective_object_story_id.split('_')[1]}&id=${s2.effective_object_story_id.split('_')[0]}`;
    row_rs.innerHTML += `<tr class="tr"><td class="text-left">${fb}</td><td class="text-left">${page_id}</td><td class="text-left"><a class="btn btn-primary" style="
    color: #fff;" href="${link}" id="rs_link" target="_blank">Link</a></td></tr>`;
    await end_request(1, check_request.time);
}

async function delay(delayInms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(2);
        }, delayInms);
    });
}
async function waitingForNext(time) {
    // console.log('waiting...')
    let delayres = await delay(time);
}


async function start_request() {
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
        mess_error(rs.error);
        toast_error(rs.error);
        return null;
    } else {
        return rs;
    }
}


async function end_request(status, time, error = '') {
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
        mess_error(rs.error);
        toast_error(rs.error);
        return false;
    } else {
        return true;
    }
}

function get_token_user() {
    var ele = document.getElementById('list_fb');
    return ele.options[ele.selectedIndex].dataset.token;
}
function get_token_user_text() {
    var ele = document.getElementById('list_fb');
    return ele.options[ele.selectedIndex].text;
}
function get_token_page_text() {
    var ele = document.getElementById('list_pages');
    return ele.options[ele.selectedIndex].text;
}
function get_page_value() {
    var ele = document.getElementById('list_pages');
    return ele.options[ele.selectedIndex].value;
}
function get_page_token() {
    var ele = document.getElementById('list_pages');
    return ele.options[ele.selectedIndex].dataset.token;
}
function get_token_ads() {
    var ele = document.getElementById('list_ads');
    return ele.options[ele.selectedIndex].value;
}
function get_select_call_t() {
    var ele = document.getElementById('list_bts');
    return ele.options[ele.selectedIndex].value.toUpperCase().replace(' ', '_');
}

function get_param_err() {
    var token = get_token_user();
    var page_id = get_page_value();
    var call_to_ac = get_select_call_t();
    var link = document.getElementById('link').value;
    var title = document.getElementById('title').value;
    var pic1 = document.getElementById('img_1').src;
    var pic2 = document.getElementById('img_2').src;
    var video1 = (cr_video1 || {}).id || undefined;
    var video2 = (cr_video2 || {}).id || undefined;
    var mess = document.getElementById('post_message').value || '';
    var data = {
        "access_token": token,
        "object_story_spec": {
            "link_data": {
                "child_attachments": [
                    {
                        "call_to_action": {
                            "type": call_to_ac,
                            "value": {
                                "page": page_id
                            }
                        },
                        "link": link,
                        "name": title,
                        "picture": pic1
                    },
                    {
                        "call_to_action": {
                            "type": call_to_ac,
                            "value": {
                                "page": page_id
                            }
                        },
                        "link": link,
                        "name": title,
                        "picture": pic2
                    }
                ],
                "message": mess,
                "multi_share_end_card": false,
                "multi_share_optimized": true
            },
            "page_id": page_id
        }
    };

    if (video1) {
        //video_id	"669722817375557"
        data.object_story_spec.link_data.child_attachments[0].video_id = video1;
    }
    if (video2) {
        data.object_story_spec.link_data.child_attachments[1].video_id = video2;
    }

    return data;
}