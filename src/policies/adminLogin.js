/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author JerryC
 * @date  15/12/9
 * @description
 *
 */

module.exports = function (req, res, next) {
  if(!req.session.admin) return res.redirect('/admin/loginPage');
	return next();
};