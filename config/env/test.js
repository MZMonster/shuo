/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author JerryC
 * @date  15/10/19
 * @description
 *
 */

module.exports = {

  log: {
    level: 'silent'
  },

  hooks: {
    grunt: false,
    sockets: false,
    pubsub: false
  },

  session: {
    secret: 'cf7bf8b97a401a614677ca004d974fa0',
    name: 'shuo.sid',
    cookie: {
      maxAge: 14 * 24 * 60 * 60 * 1000,
      domain: '.meizu.com'
    },
    adapter: 'memory',
    store: null
},

  models: {
    connection: 'unitMysqlServer',
    migrate: 'drop'
  },

  port: 8001,

  connections: {
    unitMysqlServer: {
      adapter: 'sails-mysql',
      host: '127.0.0.1',
      user: 'root',
      password: '',
      database: 'shuo_unit',
      timezone: '+0800'
    }
  }
};
