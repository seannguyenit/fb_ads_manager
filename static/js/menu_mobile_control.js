


document.getElementById('cover_menu').addEventListener('click', () => {
    close_menu();
})

document.getElementById('menu_control').addEventListener('click', () => {
    let as = document.querySelector('aside');
    if (as.classList.contains('v-navigation-drawer--open')) {
        close_menu();
    } else {
        open_menu();
    }
})


function open_menu() {
    let as = document.querySelector('aside');
    as.classList.replace('v-navigation-drawer--close', 'v-navigation-drawer--open');
    as.style.transform = 'translateX(0%)';
    document.getElementById('cover_menu').style.display = 'block'
}

function close_menu() {
    let as = document.querySelector('aside');
    as.classList.replace('v-navigation-drawer--open', 'v-navigation-drawer--close');
    as.style.transform = 'translateX(-100%)';
    document.getElementById('cover_menu').style.display = 'none'
}