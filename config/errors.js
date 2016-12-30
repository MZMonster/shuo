/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author wuyanxin
 * @date  15/11/25
 * @description
 *
 */

/**
 * 以3开头代表权限相关错误
 * 以4开头代表参数相关错误
 * 以5开头表示服务端错误,如数据库错误/网络错误等
 *
 * 新增错误时按递增排序
 */
module.exports.errors = {

  /*********
   *   3   *
   *********/
  '30001': 'Sorry, you don\'t have permission to access this',
  '30002': '很抱歉,你账户已被冻结,请联系管理员',

  /*********
   *   4   *
   *********/
  '40001': 'Param is missing',
  '40002': 'Content can not be null',
  '40003': 'Invalid sourceID: ',
  '40004': 'Invalid threadID: ',
  '40005': 'Invalid appid: ',
  '40006': '回复用户不存在',
  '40007': 'Type error: ',
  '40008': '删除评论不存在, 请刷新重试',
  '40009': 'Invalid commentID: ',
  '40010': 'Invalid date: ',
  '40011': 'Record not found, please check your query',

  /*********
   *   5   *
   *********/
  '50001': 'Something wrong on the server, please report to us. https://github.com/MZMonster/shuo/issues',
  '50002': 'Action should be a function'
};
