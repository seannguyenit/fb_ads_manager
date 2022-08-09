init_user();
async function acc_get_all() {
    return await fetch(`/api/list_accounts` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}

async function init_user() {
    let urlString = location.href;
    let paramString = urlString.split('?')[1];
    let queryString = new URLSearchParams(paramString);

    for (let pair of queryString.entries()) {
        var key_id = ("Key is: " + pair[0]);
        var id_user = (pair[1]);
    }
    var id = 0;
    if (id_user != null) {
        id = id_user;
    }
    // alert(id)
    var data = await acc_get_all();
    var list_user = document.getElementById('list_user');
    if(data) {
        data.forEach(f => {
            if(Number(id) != 0 ) {
                if(Number(id) === f.id){
                    list_user.innerHTML = `
                    <option selected value="${f.id}">${f.username}
                    </option>
                    `
                }
              
            }else{
                list_user.innerHTML += `
                <option value="${f.id}">${f.username}
                </option>
                `
            }
           
        });
    }
}

// save edit money 
async function save_edit_money() {
    var edit_money = document.getElementById("edit_money").value;
    var id =  document.getElementById("list_user").value;
    var money = document.getElementById("_money").value;
    if (Number(money) === 0 || Number(money) === null) {
        var mess = "Hãy nhận số tiền bạn muốn";
        toast_error(mess)
        // alert("Hãy nhận số tiền bạn muốn");
        return;
    }
    if (Number(edit_money) === 2) {
        var mess = "Hãy chọn trạng thái bạn muốn muốn";
        toast_error(mess)
        // alert("Hãy chọn trạng thái bạn muốn muốn");
        return;
    }
    var user_id = id;
    var data = { user_id: user_id, money: money, type: edit_money };
    var url = `/api/a_insert_money`;
    var meth = 'POST';

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
    if (rs.mess) {
        // var mess ="Hãy nhận số tiền bạn muốn";
        toast_error(rs.mess)
        // alert(rs.mess);
        return;
    }
    if (rs.ok = 1) {
        var mess = "thay đổi tiền thành công";
        toast_success(mess)
        // alert("thay đổi tiền thành công")
    }
    init_users(cr_page, user_number_page);
}