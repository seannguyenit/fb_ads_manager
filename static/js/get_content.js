'use strict'

async function get_content(url) {
    try {
        return await fetch(url).then(function (response) {
            // The API call was successful!
            return response.text();
        }).then(async function (html) {

            // Convert the HTML string into a document object
            var parser = new DOMParser();
            var doc = parser.parseFromString(html, 'text/html');
            await remove_href(doc);
            await remove_script(doc);
            await change_src_image(doc);
            var title = doc.title;
            var body_ = await get_main_intelligent(doc);

            var media_ = doc.body.querySelector('article').querySelectorAll('img');
            // console.log(media_);
            return { title: title, content: body_, media: media_ };

        }).catch(function (err) {
            // There was an error
            //console.warn('Something went wrong.', err);
            return { error: 1 };
        });
    } catch (error) {
        console.log('stop by cors !');
    }
    return { error: 1 };
}


async function get_content_by_plugin(url, index) {
    var temp_bt = document.getElementById('sp_ex');
    temp_bt.dataset.url = url;
    temp_bt.dataset.index = index;
    temp_bt.dataset.stt = "0";
    temp_bt.click();
    var count = 0;
    // console.time()
    while (document.getElementById('sp_ex').dataset.stt != "1" && count < 20) {
        let w = await waitingForNext(2000);
        count++;
    }
    // console.timeEnd()

    return JSON.parse(document.getElementById('sp_ex').dataset.js_data || '{error: 1}');

    // var content;
    // await chrome.runtime.sendMessage({ "type": "get_content", "url": url, "index": index }, async (res) => {
    //     console.log(res);
    //     // content = res.content;
    //     content = { title: res.title, content: res.content };
    // });
    // var count = 0;
    // while (!content && count < 10) {
    //     count++;
    //     let w = await waitingForNext(2000);
    // }
    // return content;
}

/**
 * Nếu đổi thì đổi cả bên extentions
 * @param {*} doc 
 * @returns 
 */
 async function get_main_intelligent(doc) {
    var select_content_located = doc.body.querySelector('article');
    if (!select_content_located) {
        select_content_located = doc.body.querySelector('precontent')
    }
    if (!select_content_located) {
        select_content_located = document.body.querySelector('[class=ArticleContent]')
    }
    await remove_head(select_content_located);
    //&amp;
    return select_content_located.innerHTML.replaceAll('&nbsp;', ' ').replaceAll('&amp;', ' ').replaceAll('&lt;', ' ');
}



async function change_src_image(element) {
    element.querySelectorAll('img').forEach(item => {
        if (!item.src.includes('http')) {
            for (let index = 0; index < item.attributes.length; index++) {
                var att = item.attributes[index].nodeValue;
                if (att.includes('http')) {
                    item.src = att;
                    break;
                }
            }
        }
        // if(item.dataset.original||item.dataset.src){
        //     item.src = (item.dataset.original||item.dataset.src);
        // }
    });
}


async function remove_href(element) {
    element.querySelectorAll('a').forEach(item => {
        item.removeAttribute("href");
    });
}

async function remove_script(element) {
    element.querySelectorAll('script').forEach(item => {
        item.parentNode.removeChild(item)
    });
}

async function remove_head(element) {
    element.querySelectorAll('header').forEach(item => {
        item.parentNode.removeChild(item)
    });
    element.querySelectorAll('nav').forEach(item => {
        item.parentNode.removeChild(item)
    });
    element.querySelectorAll('footer').forEach(item => {
        item.parentNode.removeChild(item)
    });
}

// async function show_media(arr_media, root_url) {
//     if (!arr_media) return;
//     var par = document.getElementById('media_located');
//     par.innerHTML = '';
//     arr_media.forEach(ele => {
//         var src = ele.dataset.original || ele.dataset.src || ele.src;
//         src = src.replaceAll('http://localhost:3000/', root_url);
//         par.innerHTML += `<div class="col-md-12 d-flex p-1" style="border-bottom:solid 1px black ;height: 120px;">
//         <div class="col-md-2">
//             <img width="100" height="100" src="${src}" />
//         </div>
//         <div class="col-md-10 text-center">
//             <a target="_blank" href="${src}" style="margin: auto;word-wrap: normal;">${src}</a>
//         </div>
//     </div>`;
//     });
// }

function validate_all() {
    if (document.getElementById('input_link').value.length == 0) {
        alert('Chưa nhập links vào !');
        return false;
    }
    // if(document.getElementById('input_domain').value.length == 0){
    //     alert('Chưa nhập tên miền vào !');
    //     return false;
    // }
    // if(document.getElementById('input_user').value.length == 0){
    //     alert('Chưa nhập user vào !');
    //     return false;
    // }
    // if(document.getElementById('input_pass').value.length == 0){
    //     alert('Chưa nhập pass vào !');
    //     return false;
    // }
    return true;
}

/**
 * 
 * @param {domain} url 
 * @param {*} user 
 * @param {*} pass 
 * @param {*} title 
 * @param {*} content 
 * @returns 
 */
async function save_posts(url, user, pass, title, content) {
    var data = `title=${title}&content=${content}&status=publish`;
    // data.excerpt = {};
    var au_str = `Basic ${encode_base64(user, pass)}`;
    var url = `https://${url}/wp-json/wp/v2/posts`
    return await fetch(url, {
        body: data,
        headers: {
            Authorization: au_str,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST"
    })
        .then(response => response.json())
        .then(result => {
            return result;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function encode_base64(user, code) {
    var string = `${user}:${code}`;
    // Create Base64 Object
    var Base64 = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) { var t = ""; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t }, decode: function (e) { var t = ""; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/\r\n/g, "\n"); var t = ""; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { var t = ""; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t } }

    // Encode the String
    var encodedString = Base64.encode(string);
    // console.log(encodedString); // Outputs: "SGVsbG8gV29ybGQh"

    // Decode the String
    // var decodedString = Base64.decode(encodedString);
    // console.log(decodedString); // Outputs: "Hello World!"

    return encodedString;

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