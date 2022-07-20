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
async function init_articles() {
    main_table.innerHTML = '';
    var dt = await articles_get_all();
    if (dt) {
        dt.forEach(item => {
            if (item.video) {
                main_table.innerHTML += '';
            } else {
                // <div style=" box-shadow: 0 5px 15px 5px rgb(80 102 224/8%) !important;padding:1vw;" class="mb-3 box_articles">
                //     <div class="with100 box-content">
                //         <div class="box-left"><img style="border-radius: 50%;" width="50px" height="50px" src="../img/avatar.png" alt=""></div>
                //         <div class="box-right"><span style="font-weight:bolder">${item.name}</span> 
                //                 <p>${new Date(Number(item.time * 1000 || 0)).toLocaleString()}</p>
                //         </div>
                //     </div>
                //     <div class="with100" style="padding:1vw">
                //             <h5>${item.headline}</h5>
                //             <p>
                //             <textarea disabled class="form-control input_user none_from" name="contacts" id="" value="" cols="60" rows="5"
                //             >${item.content}</textarea>
                //             </p>
                //     </div>
                // </div   
                main_table.innerHTML += `
                
                
                <div style="margin-bottom: 20px;" class="rounded-lg pb-1 v-card v-sheet theme--light"
                                                    style="box-shadow: rgba(80, 102, 224, 0.08) 0px 5px 15px 5px; width: 100%;">
                                                    <div class="d-flex align-center pa-3">
                                                        <div class="d-flex align-center"><img
                                                                src="../img/user-btv.png" alt=""
                                                                width="60px" height="60px"></div>
                                                        <div class="ml-3">
                                                            <div class="d-flex align-center"><span
                                                                    class="blue--text">${item.name}</span> <i
                                                                    aria-hidden="true"
                                                                    class="v-icon notranslate ml-1 textTime fas fa-check-circle theme--light"
                                                                    style="font-size: 14px; color: rgb(24, 119, 242); caret-color: rgb(24, 119, 242);"></i>
                                                            </div>
                                                            <div class="d-flex align-center">
                                                                <div><span class="textTime">${new Date(Number(item.time * 1000 || 0)).toLocaleString()}</span></div>
                                                                <div class="ml-1 d-flex align-center"><svg
                                                                        aria-hidden="true" focusable="false"
                                                                        data-prefix="fas" data-icon="globe-americas"
                                                                        role="img" xmlns="http://www.w3.org/2000/svg"
                                                                        viewBox="0 0 496 512" data-fa-i2svg=""
                                                                        class="svg-inline--fa fa-globe-americas fa-w-16"
                                                                        style="width: 0.8em;">
                                                                        <path fill="currentColor"
                                                                            d="M248 8C111.03 8 0 119.03 0 256s111.03 248 248 248 248-111.03 248-248S384.97 8 248 8zm82.29 357.6c-3.9 3.88-7.99 7.95-11.31 11.28-2.99 3-5.1 6.7-6.17 10.71-1.51 5.66-2.73 11.38-4.77 16.87l-17.39 46.85c-13.76 3-28 4.69-42.65 4.69v-27.38c1.69-12.62-7.64-36.26-22.63-51.25-6-6-9.37-14.14-9.37-22.63v-32.01c0-11.64-6.27-22.34-16.46-27.97-14.37-7.95-34.81-19.06-48.81-26.11-11.48-5.78-22.1-13.14-31.65-21.75l-.8-.72a114.792 114.792 0 0 1-18.06-20.74c-9.38-13.77-24.66-36.42-34.59-51.14 20.47-45.5 57.36-82.04 103.2-101.89l24.01 12.01C203.48 89.74 216 82.01 216 70.11v-11.3c7.99-1.29 16.12-2.11 24.39-2.42l28.3 28.3c6.25 6.25 6.25 16.38 0 22.63L264 112l-10.34 10.34c-3.12 3.12-3.12 8.19 0 11.31l4.69 4.69c3.12 3.12 3.12 8.19 0 11.31l-8 8a8.008 8.008 0 0 1-5.66 2.34h-8.99c-2.08 0-4.08.81-5.58 2.27l-9.92 9.65a8.008 8.008 0 0 0-1.58 9.31l15.59 31.19c2.66 5.32-1.21 11.58-7.15 11.58h-5.64c-1.93 0-3.79-.7-5.24-1.96l-9.28-8.06a16.017 16.017 0 0 0-15.55-3.1l-31.17 10.39a11.95 11.95 0 0 0-8.17 11.34c0 4.53 2.56 8.66 6.61 10.69l11.08 5.54c9.41 4.71 19.79 7.16 30.31 7.16s22.59 27.29 32 32h66.75c8.49 0 16.62 3.37 22.63 9.37l13.69 13.69a30.503 30.503 0 0 1 8.93 21.57 46.536 46.536 0 0 1-13.72 32.98zM417 274.25c-5.79-1.45-10.84-5-14.15-9.97l-17.98-26.97a23.97 23.97 0 0 1 0-26.62l19.59-29.38c2.32-3.47 5.5-6.29 9.24-8.15l12.98-6.49C440.2 193.59 448 223.87 448 256c0 8.67-.74 17.16-1.82 25.54L417 274.25z"
                                                                            class="icon-css"></path>
                                                                    </svg></div>
                                                            </div>
                                                            
                                                        </div>
                                                      
                                                    </div>
                                                    <div class="px-3">
                                                    <h5>${item.headline}</h5>
                                                    <textarea disabled class="form-control input_user none_from" name="contacts" id="" value="" cols="60" rows="5"
                                                    >${item.content}</textarea>
                                                    
                                                    </div>
                                                    
                                                    <hr role="separator" aria-orientation="horizontal"
                                                        class="my-2 v-divider theme--light">
                                                    <div class="px-3">
                                                        <div class="my-2 d-flex align-center">
                                                            <div class="d-flex align-center"><img height="20"
                                                                    src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 16 16'%3e%3cdefs%3e%3clinearGradient id='a' x1='50%25' x2='50%25' y1='0%25' y2='100%25'%3e%3cstop offset='0%25' stop-color='%2318AFFF'/%3e%3cstop offset='100%25' stop-color='%230062DF'/%3e%3c/linearGradient%3e%3cfilter id='c' width='118.8%25' height='118.8%25' x='-9.4%25' y='-9.4%25' filterUnits='objectBoundingBox'%3e%3cfeGaussianBlur in='SourceAlpha' result='shadowBlurInner1' stdDeviation='1'/%3e%3cfeOffset dy='-1' in='shadowBlurInner1' result='shadowOffsetInner1'/%3e%3cfeComposite in='shadowOffsetInner1' in2='SourceAlpha' k2='-1' k3='1' operator='arithmetic' result='shadowInnerInner1'/%3e%3cfeColorMatrix in='shadowInnerInner1' values='0 0 0 0 0 0 0 0 0 0.299356041 0 0 0 0 0.681187726 0 0 0 0.3495684 0'/%3e%3c/filter%3e%3cpath id='b' d='M8 0a8 8 0 00-8 8 8 8 0 1016 0 8 8 0 00-8-8z'/%3e%3c/defs%3e%3cg fill='none'%3e%3cuse fill='url(%23a)' xlink:href='%23b'/%3e%3cuse fill='black' filter='url(%23c)' xlink:href='%23b'/%3e%3cpath fill='white' d='M12.162 7.338c.176.123.338.245.338.674 0 .43-.229.604-.474.725a.73.73 0 01.089.546c-.077.344-.392.611-.672.69.121.194.159.385.015.62-.185.295-.346.407-1.058.407H7.5c-.988 0-1.5-.546-1.5-1V7.665c0-1.23 1.467-2.275 1.467-3.13L7.361 3.47c-.005-.065.008-.224.058-.27.08-.079.301-.2.635-.2.218 0 .363.041.534.123.581.277.732.978.732 1.542 0 .271-.414 1.083-.47 1.364 0 0 .867-.192 1.879-.199 1.061-.006 1.749.19 1.749.842 0 .261-.219.523-.316.666zM3.6 7h.8a.6.6 0 01.6.6v3.8a.6.6 0 01-.6.6h-.8a.6.6 0 01-.6-.6V7.6a.6.6 0 01.6-.6z'/%3e%3c/g%3e%3c/svg%3e"
                                                                    width="20" class="j1lvzwm4"> <img height="20"
                                                                    src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 16 16'%3e%3cdefs%3e%3clinearGradient id='a' x1='50%25' x2='50%25' y1='10.25%25' y2='100%25'%3e%3cstop offset='0%25' stop-color='%23FEEA70'/%3e%3cstop offset='100%25' stop-color='%23F69B30'/%3e%3c/linearGradient%3e%3clinearGradient id='d' x1='50%25' x2='50%25' y1='0%25' y2='100%25'%3e%3cstop offset='0%25' stop-color='%23472315'/%3e%3cstop offset='100%25' stop-color='%238B3A0E'/%3e%3c/linearGradient%3e%3clinearGradient id='e' x1='50%25' x2='50%25' y1='0%25' y2='81.902%25'%3e%3cstop offset='0%25' stop-color='%23FC607C'/%3e%3cstop offset='100%25' stop-color='%23D91F3A'/%3e%3c/linearGradient%3e%3cfilter id='c' width='118.8%25' height='118.8%25' x='-9.4%25' y='-9.4%25' filterUnits='objectBoundingBox'%3e%3cfeGaussianBlur in='SourceAlpha' result='shadowBlurInner1' stdDeviation='1'/%3e%3cfeOffset dy='-1' in='shadowBlurInner1' result='shadowOffsetInner1'/%3e%3cfeComposite in='shadowOffsetInner1' in2='SourceAlpha' k2='-1' k3='1' operator='arithmetic' result='shadowInnerInner1'/%3e%3cfeColorMatrix in='shadowInnerInner1' values='0 0 0 0 0.921365489 0 0 0 0 0.460682745 0 0 0 0 0 0 0 0 0.35 0'/%3e%3c/filter%3e%3cpath id='b' d='M16 8A8 8 0 110 8a8 8 0 0116 0'/%3e%3c/defs%3e%3cg fill='none'%3e%3cuse fill='url(%23a)' xlink:href='%23b'/%3e%3cuse fill='black' filter='url(%23c)' xlink:href='%23b'/%3e%3cpath fill='url(%23d)' d='M3 8.008C3 10.023 4.006 14 8 14c3.993 0 5-3.977 5-5.992C13 7.849 11.39 7 8 7c-3.39 0-5 .849-5 1.008'/%3e%3cpath fill='url(%23e)' d='M4.541 12.5c.804.995 1.907 1.5 3.469 1.5 1.563 0 2.655-.505 3.459-1.5-.551-.588-1.599-1.5-3.459-1.5s-2.917.912-3.469 1.5'/%3e%3cpath fill='%232A3755' d='M6.213 4.144c.263.188.502.455.41.788-.071.254-.194.369-.422.371-.78.011-1.708.255-2.506.612-.065.029-.197.088-.332.085-.124-.003-.251-.058-.327-.237-.067-.157-.073-.388.276-.598.545-.33 1.257-.48 1.909-.604a7.077 7.077 0 00-1.315-.768c-.427-.194-.38-.457-.323-.6.127-.317.609-.196 1.078.026a9 9 0 011.552.925zm3.577 0a8.953 8.953 0 011.55-.925c.47-.222.95-.343 1.078-.026.057.143.104.406-.323.6a7.029 7.029 0 00-1.313.768c.65.123 1.363.274 1.907.604.349.21.342.44.276.598-.077.18-.203.234-.327.237-.135.003-.267-.056-.332-.085-.797-.357-1.725-.6-2.504-.612-.228-.002-.351-.117-.422-.37-.091-.333.147-.6.41-.788z'/%3e%3c/g%3e%3c/svg%3e"
                                                                    width="20" class="j1lvzwm4 ml-1"> <img height="20"
                                                                    src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 16 16'%3e%3cdefs%3e%3clinearGradient id='a' x1='50%25' x2='50%25' y1='0%25' y2='100%25'%3e%3cstop offset='0%25' stop-color='%23FF6680'/%3e%3cstop offset='100%25' stop-color='%23E61739'/%3e%3c/linearGradient%3e%3cfilter id='c' width='118.8%25' height='118.8%25' x='-9.4%25' y='-9.4%25' filterUnits='objectBoundingBox'%3e%3cfeGaussianBlur in='SourceAlpha' result='shadowBlurInner1' stdDeviation='1'/%3e%3cfeOffset dy='-1' in='shadowBlurInner1' result='shadowOffsetInner1'/%3e%3cfeComposite in='shadowOffsetInner1' in2='SourceAlpha' k2='-1' k3='1' operator='arithmetic' result='shadowInnerInner1'/%3e%3cfeColorMatrix in='shadowInnerInner1' values='0 0 0 0 0.710144928 0 0 0 0 0 0 0 0 0 0.117780134 0 0 0 0.349786932 0'/%3e%3c/filter%3e%3cpath id='b' d='M8 0a8 8 0 100 16A8 8 0 008 0z'/%3e%3c/defs%3e%3cg fill='none'%3e%3cuse fill='url(%23a)' xlink:href='%23b'/%3e%3cuse fill='black' filter='url(%23c)' xlink:href='%23b'/%3e%3cpath fill='white' d='M10.473 4C8.275 4 8 5.824 8 5.824S7.726 4 5.528 4c-2.114 0-2.73 2.222-2.472 3.41C3.736 10.55 8 12.75 8 12.75s4.265-2.2 4.945-5.34c.257-1.188-.36-3.41-2.472-3.41'/%3e%3c/g%3e%3c/svg%3e"
                                                                    width="20" class="j1lvzwm4 ml-1"></div> <span
                                                                class="ml-2">999K</span>
                                                        </div>
                                                        <hr role="separator" aria-orientation="horizontal"
                                                            class="v-divider theme--light">
                                                        <div class="d-flex justify-space-around my-2">
                                                            <div class="d-flex align-center"><svg stroke="currentColor"
                                                                    fill="currentColor" stroke-width="0"
                                                                    viewBox="0 0 1024 1024" height="0.8em" width="0.8em"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    style="font-size: 24px; color: rgb(108, 117, 125); vertical-align: -4px;">
                                                                    <path
                                                                        d="M885.9 533.7c16.8-22.2 26.1-49.4 26.1-77.7 0-44.9-25.1-87.4-65.5-111.1a67.67 67.67 0 0 0-34.3-9.3H572.4l6-122.9c1.4-29.7-9.1-57.9-29.5-79.4A106.62 106.62 0 0 0 471 99.9c-52 0-98 35-111.8 85.1l-85.9 311H144c-17.7 0-32 14.3-32 32v364c0 17.7 14.3 32 32 32h601.3c9.2 0 18.2-1.8 26.5-5.4 47.6-20.3 78.3-66.8 78.3-118.4 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7-.2-12.6-2-25.1-5.6-37.1zM184 852V568h81v284h-81zm636.4-353l-21.9 19 13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 16.5-7.2 32.2-19.6 43l-21.9 19 13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 16.5-7.2 32.2-19.6 43l-21.9 19 13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 22.4-13.2 42.6-33.6 51.8H329V564.8l99.5-360.5a44.1 44.1 0 0 1 42.2-32.3c7.6 0 15.1 2.2 21.1 6.7 9.9 7.4 15.2 18.6 14.6 30.5l-9.6 198.4h314.4C829 418.5 840 436.9 840 456c0 16.5-7.2 32.1-19.6 43z">
                                                                    </path>
                                                                </svg> <span class="ml-1 textTime">Thích</span></div>
                                                            <div class="d-flex align-center"><svg stroke="currentColor"
                                                                    fill="currentColor" stroke-width="0"
                                                                    viewBox="0 0 24 24" height="0.8em" width="0.8em"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    style="font-size: 24px; color: rgb(108, 117, 125);">
                                                                    <path
                                                                        d="M20,2H4C2.897,2,2,2.897,2,4v18l5.333-4H20c1.103,0,2-0.897,2-2V4C22,2.897,21.103,2,20,2z M20,16H6.667L4,18V4h16V16z">
                                                                    </path>
                                                                </svg> <span class="ml-1 textTime">Bình luận</span>
                                                            </div>
                                                            <div class="d-flex align-center"><svg stroke="currentColor"
                                                                    fill="currentColor" stroke-width="0"
                                                                    viewBox="0 0 16 16" height="0.8em" width="0.8em"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    style="font-size: 24px; color: rgb(108, 117, 125); vertical-align: -4px;">
                                                                    <path fill-rule="evenodd"
                                                                        d="M9.502 5.013a.144.144 0 00-.202.134V6.3a.5.5 0 01-.5.5c-.667 0-2.013.005-3.3.822-.984.624-1.99 1.76-2.595 3.876C3.925 10.515 5.09 9.982 6.11 9.7a8.741 8.741 0 011.921-.306 7.403 7.403 0 01.798.008h.013l.005.001h.001L8.8 9.9l.05-.498a.5.5 0 01.45.498v1.153c0 .108.11.176.202.134l3.984-2.933a.494.494 0 01.042-.028.147.147 0 000-.252.494.494 0 01-.042-.028L9.502 5.013zM8.3 10.386a7.745 7.745 0 00-1.923.277c-1.326.368-2.896 1.201-3.94 3.08a.5.5 0 01-.933-.305c.464-3.71 1.886-5.662 3.46-6.66 1.245-.79 2.527-.942 3.336-.971v-.66a1.144 1.144 0 011.767-.96l3.994 2.94a1.147 1.147 0 010 1.946l-3.994 2.94a1.144 1.144 0 01-1.767-.96v-.667z"
                                                                        clip-rule="evenodd"></path>
                                                                </svg> <span class="ml-1 textTime">Chia sẻ</span></div>
                                                        </div>
                                                        <hr role="separator" aria-orientation="horizontal"
                                                            class="v-divider theme--light">
                                                        <div class="my-3">
                                                            <div id="hideBottomInput" class="d-flex align-center">
                                                                <div class="d-flex align-center"><img
                                                                        src="../img/user-comment.png" alt=""
                                                                        width="40px" height="40px"></div>
                                                                <div class="ml-2 inputComment"
                                                                    style="width: 100%; position: relative;">
                                                                    <div
                                                                        class="v-input rounded-xl v-input--dense theme--light v-text-field v-text-field--is-booted v-text-field--enclosed v-text-field--outlined v-text-field--placeholder">
                                                                        <div class="v-input__control">
                                                                            <div class="v-input__slot"
                                                                                style="height: 40px; background-color: rgb(230, 235, 244); border-color: rgb(230, 235, 244);">
                                                                                <fieldset aria-hidden="true">
                                                                                    <legend style="width: 0px;"><span
                                                                                            class="notranslate">​</span>
                                                                                    </legend>
                                                                                </fieldset>
                                                                                <div class="v-text-field__slot"><input style="background-color: rgb(230, 235, 244) !important; color:black !important;"
                                                                                        id="input-97"
                                                                                        placeholder="Viết bình luận..."
                                                                                        type="text"></div>
                                                                            </div>
                                                                            <div class="v-text-field__details">
                                                                                <div class="v-messages theme--light">
                                                                                    <div class="v-messages__wrapper">
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

`;
            }


        });

    }
}

function open_modal() {
    $('#contacts_ticket').modal('show');
}

async function save_ticket() {
    var cr_u = get_cr_user();
    var user_id = cr_u.id;
    var content = $('#contacts').val();

    var rs = await ticket_save_({ user_id: user_id, content: content });
    alert('Đẫ Gửi Yêu Cầu Thành Công !');
    $('#contacts_ticket').modal('hide');
}

async function ticket_save_(data) {
    return await fetch('/api/contacts_ticket', {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            if (data != undefined) {
                return data || {};
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function model_pricing(){
    window.location.href = 'pricing';
}


