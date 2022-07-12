//smoothy_ui_table();



async function get_img_loading() {
    return await fetch(`/api/init_img_loading` /*, options */)
        .then((response) => response.json())
        .then((data) => {
             return data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}

// init_load_img();
// async function init_load_img(){
//  var load_img = await get_img_loading();
// //  if(load_img){
// //     load_img.forEach(f=>{
// //         imssg = f.logo_img
// //     })
// //  }
//  imssg = "222222222222";
// }
/**
 * 
 * @param {*} params 
 * @param {*} method 
 * @param {*} class_lists 
 * @returns 
 */
function button_action_tool(params, method, class_lists, name) {
    var ele = document.createElement('button');
    ele.classList = class_lists.join(' ');
    ele.setAttribute("onclick", `${method}(${params})`);
    ele.innerHTML = name;
    return ele.outerHTML;
}

function convert_from_bool_to_values(params, true_vl, false_vl) {
    if (params == true || params == 1) {
        return true_vl;
    } else {
        return false_vl;
    }
}


function smoothy_ui_table() {
    document.querySelectorAll('td').forEach((item) => {
        if (item.innerText == 'null' || item.innerText == 'undefined') { item.innerText = '' }
    });
}
function validate_() {
    var i = Array.prototype.findIndex.call(document.querySelectorAll('[required]'), (f) => { return (!f.value || f.value.length == 0) });
    if (i != -1) {
        alert('Chưa điền đủ thông tin !');
        return false;
    } else {
        return true;
    }
}
function format_time(time) {
    try {
        if (time.indexOf('T') > -1) {
            return new Date(time).toLocaleDateString();
        } else {
            return new Date(Number(time) * 1000).toLocaleDateString();

        }
    } catch (error) {
        return time;
    }
}

function get_number_by_id(number, count = 4) {
    if (count < 4) count = 4;
    var str_number = '';
    if (number.toString().length > 4) {
        str_number = number.toString().subString(number.toString().length - 4, number.toString().length - 1);
        return str_number;
    }
    for (var i = 1; i <= count - number.toString().length; i++) {
        str_number = '0' + str_number;
    }
    str_number = str_number + number.toString();
    return str_number;
}

function get_format_VND(str) {
    if (isNaN(str)) return str;
    var pls = '';
    str = str.toString();
    if (str.indexOf('-') > -1) {
        str = str.replaceAll('-', '');
        pls = '-';
    }
    var rs = '';
    var co = 1;
    for (let i = str.length - 1; i >= 0; i--) {
        var ch = str[i];
        rs = ch + rs;
        if (co % 3 == 0 && i != 0) {
            rs = ',' + rs;
        }
        co++;
    }
    return pls + rs;
}


init_loading();
async function init_loading() {
    document.body.innerHTML += `<div id="loading-element"><img src="../img/loading.gif"/></div>`;    
}

async function start_loading() {
    document.getElementById('loading-element').style.display = "block";
}


async function stop_loading() {
    document.getElementById('loading-element').style.display = "none";
}

init_loading1();
async function init_loading1() {
    var text = await get_img_loading();
    var img = ""
    if(text){
        text.forEach(f=> {
            img = f.logo_img
        })
       
    }
    if(document.getElementById('loading')){
        document.getElementById('loading').innerHTML += `<div class="absolute_load" id="loading-element1" style="display:none;"><img src="${img}" style="width: 50px;height: 50px;"/></div>`;    
    }
    
}

async function start_loading1() {
    document.getElementById('loading-element1').style.display = "block";
}


async function stop_loading1() {
    document.getElementById('loading-element1').style.display = "none";
}

init_loading2();
async function init_loading2() {
    var text = await get_img_loading();
    var img = ""
    if(text){
        text.forEach(f=> {
            img = f.logo_img
        })
       
    }
    if(document.getElementById('loading1')){
        document.getElementById('loading1').innerHTML += `<div class="absolute_load" id="loading-element2" style="display:none;"><img src="${img}" style="width: 50px;height: 50px;"/></div>`;    
    }
   
}

async function start_loading2() {
    document.getElementById('loading-element2').style.display = "block";
}


async function stop_loading2() {
    document.getElementById('loading-element2').style.display = "none";
}