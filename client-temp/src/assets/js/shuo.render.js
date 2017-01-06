/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author wuyanxin
 * @date  15/12/9
 * @description
 *
 */
``
!function ($) {
  var $ROOT = $('#' + window.shuo.options.target);
  var LOGIN_MSG = '';
  var SUGGEST_USERS = [];
  var VERSION = window.shuo.options.version;
  var DEBUG = window.shuo.options.debug;

  // =============
  // Start Shuo
  // =============

  // 引入CSS文件
  // window.shuo.include('../css/shuo-default.'+(DEBUG?'':(VERSION+'.min.'))+'css', 'css');
  window.shuo.include('../assets/css/shuo-default.css');
  window.shuo.include('../assets/css/jquery.atwho.css', 'css');

  // 登录并且同步用户
  window.shuo.api.userSync(function () {

    // 加载评论列表
    window.shuo.api.load(function (data) {
      $ROOT.html(data);
      setTitleAndPh();
      initAtSuggest();
      autosize($('.mws-editable'));
      resetStoredComment();
      jumpToComment();
      initEmojiPicker();
    });

    formatLoginMsg();
  });

  /**
   * 初始化 SUGGEST_USERS
   */
  function initAtSuggest() {
    window.shuo.api.atSuggest(function (error, data) {
      if(error) {
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
   * 初始化登录提示
   */
  function formatLoginMsg() {
    var reg = /=$/g;
    var url = window.shuo.options.user_login_url;
    if (reg.test(url)) {
      // 如果登陆url配置以"="号结尾,则自助为url后添加当前url,用于return
      url += encodeURIComponent(window.location.href + '#' + window.shuo.options.target);
    }
    LOGIN_MSG = '请先<a href="'+url+'">登录</a>';
  }

  /**
   * 设置title和placeholder
   */
  function setTitleAndPh() {
    if (window.shuo.options.cmt_title) {
      $('#SHUO_title').text(window.shuo.options.cmt_title);
    }
    if (window.shuo.options.cmt_placeholder) {
      $('.mws-editable').attr('placeholder', window.shuo.options.cmt_placeholder);
    }
  }

  // =============
  // events handler
  // =============

  /**
   * 显示评论框
   */
  function showNearForm() {
    var $cmtRoot = $(this).parents('.mws-cmt-root');
    var $cmtItem = $($(this).parents('.mws-cmt-item')[0]);
    var $formWrapper = $cmtItem.children().find('>.mws-cmt-item-form');
    var isHidden = $formWrapper.hasClass('mws-hidden'); // 记录当前评论框的状态

    $ROOT.find('.mws-cmt-item-form').addClass('mws-hidden'); // hide all

    if ($formWrapper.children().length) {
      // 如果评论框已经初始化, 判断是执行隐藏还是显示
      if (isHidden) {
        // 显示输入框时还原原来的内容,并将光标定在文字的后面
        var $textarea = $formWrapper.find('.mws-form-content');
        var text = $textarea.val();
        $formWrapper.removeClass('mws-hidden');
        $textarea.val('').focus().val(text);
      }else {
        $formWrapper.addClass('mws-hidden');
      }
    } else {
      // 初始化评论框
      var parentID = $cmtRoot.parent().attr('id');

      // 克隆form表单
      var $originForm = $ROOT.find('.mws-cmt-form-wrapper').children();
      $originForm.find('.mws-form-message').text(''); // 删除错误消息
      var $form = $originForm.clone(true);

      var $textAreaWrapper = $form.find('.mws-form-controls');
      //重新建立一个未被emoji转化的textarea
      var $formTextArea = $('<textarea>').addClass('mws-editable mws-form-content');
      var username = $(this).attr('data-to-username');

      // 设置parentId和回复人
      $formTextArea.attr({
        'data-to': $(this).attr('data-to'),
        'data-parentid': parentID,
        'data-emojiable': true //初始化emoji textarea配置
      });

      $textAreaWrapper.html($formTextArea);

      // append
      $formWrapper.html($form).removeClass('mws-hidden');

      //开启回复框emoji
      window.emojiPicker.discover();
      var $emojiEditor = $formTextArea.siblings('.emoji-wysiwyg-editor');

      // 填充textarea 自动@，ps：加入emojiEditor后改为div元素 --- by Chester
      if(username) {
        $emojiEditor.html('@' + username + ' : ');
        $formTextArea.val('').focus().val('@' + username + ' : ');
      } else {
        $emojiEditor.html('');
      }

      $emojiEditor.focus();

      //emojiEditor实为div元素，通过以下处理可以focus到文本末尾，默认focus到文本头
      if(!!$emojiEditor.html()) {
        var range = document.createRange();
        range.selectNodeContents($emojiEditor[0]);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }


      // 展开隐藏的子评论
      showHiddenReply($cmtRoot);
    }
  }

  /**
   * 发表评论
   */
  var isSubmiting = false;
  function submitComment() {
    var $this = $(this);
    var $form = $this.parents('.mws-cmt-form');
    var $textarea = $form.find('.mws-form-content');
    var reg =new RegExp("\n","g");
    var $emojiTextArea = $form.find('.emoji-wysiwyg-editor');

    if ($emojiTextArea.length && !$emojiTextArea.html()) {
      $form.find('.mws-form-message').html('未输入评论内容');
      return;
    }

    if (!window.shuo.loginStatus) {
      $form.find('.mws-form-message').html(LOGIN_MSG);
      if (window.localStorage) {
        // 将用户已编辑的内容存放到localStorage
        var key = 'shuo_comment_' + shuo.options.threadID
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
      content: $textarea.val().replace(reg,'  \n'),
      parentID: $textarea.attr('data-parentID'),
      replyTo: $textarea.attr('data-to')
    }, function(err, data) {
      isSubmiting = false;
      $this.removeAttr('disabled');

      if(err) {
        return window.shuo.api.reqErrorHandle(err, function (errText) {
          $form.find('.mws-form-message').text(errText);
        });
      }

      $textarea.val('');
      $textarea.siblings('.emoji-wysiwyg-editor').html('');
      $textarea.css('height','auto');

      if ($textarea.attr('data-parentID')) {

        // 如果点击回复父评论,则回复后添加到父评论的子评论列表中
        // 如果回复的是子评论,则回复后显示在改子评论后面
        if ($textarea.attr('data-parentID') === $($form.parents('.mws-cmt-item')[0]).attr('id')) {
          $form.parents('.mws-cmt-root').find('>.mws-cmt-replies').prepend(data);
        } else {
          $($form.parents('.mws-cmt-item')[0]).after(data);
        }

        // 子评论数+1
        var moreBtn = $form.parents('.mws-cmt-root').find('.mws-btn-moreReply');
        if (moreBtn.attr('data-count')) {
          moreBtn.attr('data-count', +moreBtn.attr('data-count') + 1);
        }

        // 移除表单
        $form.parents('.mws-cmt-item-form').html('');

      } else {

        $ROOT.find('.mws-cmt-list').prepend(data);
        autosize($('#' + $(data).attr('id') + ' .mws-editable'));

        // 评论总数+1
        var $count = $ROOT.find('.mws-cmt-count');
        $count.text(+$count.text()+1);
      }
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
  function starCmt() {
    var $this = $(this);
    if (!window.shuo.loginStatus) {
      $($this.parents('.mws-cmt-item').find('.mws-item-message')[0]).html(LOGIN_MSG);
      return;
    }

    var uuid = $this.parents('.mws-cmt-item').attr('id');
    window.shuo.api.star({uuid: uuid}, function (err, data) {
      if (err) {
        return console.error(err);
      }
      $this.toggleClass('mws-cmt-starred', '').find('.mws-cmt-star').text(data.star);
    });
  }

  /**
   * At suggests
   */
  function atSuggest() {
    $(this).atwho({
      at: '@',
      displayTpl: '<li> ${username} </li>',
      insertTpl: '@${username}',
      searchKey: 'username',
      data: SUGGEST_USERS
    });
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
          if (data.isParent) {
            var $count = $ROOT.find('.mws-cmt-count');
            $count.text($count.text()-1);
          }
        } else {
          $($('#' + commentID).find('.mws-item-message')[0]).text('删除失败, 请刷新重试');
        }
      });
    }
  }

  /**
   * 上传图片
   */
  function uploadImg() {
    var $this = $(this);
    var file = $this.prop('files')[0];
    var $textarea = $this.parents('.mws-cmt-form').find('.emoji-wysiwyg-editor');

    /**
     * 上传文本处理
     */
    var textHandle = new (function ($textarea, filename) {
      var mkImgFilter = new RegExp('!\\[' + filename + '\\]\\(Uploading...\\)');
      this.uploading = function () {
        var text = $textarea.html() + '![' + filename + '](Uploading...)';
        return $textarea.html(text).siblings('.mws-form-content').val(text);
      };
      this.succeed = function (url) {
        var text = $textarea.html().replace(mkImgFilter, '![' + filename + '](' + url + ')');
        return $textarea.html(text).siblings('.mws-form-content').val(text);
      };
      this.failed = function () {
        var text = $textarea.html().replace(mkImgFilter, '![' + filename + '](Upload failed)');
        return $textarea.html(text).siblings('.mws-form-content').val(text);
      };
    })($textarea, file.name);

    textHandle.uploading();   // 上传中

    window.shuo.api.uploadImg(file, function (err, data) {
      try {
        return textHandle.succeed(data.response[0].url + '!960');   // 上传成功
      } catch (error) {
        return textHandle.failed();   // 上传失败
      }
    });
  }

  /**
   * 判断是否删除加载更多按钮, 是则删除
   * @param $cmtRoot
   */
  function removeMoreRepliesBtn($cmtRoot) {
    // 计算当前评论数与总条数对比,如果已经加载完了,则删除"加载更多"标签
    var curLength = $cmtRoot.find('>.mws-cmt-replies').children().length;
    if (!(curLength < +$cmtRoot.find('.mws-btn-moreReply').attr('data-count'))) {
      $cmtRoot.find('.mws-cmt-more').remove();
    }
  }

  /**
   * 显示第一页隐藏的子评论
   * @param $cmtRoot
   */
  function showHiddenReply($cmtRoot) {
    $cmtRoot.removeClass('mws-cmt-firstload');
    removeMoreRepliesBtn($cmtRoot);
  }

  /**
   * 加载更多子评论
   */
  function moreReplies() {
    var $this = $(this);
    var $cmtRoot = $this.parents('.mws-cmt-root');

    // 第一次加载更多直接将折叠的显示出来
    if ($cmtRoot.hasClass('mws-cmt-firstload')) {
      showHiddenReply($cmtRoot);
    }
    // 请求后台分页数据
    else {
      var page = +$this.attr('data-page');
      var commentID = $this.parents('.mws-cmt-item').attr('id');
      window.shuo.api.moreReplies({
        page: ++page,
        commentID: commentID
      }, function (err, data) {
        if (err) {
          $($('#' + commentID).find('.mws-item-message')[0]).text('加载失败, 请刷新重试');
          return;
        }
        $this.attr('data-page', page)
        $cmtRoot.find('>.mws-cmt-replies').append(data);
        removeMoreRepliesBtn($cmtRoot);
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
   * emoji-picker
   */

  function initEmojiPicker() {
    window.emojiPicker = new EmojiPicker({
      emojiable_selector: '[data-emojiable=true]',
      assetsPath: window.shuo.options.emoji_url,
      popupButtonClasses: 'icon-shuo-smile',
      iconSize: 20
    });
    window.emojiPicker.discover();
  }

  // =============
  // bind events
  // =============

  $ROOT.on('click', '.mws-btn-reply', showNearForm);
  $ROOT.on('click', '.mws-btn-star', starCmt);
  $ROOT.on('click', '.mws-btn-submit', submitComment);
  $ROOT.on('click', '.mws-pagination li:not(.mws-page-disable):not(.mws-page-active)', pageTurner);
  $ROOT.on('click', '.mws-btn-delete', deleteComment);
  $ROOT.on('click', '.mws-btn-moreReply', moreReplies);
  $ROOT.on('click', '.mws-btn-sort:not(.mws-btn-sort-active)', changeSort);

  $ROOT.on('keydown', '.mws-editable', hotKeyEvent);
  $ROOT.on('focus', '.mws-editable', atSuggest);
  $ROOT.on('change', '.mws-input-uploadImg', uploadImg);

}(shuoQuery);
