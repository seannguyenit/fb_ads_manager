'use strict';
module.exports = function (app) {
  let accCtrl = require('./controllers/user_controller');
  let menuCtrl = require('./controllers/menu_controller');
  let pricingCtrl = require('./controllers/pricing_controller');
  let fbCtrl = require('./controllers/fb_controller');
  let moneyCtrl = require('./controllers/money_controller');

  app.route('/api/login')
    .post(accCtrl.login);
  app.route('/api/logout')
    .post(accCtrl.logout);

  app.route('/api/Accounts')
    .get(accCtrl.get)
    .post(accCtrl.store);

  app.route('/api/Accounts/:id')
    .get(accCtrl.detail);

  app.route('/api/reg_acc')
    .post(accCtrl.register)

  app.route('/account/activate/:key_active')
    .get(accCtrl.active_email)

  app.route('/api/change_acc/:id')
    .put(accCtrl.change_pass)

  app.route('/api/finance/:id')
    .get(accCtrl.get_current_finance)

  app.route('/api/Accounts/:id')
    .put(accCtrl.update)
    .delete(accCtrl.delete);

  app.route('/api/agency')
    .get(accCtrl.get_all_agency)
  app.route('/api/agency_reg')
    .get(accCtrl.get_all_agency_reg)

  app.route('/api/agency_child/:id')
    .get(accCtrl.get_agency_child)

  app.route('/api/agency_count/:id')
    .get(accCtrl.get_agency_count)

  app.route('/api/agency/:id')
    .get(accCtrl.get_agency_info)
    .put(accCtrl.agency_reg);

  app.route('/api/agency_m/:id')
    .put(accCtrl.agency_app);

  app.route('/api/menu')
    .get(menuCtrl.get_template);
  app.route('/api/menu/:id')
    .get(menuCtrl.get_by_user);
  app.route('/api/menu_user/:user_id')
    .post(menuCtrl.add_menu);

  app.route('/api/pricing_public/:user_id')
    .get(pricingCtrl.pricing_histories);

  app.route('/api/pricing_public')
    .post(pricingCtrl.order_pricing);

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

  app.route('/api/start_request')
    .post(accCtrl.start_request);
  app.route('/api/end_request/:time')
    .post(accCtrl.end_request);

  app.route('/api/fb/:url*')
    .get(fbCtrl.get_fb_api);

  app.route('/api/config')
    .get(menuCtrl.get_all_config);

  app.route('/api/config/:id')
    .put(menuCtrl.update_config);

  app.route('/api/money_ticket')
    .post(moneyCtrl.add_money);
  app.route('/api/money_history/:user_id')
    .get(moneyCtrl.get_history);
  app.route('/api/money_topup/:user_id')
    .get(moneyCtrl.get_list_top_up);

  app.route('/api/topup_m')
    .get(moneyCtrl.get_list_reg);
  app.route('/api/topup_m/:id/:money')
    .put(moneyCtrl.approve_topup);
    
  app.route('/api/money_success')
    .post(moneyCtrl.successfully_topup);
}

