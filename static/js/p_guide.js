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
                                <div class="col-md-6 pd0">
                                <div style="background-color: #fff;box-shadow: rgba(80, 102, 224, 0.08) 0px 5px 15px 5px;"  class="text_left mr_t_b10 mb-3 font-weight-550 pricing_benefit pd0 d-flex flex-column">
                                    <div class="pd0 text_center">
                                    <iframe width="100%" height="300px" src="${link_video}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                    <p style="font-size: 24px !important;">${item.content_video}</p>
                                    </div>
                                </div>
                        </div>
                `;
            }
            
            
        });

    }
}