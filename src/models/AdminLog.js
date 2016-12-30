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
  identity  : 'AdminLog',
  tableName : 'admin_log',

  attributes : {
    ipAddress     : { type: 'string', size: 36},
    method        : { type: 'string', size: 10},
    url           : { type: 'string', url: true, size: 255},
    path          : { type: 'string', size: 255},
    controller    : { type: 'string', size: 36},
    action        : { type: 'string', size: 36},
    device        : { type: 'string', size: 255 },
    params        : { type: 'json' },
    administrator : { model: 'administrator' }
  }
};