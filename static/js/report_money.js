search_report_moneybytime();
    async function get_all_money(time_from,time_to) {
        return await fetch(`/api/agency_allmoney/${time_from}/${time_to}` /*, options */)
            .then((response) => response.json())
            .then((data) => {
                return data;
            })
            .catch((error) => {
                console.warn(error);
                return undefined;
            });
    }
   
    async function search_report_moneybytime() {
        var to = document.getElementById('to_date').value;
        var from = document.getElementById('from_date').value;
        // var time_from1 = new Date(from).getTime()/1000;
        // var time_to1 = new Date(to).getTime()/1000;
        var time_from = Number(new Date(from).getTime()/1000);
        var time_to = Number(new Date(to).getTime()/1000);
        if(from === ""){
            var now_t = new Date();
            var m = (now_t.getMonth() + 1) < 10 ? `0${now_t.getMonth() + 1}` : (now_t.getMonth() + 1);
            var y = now_t.getFullYear();
            from = `${y}-${m}-01`;
            time_from = Number(new Date(from).getTime()/1000);
            // alert(time_from);
            // return
        }
        if(to === ""){
            time_to =  Number(new Date().getTime() / 1000);
        }
        // else{
        //     to = `${to} 10:00 PM`
        //     time_to = Number(new Date(to).getTime()/1000);
        //     alert(to);
        //     return;
        // }
        var data = await get_all_money(time_from,time_to);
       
        main_table.innerHTML = '';
        if (data) {
            data.forEach(f => {
                main_table.innerHTML += `
                <tr>
                    <td>${get_format_VND(f.all_money) || 0} VNĐ</td>
                    <td>${get_format_VND(f.all_bonus)||0} VNĐ </td>
                    <td>${get_format_VND(f.all_withdraw_money)||0} VNĐ</td>
                </tr>`
            })
        }
    }