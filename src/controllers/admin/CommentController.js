/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author JerryC
 * @date  15/12/7
 * @description
 *
 */
import _ from 'lodash';
import actionUtil from 'sails/lib/hooks/blueprints/actionUtil';
import Promise from 'bluebird';

/**
 * overwrite find
 * @param req
 * @param res
 */
function find(req, res) {
	var [threadIDs, comments] =[[], []];

	Comment
		.find()
		.where( actionUtil.parseCriteria(req))
		.limit( actionUtil.parseLimit(req))
		.skip( actionUtil.parseSkip(req))
		.sort( actionUtil.parseSort(req))
		.populateAll()
		.then(function(_comments) {
			comments = _comments;

			// add to search arrry
			for (var comment of comments) {
				threadIDs.push(comment.threadID);
			}

			return Thread.find({uuid: threadIDs})
		}).then(function(results) {
			for (var comment of comments) {
				for (var thread of results) {
					if (comment.threadID === thread.uuid) {
						comment.thread = thread;
					}
				}
			}

			res.ok(comments)
		});
}

/**
 * 覆盖原来的的更新方法
 * 在更新过程中检验如果修改了状态,同时修改相应的计数
 * @param req
 * @param res
 */
function update(req, res) {

	var pk = actionUtil.requirePk(req);
	var values = actionUtil.parseValues(req);

	// Omit the path parameter `id` from values, unless it was explicitly defined
	// elsewhere (body/query):
	var idParamExplicitlyIncluded = ((req.body && req.body.id) || req.query.id);
	if (!idParamExplicitlyIncluded) delete values.id;


	// Find and update the targeted record.
	//
	// (Note: this could be achieved in a single query, but a separate `findOne`
	//  is used first to provide a better experience for front-end developers
	//  integrating with the blueprint API.)
	Comment.findOne(pk).populateAll().exec(function found(err, matchingRecord) {

		if (err) return res.serverError(err);
		if (!matchingRecord) return res.notFound();

		// Add by wuyanxin
		// 如果修改了状态,并且是从通过状态改到不通过或反之
		// 则同时修改相应的计数
		// 从删除和不通过状态之间切换不影响计数
		let incrementQ = Promise.resolve();
		let PUBLISH = Comment.config.status.PUBLISH;
		if (typeof values.status !== 'undefined'
			&& matchingRecord.status !== values.status
			&& (values.status === PUBLISH || matchingRecord.status === PUBLISH)) {

			let increment = 0;

			// 从通过状态改到不通过则-1, 反之+1
		  if (values.status < PUBLISH) {
				increment = -1;
		  }
			else if (matchingRecord.status < PUBLISH) {
			  increment = 1;
			}

			if (!matchingRecord.parentID) {
				incrementQ = Thread.increment({uuid: matchingRecord.threadID}, ['cmtCount', 'partsCount'], increment);
			} else {
				incrementQ = Thread.increment({uuid: matchingRecord.threadID}, ['partsCount'], increment).then(() => {
					return Comment.increment({uuid: matchingRecord.parentID}, ['replyCount'], increment);
				});
			}
		}

		incrementQ.then(function() {
			Comment.update(pk, values).exec(function updated(err, records) {

				// Differentiate between waterline-originated validation errors
				// and serious underlying issues. Respond with badRequest if a
				// validation error is encountered, w/ validation info.
				if (err) return res.negotiate(err);


				// Because this should only update a single record and update
				// returns an array, just use the first item.  If more than one
				// record was returned, something is amiss.
				if (!records || !records.length || records.length > 1) {
					req._sails.log.warn(`Unexpected output from ${Comment.globalId}.update.`);
				}

				var updatedRecord = records[0];

				// If we have the pubsub hook, use the Model's publish method
				// to notify all subscribers about the update.
				if (req._sails.hooks.pubsub) {
					if (req.isSocket) { Model.subscribe(req, records); }
					Comment.publishUpdate(pk, _.cloneDeep(values), !req.options.mirror && req, {
						previous: matchingRecord.toJSON()
					});
				}

				// Do a final query to populate the associations of the record.
				//
				// (Note: again, this extra query could be eliminated, but it is
				//  included by default to provide a better interface for integrating
				//  front-end developers.)
				var Q = Comment.findOne(updatedRecord[Comment.primaryKey]);
				Q = actionUtil.populateEach(Q, req);
				Q.exec(function foundAgain(err, populatedRecord) {
					if (err) return res.serverError(err);
					if (!populatedRecord) return res.serverError('Could not find record after updating!');
					res.ok(populatedRecord);
				}); // </foundAgain>
			});// </updated>
		}).catch(function (err) {
		  res.serverError(err);
		});

	}); // </found>
}

module.exports = _.merge(_.cloneDeep(require('../base/count')), {
	find: find,
	update: update,
  _config: {model: 'comment'}
});