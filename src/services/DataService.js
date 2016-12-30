/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author Tracy
 * @date  15/12/1.
 * @description
 *
 */
var _ = require('lodash');
var jsonfile = require('jsonfile');
var Promise = require('bluebird');

/**
 * 读取json文件
 * @param filePath
 * @returns {*}
 */
function readJsonFile(filePath) {
	return new Promise(function (resolve, reject) {
		return jsonfile.readFile(filePath, function(err, result) {
			if (err) {
				return reject(err);
			}
			return resolve(result);
		});
	});
}

/**
 * 解析json对象，取出对应对象和数组
 * @param obj
 */
function _parseComments(obj) {
  if (!obj.comments.length) {
		return null;
	}

  var _thred = {};
	var _user = {};
	var commentArr = [];
	var uniqueThreadArr  = [];
	var uniqueUserArr  = [];
	_.forEach(obj.comments, function(n) {
		if (!n.topicSourceId) {
			return null;
		}

		_thred[n.topicSourceId] = {
			sourceID  : n.topicSourceId,
			url       : n.topicUrl,
			title     : n.topicTitle,
			category :  n.topicUrl.split('/')[3],
			site: 1
		};
		commentArr.push({
			threadID : n.topicSourceId,
			user     : n.referUserId,
			parentID : +n.replyId || null,
			referID  : n.id,
			content  : n.content,
			createdAt: n.ctime,
			site: 1
		});
		_user[n.referUserId]= {
			avatar  : n.iconUrl,
			remoteID: n.referUserId,
			username: n.nickname,
			site: 1
		};
	});

	_.forEach(_thred, function(n) {
		uniqueThreadArr.push(n);
	});

	_.forEach(_user, function(n) {
		uniqueUserArr.push(n);
	});

	return {
		threads : uniqueThreadArr,
		comments: commentArr,
		users   : uniqueUserArr
	};
}

/**
 * 将解析好的数据存入数据库
 * 1. 根据parese的thread创建
 * @param data
 */
function savaToMysql(data) {

	var parseData = _parseComments(data);
	var threads;
	var comments;
	var _task = [
		Promise.map(parseData.threads, function (thread) {
			return Thread.findOrCreate({sourceID: thread.sourceID}, thread);
		}),
	  Promise.map(parseData.users, function (user) {
			return User.findOrCreate({remoteID: user.remoteID}, user);
		})
	];

	return Promise.all(_task).then(function(results) {

		threads = results[0];
		// 拼装comment
		_.forEach(parseData.comments, function(c) {
			_.forEach(threads, function(t) {
				if (c.threadID === t.sourceID) {
					c.threadID = t.uuid;
				}
			});

			_.forEach(results[1], function(u) {
				if (c.user === u.remoteID) {
					c.user = u.id;
				}
			});
		});

		return Promise.map(parseData.comments, function (comment) {
			return Comment.findOrCreate({referID: comment.referID}, comment);
		});
	}).then(function(_comments) {
		comments = _comments;

		// 根据referID匹配parentID, 用Thread的uuidl来标识comment的parentID
		var updateList = [];
		_.forEach(comments, function(n) {
			_.forEach(comments, function(o) {
					if (n.parentID == o.referID) {
						updateList.push({old: n.parentID, now: {parentID: o.uuid, replyTo: o.user}});
					}
			});
		});
		return Promise.map(updateList, function(item) {
			return Comment.update({parentID: item.old}, item.now);
		});

	}).then(function() {

		return Promise.map(threads, function(thread) {
			var update = {};
			return Comment.count({threadID: thread.uuid, parentID: null}).then(function(cmtCount) {
				update.cmtCount = cmtCount;
				return Comment.count({threadID: thread.uuid});
			}).then(function(partsCount) {
				update.partsCount = partsCount;
				return Thread.update(thread.id, update);
			});
		});

	}).then(function() {

		return Promise.map(comments, function(comment) {
			var update = {};
			return Comment.count({parentID: comment.uuid}).then(function(count) {
			  update.replyCount = count;
				return Comment.update(comment.id, update);
			});
		});

	}).then(() => true);

}

module.exports = {
	readJsonFile: readJsonFile,
	savaToMysql : savaToMysql
};