'use strict';
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, next) {
    next(null, `././static/img`);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + '--' + '.png');
  }
});
const upload = multer(
  {
    storage: storage, fileFilter: (req, file, next) => {
      next(null, true);
    }, limits: { fileSize: 15 * 1000000 }
  }
).single('logo_img');
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

  app.route('/api/Accounts_agency')
    .get(accCtrl.get_agency);
  app.route('/api/Accounts_sub_agency')
    .get(accCtrl.get_sub_agency);

  app.route('/api/Accounts/:id')
    .get(accCtrl.detail);

  app.route('/api/Accounts/:cr_page/:user_number_page')
    .get(accCtrl.get2);

  app.route('/api/Accounts_search/:username')
    .put(accCtrl.get_byname)
    .get(accCtrl.get_byname);

  app.route('/api/Accounts_history/:id')
    .put(accCtrl.update_history);

  app.route('/api/reg_acc')
    .post(accCtrl.register)

  app.route('/account/activate/:key_active')
    .get(accCtrl.active_email)

  app.route('/api/change_acc/:id')
    .put(accCtrl.change_pass)

  app.route('/api/recovery_save')
    .put(accCtrl.recovery_save)
  app.route('/api/finance/:id')
    .get(accCtrl.get_current_finance)

  app.route('/api/Accounts/:id')
    .put(accCtrl.update)
    .delete(accCtrl.delete);

  app.route('/api/agency_allmoney/:from/:to')
    .get(accCtrl.get_all_money);
  app.route('/api/agency')
    .get(accCtrl.get_all_agency)
  app.route('/api/agency_reg')
    .get(accCtrl.get_all_agency_reg)

  app.route('/api/agency_child/:id')
    .get(accCtrl.get_agency_child)

  app.route('/api/agency_count/:id')
    .get(accCtrl.get_agency_count)
  app.route('/api/contacts_ticket')
    .post(accCtrl.add_contacts);
  app.route('/api/contacts')
    .get(accCtrl.agency_allcontacts)
  app.route('/api/contacts/:id')
    .put(accCtrl.del_contacts)
  app.route('/api/agency/:id')
    .get(accCtrl.get_agency_info)
    .put(accCtrl.agency_reg);

  app.route('/api/agency_m/:id')
    .put(accCtrl.agency_app);
  app.route('/api/agency_m/cancel/:id')
    .put(accCtrl.agency_cancel);

  app.route('/api/menu')
    .get(menuCtrl.get_template);
  app.route('/api/menu/:id')
    .get(menuCtrl.get_by_user);
  app.route('/api/menu_user/:user_id')
    .post(menuCtrl.add_menu);


  app.route('/api/history_login/:id')
    .get(menuCtrl.insert_his_login);
  app.route('/api/list_history_login/:id')
    .get(menuCtrl.list_history_login);

  app.route('/api/logo')
    .post(upload, menuCtrl.insert_logo);
  app.route('/api/menu_logo')
    .get(menuCtrl.get_logo);
    app.route('/api/init_logo')
    .get(menuCtrl.get_img_logo);
  app.route('/api/menu_logo/:id')
    .put(menuCtrl.del_logo);
  app.route('/api/menu_logo/:id/:type')
    .get(menuCtrl.edit_type_logo);

  app.route('/api/pricing_public/:user_id')
    .get(pricingCtrl.pricing_histories);
  app.route('/api/wrap_pricing_public/:user_id')
    .get(pricingCtrl.wrap_pricing_histories);

  app.route('/api/pricing_public')
    .post(pricingCtrl.order_pricing);

  app.route('/api/pricing')
    .get(pricingCtrl.get)
    .post(pricingCtrl.store);

  app.route('/api/pricing/:id')
    .get(pricingCtrl.detail);
  app.route('/api/pricing_insert_wrap')
    .post(pricingCtrl.insert_pricing_history);

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
  app.route('/api/check_user/:username')
    .get(accCtrl.user_check);
  app.route('/api/update_user/:username')
    .get(accCtrl.recovery);

  app.route('/api/start_request')
    .post(accCtrl.start_request);
  app.route('/api/end_request/:time')
    .post(accCtrl.end_request);

  app.route('/api/fproxy')
    .post(fbCtrl.get_url);
  app.route('/api/fproxy_post')
    .post(fbCtrl.post_url);
  app.route('/api/fb/:url*')
    .get(fbCtrl.get_fb_api);
  app.route('/api/fb/video')
    .post(fbCtrl.post_video);

  app.route('/api/config')
    .get(menuCtrl.get_all_config);

  app.route('/api/config/:id')
    .put(menuCtrl.update_config);

  app.route('/api/money_ticket')
    .post(moneyCtrl.add_money);
  // .get(moneyCtrl.add_money);
  app.route('/api/money_history/:user_id')
    .get(moneyCtrl.get_history);
  app.route('/api/money_topup/:user_id')
    .get(moneyCtrl.get_list_top_up);
  app.route('/api/money_history_topup/:user_id')
    .get(moneyCtrl.get_list_money_history_limit);

  app.route('/api/topup_m/:from/:to')
    .get(moneyCtrl.get_list_reg);
  app.route('/api/topup_m2/:from/:to')
    .get(moneyCtrl.get_list_reg2);
  app.route('/api/topup_m/:id/:money/:is_agency')
    .put(moneyCtrl.approve_topup);
  app.route('/api/topup2_m/:id/:money')
    .put(moneyCtrl.approve2_topup);
  app.route('/api/topup_m/cancel/:id')
    .post(moneyCtrl.cancel_topup);

  app.route('/api/a_insert_money')
    .post(moneyCtrl.edit_money_byadmin);

  app.route('/api/money_success')
    .post(moneyCtrl.successfully_topup);

  app.route('/api/money_success_ticket')
    .post(moneyCtrl.add_money_ticket);

  app.route('/api/list_withdraw/:id')
    .get(moneyCtrl.get_list_withdraw);

  app.route('/api/articles')
    .get(accCtrl.get_articles)
    .post(accCtrl.insert_articles);

  app.route('/api/articles/:id')
    .get(accCtrl.detail_articles);

  app.route('/api/articles/:id')
    .put(accCtrl.update_articles)
    .delete(accCtrl.delete_articles);

  app.route('/api/lang_lib/:lang')
    .get(menuCtrl.lang_lib);
}

