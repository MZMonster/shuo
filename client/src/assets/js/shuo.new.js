/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @date  16/09/09
 * @description
 */

!function ($) {
  var $ROOT = $('#' + window.shuo.options.target);
  var LOGIN_MSG = '';
  var SUGGEST_USERS = [];
  var FORM_SELECTOR = '#mainForm';
  var CMT_NOT_LOGIN = '请登录再评论';
  var PAGINATION = {
    isLoading: false,
    isFirstLoad: true,
    pageIndex: 1,
    hasMore: false
  };
  var VERSION = window.shuo.options.version;
  var DEBUG = window.shuo.options.debug;
  var HASSTAR = void 0===window.shuo.options.hasStar || window.shuo.options.hasStar

  // =============
  // Start Shuo
  // =============

  // 引入CSS文件
  window.shuo.include('../css/shuo-new.'+(DEBUG?'':(VERSION+'.min.'))+'css', 'css');
  window.shuo.include('../css/jquery.atwho.css', 'css');

  // 登录并且同步用户
  window.shuo.api.userSync(function () {

    // 加载评论列表
    window.shuo.api.load(function (data) {
      $ROOT.html(data);
      setDefaultSort();
      loadCommentCount();
      setTitleAndPh();
      initAtSuggest();

      var $textarea = $('.mws-editable');
      $textarea.attr('rows',1);
      autosize($textarea);
      resetStoredComment();
      jumpToComment();
      hasMore();
    });

    formatLoginMsg();
  });

  /**
   * 设置默认排序
   */

   function setDefaultSort() {
     $sortList = $('.mws-sort-list');
     $sortList.find('[data-sortby="new"]').addClass('mws-btn-sort-active')
     .parent().siblings().find('.mws-btn-sort').removeClass('mws-btn-sort-active');
   }

  /**
   * 初始化 SUGGEST_USERS
   */

   function loadCommentCount() {
     var sourceIDs = [];

     sourceIDs.push(shuo.options.sourceID);
     window.shuo.api.groupOfCmts(sourceIDs.toString(), function (error, data) {
       if (error) {
         return console.log('load comment count error: ', error);
       }
       var uuid;
       for (var key in data) {
         if (data.hasOwnProperty(key) && data[key].uuid === shuo.options.threadID) {
           uuid = key;
         }
       }
     });
   }

  /**
   * 初始化 SUGGEST_USERS
   */
  function initAtSuggest() {
    window.shuo.api.atSuggest(function (error, data) {
      if (error) {
        return console.log('get suggest error: ', error);
      }
      SUGGEST_USERS = data.suggest || [];
    });
  }

  /**
   * 未登录用户已编辑的内容存放到localStorage
   * 重新登录时查看localStorage, 并输入到文本框
   */
  function resetStoredComment() {
    var key = 'shuo_comment_' + shuo.options.threadID;
    if (localStorage && localStorage.getItem(key)) {
      $ROOT.find('.mws-cmt-form-wrapper .mws-editable').val(localStorage.getItem(key));
      localStorage.removeItem(key, '');
    }
  }

  /**
   * 在地址栏中输入shuo_cmt_id
   * 评论加载后跳转到该评论, 如果该评论不存在则忽略
   */
  function jumpToComment() {
    var reg = /(^|\?|&)shuo_cmt_id=([^&]*)(&|$)/;
    var url = location.search;
    var match = url.match(reg);
    if (match) {
      if (document.getElementById(match[2])) {
        document.getElementById(match[2]).scrollIntoView(true);
      } else {
        jumpToCmtTop();
      }
    }
  }

  /**
   * 判断是否有分页
   */
  function hasMore() {
    if ($('.mws-page-next').attr('data-page') > 1) {
      PAGINATION.hasMore = true;
    }
  }

  /**
   * 初始化登录提示
   */
  function formatLoginMsg() {
    var reg = /=$/g;
    var url = window.shuo.options.user_login_url;
    if (reg.test(url)) {
      // 如果登陆url配置以"="号结尾,则自助为url后添加当前url,用于return
      url += encodeURIComponent(window.location.href + '#' + window.shuo.options.target);
    }
    LOGIN_MSG = '请先<a href="' + url + '">登录</a>';
  }

  /**
   * 设置title和placeholder
   */
  function setTitleAndPh() {
    var $textarea = $('.mws-editable');
    if (window.shuo.options.cmt_title) {
      $('#SHUO_title').text(window.shuo.options.cmt_title);
    }

    if (window.shuo.loginStatus) {
      if (window.shuo.options.cmt_placeholder) {
        $textarea.attr('placeholder', window.shuo.options.cmt_placeholder);
      }
    } else {
      $textarea.attr('placeholder', CMT_NOT_LOGIN);
    }
    !HASSTAR && $textarea.addClass('focus');
  }

  // =============
  // events handler
  // =============

  /**
   * 显示评论框
   */
  function showNearForm() {
    var $cmtRoot = $(this).parents('.mws-cmt-root');
    var $mainForm = $(FORM_SELECTOR);
    var $formTextarea = $mainForm.find('.mws-editable');
    var username = $(this).attr('data-to-username');

    if (!window.shuo.loginStatus) {
      $($(this).parents('.mws-cmt-item').find('.mws-item-message')[0]).html(LOGIN_MSG);
      return;
    }

    // 设置parentId和回复人
    $formTextarea.attr('data-to',$(this).attr('data-to'));
    $formTextarea.attr('data-parentid',$(this).attr('data-parentid'));

    $formTextarea.focus();

    // 填充textarea 回复username
    if (username) {
      window.shuo.loginStatus && $formTextarea.attr('placeholder', '回复' + username);
      $formTextarea.val('').attr('to-username','@' + username + ' : ');
    } else {
      $formTextarea.val('');
    }

    // // 展开隐藏的子评论
    // showHiddenReply($cmtRoot);
  }

  /**
   * 发表评论
   */
  var isSubmiting = false;

  function submitComment() {
    var $this = $(this);
    var $form = $(FORM_SELECTOR);
    var $textarea = $form.find('.mws-editable');
    var parentID = $textarea.attr('data-parentID');
    var reg = new RegExp("\n", "g");

    if (!$textarea.val().trim()) {
      $form.find('.mws-form-message').html('未输入评论内容');
      return;
    }

    if (!window.shuo.loginStatus) {
      $form.find('.mws-form-message').html(LOGIN_MSG);
      if (window.localStorage) {
        // 将用户已编辑的内容存放到localStorage
        var key = 'shuo_comment_' + shuo.options.threadID;
        localStorage.setItem(key, $textarea.val());
      }
      return;
    }

    if (!isSubmiting) {
      $this.attr('disabled', true);
      isSubmiting = true;
    } else {
      return;
    }

    window.shuo.api.submit({
      content: (!!$textarea.attr('to-username') ? $textarea.attr('to-username') : '') + $textarea.val().replace(reg, '  \n'),
      parentID: $textarea.attr('data-parentID'),
      replyTo: $textarea.attr('data-to')
    }, function (err, data) {
      isSubmiting = false;
      $this.removeAttr('disabled');
      $textarea.removeAttr('to-username');

      if (err) {
        return window.shuo.api.reqErrorHandle(err, function (errText) {
          $form.find('.mws-form-message').text(errText);
        });
      }


      $('.mws-btn-submit-mobile').attr('disabled',true);

      if ($textarea.attr('data-parentID')) {
        var $parent = $('#' + parentID);

        var $data = $(data);
        var $toUser = $data.find('.mws-cmt-content a');
        $toUser.text($toUser.text());
        data = $data[0];
      }

      $ROOT.find('.mws-cmt-list').prepend(data);
      // 评论总数+1
      var $count = $ROOT.find('.shuo-cmt-count .count');
      $count.text(+$count.text() + 1);

      $textarea.val('').removeAttr('data-parentID').removeAttr('data-to').attr('placeholder', window.shuo.options.cmt_placeholder);
      autosize.update($('.mws-editable'));
      $textarea.removeClass('focus')
    });

  }

  /**
   * 分页时跳转到评论顶部
   */
  function jumpToCmtTop() {
    document.getElementById('SHUO_MAIN').scrollIntoView(true);
  }

  /**
   * 跳转页面
   */
  function pageTurner() {
    var page = $(this).attr('data-page');
    window.shuo.api.page(page, function (data) {
      jumpToCmtTop();
      $('#SHUO_LIST').html(data);
      console.log(data);
      setTitleAndPh();
      autosize($('.mws-editable'));
    });
  }

  /**
   * ctrl+enter 提交
   * pastes CTRL+V content at caret position
   * @param event
   */
  function hotKeyEvent(event) {
    if ((event.metaKey || event.ctrlKey) && event.keyCode === 13) {
      submitComment.call(this);
      event.preventDefault();
      return;
    }

    // 其它输入清空错误信息
    $(this).parents('.mws-cmt-form').find('.mws-form-message').html('');
  }

  /**
   * 为评论点赞
   */
  var isStarring = false;
  function starCmt() {
    var $this = $(this);
    if (!window.shuo.loginStatus) {
      if($this.hasClass('mws-main-star')) {
        return window.location.href = '/login?return_to=' + encodeURIComponent(window.location.href);
      } else {
        $($this.parents('.mws-cmt-item').find('.mws-item-message')[0]).html(LOGIN_MSG);
        return;
      }
    }

    var isComment = $this.parents('.mws-cmt-item').length > 0;
    var uuid = isComment ? $this.parents('.mws-cmt-item').attr('id') : $('#SHUO_threadID').text();
    if(!isStarring) {
      isStarring = true;
      window.shuo.api.star({uuid: uuid, type: isComment ? 'comment' : 'thread'}, function (err, data) {
        if (err) {
          return console.error(err);
        }
        isStarring = false;
        $this.toggleClass('mws-cmt-starred', '').find('.mws-cmt-star').text(data.star);
      });
    }
  }

  /**
   * At suggests
   */
  function atSuggest() {
    if(!window.shuo.loginStatus) {
      return window.location.href = '/login?return_to=' + encodeURIComponent(window.location.href);
    }
    $(this).atwho({
      at: '@',
      displayTpl: '<li> ${username} </li>',
      insertTpl: '@${username}',
      searchKey: 'username',
      data: SUGGEST_USERS
    }).addClass('focus');
  }

  /**
   * At blur to switch comment from/to star
   */
  function atBlur() {
    HASSTAR && !$(this).val().trim() && $(this).removeClass('focus');
  }

  /**
   * 删除评论
   */
  function deleteComment() {
    var $this = $(this);
    var commentID = $this.parents('.mws-cmt-item').attr('id');

    var RUSure = window.confirm('确认删除该评论');
    if (RUSure) {
      window.shuo.api.destroy({commentID: commentID}, function (err, data) {
        if (data && data.result) {
          $('#' + commentID).remove();
          var $count = $ROOT.find('.shuo-cmt-count .count');
          $count.text($count.text() - 1);
        } else {
          $($('#' + commentID).find('.mws-item-message')[0]).text('删除失败, 请刷新重试');
        }
      });
    }
  }

  /**
   * 选择其他排序规则
   */
  function changeSort() {
    var $this = $(this);

    $this.parents('.mws-sort-list').find('.mws-btn-sort-active').removeClass('mws-btn-sort-active');
    $this.addClass('mws-btn-sort-active');

    window.shuo.options.sort = $this.attr('data-sortBy');
    window.shuo.api.page(1, function (data) {
      jumpToCmtTop();
      $('#SHUO_LIST').html(data);
      setTitleAndPh();
      autosize($('.mws-editable'));
    });
  }

  /**
   * 监听滚动加载
   */

  function loadPage() {
    var scrollTop   = $(window).scrollTop();
    var threshold   = 300;
    var reachBottom = document.body.offsetHeight - (window.innerHeight + threshold) <= scrollTop;

    if (reachBottom && PAGINATION.hasMore && !PAGINATION.isLoading) {
      PAGINATION.isLoading = true;

      window.shuo.api.page(++PAGINATION.pageIndex, function (data) {
        if (data.indexOf('mws-cmt-item') == -1) {
          PAGINATION.hasMore = false;
        } else {
          $('#SHUO_LIST').append(data);
        }
        PAGINATION.isLoading = false;
      });
    }
  }

  /**
   * 监控输入框的改变,改变提交按钮的状态
   */
  function watchValue() {
    var $submitBtn = $('.mws-btn-submit-mobile');
    $(this).addClass('focus');
    if($(this).val()) {
      $submitBtn.removeAttr('disabled');
    } else {
      $submitBtn.attr('disabled', true);
    }
  }

  // =============
  // bind events
  // =============

  $ROOT.on('click', '.mws-btn-reply', showNearForm);
  $ROOT.on('click', '.mws-btn-star', starCmt);
  $ROOT.on('click', '.mws-form-submit', submitComment);
  $ROOT.on('click', '.mws-pagination li:not(.mws-page-disable):not(.mws-page-active)', pageTurner);
  $ROOT.on('click', '.mws-btn-delete', deleteComment);
  $ROOT.on('click', '.mws-btn-sort:not(.mws-btn-sort-active)', changeSort);

  $ROOT.on('click', '.mws-main-star', starCmt);
  $ROOT.on('keydown', '.mws-editable', hotKeyEvent);
  $ROOT.on('focus', '.mws-editable', atSuggest);
  $ROOT.on('blur', '.mws-editable', atBlur);
  $ROOT.on('keyup paste', '.mws-editable', watchValue);

  $(window).on('scroll', loadPage);

}(shuoQuery);
