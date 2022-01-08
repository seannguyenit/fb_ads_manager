'use strict'
const path = require('path')

module.exports = {
    get_login_page: (req, res) => {
        res.sendFile(path.join(__dirname,'../../view/new_login.html'))
    },
    notice:  (req, res) => {
        res.sendFile(path.join(__dirname,'../../view/notice.html'))
    },
    page_box:  (req, res) => {
        res.sendFile(path.join(__dirname,'../../view/page_box.html'))
    },
    user:  (req, res) => {
        res.sendFile(path.join(__dirname,'../../view/user.html'))
    },
    user_info:  (req, res) => {
        res.sendFile(path.join(__dirname,'../../view/user_info.html'))
    },
    pricing_manager:  (req, res) => {
        res.sendFile(path.join(__dirname,'../../view/pricing_m.html'))
    },
    pricing_public:  (req, res) => {
        res.sendFile(path.join(__dirname,'../../view/pricing_public.html'))
    },
    // get_partial: (req,res)=>{
    //     let action = [req.params.action];
    //     res.sendFile(path.join(__dirname,`../../view/partial/${action}.html`))
    // },
}