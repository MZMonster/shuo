/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author JerryC
 * @date  15/12/9
 * @description
 *
 */

var fs     = require('fs'),
	path     = require('path'),
	emberApp = path.resolve(__dirname, '../../../admin/build/index.html');

/**
 * 后台 /admin 渲染
 * @param req
 * @param res
 */
function admin(req, res) {
	fs.exists(emberApp + '', function (exists) {
		if (!exists) {
			return res.notFound('The requested file does not exist.');
		}
		fs.createReadStream(emberApp).pipe(res);
	});
}

module.exports = {
	admin: admin
};