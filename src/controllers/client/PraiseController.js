/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author wuyanxin
 * @date  16/1/4
 * @description
 *
 */


/**
 * 点赞
 * @param req
 * @param res
 * @returns {Object}
 *  {
 *    uuid: 'uuid-dsf-sdgsd-sdg',
 *    star: 32
 *  }
 */
function star(req, res) {

  let site = req.shuo.site.id;
  let user = req.session.user;
  let {type, uuid} = req.body;

  return PraiseService.praise(site, user, type, uuid).then(function(result) {
    if (!result.length) {
      return res.ok(null);
    }
    return res.ok(result[0]);
  }).catch(UtilService.errorHandler(res));

}

module.exports = {
  star
};
