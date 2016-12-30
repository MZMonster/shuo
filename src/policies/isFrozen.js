/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author JerryC
 * @date  16/1/13
 * @description
 *
 */

import ExpectedError from '../lib/ExpectedError';
let {errorHandler} = UtilService;

module.exports = function (req, res, next) {
  if(req.session.sessionUser.status === 0){
    return errorHandler(res)(new ExpectedError('30002'));
  }
  next();
};