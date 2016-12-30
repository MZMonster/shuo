/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author JerryC
 * @date  15/12/15
 * @description
 *
 */
import ExpectedError from '../lib/ExpectedError';
let {errorHandler} = UtilService;

module.exports = function (req, res, next) {
  if(!req.session.user){
    return errorHandler(res)(new ExpectedError('30001'));
  }
  next();
};