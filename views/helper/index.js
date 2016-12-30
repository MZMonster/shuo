/**
 * Copyright (c) 2014 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author liuxing
 * @date  14-11-18
 * @description
 *
 */
var Handlebars = require('handlebars');
var _ = require('lodash');
var fs = require('fs'),
    path = require('path');


Handlebars.registerHelper('link_to', function () {
  return new Handlebars.SafeString("<a href='" + Handlebars.Utils.escapeExpression(this.url) + "'>" + Handlebars.Utils.escapeExpression(this.body) + "</a>");
});

Handlebars.registerHelper('ifCond', function(v1, operator, v2, options) {
  switch (operator) {
    case '!==':
      return (v1 !== v2) ? options.fn(this) : options.inverse(this);
      break;
    case '==':
      return (v1 == v2) ? options.fn(this) : options.inverse(this);
      break;
    case '===':
      return (v1 === v2) ? options.fn(this) : options.inverse(this);
      break;
    case '<':
      return (v1 < v2) ? options.fn(this) : options.inverse(this);
      break;
    case '<=':
      return (v1 <= v2) ? options.fn(this) : options.inverse(this);
      break;
    case '>':
      return (v1 > v2) ? options.fn(this) : options.inverse(this);
      break;
    case '>=':
      return (v1 >= v2) ? options.fn(this) : options.inverse(this);
      break;
    default:
      return '';
      break;
  }
});

Handlebars.registerHelper('ifNot', function (v1, options) {
  return !v1 ? options.fn(this) : '';
});

Handlebars.registerHelper('itar', function (context, option) {
  var out = '';
  for (var i = 0; i < context; i++) {
    out = out + option.fn({index: i + 1});
  }
  return out;
});

/**
 * 注入模板助手，
 */
function inject() {
  var helperDir = './template/';
  fs.readdir(path.resolve(__dirname, helperDir), function (err, files) {

    if (!err) {
      _.map(files, function (file) {
        var dot = file.indexOf('.');
        Handlebars.registerHelper(file.substr(0, dot), require(helperDir+file));
      });
      sails.log.info('模板助手注入完成');

    }else{
      sails.log.error(err);
    }
  });
}

inject();
