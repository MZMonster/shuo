/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author JerryC
 * @date  15/12/7
 * @description
 *
 */

module.exports.routes = {
	'post /admin/login' : 'admin/AuthController.login',
	'get /admin/loginPage' : 'admin/AuthController.loginPage',
	'get /admin/logout' : 'admin/AuthController.logout',
	'/admin/*': {
		controller: 'admin/IndexController',
		action    : 'admin',
		skipAssets: true,
		skipRegex : /^\/api\/.*$/
	},
	'post /file/upload': 'admin/DataController.importData'
};