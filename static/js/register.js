'use strict'

async function check_username() {
    var id = get_cr_user().id;
    var user_name = $('#user').val();
    var rs = await user_check_existed(id, user_name);
    if (!rs) return false;
    if (rs.existed > 0) return false;
    return true;
}

async function user_check_existed(id, username) {
    // var cr_u = get_cr_user();
    return await fetch(`/api/check_u/${id}/${username}` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data[0];
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}