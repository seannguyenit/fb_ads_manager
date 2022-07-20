'use strict'
init_guide()

// call api get guide
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

// show list data guide
async function init_guide() {
    var dt = await articles_get_all();
    if (dt) {
        dt.forEach(item => {
            if(item.video){
                var number =item.video.indexOf('youtube.com');
                var number2 =item.video.indexOf('watch?');
                var link_video = item.video.slice(0, (number + 12)) + "embed/" + item.video.slice((number2 + 8));
                document.getElementById("link_video").innerHTML +=`

                        <div class="pa-3 col-sm-4 col-12">
                        <div class="rounded-lg mb-8 card-tutorials v-card v-sheet theme--light"
                            id="scrollTable"><iframe
                                src="${link_video}"
                                title="YouTube video player" frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen="allowfullscreen"
                                style="width: 100%; height: 300px;"></iframe>
                            <div class="pa-4">
                                <h5 class="font-weight-bold">${item.content_video}</h5>
                                <div class="d-flex mt-4 text-footer"><i aria-hidden="true"
                                        class="v-icon notranslate mdi mdi-account theme--light"
                                        style="color: rgb(51, 152, 220); caret-color: rgb(51, 152, 220);"></i><span
                                        class="blue--text lighten-3"><a
                                            href="#" target="_blank"
                                            class="text-decoration-none ml-1">
                                            M2v.me
                                        </a></span></div>
                            </div>
                        </div>
                    </div>
                `;
            }
            
            
        });

    }
}

function model_pricing(){
    window.location.href = 'pricing';
}

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