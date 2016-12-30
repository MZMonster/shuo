/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author wuyanxin
 * @date  15/11/25
 * @description
 *
 */

import _ from 'lodash';
import ExpectedError from '../lib/ExpectedError';

/**
 * 检查不可为空的参数
 * 若存在为空的参数将throw 40001
 *
 * @param args
 * @returns {boolean}
 */
function checkNotNull(...args) {
  if (_.includes(args, undefined) || _.includes(args, null)) {
    throw new ExpectedError('40001');
  }
  return true;
}

/**
 * 错误处理
 * 将一般错误信息配置于sails.config.errors
 * 每个错误对应一个code,对于可预知的错误我们采取抛出ExpectedError来给用户传递错误信息
 *
 * @param {Response} res
 * @returns {*}
 */
function errorHandler(res) {
  return (err) => {
    if (err instanceof ExpectedError) {
      sails.log.debug(err);
      switch (err.code[0]) {
        case '4':
          return res.badRequest(err.message);
        case '3':
          return res.forbidden(err.message);
        case '5':
          sails.log.error(err.message);
          return res.serverError(err.message);
      }
    }
    sails.log.error(err);
    return res.serverError('server error');
  };
}

/**
 * 获取渲染之后的html
 * @param view
 * @param data
 */
function render(view, data) {
  return new Promise((resolve, reject) => {
    sails.hooks.views.render(view, data, (err, html) => {
      if (err) {
        return reject(err);
      }
      return resolve(html);
    });
  });
}

/**
 * 通用的响应方法
 * 根据请求是否包含html=true返回渲染后的html
 * 根据请求是否包含callback返回jsonp
 * @param req
 * @param res
 * @param view
 * @returns {Function}
 */
function resHandler(req, res, view, layout) {
  return (data) => {
    if (req.query.html === 'true' && view) {
      data.layout = layout;
      return UtilService.render(view, data).then((html) => {
        if (req.query.callback) {
          return res.jsonp(html);
        }
        return res.send(html);
      });
    }
    if (req.query.callback) {
      return res.jsonp(data);
    }
    return res.json(data);
  };
}

/**
 * query只支持数字和字符串格式
 * 只支持"等于"比较符
 * @param query
 * @returns {string}
 *  eg. "id=1 AND type='product'"
 */
function formatWhereClause(query) {
  return _.map(query, function (value, key) {
    if (value instanceof Array) {
      if (typeof value[0] === 'number') {
        return `${key} in (${value})`;
      }
      return `${key} in ('${value.toString().replace(/,/g, '\',\'')}')`;
    }
    if (typeof value !== 'number') {
      value = `'${value}'`;
    }
    return `${key}=${value}`;
  }).join(' AND ');
}

/**
 * 根据自增的字段,格式化自增子句
 * @param fields
 * @param increment
 * @returns {string} eg. count=count+1
 */
function formatIncreaseClause(fields, increment) {
  return _.map(fields, function (field) {
    return `${field}=${field}+${increment}`;
  }).join(',');
}

/**
 * 线程安全自增, 用于model的静态方法
 * @param modelName
 * @returns {Function}
 */
function generateIncrement(modelName) {
  /**
   * @param {Object} query
   * @param {Array} field
   * @param {number} increment
   * @param {Array} select 默认为['uuid'], 则返回结果的字段为field.concat(select)
   * @returns {Object[]} updated record
   */
  return (query, fields, increment=1, select = ['uuid']) =>
    new Promise((resolve, reject) => {
      let model = sails.models[modelName.toLowerCase()];
      let where = formatWhereClause(query);
      let increaseClause = formatIncreaseClause(fields, increment);
      let updateString = `UPDATE ${model.tableName} SET ${increaseClause} WHERE ${where}`;
      model.query(updateString, (err, rows) => {
        if (err) {
          return reject(err);
        }

        if (!rows || !rows.changedRows) {
          return resolve([]);
        }

        select = fields.concat(select);

        model.find(query, {select: select}).then(result => {
          return resolve(result);
        }).catch(reject);
      });
    });
}

/**
 * 反转义html
 * @param html
 * @returns {string}
 */
function unescape(html) {
  return String(html)
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, '\'')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ');
}

module.exports = {
  checkNotNull,
  errorHandler,
  render,
  resHandler,
  generateIncrement,
  unescape
};
