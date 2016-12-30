/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author JerryC
 * @date  15/12/8
 * @description
 *
 */

module.exports = {

  schema    : true,
  identity  : 'AdminLoginLog',
  tableName : 'admin_login_log',

  autoCreatedAt: false,
  autoUpdatedAt: false,

  attributes: {
    loginTime   : {type: 'datetime'},
    logoutTime  : {type: 'datetime'},
    isSuccess   : {type: 'boolean', defaultsTo: false},
    failReason  : {type: 'text'},
    adminLog    : {model: 'AdminLog'}
  }

};