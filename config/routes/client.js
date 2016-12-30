/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author JerryC
 * @date  15/12/7
 * @description
 *
 */

module.exports.routes = {

  // =======
  // Thread
  // =======
  'get /thread/load'  : 'client/ThreadController.load',
  'get /thread/count' : 'client/ThreadController.count',


  // =======
  // Comment
  // =======
  'get /comment/list': 'client/CommentController.list',
  'get /comment/moreReplies': 'client/CommentController.getMoreReplies',

  'delete /comment/destroy': {
    controller: 'client/CommentController',
    action: 'destroy',
    cors  : {origin: '*'}
  },

  'post /comment/submit': {
    controller: 'client/CommentController',
    action: 'submit',
    cors: {origin: '*'}
  },

  'get /comment/atsuggest': {
    controller: 'client/CommentController',
    action: 'getSuggestUsers',
    cors: {origin: '*'}
  },

  'get /comment/group': {
    controller: 'client/CommentController',
    action: 'getGroupOfComments',
    cors: {origin: '*'}
  },


  // =======
  // Login
  // =======
  'post /login' : {
    controller: 'client/AuthController',
    action    : 'login',
    cors      : {origin: '*'}
  },
  'get /logout' : {
    controller: 'client/AuthController',
    action    : 'logout',
    cors      : {origin: '*'}
  },


  // =======
  // Praise
  // =======
  'put /star': {
    controller: 'client/PraiseController',
    action: 'star',
    cors: {origin: '*'}
  },

  // =======
  // Upload
  // =======
  'post /file/upload': {
    controller: 'client/UploadController',
    action: 'uploadImg',
    cors: {origin: '*'}
  },

  // =======
  // 列表点赞功能 类似LifeKit计步排行榜点赞功能
  // =======
  'put /praise/star': {
    controller: 'client/ListPraiseController',
    action: 'star',
    cors: {origin: '*'}
  },

  'get /praise/load': {
    controller: 'client/ListPraiseController',
    action: 'load',
    cors: {origin: '*'}
  },

  'get /praise/starredUsers': {
    controller: 'client/ListPraiseController',
    action: 'getStarredUsers',
    cors: {origin: '*'}
  }

};