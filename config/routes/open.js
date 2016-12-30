/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author JerryC
 * @date  15/12/7
 * @description
 *
 */

module.exports.routes = {

  // User
  'post /api/open/user/import': 'open/UserController.importUser' ,

  // Thread
  'post /api/open/thread/info': 'open/ThreadController.info',
  'post /api/open/thread/create': 'open/ThreadController.create'

};