/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author hong
 * @date  16/12/15
 * @description
 */



var moment          = require('moment'),
  date;
var yearFormat = 'YYYY年M月D日';
var dayFormat = ' MMMD日';
date = function (context, options) {
  if (!options && context.hasOwnProperty('hash')) {
    options = context;
    context = undefined;

    // set to published_at by default, if it's available
    // otherwise, this will print the current date
    if (this.createdAt) {
      context = this.createdAt;
    }
  }

  // ensure that context is undefined, not null, as that can cause errors
  context = context === null ? undefined : context;
  moment.locale("zh-cn");
  var f = options.hash.format || 'MMM Do, YYYY',
    timeago = options.hash.timeago,
    date;

  if (timeago) {
    date = moment(context).fromNow();
    var diff = moment().diff(moment(context),'days');
    if(diff < 30){    //30天以内显示  多久之前
      date = moment(context).fromNow();
    }else if( moment().format('YYYY') - moment(context).format('YYYY') < 1 ){   //一年内 显示 几月几号
      date = moment(context).format(dayFormat);
    }else{
      date = moment(context).format(yearFormat);
    }
  } else {
    date = moment(context).format(f);
  }
  moment.locale("en");
  date = date.replace(' ','');
  return date;
};

module.exports = date;
