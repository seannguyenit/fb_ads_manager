'use strict'

translator();

async function translator() {
    //get js current lang
    var crr_lang = getCookie('lang') || 'vi';
    var lib = await fetch(`/api/lang_lib/${crr_lang}` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
    if (lib) {
        Array.from(document.querySelectorAll('[data-lang]')).forEach(obj => {
            if (obj.dataset.langtg) {
                obj.setAttribute(obj.dataset.langtg, lib[`${obj.dataset.lang.replaceAll(' ', '_')}`]);
            } else {
                var new_str = lib[`${obj.dataset.lang.replaceAll(' ', '_')}`];
                if(new_str){
                    obj.innerText = new_str;
                }
            }
        });
    }
    if(crr_lang === "en"){
        if(document.getElementById('img_lang')){
            document.getElementById('img_lang').innerHTML=`<img width="15px" style="height: auto;
            margin-bottom: 4px;" 
            src="../img/us.png" alt="">`;
        }
        if(document.getElementById('img_lang_mobie')){
            document.getElementById('img_lang_mobie').innerHTML=`<img width="15px" style="height: auto;
            margin-bottom: 4px;" 
            src="../img/us.png" alt="">`;
        }
       
    }
    else{
        if(document.getElementById('img_lang')){
            document.getElementById('img_lang').innerHTML=`<img width="15px" style="height: auto;
            margin-bottom: 4px;" 
            src="../img/vnn.png" alt="">`;
        }
        if(document.getElementById('img_lang_mobie')){
            document.getElementById('img_lang_mobie').innerHTML=`<img width="15px" style="height: auto;
            margin-bottom: 4px;" 
            src="../img/vnn.png" alt="">`;
        }
       
    }
}

