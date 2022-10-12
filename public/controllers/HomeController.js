'use strict'
const path = require('path')

module.exports = {
    get_login_page: (req, res) => {
        res.sendFile(path.join(__dirname, '../../view/new_login.html'))
    },
    reg_suc: (req, res) => {
        res.sendFile(path.join(__dirname, '../../view/reg_success.html'))
    },
    rec_success: (req, res) => {
        res.sendFile(path.join(__dirname, '../../view/rec_success.html'))
    },
    notice: (req, res) => {
        res.sendFile(path.join(__dirname, '../../view/notice.html'))
    },
    page_box: (req, res) => {
        res.sendFile(path.join(__dirname, '../../view/page_box.html'))
    },
    user: (req, res) => {
        res.sendFile(path.join(__dirname, '../../view/user.html'))
    },
    logo_manager: (req, res) => {
        res.sendFile(path.join(__dirname, '../../view/manager_logo.html'))
    },
    user_info: (req, res) => {
        res.sendFile(path.join(__dirname, '../../view/user_info.html'))
    },
    pricing_manager: (req, res) => {
        res.sendFile(path.join(__dirname, '../../view/pricing_m.html'))
    },
    tool_manager: (req, res) => {
        res.sendFile(path.join(__dirname, '../../view/tool_manager.html'))
    },
    pricing_public: (req, res) => {
        res.sendFile(path.join(__dirname, '../../view/pricing_public.html'))
    },
    agency_manager: (req, res) => {
        res.sendFile(path.join(__dirname, '../../view/agency_m.html'))
    },
    ///////////
    withdraw_manager: (req, res) => {
        res.sendFile(path.join(__dirname, '../../view/agency_w.html'))
    },

    withdraw: (req, res) => {
        res.sendFile(path.join(__dirname, '../../view/withdraw_money.html'))
    },
    //////////
    agency_public: (req, res) => {
        res.sendFile(path.join(__dirname, '../../view/agency_p.html'))
    },
    top_up: (req, res) => {
        res.sendFile(path.join(__dirname, '../../view/topup.html'))
    },
    top_up_card: (req, res) => {
        res.sendFile(path.join(__dirname, '../../view/topup_directly.html'))
    },
    top_up_m: (req, res) => {
        res.sendFile(path.join(__dirname, '../../view/money_manager.html'))
    },
    money_report: (req, res) => {
        res.sendFile(path.join(__dirname, '../../view/report_money.html'))
    },
    manager_articles: (req, res) => {
        res.sendFile(path.join(__dirname, '../../view/m_articles.html'))
    },
    p_articles: (req, res) => {
        res.sendFile(path.join(__dirname, '../../view/p_articles.html'))
    },
    p_support: (req, res) => {
        res.sendFile(path.join(__dirname, '../../view/p_support.html'))
    },
    p_guide: (req, res) => {
        res.sendFile(path.join(__dirname, '../../view/p_guide.html'))
    },
    p_facebook: (req, res) => {
        res.sendFile(path.join(__dirname, '../../view/p_facebook.html'))
    },
    action: (req, res) => {
        res.sendFile(path.join(__dirname, '../../view/action.html'))
    },
    config_general: (req, res) => {
        res.sendFile(path.join(__dirname, '../../view/config_general.html'))
    },
    recharge_banking: (req, res) => {
        res.sendFile(path.join(__dirname, '../../view/recharge_banking.html'))
    },
    recharge_card: (req, res) => {
        res.sendFile(path.join(__dirname, '../../view/recharge_card.html'))
    },
    edit_money: (req, res) => {
        res.sendFile(path.join(__dirname, '../../view/edit_money.html'))
    }

    
    // get_partial: (req,res)=>{
    //     let action = [req.params.action];
    //     res.sendFile(path.join(__dirname,`../../view/partial/${action}.html`))
    // },
}