'use strict'
init_data_history();

// get list data history_login
async function list_history_login() {
    var cr = get_cr_user();
    return await fetch(`/api/list_history_login/${cr.id}` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}

// show data history_login by ID 
async function init_data_history(){
    var rs = document.getElementById('tb_data');
    var data = await list_history_login();
    rs.innerHTML="";
    if(data){
        data.forEach(item => {
            rs.innerHTML += `
                <tr>
                    <td>${data.indexOf(item) + 1}</td>
                    <td>${item.username}</td>
                    <td>${item.action}</td>
                    <td>${new Date(Number(item.time * 1000 || 0)).toLocaleString()}</td>
                    <td>IP ${item.active || 0}</td>
                <tr>
            `;
        })
    }
}