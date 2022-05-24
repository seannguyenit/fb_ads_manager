'use strict'

const axios = require('axios');

module.exports = {
    get: async (url) => {
        return axios.get(url);
    },
    post: async (url, data) => {
        // maxBodyLength: Infinity;
        var ins = axios.create({
            maxBodyLength: Infinity,
            headers: data.getHeaders()
          });
        return ins.post(url, data).then(function (response) {
            // console.log(response);
            return response.data;
        })
            .catch(function (error) {
                // console.log(error);
                return error;
            });
    }
}