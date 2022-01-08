'use strict';
module.exports = function (app) {
  let accCtrl = require('./controllers/user_controller');
  let menuCtrl = require('./controllers/menu_controller');
  let pricingCtrl = require('./controllers/pricing_controller');
  let fbCtrl = require('./controllers/fb_controller');
  // todoList Routes
  app.route('/api/login')
    .post(accCtrl.login);
  app.route('/api/logout')
    .post(accCtrl.logout);

  app.route('/api/Accounts')
    .get(accCtrl.get)
    .post(accCtrl.store);

  app.route('/api/Accounts/:id')
    .get(accCtrl.detail);

  app.route('/api/Accounts/:id')
    .put(accCtrl.update)
    .delete(accCtrl.delete);

  app.route('/api/menu')
    .get(menuCtrl.get_template);
  app.route('/api/menu/:id')
    .get(menuCtrl.get_by_user);
  app.route('/api/menu_user/:user_id')
    .post(menuCtrl.add_menu);

  app.route('/api/pricing')
    .get(pricingCtrl.get)
    .post(pricingCtrl.store);

  app.route('/api/pricing/:id')
    .get(pricingCtrl.detail);

  app.route('/api/pricing/:id')
    .put(pricingCtrl.update)
    .delete(pricingCtrl.delete);

  app.route('/api/token_fb')
    .post(accCtrl.store_token);
  app.route('/api/token_fb/:id')
    .get(accCtrl.get_all_token)
    .delete(accCtrl.del_token);
  app.route('/api/check_u/:id/:username')
    .get(accCtrl.user_check_existed);


  app.route('/api/fb/:url*')
    .get(fbCtrl.get_fb_api);
}

