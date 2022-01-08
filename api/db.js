'use strict';
const mysql = require('mysql');

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "123456",
  database: process.env.DB_NAME || "fb_ads_management"

  // host: process.env.DB_HOST || "localhost",
  // user: process.env.DB_USER || "root",
  // password: process.env.DB_PASS || "Thinh@123",
  // database: process.env.DB_NAME || "fb_ads_management"
});

module.exports = db;