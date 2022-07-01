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
                var link_video = item.video.slice(0, 24) + "embed/" + item.video.slice(24);
                document.getElementById("link_video").innerHTML +=`
                                <div class="col-md-6 ">
                                <div class="text_left pricing_benefit d-flex flex-column">
                                    <div class="container text_center">
                                    <iframe width="100%" height="300px" src="${link_video}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                    <p style="font-size: 24px !important;">${item.content_video} sssss</p>
                                    </div>
                                </div>
                        </div>
                `;
            }
            
            
        });

    }
}