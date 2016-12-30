/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author wuyanxin
 * @date  15/11/25
 * @description
 *
 */

import _ from 'lodash';
import Promise from 'bluebird';
import ExpectedError from '../lib/ExpectedError';
import {markdown} from 'markdown';
import request from 'request';
import emoji from 'emoji-parser';
import xss from 'xss';

const THREAD_SELECT = ['uuid', 'sourceID', 'cmtCount', 'partsCount', 'star', 'hate', 'view'];
let EMOJI_DIR = 'https://wan.res.meizu.com/res-shuo/pro/images/emoji';

/**
 * 创建一条评论
 * @param comment
 * @returns {*}
 */
function submit(comment) {
  if (!comment.content || !comment.content.trim()) {
    sails.log.debug(comment);
    return Promise.reject(new ExpectedError('40002'));
  }
  try {
    UtilService.checkNotNull(comment.site, comment.threadID, comment.user);
  } catch (e) {
    sails.log.debug(comment);
    return Promise.reject(e);
  }

  // markdown support
  comment.srcContent = comment.content;

  // escape at users
  return _escapeAtUsers(comment.srcContent, comment.threadID).then(({atContent, atUsers}) => {
    comment.content = markdown.toHTML(atContent || comment.srcContent);
    comment.content = emoji.parse(comment.content, EMOJI_DIR, {classes: 'mws-emoji'});
    comment.atUsers = atUsers || null;

    // 过滤敏感词
    comment.content = WordFilterService.checkText(comment.content).text;

    // prevent xss
    comment.content = xss(comment.content);
    comment.srcContent = xss(comment.srcContent);

    // 回复评论
    if (comment.parentID) {
      return User.findOne({uuid: comment.replyTo}).then(replyUser => {
        if (!replyUser) {
          return Promise.reject(new ExpectedError('40006'));
        }
        comment.replyTo = replyUser.id;
        return Comment.create(comment);
      });
    }

    return Comment.create(comment);
  });
}

/**
 * At users 转义
 * @param content
 * @param threadID
 * @private
 */
function _escapeAtUsers(content, threadID) {

  /**
   * 查找被at用户的正则表达式
   * 匹配:
   *  1. '@'符号开始,空格结束的字符串
   *  2. '@'符号开始,文本末尾结束的字符串
   * @type {RegExp}
   */
  let findAtUsersFilter = /@[^ ]+( |$)/g;

  /**
   * 用于替换用户名中'@'符号的正则表达式
   * 匹配: 以@开头的字符串
   * @type {RegExp}
   */
  let replaceAtFilter = /^@/g;

  // 从文本中找出被at的用户名
  let atUsers = _.map(content.match(findAtUsersFilter), item => item.trim().replace(replaceAtFilter, ''));

  if(!atUsers || atUsers.length === 0){
    return Promise.resolve({});
  }

  // 从文章中查找对应的用户
  return atSuggestList(threadID ,{
    where: {username: atUsers},
    select: ['remoteID', 'username', 'homepage']
  }).then((users) => {
    if (!users || users.length === 0){
      return content;
    }

    /**
     * 用于替换文本中被搜索出被at的用户的文本
     * 匹配: 以'@'符号开始,包含着指定用户名的文本
     */
    let replaceAtUserStr = '@(' + _.compact(_.pluck(users, 'username')).toString().replace(/,/g, '|') + ')';
    let replaceAtUserFilter = new RegExp(replaceAtUserStr, 'g');

    // 替换对应的用户文本成markdown 超链接格式
    let usersObj = _.groupBy(users, 'username');
    let atContent = content.replace(replaceAtUserFilter, match => {
      return `[${match}](${usersObj[match.replace(replaceAtFilter, '')][0].homepage})`;
    });
    let atUsers = _.pluck(users, 'remoteID');
    return {atContent, atUsers};
  });
}

/**
 * 检查当前用户是否为父评论点过赞
 * @param user
 * @param comments 包含点赞主体（comment/thread）的数组 [{uuid: 'ssss'}]
 * @returns {*}
 * @private
 */
function _hasStarred(user, comments) {
  if (!user) {
    return Promise.resolve(comments);
  }

  let uuids = _.pluck(comments, 'uuid');
  return PraiseLog.find({
    where: {
      user: user,
      targetID: uuids,
      action: PraiseLog.config.action.STAR
    },
    select: ['targetID']
  }).then(function(logs) {
    let staredID = _.pluck(logs, 'targetID');
    for (let i of comments.keys()) {
      comments[i].hasStarred = staredID.includes(comments[i].uuid);
    }
    return comments;
  });
}

/**
 * 获取一页直接评论列表
 * @param site
 * @param user
 * @param threadID
 * @param options
 * @returns {Comment[]}
 */
function _getComments(site, threadID, user, options) {
  let query = {
    where: {
      site: site,
      threadID: threadID,
      parentID: null,
      status: Comment.config.status.PUBLISH
    },
    select: options.commentSelect || Comment.config.select.FRONT,
    sort: options.sort,
    limit: options.limit,
  };

  // 如果客户端要求返回非嵌套的评论，去掉父评论限制
  if (options.flat) {
    delete query.where.parentID;
  }

  // if options.limit and options.page exist, limit query.
  if (options.limit && options.page){
    query.skip = (options.page - 1) * options.limit;
  }

  return Comment.find(query).populate('user').then(comments => {
    if (options.flat) {
      return comments;
    }

    // populate children comment
    return Promise.map(comments, (comment, i) => {
      if (comment.replyCount) {
        let query = {
          where: {
            parentID: comment.uuid,
            status: Comment.config.status.PUBLISH
          },
          select: options.commentSelect || Comment.config.select.FRONT,
          sort: {'id': 1}
        };
        if (options.cLimit){
          query.limit = options.cLimit;
        }

        return Comment.find(query).populate('user').populate('replyTo').then(children => {
          comments[i].children = children;
        });
      }
    }, {concurrency: 10}).then(() => comments);
  }).then(comments => _hasStarred(user, comments));
}

/**
 * 格式化排序条件
 * @param sort
 * @returns {*}
 * @private
 */
function _formatSort(sort = 'hot') {
  let sortObj = {'star': 0, 'id': 0};

  switch (sort) {
    case 'hot':
      break;  // 默认
    case 'new':
      sortObj = {id: 0};
      break;
    case 'old':
      sortObj = {id: 1};
      break;
  }

  return _.merge({'isTop': 0}, sortObj);
}

/**
 * 获取文章评论列表
 * @param site
 * @param sourceID
 * @param user
 * @param options
 * @returns {Object}
 * {
 *   threadID: 'fae98886-cac4-431e-bb3a-f912aba15b69',
 *   cmtCount: 78,  // 评论数
 *   partsCount: 103,  // 参与数
 *   page: 1,  // 当前页
 *   limit: 30,  // 每页几条
 *   totalPage: 3,  // 共多少页
 *   comments: [    // 评论列表
 *     {
 *       uuid: 'a6404968-15c4-4ac9-925c-3ffca11f7c89',
 *       srcContent: null,
 *       content: 'Juezo ra ulifo vipbi ano fecot tupvi wuzu zigubaruf ini ufimi kamofhic romtowad zijlom vara.',
 *       parentID: null,
 *       isTop: false,
 *       star: 3,
 *       hate: 0,
 *       hasStarred: true,
 *       status: 2,
 *       replyCount: 1,
 *       children: [{
 *         srcContent: null,
 *         content: 'Juezo ra ulifo vipbi ano fecot tupvi wuzu zigubaruf ini ufimi kamofhic romtowad zijlom vara.',
 *         parentID: 'a6404968-15c4-4ac9-925c-3ffca11f7c89',
 *         isTop: false,
 *         star: 0,
 *         hate: 0,
 *         status: 2,
 *         replyCount: 1,
 *         user: {user oject},
 *         replyTo: {user oject}
 *       }]
 *     },
 *     ...
 *   ]
 * }
 */
function list(site, sourceID, user, options) {
  if (!sourceID) {
    return Promise.reject(new ExpectedError('40001'));
  }

  options = _.merge({
    page: 1,
    limit: Comment.config.LIMIT,
    cLimit:Comment.config.C_LIMIT,
    flat: false
  }, options);
  options.sort = _formatSort(options.sort);

  let result = {
    sourceID: sourceID
  };

  return Thread.findOne({
    site: site,
    sourceID: sourceID,
    select: options.threadSelect || ['uuid', 'cmtCount', 'partsCount', 'star', 'hate', 'view']
  }).then(thread => {
    if (!thread) {
      return Promise.reject(new ExpectedError('40003', sourceID));
    }
    return _hasStarred(user, [thread]).then(threads => threads[0]);
  }).then(thread => {

    _.extend(result, thread);
    result.threadID = result.uuid;
    delete result.uuid;

    // if options.limit exits, add pagination attribute.
    if (options.limit){
      result.pagination = {
        page: options.page,
        limit: options.limit,
        pageCount: Math.ceil(thread.cmtCount / options.limit)
      };
    }

    return _getComments(site, thread.uuid, user, options);
  }).then(function(comments) {
    result.comments = comments;
    user && (result.currentUser = user);
    return result;
  });
}

/**
 * 删除一条评论
 * @param site
 * @param commentID
 * @param user
 * @returns {*}
 */
function destroy(site, commentID, user) {
  try {
    UtilService.checkNotNull(site, commentID, user);
  } catch (e) {
    return Promise.reject(e);
  }

  return Comment.update({
    site: site,
    uuid: commentID,
    user: user,
    status: Comment.config.status.PUBLISH
  }, {status: Comment.config.status.DELETE}).then((comments) => {

    let data = {result: !!comments.length};

    if (!data.result) {
      return data;
    }

    // thread的统计数自减
    if (comments[0].parentID) {
      // 删除子评论
      // 参与数-1
      return Thread.increment({uuid: comments[0].threadID}, ['partsCount'], -1).then(() => {
        // 父评论的子评论数-1
        return Comment.increment({uuid: comments[0].parentID}, ['replyCount'], -1);
      }).then(() => {
        return data;
      });
    } else {
      // 删除父评论
      // 评论数-1
      data.isParent = true;
      return Thread.increment({uuid: comments[0].threadID}, ['cmtCount'], -1).then(() => {
        // 参与数减1,再减去子评论数
        return Thread.increment({uuid: comments[0].threadID}, ['partsCount'], -(comments[0].replyCount + 1));
      }).then(() => {
        return data;
      });
    }
  });
}

/**
 * 评论回推接口
 * @param comment
 * @param url
 * @param appkey
 * @returns {null}
 */
/* istanbul ignore next */
function pushBack(comment, url, appkey) {
  var TRYAGAIN_LIMIT = 5;
  var TRYAGAIN_NUM   = 0;
  function tryagain(data) {
    TRYAGAIN_NUM++;
    request.post({
      url: url,
      form: {data: data},
      headers: {
        'User-Agent': 'meizushuo'
      }
    }, (error, response) => {
      if(error) {
        sails.log.error('推送评论失败，发送请求失败：\n', {
          url: url,
          error: error
        });
        if(TRYAGAIN_NUM > TRYAGAIN_LIMIT) {
          sails.log.debug('已达重发上限：', TRYAGAIN_LIMIT);
          return null;
        }
        sails.log.debug('尝试重新发送...');
        sails.log.debug('TRYAGAIN_NUM: ', TRYAGAIN_NUM);
        return tryagain(data);
      }
      if(response.statusCode !== 200) {
        return sails.log.error('推送评论失败，对方拒绝：\n', {url: url, body: response.body});
      }
    });
  }

  if (!url) {
    return null;
  }
  let data;
  try{
    data = JWTService.encode('pushback', comment, appkey);
  }catch(error){
    return sails.log.error('comment jwt encode failed:', error.message);
  }
  tryagain(data);
}

/**
 * @用户搜索列表
 * @param threadID
 * @param opt
 * @returns {Promise.<T>|*|Promise}
 * [
 *   {
 *       "username": "用户480002556",
 *       "homepage": "http://wan.meizu.com/people/VJ3bn4QUx"
 *   },
 *   {
 *       "username": "橙子d",
 *       "homepage": "http://wan.meizu.com/people/4JTVK-dxe"
 *   },
 *   ...
 * ]
 */
function atSuggestList(threadID, opt) {
  let options = opt || {};
  let {username, limit, select, where} = options;
  let query = {
    where:{threadID},
    sort: {id: 'DESC'},
    select: ['user']
  };
  return Comment.find(query).then((comments) => {
    if (!comments || comments.length === 0){
      return null;
    }
    let query = {
      where: {id: _.pluck(comments, 'user')},
      select: ['username', 'homepage']
    };
    if (where){
      query.where = _.merge(query.where, where);
    }
    if (select){
      query.select = select;
    }
    if (limit){
      query.limit = limit;
    }
    if (username) {
      query.where.username = {'contains': username};
    }
    return User.find(query);
  });
}

/**
 * 获取更多子评论
 * @param site
 * @param commentID
 * @param page
 * @param limit
 * @returns {*}
 */
function getMoreReplies(site, commentID, page = 1, limit = Comment.config.C_LIMIT) {
  if (!commentID) {
    return Promise.reject(new ExpectedError('40009'));
  }

  return Comment.find({
    where: {
      site,
      parentID: commentID,
      status: Comment.config.status.PUBLISH
    },
    select: Comment.config.select.FRONT,
    sort: {'id': 1},
    skip: (page - 1) * limit,
    limit: limit
  }).populate('user').populate('replyTo').then(children => {
    return {children};
  });
}

/**
 *
 * @param site
 * @param sourceIDs
 * @param options
 * @returns {*}
 */
function getGroupOfComments(site, sourceIDs, user, limit = 4) {
  let options = {
    limit,  // 加载多少条评论， 默认4条
    sort: 'star desc',  // 评论排序
    flat: true,  // 不嵌套子评论
  }

  // 浏览数+1, 并查询thread
  return Thread.increment({site: site, sourceID: sourceIDs}, ['view'], 1, THREAD_SELECT).then(threads => {
    // 查询每个thread下的评论
    return Promise.map(threads, (thread, i) => {
      return _getComments(site, thread.uuid, user, options).then(comments => {
        thread.comments = comments;
        return thread;
      });
    }, {concurrency: 10});
  }).then(threads => _hasStarred(user, threads))
    .then(threads => _.indexBy(threads, 'sourceID'));

}

module.exports = {
  submit,
  list,
  destroy,
  pushBack,
  atSuggestList,
  getMoreReplies,
  getGroupOfComments
};
