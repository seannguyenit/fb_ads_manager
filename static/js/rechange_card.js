
init_topup_card();
async function history_topup_card() {
    return await fetch(`/api/his_card` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}
async function search_history_topup_card(username) {
    return await fetch(`/api/his_card/${username}` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}

async function init_topup_card() {
    var card = document.getElementById('table_data');
    var data = await history_topup_card();
    if (data) {
        data.forEach(item => {
            var d = new Date(Number(item.time * 1000 || 0));
            let y = d.getFullYear();
            let m = (d.getMonth() + 1) < 10 ? `0${d.getMonth() + 1}` : (d.getMonth() + 1);
            let dd = (d.getDate()) < 10 ? `0${d.getDate()}` : (d.getDate());
            var today = `${dd}/${m}/${y}`;
            switch (Number(item.Success )) {
                case 1:
                    var type_banking = '<span style="background-color: rgb(39, 174, 96);border-radius: 5px;padding: 3px; border-color: rgb(39, 174, 96);color:#fff !important">Success</span>'
                    break;
                default:
                    break;
            }
            card.innerHTML += `
            <tr  class="table_admin">
                <td>${item.user_id}</td>    
                <td>${today}</td> 
                <td>${get_format_VND(item.money) || ''}</td> 
                <td>${item.Seri}</td>   
                <td>${item.Pin}</td>  
                <td>${type_banking}</td> 
                <td>${item.username}</td> 
            </tr>
            `

        })
    }
}

async function search_card() {
    document.getElementById('table_data').innerHTML = "";
    var username = document.getElementById('username').value;
    var data = await search_history_topup_card(username);
    if (data) {
        data.forEach(item => {
            var d = new Date(Number(item.time * 1000 || 0));
            let y = d.getFullYear();
            let m = (d.getMonth() + 1) < 10 ? `0${d.getMonth() + 1}` : (d.getMonth() + 1);
            let dd = (d.getDate()) < 10 ? `0${d.getDate()}` : (d.getDate());
            var today = `${y}-${m}-${dd}`;
            switch (Number(item.Success )) {
                case 1:
                    var type_banking = '<span style="background-color: rgb(39, 174, 96);border-radius: 5px;padding: 3px; border-color: rgb(39, 174, 96);color:#fff !important">Success</span>'
                    break;
                default:
                    break;
            }
            document.getElementById('table_data').innerHTML += `
            <tr  class="table_admin">
                <td>${item.user_id}</td>    
                <td>${today}</td> 
                <td>${get_format_VND(item.money) || ''}</td> 
                <td>${item.Seri}</td>   
                <td>${item.Pin}</td>  
                <td>${type_banking}</td> 
                <td>${item.username}</td> 
            </tr>
            `

        })
    }
}