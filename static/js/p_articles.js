'use strict'

// call api get articles
async function articles_get_all() {
    return await fetch(`/api/articles` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}

// show list data articles
async function init_articles(){
    main_table.innerHTML = '';
    var dt = await articles_get_all();
    if (dt) {
        dt.forEach(item => {
            main_table.innerHTML += `
                        <div class="box" style="padding:1vw">
                            <div  class="box-content">
                                <div class="box-left"><img style="border-radius: 50%;" width="50px" height="50px" src="../img/avatar.png" alt=""></div>
                                <div class="box-right"><span style="font-weight:bolder">${item.name}</span> 
                                        <p>${new Date(Number(item.time * 1000 || 0)).toLocaleString()}</p>
                                </div>
                            </div>
                            <div style="padding:1vw">
                                    <h5>${item.headline}</h5>
                                    <p>${item.content}</p>
                            </div>
                        </div                
        `;
        });
        // smoothy_ui_table();
        // if(Number(dt.length) != 0 ){
        //     showing.innerHTML = "Showing 1 to "+ dt.length + " of " + dt.length + " entries";
        // }
        // else{
        //     showing.innerHTML = "";
        // }
    }
}