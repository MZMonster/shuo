/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author JerryC
 * @date  15/11/25
 * @description
 *
 */

module.exports.auth = {
  open:{
    development: {
      allow_ip: process.env.IP_WHITE_LISTS || '::ffff:127.0.0.1,127.0.0.1',
      allow_timeout: process.env.TIMEOUT || 1000 * 300  // ms
    },
    production: {
      allow_ip: process.env.IP_WHITE_LISTS || '::ffff:127.0.0.1,127.0.0.1',
      allow_timeout: process.env.TIMEOUT || 1000 * 300
    }
  }
};