'use strict';

module.exports = function (app) {
  let homeCtrl = require('./controllers/HomeController');
  let auth_Ctrl = require('./controllers/AuthenController');

  // todoList Routes
  app.route('/login')
    .get(auth_Ctrl.get_login_page);
  app.route('/register')
    .get(auth_Ctrl.register);
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
  app.route('/home/user_info')
    .get(homeCtrl.user_info);
  app.route('/home/pricing_manager')
    .get(homeCtrl.pricing_manager);

  app.route('/home/pricing')
    .get(homeCtrl.pricing_public);

  app.route('/home/agency_manager')
    .get(homeCtrl.agency_manager);
    app.route('/home/agency')
    .get(homeCtrl.agency_public);

  app.route('/home/topup')
    .get(homeCtrl.top_up);
};