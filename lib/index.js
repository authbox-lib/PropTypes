module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var PropTypes = _interopRequire(__webpack_require__(1));

	var validate = _interopRequire(__webpack_require__(2));

	var assign = Object.assign || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];
	    for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }
	  return target;
	};

	module.exports = assign({}, PropTypes, { validate: validate });

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */

	"use strict";

	function nullFunction() {
	  return null;
	}

	var ANONYMOUS = "<<anonymous>>";

	// Equivalent of `typeof` but with special handling for array and regexp.
	function getPropType(propValue) {
	  var propType = typeof propValue;
	  if (Array.isArray(propValue)) {
	    return "array";
	  }
	  if (propValue instanceof RegExp) {
	    // Old webkits (at least until Android 4.0) return 'function' rather than
	    // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
	    // passes PropTypes.object.
	    return "object";
	  }
	  return propType;
	}

	function createChainableTypeChecker(validate) {
	  function checkType(isRequired, props, propName, descriptiveName, location) {
	    descriptiveName = descriptiveName || ANONYMOUS;
	    if (props[propName] == null) {
	      var locationName = location;
	      if (isRequired) {
	        return new Error("Required " + locationName + " `" + propName + "` was not specified in " + ("`" + descriptiveName + "`."));
	      }
	      return null;
	    } else {
	      return validate(props, propName, descriptiveName, location);
	    }
	  }

	  var chainedCheckType = checkType.bind(null, false);
	  chainedCheckType.isRequired = checkType.bind(null, true);

	  return chainedCheckType;
	}

	function createPrimitiveTypeChecker(expectedType) {
	  function validate(props, propName, descriptiveName, location) {
	    var propValue = props[propName];
	    var propType = getPropType(propValue);
	    if (propType !== expectedType) {
	      var locationName = location;
	      // `propValue` being instance of, say, date/regexp, pass the 'object'
	      // check, but we can offer a more precise error message here rather than
	      // 'of type `object`'.
	      var preciseType = getPreciseType(propValue);

	      return new Error("Invalid " + locationName + " `" + propName + "` of type `" + preciseType + "` " + ("supplied to `" + descriptiveName + "`, expected `" + expectedType + "`."));
	    }
	    return null;
	  }
	  return createChainableTypeChecker(validate);
	}

	function createAnyTypeChecker() {
	  return createChainableTypeChecker(nullFunction);
	}

	function createArrayOfTypeChecker(typeChecker) {
	  function validate(props, propName, descriptiveName, location) {
	    var propValue = props[propName];
	    if (!Array.isArray(propValue)) {
	      var locationName = location;
	      var propType = getPropType(propValue);
	      return new Error("Invalid " + locationName + " `" + propName + "` of type " + ("`" + propType + "` supplied to `" + descriptiveName + "`, expected an array."));
	    }
	    for (var i = 0; i < propValue.length; i++) {
	      var error = typeChecker(propValue, i, descriptiveName, location);
	      if (error instanceof Error) {
	        return error;
	      }
	    }
	    return null;
	  }
	  return createChainableTypeChecker(validate);
	}

	function createInstanceTypeChecker(expectedClass) {
	  function validate(props, propName, descriptiveName, location) {
	    if (!(props[propName] instanceof expectedClass)) {
	      var locationName = location;
	      var expectedClassName = expectedClass.name || ANONYMOUS;
	      return new Error("Invalid " + locationName + " `" + propName + "` supplied to " + ("`" + descriptiveName + "`, expected instance of `" + expectedClassName + "`."));
	    }
	    return null;
	  }
	  return createChainableTypeChecker(validate);
	}

	function createEnumTypeChecker(expectedValues) {
	  function validate(props, propName, descriptiveName, location) {
	    var propValue = props[propName];
	    for (var i = 0; i < expectedValues.length; i++) {
	      if (propValue === expectedValues[i]) {
	        return null;
	      }
	    }

	    var locationName = location;
	    var valuesString = JSON.stringify(expectedValues);
	    return new Error("Invalid " + locationName + " `" + propName + "` of value `" + propValue + "` " + ("supplied to `" + descriptiveName + "`, expected one of " + valuesString + "."));
	  }
	  return createChainableTypeChecker(validate);
	}

	function createObjectOfTypeChecker(typeChecker) {
	  function validate(props, propName, descriptiveName, location) {
	    var propValue = props[propName];
	    var propType = getPropType(propValue);
	    if (propType !== "object") {
	      var locationName = location;
	      return new Error("Invalid " + locationName + " `" + propName + "` of type " + ("`" + propType + "` supplied to `" + descriptiveName + "`, expected an object."));
	    }
	    for (var key in propValue) {
	      if (propValue.hasOwnProperty(key)) {
	        var error = typeChecker(propValue, key, descriptiveName, location);
	        if (error instanceof Error) {
	          return error;
	        }
	      }
	    }
	    return null;
	  }
	  return createChainableTypeChecker(validate);
	}

	function createUnionTypeChecker(arrayOfTypeCheckers) {
	  function validate(props, propName, descriptiveName, location) {
	    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
	      var checker = arrayOfTypeCheckers[i];
	      if (checker(props, propName, descriptiveName, location) == null) {
	        return null;
	      }
	    }

	    var locationName = location;
	    return new Error("Invalid " + locationName + " `" + propName + "` supplied to " + ("`" + descriptiveName + "`."));
	  }
	  return createChainableTypeChecker(validate);
	}

	function createShapeTypeChecker(shapeTypes) {
	  function validate(props, propName, descriptiveName, location) {
	    var propValue = props[propName];
	    var propType = getPropType(propValue);
	    if (propType !== "object") {
	      var locationName = location;
	      return new Error("Invalid " + locationName + " `" + propName + "` of type `" + propType + "` " + ("supplied to `" + descriptiveName + "`, expected `object`."));
	    }
	    for (var key in shapeTypes) {
	      var checker = shapeTypes[key];
	      if (!checker) {
	        continue;
	      }
	      var error = checker(propValue, key, descriptiveName, location);
	      if (error) {
	        return error;
	      }
	    }
	    return null;
	  }
	  return createChainableTypeChecker(validate);
	}

	// This handles more types than `getPropType`. Only used for error messages.
	// See `createPrimitiveTypeChecker`.
	function getPreciseType(propValue) {
	  var propType = getPropType(propValue);
	  if (propType === "object") {
	    if (propValue instanceof Date) {
	      return "date";
	    } else if (propValue instanceof RegExp) {
	      return "regexp";
	    }
	  }
	  return propType;
	}

	module.exports = {
	  array: createPrimitiveTypeChecker("array"),
	  bool: createPrimitiveTypeChecker("boolean"),
	  func: createPrimitiveTypeChecker("function"),
	  number: createPrimitiveTypeChecker("number"),
	  object: createPrimitiveTypeChecker("object"),
	  string: createPrimitiveTypeChecker("string"),

	  any: createAnyTypeChecker(),
	  arrayOf: createArrayOfTypeChecker,
	  instanceOf: createInstanceTypeChecker,
	  objectOf: createObjectOfTypeChecker,
	  oneOf: createEnumTypeChecker,
	  oneOfType: createUnionTypeChecker,
	  shape: createShapeTypeChecker
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */

	"use strict";

	var loggedTypeFailures = {};

	var validate = function (propTypes, props, className) {
	  var propName;
	  for (propName in propTypes) {
	    if (propTypes.hasOwnProperty(propName)) {
	      if (typeof propTypes[propName] !== "function") {
	        throw new Error(className + ": attributes type `" + propName + "` is invalid; it must be a function");
	      }

	      var error = propTypes[propName](props, propName, className, "prop");
	      if (error instanceof Error) {
	        throw error;
	      }
	    }
	  }

	  for (propName in props) {
	    if (props.hasOwnProperty(propName) && !propTypes.hasOwnProperty(propName)) {
	      throw new Error("Unknown prop `" + propName + "`" + (className ? " passed to " + className : ""));
	    }
	  }
	};

	module.exports = validate;

/***/ }
/******/ ]);