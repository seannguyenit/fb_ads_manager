'use strict'
const path = require('path')

module.exports = {
    get_login_page: (req, res) => {
        res.sendFile(path.join(__dirname,'../../view/new_login.html'))
    },
    register: (req, res) => {
        res.sendFile(path.join(__dirname,'../../view/register.html'))
    },
    // get_partial: (req,res)=>{
    //     let action = [req.params.action];
    //     res.sendFile(path.join(__dirname,`../../view/partial/${action}.html`))
    // },
}