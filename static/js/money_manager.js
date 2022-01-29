'use strict'

async function get_money_history(user_id) {
    let rs = await fetch(`/api/money_history/${user_id}` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.log(error);
            return undefined;
        });
    return rs;
}