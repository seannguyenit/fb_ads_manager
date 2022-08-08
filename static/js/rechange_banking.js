
init_topup_banking();
async function history_topup_banking() {
    return await fetch(`/api/his_banking` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}
async function search_history_topup_banking(username) {
    return await fetch(`/api/his_banking/${username}` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}

async function init_topup_banking() {
    var banking = document.getElementById('table_data');
    var data = await history_topup_banking();
    if (data) {
        data.forEach(item => {
            var d = new Date(Number(item.time * 1000 || 0));
            let y = d.getFullYear();
            let m = (d.getMonth() + 1) < 10 ? `0${d.getMonth() + 1}` : (d.getMonth() + 1);
            let dd = (d.getDate()) < 10 ? `0${d.getDate()}` : (d.getDate());
            var today = `${dd}/${m}/${y}`;
            switch (Number(item.procedure)) {
                case 1:
                    var type_banking = '<span style="background-color: rgb(39, 174, 96);border-radius: 5px;padding: 3px; border-color: rgb(39, 174, 96);color:#fff !important">Mb Bank</span>'
                    break;
                case 2:
                    var type_banking = '<span style="background-color: rgb(243, 156, 18);border-radius: 5px;padding: 3px; border-color: rgb243, 156, 18);color:#fff !important">Acb Bank</span>'
                    break;
                case 3:
                    var type_banking = '<span style="background-color: rgb(238, 99, 99);border-radius: 5px;padding: 3px; border-color: rgb(238, 99, 99);color:#fff !important">Momo</span>'
                    break;
                default:
                    break;
            }
            banking.innerHTML += `
            <tr  class="table_admin">
                <td>${item.user_id}</td>    
                <td>${today}</td> 
                <td>${type_banking}</td> 
                <td>${item.transactionID}</td> 
                <td>Không xác định</td>   
                <td>${get_format_VND(item.money) || ''}</td>  
                <td>Napthe${item.user_id}</td>
                <td>${item.username}</td> 
            </tr>
            `

        })
    }
}

async function search_banking() {
    document.getElementById('table_data').innerHTML = "";
    var username = document.getElementById('username').value;
    var data = await search_history_topup_banking(username);
    if (data) {
        data.forEach(item => {
            var d = new Date(Number(item.time * 1000 || 0));
            let y = d.getFullYear();
            let m = (d.getMonth() + 1) < 10 ? `0${d.getMonth() + 1}` : (d.getMonth() + 1);
            let dd = (d.getDate()) < 10 ? `0${d.getDate()}` : (d.getDate());
            var today = `${y}-${m}-${dd}`;
            switch (Number(item.procedure)) {
                case 1:
                    var type_banking = '<span style="background-color: rgb(39, 174, 96);border-radius: 5px;padding: 3px; border-color: rgb(39, 174, 96);color:#fff !important">Mb Bank</span>'
                    break;
                case 2:
                    var type_banking = '<span style="background-color: rgb(243, 156, 18);border-radius: 5px;padding: 3px; border-color: rgb243, 156, 18);color:#fff !important">Acb Bank</span>'
                    break;
                case 3:
                    var type_banking = '<span style="background-color: rgb(238, 99, 99);border-radius: 5px;padding: 3px; border-color: rgb(238, 99, 99);color:#fff !important">Momo</span>'
                    break;
                default:
                    break;
            }
            document.getElementById('table_data').innerHTML += `
           <tr  class="table_admin">
               <td>${item.user_id}</td>    
               <td>${today}</td> 
               <td>${type_banking}</td> 
               <td>${item.transactionID}</td> 
               <td>Không xác định</td>   
               <td>${get_format_VND(item.money) || ''}</td>  
               <td>Napthe${item.user_id}</td>
               <td>${item.username}</td> 
           </tr>
           `

        })
    }
}