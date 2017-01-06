/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @date  15/12/8
 * @description
 *
 */
!function ($) {
  void 0 === window.shuo && (window.shuo = {}, window.shuo.api = {});
  var _CONFIG = {
    // host: 'https://wan-shuo.meizu.com',
    host: 'http://localhost:1337',
    uploadPath: 'https://wan-shuo.meizu.com/file/upload'
  };
  var OPTIONS = {};
  var BASE = '';

  /**
   * @api {GET} shuo.options C 获取shuo的属性
   * @apiName options
   * @apiGroup shuo.api.js
   * @apiDescription 获取已有属性
   *
   * @apiParam {Object} shuo.options shuo.options返回你在shuo.api.config设置的所有参数
   * @apiParam {bool} shuo.loginStatus shuo.loginStatus返回当前用户登录状态
   * @apiParam {Object} shuo.loginUser shuo.loginUser返回当前登录用户的信息
   * @apiParamExample shuo.loginUser:
   *   {
   *     avatar: '头像url',
   *     username: '用户名',
   *     remoteID: '用户在当前系统的ID',  // 最好是uuid
   *     homepage: 'yourdomain.com/u/' + currentUser.domain  // 用户在当前系统的首页
   *   }
   */

  /**
   * @api {GET} shuo.api.include(path,type) B 定制评论
   * @apiName include
   * @apiGroup shuo.api.js
   * @apiDescription 定制化评论
   *   * 默认自己不引用js文件的话，shuo.api.js会默认引入shuo.render.js
   *   * 自定义评论可以通过config中的render属性设置（见 <a href="#api-shuo_api_js-config">接入评论</a>）
   *   * 自定义的js可参考<a href="https://gist.github.com/wuyanxin/8188a9565c2e6718dd6cae4971520add">shuo.render.js</a>
   * @apiParam path 文件路径
   * @apiParam {string=js,css} type=js 文件类型
   * @apiParamExample example:
   *  window.shuo.api.config({
   *    appid: 'VkHiN7zHl', // 站点appid
   *    sourceID: '3e965bb7-ef8d-53ae-99e7-835202e939c0', // 当前文章在本站ID
   *    category: 'product', // 类别(可选)
   *    render: 'http://yourdomain.com/js/your-custom-renderer.js', // 定制评论
   *    user_info_url: 'http://yourdomain.com/userInfo',  // 用户信息接口，需要服务端实现，见用户登录文档
   *  });
   */
  function include(path, type){

    // 如果path不是完整的的url, 则为其匹配当前路径前缀
    if (!BASE && !/^((https?:)?\/\/)[^\s]+/.test(path)) {
      var src = "shuo.api."+(OPTIONS.debug?'':(OPTIONS.version+'.min.'))+"js"; // 当前js文件名
      var scripts = document.getElementsByTagName("script");
      for (var i = 0; i < scripts.length; i++) { //遍历html中已经加载的js，取得整个应用加载js的base路径
        if (scripts[i].src.match(src)) {
          BASE = scripts[i].src.replace(src, "");
          break;
        }
      }
    }

    if (type == "css") {
      document.write("<" + "link href=\"" + BASE + path + "\" rel=\"stylesheet\" type=\"text/css\"></" + "link>");
    } else {
      document.write("<" + "script src=\"" + BASE + path + "\"></" + "script>");
    }
  }

  /**
   * @api {get} shuo.api.config(configs) 1 接入评论
   * @apiName config
   * @apiGroup shuo.api.js
   * @apiDescription 接入评论
   *  1. 首先联系管理员创建站点，获得appid和appkey
   *  2. 在需要接入评论的页面植入以下代码
   *  3. 用户登录见<a href="#api-shuo_api_js-login">用户登录文档</a>
   *  4. 联系管理员加入跨域白名单
   *
   * @apiParamExample example:
   *  &lt;script src="http://res.wan.meizu.com/res-shuo/pro/js/shuo.api.js"&gt;&lt;/script&gt;
   *
   *  &lt;script&gt;
   *   window.shuo.api.config({
   *    appid: 'VkHiN7zHl', // 站点appid
   *    sourceID: '3e965bb7-ef8d-53ae-99e7-835202e939c0', // 当前文章在本站ID
   *    category: 'product', // 类别(可选)
   *    // title: example title,  // 标题(可选)
   *    // url: http://example.com,    // url(可选)
   *    // limit: 15,  // 每页条数,默认15(可选)
   *    // image: http://example.com/xx.jpg,  // 图片(可选)
   *    // description: '', // 描述(可选)
   *    // cLimit: 10, // 子评论每页条数,默认10
   *    // sort: 'hot', // 默认排序为hot(按赞排序)，可修改为new或old
   *    // flat: false, // 默认子评论嵌套在父评论下，当flat=true时，所有评论平级
   *    // render: 'http://yourdomain.com/js/your-custom-renderer.js', // (可选) 定制评论
   *    user_info_url: 'http://yourdomain.com/userInfo',  // 用户信息接口，需要服务端实现，见用户登录文档
   *    user_login_url: 'http://yourdomain.com/login'  // 用户登录链接，用于对未登录用户的跳转
   *  });
   *  &lt;/script&gt;
   */
  function config(options) {
    if (!options || !options.appid) {
      throw new Error('appid cannot be null');
    }

    // 默认容器为 #MW_SHUO
    options.target = options.target || 'MW_SHUO';

    window.shuo.options = OPTIONS = options;

    // inject render.js
    options.sourceID && include(OPTIONS.render || 'shuo.render.'+(OPTIONS.version&&!OPTIONS.debug ? OPTIONS.version+'.min.':'')+'js');

    $.ajaxSetup({
      dataType: 'jsonp',
      jsonp: 'callback',
      xhrFields: {withCredentials: true}
    });

  }

  /**
   * ajax 成功默认处理器
   * @param callback
   * @returns {Function}
   */
  function successHandler(callback) {
    return function (data) {
      if (typeof callback === 'function') {
        callback(null, data);
      }
    };
  }

  /**
   * ajax 失败默认处理器
   * @param callback
   * @returns {Function}
   */
  function errorHandler(callback) {
    return function (err) {
      if (typeof callback === 'function') {
        callback(err);
      }
    };
  }

  /**
   * 获取站点配置
   * @param callback
   */
  function getConfig(callback) {

  }

  /**
   * @api {GET} shuo.api.load(callback) 3 首屏加载
   * @apiName load
   * @apiGroup shuo.api.js
   * @apiDescription  加载首屏评论
   *   1. 如果服务器中没有该文章记录，新建文章
   *   2. 如果已有记录，加载第一屏评论
   *
   * @apiParamExample example:
   *   window.shuo.api.load(function (data) {
   *     console.log(data);
   *   });
   *
   */
  function load(callback) {
    var data = {
      appid: OPTIONS.appid,
      sourceID: OPTIONS.sourceID,
      category: OPTIONS.category,
      limit: OPTIONS.limit,
      cLimit: OPTIONS.cLimit,
      sort: OPTIONS.sort,
      flat: OPTIONS.flat,
      title: OPTIONS.title || $('title').text(),
      url: OPTIONS.url || window.location.href,
      image: OPTIONS.image,
      description: OPTIONS.description,
      html: true
    };

    $.ajax({
      url: _CONFIG.host + '/thread/load',
      data: data,
      success: function (data) {
        OPTIONS.threadID = data.threadID || $(data).find('#SHUO_threadID').text();
        if (typeof callback === 'function') {
          callback(data);
        }
      }
    });
  }

  /**
   * @api {GET} shuo.api.page(page,callback) 4 加载评论分页
   * @apiName page
   * @apiGroup shuo.api.js
   * @apiDescription 加载评论分页数据
   *
   * @apiParam {int} page 页码
   * @apiParam {function} [callback] 回调
   * @apiParamExample example:
   *   window.shuo.api.page(2, function (data) {
   *     console.log(data);
   *   });
   */
  function page(page, callback) {
    var data = {
      appid: OPTIONS.appid,
      sourceID: OPTIONS.sourceID,
      sort: OPTIONS.sort,
      flat: OPTIONS.flat,
      limit: OPTIONS.limit,
      cLimit: OPTIONS.cLimit,
      page: page,
      html: true
    };

    $.ajax({
      url: _CONFIG.host + '/comment/list',
      data: data,
      success: function (data) {
        if (typeof callback === 'function') {
          callback(data);
        }
      }
    });
  }

  /**
   * @api {POST} shuo.api.submit(options,callback) 5 发表评论
   * @apiName submit
   * @apiGroup shuo.api.js
   * @apiDescription 发表评论
   * @apiParam {Object} options
   * {
   *   content: '内容',  // 必须
   *   parentID: '父评论uuid(非必须)',
   *   replyTo: '回复某人的UUID(非必须)'
   * }
   * @apiParam {function} [callback]
   *
   * @apiParamExample example:
   *   window.shuo.api.submit({
   *     content: '内容',  // 必须
   *     parentID: '父评论uuid(非必须)',
   *     replyTo: '回复某人的UUID(非必须)'
   *   }, function (err, data) {
   *     if (err) return console.error(err);
   *     console.log(data);
   *   })
   */
  function submit(options, callback) {
    var data = $.extend({
      appid: OPTIONS.appid,
      threadID: OPTIONS.threadID,
      html: true
    }, options);

    $.ajax({
      type: 'POST',
      url: _CONFIG.host + '/comment/submit',
      data: data,
      dataType: 'html',
      success: successHandler(callback),
      error: errorHandler(callback)
    });
  }

  /**
   * @api {POST} shuo.api.userSync(callback) 2 用户登录
   * @apiName login
   * @apiGroup shuo.api.js
   * @apiDescription
   *  使用方需实现用户信息接口（即 user_info_url），用于shuo获取用户信息，实现登录
   *
   *  <a href="https://gist.github.com/wuyanxin/7746dcebe3426908d5d24e117cb6f618">实现示例</a>
   *
   * @apiParamExample 详细说明:
   *  user_info_url接口要求返回:
   *  {
   *    user: {
   *      avatar: '头像url',
   *      username: '用户名',
   *      remoteID: '用户在当前系统的ID',  // 最好是uuid
   *      homepage: 'yourdomain.com/u/' + currentUser.domain  // 用户在当前系统的首页
   *    },
   *    shuoCookie: {
   *      shuosession: 'sjgjsdllas',
   *      shuoinfo: 'lsjdfgsjklgjsd'
   *    }
   *  }
   */
  function userSync(callback) {

    /**
     * 登录失败
     * @param err
     * @private
     */
    function _loginError(err) {
      window.shuo.loginStatus = false;

      // logout
      $.ajax({
        url: _CONFIG.host + '/logout',
        data: {
          appid: OPTIONS.appid
        },
        dataType: 'text',
        success: function () {
          if (typeof callback === 'function') {
            callback();
          }
        },
        error: function () {
          if (typeof callback === 'function') {
            callback(err);
          }
        }
      });
    }

    $.ajax({
      url: OPTIONS.user_info_url,
      dataType : "json",
      xhrFields: {withCredentials: false},
      success: function (data) {
        if (data && data.shuoCookie) {
          data.shuoCookie.appid = OPTIONS.appid;
          $.ajax({
            type: 'POST',
            url: _CONFIG.host + '/login',
            data: data.shuoCookie,
            dataType: 'text',
            success: function () {
              window.shuo.loginStatus = true;
              window.shuo.loginUser = data.user;
              if (typeof callback === 'function') {
                callback(null, data.user);
              }
            },
            error: _loginError
          });
        } else {
          _loginError('format error');
        }
      }
    }).fail(_loginError);

  }

  /**
   * @api {PUT} shuo.api.star(options,callback) 6 点赞
   * @apiName star
   * @apiGroup shuo.api.js
   * @apiDescription 为评论或者文章点赞
   * @apiParam {Object} options
   * @apiParam {function} callback
   * @apiParamExample example:
   *   window.shuo.api.star({
   *     type: 'comment',  // 默认为comment, 若为文章点赞设置为thread
   *     uuid: 'uuid'   // 对应文章或者评论的uuid
   *   }, function (err, data) {
   *     if (err) return console.error(err);
   *     console.log(data);
   *   });
   */
  function star(options, callback) {
    var data = $.extend({
      appid: OPTIONS.appid,
      type: 'comment'
    }, options);

    $.ajax({
      type: 'PUT',
      url: _CONFIG.host + '/star',
      data: data,
      dataType: 'json',
      success: successHandler(callback),
      error: errorHandler(callback)
    });

  }

  /**
   * @api {GET} shuo.api.atSuggest(callback) 7 获取@用户列表
   * @apiName atSuggest
   * @apiGroup shuo.api.js
   * @apiDescription 获取该文章下可以@的用户
   *
   * @apiParam {function} callback
   * @apiParamExample example:
   *   window.shuo.api.atSuggest(function (err, data) {
   *     if (err) return console.error(err);
   *     console.log(data);
   *   });
   */
  function atSuggest(callback) {
    $.ajax({
      url: _CONFIG.host + '/comment/atsuggest?threadID=' + OPTIONS.threadID,
      type: 'GET',
      dataType: 'json',
      success: successHandler(callback),
      error: errorHandler(callback)
    });
  }

  /**
   * @api {delete} shuo.api.destroy(options,callback) 8 删除评论
   * @apiName destroy
   * @apiGroup shuo.api.js
   * @apiDescription 用户删除自己的评论
   *
   * @apiParam {Object} options
   * @apiParam {function} callback
   * @apiParamExample example:
   *   window.shuo.api.destroy({
   *     commentID: 'uuid'
   *   }, function (err, data) {
   *     if (err) return console.error(err);
   *     console.log(data);
   *   });
   */
  function destroy(options, callback) {
    var data = $.extend({
      appid: OPTIONS.appid
    }, options);

    $.ajax({
      type: 'DELETE',
      url: _CONFIG.host + '/comment/destroy',
      data: data,
      dataType: 'json',
      success: successHandler(callback),
      error: errorHandler(callback)
    });
  }

  /**
   * @api {get} shuo.api.moreReplies(options,callback) 9 获取更多子评论
   * @apiName moreReplies
   * @apiGroup shuo.api.js
   * @apiDescription 默认子评论只加载$cLimit条(见接入评论的配置)，通过这个函数获取更多子评论
   *
   * @apiParam {Object} options
   * @apiParam {function} callback
   * @apiParamExample example:
   *   window.shuo.api.moreReplies({
   *     page: 2,
   *     commentID: 'commentUUID'
   *   }, function (err, data) {
   *     if (err) return console.error(err);
   *     console.log(data);
   *   });
   */
  function moreReplies(options, callback) {
    var data = $.extend({
      appid: OPTIONS.appid,
      limit: OPTIONS.cLimit,
      html: true
    }, options);

    $.ajax({
      url: _CONFIG.host + '/comment/moreReplies',
      data: data,
      success: successHandler(callback),
      error: errorHandler(callback)
    });
  }

  /**
   * @api {POST} shuo.api.upload(file,callback) A 异步上传图片
   * @apiName uploadImg
   * @apiGroup shuo.api.js
   *
   * @apiParam {File} file
   * @apiParam {function} callback
   * @apiParamExample example:
   *   window.shuo.api.uploadImg(file, function (err, data) {
   *     if (err) return console.error(err);
   *     console.log(data);
   *   });
   */
  function uploadImg(file, callback) {
    var formData = new FormData();
    var xhr = new XMLHttpRequest();
    formData.append('threadID', OPTIONS.threadID);
    formData.append('imgFile', file);
    xhr.withCredentials = true;
    xhr.open('POST', _CONFIG.uploadPath);

    // 定义上传完成后的回调函数
    xhr.onload = function () {
      var error = null;
      var responseText;

      if (xhr.status === 200) {
        try {
          responseText = JSON.parse(xhr.response);
        } catch (err) {
          error = new Error('解析响应体失败');
        }
      } else {
        error = new Error('请求失败');
      }

      if (typeof callback === 'function') {
        callback(error, responseText);
      }
    };
    xhr.send(formData);
  }

  /**
   * 请求错误处理
   * @param err
   * @param callback
   */
  function reqErrorHandle(err, callback) {
    var errMessage;
    var errText = '评论失败,请刷新后重试';

    try{
      errMessage = JSON.parse(err.responseText).message;
    }catch(error){
      errMessage = $(err.responseText).find('.error-desc').text();
    }

    // 账户冻结
    if (errMessage && /#30002/.test(errMessage)) {
      errText= '很抱歉,你账户已被冻结,请联系管理员';
    }

    callback(errText);
  }

  /**
   * @api {GET} shuo.api.groupOfCmts(sourceID,callback) D 批量获取文章的评论
   * @apiName groupOfCmts
   * @apiGroup shuo.api.js
   * @apiDescription 批量获取文章的评论，一般用于文章列表中，参考魅玩帮的讨论功能
   *
   * @apiParam {Array} sourceID thread的sourceID数组
   * @apiParam {Function} callback
   * @apiParamExample example:
   *   window.shuo.api.groupOfCmts(['uuid1', 'uuid2'], function (err, data) {
   *     if (err) return console.error(err);
   *     console.log(data);
   *   });
   */
  function groupOfCmts(sourceID, callback) {
    var data = {
      appid: OPTIONS.appid,
      sourceID: sourceID
    };

    $.ajax({
      url: _CONFIG.host + '/comment/group',
      data: data,
      success: successHandler(callback),
      error: errorHandler(callback)
    });
  }

  // exports
  window.shuo.include = include;
  window.shuo.api = {
    load          : load,
    page          : page,
    submit        : submit,
    config        : config,
    star          : star,
    userSync      : userSync,
    atSuggest     : atSuggest,
    destroy       : destroy,
    reqErrorHandle: reqErrorHandle,
    uploadImg     : uploadImg,
    moreReplies   : moreReplies,
    groupOfCmts   : groupOfCmts
  };

}(shuoQuery);
