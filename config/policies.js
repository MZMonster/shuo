/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#!/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.policies.html
 */
var fs = require('fs');
var path = require('path');
var _ = require('lodash');

var defaultPolicies = {

  /**
   * Open sign check
   */
  'open/UserController': {
    '*': ['site', 'openCheck']
  },
  'open/ThreadController': {
    '*': ['site', 'openCheck']
  },

  /**
   * Admin
   */
  'admin/AuthController': {
    '*': true
  },
  'admin/AdministratorController': {
    '*': ['adminLogin', 'adminLog'],
    'init': true
  },

  /**
   * Client
   */
  'client/CommentController': {
    '*': ['site', 'whiteDomainCheck'],
    'submit': ['isLoginUser', 'isFrozen', 'site', 'whiteDomainCheck'],
    'destroy': ['isLoginUser', 'isFrozen', 'site', 'whiteDomainCheck'],
    'getSuggestUsers': true,
    'getGroupOfComments': 'site'
  },
  'client/ThreadController': {
    '*': ['site', 'whiteDomainCheck']
  },
  'client/AuthController': {
    '*': ['site', 'whiteDomainCheck']
  },
  'client/PraiseController': {
    '*': ['isLoginUser', 'isFrozen', 'site', 'whiteDomainCheck']
  },
  'client/UploadController': {
    '*': ['isLoginUser']
  },
  'client/ListPraiseController': {
    '*': ['site'],
    'star': ['site', 'isLoginUser']
  }
};

/**
 * 输出：
 *   'admin/AdministratorController' : {'*': 'adminLogin'},
 *   'admin/AdminLogController'      : {'*': 'adminLogin'},
 *   'admin/AdminLoginLogController' : {'*': 'adminLogin'},
 *   'admin/CommentController'       : {'*': 'adminLogin'},
 *   'admin/IndexController'         : {'*': 'adminLogin'},
 *   'admin/SiteConfigController'    : {'*': 'adminLogin'},
 *   'admin/SiteController'          : {'*': 'adminLogin'},
 *   'admin/ThreadController'        : {'*': 'adminLogin'},
 *   'admin/UserController'          : {'*': 'adminLogin'},
 * @param policy
 * @returns {{}}
 */
function policyForAdminControllers(policy) {
  var adminPath = path.resolve(__dirname, '../api/controllers/admin');
  var adminFiles = fs.readdirSync(adminPath);
  var obj = {};
  _.map(adminFiles, function (controller) {
    controller = controller.replace('.js', '');
    controller = 'admin/' + controller;
    obj[controller] = policy;
  });
  return obj;
}

module.exports.policies = _.defaults(
  defaultPolicies,
  policyForAdminControllers({'*': ['adminLogin', 'adminLog']})
);
