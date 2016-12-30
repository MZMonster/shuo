/**
 * Copyright (c) 2014 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author liuxing
 * @date  15/2/6
 * @description
 *
 */
var actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

module.exports = {
  count: function (req, res) {
    var Model = actionUtil.parseModel(req)
        //      , criteria = actionUtil.parseCriteria(req)
      , query = {};

    if (typeof req.param('where') !== 'undefined') {
      query.where = JSON.parse(req.param('where'));
    }

    Model.count(query, function (error, response) {
      if (error) {
        return res.serverError('database_error', error);
      }
      res.ok({count: response});
    });
  }
};
