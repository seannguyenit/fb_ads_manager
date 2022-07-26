function open_menu_admin_mobile() {
    let as = document.querySelector('aside');
    if(as.style.left === '0px'){
        as.style.left = '';
    }else{
        as.style.left = '0px';
    }

}

function dick_play_block(){
    if( document.getElementById('menu_money').style.display === 'block'){
        document.getElementById('menu_money').style.display='none'
    }else{
        document.getElementById('menu_money').style.display='block'
    }
    
}

function dick_play_block__(){
    if( document.getElementById('menu_').style.display === 'block'){
        document.getElementById('menu_').style.display='none'
    }else{
        document.getElementById('menu_').style.display='block'
    }
    
}