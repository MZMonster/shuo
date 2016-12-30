/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author JerryC
 * @date  15/12/8
 * @description
 *
 */

import _ from 'lodash';

module.exports = _.merge(_.cloneDeep(require('../base/count')), {
  _config: {model: 'adminlog'}
});