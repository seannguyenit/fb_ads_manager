
document.getElementById('cover_menu').addEventListener('click', () => {
    open_menu_admin_mobile();
})
function open_menu_admin_mobile() {
    let as = document.querySelector('aside');
    if(as.style.left === '0px'){
        as.style.left = '';
        document.getElementById('cover_menu').style.display = 'none'
    }else{
        as.style.left = '0px';
        document.getElementById('cover_menu').style.display = 'block'
    }

}

function dick_play_block(){
    if( document.getElementById('menu_money').style.display === 'block'){
        document.getElementById('menu_money').style.display='none'
    }else{
        document.getElementById('menu_money').style.display='block'
    }
    
}

function dick_play_block_banking(){
    if( document.getElementById('menu_bank').style.display === 'block'){
        document.getElementById('menu_bank').style.display='none'
    }else{
        document.getElementById('menu_bank').style.display='block'
    }
    
}

function dick_play_block__(){
    if( document.getElementById('menu_').style.display === 'block'){
        document.getElementById('menu_').style.display='none'
    }else{
        document.getElementById('menu_').style.display='block'
    }
    
}