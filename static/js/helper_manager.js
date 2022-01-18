//smoothy_ui_table();
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
    ele.innerText = name;
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
        var d = time.substr(0, time.indexOf('T'));
        var t = time.substring(time.indexOf('T') + 1, time.lastIndexOf(':'));
        return `${d} ${t}`;
    } catch (error) {
        return time;
    }
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

init_loading()

async function init_loading(){
    document.body.innerHTML += `<div id="loading-element"><img src="../img/loading.gif"/></div>`;
}

async function start_loading() {
    document.getElementById('loading-element').style.display = "block";
}


async function stop_loading() {
    document.getElementById('loading-element').style.display = "none";
}