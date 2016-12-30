/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {

  require('../views/helper');

  SensitiveWord.find({}).then(function(keywords) {
    try {
      WordFilterService.init(keywords);
    } catch(e) {
      sails.log.error(err);
      return sails.log.error('敏感词库构建失败');
    }
    sails.log.info('The tree of Sensitive words built');
  });

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};
