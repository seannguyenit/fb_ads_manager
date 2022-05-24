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

    async function init_date(){
        var to = document.getElementById('to_date').value;
        var from = document.getElementById('from_date').value;
        var date = document.getElementById('date_');
        var time_from = from;
        var time_to = to;
        if(from === ""){
            var now_t = new Date();
            var m = (now_t.getMonth() + 1) < 10 ? `0${now_t.getMonth() + 1}` : (now_t.getMonth() + 1);
            var y = now_t.getFullYear();
            var d = now_t.getDate() - 7;
            from = `${y}-${m}-1`;
            time_from = from;
                // alert(time_from);
                // return
        }
        if(to === ""){
            var now_t = new Date();
            var m = (now_t.getMonth() + 1) < 10 ? `0${now_t.getMonth() + 1}` : (now_t.getMonth() + 1);
            var y = now_t.getFullYear();
            var d = now_t.getDate();
            to = `${y}-${m}-${d}`;
            time_to = to;
        }
        // alert(from);
        // alert(time_to);
         date.innerHTML = `<span>từ ${time_from} đến ${time_to}</span>`;
    }
    
   
    async function search_report_moneybytime() {
        init_date()
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