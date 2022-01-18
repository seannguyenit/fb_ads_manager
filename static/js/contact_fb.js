'use strict'

var f_l = 1;
var cr_card = 1;
// var cr_ads_id;
var cr_token;

var cr_video1;
var cr_video2;
const r_url = "/proxy/";
const r_url2 = `https://arthurtech.xyz/`;
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


async function get_user_info(token) {
    var url = `${r_url}https://graph.facebook.com/v12.0/me?access_token=${token}`;
    return await fetch(url)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}

//fetch("https://graph.facebook.com/v12.0/150960240509430/accounts?limit=2&access_token=EAAPO8P5BZCqsBAHwGbcnj1btjqe6UAMfqbO6XZBLoRj2cVvVU6kVcVCZADrjJgaj3myI9ZCAqJAWCzwo1qQXfSYo6KVGWNCCTPCfZB0qzakZCYt5p8lLOrZC4Bg8DiLb3mU0YnsADKwZBci8ZBGFz8QQ1gnNwIQq3hQmwiUUko7Gcxa9eNp1WbAwSmZAGVn7521RV6KRRmnKx8fQZDZD")

async function get_list_page(token, id) {
    var url = `${r_url}https://graph.facebook.com/v12.0/${id}/accounts?limit=2000&access_token=${token}`;
    return await fetch(url)
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
    start_loading();
    try {
        document.getElementById('rs_tb').innerHTML = '';
        change_card_element();
        var now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        document.getElementById('schedule_time').value = now.toISOString().slice(0, 16);
        // document.getElementById('schedule_time').value = new Date(Date.now()).toISOString().substr(0, 16);
        var combo_fb = document.getElementById('list_fb');
        combo_fb.innerHTML = '';

        document.getElementById('lib_img').innerHTML = '';
        var lst_cr_token = await get_all_token();
        if (lst_cr_token) {
            await lst_cr_token.forEach(f => {
                combo_fb.innerHTML += `<option data-token="${f.token}" ${lst_cr_token.indexOf(f) == 0 ? "selected" : ""} value="${f.id}">${f.name}</option>`;
            });
            await set_combobox_data();
        }
        await change_card_element();
        f_l = 0;
    } catch (error) {
        stop_loading();
    }

    stop_loading();
}

async function set_combobox_data() {
    start_loading();
    cr_video1 = undefined;
    cr_video2 = undefined;
    var f = $('#list_fb :selected').data('token');
    console.log(f);
    var combo_pages = document.getElementById('list_pages');
    combo_pages.innerHTML = '';
    var combo_ads = document.getElementById('list_ads');
    combo_ads.innerHTML = '';
    var data_pages = await get_pages_from_fb(f);
    if (data_pages) {
        try {
            data_pages.forEach(page => {
                combo_pages.innerHTML += `<option data-name="${page.name}" data-token="${page.access_token}" value="${page.id}">${page.name}-${page.id}</option>`;
            });
            var data_ads_acc = await get_ads_acc_from_fb(f);
            if (data_ads_acc) {
                data_ads_acc.forEach(ad => {
                    combo_ads.innerHTML += `<option value="${ad.account_id}">${ad.account_id}</option>`;
                });
            }
            change_page_selected();
            await load_lib_img();
            var cr_page = $('#list_pages :selected').val();
            document.getElementById('link').value = `https://www.facebook.com/${cr_page}`;
        } catch (error) {
            alert('Token đã hết hạn hoặc chưa nhập token vui lòng kiểm tra lại !')
        }

    } else {
        alert('Token đã hết hạn hoặc chưa nhập token vui lòng kiểm tra lại !')
    }
    stop_loading();


}

async function load_lib_img(v1) {
    var tk = $('#list_fb :selected').data('token');
    var img_p = document.getElementById('lib_img');
    img_p.innerHTML = '';
    if (cr_video1 && cr_video1.thumbnails.data) {
        cr_video1.thumbnails.data.forEach(f => {
            img_p.innerHTML += `<div onclick="change_img(this)" data-type="video1" class="img_item"><img src="${f.uri}" width="195" height="100%"/></div>`;
        });
    }
    if (cr_video2 && cr_video2.thumbnails.data) {
        cr_video2.thumbnails.data.forEach(f => {
            img_p.innerHTML += `<div onclick="change_img(this)" data-type="video2" class="img_item"><img src="${f.uri}" width="195" height="100%"/></div>`;
        });
    }

    var lst_img = await get_img_acc_from_ad($('#list_ads :selected').val(), tk);
    if (lst_img) {
        lst_img.forEach(im => {
            img_p.innerHTML += `<div onclick="change_img(this)" data-type="image" class="img_item"><img src="${im.url}" width="195" height="100%"/></div>`;
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
        img_p.querySelector('[data-type="image"]').classList.add('active');
        change_img_selected();
    }

}

async function change_title() {
    var title = document.getElementById('title').value;
    document.querySelector('span[data-select="review1"]').innerText = title;
}

async function change_button() {
    var select = $("#list_bts :selected").text();
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
    var p_id = $('#list_pages :selected').val();
    document.getElementById('link').value = `https://www.facebook.com/${p_id}`;
}

async function change_img(ele) {
    document.querySelector('div[class="img_item active"]').classList.remove('active');
    ele.classList.add('active');
    change_img_selected();
}
async function change_img_selected() {
    if (cr_card == 1 && f_l == 0) {
        document.getElementById('img_1').src = document.querySelector('div[class="img_item active"]').children[0].src;
    } else {
        document.getElementById('img_2').src = document.querySelector('div[class="img_item active"]').children[0].src;
    }
}

async function select_file() {
    $('#file-input').trigger('click');
    $('#nav-home-tab').trigger('click');
}
async function select_file1() {
    $('#file-input1').trigger('click');
    $('#nav-profile-tab').trigger('click');
}

function set_card(number) {
    cr_card = number;
    change_card_element();
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
    start_loading();
    try {
        var oFReader = new FileReader();
        oFReader.readAsDataURL(document.getElementById("file-input").files[0]);
        var s = Math.round(document.getElementById("file-input").files[0].size / 1024 / 1024);
        if (s >= 100) {
            alert('Chọn file nhỏ hơn 100Mb !')
            return;
        }
        oFReader.onload = function (oFREvent) {
            // document.getElementById("img_1").src = oFREvent.target.result;
        };
        var new_obj = await upload_and_return_url(document.getElementById("file-input"), $('#list_ads :selected').val(), $('#list_fb :selected').data('token'));
        if (new_obj) {
            document.getElementById("img_1").src = new_obj.images[document.getElementById("file-input").files[0].name].url
            document.getElementById("img_1").dataset.hash = new_obj.images[document.getElementById("file-input").files[0].name].hash
        }
        console.log(new_obj);
    } catch (error) {
        stop_loading();
    }

    stop_loading();
};

async function PreviewImage1() {
    start_loading();
    try {
        var oFReader = new FileReader();
        oFReader.readAsDataURL(document.getElementById("file-input1").files[0]);
        var s = Math.round(document.getElementById("file-input1").files[0].size / 1024 / 1024);
        if (s >= 100) {
            alert('Chọn file nhỏ hơn 100Mb !')
            return;
        }
        oFReader.onload = function (oFREvent) {
            // document.getElementById("img_2").src = oFREvent.target.result;
        };
        var new_obj = await upload_and_return_url(document.getElementById("file-input1"), $('#list_ads :selected').val(), $('#list_fb :selected').data('token'));
        if (new_obj) {
            document.getElementById("img_2").src = new_obj.images[document.getElementById("file-input1").files[0].name].url
            document.getElementById("img_2").dataset.hash = new_obj.images[document.getElementById("file-input1").files[0].name].hash
        }
        console.log(new_obj);
    } catch (error) {
        stop_loading();
    }

    stop_loading();

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
    const url = `${r_url}https://graph.facebook.com/v12.0/me/accounts?fields=access_token,id,name,picture&limit=1000&access_token=${token}`;
    return await fetch(url)
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
    const url = `${r_url}https://graph.facebook.com/v12.0/me/adaccounts?access_token=${token}`;
    return await fetch(url /*, options */)
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
    const url = `${r_url}https://graph.facebook.com/v12.0/act_${id}/adimages?access_token=${token}&fields=hash,url`;
    return await fetch(url /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data.data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}

async function upload_and_return_url(file_element, ads_id, token) {
    if (!file_element || !ads_id || !token) {
        alert('Chưa đầy đủ thông tin !');
        return;
    }
    // start_loading();
    const fileInput = file_element;
    const formData = new FormData();

    if (fileInput.files[0].type.includes('image') == true) {
        formData.append('file', fileInput.files[0]);

        const options = {
            method: 'POST',
            body: formData,
            // If you add this, upload won't work
            // headers: {
            //   'Content-Type': 'multipart/form-data',
            // }
        };

        var url = `${r_url}https://graph.facebook.com/v12.0/act_${ads_id}/adimages?_app=ADS_MANAGER&_reqName=path:/act_${ads_id}/adimages&access_token=${token}`;
        return await fetch(url, options)
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

        const options = {
            method: 'POST',
            body: formData,
            // If you add this, upload won't work
            // headers: {
            //   'Content-Type': 'multipart/form-data',
            // }
        };
        var url = `${r_url}https://graph.facebook.com/v12.0/act_${ads_id}/advideos?access_token=${token}`;
        var vd_rs = await fetch(url, options)
            .then(response => response.json())
            .then(data => {
                return data;
            })
            .catch(error => {
                console.error('Error:', error);
            });

        if (vd_rs) {
            var new_id = vd_rs.id;
            var thumbnails_details = await get_thumbnails_video(new_id);
            if (cr_card == 1) {
                cr_video1 = thumbnails_details;
                load_lib_img(true)
            } else {
                cr_video2 = thumbnails_details;
                load_lib_img(false)
            }
        }
    }

}


async function get_thumbnails_video(vid) {
    var token = $('#list_fb :selected').data('token');
    var url = `${r_url}https://graph.facebook.com/v12.0/${vid}?access_token=${token}&fields=["captions","description","id","length","spherical","thumbnails","title","updated_time","live_status"]`;
    //thumbnails
    var dt_rs = await get_thumbnails_from_api(url);
    var count = 0;
    while ((!dt_rs.thumbnails) || ((dt_rs.thumbnails.data || []).length < 2 && count < 11)) {
        let w = await waitingForNext(2000);
        dt_rs = await get_thumbnails_from_api(url);
        count++;
    }
    return dt_rs;
}


async function get_thumbnails_from_api(url) {
    return await fetch(url /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}

async function public_data(ads_id, token) {
    start_loading();
    var token = $('#list_fb :selected').data('token');
    var page_id = $('#list_pages :selected').val();
    var ads_id = $('#list_ads :selected').val();
    var call_to_ac = $('#list_bts :selected').val().toUpperCase().replace(' ', '_');
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
        alert('Chưa chọn file video ở ô 1 !');
        return;
    }

    // console.log(data);
    var url = `${r_url2}https://graph.facebook.com/v12.0/act_${ads_id}/adcreatives`;
    var rs_op = await fetch(url, {
        method: 'OPTIONS', // or 'PUT'
    })
        .then(response => response.text())
        .then(r => {
            return r;
        })
        .catch(error => {
            stop_loading();
            console.error('Error:', error);
        });

    // var w1 = await waitingForNext(2000);
    return await fetch(url, {
        method: 'POST', // or 'PUT'
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(d => {
            return d;
        })
        .catch(error => {
            console.error('Error:', error);
            stop_loading();
        });
}


async function get_step2(id) {
    var token = $('#list_fb :selected').data('token');
    var url = `${r_url}https://graph.facebook.com/v12.0/${id}?access_token=${token}&fields=effective_object_story_id`;
    return await fetch(url).then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.warn(error);
            stop_loading();
            return undefined;
        });
}


async function option_step3(op) {
    // var token = $('#list_fb :selected').data('token');
    // var ads_id = $('#list_ads :selected').val();

    var url = `${r_url}https://graph.facebook.com/v12.0/${op}`;
    return await fetch(url, {
        method: 'OPTIONS', // or 'PUT'
    })
        .then(response => response.text())
        .then(r => {
            return r;
        })
        .catch(error => {
            stop_loading();
            console.error('Error:', error);
        });
}


async function post_step3(op) {
    var token = $('#list_pages :selected').data('token');
    // var ads_id = $('#list_ads :selected').val();
    var data = { "access_token": token, "is_published": true }
    if ($('#is_schedule').is(':checked') == true) {
        var timesta = ((new Date($('#schedule_time').val())).getTime()) / 1000;
        data = { "access_token": token, "scheduled_publish_time": timesta }
    }
    var url = `${r_url}https://graph.facebook.com/v12.0/${op}`;
    return await fetch(url, {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            return data
        })
        .catch(error => {
            console.error('Error:', error);
            stop_loading();
        });
}


async function run_public() {
    if (!confirm('Bạn có chắc chắn muốn public ?')) {
        return;
    }
    var link_rs = document.getElementById('rs_link');
    var rs = await public_data();
    if (rs) {
        if (rs.error) {
            alert(rs.error.error_user_msg);
            stop_loading();
            return;
        } else {
            // let w = await waitingForNext(1000);
            var s2 = await get_step2(rs.id)
            if (s2.effective_object_story_id) {
                // var w = await waitingForNext(2000);
                try {
                    var op = await option_step3(s2.effective_object_story_id);
                    var s3 = await post_step3(s2.effective_object_story_id);
                    var row_rs = document.getElementById('rs_tb');
                    var fb = $('#list_fb :selected').text();
                    var page_id = $('#list_pages :selected').text();
                    var link = `https://www.facebook.com/permalink.php?story_fbid=${s2.effective_object_story_id.split('_')[1]}&id=${s2.effective_object_story_id.split('_')[0]}`;
                    row_rs.innerHTML += `<tr><td>${fb}</td><td>${page_id}</td><td><a class="btn btn-primary" href="${link}" id="rs_link" target="_blank">Link</a></td></tr>`;
                } catch (error) {
                    stop_loading();
                }
            } else {
                alert('Đã xảy ra lỗi về phân quyền trên page !')
            }
        }
    }
    stop_loading();
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

// async function test(p) {
//     console.log(await test_(p));
// }

// await fetch("https://square-sun-eee2.kundollars.workers.dev/https://graph.facebook.com/v12.0/act_345234299528373/adcreatives", {
//     "credentials": "omit",
//     "headers": {
//         "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0",
//         "Accept": "application/json, text/plain, */*",
//         "Accept-Language": "en-US,en;q=0.5",
//         "Content-Type": "application/json",
//         "Sec-Fetch-Dest": "empty",
//         "Sec-Fetch-Mode": "cors",
//         "Sec-Fetch-Site": "cross-site"
//     },
//     "referrer": "https://zsocial.vn/",
//     "body": "{\"access_token\":\"EAAGNO4a7r2wBACmZCZBeOikcoKvEZB68NuaqGsMpi4CMrwR2y6NtpdS6ZBAq8J3I6PZBZBfN9sCyLf3X0PCRPQfGM6cAdqTUTMYdZAu0dedypRILAiv7w5NEmO9s6AZAzShZAd9tzlv1LIWWqZAgZAR6RTjctW01pdjnjOxZC6dEa4jJk3qZCzzQTTklZC\",\"object_story_spec\":{\"link_data\":{\"child_attachments\":[{\"call_to_action\":{\"type\":\"LIKE_PAGE\",\"value\":{\"page\":\"863153897185255\"}},\"link\":\"https://www.facebook.com/863153897185255\",\"name\":\"Like Page 👉 👉\",\"picture\":\"https://scontent.fdad3-3.fna.fbcdn.net/v/t45.1600-4/267247410_23850053565030666_8405242837608020741_n.jpg?_nc_cat=111&ccb=1-5&_nc_sid=2aac32&_nc_ohc=dfymj4SbDzAAX_nMBg4&_nc_ht=scontent.fdad3-3.fna&oh=00_AT9_KrxL3wNNgvtuHnbA9St_jCBFvsBqC4F6INgIpzXjsQ&oe=61D6E281\"},{\"call_to_action\":{\"type\":\"LIKE_PAGE\",\"value\":{\"page\":\"863153897185255\"}},\"link\":\"https://www.facebook.com/863153897185255\",\"name\":\"Like Page 👉 👉\",\"picture\":\"https://scontent.fdad3-5.fna.fbcdn.net/v/t45.1600-4/254951144_23850038970310666_7032487807551466145_n.jpg?_nc_cat=102&ccb=1-5&_nc_sid=2aac32&_nc_ohc=vTSmzUgQcQMAX_p_rQD&_nc_ht=scontent.fdad3-5.fna&oh=00_AT8vuYSc9b-y9eDB8-zh8103T8UTqeupWwkQ5LQBmdk9Yg&oe=61D7B7AC\"}],\"message\":\"\",\"multi_share_end_card\":false,\"multi_share_optimized\":true},\"page_id\":\"863153897185255\"}}",
//     "method": "POST",
//     "mode": "cors"
// });