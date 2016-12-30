/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author JerryC
 * @date  15/12/8
 * @description
 *
 */

import uuid from 'uuid';
let {hashPassword} = AdminService;

function _hashPassword (values, next) {
  if (!values.password) {
    return next();
  }
  hashPassword(values.password).then(function (hash) {
    if (!hash){
      delete values.password;
    }else {
      values.password = hash;
    }
    next(null, values);
  });
}

module.exports = {

  schema    : true,
  identity  : 'Administrator',
  tableName : 'administrator',

  attributes : {
    uuid      : {type: 'string', size: 36, unique: true, defaultsTo: uuid.v4, index: true},
    username  : {type: 'string', size: 36, unique: true, required: true, index: true},
    password  : {type: 'string', minLength: 8, required: true},

    toJSON: function () {
      var obj = this.toObject();
      delete obj.password;
      return obj;
    }
  },

  beforeCreate: _hashPassword,
  beforeUpdate: _hashPassword
};
