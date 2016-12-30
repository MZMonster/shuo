/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author Tracy
 * @date  15/12/4.
 * @description
 *
 */
var should = require('should');
var rewire = require('rewire');
var path = require('path');

describe('DataService', function () {

	var comments;
	var parseResult;

	describe('#readJsonFile', function () {
		it('return json data', function (done) {
			var filePath = path.resolve(__dirname, '../../file/comments.json');
			DataService.readJsonFile(filePath).then(function(results) {
				comments = results;
				results.should.be.json;
				done();
			});
		});
	});

	describe('#_parseComments', function () {
		var _parseComments;
		before(function () {
			_parseComments = rewire('../../../api/services/DataService.js').__get__('_parseComments');
		});
		it('parse the comments return comments、users、threads', function () {
			parseResult = _parseComments(comments);
			parseResult.should.have.properties(['comments', 'threads', 'users']);
		});

	});

	describe.skip('#savaToMysql', function () {
		it('save comments to mysql database', function (done) {
			DataService.savaToMysql(parseResult).then(function(resulst) {
			  resulst.should.be.true;
				done();
			});
		});
	});
});