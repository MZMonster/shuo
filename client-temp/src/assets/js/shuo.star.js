/**
 * Copyright (c) 2016 Meizu MeiWanBang, All rights reserved.
 * http://wan.meizu.com/
 * @author wuyanxin
 * @date  16/6/16
 * @description
 *
 */

!function ($) {
  void 0 === window.shuo && (window.shuo = {}, window.shuo.starApi = {});
  var _CONFIG = {
    host: 'https://wan-shuo.meizu.com'
  };
  var OPTIONS = {};

  /**
   * 配置
   * @param options {Object}
   */
  function config(options, callback) {
    if (!options || !options.appid) {
      throw new Error('appid cannot be null');
    }
    if (!options.sourceID) {
      throw new Error('sourceID is required');
    }

    if (!options.title) {
      console.warn('title is null');
    }

    OPTIONS = options;

    $.ajaxSetup({
      xhrFields: {withCredentials: true}
    });

    userSync(callback);
  }

  /**
   * 加载未同步点赞数据的记录
   *
   * 未同步数据的dom结构:
   * <div class="MW-star MW-star-init" id="123">
   *   <span class="MW-star-num">
   *     0
   *   </span>
   * </div>
   * .MW-star-init 表示初始化,但未同步
   * #123 是该记录的唯一标识
   *
   * 已同步数据的dom结构:
   * <div class="MW-star MW-star-sync MW-star-hasStarred" id="123">
   *   <span class="MW-star-num">
   *     13
   *   </span>
   * </div>
   * .MW-star-sync 表示已同步
   * .MW-star-hasStarred 表示当前用户点过赞
   *
   * 每次调用该方法会同步当前所有.MW-star-init的记录
   *
   * @param [callback]
   */
  function load(callback) {
    var ids = [];
    $('.MW-star-init').attr('data-id', function (i, id) {
      ids.push(id);
    });
    if (!ids.length) {
      return;
    }
    var commentID = ids.join(',');

    var data = {
      appid: OPTIONS.appid,
      sourceID: OPTIONS.sourceID,
      title: OPTIONS.title || $('title').text(),
      commentID: commentID
    };

    $.ajax({
      url: _CONFIG.host + '/praise/load',
      data: data,
      success: function (data) {
        ids.forEach(function (id) {
          var $item = $('.MW-star[data-id="' + id +'"]');
          $item.removeClass('MW-star-init');
          if (data[id]) {
            $item.find('.MW-star-num').text(data[id].star);
            if (data[id].hasStarred) {
              $item.addClass('MW-star-hasStarred');
            }
          }
        });
        if (typeof callback === 'function') {
          callback(data);
        }
      }
    });
  }

  /**
   * 同步用户
   * @param [callback]
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
   * 点赞
   * @param options
   *  {
   *    content: 'content',  // 被点赞记录内容
   *    uuid: 'uuid'  // 被点赞记录唯一标示
   *  }
   * @param callback
   */
  function star(options, callback) {
    var data = $.extend({
      appid: OPTIONS.appid,
      sourceID: OPTIONS.sourceID,
      title: OPTIONS.title || $('title').text(),
    }, options);

    $.ajax({
      type: 'PUT',
      url: _CONFIG.host + '/praise/star',
      data: data,
      dataType: 'json',
      success: function (data) {
        if (typeof callback === 'function') {
          callback(null, data);
        }
      },
      error: function (err) {
        if (typeof callback === 'function') {
          callback(err);
        }
      }
    });

  }

  /**
   * 获取已经为某条记录点赞的用户
   * @param options
   *  {
   *    targetID: 'comment-id'
   *  }
   * @param callback
   */
  function getStarredUsers(options, callback) {
    if (!options || !options.targetID) {
      throw new Error('targetID can not be null');
    }

    var data = {
      appid: OPTIONS.appid,
      targetID: options.targetID
    };

    $.ajax({
      url: _CONFIG.host + '/praise/starredUsers',
      data: data,
      dataType: 'json',
      success: function (data) {
        if (typeof callback === 'function') {
          callback(null, data);
        }
      },
      error: function (err) {
        if (typeof callback === 'function') {
          callback(err);
        }
      }
    });
  }

  // exports
  window.shuo.starApi = {
    config: config,
    load: load,
    star: star,
    userSync: userSync,
    getStarredUsers: getStarredUsers
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.shuo.starApi;
  }

}(shuoQuery);


