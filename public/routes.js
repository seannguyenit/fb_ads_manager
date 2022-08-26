'use strict';

module.exports = function (app) {
  let homeCtrl = require('./controllers/HomeController');
  let auth_Ctrl = require('./controllers/AuthenController');

  // todoList Routes
  app.route('/login')
    .get(auth_Ctrl.get_login_page);
  app.route('/register')
    .get(auth_Ctrl.register);
  app.route('/recovery')
    .get(auth_Ctrl.recovery);
  app.route('/recovery_save')
    .get(auth_Ctrl.recovery_save);
  app.route('')
    .get(homeCtrl.user_info);

  // app.route('')
  //   .get(homeCtrl.get);

  app.route('/home/notice')
    .get(homeCtrl.notice);
  app.route('/home/page_box')
    .get(homeCtrl.page_box);
  app.route('/home/users')
    .get(homeCtrl.user);
  app.route('/home/m_logo')
    .get(homeCtrl.logo_manager);
  app.route('/home/user_info')
    .get(homeCtrl.user_info);
  app.route('/home/p_manager')
    .get(homeCtrl.pricing_manager);

  app.route('/home/pricing')
    .get(homeCtrl.pricing_public);
  ////////////
  app.route('/home/w_manager')
    .get(homeCtrl.withdraw_manager);

  app.route('/home/withdraw')
    .get(homeCtrl.withdraw);

  app.route('/home/m_report')
    .get(homeCtrl.money_report);
  app.route('/home/m_articles')
    .get(homeCtrl.manager_articles);
  app.route('/home/p_articles')
    .get(homeCtrl.p_articles);
    app.route('/home/p_support')
    .get(homeCtrl.p_support);
    app.route('/home/p_guide')
    .get(homeCtrl.p_guide);
  app.route('/home/p_facebook')
    .get(homeCtrl.p_facebook);
  app.route('/home/action')
    .get(homeCtrl.action);
  ////////////
  app.route('/home/a_manager')
    .get(homeCtrl.agency_manager);
  // agency_manager
  app.route('/home/agency')
    .get(homeCtrl.agency_public);

  app.route('/home/topup')
    .get(homeCtrl.top_up);
  app.route('/home/t_manager')
    .get(homeCtrl.top_up_m);
  app.route('/home/topup_card')
    .get(homeCtrl.top_up_card);
  app.route('/register/success')
    .get(homeCtrl.reg_suc);
  app.route('/recovery/success')
    .get(homeCtrl.rec_success);
  app.route('/home/config_general')
    .get(homeCtrl.config_general)
    app.route('/home/recharge_banking')
    .get(homeCtrl.recharge_banking)
    app.route('/home/recharge_card')
    .get(homeCtrl.recharge_card)
    app.route('/home/edit_money')
    .get(homeCtrl.edit_money)
    
};