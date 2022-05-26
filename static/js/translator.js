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
        var all_ = Object.keys(lib);
        all_.forEach(f => {
            document.body.innerHTML = document.body.innerHTML.replaceAll(`{${f.replaceAll('_',' ')}}`, lib[`${f}`]);
        });
    }
}

