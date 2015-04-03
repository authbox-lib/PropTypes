/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

var loggedTypeFailures = {};

var validate = (propTypes, props, className) => {
  for (var propName in propTypes) {
    if (propTypes.hasOwnProperty(propName)) {
      if (typeof propTypes[propName] !== 'function') {
        throw new Error(
          className + ': attributes type `' + propName + '` is invalid; it must be a function'
        );
      }

      var error = propTypes[propName](props, propName, className, 'prop');
      if (error instanceof Error) {
        throw error;
      }
    }
  }
};

export default validate;
