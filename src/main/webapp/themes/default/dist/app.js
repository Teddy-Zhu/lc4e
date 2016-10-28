/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 70);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};


/***/ },
/* 1 */
/***/ function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
	}),
	getHeadElement = memoize(function () {
		return document.head || document.getElementsByTagName("head")[0];
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [];

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the bottom of <head>.
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
}

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var head = getHeadElement();
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			head.insertBefore(styleElement, head.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			head.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		head.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	styleElement.type = "text/css";
	insertStyleElement(options, styleElement);
	return styleElement;
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;
	var sourceMap = obj.sourceMap;

	if (media) {
		styleElement.setAttribute("media", media);
	}

	if (sourceMap) {
		// https://developer.chrome.com/devtools/docs/javascript-debugging
		// this makes source maps inside style tags work properly in Chrome
		css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */';
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/*!
 * Vue.js v2.0.3
 * (c) 2014-2016 Evan You
 * Released under the MIT License.
 */
'use strict';

/*  */

/**
 * Convert a value to a string that is actually rendered.
 */
function _toString (val) {
  return val == null
    ? ''
    : typeof val === 'object'
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert a input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val, 10);
  return (n || n === 0) ? n : val
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Remove an item from an array
 */
function remove$1 (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether the object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Check if value is primitive
 */
function isPrimitive (value) {
  return typeof value === 'string' || typeof value === 'number'
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  }
}

/**
 * Camelize a hyphen-delmited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /([^-])([A-Z])/g;
var hyphenate = cached(function (str) {
  return str
    .replace(hyphenateRE, '$1-$2')
    .replace(hyphenateRE, '$1-$2')
    .toLowerCase()
});

/**
 * Simple bind, faster than native
 */
function bind$1 (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }
  // record original fn length
  boundFn._length = fn.length;
  return boundFn
}

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
var toString = Object.prototype.toString;
var OBJECT_STRING = '[object Object]';
function isPlainObject (obj) {
  return toString.call(obj) === OBJECT_STRING
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/**
 * Perform no operation.
 */
function noop () {}

/**
 * Always return false.
 */
var no = function () { return false; };

/**
 * Generate a static keys string from compiler modules.
 */
function genStaticKeys (modules) {
  return modules.reduce(function (keys, m) {
    return keys.concat(m.staticKeys || [])
  }, []).join(',')
}

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  /* eslint-disable eqeqeq */
  return a == b || (
    isObject(a) && isObject(b)
      ? JSON.stringify(a) === JSON.stringify(b)
      : false
  )
  /* eslint-enable eqeqeq */
}

function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/*  */

var config = {
  /**
   * Option merge strategies (used in core/util/options)
   */
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Whether to enable devtools
   */
  devtools: "development" !== 'production',

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: null,

  /**
   * Custom user key aliases for v-on
   */
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * List of asset types that a component can own.
   */
  _assetTypes: [
    'component',
    'directive',
    'filter'
  ],

  /**
   * List of lifecycle hooks.
   */
  _lifecycleHooks: [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed',
    'activated',
    'deactivated'
  ],

  /**
   * Max circular updates allowed in a scheduler flush cycle.
   */
  _maxUpdateCount: 100,

  /**
   * Server rendering?
   */
  _isServer: process.env.VUE_ENV === 'server'
};

/*  */

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = /[^\w\.\$]/;
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  } else {
    var segments = path.split('.');
    return function (obj) {
      for (var i = 0; i < segments.length; i++) {
        if (!obj) { return }
        obj = obj[segments[i]];
      }
      return obj
    }
  }
}

/*  */
/* globals MutationObserver */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser =
  typeof window !== 'undefined' &&
  Object.prototype.toString.call(window) !== '[object Object]';

var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = UA && UA.indexOf('android') > 0;
var isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return /native code/.test(Ctor.toString())
}

/**
 * Defer a task to execute it asynchronously.
 */
var nextTick = (function () {
  var callbacks = [];
  var pending = false;
  var timerFunc;

  function nextTickHandler () {
    pending = false;
    var copies = callbacks.slice(0);
    callbacks.length = 0;
    for (var i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }

  // the nextTick behavior leverages the microtask queue, which can be accessed
  // via either native Promise.then or MutationObserver.
  // MutationObserver has wider support, however it is seriously bugged in
  // UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
  // completely stops working after triggering a few times... so, if native
  // Promise is available, we will use it:
  /* istanbul ignore if */
  if (typeof Promise !== 'undefined' && isNative(Promise)) {
    var p = Promise.resolve();
    timerFunc = function () {
      p.then(nextTickHandler);
      // in problematic UIWebViews, Promise.then doesn't completely break, but
      // it can get stuck in a weird state where callbacks are pushed into the
      // microtask queue but the queue isn't being flushed, until the browser
      // needs to do some other work, e.g. handle a timer. Therefore we can
      // "force" the microtask queue to be flushed by adding an empty timer.
      if (isIOS) { setTimeout(noop); }
    };
  } else if (typeof MutationObserver !== 'undefined' && (
    isNative(MutationObserver) ||
    // PhantomJS and iOS 7.x
    MutationObserver.toString() === '[object MutationObserverConstructor]'
  )) {
    // use MutationObserver where native Promise is not available,
    // e.g. PhantomJS IE11, iOS7, Android 4.4
    var counter = 1;
    var observer = new MutationObserver(nextTickHandler);
    var textNode = document.createTextNode(String(counter));
    observer.observe(textNode, {
      characterData: true
    });
    timerFunc = function () {
      counter = (counter + 1) % 2;
      textNode.data = String(counter);
    };
  } else {
    // fallback to setTimeout
    /* istanbul ignore next */
    timerFunc = function () {
      setTimeout(nextTickHandler, 0);
    };
  }

  return function queueNextTick (cb, ctx) {
    var func = ctx
      ? function () { cb.call(ctx); }
      : cb;
    callbacks.push(func);
    if (!pending) {
      pending = true;
      timerFunc();
    }
  }
})();

var _Set;
/* istanbul ignore if */
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = (function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] !== undefined
    };
    Set.prototype.add = function add (key) {
      this.set[key] = 1;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/* not type checking this file because flow doesn't play well with Proxy */

var hasProxy;
var proxyHandlers;
var initProxy;

if (true) {
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  hasProxy =
    typeof Proxy !== 'undefined' &&
    Proxy.toString().match(/native code/);

  proxyHandlers = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) || key.charAt(0) === '_';
      if (!has && !isAllowed) {
        warn(
          "Property or method \"" + key + "\" is not defined on the instance but " +
          "referenced during render. Make sure to declare reactive data " +
          "properties in the data option.",
          target
        );
      }
      return has || !isAllowed
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      vm._renderProxy = new Proxy(vm, proxyHandlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */


var uid$2 = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  this.id = uid$2++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove$1(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.target) {
    Dep.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stablize the subscriber list first
  var subs = this.subs.slice();
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null;
var targetStack = [];

function pushTarget (_target) {
  if (Dep.target) { targetStack.push(Dep.target); }
  Dep.target = _target;
}

function popTarget () {
  Dep.target = targetStack.pop();
}

/*  */


var queue = [];
var has$1 = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  queue.length = 0;
  has$1 = {};
  if (true) {
    circular = {};
  }
  waiting = flushing = false;
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  flushing = true;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    var watcher = queue[index];
    var id = watcher.id;
    has$1[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if ("development" !== 'production' && has$1[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > config._maxUpdateCount) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }

  resetSchedulerState();
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has$1[id] == null) {
    has$1[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i >= 0 && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(Math.max(i, index) + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */

var uid$1 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options
) {
  if ( options === void 0 ) options = {};

  this.vm = vm;
  vm._watchers.push(this);
  // options
  this.deep = !!options.deep;
  this.user = !!options.user;
  this.lazy = !!options.lazy;
  this.sync = !!options.sync;
  this.expression = expOrFn.toString();
  this.cb = cb;
  this.id = ++uid$1; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = function () {};
      "development" !== 'production' && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value = this.getter.call(this.vm, this.vm);
  // "touch" every property so they are all tracked as
  // dependencies for deep watching
  if (this.deep) {
    traverse(value);
  }
  popTarget();
  this.cleanupDeps();
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    var dep = this$1.deps[i];
    if (!this$1.newDepIds.has(dep.id)) {
      dep.removeSub(this$1);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
      if (
        value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          "development" !== 'production' && warn(
            ("Error in watcher \"" + (this.expression) + "\""),
            this.vm
          );
          /* istanbul ignore else */
          if (config.errorHandler) {
            config.errorHandler.call(null, e, this.vm);
          } else {
            throw e
          }
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    this$1.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subcriber list.
 */
Watcher.prototype.teardown = function teardown () {
    var this$1 = this;

  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed or is performing a v-for
    // re-render (the watcher list is then filtered by v-for).
    if (!this.vm._isBeingDestroyed && !this.vm._vForRemoving) {
      remove$1(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this$1.deps[i].removeSub(this$1);
    }
    this.active = false;
  }
};

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
var seenObjects = new _Set();
function traverse (val, seen) {
  var i, keys;
  if (!seen) {
    seen = seenObjects;
    seen.clear();
  }
  var isA = Array.isArray(val);
  var isO = isObject(val);
  if ((isA || isO) && Object.isExtensible(val)) {
    if (val.__ob__) {
      var depId = val.__ob__.dep.id;
      if (seen.has(depId)) {
        return
      } else {
        seen.add(depId);
      }
    }
    if (isA) {
      i = val.length;
      while (i--) { traverse(val[i], seen); }
    } else if (isO) {
      keys = Object.keys(val);
      i = keys.length;
      while (i--) { traverse(val[keys[i]], seen); }
    }
  }
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var arguments$1 = arguments;

    // avoid leaking arguments:
    // http://jsperf.com/closure-with-arguments
    var i = arguments.length;
    var args = new Array(i);
    while (i--) {
      args[i] = arguments$1[i];
    }
    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
        inserted = args;
        break
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * By default, when a reactive property is set, the new value is
 * also converted to become reactive. However when passing down props,
 * we don't want to force conversion because the value may be a nested value
 * under a frozen data structure. Converting it would defeat the optimization.
 */
var observerState = {
  shouldConvert: true,
  isSettingProps: false
};

/**
 * Observer class that are attached to each observed
 * object. Once attached, the observer converts target
 * object's property keys into getter/setters that
 * collect dependencies and dispatches updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    var augment = hasProto
      ? protoAugment
      : copyAugment;
    augment(value, arrayMethods, arrayKeys);
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through each property and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i], obj[keys[i]]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 *
 * istanbul ignore next
 */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value) {
  if (!isObject(value)) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    observerState.shouldConvert &&
    !config._isServer &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;

  var childOb = observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
        }
        if (Array.isArray(value)) {
          dependArray(value);
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      if (newVal === value) {
        return
      }
      if ("development" !== 'production' && customSetter) {
        customSetter();
      }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (obj, key, val) {
  if (Array.isArray(obj)) {
    obj.splice(key, 1, val);
    return val
  }
  if (hasOwn(obj, key)) {
    obj[key] = val;
    return
  }
  var ob = obj.__ob__;
  if (obj._isVue || (ob && ob.vmCount)) {
    "development" !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return
  }
  if (!ob) {
    obj[key] = val;
    return
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (obj, key) {
  var ob = obj.__ob__;
  if (obj._isVue || (ob && ob.vmCount)) {
    "development" !== 'production' && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(obj, key)) {
    return
  }
  delete obj[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = void 0, i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

function initState (vm) {
  vm._watchers = [];
  initProps(vm);
  initData(vm);
  initComputed(vm);
  initMethods(vm);
  initWatch(vm);
}

function initProps (vm) {
  var props = vm.$options.props;
  if (props) {
    var propsData = vm.$options.propsData || {};
    var keys = vm.$options._propKeys = Object.keys(props);
    var isRoot = !vm.$parent;
    // root instance props should be converted
    observerState.shouldConvert = isRoot;
    var loop = function ( i ) {
      var key = keys[i];
      /* istanbul ignore else */
      if (true) {
        defineReactive$$1(vm, key, validateProp(key, props, propsData, vm), function () {
          if (vm.$parent && !observerState.isSettingProps) {
            warn(
              "Avoid mutating a prop directly since the value will be " +
              "overwritten whenever the parent component re-renders. " +
              "Instead, use a data or computed property based on the prop's " +
              "value. Prop being mutated: \"" + key + "\"",
              vm
            );
          }
        });
      } else {
        defineReactive$$1(vm, key, validateProp(key, props, propsData, vm));
      }
    };

    for (var i = 0; i < keys.length; i++) loop( i );
    observerState.shouldConvert = true;
  }
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? data.call(vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
    "development" !== 'production' && warn(
      'data functions should return an object.',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var i = keys.length;
  while (i--) {
    if (props && hasOwn(props, keys[i])) {
      "development" !== 'production' && warn(
        "The data property \"" + (keys[i]) + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else {
      proxy(vm, keys[i]);
    }
  }
  // observe data
  observe(data);
  data.__ob__ && data.__ob__.vmCount++;
}

var computedSharedDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function initComputed (vm) {
  var computed = vm.$options.computed;
  if (computed) {
    for (var key in computed) {
      var userDef = computed[key];
      if (typeof userDef === 'function') {
        computedSharedDefinition.get = makeComputedGetter(userDef, vm);
        computedSharedDefinition.set = noop;
      } else {
        computedSharedDefinition.get = userDef.get
          ? userDef.cache !== false
            ? makeComputedGetter(userDef.get, vm)
            : bind$1(userDef.get, vm)
          : noop;
        computedSharedDefinition.set = userDef.set
          ? bind$1(userDef.set, vm)
          : noop;
      }
      Object.defineProperty(vm, key, computedSharedDefinition);
    }
  }
}

function makeComputedGetter (getter, owner) {
  var watcher = new Watcher(owner, getter, noop, {
    lazy: true
  });
  return function computedGetter () {
    if (watcher.dirty) {
      watcher.evaluate();
    }
    if (Dep.target) {
      watcher.depend();
    }
    return watcher.value
  }
}

function initMethods (vm) {
  var methods = vm.$options.methods;
  if (methods) {
    for (var key in methods) {
      vm[key] = methods[key] == null ? noop : bind$1(methods[key], vm);
      if ("development" !== 'production' && methods[key] == null) {
        warn(
          "method \"" + key + "\" has an undefined value in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
    }
  }
}

function initWatch (vm) {
  var watch = vm.$options.watch;
  if (watch) {
    for (var key in watch) {
      var handler = watch[key];
      if (Array.isArray(handler)) {
        for (var i = 0; i < handler.length; i++) {
          createWatcher(vm, key, handler[i]);
        }
      } else {
        createWatcher(vm, key, handler);
      }
    }
  }
}

function createWatcher (vm, key, handler) {
  var options;
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  vm.$watch(key, handler, options);
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () {
    return this._data
  };
  if (true) {
    dataDef.set = function (newData) {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      cb.call(vm, watcher.value);
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

function proxy (vm, key) {
  if (!isReserved(key)) {
    Object.defineProperty(vm, key, {
      configurable: true,
      enumerable: true,
      get: function proxyGetter () {
        return vm._data[key]
      },
      set: function proxySetter (val) {
        vm._data[key] = val;
      }
    });
  }
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  ns,
  context,
  componentOptions
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = ns;
  this.context = context;
  this.functionalContext = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.child = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
};

var emptyVNode = function () {
  var node = new VNode();
  node.text = '';
  node.isComment = true;
  return node
};

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    vnode.children,
    vnode.text,
    vnode.elm,
    vnode.ns,
    vnode.context,
    vnode.componentOptions
  );
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isCloned = true;
  return cloned
}

function cloneVNodes (vnodes) {
  var res = new Array(vnodes.length);
  for (var i = 0; i < vnodes.length; i++) {
    res[i] = cloneVNode(vnodes[i]);
  }
  return res
}

/*  */

function mergeVNodeHook (def, hookKey, hook, key) {
  key = key + hookKey;
  var injectedHash = def.__injected || (def.__injected = {});
  if (!injectedHash[key]) {
    injectedHash[key] = true;
    var oldHook = def[hookKey];
    if (oldHook) {
      def[hookKey] = function () {
        oldHook.apply(this, arguments);
        hook.apply(this, arguments);
      };
    } else {
      def[hookKey] = hook;
    }
  }
}

/*  */

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  vm
) {
  var name, cur, old, fn, event, capture;
  for (name in on) {
    cur = on[name];
    old = oldOn[name];
    if (!cur) {
      "development" !== 'production' && warn(
        "Invalid handler for event \"" + name + "\": got " + String(cur),
        vm
      );
    } else if (!old) {
      capture = name.charAt(0) === '!';
      event = capture ? name.slice(1) : name;
      if (Array.isArray(cur)) {
        add(event, (cur.invoker = arrInvoker(cur)), capture);
      } else {
        if (!cur.invoker) {
          fn = cur;
          cur = on[name] = {};
          cur.fn = fn;
          cur.invoker = fnInvoker(cur);
        }
        add(event, cur.invoker, capture);
      }
    } else if (cur !== old) {
      if (Array.isArray(old)) {
        old.length = cur.length;
        for (var i = 0; i < old.length; i++) { old[i] = cur[i]; }
        on[name] = old;
      } else {
        old.fn = cur;
        on[name] = old;
      }
    }
  }
  for (name in oldOn) {
    if (!on[name]) {
      event = name.charAt(0) === '!' ? name.slice(1) : name;
      remove$$1(event, oldOn[name].invoker);
    }
  }
}

function arrInvoker (arr) {
  return function (ev) {
    var arguments$1 = arguments;

    var single = arguments.length === 1;
    for (var i = 0; i < arr.length; i++) {
      single ? arr[i](ev) : arr[i].apply(null, arguments$1);
    }
  }
}

function fnInvoker (o) {
  return function (ev) {
    var single = arguments.length === 1;
    single ? o.fn(ev) : o.fn.apply(null, arguments);
  }
}

/*  */

function normalizeChildren (
  children,
  ns,
  nestedIndex
) {
  if (isPrimitive(children)) {
    return [createTextVNode(children)]
  }
  if (Array.isArray(children)) {
    var res = [];
    for (var i = 0, l = children.length; i < l; i++) {
      var c = children[i];
      var last = res[res.length - 1];
      //  nested
      if (Array.isArray(c)) {
        res.push.apply(res, normalizeChildren(c, ns, ((nestedIndex || '') + "_" + i)));
      } else if (isPrimitive(c)) {
        if (last && last.text) {
          last.text += String(c);
        } else if (c !== '') {
          // convert primitive to vnode
          res.push(createTextVNode(c));
        }
      } else if (c instanceof VNode) {
        if (c.text && last && last.text) {
          last.text += c.text;
        } else {
          // inherit parent namespace
          if (ns) {
            applyNS(c, ns);
          }
          // default key for nested array children (likely generated by v-for)
          if (c.tag && c.key == null && nestedIndex != null) {
            c.key = "__vlist" + nestedIndex + "_" + i + "__";
          }
          res.push(c);
        }
      }
    }
    return res
  }
}

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

function applyNS (vnode, ns) {
  if (vnode.tag && !vnode.ns) {
    vnode.ns = ns;
    if (vnode.children) {
      for (var i = 0, l = vnode.children.length; i < l; i++) {
        applyNS(vnode.children[i], ns);
      }
    }
  }
}

/*  */

function getFirstComponentChild (children) {
  return children && children.filter(function (c) { return c && c.componentOptions; })[0]
}

/*  */

var activeInstance = null;

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._mount = function (
    el,
    hydrating
  ) {
    var vm = this;
    vm.$el = el;
    if (!vm.$options.render) {
      vm.$options.render = emptyVNode;
      if (true) {
        /* istanbul ignore if */
        if (vm.$options.template) {
          warn(
            'You are using the runtime-only build of Vue where the template ' +
            'option is not available. Either pre-compile the templates into ' +
            'render functions, or use the compiler-included build.',
            vm
          );
        } else {
          warn(
            'Failed to mount component: template or render function not defined.',
            vm
          );
        }
      }
    }
    callHook(vm, 'beforeMount');
    vm._watcher = new Watcher(vm, function () {
      vm._update(vm._render(), hydrating);
    }, noop);
    hydrating = false;
    // manually mounted instance, call mounted on self
    // mounted is called for render-created child components in its inserted hook
    if (vm.$vnode == null) {
      vm._isMounted = true;
      callHook(vm, 'mounted');
    }
    return vm
  };

  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    if (vm._isMounted) {
      callHook(vm, 'beforeUpdate');
    }
    var prevEl = vm.$el;
    var prevActiveInstance = activeInstance;
    activeInstance = vm;
    var prevVnode = vm._vnode;
    vm._vnode = vnode;
    if (!prevVnode) {
      // Vue.prototype.__patch__ is injected in entry points
      // based on the rendering backend used.
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating);
    } else {
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    activeInstance = prevActiveInstance;
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    if (vm._isMounted) {
      callHook(vm, 'updated');
    }
  };

  Vue.prototype._updateFromParent = function (
    propsData,
    listeners,
    parentVnode,
    renderChildren
  ) {
    var vm = this;
    var hasChildren = !!(vm.$options._renderChildren || renderChildren);
    vm.$options._parentVnode = parentVnode;
    vm.$options._renderChildren = renderChildren;
    // update props
    if (propsData && vm.$options.props) {
      observerState.shouldConvert = false;
      if (true) {
        observerState.isSettingProps = true;
      }
      var propKeys = vm.$options._propKeys || [];
      for (var i = 0; i < propKeys.length; i++) {
        var key = propKeys[i];
        vm[key] = validateProp(key, vm.$options.props, propsData, vm);
      }
      observerState.shouldConvert = true;
      if (true) {
        observerState.isSettingProps = false;
      }
    }
    // update listeners
    if (listeners) {
      var oldListeners = vm.$options._parentListeners;
      vm.$options._parentListeners = listeners;
      vm._updateListeners(listeners, oldListeners);
    }
    // resolve slots + force update if has children
    if (hasChildren) {
      vm.$slots = resolveSlots(renderChildren, vm._renderContext);
      vm.$forceUpdate();
    }
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove$1(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
  };
}

function callHook (vm, hook) {
  var handlers = vm.$options[hook];
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      handlers[i].call(vm);
    }
  }
  vm.$emit('hook:' + hook);
}

/*  */

var hooks = { init: init, prepatch: prepatch, insert: insert, destroy: destroy$1 };
var hooksToMerge = Object.keys(hooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (!Ctor) {
    return
  }

  if (isObject(Ctor)) {
    Ctor = Vue$2.extend(Ctor);
  }

  if (typeof Ctor !== 'function') {
    if (true) {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  if (!Ctor.cid) {
    if (Ctor.resolved) {
      Ctor = Ctor.resolved;
    } else {
      Ctor = resolveAsyncComponent(Ctor, function () {
        // it's ok to queue this on every render because
        // $forceUpdate is buffered by the scheduler.
        context.$forceUpdate();
      });
      if (!Ctor) {
        // return nothing if this is indeed an async component
        // wait for the callback to trigger parent update.
        return
      }
    }
  }

  data = data || {};

  // extract props
  var propsData = extractProps(data, Ctor);

  // functional component
  if (Ctor.options.functional) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  data.on = data.nativeOn;

  if (Ctor.options.abstract) {
    // abstract components do not keep anything
    // other than props & listeners
    data = {};
  }

  // merge component management hooks onto the placeholder node
  mergeHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children }
  );
  return vnode
}

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  context,
  children
) {
  var props = {};
  var propOptions = Ctor.options.props;
  if (propOptions) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData);
    }
  }
  var vnode = Ctor.options.render.call(
    null,
    // ensure the createElement function in functional components
    // gets a unique context - this is necessary for correct named slot check
    bind$1(createElement, { _self: Object.create(context) }),
    {
      props: props,
      data: data,
      parent: context,
      children: normalizeChildren(children),
      slots: function () { return resolveSlots(children, context); }
    }
  );
  if (vnode instanceof VNode) {
    vnode.functionalContext = context;
    if (data.slot) {
      (vnode.data || (vnode.data = {})).slot = data.slot;
    }
  }
  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent // activeInstance in lifecycle state
) {
  var vnodeComponentOptions = vnode.componentOptions;
  var options = {
    _isComponent: true,
    parent: parent,
    propsData: vnodeComponentOptions.propsData,
    _componentTag: vnodeComponentOptions.tag,
    _parentVnode: vnode,
    _parentListeners: vnodeComponentOptions.listeners,
    _renderChildren: vnodeComponentOptions.children
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (inlineTemplate) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnodeComponentOptions.Ctor(options)
}

function init (vnode, hydrating) {
  if (!vnode.child || vnode.child._isDestroyed) {
    var child = vnode.child = createComponentInstanceForVnode(vnode, activeInstance);
    child.$mount(hydrating ? vnode.elm : undefined, hydrating);
  }
}

function prepatch (
  oldVnode,
  vnode
) {
  var options = vnode.componentOptions;
  var child = vnode.child = oldVnode.child;
  child._updateFromParent(
    options.propsData, // updated props
    options.listeners, // updated listeners
    vnode, // new parent vnode
    options.children // new children
  );
}

function insert (vnode) {
  if (!vnode.child._isMounted) {
    vnode.child._isMounted = true;
    callHook(vnode.child, 'mounted');
  }
  if (vnode.data.keepAlive) {
    vnode.child._inactive = false;
    callHook(vnode.child, 'activated');
  }
}

function destroy$1 (vnode) {
  if (!vnode.child._isDestroyed) {
    if (!vnode.data.keepAlive) {
      vnode.child.$destroy();
    } else {
      vnode.child._inactive = true;
      callHook(vnode.child, 'deactivated');
    }
  }
}

function resolveAsyncComponent (
  factory,
  cb
) {
  if (factory.requested) {
    // pool callbacks
    factory.pendingCallbacks.push(cb);
  } else {
    factory.requested = true;
    var cbs = factory.pendingCallbacks = [cb];
    var sync = true;

    var resolve = function (res) {
      if (isObject(res)) {
        res = Vue$2.extend(res);
      }
      // cache resolved
      factory.resolved = res;
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        for (var i = 0, l = cbs.length; i < l; i++) {
          cbs[i](res);
        }
      }
    };

    var reject = function (reason) {
      "development" !== 'production' && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
    };

    var res = factory(resolve, reject);

    // handle promise
    if (res && typeof res.then === 'function' && !factory.resolved) {
      res.then(resolve, reject);
    }

    sync = false;
    // return in case resolved synchronously
    return factory.resolved
  }
}

function extractProps (data, Ctor) {
  // we are only extrating raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (!propOptions) {
    return
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  var domProps = data.domProps;
  if (attrs || props || domProps) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey) ||
      checkProp(res, domProps, key, altKey);
    }
  }
  return res
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (hash) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

function mergeHooks (data) {
  if (!data.hook) {
    data.hook = {};
  }
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var fromParent = data.hook[key];
    var ours = hooks[key];
    data.hook[key] = fromParent ? mergeHook$1(ours, fromParent) : ours;
  }
}

function mergeHook$1 (a, b) {
  // since all hooks have at most two args, use fixed args
  // to avoid having to use fn.apply().
  return function (_, __) {
    a(_, __);
    b(_, __);
  }
}

/*  */

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  tag,
  data,
  children
) {
  if (data && (Array.isArray(data) || typeof data !== 'object')) {
    children = data;
    data = undefined;
  }
  // make sure to use real instance instead of proxy as context
  return _createElement(this._self, tag, data, children)
}

function _createElement (
  context,
  tag,
  data,
  children
) {
  if (data && data.__ob__) {
    "development" !== 'production' && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return emptyVNode()
  }
  if (typeof tag === 'string') {
    var Ctor;
    var ns = config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      return new VNode(
        tag, data, normalizeChildren(children, ns),
        undefined, undefined, ns, context
      )
    } else if ((Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      return createComponent(Ctor, data, context, children, tag)
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      return new VNode(
        tag, data, normalizeChildren(children, ns),
        undefined, undefined, ns, context
      )
    }
  } else {
    // direct component options / constructor
    return createComponent(tag, data, context, children)
  }
}

/*  */

function initRender (vm) {
  vm.$vnode = null; // the placeholder node in parent tree
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null;
  vm._renderContext = vm.$options._parentVnode && vm.$options._parentVnode.context;
  vm.$slots = resolveSlots(vm.$options._renderChildren, vm._renderContext);
  // bind the public createElement fn to this instance
  // so that we get proper render context inside it.
  vm.$createElement = bind$1(createElement, vm);
  if (vm.$options.el) {
    vm.$mount(vm.$options.el);
  }
}

function renderMixin (Vue) {
  Vue.prototype.$nextTick = function (fn) {
    nextTick(fn, this);
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var staticRenderFns = ref.staticRenderFns;
    var _parentVnode = ref._parentVnode;

    if (vm._isMounted) {
      // clone slot nodes on re-renders
      for (var key in vm.$slots) {
        vm.$slots[key] = cloneVNodes(vm.$slots[key]);
      }
    }

    if (staticRenderFns && !vm._staticTrees) {
      vm._staticTrees = [];
    }
    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      if (true) {
        warn(("Error when rendering " + (formatComponentName(vm)) + ":"));
      }
      /* istanbul ignore else */
      if (config.errorHandler) {
        config.errorHandler.call(null, e, vm);
      } else {
        if (config._isServer) {
          throw e
        } else {
          setTimeout(function () { throw e }, 0);
        }
      }
      // return previous vnode to prevent render error causing blank component
      vnode = vm._vnode;
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if ("development" !== 'production' && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = emptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };

  // shorthands used in render functions
  Vue.prototype._h = createElement;
  // toString for mustaches
  Vue.prototype._s = _toString;
  // number conversion
  Vue.prototype._n = toNumber;
  // empty vnode
  Vue.prototype._e = emptyVNode;
  // loose equal
  Vue.prototype._q = looseEqual;
  // loose indexOf
  Vue.prototype._i = looseIndexOf;

  // render static tree by index
  Vue.prototype._m = function renderStatic (
    index,
    isInFor
  ) {
    var tree = this._staticTrees[index];
    // if has already-rendered static tree and not inside v-for,
    // we can reuse the same tree by doing a shallow clone.
    if (tree && !isInFor) {
      return Array.isArray(tree)
        ? cloneVNodes(tree)
        : cloneVNode(tree)
    }
    // otherwise, render a fresh tree.
    tree = this._staticTrees[index] = this.$options.staticRenderFns[index].call(this._renderProxy);
    if (Array.isArray(tree)) {
      for (var i = 0; i < tree.length; i++) {
        if (typeof tree[i] !== 'string') {
          tree[i].isStatic = true;
          tree[i].key = "__static__" + index + "_" + i;
        }
      }
    } else {
      tree.isStatic = true;
      tree.key = "__static__" + index;
    }
    return tree
  };

  // filter resolution helper
  var identity = function (_) { return _; };
  Vue.prototype._f = function resolveFilter (id) {
    return resolveAsset(this.$options, 'filters', id, true) || identity
  };

  // render v-for
  Vue.prototype._l = function renderList (
    val,
    render
  ) {
    var ret, i, l, keys, key;
    if (Array.isArray(val)) {
      ret = new Array(val.length);
      for (i = 0, l = val.length; i < l; i++) {
        ret[i] = render(val[i], i);
      }
    } else if (typeof val === 'number') {
      ret = new Array(val);
      for (i = 0; i < val; i++) {
        ret[i] = render(i + 1, i);
      }
    } else if (isObject(val)) {
      keys = Object.keys(val);
      ret = new Array(keys.length);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[i] = render(val[key], key, i);
      }
    }
    return ret
  };

  // renderSlot
  Vue.prototype._t = function (
    name,
    fallback
  ) {
    var slotNodes = this.$slots[name];
    // warn duplicate slot usage
    if (slotNodes && "development" !== 'production') {
      slotNodes._rendered && warn(
        "Duplicate presence of slot \"" + name + "\" found in the same render tree " +
        "- this will likely cause render errors.",
        this
      );
      slotNodes._rendered = true;
    }
    return slotNodes || fallback
  };

  // apply v-bind object
  Vue.prototype._b = function bindProps (
    data,
    value,
    asProp
  ) {
    if (value) {
      if (!isObject(value)) {
        "development" !== 'production' && warn(
          'v-bind without argument expects an Object or Array value',
          this
        );
      } else {
        if (Array.isArray(value)) {
          value = toObject(value);
        }
        for (var key in value) {
          if (key === 'class' || key === 'style') {
            data[key] = value[key];
          } else {
            var hash = asProp || config.mustUseProp(key)
              ? data.domProps || (data.domProps = {})
              : data.attrs || (data.attrs = {});
            hash[key] = value[key];
          }
        }
      }
    }
    return data
  };

  // expose v-on keyCodes
  Vue.prototype._k = function getKeyCodes (key) {
    return config.keyCodes[key]
  };
}

function resolveSlots (
  renderChildren,
  context
) {
  var slots = {};
  if (!renderChildren) {
    return slots
  }
  var children = normalizeChildren(renderChildren) || [];
  var defaultSlot = [];
  var name, child;
  for (var i = 0, l = children.length; i < l; i++) {
    child = children[i];
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.functionalContext === context) &&
        child.data && (name = child.data.slot)) {
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children);
      } else {
        slot.push(child);
      }
    } else {
      defaultSlot.push(child);
    }
  }
  // ignore single whitespace
  if (defaultSlot.length && !(
    defaultSlot.length === 1 &&
    (defaultSlot[0].text === ' ' || defaultSlot[0].isComment)
  )) {
    slots.default = defaultSlot;
  }
  return slots
}

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  var on = bind$1(vm.$on, vm);
  var off = bind$1(vm.$off, vm);
  vm._updateListeners = function (listeners, oldListeners) {
    updateListeners(listeners, oldListeners || {}, on, off, vm);
  };
  if (listeners) {
    vm._updateListeners(listeners);
  }
}

function eventsMixin (Vue) {
  Vue.prototype.$on = function (event, fn) {
    var vm = this;(vm._events[event] || (vm._events[event] = [])).push(fn);
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (arguments.length === 1) {
      vm._events[event] = null;
      return vm
    }
    // specific handler
    var cb;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      for (var i = 0, l = cbs.length; i < l; i++) {
        cbs[i].apply(vm, args);
      }
    }
    return vm
  };
}

/*  */

var uid = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid++;
    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    if (true) {
      initProxy(vm);
    } else {
      vm._renderProxy = vm;
    }
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    callHook(vm, 'beforeCreate');
    initState(vm);
    callHook(vm, 'created');
    initRender(vm);
  };

  function initInternalComponent (vm, options) {
    var opts = vm.$options = Object.create(resolveConstructorOptions(vm));
    // doing this because it's faster than dynamic enumeration.
    opts.parent = options.parent;
    opts.propsData = options.propsData;
    opts._parentVnode = options._parentVnode;
    opts._parentListeners = options._parentListeners;
    opts._renderChildren = options._renderChildren;
    opts._componentTag = options._componentTag;
    if (options.render) {
      opts.render = options.render;
      opts.staticRenderFns = options.staticRenderFns;
    }
  }

  function resolveConstructorOptions (vm) {
    var Ctor = vm.constructor;
    var options = Ctor.options;
    if (Ctor.super) {
      var superOptions = Ctor.super.options;
      var cachedSuperOptions = Ctor.superOptions;
      if (superOptions !== cachedSuperOptions) {
        // super option changed
        Ctor.superOptions = superOptions;
        options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
        if (options.name) {
          options.components[options.name] = Ctor;
        }
      }
    }
    return options
  }
}

function Vue$2 (options) {
  if ("development" !== 'production' &&
    !(this instanceof Vue$2)) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue$2);
stateMixin(Vue$2);
eventsMixin(Vue$2);
lifecycleMixin(Vue$2);
renderMixin(Vue$2);

var warn = noop;
var formatComponentName;

if (true) {
  var hasConsole = typeof console !== 'undefined';

  warn = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.error("[Vue warn]: " + msg + " " + (
        vm ? formatLocation(formatComponentName(vm)) : ''
      ));
    }
  };

  formatComponentName = function (vm) {
    if (vm.$root === vm) {
      return 'root instance'
    }
    var name = vm._isVue
      ? vm.$options.name || vm.$options._componentTag
      : vm.name;
    return (
      (name ? ("component <" + name + ">") : "anonymous component") +
      (vm._isVue && vm.$options.__file ? (" at " + (vm.$options.__file)) : '')
    )
  };

  var formatLocation = function (str) {
    if (str === 'anonymous component') {
      str += " - use the \"name\" option for better debugging messages.";
    }
    return ("\n(found in " + str + ")")
  };
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if (true) {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  var key, toVal, fromVal;
  for (key in from) {
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (isObject(toVal) && isObject(fromVal)) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (typeof childVal !== 'function') {
      "development" !== 'production' && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        childVal.call(this),
        parentVal.call(this)
      )
    }
  } else if (parentVal || childVal) {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm)
        : undefined;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
};

/**
 * Hooks and param attributes are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  return childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal
}

config._lifecycleHooks.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (parentVal, childVal) {
  var res = Object.create(parentVal || null);
  return childVal
    ? extend(res, childVal)
    : res
}

config._assetTypes.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (parentVal, childVal) {
  /* istanbul ignore if */
  if (!childVal) { return parentVal }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key in childVal) {
    var parent = ret[key];
    var child = childVal[key];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key] = parent
      ? parent.concat(child)
      : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.computed = function (parentVal, childVal) {
  if (!childVal) { return parentVal }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  extend(ret, childVal);
  return ret
};

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Make sure component options get converted to actual
 * constructors.
 */
function normalizeComponents (options) {
  if (options.components) {
    var components = options.components;
    var def;
    for (var key in components) {
      var lower = key.toLowerCase();
      if (isBuiltInTag(lower) || config.isReservedTag(lower)) {
        "development" !== 'production' && warn(
          'Do not use built-in or reserved HTML elements as component ' +
          'id: ' + key
        );
        continue
      }
      def = components[key];
      if (isPlainObject(def)) {
        components[key] = Vue$2.extend(def);
      }
    }
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else if (true) {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  }
  options.props = res;
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def = dirs[key];
      if (typeof def === 'function') {
        dirs[key] = { bind: def, update: def };
      }
    }
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  normalizeComponents(child);
  normalizeProps(child);
  normalizeDirectives(child);
  var extendsFrom = child.extends;
  if (extendsFrom) {
    parent = typeof extendsFrom === 'function'
      ? mergeOptions(parent, extendsFrom.options, vm)
      : mergeOptions(parent, extendsFrom, vm);
  }
  if (child.mixins) {
    for (var i = 0, l = child.mixins.length; i < l; i++) {
      var mixin = child.mixins[i];
      if (mixin.prototype instanceof Vue$2) {
        mixin = mixin.options;
      }
      parent = mergeOptions(parent, mixin, vm);
    }
  }
  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  var res = assets[id] ||
    // camelCase ID
    assets[camelize(id)] ||
    // Pascal Case ID
    assets[capitalize(camelize(id))];
  if ("development" !== 'production' && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */

function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // handle boolean props
  if (isBooleanType(prop.type)) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (value === '' || value === hyphenate(key)) {
      value = true;
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldConvert = observerState.shouldConvert;
    observerState.shouldConvert = true;
    observe(value);
    observerState.shouldConvert = prevShouldConvert;
  }
  if (true) {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, name) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if (isObject(def)) {
    "development" !== 'production' && warn(
      'Invalid default value for prop "' + name + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // call factory function for non-Function types
  return typeof def === 'function' && prop.type !== Function
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType);
      valid = assertedType.valid;
    }
  }
  if (!valid) {
    warn(
      'Invalid prop: type check failed for prop "' + name + '".' +
      ' Expected ' + expectedTypes.map(capitalize).join(', ') +
      ', got ' + Object.prototype.toString.call(value).slice(8, -1) + '.',
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

/**
 * Assert the type of a value
 */
function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (expectedType === 'String') {
    valid = typeof value === (expectedType = 'string');
  } else if (expectedType === 'Number') {
    valid = typeof value === (expectedType = 'number');
  } else if (expectedType === 'Boolean') {
    valid = typeof value === (expectedType = 'boolean');
  } else if (expectedType === 'Function') {
    valid = typeof value === (expectedType = 'function');
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match && match[1]
}

function isBooleanType (fn) {
  if (!Array.isArray(fn)) {
    return getType(fn) === 'Boolean'
  }
  for (var i = 0, len = fn.length; i < len; i++) {
    if (getType(fn[i]) === 'Boolean') {
      return true
    }
  }
  /* istanbul ignore next */
  return false
}



var util = Object.freeze({
	defineReactive: defineReactive$$1,
	_toString: _toString,
	toNumber: toNumber,
	makeMap: makeMap,
	isBuiltInTag: isBuiltInTag,
	remove: remove$1,
	hasOwn: hasOwn,
	isPrimitive: isPrimitive,
	cached: cached,
	camelize: camelize,
	capitalize: capitalize,
	hyphenate: hyphenate,
	bind: bind$1,
	toArray: toArray,
	extend: extend,
	isObject: isObject,
	isPlainObject: isPlainObject,
	toObject: toObject,
	noop: noop,
	no: no,
	genStaticKeys: genStaticKeys,
	looseEqual: looseEqual,
	looseIndexOf: looseIndexOf,
	isReserved: isReserved,
	def: def,
	parsePath: parsePath,
	hasProto: hasProto,
	inBrowser: inBrowser,
	UA: UA,
	isIE: isIE,
	isIE9: isIE9,
	isEdge: isEdge,
	isAndroid: isAndroid,
	isIOS: isIOS,
	devtools: devtools,
	nextTick: nextTick,
	get _Set () { return _Set; },
	mergeOptions: mergeOptions,
	resolveAsset: resolveAsset,
	get warn () { return warn; },
	get formatComponentName () { return formatComponentName; },
	validateProp: validateProp
});

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    /* istanbul ignore if */
    if (plugin.installed) {
      return
    }
    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else {
      plugin.apply(null, args);
    }
    plugin.installed = true;
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    Vue.options = mergeOptions(Vue.options, mixin);
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var isFirstExtend = Super.cid === 0;
    if (isFirstExtend && extendOptions._Ctor) {
      return extendOptions._Ctor
    }
    var name = extendOptions.name || Super.options.name;
    if (true) {
      if (!/^[a-zA-Z][\w-]*$/.test(name)) {
        warn(
          'Invalid component name: "' + name + '". Component names ' +
          'can only contain alphanumeric characaters and the hyphen.'
        );
        name = null;
      }
    }
    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;
    // allow further extension
    Sub.extend = Super.extend;
    // create asset registers, so extended classes
    // can have their private assets too.
    config._assetTypes.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }
    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    // cache constructor
    if (isFirstExtend) {
      extendOptions._Ctor = Sub;
    }
    return Sub
  };
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  config._assetTypes.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if (true) {
          if (type === 'component' && config.isReservedTag(id)) {
            warn(
              'Do not use built-in or reserved HTML elements as component ' +
              'id: ' + id
            );
          }
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = Vue.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,
  created: function created () {
    this.cache = Object.create(null);
  },
  render: function render () {
    var vnode = getFirstComponentChild(this.$slots.default);
    if (vnode && vnode.componentOptions) {
      var opts = vnode.componentOptions;
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? opts.Ctor.cid + '::' + opts.tag
        : vnode.key;
      if (this.cache[key]) {
        vnode.child = this.cache[key].child;
      } else {
        this.cache[key] = vnode;
      }
      vnode.data.keepAlive = true;
    }
    return vnode
  },
  destroyed: function destroyed () {
    var this$1 = this;

    for (var key in this.cache) {
      var vnode = this$1.cache[key];
      callHook(vnode.child, 'deactivated');
      vnode.child.$destroy();
    }
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  if (true) {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);
  Vue.util = util;
  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  Vue.options = Object.create(null);
  config._assetTypes.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue$2);

Object.defineProperty(Vue$2.prototype, '$isServer', {
  get: function () { return config._isServer; }
});

Vue$2.version = '2.0.3';

/*  */

// attributes that should be using props for binding
var mustUseProp = makeMap('value,selected,checked,muted');

var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

var isBooleanAttr = makeMap(
  'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
  'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
  'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
  'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
  'required,reversed,scoped,seamless,selected,sortable,translate,' +
  'truespeed,typemustmatch,visible'
);

var isAttr = makeMap(
  'accept,accept-charset,accesskey,action,align,alt,async,autocomplete,' +
  'autofocus,autoplay,autosave,bgcolor,border,buffered,challenge,charset,' +
  'checked,cite,class,code,codebase,color,cols,colspan,content,http-equiv,' +
  'name,contenteditable,contextmenu,controls,coords,data,datetime,default,' +
  'defer,dir,dirname,disabled,download,draggable,dropzone,enctype,method,for,' +
  'form,formaction,headers,<th>,height,hidden,high,href,hreflang,http-equiv,' +
  'icon,id,ismap,itemprop,keytype,kind,label,lang,language,list,loop,low,' +
  'manifest,max,maxlength,media,method,GET,POST,min,multiple,email,file,' +
  'muted,name,novalidate,open,optimum,pattern,ping,placeholder,poster,' +
  'preload,radiogroup,readonly,rel,required,reversed,rows,rowspan,sandbox,' +
  'scope,scoped,seamless,selected,shape,size,type,text,password,sizes,span,' +
  'spellcheck,src,srcdoc,srclang,srcset,start,step,style,summary,tabindex,' +
  'target,title,type,usemap,value,width,wrap'
);



var xlinkNS = 'http://www.w3.org/1999/xlink';

var isXlink = function (name) {
  return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
};

var getXlinkProp = function (name) {
  return isXlink(name) ? name.slice(6, name.length) : ''
};

var isFalsyAttrValue = function (val) {
  return val == null || val === false
};

/*  */

function genClassForVnode (vnode) {
  var data = vnode.data;
  var parentNode = vnode;
  var childNode = vnode;
  while (childNode.child) {
    childNode = childNode.child._vnode;
    if (childNode.data) {
      data = mergeClassData(childNode.data, data);
    }
  }
  while ((parentNode = parentNode.parent)) {
    if (parentNode.data) {
      data = mergeClassData(data, parentNode.data);
    }
  }
  return genClassFromData(data)
}

function mergeClassData (child, parent) {
  return {
    staticClass: concat(child.staticClass, parent.staticClass),
    class: child.class
      ? [child.class, parent.class]
      : parent.class
  }
}

function genClassFromData (data) {
  var dynamicClass = data.class;
  var staticClass = data.staticClass;
  if (staticClass || dynamicClass) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  var res = '';
  if (!value) {
    return res
  }
  if (typeof value === 'string') {
    return value
  }
  if (Array.isArray(value)) {
    var stringified;
    for (var i = 0, l = value.length; i < l; i++) {
      if (value[i]) {
        if ((stringified = stringifyClass(value[i]))) {
          res += stringified + ' ';
        }
      }
    }
    return res.slice(0, -1)
  }
  if (isObject(value)) {
    for (var key in value) {
      if (value[key]) { res += key + ' '; }
    }
    return res.slice(0, -1)
  }
  /* istanbul ignore next */
  return res
}

/*  */

var namespaceMap = {
  svg: 'http://www.w3.org/2000/svg',
  math: 'http://www.w3.org/1998/Math/MathML'
};

var isHTMLTag = makeMap(
  'html,body,base,head,link,meta,style,title,' +
  'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
  'div,dd,dl,dt,figcaption,figure,hr,img,li,main,ol,p,pre,ul,' +
  'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
  's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
  'embed,object,param,source,canvas,script,noscript,del,ins,' +
  'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
  'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
  'output,progress,select,textarea,' +
  'details,dialog,menu,menuitem,summary,' +
  'content,element,shadow,template'
);

var isUnaryTag = makeMap(
  'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
  'link,meta,param,source,track,wbr',
  true
);

// Elements that you can, intentionally, leave open
// (and which close themselves)
var canBeLeftOpenTag = makeMap(
  'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source',
  true
);

// HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
// Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
var isNonPhrasingTag = makeMap(
  'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
  'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
  'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
  'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
  'title,tr,track',
  true
);

// this map is intentionally selective, only covering SVG elements that may
// contain child elements.
var isSVG = makeMap(
  'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font,' +
  'font-face,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
  'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
  true
);



var isReservedTag = function (tag) {
  return isHTMLTag(tag) || isSVG(tag)
};

function getTagNamespace (tag) {
  if (isSVG(tag)) {
    return 'svg'
  }
  // basic support for MathML
  // note it doesn't support other MathML elements being component roots
  if (tag === 'math') {
    return 'math'
  }
}

var unknownElementCache = Object.create(null);
function isUnknownElement (tag) {
  /* istanbul ignore if */
  if (!inBrowser) {
    return true
  }
  if (isReservedTag(tag)) {
    return false
  }
  tag = tag.toLowerCase();
  /* istanbul ignore if */
  if (unknownElementCache[tag] != null) {
    return unknownElementCache[tag]
  }
  var el = document.createElement(tag);
  if (tag.indexOf('-') > -1) {
    // http://stackoverflow.com/a/28210364/1070244
    return (unknownElementCache[tag] = (
      el.constructor === window.HTMLUnknownElement ||
      el.constructor === window.HTMLElement
    ))
  } else {
    return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
  }
}

/*  */

/**
 * Query an element selector if it's not an element already.
 */
function query (el) {
  if (typeof el === 'string') {
    var selector = el;
    el = document.querySelector(el);
    if (!el) {
      "development" !== 'production' && warn(
        'Cannot find element: ' + selector
      );
      return document.createElement('div')
    }
  }
  return el
}

/*  */

function createElement$1 (tagName, vnode) {
  var elm = document.createElement(tagName);
  if (tagName !== 'select') {
    return elm
  }
  if (vnode.data && vnode.data.attrs && 'multiple' in vnode.data.attrs) {
    elm.setAttribute('multiple', 'multiple');
  }
  return elm
}

function createElementNS (namespace, tagName) {
  return document.createElementNS(namespaceMap[namespace], tagName)
}

function createTextNode (text) {
  return document.createTextNode(text)
}

function createComment (text) {
  return document.createComment(text)
}

function insertBefore (parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode);
}

function removeChild (node, child) {
  node.removeChild(child);
}

function appendChild (node, child) {
  node.appendChild(child);
}

function parentNode (node) {
  return node.parentNode
}

function nextSibling (node) {
  return node.nextSibling
}

function tagName (node) {
  return node.tagName
}

function setTextContent (node, text) {
  node.textContent = text;
}

function childNodes (node) {
  return node.childNodes
}

function setAttribute (node, key, val) {
  node.setAttribute(key, val);
}


var nodeOps = Object.freeze({
	createElement: createElement$1,
	createElementNS: createElementNS,
	createTextNode: createTextNode,
	createComment: createComment,
	insertBefore: insertBefore,
	removeChild: removeChild,
	appendChild: appendChild,
	parentNode: parentNode,
	nextSibling: nextSibling,
	tagName: tagName,
	setTextContent: setTextContent,
	childNodes: childNodes,
	setAttribute: setAttribute
});

/*  */

var ref = {
  create: function create (_, vnode) {
    registerRef(vnode);
  },
  update: function update (oldVnode, vnode) {
    if (oldVnode.data.ref !== vnode.data.ref) {
      registerRef(oldVnode, true);
      registerRef(vnode);
    }
  },
  destroy: function destroy (vnode) {
    registerRef(vnode, true);
  }
};

function registerRef (vnode, isRemoval) {
  var key = vnode.data.ref;
  if (!key) { return }

  var vm = vnode.context;
  var ref = vnode.child || vnode.elm;
  var refs = vm.$refs;
  if (isRemoval) {
    if (Array.isArray(refs[key])) {
      remove$1(refs[key], ref);
    } else if (refs[key] === ref) {
      refs[key] = undefined;
    }
  } else {
    if (vnode.data.refInFor) {
      if (Array.isArray(refs[key])) {
        refs[key].push(ref);
      } else {
        refs[key] = [ref];
      }
    } else {
      refs[key] = ref;
    }
  }
}

/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/paldepind/snabbdom/blob/master/LICENSE
 *
 * modified by Evan You (@yyx990803)
 *

/*
 * Not type-checking this because this file is perf-critical and the cost
 * of making flow understand it is not worth it.
 */

var emptyNode = new VNode('', {}, []);

var hooks$1 = ['create', 'update', 'remove', 'destroy'];

function isUndef (s) {
  return s == null
}

function isDef (s) {
  return s != null
}

function sameVnode (vnode1, vnode2) {
  return (
    vnode1.key === vnode2.key &&
    vnode1.tag === vnode2.tag &&
    vnode1.isComment === vnode2.isComment &&
    !vnode1.data === !vnode2.data
  )
}

function createKeyToOldIdx (children, beginIdx, endIdx) {
  var i, key;
  var map = {};
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) { map[key] = i; }
  }
  return map
}

function createPatchFunction (backend) {
  var i, j;
  var cbs = {};

  var modules = backend.modules;
  var nodeOps = backend.nodeOps;

  for (i = 0; i < hooks$1.length; ++i) {
    cbs[hooks$1[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      if (modules[j][hooks$1[i]] !== undefined) { cbs[hooks$1[i]].push(modules[j][hooks$1[i]]); }
    }
  }

  function emptyNodeAt (elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
  }

  function createRmCb (childElm, listeners) {
    function remove$$1 () {
      if (--remove$$1.listeners === 0) {
        removeElement(childElm);
      }
    }
    remove$$1.listeners = listeners;
    return remove$$1
  }

  function removeElement (el) {
    var parent = nodeOps.parentNode(el);
    nodeOps.removeChild(parent, el);
  }

  function createElm (vnode, insertedVnodeQueue, nested) {
    var i;
    var data = vnode.data;
    vnode.isRootInsert = !nested;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode); }
      // after calling the init hook, if the vnode is a child component
      // it should've created a child instance and mounted it. the child
      // component also has set the placeholder vnode's elm.
      // in that case we can just return the element and be done.
      if (isDef(i = vnode.child)) {
        initComponent(vnode, insertedVnodeQueue);
        return vnode.elm
      }
    }
    var children = vnode.children;
    var tag = vnode.tag;
    if (isDef(tag)) {
      if (true) {
        if (
          !vnode.ns &&
          !(config.ignoredElements && config.ignoredElements.indexOf(tag) > -1) &&
          config.isUnknownElement(tag)
        ) {
          warn(
            'Unknown custom element: <' + tag + '> - did you ' +
            'register the component correctly? For recursive components, ' +
            'make sure to provide the "name" option.',
            vnode.context
          );
        }
      }
      vnode.elm = vnode.ns
        ? nodeOps.createElementNS(vnode.ns, tag)
        : nodeOps.createElement(tag, vnode);
      setScope(vnode);
      createChildren(vnode, children, insertedVnodeQueue);
      if (isDef(data)) {
        invokeCreateHooks(vnode, insertedVnodeQueue);
      }
    } else if (vnode.isComment) {
      vnode.elm = nodeOps.createComment(vnode.text);
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text);
    }
    return vnode.elm
  }

  function createChildren (vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; ++i) {
        nodeOps.appendChild(vnode.elm, createElm(children[i], insertedVnodeQueue, true));
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(vnode.text));
    }
  }

  function isPatchable (vnode) {
    while (vnode.child) {
      vnode = vnode.child._vnode;
    }
    return isDef(vnode.tag)
  }

  function invokeCreateHooks (vnode, insertedVnodeQueue) {
    for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
      cbs.create[i$1](emptyNode, vnode);
    }
    i = vnode.data.hook; // Reuse variable
    if (isDef(i)) {
      if (i.create) { i.create(emptyNode, vnode); }
      if (i.insert) { insertedVnodeQueue.push(vnode); }
    }
  }

  function initComponent (vnode, insertedVnodeQueue) {
    if (vnode.data.pendingInsert) {
      insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
    }
    vnode.elm = vnode.child.$el;
    if (isPatchable(vnode)) {
      invokeCreateHooks(vnode, insertedVnodeQueue);
      setScope(vnode);
    } else {
      // empty component root.
      // skip all element-related modules except for ref (#3455)
      registerRef(vnode);
      // make sure to invoke the insert hook
      insertedVnodeQueue.push(vnode);
    }
  }

  // set scope id attribute for scoped CSS.
  // this is implemented as a special case to avoid the overhead
  // of going through the normal attribute patching process.
  function setScope (vnode) {
    var i;
    if (isDef(i = vnode.context) && isDef(i = i.$options._scopeId)) {
      nodeOps.setAttribute(vnode.elm, i, '');
    }
    if (isDef(i = activeInstance) &&
        i !== vnode.context &&
        isDef(i = i.$options._scopeId)) {
      nodeOps.setAttribute(vnode.elm, i, '');
    }
  }

  function addVnodes (parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      nodeOps.insertBefore(parentElm, createElm(vnodes[startIdx], insertedVnodeQueue), before);
    }
  }

  function invokeDestroyHook (vnode) {
    var i, j;
    var data = vnode.data;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.destroy)) { i(vnode); }
      for (i = 0; i < cbs.destroy.length; ++i) { cbs.destroy[i](vnode); }
    }
    if (isDef(i = vnode.children)) {
      for (j = 0; j < vnode.children.length; ++j) {
        invokeDestroyHook(vnode.children[j]);
      }
    }
  }

  function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      var ch = vnodes[startIdx];
      if (isDef(ch)) {
        if (isDef(ch.tag)) {
          removeAndInvokeRemoveHook(ch);
          invokeDestroyHook(ch);
        } else { // Text node
          nodeOps.removeChild(parentElm, ch.elm);
        }
      }
    }
  }

  function removeAndInvokeRemoveHook (vnode, rm) {
    if (rm || isDef(vnode.data)) {
      var listeners = cbs.remove.length + 1;
      if (!rm) {
        // directly removing
        rm = createRmCb(vnode.elm, listeners);
      } else {
        // we have a recursively passed down rm callback
        // increase the listeners count
        rm.listeners += listeners;
      }
      // recursively invoke hooks on child component root node
      if (isDef(i = vnode.child) && isDef(i = i._vnode) && isDef(i.data)) {
        removeAndInvokeRemoveHook(i, rm);
      }
      for (i = 0; i < cbs.remove.length; ++i) {
        cbs.remove[i](vnode, rm);
      }
      if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
        i(vnode, rm);
      } else {
        rm();
      }
    } else {
      removeElement(vnode.elm);
    }
  }

  function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    var oldStartIdx = 0;
    var newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, elmToMove, before;

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    var canMove = !removeOnly;

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
        idxInOld = isDef(newStartVnode.key) ? oldKeyToIdx[newStartVnode.key] : null;
        if (isUndef(idxInOld)) { // New element
          nodeOps.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
          newStartVnode = newCh[++newStartIdx];
        } else {
          elmToMove = oldCh[idxInOld];
          /* istanbul ignore if */
          if ("development" !== 'production' && !elmToMove) {
            warn(
              'It seems there are duplicate keys that is causing an update error. ' +
              'Make sure each v-for item has a unique key.'
            );
          }
          if (elmToMove.tag !== newStartVnode.tag) {
            // same key but different element. treat as new element
            nodeOps.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
            newStartVnode = newCh[++newStartIdx];
          } else {
            patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
            oldCh[idxInOld] = undefined;
            canMove && nodeOps.insertBefore(parentElm, newStartVnode.elm, oldStartVnode.elm);
            newStartVnode = newCh[++newStartIdx];
          }
        }
      }
    }
    if (oldStartIdx > oldEndIdx) {
      before = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
      addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function patchVnode (oldVnode, vnode, insertedVnodeQueue, removeOnly) {
    if (oldVnode === vnode) {
      return
    }
    // reuse element for static trees.
    // note we only do this if the vnode is cloned -
    // if the new node is not cloned it means the render functions have been
    // reset by the hot-reload-api and we need to do a proper re-render.
    if (vnode.isStatic &&
        oldVnode.isStatic &&
        vnode.key === oldVnode.key &&
        vnode.isCloned) {
      vnode.elm = oldVnode.elm;
      return
    }
    var i;
    var data = vnode.data;
    var hasData = isDef(data);
    if (hasData && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      i(oldVnode, vnode);
    }
    var elm = vnode.elm = oldVnode.elm;
    var oldCh = oldVnode.children;
    var ch = vnode.children;
    if (hasData && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); }
      if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
    }
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
      } else if (isDef(ch)) {
        if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, '');
      }
    } else if (oldVnode.text !== vnode.text) {
      nodeOps.setTextContent(elm, vnode.text);
    }
    if (hasData) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
    }
  }

  function invokeInsertHook (vnode, queue, initial) {
    // delay insert hooks for component root nodes, invoke them after the
    // element is really inserted
    if (initial && vnode.parent) {
      vnode.parent.data.pendingInsert = queue;
    } else {
      for (var i = 0; i < queue.length; ++i) {
        queue[i].data.hook.insert(queue[i]);
      }
    }
  }

  var bailed = false;
  function hydrate (elm, vnode, insertedVnodeQueue) {
    if (true) {
      if (!assertNodeMatch(elm, vnode)) {
        return false
      }
    }
    vnode.elm = elm;
    var tag = vnode.tag;
    var data = vnode.data;
    var children = vnode.children;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode, true /* hydrating */); }
      if (isDef(i = vnode.child)) {
        // child component. it should have hydrated its own tree.
        initComponent(vnode, insertedVnodeQueue);
        return true
      }
    }
    if (isDef(tag)) {
      if (isDef(children)) {
        var childNodes = nodeOps.childNodes(elm);
        // empty element, allow client to pick up and populate children
        if (!childNodes.length) {
          createChildren(vnode, children, insertedVnodeQueue);
        } else {
          var childrenMatch = true;
          if (childNodes.length !== children.length) {
            childrenMatch = false;
          } else {
            for (var i$1 = 0; i$1 < children.length; i$1++) {
              if (!hydrate(childNodes[i$1], children[i$1], insertedVnodeQueue)) {
                childrenMatch = false;
                break
              }
            }
          }
          if (!childrenMatch) {
            if ("development" !== 'production' &&
                typeof console !== 'undefined' &&
                !bailed) {
              bailed = true;
              console.warn('Parent: ', elm);
              console.warn('Mismatching childNodes vs. VNodes: ', childNodes, children);
            }
            return false
          }
        }
      }
      if (isDef(data)) {
        invokeCreateHooks(vnode, insertedVnodeQueue);
      }
    }
    return true
  }

  function assertNodeMatch (node, vnode) {
    if (vnode.tag) {
      return (
        vnode.tag.indexOf('vue-component') === 0 ||
        vnode.tag === nodeOps.tagName(node).toLowerCase()
      )
    } else {
      return _toString(vnode.text) === node.data
    }
  }

  return function patch (oldVnode, vnode, hydrating, removeOnly) {
    if (!vnode) {
      if (oldVnode) { invokeDestroyHook(oldVnode); }
      return
    }

    var elm, parent;
    var isInitialPatch = false;
    var insertedVnodeQueue = [];

    if (!oldVnode) {
      // empty mount, create new root element
      isInitialPatch = true;
      createElm(vnode, insertedVnodeQueue);
    } else {
      var isRealElement = isDef(oldVnode.nodeType);
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly);
      } else {
        if (isRealElement) {
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute('server-rendered')) {
            oldVnode.removeAttribute('server-rendered');
            hydrating = true;
          }
          if (hydrating) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true);
              return oldVnode
            } else if (true) {
              warn(
                'The client-side rendered virtual DOM tree is not matching ' +
                'server-rendered content. This is likely caused by incorrect ' +
                'HTML markup, for example nesting block-level elements inside ' +
                '<p>, or missing <tbody>. Bailing hydration and performing ' +
                'full client-side render.'
              );
            }
          }
          // either not server-rendered, or hydration failed.
          // create an empty node and replace it
          oldVnode = emptyNodeAt(oldVnode);
        }
        elm = oldVnode.elm;
        parent = nodeOps.parentNode(elm);

        createElm(vnode, insertedVnodeQueue);

        // component root element replaced.
        // update parent placeholder node element.
        if (vnode.parent) {
          vnode.parent.elm = vnode.elm;
          if (isPatchable(vnode)) {
            for (var i = 0; i < cbs.create.length; ++i) {
              cbs.create[i](emptyNode, vnode.parent);
            }
          }
        }

        if (parent !== null) {
          nodeOps.insertBefore(parent, vnode.elm, nodeOps.nextSibling(elm));
          removeVnodes(parent, [oldVnode], 0, 0);
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode);
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
    return vnode.elm
  }
}

/*  */

var directives = {
  create: updateDirectives,
  update: updateDirectives,
  destroy: function unbindDirectives (vnode) {
    updateDirectives(vnode, emptyNode);
  }
};

function updateDirectives (
  oldVnode,
  vnode
) {
  if (!oldVnode.data.directives && !vnode.data.directives) {
    return
  }
  var isCreate = oldVnode === emptyNode;
  var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
  var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

  var dirsWithInsert = [];
  var dirsWithPostpatch = [];

  var key, oldDir, dir;
  for (key in newDirs) {
    oldDir = oldDirs[key];
    dir = newDirs[key];
    if (!oldDir) {
      // new directive, bind
      callHook$1(dir, 'bind', vnode, oldVnode);
      if (dir.def && dir.def.inserted) {
        dirsWithInsert.push(dir);
      }
    } else {
      // existing directive, update
      dir.oldValue = oldDir.value;
      callHook$1(dir, 'update', vnode, oldVnode);
      if (dir.def && dir.def.componentUpdated) {
        dirsWithPostpatch.push(dir);
      }
    }
  }

  if (dirsWithInsert.length) {
    var callInsert = function () {
      dirsWithInsert.forEach(function (dir) {
        callHook$1(dir, 'inserted', vnode, oldVnode);
      });
    };
    if (isCreate) {
      mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'insert', callInsert, 'dir-insert');
    } else {
      callInsert();
    }
  }

  if (dirsWithPostpatch.length) {
    mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'postpatch', function () {
      dirsWithPostpatch.forEach(function (dir) {
        callHook$1(dir, 'componentUpdated', vnode, oldVnode);
      });
    }, 'dir-postpatch');
  }

  if (!isCreate) {
    for (key in oldDirs) {
      if (!newDirs[key]) {
        // no longer present, unbind
        callHook$1(oldDirs[key], 'unbind', oldVnode);
      }
    }
  }
}

var emptyModifiers = Object.create(null);

function normalizeDirectives$1 (
  dirs,
  vm
) {
  var res = Object.create(null);
  if (!dirs) {
    return res
  }
  var i, dir;
  for (i = 0; i < dirs.length; i++) {
    dir = dirs[i];
    if (!dir.modifiers) {
      dir.modifiers = emptyModifiers;
    }
    res[getRawDirName(dir)] = dir;
    dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
  }
  return res
}

function getRawDirName (dir) {
  return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
}

function callHook$1 (dir, hook, vnode, oldVnode) {
  var fn = dir.def && dir.def[hook];
  if (fn) {
    fn(vnode.elm, dir, vnode, oldVnode);
  }
}

var baseModules = [
  ref,
  directives
];

/*  */

function updateAttrs (oldVnode, vnode) {
  if (!oldVnode.data.attrs && !vnode.data.attrs) {
    return
  }
  var key, cur, old;
  var elm = vnode.elm;
  var oldAttrs = oldVnode.data.attrs || {};
  var attrs = vnode.data.attrs || {};
  // clone observed objects, as the user probably wants to mutate it
  if (attrs.__ob__) {
    attrs = vnode.data.attrs = extend({}, attrs);
  }

  for (key in attrs) {
    cur = attrs[key];
    old = oldAttrs[key];
    if (old !== cur) {
      setAttr(elm, key, cur);
    }
  }
  for (key in oldAttrs) {
    if (attrs[key] == null) {
      if (isXlink(key)) {
        elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else if (!isEnumeratedAttr(key)) {
        elm.removeAttribute(key);
      }
    }
  }
}

function setAttr (el, key, value) {
  if (isBooleanAttr(key)) {
    // set attribute for blank value
    // e.g. <option disabled>Select one</option>
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, key);
    }
  } else if (isEnumeratedAttr(key)) {
    el.setAttribute(key, isFalsyAttrValue(value) || value === 'false' ? 'false' : 'true');
  } else if (isXlink(key)) {
    if (isFalsyAttrValue(value)) {
      el.removeAttributeNS(xlinkNS, getXlinkProp(key));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, value);
    }
  }
}

var attrs = {
  create: updateAttrs,
  update: updateAttrs
};

/*  */

function updateClass (oldVnode, vnode) {
  var el = vnode.elm;
  var data = vnode.data;
  var oldData = oldVnode.data;
  if (!data.staticClass && !data.class &&
      (!oldData || (!oldData.staticClass && !oldData.class))) {
    return
  }

  var cls = genClassForVnode(vnode);

  // handle transition classes
  var transitionClass = el._transitionClasses;
  if (transitionClass) {
    cls = concat(cls, stringifyClass(transitionClass));
  }

  // set the class
  if (cls !== el._prevClass) {
    el.setAttribute('class', cls);
    el._prevClass = cls;
  }
}

var klass = {
  create: updateClass,
  update: updateClass
};

// skip type checking this file because we need to attach private properties
// to elements

function updateDOMListeners (oldVnode, vnode) {
  if (!oldVnode.data.on && !vnode.data.on) {
    return
  }
  var on = vnode.data.on || {};
  var oldOn = oldVnode.data.on || {};
  var add = vnode.elm._v_add || (vnode.elm._v_add = function (event, handler, capture) {
    vnode.elm.addEventListener(event, handler, capture);
  });
  var remove = vnode.elm._v_remove || (vnode.elm._v_remove = function (event, handler) {
    vnode.elm.removeEventListener(event, handler);
  });
  updateListeners(on, oldOn, add, remove, vnode.context);
}

var events = {
  create: updateDOMListeners,
  update: updateDOMListeners
};

/*  */

function updateDOMProps (oldVnode, vnode) {
  if (!oldVnode.data.domProps && !vnode.data.domProps) {
    return
  }
  var key, cur;
  var elm = vnode.elm;
  var oldProps = oldVnode.data.domProps || {};
  var props = vnode.data.domProps || {};
  // clone observed objects, as the user probably wants to mutate it
  if (props.__ob__) {
    props = vnode.data.domProps = extend({}, props);
  }

  for (key in oldProps) {
    if (props[key] == null) {
      elm[key] = undefined;
    }
  }
  for (key in props) {
    // ignore children if the node has textContent or innerHTML,
    // as these will throw away existing DOM nodes and cause removal errors
    // on subsequent patches (#3360)
    if ((key === 'textContent' || key === 'innerHTML') && vnode.children) {
      vnode.children.length = 0;
    }
    cur = props[key];
    if (key === 'value') {
      // store value as _value as well since
      // non-string values will be stringified
      elm._value = cur;
      // avoid resetting cursor position when value is the same
      var strCur = cur == null ? '' : String(cur);
      if (elm.value !== strCur && !elm.composing) {
        elm.value = strCur;
      }
    } else {
      elm[key] = cur;
    }
  }
}

var domProps = {
  create: updateDOMProps,
  update: updateDOMProps
};

/*  */

var prefixes = ['Webkit', 'Moz', 'ms'];

var testEl;
var normalize = cached(function (prop) {
  testEl = testEl || document.createElement('div');
  prop = camelize(prop);
  if (prop !== 'filter' && (prop in testEl.style)) {
    return prop
  }
  var upper = prop.charAt(0).toUpperCase() + prop.slice(1);
  for (var i = 0; i < prefixes.length; i++) {
    var prefixed = prefixes[i] + upper;
    if (prefixed in testEl.style) {
      return prefixed
    }
  }
});

function updateStyle (oldVnode, vnode) {
  if ((!oldVnode.data || !oldVnode.data.style) && !vnode.data.style) {
    return
  }
  var cur, name;
  var el = vnode.elm;
  var oldStyle = oldVnode.data.style || {};
  var style = vnode.data.style || {};

  // handle string
  if (typeof style === 'string') {
    el.style.cssText = style;
    return
  }

  var needClone = style.__ob__;

  // handle array syntax
  if (Array.isArray(style)) {
    style = vnode.data.style = toObject(style);
  }

  // clone the style for future updates,
  // in case the user mutates the style object in-place.
  if (needClone) {
    style = vnode.data.style = extend({}, style);
  }

  for (name in oldStyle) {
    if (style[name] == null) {
      el.style[normalize(name)] = '';
    }
  }
  for (name in style) {
    cur = style[name];
    if (cur !== oldStyle[name]) {
      // ie9 setting to null has no effect, must use empty string
      el.style[normalize(name)] = cur == null ? '' : cur;
    }
  }
}

var style = {
  create: updateStyle,
  update: updateStyle
};

/*  */

/**
 * Add class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function addClass (el, cls) {
  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.add(c); });
    } else {
      el.classList.add(cls);
    }
  } else {
    var cur = ' ' + el.getAttribute('class') + ' ';
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      el.setAttribute('class', (cur + cls).trim());
    }
  }
}

/**
 * Remove class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function removeClass (el, cls) {
  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.remove(c); });
    } else {
      el.classList.remove(cls);
    }
  } else {
    var cur = ' ' + el.getAttribute('class') + ' ';
    var tar = ' ' + cls + ' ';
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }
    el.setAttribute('class', cur.trim());
  }
}

/*  */

var hasTransition = inBrowser && !isIE9;
var TRANSITION = 'transition';
var ANIMATION = 'animation';

// Transition property/event sniffing
var transitionProp = 'transition';
var transitionEndEvent = 'transitionend';
var animationProp = 'animation';
var animationEndEvent = 'animationend';
if (hasTransition) {
  /* istanbul ignore if */
  if (window.ontransitionend === undefined &&
    window.onwebkittransitionend !== undefined) {
    transitionProp = 'WebkitTransition';
    transitionEndEvent = 'webkitTransitionEnd';
  }
  if (window.onanimationend === undefined &&
    window.onwebkitanimationend !== undefined) {
    animationProp = 'WebkitAnimation';
    animationEndEvent = 'webkitAnimationEnd';
  }
}

var raf = (inBrowser && window.requestAnimationFrame) || setTimeout;
function nextFrame (fn) {
  raf(function () {
    raf(fn);
  });
}

function addTransitionClass (el, cls) {
  (el._transitionClasses || (el._transitionClasses = [])).push(cls);
  addClass(el, cls);
}

function removeTransitionClass (el, cls) {
  if (el._transitionClasses) {
    remove$1(el._transitionClasses, cls);
  }
  removeClass(el, cls);
}

function whenTransitionEnds (
  el,
  expectedType,
  cb
) {
  var ref = getTransitionInfo(el, expectedType);
  var type = ref.type;
  var timeout = ref.timeout;
  var propCount = ref.propCount;
  if (!type) { return cb() }
  var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
  var ended = 0;
  var end = function () {
    el.removeEventListener(event, onEnd);
    cb();
  };
  var onEnd = function (e) {
    if (e.target === el) {
      if (++ended >= propCount) {
        end();
      }
    }
  };
  setTimeout(function () {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(event, onEnd);
}

var transformRE = /\b(transform|all)(,|$)/;

function getTransitionInfo (el, expectedType) {
  var styles = window.getComputedStyle(el);
  var transitioneDelays = styles[transitionProp + 'Delay'].split(', ');
  var transitionDurations = styles[transitionProp + 'Duration'].split(', ');
  var transitionTimeout = getTimeout(transitioneDelays, transitionDurations);
  var animationDelays = styles[animationProp + 'Delay'].split(', ');
  var animationDurations = styles[animationProp + 'Duration'].split(', ');
  var animationTimeout = getTimeout(animationDelays, animationDurations);

  var type;
  var timeout = 0;
  var propCount = 0;
  /* istanbul ignore if */
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0
      ? transitionTimeout > animationTimeout
        ? TRANSITION
        : ANIMATION
      : null;
    propCount = type
      ? type === TRANSITION
        ? transitionDurations.length
        : animationDurations.length
      : 0;
  }
  var hasTransform =
    type === TRANSITION &&
    transformRE.test(styles[transitionProp + 'Property']);
  return {
    type: type,
    timeout: timeout,
    propCount: propCount,
    hasTransform: hasTransform
  }
}

function getTimeout (delays, durations) {
  return Math.max.apply(null, durations.map(function (d, i) {
    return toMs(d) + toMs(delays[i])
  }))
}

function toMs (s) {
  return Number(s.slice(0, -1)) * 1000
}

/*  */

function enter (vnode) {
  var el = vnode.elm;

  // call leave callback now
  if (el._leaveCb) {
    el._leaveCb.cancelled = true;
    el._leaveCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (!data) {
    return
  }

  /* istanbul ignore if */
  if (el._enterCb || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var enterClass = data.enterClass;
  var enterActiveClass = data.enterActiveClass;
  var appearClass = data.appearClass;
  var appearActiveClass = data.appearActiveClass;
  var beforeEnter = data.beforeEnter;
  var enter = data.enter;
  var afterEnter = data.afterEnter;
  var enterCancelled = data.enterCancelled;
  var beforeAppear = data.beforeAppear;
  var appear = data.appear;
  var afterAppear = data.afterAppear;
  var appearCancelled = data.appearCancelled;

  // activeInstance will always be the <transition> component managing this
  // transition. One edge case to check is when the <transition> is placed
  // as the root node of a child component. In that case we need to check
  // <transition>'s parent for appear check.
  var transitionNode = activeInstance.$vnode;
  var context = transitionNode && transitionNode.parent
    ? transitionNode.parent.context
    : activeInstance;

  var isAppear = !context._isMounted || !vnode.isRootInsert;

  if (isAppear && !appear && appear !== '') {
    return
  }

  var startClass = isAppear ? appearClass : enterClass;
  var activeClass = isAppear ? appearActiveClass : enterActiveClass;
  var beforeEnterHook = isAppear ? (beforeAppear || beforeEnter) : beforeEnter;
  var enterHook = isAppear ? (typeof appear === 'function' ? appear : enter) : enter;
  var afterEnterHook = isAppear ? (afterAppear || afterEnter) : afterEnter;
  var enterCancelledHook = isAppear ? (appearCancelled || enterCancelled) : enterCancelled;

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl =
    enterHook &&
    // enterHook may be a bound method which exposes
    // the length of original fn as _length
    (enterHook._length || enterHook.length) > 1;

  var cb = el._enterCb = once(function () {
    if (expectsCSS) {
      removeTransitionClass(el, activeClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, startClass);
      }
      enterCancelledHook && enterCancelledHook(el);
    } else {
      afterEnterHook && afterEnterHook(el);
    }
    el._enterCb = null;
  });

  if (!vnode.data.show) {
    // remove pending leave element on enter by injecting an insert hook
    mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'insert', function () {
      var parent = el.parentNode;
      var pendingNode = parent && parent._pending && parent._pending[vnode.key];
      if (pendingNode && pendingNode.tag === vnode.tag && pendingNode.elm._leaveCb) {
        pendingNode.elm._leaveCb();
      }
      enterHook && enterHook(el, cb);
    }, 'transition-insert');
  }

  // start enter transition
  beforeEnterHook && beforeEnterHook(el);
  if (expectsCSS) {
    addTransitionClass(el, startClass);
    addTransitionClass(el, activeClass);
    nextFrame(function () {
      removeTransitionClass(el, startClass);
      if (!cb.cancelled && !userWantsControl) {
        whenTransitionEnds(el, type, cb);
      }
    });
  }

  if (vnode.data.show) {
    enterHook && enterHook(el, cb);
  }

  if (!expectsCSS && !userWantsControl) {
    cb();
  }
}

function leave (vnode, rm) {
  var el = vnode.elm;

  // call enter callback now
  if (el._enterCb) {
    el._enterCb.cancelled = true;
    el._enterCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (!data) {
    return rm()
  }

  /* istanbul ignore if */
  if (el._leaveCb || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var leaveClass = data.leaveClass;
  var leaveActiveClass = data.leaveActiveClass;
  var beforeLeave = data.beforeLeave;
  var leave = data.leave;
  var afterLeave = data.afterLeave;
  var leaveCancelled = data.leaveCancelled;
  var delayLeave = data.delayLeave;

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl =
    leave &&
    // leave hook may be a bound method which exposes
    // the length of original fn as _length
    (leave._length || leave.length) > 1;

  var cb = el._leaveCb = once(function () {
    if (el.parentNode && el.parentNode._pending) {
      el.parentNode._pending[vnode.key] = null;
    }
    if (expectsCSS) {
      removeTransitionClass(el, leaveActiveClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, leaveClass);
      }
      leaveCancelled && leaveCancelled(el);
    } else {
      rm();
      afterLeave && afterLeave(el);
    }
    el._leaveCb = null;
  });

  if (delayLeave) {
    delayLeave(performLeave);
  } else {
    performLeave();
  }

  function performLeave () {
    // the delayed leave may have already been cancelled
    if (cb.cancelled) {
      return
    }
    // record leaving element
    if (!vnode.data.show) {
      (el.parentNode._pending || (el.parentNode._pending = {}))[vnode.key] = vnode;
    }
    beforeLeave && beforeLeave(el);
    if (expectsCSS) {
      addTransitionClass(el, leaveClass);
      addTransitionClass(el, leaveActiveClass);
      nextFrame(function () {
        removeTransitionClass(el, leaveClass);
        if (!cb.cancelled && !userWantsControl) {
          whenTransitionEnds(el, type, cb);
        }
      });
    }
    leave && leave(el, cb);
    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }
}

function resolveTransition (def$$1) {
  if (!def$$1) {
    return
  }
  /* istanbul ignore else */
  if (typeof def$$1 === 'object') {
    var res = {};
    if (def$$1.css !== false) {
      extend(res, autoCssTransition(def$$1.name || 'v'));
    }
    extend(res, def$$1);
    return res
  } else if (typeof def$$1 === 'string') {
    return autoCssTransition(def$$1)
  }
}

var autoCssTransition = cached(function (name) {
  return {
    enterClass: (name + "-enter"),
    leaveClass: (name + "-leave"),
    appearClass: (name + "-enter"),
    enterActiveClass: (name + "-enter-active"),
    leaveActiveClass: (name + "-leave-active"),
    appearActiveClass: (name + "-enter-active")
  }
});

function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn();
    }
  }
}

var transition = inBrowser ? {
  create: function create (_, vnode) {
    if (!vnode.data.show) {
      enter(vnode);
    }
  },
  remove: function remove (vnode, rm) {
    /* istanbul ignore else */
    if (!vnode.data.show) {
      leave(vnode, rm);
    } else {
      rm();
    }
  }
} : {};

var platformModules = [
  attrs,
  klass,
  events,
  domProps,
  style,
  transition
];

/*  */

// the directive module should be applied last, after all
// built-in modules have been applied.
var modules = platformModules.concat(baseModules);

var patch$1 = createPatchFunction({ nodeOps: nodeOps, modules: modules });

/**
 * Not type checking this file because flow doesn't like attaching
 * properties to Elements.
 */

var modelableTagRE = /^input|select|textarea|vue-component-[0-9]+(-[0-9a-zA-Z_\-]*)?$/;

/* istanbul ignore if */
if (isIE9) {
  // http://www.matts411.com/post/internet-explorer-9-oninput/
  document.addEventListener('selectionchange', function () {
    var el = document.activeElement;
    if (el && el.vmodel) {
      trigger(el, 'input');
    }
  });
}

var model = {
  inserted: function inserted (el, binding, vnode) {
    if (true) {
      if (!modelableTagRE.test(vnode.tag)) {
        warn(
          "v-model is not supported on element type: <" + (vnode.tag) + ">. " +
          'If you are working with contenteditable, it\'s recommended to ' +
          'wrap a library dedicated for that purpose inside a custom component.',
          vnode.context
        );
      }
    }
    if (vnode.tag === 'select') {
      var cb = function () {
        setSelected(el, binding, vnode.context);
      };
      cb();
      /* istanbul ignore if */
      if (isIE || isEdge) {
        setTimeout(cb, 0);
      }
    } else if (
      (vnode.tag === 'textarea' || el.type === 'text') &&
      !binding.modifiers.lazy
    ) {
      if (!isAndroid) {
        el.addEventListener('compositionstart', onCompositionStart);
        el.addEventListener('compositionend', onCompositionEnd);
      }
      /* istanbul ignore if */
      if (isIE9) {
        el.vmodel = true;
      }
    }
  },
  componentUpdated: function componentUpdated (el, binding, vnode) {
    if (vnode.tag === 'select') {
      setSelected(el, binding, vnode.context);
      // in case the options rendered by v-for have changed,
      // it's possible that the value is out-of-sync with the rendered options.
      // detect such cases and filter out values that no longer has a matchig
      // option in the DOM.
      var needReset = el.multiple
        ? binding.value.some(function (v) { return hasNoMatchingOption(v, el.options); })
        : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, el.options);
      if (needReset) {
        trigger(el, 'change');
      }
    }
  }
};

function setSelected (el, binding, vm) {
  var value = binding.value;
  var isMultiple = el.multiple;
  if (isMultiple && !Array.isArray(value)) {
    "development" !== 'production' && warn(
      "<select multiple v-model=\"" + (binding.expression) + "\"> " +
      "expects an Array value for its binding, but got " + (Object.prototype.toString.call(value).slice(8, -1)),
      vm
    );
    return
  }
  var selected, option;
  for (var i = 0, l = el.options.length; i < l; i++) {
    option = el.options[i];
    if (isMultiple) {
      selected = looseIndexOf(value, getValue(option)) > -1;
      if (option.selected !== selected) {
        option.selected = selected;
      }
    } else {
      if (looseEqual(getValue(option), value)) {
        if (el.selectedIndex !== i) {
          el.selectedIndex = i;
        }
        return
      }
    }
  }
  if (!isMultiple) {
    el.selectedIndex = -1;
  }
}

function hasNoMatchingOption (value, options) {
  for (var i = 0, l = options.length; i < l; i++) {
    if (looseEqual(getValue(options[i]), value)) {
      return false
    }
  }
  return true
}

function getValue (option) {
  return '_value' in option
    ? option._value
    : option.value
}

function onCompositionStart (e) {
  e.target.composing = true;
}

function onCompositionEnd (e) {
  e.target.composing = false;
  trigger(e.target, 'input');
}

function trigger (el, type) {
  var e = document.createEvent('HTMLEvents');
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
}

/*  */

// recursively search for possible transition defined inside the component root
function locateNode (vnode) {
  return vnode.child && (!vnode.data || !vnode.data.transition)
    ? locateNode(vnode.child._vnode)
    : vnode
}

var show = {
  bind: function bind (el, ref, vnode) {
    var value = ref.value;

    vnode = locateNode(vnode);
    var transition = vnode.data && vnode.data.transition;
    if (value && transition && !isIE9) {
      enter(vnode);
    }
    var originalDisplay = el.style.display === 'none' ? '' : el.style.display;
    el.style.display = value ? originalDisplay : 'none';
    el.__vOriginalDisplay = originalDisplay;
  },
  update: function update (el, ref, vnode) {
    var value = ref.value;
    var oldValue = ref.oldValue;

    /* istanbul ignore if */
    if (value === oldValue) { return }
    vnode = locateNode(vnode);
    var transition = vnode.data && vnode.data.transition;
    if (transition && !isIE9) {
      if (value) {
        enter(vnode);
        el.style.display = el.__vOriginalDisplay;
      } else {
        leave(vnode, function () {
          el.style.display = 'none';
        });
      }
    } else {
      el.style.display = value ? el.__vOriginalDisplay : 'none';
    }
  }
};

var platformDirectives = {
  model: model,
  show: show
};

/*  */

// Provides transition support for a single element/component.
// supports transition mode (out-in / in-out)

var transitionProps = {
  name: String,
  appear: Boolean,
  css: Boolean,
  mode: String,
  type: String,
  enterClass: String,
  leaveClass: String,
  enterActiveClass: String,
  leaveActiveClass: String,
  appearClass: String,
  appearActiveClass: String
};

// in case the child is also an abstract component, e.g. <keep-alive>
// we want to recrusively retrieve the real component to be rendered
function getRealChild (vnode) {
  var compOptions = vnode && vnode.componentOptions;
  if (compOptions && compOptions.Ctor.options.abstract) {
    return getRealChild(getFirstComponentChild(compOptions.children))
  } else {
    return vnode
  }
}

function extractTransitionData (comp) {
  var data = {};
  var options = comp.$options;
  // props
  for (var key in options.propsData) {
    data[key] = comp[key];
  }
  // events.
  // extract listeners and pass them directly to the transition methods
  var listeners = options._parentListeners;
  for (var key$1 in listeners) {
    data[camelize(key$1)] = listeners[key$1].fn;
  }
  return data
}

function placeholder (h, rawChild) {
  return /\d-keep-alive$/.test(rawChild.tag)
    ? h('keep-alive')
    : null
}

function hasParentTransition (vnode) {
  while ((vnode = vnode.parent)) {
    if (vnode.data.transition) {
      return true
    }
  }
}

var Transition = {
  name: 'transition',
  props: transitionProps,
  abstract: true,
  render: function render (h) {
    var this$1 = this;

    var children = this.$slots.default;
    if (!children) {
      return
    }

    // filter out text nodes (possible whitespaces)
    children = children.filter(function (c) { return c.tag; });
    /* istanbul ignore if */
    if (!children.length) {
      return
    }

    // warn multiple elements
    if ("development" !== 'production' && children.length > 1) {
      warn(
        '<transition> can only be used on a single element. Use ' +
        '<transition-group> for lists.',
        this.$parent
      );
    }

    var mode = this.mode;

    // warn invalid mode
    if ("development" !== 'production' &&
        mode && mode !== 'in-out' && mode !== 'out-in') {
      warn(
        'invalid <transition> mode: ' + mode,
        this.$parent
      );
    }

    var rawChild = children[0];

    // if this is a component root node and the component's
    // parent container node also has transition, skip.
    if (hasParentTransition(this.$vnode)) {
      return rawChild
    }

    // apply transition data to child
    // use getRealChild() to ignore abstract components e.g. keep-alive
    var child = getRealChild(rawChild);
    /* istanbul ignore if */
    if (!child) {
      return rawChild
    }

    if (this._leaving) {
      return placeholder(h, rawChild)
    }

    var key = child.key = child.key == null || child.isStatic
      ? ("__v" + (child.tag + this._uid) + "__")
      : child.key;
    var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
    var oldRawChild = this._vnode;
    var oldChild = getRealChild(oldRawChild);

    // mark v-show
    // so that the transition module can hand over the control to the directive
    if (child.data.directives && child.data.directives.some(function (d) { return d.name === 'show'; })) {
      child.data.show = true;
    }

    if (oldChild && oldChild.data && oldChild.key !== key) {
      // replace old child transition data with fresh one
      // important for dynamic transitions!
      var oldData = oldChild.data.transition = extend({}, data);

      // handle transition mode
      if (mode === 'out-in') {
        // return placeholder node and queue update when leave finishes
        this._leaving = true;
        mergeVNodeHook(oldData, 'afterLeave', function () {
          this$1._leaving = false;
          this$1.$forceUpdate();
        }, key);
        return placeholder(h, rawChild)
      } else if (mode === 'in-out') {
        var delayedLeave;
        var performLeave = function () { delayedLeave(); };
        mergeVNodeHook(data, 'afterEnter', performLeave, key);
        mergeVNodeHook(data, 'enterCancelled', performLeave, key);
        mergeVNodeHook(oldData, 'delayLeave', function (leave) {
          delayedLeave = leave;
        }, key);
      }
    }

    return rawChild
  }
};

/*  */

// Provides transition support for list items.
// supports move transitions using the FLIP technique.

// Because the vdom's children update algorithm is "unstable" - i.e.
// it doesn't guarantee the relative positioning of removed elements,
// we force transition-group to update its children into two passes:
// in the first pass, we remove all nodes that need to be removed,
// triggering their leaving transition; in the second pass, we insert/move
// into the final disired state. This way in the second pass removed
// nodes will remain where they should be.

var props = extend({
  tag: String,
  moveClass: String
}, transitionProps);

delete props.mode;

var TransitionGroup = {
  props: props,

  render: function render (h) {
    var tag = this.tag || this.$vnode.data.tag || 'span';
    var map = Object.create(null);
    var prevChildren = this.prevChildren = this.children;
    var rawChildren = this.$slots.default || [];
    var children = this.children = [];
    var transitionData = extractTransitionData(this);

    for (var i = 0; i < rawChildren.length; i++) {
      var c = rawChildren[i];
      if (c.tag) {
        if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
          children.push(c);
          map[c.key] = c
          ;(c.data || (c.data = {})).transition = transitionData;
        } else if (true) {
          var opts = c.componentOptions;
          var name = opts
            ? (opts.Ctor.options.name || opts.tag)
            : c.tag;
          warn(("<transition-group> children must be keyed: <" + name + ">"));
        }
      }
    }

    if (prevChildren) {
      var kept = [];
      var removed = [];
      for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
        var c$1 = prevChildren[i$1];
        c$1.data.transition = transitionData;
        c$1.data.pos = c$1.elm.getBoundingClientRect();
        if (map[c$1.key]) {
          kept.push(c$1);
        } else {
          removed.push(c$1);
        }
      }
      this.kept = h(tag, null, kept);
      this.removed = removed;
    }

    return h(tag, null, children)
  },

  beforeUpdate: function beforeUpdate () {
    // force removing pass
    this.__patch__(
      this._vnode,
      this.kept,
      false, // hydrating
      true // removeOnly (!important, avoids unnecessary moves)
    );
    this._vnode = this.kept;
  },

  updated: function updated () {
    var children = this.prevChildren;
    var moveClass = this.moveClass || (this.name + '-move');
    if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
      return
    }

    // we divide the work into three loops to avoid mixing DOM reads and writes
    // in each iteration - which helps prevent layout thrashing.
    children.forEach(callPendingCbs);
    children.forEach(recordPosition);
    children.forEach(applyTranslation);

    // force reflow to put everything in position
    var f = document.body.offsetHeight; // eslint-disable-line

    children.forEach(function (c) {
      if (c.data.moved) {
        var el = c.elm;
        var s = el.style;
        addTransitionClass(el, moveClass);
        s.transform = s.WebkitTransform = s.transitionDuration = '';
        el.addEventListener(transitionEndEvent, el._moveCb = function cb (e) {
          if (!e || /transform$/.test(e.propertyName)) {
            el.removeEventListener(transitionEndEvent, cb);
            el._moveCb = null;
            removeTransitionClass(el, moveClass);
          }
        });
      }
    });
  },

  methods: {
    hasMove: function hasMove (el, moveClass) {
      /* istanbul ignore if */
      if (!hasTransition) {
        return false
      }
      if (this._hasMove != null) {
        return this._hasMove
      }
      addTransitionClass(el, moveClass);
      var info = getTransitionInfo(el);
      removeTransitionClass(el, moveClass);
      return (this._hasMove = info.hasTransform)
    }
  }
};

function callPendingCbs (c) {
  /* istanbul ignore if */
  if (c.elm._moveCb) {
    c.elm._moveCb();
  }
  /* istanbul ignore if */
  if (c.elm._enterCb) {
    c.elm._enterCb();
  }
}

function recordPosition (c) {
  c.data.newPos = c.elm.getBoundingClientRect();
}

function applyTranslation (c) {
  var oldPos = c.data.pos;
  var newPos = c.data.newPos;
  var dx = oldPos.left - newPos.left;
  var dy = oldPos.top - newPos.top;
  if (dx || dy) {
    c.data.moved = true;
    var s = c.elm.style;
    s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
    s.transitionDuration = '0s';
  }
}

var platformComponents = {
  Transition: Transition,
  TransitionGroup: TransitionGroup
};

/*  */

// install platform specific utils
Vue$2.config.isUnknownElement = isUnknownElement;
Vue$2.config.isReservedTag = isReservedTag;
Vue$2.config.getTagNamespace = getTagNamespace;
Vue$2.config.mustUseProp = mustUseProp;

// install platform runtime directives & components
extend(Vue$2.options.directives, platformDirectives);
extend(Vue$2.options.components, platformComponents);

// install platform patch function
Vue$2.prototype.__patch__ = config._isServer ? noop : patch$1;

// wrap mount
Vue$2.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && !config._isServer ? query(el) : undefined;
  return this._mount(el, hydrating)
};

// devtools global hook
/* istanbul ignore next */
setTimeout(function () {
  if (config.devtools) {
    if (devtools) {
      devtools.emit('init', Vue$2);
    } else if (
      "development" !== 'production' &&
      inBrowser && /Chrome\/\d+/.test(window.navigator.userAgent)
    ) {
      console.log(
        'Download the Vue Devtools for a better development experience:\n' +
        'https://github.com/vuejs/vue-devtools'
      );
    }
  }
}, 0);

module.exports = Vue$2;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(35)))

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* styles */
__webpack_require__(67)

/* script */
__vue_exports__ = __webpack_require__(14)

/* template */
var __vue_template__ = __webpack_require__(55)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/teddyzhu/Documents/JavaWork/code/lc4e/src/main/webapp/WEB-INF/views/themes/default/src/views/compments/body.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-ca8d316e", __vue_options__)
  } else {
    hotAPI.reload("data-v-ca8d316e", __vue_options__)
  }
})()}
if (__vue_options__.functional) {console.error("[vue-loader] body.vue: functional components are not supported and should be defined in plain js files using render functions.")}

module.exports = __vue_exports__


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* styles */
__webpack_require__(66)

/* script */
__vue_exports__ = __webpack_require__(21)

/* template */
var __vue_template__ = __webpack_require__(54)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/teddyzhu/Documents/JavaWork/code/lc4e/src/main/webapp/WEB-INF/views/themes/default/src/views/others/pager.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-bd9e1816"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-bd9e1816", __vue_options__)
  } else {
    hotAPI.reload("data-v-bd9e1816", __vue_options__)
  }
})()}
if (__vue_options__.functional) {console.error("[vue-loader] pager.vue: functional components are not supported and should be defined in plain js files using render functions.")}

module.exports = __vue_exports__


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* styles */
__webpack_require__(61)

/* script */
__vue_exports__ = __webpack_require__(18)

/* template */
var __vue_template__ = __webpack_require__(48)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/teddyzhu/Documents/JavaWork/code/lc4e/src/main/webapp/WEB-INF/views/themes/default/src/views/index/topicLine.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-441ae050", __vue_options__)
  } else {
    hotAPI.reload("data-v-441ae050", __vue_options__)
  }
})()}
if (__vue_options__.functional) {console.error("[vue-loader] topicLine.vue: functional components are not supported and should be defined in plain js files using render functions.")}

module.exports = __vue_exports__


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_router__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_router___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_vue_router__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__views_index_vue__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__views_index_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__views_index_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__views_area_vue__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__views_area_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__views_area_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__views_topic_vue__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__views_topic_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__views_topic_vue__);
/**
 * Created by teddyzhu on 2016/10/15.
 */





__WEBPACK_IMPORTED_MODULE_0_vue___default.a.use(__WEBPACK_IMPORTED_MODULE_1_vue_router___default.a);

/* harmony default export */ exports["a"] = new __WEBPACK_IMPORTED_MODULE_1_vue_router___default.a({
    mode: 'history',
    scrollBehavior: function scrollBehavior(to, from, savedPosition) {
        return savedPosition || { x: 0, y: 0 };
    },
    routes: [{
        path: '/',
        component: __WEBPACK_IMPORTED_MODULE_2__views_index_vue___default.a
    }, {
        path: '/a/:area',
        name: 'area1',
        component: __WEBPACK_IMPORTED_MODULE_3__views_area_vue___default.a
    }, {
        path: "/a/:area-:page(\\d+)-:order(\\d+)",
        name: 'area2',
        component: __WEBPACK_IMPORTED_MODULE_3__views_area_vue___default.a
    }, {
        path: "/t/:topic",
        name: "topic1",
        component: __WEBPACK_IMPORTED_MODULE_4__views_topic_vue___default.a
    }, {
        path: "/t/:topic-:page(\\d+)-:order(\\d+)",
        name: "topic2",
        component: __WEBPACK_IMPORTED_MODULE_4__views_topic_vue___default.a
    }]
});

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

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
/******/ 	__webpack_require__.p = "/dist/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _index = __webpack_require__(2);

	var _index2 = _interopRequireDefault(_index);

	var _index3 = __webpack_require__(10);

	var _index4 = _interopRequireDefault(_index3);

	var _index5 = __webpack_require__(38);

	var _index6 = _interopRequireDefault(_index5);

	var _index7 = __webpack_require__(43);

	var _index8 = _interopRequireDefault(_index7);

	var _index9 = __webpack_require__(47);

	var _index10 = _interopRequireDefault(_index9);

	var _index11 = __webpack_require__(50);

	var _index12 = _interopRequireDefault(_index11);

	var _index13 = __webpack_require__(54);

	var _index14 = _interopRequireDefault(_index13);

	var _index15 = __webpack_require__(58);

	var _index16 = _interopRequireDefault(_index15);

	var _index17 = __webpack_require__(62);

	var _index18 = _interopRequireDefault(_index17);

	var _index19 = __webpack_require__(67);

	var _index20 = _interopRequireDefault(_index19);

	var _index21 = __webpack_require__(71);

	var _index22 = _interopRequireDefault(_index21);

	var _index23 = __webpack_require__(19);

	var _index24 = _interopRequireDefault(_index23);

	var _index25 = __webpack_require__(75);

	var _index26 = _interopRequireDefault(_index25);

	var _index27 = __webpack_require__(80);

	var _index28 = _interopRequireDefault(_index27);

	var _index29 = __webpack_require__(84);

	var _index30 = _interopRequireDefault(_index29);

	var _index31 = __webpack_require__(88);

	var _index32 = _interopRequireDefault(_index31);

	var _index33 = __webpack_require__(92);

	var _index34 = _interopRequireDefault(_index33);

	var _index35 = __webpack_require__(96);

	var _index36 = _interopRequireDefault(_index35);

	var _index37 = __webpack_require__(100);

	var _index38 = _interopRequireDefault(_index37);

	var _index39 = __webpack_require__(15);

	var _index40 = _interopRequireDefault(_index39);

	var _index41 = __webpack_require__(34);

	var _index42 = _interopRequireDefault(_index41);

	var _index43 = __webpack_require__(104);

	var _index44 = _interopRequireDefault(_index43);

	var _index45 = __webpack_require__(108);

	var _index46 = _interopRequireDefault(_index45);

	var _index47 = __webpack_require__(115);

	var _index48 = _interopRequireDefault(_index47);

	var _index49 = __webpack_require__(116);

	var _index50 = _interopRequireDefault(_index49);

	var _index51 = __webpack_require__(127);

	var _index52 = _interopRequireDefault(_index51);

	var _index53 = __webpack_require__(129);

	var _index54 = _interopRequireDefault(_index53);

	var _index55 = __webpack_require__(159);

	var _index56 = _interopRequireDefault(_index55);

	var _index57 = __webpack_require__(164);

	var _index58 = _interopRequireDefault(_index57);

	var _index59 = __webpack_require__(169);

	var _index60 = _interopRequireDefault(_index59);

	var _index61 = __webpack_require__(174);

	var _index62 = _interopRequireDefault(_index61);

	var _index63 = __webpack_require__(178);

	var _index64 = _interopRequireDefault(_index63);

	var _index65 = __webpack_require__(185);

	var _index66 = _interopRequireDefault(_index65);

	var _index67 = __webpack_require__(189);

	var _index68 = _interopRequireDefault(_index67);

	var _index69 = __webpack_require__(193);

	var _index70 = _interopRequireDefault(_index69);

	var _index71 = __webpack_require__(197);

	var _index72 = _interopRequireDefault(_index71);

	var _index73 = __webpack_require__(226);

	var _index74 = _interopRequireDefault(_index73);

	var _index75 = __webpack_require__(236);

	var _index76 = _interopRequireDefault(_index75);

	var _index77 = __webpack_require__(24);

	var _index78 = _interopRequireDefault(_index77);

	var _index79 = __webpack_require__(237);

	var _index80 = _interopRequireDefault(_index79);

	var _index81 = __webpack_require__(247);

	var _index82 = _interopRequireDefault(_index81);

	var _index83 = __webpack_require__(251);

	var _index84 = _interopRequireDefault(_index83);

	var _index85 = __webpack_require__(256);

	var _index86 = _interopRequireDefault(_index85);

	var _index87 = __webpack_require__(262);

	var _index88 = _interopRequireDefault(_index87);

	var _index89 = __webpack_require__(266);

	var _index90 = _interopRequireDefault(_index89);

	var _index91 = __webpack_require__(270);

	var _index92 = _interopRequireDefault(_index91);

	var _index93 = __webpack_require__(274);

	var _index94 = _interopRequireDefault(_index93);

	var _index95 = __webpack_require__(278);

	var _index96 = _interopRequireDefault(_index95);

	var _index97 = __webpack_require__(293);

	var _index98 = _interopRequireDefault(_index97);

	var _index99 = __webpack_require__(297);

	var _index100 = _interopRequireDefault(_index99);

	var _index101 = __webpack_require__(301);

	var _index102 = _interopRequireDefault(_index101);

	var _index103 = __webpack_require__(311);

	var _index104 = _interopRequireDefault(_index103);

	var _index105 = __webpack_require__(315);

	var _index106 = _interopRequireDefault(_index105);

	var _index107 = __webpack_require__(319);

	var _index108 = _interopRequireDefault(_index107);

	var _index109 = __webpack_require__(324);

	var _index110 = _interopRequireDefault(_index109);

	var _index111 = __webpack_require__(328);

	var _index112 = _interopRequireDefault(_index111);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var install = function install(Vue) {
	  if (install.installed) return;

	  Vue.component(_index2.default.name, _index2.default);
	  Vue.component(_index4.default.name, _index4.default);
	  Vue.component(_index6.default.name, _index6.default);
	  Vue.component(_index8.default.name, _index8.default);
	  Vue.component(_index10.default.name, _index10.default);
	  Vue.component(_index12.default.name, _index12.default);
	  Vue.component(_index14.default.name, _index14.default);
	  Vue.component(_index16.default.name, _index16.default);
	  Vue.component(_index18.default.name, _index18.default);
	  Vue.component(_index20.default.name, _index20.default);
	  Vue.component(_index22.default.name, _index22.default);
	  Vue.component(_index24.default.name, _index24.default);
	  Vue.component(_index26.default.name, _index26.default);
	  Vue.component(_index28.default.name, _index28.default);
	  Vue.component(_index30.default.name, _index30.default);
	  Vue.component(_index32.default.name, _index32.default);
	  Vue.component(_index34.default.name, _index34.default);
	  Vue.component(_index36.default.name, _index36.default);
	  Vue.component(_index38.default.name, _index38.default);
	  Vue.component(_index40.default.name, _index40.default);
	  Vue.component(_index42.default.name, _index42.default);
	  Vue.component(_index44.default.name, _index44.default);
	  Vue.component(_index46.default.name, _index46.default);
	  Vue.component(_index48.default.name, _index48.default);
	  Vue.component(_index50.default.name, _index50.default);
	  Vue.component(_index52.default.name, _index52.default);
	  Vue.component(_index54.default.name, _index54.default);
	  Vue.component(_index56.default.name, _index56.default);
	  Vue.component(_index58.default.name, _index58.default);
	  Vue.component(_index60.default.name, _index60.default);
	  Vue.component(_index62.default.name, _index62.default);
	  Vue.component(_index66.default.name, _index66.default);
	  Vue.component(_index68.default.name, _index68.default);
	  Vue.component(_index70.default.name, _index70.default);
	  Vue.component(_index72.default.name, _index72.default);
	  Vue.component(_index74.default.name, _index74.default);
	  Vue.component(_index76.default.name, _index76.default);
	  Vue.component(_index78.default.name, _index78.default);
	  Vue.component(_index80.default.name, _index80.default);
	  Vue.component(_index82.default.name, _index82.default);
	  Vue.component(_index86.default.name, _index86.default);
	  Vue.component(_index90.default.name, _index90.default);
	  Vue.component(_index92.default.name, _index92.default);
	  Vue.component(_index94.default.name, _index94.default);
	  Vue.component(_index96.default.name, _index96.default);
	  Vue.component(_index98.default.name, _index98.default);
	  Vue.component(_index100.default.name, _index100.default);
	  Vue.component(_index104.default.name, _index104.default);
	  Vue.component(_index106.default.name, _index106.default);
	  Vue.component(_index108.default.name, _index108.default);
	  Vue.component(_index110.default.name, _index110.default);
	  Vue.component(_index112.default.name, _index112.default);

	  Vue.use(_index88.default);

	  Vue.prototype.$msgbox = _index64.default;
	  Vue.prototype.$alert = _index64.default.alert;
	  Vue.prototype.$confirm = _index64.default.confirm;
	  Vue.prototype.$prompt = _index64.default.prompt;
	  Vue.prototype.$notify = _index84.default;
	  Vue.prototype.$message = _index102.default;
	};

	if (typeof window !== 'undefined' && window.Vue) {
	  install(window.Vue);
	};

	module.exports = {
	  version: '1.0.0-rc.7',
	  install: install,
	  SelectDropdown: _index2.default,
	  Pagination: _index4.default,
	  Dialog: _index6.default,
	  Autocomplete: _index8.default,
	  Dropdown: _index10.default,
	  DropdownMenu: _index12.default,
	  DropdownItem: _index14.default,
	  Menu: _index16.default,
	  Submenu: _index18.default,
	  MenuItem: _index20.default,
	  MenuItemGroup: _index22.default,
	  Input: _index24.default,
	  InputNumber: _index26.default,
	  Radio: _index28.default,
	  RadioGroup: _index30.default,
	  RadioButton: _index32.default,
	  Checkbox: _index34.default,
	  CheckboxGroup: _index36.default,
	  Switch: _index38.default,
	  Select: _index40.default,
	  Option: _index42.default,
	  OptionGroup: _index44.default,
	  Button: _index46.default,
	  ButtonGroup: _index48.default,
	  Table: _index50.default,
	  TableColumn: _index52.default,
	  DatePicker: _index54.default,
	  TimeSelect: _index56.default,
	  TimePicker: _index58.default,
	  Popover: _index60.default,
	  Tooltip: _index62.default,
	  MessageBox: _index64.default,
	  Breadcrumb: _index66.default,
	  BreadcrumbItem: _index68.default,
	  Form: _index70.default,
	  FormItem: _index72.default,
	  Tabs: _index74.default,
	  TabPane: _index76.default,
	  Tag: _index78.default,
	  Tree: _index80.default,
	  Alert: _index82.default,
	  Notification: _index84.default,
	  Slider: _index86.default,
	  Loading: _index88.default,
	  Icon: _index90.default,
	  Row: _index92.default,
	  Col: _index94.default,
	  Upload: _index96.default,
	  Progress: _index98.default,
	  Spinner: _index100.default,
	  Message: _index102.default,
	  Badge: _index104.default,
	  Card: _index106.default,
	  Rate: _index108.default,
	  Steps: _index110.default,
	  Step: _index112.default
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var SelectDropdown = __webpack_require__(3);

	SelectDropdown.install = function (Vue) {
	  Vue.component(SelectDropdown.name, SelectDropdown);
	};

	module.exports = SelectDropdown;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(4)

	/* template */
	var __vue_template__ = __webpack_require__(9)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _vuePopper = __webpack_require__(5);

	var _vuePopper2 = _interopRequireDefault(_vuePopper);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  name: 'el-select-dropdown',

	  componentName: 'select-dropdown',

	  mixins: [_vuePopper2.default],

	  props: {
	    placement: {
	      default: 'bottom-start'
	    },

	    boundariesPadding: {
	      default: 0
	    },

	    options: {
	      default: function _default() {
	        return {
	          forceAbsolute: true,
	          gpuAcceleration: false
	        };
	      }
	    }
	  },

	  data: function data() {
	    return {
	      minWidth: ''
	    };
	  },


	  watch: {
	    '$parent.inputWidth': function $parentInputWidth() {
	      this.minWidth = this.$parent.$el.getBoundingClientRect().width + 'px';
	    }
	  },

	  mounted: function mounted() {
	    this.referenceElm = this.$parent.$refs.reference.$el;
	    this.$parent.popperElm = this.popperElm = this.$el;
	    this.$on('updatePopper', this.updatePopper);
	    this.$on('destroyPopper', this.destroyPopper);
	  }
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _popper = __webpack_require__(6);

	var _popper2 = _interopRequireDefault(_popper);

	var _vuePopup = __webpack_require__(7);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  props: {
	    placement: {
	      type: String,
	      default: 'bottom'
	    },
	    boundariesPadding: {
	      type: Number,
	      default: 5
	    },
	    reference: Object,
	    popper: Object,
	    offset: {
	      default: 0
	    },
	    value: Boolean,
	    visibleArrow: Boolean,
	    transition: String,
	    appendToBody: {
	      type: Boolean,
	      default: true
	    },
	    options: {
	      type: Object,
	      default: function _default() {
	        return {
	          gpuAcceleration: false
	        };
	      }
	    }
	  },

	  data: function data() {
	    return {
	      showPopper: false
	    };
	  },


	  watch: {
	    value: {
	      immediate: true,
	      handler: function handler(val) {
	        this.showPopper = val;
	        this.$emit('input', val);
	      }
	    },

	    showPopper: function showPopper(val) {
	      val ? this.updatePopper() : this.destroyPopper();
	      this.$emit('input', val);
	    }
	  },

	  methods: {
	    createPopper: function createPopper() {
	      var _this = this;

	      if (!/^(top|bottom|left|right)(-start|-end)?$/g.test(this.placement)) {
	        return;
	      }

	      var options = this.options;
	      var popper = this.popperElm = this.popperElm || this.popper || this.$refs.popper;
	      var reference = this.referenceElm = this.referenceElm || this.reference || this.$refs.reference || this.$slots.reference[0].elm;

	      if (!popper || !reference) return;

	      if (this.visibleArrow) this.appendArrow(popper);
	      if (this.appendToBody) document.body.appendChild(this.popperElm);
	      if (this.popperJS && this.popperJS.hasOwnProperty('destroy')) {
	        this.popperJS.destroy();
	      }

	      options.placement = this.placement;
	      options.offset = this.offset;
	      this.popperJS = new _popper2.default(reference, popper, options);
	      this.popperJS.onCreate(function (_) {
	        _this.$emit('created', _this);
	        _this.resetTransformOrigin();
	      });
	      this.popperJS._popper.style.zIndex = _vuePopup.PopupManager.nextZIndex();
	    },
	    updatePopper: function updatePopper() {
	      this.popperJS ? this.popperJS.update() : this.createPopper();
	    },
	    doDestroy: function doDestroy() {
	      if (this.showPopper || !this.popperJS) return;
	      this.popperJS.destroy();
	      this.popperJS = null;
	    },
	    destroyPopper: function destroyPopper() {
	      if (this.popperJS) {
	        this.resetTransformOrigin();
	      }
	    },
	    resetTransformOrigin: function resetTransformOrigin() {
	      var placementMap = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };
	      var placement = this.popperJS._popper.getAttribute('x-placement').split('-')[0];
	      var origin = placementMap[placement];
	      this.popperJS._popper.style.transformOrigin = ['top', 'bottom'].indexOf(placement) > -1 ? 'center ' + origin : origin + ' center';
	    },
	    appendArrow: function appendArrow(element) {
	      var hash = void 0;
	      if (this.appended) {
	        return;
	      }

	      this.appended = true;

	      for (var item in element.attributes) {
	        if (/^_v-/.test(element.attributes[item].name)) {
	          hash = element.attributes[item].name;
	          break;
	        }
	      }

	      var arrow = document.createElement('div');

	      if (hash) {
	        arrow.setAttribute(hash, '');
	      }
	      arrow.setAttribute('x-arrow', '');
	      arrow.className = 'popper__arrow';
	      element.appendChild(arrow);
	    }
	  },

	  beforeDestroy: function beforeDestroy() {
	    this.doDestroy();
	    this.popperElm && document.body.contains(this.popperElm) && document.body.removeChild(this.popperElm);
	  }
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * @fileOverview Kickass library to create and place poppers near their reference elements.
	 * @version {{version}}
	 * @license
	 * Copyright (c) 2016 Federico Zivolo and contributors
	 *
	 * Permission is hereby granted, free of charge, to any person obtaining a copy
	 * of this software and associated documentation files (the "Software"), to deal
	 * in the Software without restriction, including without limitation the rights
	 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the Software is
	 * furnished to do so, subject to the following conditions:
	 *
	 * The above copyright notice and this permission notice shall be included in all
	 * copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	 * SOFTWARE.
	 */

	//
	// Cross module loader
	// Supported: Node, AMD, Browser globals
	//
	;(function (root, factory) {
	    if (true) {
	        // AMD. Register as an anonymous module.
	        !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof module === 'object' && module.exports) {
	        // Node. Does not work with strict CommonJS, but
	        // only CommonJS-like environments that support module.exports,
	        // like Node.
	        module.exports = factory();
	    } else {
	        // Browser globals (root is window)
	        root.Popper = factory();
	    }
	}(this, function () {

	    'use strict';

	    var root = window;

	    // default options
	    var DEFAULTS = {
	        // placement of the popper
	        placement: 'bottom',

	        gpuAcceleration: true,

	        // shift popper from its origin by the given amount of pixels (can be negative)
	        offset: 0,

	        // the element which will act as boundary of the popper
	        boundariesElement: 'viewport',

	        // amount of pixel used to define a minimum distance between the boundaries and the popper
	        boundariesPadding: 5,

	        // popper will try to prevent overflow following this order,
	        // by default, then, it could overflow on the left and on top of the boundariesElement
	        preventOverflowOrder: ['left', 'right', 'top', 'bottom'],

	        // the behavior used by flip to change the placement of the popper
	        flipBehavior: 'flip',

	        arrowElement: '[x-arrow]',

	        // list of functions used to modify the offsets before they are applied to the popper
	        modifiers: [ 'shift', 'offset', 'preventOverflow', 'keepTogether', 'arrow', 'flip', 'applyStyle'],

	        modifiersIgnored: [],

	        forceAbsolute: false
	    };

	    /**
	     * Create a new Popper.js instance
	     * @constructor Popper
	     * @param {HTMLElement} reference - The reference element used to position the popper
	     * @param {HTMLElement|Object} popper
	     *      The HTML element used as popper, or a configuration used to generate the popper.
	     * @param {String} [popper.tagName='div'] The tag name of the generated popper.
	     * @param {Array} [popper.classNames=['popper']] Array of classes to apply to the generated popper.
	     * @param {Array} [popper.attributes] Array of attributes to apply, specify `attr:value` to assign a value to it.
	     * @param {HTMLElement|String} [popper.parent=window.document.body] The parent element, given as HTMLElement or as query string.
	     * @param {String} [popper.content=''] The content of the popper, it can be text, html, or node; if it is not text, set `contentType` to `html` or `node`.
	     * @param {String} [popper.contentType='text'] If `html`, the `content` will be parsed as HTML. If `node`, it will be appended as-is.
	     * @param {String} [popper.arrowTagName='div'] Same as `popper.tagName` but for the arrow element.
	     * @param {Array} [popper.arrowClassNames='popper__arrow'] Same as `popper.classNames` but for the arrow element.
	     * @param {String} [popper.arrowAttributes=['x-arrow']] Same as `popper.attributes` but for the arrow element.
	     * @param {Object} options
	     * @param {String} [options.placement=bottom]
	     *      Placement of the popper accepted values: `top(-start, -end), right(-start, -end), bottom(-start, -right),
	     *      left(-start, -end)`
	     *
	     * @param {HTMLElement|String} [options.arrowElement='[x-arrow]']
	     *      The DOM Node used as arrow for the popper, or a CSS selector used to get the DOM node. It must be child of
	     *      its parent Popper. Popper.js will apply to the given element the style required to align the arrow with its
	     *      reference element.
	     *      By default, it will look for a child node of the popper with the `x-arrow` attribute.
	     *
	     * @param {Boolean} [options.gpuAcceleration=true]
	     *      When this property is set to true, the popper position will be applied using CSS3 translate3d, allowing the
	     *      browser to use the GPU to accelerate the rendering.
	     *      If set to false, the popper will be placed using `top` and `left` properties, not using the GPU.
	     *
	     * @param {Number} [options.offset=0]
	     *      Amount of pixels the popper will be shifted (can be negative).
	     *
	     * @param {String|Element} [options.boundariesElement='viewport']
	     *      The element which will define the boundaries of the popper position, the popper will never be placed outside
	     *      of the defined boundaries (except if `keepTogether` is enabled)
	     *
	     * @param {Number} [options.boundariesPadding=5]
	     *      Additional padding for the boundaries
	     *
	     * @param {Array} [options.preventOverflowOrder=['left', 'right', 'top', 'bottom']]
	     *      Order used when Popper.js tries to avoid overflows from the boundaries, they will be checked in order,
	     *      this means that the last ones will never overflow
	     *
	     * @param {String|Array} [options.flipBehavior='flip']
	     *      The behavior used by the `flip` modifier to change the placement of the popper when the latter is trying to
	     *      overlap its reference element. Defining `flip` as value, the placement will be flipped on
	     *      its axis (`right - left`, `top - bottom`).
	     *      You can even pass an array of placements (eg: `['right', 'left', 'top']` ) to manually specify
	     *      how alter the placement when a flip is needed. (eg. in the above example, it would first flip from right to left,
	     *      then, if even in its new placement, the popper is overlapping its reference element, it will be moved to top)
	     *
	     * @param {Array} [options.modifiers=[ 'shift', 'offset', 'preventOverflow', 'keepTogether', 'arrow', 'flip', 'applyStyle']]
	     *      List of functions used to modify the data before they are applied to the popper, add your custom functions
	     *      to this array to edit the offsets and placement.
	     *      The function should reflect the @params and @returns of preventOverflow
	     *
	     * @param {Array} [options.modifiersIgnored=[]]
	     *      Put here any built-in modifier name you want to exclude from the modifiers list
	     *      The function should reflect the @params and @returns of preventOverflow
	     *
	     * @param {Boolean} [options.removeOnDestroy=false]
	     *      Set to true if you want to automatically remove the popper when you call the `destroy` method.
	     */
	    function Popper(reference, popper, options) {
	        this._reference = reference.jquery ? reference[0] : reference;
	        this.state = {};

	        // if the popper variable is a configuration object, parse it to generate an HTMLElement
	        // generate a default popper if is not defined
	        var isNotDefined = typeof popper === 'undefined' || popper === null;
	        var isConfig = popper && Object.prototype.toString.call(popper) === '[object Object]';
	        if (isNotDefined || isConfig) {
	            this._popper = this.parse(isConfig ? popper : {});
	        }
	        // otherwise, use the given HTMLElement as popper
	        else {
	            this._popper = popper.jquery ? popper[0] : popper;
	        }

	        // with {} we create a new object with the options inside it
	        this._options = Object.assign({}, DEFAULTS, options);

	        // refactoring modifiers' list
	        this._options.modifiers = this._options.modifiers.map(function(modifier){
	            // remove ignored modifiers
	            if (this._options.modifiersIgnored.indexOf(modifier) !== -1) return;

	            // set the x-placement attribute before everything else because it could be used to add margins to the popper
	            // margins needs to be calculated to get the correct popper offsets
	            if (modifier === 'applyStyle') {
	                this._popper.setAttribute('x-placement', this._options.placement);
	            }

	            // return predefined modifier identified by string or keep the custom one
	            return this.modifiers[modifier] || modifier;
	        }.bind(this));

	        // make sure to apply the popper position before any computation
	        this.state.position = this._getPosition(this._popper, this._reference);
	        setStyle(this._popper, { position: this.state.position});

	        // fire the first update to position the popper in the right place
	        this.update();

	        // setup event listeners, they will take care of update the position in specific situations
	        this._setupEventListeners();
	        return this;
	    }


	    //
	    // Methods
	    //
	    /**
	     * Destroy the popper
	     * @method
	     * @memberof Popper
	     */
	    Popper.prototype.destroy = function() {
	        this._popper.removeAttribute('x-placement');
	        this._popper.style.left = '';
	        this._popper.style.position = '';
	        this._popper.style.top = '';
	        this._popper.style[getSupportedPropertyName('transform')] = '';
	        this._removeEventListeners();

	        // remove the popper if user explicity asked for the deletion on destroy
	        if (this._options.removeOnDestroy) {
	            this._popper.remove();
	        }
	        return this;
	    };

	    /**
	     * Updates the position of the popper, computing the new offsets and applying the new style
	     * @method
	     * @memberof Popper
	     */
	    Popper.prototype.update = function() {
	        var data = { instance: this, styles: {} };

	        // store placement inside the data object, modifiers will be able to edit `placement` if needed
	        // and refer to _originalPlacement to know the original value
	        data.placement = this._options.placement;
	        data._originalPlacement = this._options.placement;

	        // compute the popper and reference offsets and put them inside data.offsets
	        data.offsets = this._getOffsets(this._popper, this._reference, data.placement);

	        // get boundaries
	        data.boundaries = this._getBoundaries(data, this._options.boundariesPadding, this._options.boundariesElement);

	        data = this.runModifiers(data, this._options.modifiers);

	        if (typeof this.state.updateCallback === 'function') {
	            this.state.updateCallback(data);
	        }

	    };

	    /**
	     * If a function is passed, it will be executed after the initialization of popper with as first argument the Popper instance.
	     * @method
	     * @memberof Popper
	     * @param {Function} callback
	     */
	    Popper.prototype.onCreate = function(callback) {
	        // the createCallbacks return as first argument the popper instance
	        callback(this);
	        return this;
	    };

	    /**
	     * If a function is passed, it will be executed after each update of popper with as first argument the set of coordinates and informations
	     * used to style popper and its arrow.
	     * NOTE: it doesn't get fired on the first call of the `Popper.update()` method inside the `Popper` constructor!
	     * @method
	     * @memberof Popper
	     * @param {Function} callback
	     */
	    Popper.prototype.onUpdate = function(callback) {
	        this.state.updateCallback = callback;
	        return this;
	    };

	    /**
	     * Helper used to generate poppers from a configuration file
	     * @method
	     * @memberof Popper
	     * @param config {Object} configuration
	     * @returns {HTMLElement} popper
	     */
	    Popper.prototype.parse = function(config) {
	        var defaultConfig = {
	            tagName: 'div',
	            classNames: [ 'popper' ],
	            attributes: [],
	            parent: root.document.body,
	            content: '',
	            contentType: 'text',
	            arrowTagName: 'div',
	            arrowClassNames: [ 'popper__arrow' ],
	            arrowAttributes: [ 'x-arrow']
	        };
	        config = Object.assign({}, defaultConfig, config);

	        var d = root.document;

	        var popper = d.createElement(config.tagName);
	        addClassNames(popper, config.classNames);
	        addAttributes(popper, config.attributes);
	        if (config.contentType === 'node') {
	            popper.appendChild(config.content.jquery ? config.content[0] : config.content);
	        }else if (config.contentType === 'html') {
	            popper.innerHTML = config.content;
	        } else {
	            popper.textContent = config.content;
	        }

	        if (config.arrowTagName) {
	            var arrow = d.createElement(config.arrowTagName);
	            addClassNames(arrow, config.arrowClassNames);
	            addAttributes(arrow, config.arrowAttributes);
	            popper.appendChild(arrow);
	        }

	        var parent = config.parent.jquery ? config.parent[0] : config.parent;

	        // if the given parent is a string, use it to match an element
	        // if more than one element is matched, the first one will be used as parent
	        // if no elements are matched, the script will throw an error
	        if (typeof parent === 'string') {
	            parent = d.querySelectorAll(config.parent);
	            if (parent.length > 1) {
	                console.warn('WARNING: the given `parent` query(' + config.parent + ') matched more than one element, the first one will be used');
	            }
	            if (parent.length === 0) {
	                throw 'ERROR: the given `parent` doesn\'t exists!';
	            }
	            parent = parent[0];
	        }
	        // if the given parent is a DOM nodes list or an array of nodes with more than one element,
	        // the first one will be used as parent
	        if (parent.length > 1 && parent instanceof Element === false) {
	            console.warn('WARNING: you have passed as parent a list of elements, the first one will be used');
	            parent = parent[0];
	        }

	        // append the generated popper to its parent
	        parent.appendChild(popper);

	        return popper;

	        /**
	         * Adds class names to the given element
	         * @function
	         * @ignore
	         * @param {HTMLElement} target
	         * @param {Array} classes
	         */
	        function addClassNames(element, classNames) {
	            classNames.forEach(function(className) {
	                element.classList.add(className);
	            });
	        }

	        /**
	         * Adds attributes to the given element
	         * @function
	         * @ignore
	         * @param {HTMLElement} target
	         * @param {Array} attributes
	         * @example
	         * addAttributes(element, [ 'data-info:foobar' ]);
	         */
	        function addAttributes(element, attributes) {
	            attributes.forEach(function(attribute) {
	                element.setAttribute(attribute.split(':')[0], attribute.split(':')[1] || '');
	            });
	        }

	    };

	    /**
	     * Helper used to get the position which will be applied to the popper
	     * @method
	     * @memberof Popper
	     * @param config {HTMLElement} popper element
	     * @returns {HTMLElement} reference element
	     */
	    Popper.prototype._getPosition = function(popper, reference) {
	        var container = getOffsetParent(reference);

	        if (this._options.forceAbsolute) {
	            return 'absolute';
	        }

	        // Decide if the popper will be fixed
	        // If the reference element is inside a fixed context, the popper will be fixed as well to allow them to scroll together
	        var isParentFixed = isFixed(reference, container);
	        return isParentFixed ? 'fixed' : 'absolute';
	    };

	    /**
	     * Get offsets to the popper
	     * @method
	     * @memberof Popper
	     * @access private
	     * @param {Element} popper - the popper element
	     * @param {Element} reference - the reference element (the popper will be relative to this)
	     * @returns {Object} An object containing the offsets which will be applied to the popper
	     */
	    Popper.prototype._getOffsets = function(popper, reference, placement) {
	        placement = placement.split('-')[0];
	        var popperOffsets = {};

	        popperOffsets.position = this.state.position;
	        var isParentFixed = popperOffsets.position === 'fixed';

	        //
	        // Get reference element position
	        //
	        var referenceOffsets = getOffsetRectRelativeToCustomParent(reference, getOffsetParent(popper), isParentFixed);

	        //
	        // Get popper sizes
	        //
	        var popperRect = getOuterSizes(popper);

	        //
	        // Compute offsets of popper
	        //

	        // depending by the popper placement we have to compute its offsets slightly differently
	        if (['right', 'left'].indexOf(placement) !== -1) {
	            popperOffsets.top = referenceOffsets.top + referenceOffsets.height / 2 - popperRect.height / 2;
	            if (placement === 'left') {
	                popperOffsets.left = referenceOffsets.left - popperRect.width;
	            } else {
	                popperOffsets.left = referenceOffsets.right;
	            }
	        } else {
	            popperOffsets.left = referenceOffsets.left + referenceOffsets.width / 2 - popperRect.width / 2;
	            if (placement === 'top') {
	                popperOffsets.top = referenceOffsets.top - popperRect.height;
	            } else {
	                popperOffsets.top = referenceOffsets.bottom;
	            }
	        }

	        // Add width and height to our offsets object
	        popperOffsets.width   = popperRect.width;
	        popperOffsets.height  = popperRect.height;


	        return {
	            popper: popperOffsets,
	            reference: referenceOffsets
	        };
	    };


	    /**
	     * Setup needed event listeners used to update the popper position
	     * @method
	     * @memberof Popper
	     * @access private
	     */
	    Popper.prototype._setupEventListeners = function() {
	        // NOTE: 1 DOM access here
	        this.state.updateBound = this.update.bind(this);
	        root.addEventListener('resize', this.state.updateBound);
	        // if the boundariesElement is window we don't need to listen for the scroll event
	        if (this._options.boundariesElement !== 'window') {
	            var target = getScrollParent(this._reference);
	            // here it could be both `body` or `documentElement` thanks to Firefox, we then check both
	            if (target === root.document.body || target === root.document.documentElement) {
	                target = root;
	            }
	            target.addEventListener('scroll', this.state.updateBound);
	        }
	    };

	    /**
	     * Remove event listeners used to update the popper position
	     * @method
	     * @memberof Popper
	     * @access private
	     */
	    Popper.prototype._removeEventListeners = function() {
	        // NOTE: 1 DOM access here
	        root.removeEventListener('resize', this.state.updateBound);
	        if (this._options.boundariesElement !== 'window') {
	            var target = getScrollParent(this._reference);
	            // here it could be both `body` or `documentElement` thanks to Firefox, we then check both
	            if (target === root.document.body || target === root.document.documentElement) {
	                target = root;
	            }
	            target.removeEventListener('scroll', this.state.updateBound);
	        }
	        this.state.updateBound = null;
	    };

	    /**
	     * Computed the boundaries limits and return them
	     * @method
	     * @memberof Popper
	     * @access private
	     * @param {Object} data - Object containing the property "offsets" generated by `_getOffsets`
	     * @param {Number} padding - Boundaries padding
	     * @param {Element} boundariesElement - Element used to define the boundaries
	     * @returns {Object} Coordinates of the boundaries
	     */
	    Popper.prototype._getBoundaries = function(data, padding, boundariesElement) {
	        // NOTE: 1 DOM access here
	        var boundaries = {};
	        var width, height;
	        if (boundariesElement === 'window') {
	            var body = root.document.body,
	                html = root.document.documentElement;

	            height = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
	            width = Math.max( body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth );

	            boundaries = {
	                top: 0,
	                right: width,
	                bottom: height,
	                left: 0
	            };
	        } else if (boundariesElement === 'viewport') {
	            var offsetParent = getOffsetParent(this._popper);
	            var scrollParent = getScrollParent(this._popper);
	            var offsetParentRect = getOffsetRect(offsetParent);

	            // if the popper is fixed we don't have to substract scrolling from the boundaries
	            var scrollTop = data.offsets.popper.position === 'fixed' ? 0 : scrollParent.scrollTop;
	            var scrollLeft = data.offsets.popper.position === 'fixed' ? 0 : scrollParent.scrollLeft;

	            boundaries = {
	                top: 0 - (offsetParentRect.top - scrollTop),
	                right: root.document.documentElement.clientWidth - (offsetParentRect.left - scrollLeft),
	                bottom: root.document.documentElement.clientHeight - (offsetParentRect.top - scrollTop),
	                left: 0 - (offsetParentRect.left - scrollLeft)
	            };
	        } else {
	            if (getOffsetParent(this._popper) === boundariesElement) {
	                boundaries = {
	                    top: 0,
	                    left: 0,
	                    right: boundariesElement.clientWidth,
	                    bottom: boundariesElement.clientHeight
	                };
	            } else {
	                boundaries = getOffsetRect(boundariesElement);
	            }
	        }
	        boundaries.left += padding;
	        boundaries.right -= padding;
	        boundaries.top = boundaries.top + padding;
	        boundaries.bottom = boundaries.bottom - padding;
	        return boundaries;
	    };


	    /**
	     * Loop trough the list of modifiers and run them in order, each of them will then edit the data object
	     * @method
	     * @memberof Popper
	     * @access public
	     * @param {Object} data
	     * @param {Array} modifiers
	     * @param {Function} ends
	     */
	    Popper.prototype.runModifiers = function(data, modifiers, ends) {
	        var modifiersToRun = modifiers.slice();
	        if (ends !== undefined) {
	            modifiersToRun = this._options.modifiers.slice(0, getArrayKeyIndex(this._options.modifiers, ends));
	        }

	        modifiersToRun.forEach(function(modifier) {
	            if (isFunction(modifier)) {
	                data = modifier.call(this, data);
	            }
	        }.bind(this));

	        return data;
	    };

	    /**
	     * Helper used to know if the given modifier depends from another one.
	     * @method
	     * @memberof Popper
	     * @returns {Boolean}
	     */

	    Popper.prototype.isModifierRequired = function(requesting, requested) {
	        var index = getArrayKeyIndex(this._options.modifiers, requesting);
	        return !!this._options.modifiers.slice(0, index).filter(function(modifier) {
	            return modifier === requested;
	        }).length;
	    };

	    //
	    // Modifiers
	    //

	    /**
	     * Modifiers list
	     * @namespace Popper.modifiers
	     * @memberof Popper
	     * @type {Object}
	     */
	    Popper.prototype.modifiers = {};

	    /**
	     * Apply the computed styles to the popper element
	     * @method
	     * @memberof Popper.modifiers
	     * @argument {Object} data - The data object generated by `update` method
	     * @returns {Object} The same data object
	     */
	    Popper.prototype.modifiers.applyStyle = function(data) {
	        // apply the final offsets to the popper
	        // NOTE: 1 DOM access here
	        var styles = {
	            position: data.offsets.popper.position
	        };

	        // round top and left to avoid blurry text
	        var left = Math.round(data.offsets.popper.left);
	        var top = Math.round(data.offsets.popper.top);

	        // if gpuAcceleration is set to true and transform is supported, we use `translate3d` to apply the position to the popper
	        // we automatically use the supported prefixed version if needed
	        var prefixedProperty;
	        if (this._options.gpuAcceleration && (prefixedProperty = getSupportedPropertyName('transform'))) {
	            styles[prefixedProperty] = 'translate3d(' + left + 'px, ' + top + 'px, 0)';
	            styles.top = 0;
	            styles.left = 0;
	        }
	        // othwerise, we use the standard `left` and `top` properties
	        else {
	            styles.left =left;
	            styles.top = top;
	        }

	        // any property present in `data.styles` will be applied to the popper,
	        // in this way we can make the 3rd party modifiers add custom styles to it
	        // Be aware, modifiers could override the properties defined in the previous
	        // lines of this modifier!
	        Object.assign(styles, data.styles);

	        setStyle(this._popper, styles);

	        // set an attribute which will be useful to style the tooltip (use it to properly position its arrow)
	        // NOTE: 1 DOM access here
	        this._popper.setAttribute('x-placement', data.placement);

	        // if the arrow modifier is required and the arrow style has been computed, apply the arrow style
	        if (this.isModifierRequired(this.modifiers.applyStyle, this.modifiers.arrow) && data.offsets.arrow) {
	            setStyle(data.arrowElement, data.offsets.arrow);
	        }

	        return data;
	    };

	    /**
	     * Modifier used to shift the popper on the start or end of its reference element side
	     * @method
	     * @memberof Popper.modifiers
	     * @argument {Object} data - The data object generated by `update` method
	     * @returns {Object} The data object, properly modified
	     */
	    Popper.prototype.modifiers.shift = function(data) {
	        var placement = data.placement;
	        var basePlacement = placement.split('-')[0];
	        var shiftVariation = placement.split('-')[1];

	        // if shift shiftVariation is specified, run the modifier
	        if (shiftVariation) {
	            var reference = data.offsets.reference;
	            var popper = getPopperClientRect(data.offsets.popper);

	            var shiftOffsets = {
	                y: {
	                    start:  { top: reference.top },
	                    end:    { top: reference.top + reference.height - popper.height }
	                },
	                x: {
	                    start:  { left: reference.left },
	                    end:    { left: reference.left + reference.width - popper.width }
	                }
	            };

	            var axis = ['bottom', 'top'].indexOf(basePlacement) !== -1 ? 'x' : 'y';

	            data.offsets.popper = Object.assign(popper, shiftOffsets[axis][shiftVariation]);
	        }

	        return data;
	    };


	    /**
	     * Modifier used to make sure the popper does not overflows from it's boundaries
	     * @method
	     * @memberof Popper.modifiers
	     * @argument {Object} data - The data object generated by `update` method
	     * @returns {Object} The data object, properly modified
	     */
	    Popper.prototype.modifiers.preventOverflow = function(data) {
	        var order = this._options.preventOverflowOrder;
	        var popper = getPopperClientRect(data.offsets.popper);

	        var check = {
	            left: function() {
	                var left = popper.left;
	                if (popper.left < data.boundaries.left) {
	                    left = Math.max(popper.left, data.boundaries.left);
	                }
	                return { left: left };
	            },
	            right: function() {
	                var left = popper.left;
	                if (popper.right > data.boundaries.right) {
	                    left = Math.min(popper.left, data.boundaries.right - popper.width);
	                }
	                return { left: left };
	            },
	            top: function() {
	                var top = popper.top;
	                if (popper.top < data.boundaries.top) {
	                    top = Math.max(popper.top, data.boundaries.top);
	                }
	                return { top: top };
	            },
	            bottom: function() {
	                var top = popper.top;
	                if (popper.bottom > data.boundaries.bottom) {
	                    top = Math.min(popper.top, data.boundaries.bottom - popper.height);
	                }
	                return { top: top };
	            }
	        };

	        order.forEach(function(direction) {
	            data.offsets.popper = Object.assign(popper, check[direction]());
	        });

	        return data;
	    };

	    /**
	     * Modifier used to make sure the popper is always near its reference
	     * @method
	     * @memberof Popper.modifiers
	     * @argument {Object} data - The data object generated by _update method
	     * @returns {Object} The data object, properly modified
	     */
	    Popper.prototype.modifiers.keepTogether = function(data) {
	        var popper  = getPopperClientRect(data.offsets.popper);
	        var reference = data.offsets.reference;
	        var f = Math.floor;

	        if (popper.right < f(reference.left)) {
	            data.offsets.popper.left = f(reference.left) - popper.width;
	        }
	        if (popper.left > f(reference.right)) {
	            data.offsets.popper.left = f(reference.right);
	        }
	        if (popper.bottom < f(reference.top)) {
	            data.offsets.popper.top = f(reference.top) - popper.height;
	        }
	        if (popper.top > f(reference.bottom)) {
	            data.offsets.popper.top = f(reference.bottom);
	        }

	        return data;
	    };

	    /**
	     * Modifier used to flip the placement of the popper when the latter is starting overlapping its reference element.
	     * Requires the `preventOverflow` modifier before it in order to work.
	     * **NOTE:** This modifier will run all its previous modifiers everytime it tries to flip the popper!
	     * @method
	     * @memberof Popper.modifiers
	     * @argument {Object} data - The data object generated by _update method
	     * @returns {Object} The data object, properly modified
	     */
	    Popper.prototype.modifiers.flip = function(data) {
	        // check if preventOverflow is in the list of modifiers before the flip modifier.
	        // otherwise flip would not work as expected.
	        if (!this.isModifierRequired(this.modifiers.flip, this.modifiers.preventOverflow)) {
	            console.warn('WARNING: preventOverflow modifier is required by flip modifier in order to work, be sure to include it before flip!');
	            return data;
	        }

	        if (data.flipped && data.placement === data._originalPlacement) {
	            // seems like flip is trying to loop, probably there's not enough space on any of the flippable sides
	            return data;
	        }

	        var placement = data.placement.split('-')[0];
	        var placementOpposite = getOppositePlacement(placement);
	        var variation = data.placement.split('-')[1] || '';

	        var flipOrder = [];
	        if(this._options.flipBehavior === 'flip') {
	            flipOrder = [
	                placement,
	                placementOpposite
	            ];
	        } else {
	            flipOrder = this._options.flipBehavior;
	        }

	        flipOrder.forEach(function(step, index) {
	            if (placement !== step || flipOrder.length === index + 1) {
	                return;
	            }

	            placement = data.placement.split('-')[0];
	            placementOpposite = getOppositePlacement(placement);

	            var popperOffsets = getPopperClientRect(data.offsets.popper);

	            // this boolean is used to distinguish right and bottom from top and left
	            // they need different computations to get flipped
	            var a = ['right', 'bottom'].indexOf(placement) !== -1;

	            // using Math.floor because the reference offsets may contain decimals we are not going to consider here
	            if (
	                a && Math.floor(data.offsets.reference[placement]) > Math.floor(popperOffsets[placementOpposite]) ||
	                !a && Math.floor(data.offsets.reference[placement]) < Math.floor(popperOffsets[placementOpposite])
	            ) {
	                // we'll use this boolean to detect any flip loop
	                data.flipped = true;
	                data.placement = flipOrder[index + 1];
	                if (variation) {
	                    data.placement += '-' + variation;
	                }
	                data.offsets.popper = this._getOffsets(this._popper, this._reference, data.placement).popper;

	                data = this.runModifiers(data, this._options.modifiers, this._flip);
	            }
	        }.bind(this));
	        return data;
	    };

	    /**
	     * Modifier used to add an offset to the popper, useful if you more granularity positioning your popper.
	     * The offsets will shift the popper on the side of its reference element.
	     * @method
	     * @memberof Popper.modifiers
	     * @argument {Object} data - The data object generated by _update method
	     * @returns {Object} The data object, properly modified
	     */
	    Popper.prototype.modifiers.offset = function(data) {
	        var offset = this._options.offset;
	        var popper  = data.offsets.popper;

	        if (data.placement.indexOf('left') !== -1) {
	            popper.top -= offset;
	        }
	        else if (data.placement.indexOf('right') !== -1) {
	            popper.top += offset;
	        }
	        else if (data.placement.indexOf('top') !== -1) {
	            popper.left -= offset;
	        }
	        else if (data.placement.indexOf('bottom') !== -1) {
	            popper.left += offset;
	        }
	        return data;
	    };

	    /**
	     * Modifier used to move the arrows on the edge of the popper to make sure them are always between the popper and the reference element
	     * It will use the CSS outer size of the arrow element to know how many pixels of conjuction are needed
	     * @method
	     * @memberof Popper.modifiers
	     * @argument {Object} data - The data object generated by _update method
	     * @returns {Object} The data object, properly modified
	     */
	    Popper.prototype.modifiers.arrow = function(data) {
	        var arrow  = this._options.arrowElement;

	        // if the arrowElement is a string, suppose it's a CSS selector
	        if (typeof arrow === 'string') {
	            arrow = this._popper.querySelector(arrow);
	        }

	        // if arrow element is not found, don't run the modifier
	        if (!arrow) {
	            return data;
	        }

	        // the arrow element must be child of its popper
	        if (!this._popper.contains(arrow)) {
	            console.warn('WARNING: `arrowElement` must be child of its popper element!');
	            return data;
	        }

	        // arrow depends on keepTogether in order to work
	        if (!this.isModifierRequired(this.modifiers.arrow, this.modifiers.keepTogether)) {
	            console.warn('WARNING: keepTogether modifier is required by arrow modifier in order to work, be sure to include it before arrow!');
	            return data;
	        }

	        var arrowStyle  = {};
	        var placement   = data.placement.split('-')[0];
	        var popper      = getPopperClientRect(data.offsets.popper);
	        var reference   = data.offsets.reference;
	        var isVertical  = ['left', 'right'].indexOf(placement) !== -1;

	        var len         = isVertical ? 'height' : 'width';
	        var side        = isVertical ? 'top' : 'left';
	        var altSide     = isVertical ? 'left' : 'top';
	        var opSide      = isVertical ? 'bottom' : 'right';
	        var arrowSize   = getOuterSizes(arrow)[len];

	        //
	        // extends keepTogether behavior making sure the popper and its reference have enough pixels in conjuction
	        //

	        // top/left side
	        if (reference[opSide] - arrowSize < popper[side]) {
	            data.offsets.popper[side] -= popper[side] - (reference[opSide] - arrowSize);
	        }
	        // bottom/right side
	        if (reference[side] + arrowSize > popper[opSide]) {
	            data.offsets.popper[side] += (reference[side] + arrowSize) - popper[opSide];
	        }

	        // compute center of the popper
	        var center = reference[side] + (reference[len] / 2) - (arrowSize / 2);

	        var sideValue = center - popper[side];

	        // prevent arrow from being placed not contiguously to its popper
	        sideValue = Math.max(Math.min(popper[len] - arrowSize, sideValue), 0);
	        arrowStyle[side] = sideValue;
	        arrowStyle[altSide] = ''; // make sure to remove any old style from the arrow

	        data.offsets.arrow = arrowStyle;
	        data.arrowElement = arrow;

	        return data;
	    };


	    //
	    // Helpers
	    //

	    /**
	     * Get the outer sizes of the given element (offset size + margins)
	     * @function
	     * @ignore
	     * @argument {Element} element
	     * @returns {Object} object containing width and height properties
	     */
	    function getOuterSizes(element) {
	        // NOTE: 1 DOM access here
	        var _display = element.style.display, _visibility = element.style.visibility;
	        element.style.display = 'block'; element.style.visibility = 'hidden';
	        var calcWidthToForceRepaint = element.offsetWidth;

	        // original method
	        var styles = root.getComputedStyle(element);
	        var x = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);
	        var y = parseFloat(styles.marginLeft) + parseFloat(styles.marginRight);
	        var result = { width: element.offsetWidth + y, height: element.offsetHeight + x };

	        // reset element styles
	        element.style.display = _display; element.style.visibility = _visibility;
	        return result;
	    }

	    /**
	     * Get the opposite placement of the given one/
	     * @function
	     * @ignore
	     * @argument {String} placement
	     * @returns {String} flipped placement
	     */
	    function getOppositePlacement(placement) {
	        var hash = {left: 'right', right: 'left', bottom: 'top', top: 'bottom' };
	        return placement.replace(/left|right|bottom|top/g, function(matched){
	            return hash[matched];
	        });
	    }

	    /**
	     * Given the popper offsets, generate an output similar to getBoundingClientRect
	     * @function
	     * @ignore
	     * @argument {Object} popperOffsets
	     * @returns {Object} ClientRect like output
	     */
	    function getPopperClientRect(popperOffsets) {
	        var offsets = Object.assign({}, popperOffsets);
	        offsets.right = offsets.left + offsets.width;
	        offsets.bottom = offsets.top + offsets.height;
	        return offsets;
	    }

	    /**
	     * Given an array and the key to find, returns its index
	     * @function
	     * @ignore
	     * @argument {Array} arr
	     * @argument keyToFind
	     * @returns index or null
	     */
	    function getArrayKeyIndex(arr, keyToFind) {
	        var i = 0, key;
	        for (key in arr) {
	            if (arr[key] === keyToFind) {
	                return i;
	            }
	            i++;
	        }
	        return null;
	    }

	    /**
	     * Get CSS computed property of the given element
	     * @function
	     * @ignore
	     * @argument {Eement} element
	     * @argument {String} property
	     */
	    function getStyleComputedProperty(element, property) {
	        // NOTE: 1 DOM access here
	        var css = root.getComputedStyle(element, null);
	        return css[property];
	    }

	    /**
	     * Returns the offset parent of the given element
	     * @function
	     * @ignore
	     * @argument {Element} element
	     * @returns {Element} offset parent
	     */
	    function getOffsetParent(element) {
	        // NOTE: 1 DOM access here
	        var offsetParent = element.offsetParent;
	        return offsetParent === root.document.body || !offsetParent ? root.document.documentElement : offsetParent;
	    }

	    /**
	     * Returns the scrolling parent of the given element
	     * @function
	     * @ignore
	     * @argument {Element} element
	     * @returns {Element} offset parent
	     */
	    function getScrollParent(element) {
	        if (element === root.document) {
	            // Firefox puts the scrollTOp value on `documentElement` instead of `body`, we then check which of them is
	            // greater than 0 and return the proper element
	            if (root.document.body.scrollTop) {
	                return root.document.body;
	            } else {
	                return root.document.documentElement;
	            }
	        }

	        // Firefox want us to check `-x` and `-y` variations as well
	        if (
	            ['scroll', 'auto'].indexOf(getStyleComputedProperty(element, 'overflow')) !== -1 ||
	            ['scroll', 'auto'].indexOf(getStyleComputedProperty(element, 'overflow-x')) !== -1 ||
	            ['scroll', 'auto'].indexOf(getStyleComputedProperty(element, 'overflow-y')) !== -1
	        ) {
	            // If the detected scrollParent is body, we perform an additional check on its parentNode
	            // in this way we'll get body if the browser is Chrome-ish, or documentElement otherwise
	            // fixes issue #65
	            return element === root.document.body ? getScrollParent(element.parentNode) : element;
	        }
	        return element.parentNode ? getScrollParent(element.parentNode) : element;
	    }

	    /**
	     * Check if the given element is fixed or is inside a fixed parent
	     * @function
	     * @ignore
	     * @argument {Element} element
	     * @argument {Element} customContainer
	     * @returns {Boolean} answer to "isFixed?"
	     */
	    function isFixed(element) {
	        if (element === root.document.body) {
	            return false;
	        }
	        if (getStyleComputedProperty(element, 'position') === 'fixed') {
	            return true;
	        }
	        return element.parentNode ? isFixed(element.parentNode) : element;
	    }

	    /**
	     * Set the style to the given popper
	     * @function
	     * @ignore
	     * @argument {Element} element - Element to apply the style to
	     * @argument {Object} styles - Object with a list of properties and values which will be applied to the element
	     */
	    function setStyle(element, styles) {
	        function is_numeric(n) {
	            return (n !== '' && !isNaN(parseFloat(n)) && isFinite(n));
	        }
	        Object.keys(styles).forEach(function(prop) {
	            var unit = '';
	            // add unit if the value is numeric and is one of the following
	            if (['width', 'height', 'top', 'right', 'bottom', 'left'].indexOf(prop) !== -1 && is_numeric(styles[prop])) {
	                unit = 'px';
	            }
	            element.style[prop] = styles[prop] + unit;
	        });
	    }

	    /**
	     * Check if the given variable is a function
	     * @function
	     * @ignore
	     * @argument {Element} element - Element to check
	     * @returns {Boolean} answer to: is a function?
	     */
	    function isFunction(functionToCheck) {
	        var getType = {};
	        return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
	    }

	    /**
	     * Get the position of the given element, relative to its offset parent
	     * @function
	     * @ignore
	     * @param {Element} element
	     * @return {Object} position - Coordinates of the element and its `scrollTop`
	     */
	    function getOffsetRect(element) {
	        var elementRect = {
	            width: element.offsetWidth,
	            height: element.offsetHeight,
	            left: element.offsetLeft,
	            top: element.offsetTop
	        };

	        elementRect.right = elementRect.left + elementRect.width;
	        elementRect.bottom = elementRect.top + elementRect.height;

	        // position
	        return elementRect;
	    }

	    /**
	     * Get bounding client rect of given element
	     * @function
	     * @ignore
	     * @param {HTMLElement} element
	     * @return {Object} client rect
	     */
	    function getBoundingClientRect(element) {
	        var rect = element.getBoundingClientRect();
	        return {
	            left: rect.left,
	            top: rect.top,
	            right: rect.right,
	            bottom: rect.bottom,
	            width: rect.right - rect.left,
	            height: rect.bottom - rect.top
	        };
	    }

	    /**
	     * Given an element and one of its parents, return the offset
	     * @function
	     * @ignore
	     * @param {HTMLElement} element
	     * @param {HTMLElement} parent
	     * @return {Object} rect
	     */
	    function getOffsetRectRelativeToCustomParent(element, parent, fixed) {
	        var elementRect = getBoundingClientRect(element);
	        var parentRect = getBoundingClientRect(parent);

	        if (fixed) {
	            var scrollParent = getScrollParent(parent);
	            parentRect.top += scrollParent.scrollTop;
	            parentRect.bottom += scrollParent.scrollTop;
	            parentRect.left += scrollParent.scrollLeft;
	            parentRect.right += scrollParent.scrollLeft;
	        }

	        var rect = {
	            top: elementRect.top - parentRect.top ,
	            left: elementRect.left - parentRect.left ,
	            bottom: (elementRect.top - parentRect.top) + elementRect.height,
	            right: (elementRect.left - parentRect.left) + elementRect.width,
	            width: elementRect.width,
	            height: elementRect.height
	        };
	        return rect;
	    }

	    /**
	     * Get the prefixed supported property name
	     * @function
	     * @ignore
	     * @argument {String} property (camelCase)
	     * @returns {String} prefixed property (camelCase)
	     */
	    function getSupportedPropertyName(property) {
	        var prefixes = ['', 'ms', 'webkit', 'moz', 'o'];

	        for (var i = 0; i < prefixes.length; i++) {
	            var toCheck = prefixes[i] ? prefixes[i] + property.charAt(0).toUpperCase() + property.slice(1) : property;
	            if (typeof root.document.body.style[toCheck] !== 'undefined') {
	                return toCheck;
	            }
	        }
	        return null;
	    }

	    /**
	     * The Object.assign() method is used to copy the values of all enumerable own properties from one or more source
	     * objects to a target object. It will return the target object.
	     * This polyfill doesn't support symbol properties, since ES5 doesn't have symbols anyway
	     * Source: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
	     * @function
	     * @ignore
	     */
	    if (!Object.assign) {
	        Object.defineProperty(Object, 'assign', {
	            enumerable: false,
	            configurable: true,
	            writable: true,
	            value: function(target) {
	                if (target === undefined || target === null) {
	                    throw new TypeError('Cannot convert first argument to object');
	                }

	                var to = Object(target);
	                for (var i = 1; i < arguments.length; i++) {
	                    var nextSource = arguments[i];
	                    if (nextSource === undefined || nextSource === null) {
	                        continue;
	                    }
	                    nextSource = Object(nextSource);

	                    var keysArray = Object.keys(nextSource);
	                    for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
	                        var nextKey = keysArray[nextIndex];
	                        var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
	                        if (desc !== undefined && desc.enumerable) {
	                            to[nextKey] = nextSource[nextKey];
	                        }
	                    }
	                }
	                return to;
	            }
	        });
	    }

	    return Popper;
	}));


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	!function(e,t){ true?module.exports=t(__webpack_require__(8)):"function"==typeof define&&define.amd?define("VuePopup",["vue"],t):"object"==typeof exports?exports.VuePopup=t(require("vue")):e.VuePopup=t(e.vue)}(this,function(e){return function(e){function t(n){if(o[n])return o[n].exports;var i=o[n]={i:n,l:!1,exports:{}};return e[n].call(i.exports,i,i.exports,t),i.l=!0,i.exports}var o={};return t.m=e,t.c=o,t.i=function(e){return e},t.d=function(e,t,o){Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:o})},t.n=function(e){var o=e&&e.__esModule?function(){return e["default"]}:function(){return e};return t.d(o,"a",o),o},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="/lib/",t(t.s=6)}([function(e,t,o){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0}),t.PopupManager=void 0;var i=o(5),l=n(i),s=o(3),d=o(2),a=n(d);o(4);var r=1,u=[],c=function(e){if(u.indexOf(e)===-1){var t=function(e){var t=e.__vue__;if(!t){var o=e.previousSibling;o.__vue__&&(t=o.__vue__)}return t};l["default"].transition(e,{afterEnter:function(e){var o=t(e);o&&o.doAfterOpen&&o.doAfterOpen()},afterLeave:function(e){var o=t(e);o&&o.doAfterClose&&o.doAfterClose()}})}},f=void 0,p=function(){if(void 0!==f)return f;var e=document.createElement("div");e.style.visibility="hidden",e.style.width="100px",e.style.position="absolute",e.style.top="-9999px",document.body.appendChild(e);var t=e.offsetWidth;e.style.overflow="scroll";var o=document.createElement("div");o.style.width="100%",e.appendChild(o);var n=o.offsetWidth;return e.parentNode.removeChild(e),t-n},h=function m(e){return 3===e.nodeType&&(e=e.nextElementSibling||e.nextSibling,m(e)),e};t["default"]={props:{value:{type:Boolean,"default":!1},transition:{type:String,"default":""},openDelay:{},closeDelay:{},zIndex:{},modal:{type:Boolean,"default":!1},modalFade:{type:Boolean,"default":!0},modalClass:{},lockScroll:{type:Boolean,"default":!0},closeOnPressEscape:{type:Boolean,"default":!1},closeOnClickModal:{type:Boolean,"default":!1}},created:function(){this.transition&&c(this.transition)},beforeMount:function(){this._popupId="popup-"+r++,a["default"].register(this._popupId,this)},beforeDestroy:function(){a["default"].deregister(this._popupId),a["default"].closeModal(this._popupId)},data:function(){return{opened:!1,bodyOverflow:null,bodyPaddingRight:null,rendered:!1}},watch:{value:function(e){var t=this;if(e){if(this._opening)return;this.rendered?this.open():(this.rendered=!0,l["default"].nextTick(function(){t.open()}))}else this.close()}},methods:{open:function(e){var t=this;if(!this.rendered)return this.rendered=!0,void this.$emit("input",!0);var o=(0,s.merge)({},this,e);this._closeTimer&&(clearTimeout(this._closeTimer),this._closeTimer=null),clearTimeout(this._openTimer);var n=Number(o.openDelay);n>0?this._openTimer=setTimeout(function(){t._openTimer=null,t.doOpen(o)},n):this.doOpen(o)},doOpen:function(e){if((!this.willOpen||this.willOpen())&&!this.opened){this._opening=!0,this.$emit("input",!0);var t=h(this.$el),o=e.modal,n=e.zIndex;n&&(a["default"].zIndex=n),o&&(this._closing&&(a["default"].closeModal(this._popupId),this._closing=!1),a["default"].openModal(this._popupId,a["default"].nextZIndex(),t,e.modalClass,e.modalFade),e.lockScroll&&(this.bodyOverflow||(this.bodyPaddingRight=document.body.style.paddingRight,this.bodyOverflow=document.body.style.overflow),f=p(),f>0&&(document.body.style.paddingRight=f+"px"),document.body.style.overflow="hidden")),"static"===getComputedStyle(t).position&&(t.style.position="absolute"),o?t.style.zIndex=a["default"].nextZIndex():n&&(t.style.zIndex=n),this.opened=!0,this.onOpen&&this.onOpen(),this.transition||this.doAfterOpen()}},doAfterOpen:function(){this._opening=!1},close:function(){var e=this;if(!this.willClose||this.willClose()){null!==this._openTimer&&(clearTimeout(this._openTimer),this._openTimer=null),clearTimeout(this._closeTimer);var t=Number(this.closeDelay);t>0?this._closeTimer=setTimeout(function(){e._closeTimer=null,e.doClose()},t):this.doClose()}},doClose:function(){var e=this;this.$emit("input",!1),this._closing=!0,this.onClose&&this.onClose(),this.lockScroll&&setTimeout(function(){e.modal&&"hidden"!==e.bodyOverflow&&(document.body.style.overflow=e.bodyOverflow,document.body.style.paddingRight=e.bodyPaddingRight),e.bodyOverflow=null,e.bodyPaddingRight=null},200),this.opened=!1,this.transition||this.doAfterClose()},doAfterClose:function(){a["default"].closeModal(this._popupId),this._closing=!1}}},t.PopupManager=a["default"]},function(e,t){var o=function(e){return(e||"").replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g,"")},n=function(e,t){if(!e||!t)return!1;if(t.indexOf(" ")!=-1)throw new Error("className should not contain space.");return e.classList?e.classList.contains(t):(" "+e.className+" ").indexOf(" "+t+" ")>-1},i=function(e,t){if(e){for(var o=e.className,i=(t||"").split(" "),l=0,s=i.length;l<s;l++){var d=i[l];d&&(e.classList?e.classList.add(d):n(e,d)||(o+=" "+d))}e.classList||(e.className=o)}},l=function(e,t){if(e&&t){for(var i=t.split(" "),l=" "+e.className+" ",s=0,d=i.length;s<d;s++){var a=i[s];a&&(e.classList?e.classList.remove(a):n(e,a)&&(l=l.replace(" "+a+" "," ")))}e.classList||(e.className=o(l))}};e.exports={hasClass:n,addClass:i,removeClass:l}},function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=o(1),i=function(){var e=s.modalDom;return e||(e=document.createElement("div"),s.modalDom=e,e.addEventListener("touchmove",function(e){e.preventDefault(),e.stopPropagation()}),e.addEventListener("click",function(){s.doOnModalClick&&s.doOnModalClick()})),e},l={},s={zIndex:1e3,modalFade:!0,getInstance:function(e){return l[e]},register:function(e,t){e&&t&&(l[e]=t)},deregister:function(e){e&&(l[e]=null,delete l[e])},nextZIndex:function(){return s.zIndex++},modalStack:[],doOnModalClick:function(){var e=s.modalStack[s.modalStack.length-1];if(e){var t=s.getInstance(e.id);t&&t.closeOnClickModal&&t.close()}},openModal:function(e,t,o,l,s){if(e&&void 0!==t){this.modalFade=s;for(var d=this.modalStack,a=0,r=d.length;a<r;a++){var u=d[a];if(u.id===e)return}var c=i();if((0,n.addClass)(c,"v-modal"),this.modalFade&&(0,n.addClass)(c,"v-modal-enter"),l){var f=l.trim().split(/\s+/);f.forEach(function(e){return(0,n.addClass)(c,e)})}setTimeout(function(){(0,n.removeClass)(c,"v-modal-enter")},200),o&&o.parentNode&&11!==o.parentNode.nodeType?o.parentNode.appendChild(c):document.body.appendChild(c),t&&(c.style.zIndex=t),c.style.display="",this.modalStack.push({id:e,zIndex:t,modalClass:l})}},closeModal:function(e){var t=this.modalStack,o=i();if(t.length>0){var l=t[t.length-1];if(l.id===e){if(l.modalClass){var s=l.modalClass.trim().split(/\s+/);s.forEach(function(e){return(0,n.removeClass)(o,e)})}t.pop(),t.length>0&&(o.style.zIndex=t[t.length-1].zIndex)}else for(var d=t.length-1;d>=0;d--)if(t[d].id===e){t.splice(d,1);break}}0===t.length&&(this.modalFade&&(0,n.addClass)(o,"v-modal-leave"),setTimeout(function(){0===t.length&&(o.parentNode&&o.parentNode.removeChild(o),o.style.display="none"),(0,n.removeClass)(o,"v-modal-leave")},200))}};window.addEventListener("keydown",function(e){if(27===e.keyCode&&s.modalStack.length>0){var t=s.modalStack[s.modalStack.length-1];if(!t)return;var o=s.getInstance(t.id);o.closeOnPressEscape&&o.close()}}),t["default"]=s},function(e,t){"use strict";function o(e){for(var t=1,o=arguments.length;t<o;t++){var n=arguments[t];for(var i in n)if(n.hasOwnProperty(i)){var l=n[i];void 0!==l&&(e[i]=l)}}return e}Object.defineProperty(t,"__esModule",{value:!0}),t.merge=o},function(e,t){},function(t,o){t.exports=e},function(e,t,o){e.exports=o(0)}])});

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = __webpack_require__(2);

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('div', {
	    staticClass: "el-select-dropdown",
	    class: {
	      'is-multiple': $parent.multiple
	    },
	    style: ({
	      minWidth: minWidth
	    })
	  }, [_t("default")])
	}},staticRenderFns: []}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Pagination = __webpack_require__(11);

	Pagination.install = function (Vue) {
	  Vue.component(Pagination.name, Pagination);
	};

	module.exports = Pagination;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _vue = __webpack_require__(8);

	var _vue2 = _interopRequireDefault(_vue);

	var _pager = __webpack_require__(12);

	var _pager2 = _interopRequireDefault(_pager);

	var _index = __webpack_require__(15);

	var _index2 = _interopRequireDefault(_index);

	var _index3 = __webpack_require__(34);

	var _index4 = _interopRequireDefault(_index3);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  name: 'ElPagination',

	  props: {
	    pageSize: {
	      type: Number,
	      default: 10
	    },

	    small: Boolean,

	    total: {
	      type: Number,
	      default: 0
	    },

	    currentPage: {
	      type: Number,
	      default: 1
	    },

	    layout: {
	      default: 'prev, pager, next, jumper, ->, total'
	    },

	    pageSizes: {
	      type: Array,
	      default: function _default() {
	        return [10, 20, 30, 40, 50, 100];
	      }
	    }
	  },

	  data: function data() {
	    return {
	      internalCurrentPage: 1,
	      internalPageSize: 0
	    };
	  },
	  render: function render(h) {
	    var template = h(
	      'div',
	      { 'class': 'el-pagination' },
	      []
	    );
	    var layout = this.$options.layout || this.layout || '';
	    var TEMPLATE_MAP = {
	      prev: h(
	        'prev',
	        null,
	        []
	      ),
	      jumper: h(
	        'jumper',
	        null,
	        []
	      ),
	      pager: h(
	        'pager',
	        {
	          attrs: { currentPage: this.internalCurrentPage, pageCount: this.pageCount },
	          on: {
	            currentchange: this.handleCurrentChange
	          }
	        },
	        []
	      ),
	      next: h(
	        'next',
	        null,
	        []
	      ),
	      sizes: h(
	        'sizes',
	        null,
	        []
	      ),
	      slot: h(
	        'slot',
	        null,
	        []
	      ),
	      total: h(
	        'total',
	        null,
	        []
	      )
	    };
	    var components = layout.split(',').map(function (item) {
	      return item.trim();
	    });
	    var rightWrapper = h(
	      'div',
	      { 'class': 'el-pagination__rightwrapper' },
	      []
	    );
	    var haveRightWrapper = false;

	    if (this.small) {
	      template.data.class += ' el-pagination--small';
	    }

	    components.forEach(function (compo) {
	      if (compo === '->') {
	        haveRightWrapper = true;
	        return;
	      }

	      if (!haveRightWrapper) {
	        template.children.push(TEMPLATE_MAP[compo]);
	      } else {
	        rightWrapper.children.push(TEMPLATE_MAP[compo]);
	      }
	    });

	    if (haveRightWrapper) {
	      template.children.push(rightWrapper);
	    }

	    return template;
	  },


	  components: {
	    Prev: {
	      render: function render(h) {
	        return h(
	          'button',
	          {
	            'class': ['btn-prev', { disabled: this.$parent.internalCurrentPage <= 1 }],
	            on: {
	              click: this.$parent.prev
	            }
	          },
	          [h(
	            'i',
	            { 'class': 'el-icon el-icon-arrow-left' },
	            []
	          )]
	        );
	      }
	    },

	    Next: {
	      render: function render(h) {
	        return h(
	          'button',
	          {
	            'class': ['btn-next', { disabled: this.$parent.internalCurrentPage === this.$parent.pageCount }],
	            on: {
	              click: this.$parent.next
	            }
	          },
	          [h(
	            'i',
	            { 'class': 'el-icon el-icon-arrow-right' },
	            []
	          )]
	        );
	      }
	    },

	    Sizes: {
	      created: function created() {
	        if (Array.isArray(this.$parent.pageSizes)) {
	          this.$parent.internalPageSize = this.$parent.pageSizes.indexOf(this.$parent.pageSize) > -1 ? this.$parent.pageSize : this.$parent.pageSizes[0];
	        }
	      },
	      render: function render(h) {
	        return h(
	          'span',
	          { 'class': 'el-pagination__sizes' },
	          [h(
	            'el-select',
	            {
	              attrs: {
	                size: 'small',
	                value: this.$parent.internalPageSize,

	                width: 110 },
	              on: {
	                change: this.handleChange
	              }
	            },
	            [this.$parent.pageSizes.map(function (item) {
	              return h(
	                'el-option',
	                {
	                  attrs: {
	                    value: item,
	                    label: item + ' 条/页' }
	                },
	                []
	              );
	            })]
	          )]
	        );
	      },


	      components: {
	        ElSelect: _index2.default,
	        ElOption: _index4.default
	      },

	      methods: {
	        handleChange: function handleChange(val) {
	          if (val !== this.$parent.internalPageSize) {
	            this.$parent.internalPageSize = val = parseInt(val, 10);
	            this.$parent.$emit('sizechange', val);
	          }
	        }
	      }
	    },

	    Jumper: {
	      data: function data() {
	        return {
	          oldValue: null
	        };
	      },


	      methods: {
	        handleFocus: function handleFocus(event) {
	          this.oldValue = event.target.value;
	        },
	        handleChange: function handleChange(_ref) {
	          var target = _ref.target;

	          this.$parent.internalCurrentPage = this.$parent.getValidCurrentPage(target.value);
	          this.$parent.$emit('currentchange', this.$parent.internalCurrentPage);
	          this.oldValue = null;
	        }
	      },

	      render: function render(h) {
	        return h(
	          'span',
	          { 'class': 'el-pagination__jump' },
	          ['前往', h(
	            'input',
	            {
	              'class': 'el-pagination__editor',
	              attrs: { type: 'number',
	                min: 1,
	                max: this.pageCount,

	                number: true },
	              domProps: {
	                value: this.$parent.internalCurrentPage
	              },
	              on: {
	                change: this.handleChange,
	                focus: this.handleFocus
	              },

	              style: { width: '30px' } },
	            []
	          ), '页']
	        );
	      }
	    },

	    Total: {
	      render: function render(h) {
	        return h(
	          'span',
	          { 'class': 'el-pagination__total' },
	          ['共 ', this.$parent.total, ' 条']
	        );
	      }
	    },

	    Pager: _pager2.default
	  },

	  methods: {
	    handleCurrentChange: function handleCurrentChange(val) {
	      this.internalCurrentPage = this.getValidCurrentPage(val);
	      this.$emit('currentchange', this.internalCurrentPage);
	    },
	    prev: function prev() {
	      var oldPage = this.internalCurrentPage;
	      var newVal = this.internalCurrentPage - 1;
	      this.internalCurrentPage = this.getValidCurrentPage(newVal);

	      if (this.internalCurrentPage !== oldPage) {
	        this.$emit('currentchange', this.internalCurrentPage);
	      }
	    },
	    next: function next() {
	      var oldPage = this.internalCurrentPage;
	      var newVal = this.internalCurrentPage + 1;
	      this.internalCurrentPage = this.getValidCurrentPage(newVal);

	      if (this.internalCurrentPage !== oldPage) {
	        this.$emit('currentchange', this.internalCurrentPage);
	      }
	    },
	    first: function first() {
	      var oldPage = this.internalCurrentPage;
	      var newVal = 1;
	      this.internalCurrentPage = this.getValidCurrentPage(newVal);

	      if (this.internalCurrentPage !== oldPage) {
	        this.$emit('currentchange', this.internalCurrentPage);
	      }
	    },
	    last: function last() {
	      var oldPage = this.internalCurrentPage;
	      var newVal = this.pageCount;
	      this.internalCurrentPage = this.getValidCurrentPage(newVal);

	      if (this.internalCurrentPage !== oldPage) {
	        this.$emit('currentchange', this.internalCurrentPage);
	      }
	    },
	    getValidCurrentPage: function getValidCurrentPage(value) {
	      value = parseInt(value, 10);

	      var resetValue;
	      if (value < 1) {
	        resetValue = this.pageCount > 0 ? 1 : 0;
	      } else if (value > this.pageCount) {
	        resetValue = this.pageCount;
	      }

	      if (resetValue === undefined && isNaN(value)) {
	        value = this.pageCount > 0 ? 1 : 0;
	      }

	      return resetValue === undefined ? value : resetValue;
	    }
	  },

	  computed: {
	    pageCount: function pageCount() {
	      return Math.ceil(this.total / this.internalPageSize);
	    },
	    startRecordIndex: function startRecordIndex() {
	      var result = (this.internalCurrentPage - 1) * this.internalPageSize + 1;
	      return result > 0 ? result : 0;
	    },
	    endRecordIndex: function endRecordIndex() {
	      var result = this.internalCurrentPage * this.internalPageSize;
	      return result > this.total ? this.total : result;
	    }
	  },

	  watch: {
	    pageCount: function pageCount(newVal) {
	      if (newVal > 0 && this.internalCurrentPage === 0) {
	        this.internalCurrentPage = 1;
	      } else if (this.internalCurrentPage > newVal) {
	        this.internalCurrentPage = newVal;
	      }
	    },


	    currentPage: {
	      immediate: true,
	      handler: function handler(val) {
	        this.internalCurrentPage = val;
	      }
	    },

	    pageSize: {
	      immediate: true,
	      handler: function handler(val) {
	        this.internalPageSize = val;
	      }
	    },

	    internalCurrentPage: function internalCurrentPage(newVal, oldVal) {
	      var _this = this;

	      newVal = parseInt(newVal, 10);

	      if (isNaN(newVal)) {
	        newVal = oldVal || 1;
	      } else {
	        newVal = this.getValidCurrentPage(newVal);
	      }

	      if (newVal !== undefined) {
	        _vue2.default.nextTick(function () {
	          _this.internalCurrentPage = newVal;
	        });
	      }
	    }
	  }
	};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(13)

	/* template */
	var __vue_template__ = __webpack_require__(14)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports.default = {
	  name: 'ElPager',

	  props: {
	    currentPage: Number,

	    pageCount: Number
	  },

	  watch: {
	    showPrevMore: function showPrevMore(val) {
	      if (!val) this.quickprevIconClass = 'el-icon-more';
	    },
	    showNextMore: function showNextMore(val) {
	      if (!val) this.quicknextIconClass = 'el-icon-more';
	    }
	  },

	  methods: {
	    onPagerClick: function onPagerClick(event) {
	      var target = event.target;
	      if (target.tagName === 'UL') {
	        return;
	      }

	      var newPage = Number(event.target.textContent);
	      var pageCount = this.pageCount;
	      var currentPage = this.currentPage;

	      if (target.className.indexOf('more') !== -1) {
	        if (target.className.indexOf('quickprev') !== -1) {
	          newPage = currentPage - 5;
	        } else if (target.className.indexOf('quicknext') !== -1) {
	          newPage = currentPage + 5;
	        }
	      }

	      if (!isNaN(newPage)) {
	        if (newPage < 1) {
	          newPage = 1;
	        }

	        if (newPage > pageCount) {
	          newPage = pageCount;
	        }
	      }

	      if (newPage !== currentPage) {
	        this.$emit('currentchange', newPage);
	      }
	    }
	  },

	  computed: {
	    pagers: function pagers() {
	      var pagerCount = 7;

	      var currentPage = Number(this.currentPage);
	      var pageCount = Number(this.pageCount);

	      var showPrevMore = false;
	      var showNextMore = false;

	      if (pageCount > pagerCount) {
	        if (currentPage > pagerCount - 2) {
	          showPrevMore = true;
	        }

	        if (currentPage < pageCount - 2) {
	          showNextMore = true;
	        }
	      }

	      var array = [];

	      if (showPrevMore && !showNextMore) {
	        var startPage = pageCount - (pagerCount - 2);
	        for (var i = startPage; i < pageCount; i++) {
	          array.push(i);
	        }
	      } else if (!showPrevMore && showNextMore) {
	        for (var _i = 2; _i < pagerCount; _i++) {
	          array.push(_i);
	        }
	      } else if (showPrevMore && showNextMore) {
	        var offset = Math.floor(pagerCount / 2) - 1;
	        for (var _i2 = currentPage - offset; _i2 <= currentPage + offset; _i2++) {
	          array.push(_i2);
	        }
	      } else {
	        for (var _i3 = 2; _i3 < pageCount; _i3++) {
	          array.push(_i3);
	        }
	      }

	      this.showPrevMore = showPrevMore;
	      this.showNextMore = showNextMore;

	      return array;
	    }
	  },

	  data: function data() {
	    return {
	      current: null,
	      showPrevMore: false,
	      showNextMore: false,
	      quicknextIconClass: 'el-icon-more',
	      quickprevIconClass: 'el-icon-more'
	    };
	  }
	};

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('ul', {
	    staticClass: "el-pager",
	    on: {
	      "click": onPagerClick
	    }
	  }, [(pageCount > 0) ? _h('li', {
	    staticClass: "number",
	    class: {
	      active: currentPage === 1
	    }
	  }, ["1"]) : _e(), " ", (showPrevMore) ? _h('li', {
	    staticClass: "el-icon more btn-quickprev",
	    class: [quickprevIconClass],
	    on: {
	      "mouseenter": function($event) {
	        quickprevIconClass = 'el-icon-d-arrow-left'
	      },
	      "mouseleave": function($event) {
	        quickprevIconClass = 'el-icon-more'
	      }
	    }
	  }) : _e(), " ", _l((pagers), function(pager) {
	    return _h('li', {
	      staticClass: "number",
	      class: {
	        active: currentPage === pager
	      }
	    }, [_s(pager)])
	  }), " ", (showNextMore) ? _h('li', {
	    staticClass: "el-icon more btn-quicknext",
	    class: [quicknextIconClass],
	    on: {
	      "mouseenter": function($event) {
	        quicknextIconClass = 'el-icon-d-arrow-right'
	      },
	      "mouseleave": function($event) {
	        quicknextIconClass = 'el-icon-more'
	      }
	    }
	  }) : _e(), " ", (pageCount > 1) ? _h('li', {
	    staticClass: "number",
	    class: {
	      active: currentPage === pageCount
	    }
	  }, [_s(pageCount)]) : _e()])
	}},staticRenderFns: []}

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ElSelect = __webpack_require__(16);

	ElSelect.install = function (Vue) {
	  Vue.component(ElSelect.name, ElSelect);
	};

	module.exports = ElSelect;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(17)

	/* template */
	var __vue_template__ = __webpack_require__(33)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _emitter = __webpack_require__(18);

	var _emitter2 = _interopRequireDefault(_emitter);

	var _index = __webpack_require__(19);

	var _index2 = _interopRequireDefault(_index);

	var _index3 = __webpack_require__(2);

	var _index4 = _interopRequireDefault(_index3);

	var _index5 = __webpack_require__(24);

	var _index6 = _interopRequireDefault(_index5);

	var _debounce = __webpack_require__(28);

	var _debounce2 = _interopRequireDefault(_debounce);

	var _clickoutside = __webpack_require__(30);

	var _clickoutside2 = _interopRequireDefault(_clickoutside);

	var _class = __webpack_require__(32);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  mixins: [_emitter2.default],

	  name: 'ElSelect',

	  componentName: 'select',

	  computed: {
	    iconClass: function iconClass() {
	      return this.showCloseIcon ? 'circle-close' : this.remote && this.filterable ? '' : 'caret-top';
	    },
	    debounce: function debounce() {
	      return this.remote ? 300 : 0;
	    },
	    showCloseIcon: function showCloseIcon() {
	      var criteria = this.clearable && this.inputHovering && !this.multiple && this.options.indexOf(this.selected) > -1;
	      if (!this.$el) return false;

	      var icon = this.$el.querySelector('.el-input__icon');
	      if (icon) {
	        if (criteria) {
	          icon.addEventListener('click', this.deleteSelected);
	          (0, _class.addClass)(icon, 'is-show-close');
	        } else {
	          icon.removeEventListener('click', this.deleteSelected);
	          (0, _class.removeClass)(icon, 'is-show-close');
	        }
	      }
	      return criteria;
	    },
	    nodataText: function nodataText() {
	      if (this.loading) {
	        return '加载中';
	      } else {
	        if (this.voidRemoteQuery) {
	          this.voidRemoteQuery = false;
	          return false;
	        }
	        if (this.filteredOptionsCount === 0) {
	          return '无匹配数据';
	        }
	        if (this.options.length === 0) {
	          return '无数据';
	        }
	      }
	      return null;
	    }
	  },

	  components: {
	    ElInput: _index2.default,
	    ElSelectMenu: _index4.default,
	    ElTag: _index6.default
	  },

	  directives: { Clickoutside: _clickoutside2.default },

	  props: {
	    name: String,
	    value: {},
	    size: String,
	    disabled: Boolean,
	    clearable: Boolean,
	    filterable: Boolean,
	    loading: Boolean,
	    remote: Boolean,
	    remoteMethod: Function,
	    filterMethod: Function,
	    multiple: Boolean,
	    placeholder: {
	      type: String,
	      default: '请选择'
	    }
	  },

	  data: function data() {
	    return {
	      options: [],
	      selected: {},
	      isSelect: true,
	      inputLength: 20,
	      inputWidth: 0,
	      valueChangeBySelected: false,
	      cachedPlaceHolder: '',
	      optionsCount: 0,
	      filteredOptionsCount: 0,
	      dropdownUl: null,
	      visible: false,
	      selectedLabel: '',
	      selectInit: false,
	      hoverIndex: -1,
	      query: '',
	      voidRemoteQuery: false,
	      bottomOverflowBeforeHidden: 0,
	      optionsAllDisabled: false,
	      inputHovering: false,
	      currentPlaceholder: ''
	    };
	  },


	  watch: {
	    placeholder: function placeholder(val) {
	      this.currentPlaceholder = val;
	    },
	    value: function value(val) {
	      var _this = this;

	      if (this.valueChangeBySelected) {
	        this.valueChangeBySelected = false;
	        return;
	      }
	      this.$nextTick(function () {
	        if (_this.multiple && Array.isArray(val)) {
	          _this.$nextTick(function () {
	            _this.resetInputHeight();
	          });
	          _this.selectedInit = true;
	          _this.selected = [];
	          _this.currentPlaceholder = _this.cachedPlaceHolder;
	          val.forEach(function (item) {
	            var option = _this.options.filter(function (option) {
	              return option.value === item;
	            })[0];
	            if (option) {
	              _this.$emit('addOptionToValue', option);
	            }
	          });
	        }
	        if (!_this.multiple) {
	          var option = _this.options.filter(function (option) {
	            return option.value === val;
	          })[0];
	          if (option) {
	            _this.$emit('addOptionToValue', option);
	          } else {
	            _this.selected = {};
	            _this.selectedLabel = '';
	          }
	        }
	        _this.resetHoverIndex();
	      });
	    },
	    selected: function selected(val) {
	      var _this2 = this;

	      if (this.multiple) {
	        if (this.selected.length > 0) {
	          this.currentPlaceholder = '';
	        } else {
	          this.currentPlaceholder = this.cachedPlaceHolder;
	        }
	        if (this.selectedInit) {
	          this.selectedInit = false;
	          return;
	        }
	        this.valueChangeBySelected = true;
	        var result = val.map(function (item) {
	          return item.value;
	        });

	        this.$emit('input', result);
	        this.$emit('change', result);
	        this.$nextTick(function () {
	          _this2.resetInputHeight();
	        });
	        if (this.filterable) {
	          this.query = '';
	          this.hoverIndex = -1;
	          this.$refs.input.focus();
	          this.inputLength = 20;
	        }
	      } else {
	        this.valueChangeBySelected = true;
	        this.$emit('input', val.value);
	        this.$emit('change', val.value);
	      }
	    },
	    query: function query(val) {
	      var _this3 = this;

	      this.$nextTick(function () {
	        _this3.broadcast('select-dropdown', 'updatePopper');
	      });
	      if (this.multiple && this.filterable) {
	        this.resetInputHeight();
	      }
	      if (this.remote && typeof this.remoteMethod === 'function') {
	        this.hoverIndex = -1;
	        if (!this.multiple) {
	          this.selected = {};
	        }
	        this.remoteMethod(val);
	        this.voidRemoteQuery = val === '';
	      } else if (typeof this.filterMethod === 'function') {
	        this.filterMethod(val);
	      } else {
	        this.filteredOptionsCount = this.optionsCount;
	        this.broadcast('option', 'queryChange', val);
	      }
	    },
	    visible: function visible(val) {
	      if (!val) {
	        this.$refs.reference.$el.querySelector('input').blur();
	        if (this.$el.querySelector('.el-input__icon')) {
	          (0, _class.removeClass)(this.$el.querySelector('.el-input__icon'), 'is-reverse');
	        }
	        this.broadcast('select-dropdown', 'destroyPopper');
	        if (this.$refs.input) {
	          this.$refs.input.blur();
	        }
	        this.resetHoverIndex();
	        if (!this.multiple) {
	          if (this.dropdownUl && this.selected.$el) {
	            this.bottomOverflowBeforeHidden = this.selected.$el.getBoundingClientRect().bottom - this.$refs.popper.$el.getBoundingClientRect().bottom;
	          }
	          if (this.selected && this.selected.value) {
	            this.selectedLabel = this.selected.currentLabel;
	          }
	        }
	      } else {
	        var icon = this.$el.querySelector('.el-input__icon');
	        if (icon && !(0, _class.hasClass)(icon, 'el-icon-circle-close')) {
	          (0, _class.addClass)(this.$el.querySelector('.el-input__icon'), 'is-reverse');
	        }
	        this.broadcast('select-dropdown', 'updatePopper');
	        if (this.filterable) {
	          this.query = this.selectedLabel;
	          if (this.multiple) {
	            this.$refs.input.focus();
	          } else {
	            this.broadcast('input', 'inputSelect');
	          }
	        }
	        if (!this.dropdownUl) {
	          var dropdownChildNodes = this.$refs.popper.$el.childNodes;
	          this.dropdownUl = [].filter.call(dropdownChildNodes, function (item) {
	            return item.tagName === 'UL';
	          })[0];
	        }
	        if (!this.multiple && this.dropdownUl) {
	          if (this.bottomOverflowBeforeHidden > 0) {
	            this.dropdownUl.scrollTop += this.bottomOverflowBeforeHidden;
	          }
	        }
	      }
	    },
	    options: function options(val) {
	      this.optionsAllDisabled = val.length === val.filter(function (item) {
	        return item.disabled === true;
	      }).length;
	    }
	  },

	  methods: {
	    doDestroy: function doDestroy() {
	      this.$refs.popper.doDestroy();
	    },
	    handleClose: function handleClose() {
	      this.visible = false;
	    },
	    toggleLastOptionHitState: function toggleLastOptionHitState(hit) {
	      if (!Array.isArray(this.selected)) return;
	      var option = this.selected[this.selected.length - 1];
	      if (!option) return;

	      if (hit === true || hit === false) {
	        option.hitState = hit;
	        return hit;
	      }

	      option.hitState = !option.hitState;
	      return option.hitState;
	    },
	    deletePrevTag: function deletePrevTag(e) {
	      if (e.target.value.length <= 0 && !this.toggleLastOptionHitState()) {
	        this.selected.pop();
	      }
	    },
	    addOptionToValue: function addOptionToValue(option, init) {
	      if (this.multiple) {
	        if (this.selected.indexOf(option) === -1 && (this.remote ? this.value.indexOf(option.value) === -1 : true)) {
	          this.selectedInit = !!init;
	          this.selected.push(option);
	          this.resetHoverIndex();
	        }
	      } else {
	        this.selected = option;
	        this.selectedLabel = option.currentLabel;
	        this.hoverIndex = option.index;
	      }
	    },
	    managePlaceholder: function managePlaceholder() {
	      if (this.currentPlaceholder !== '') {
	        this.currentPlaceholder = this.$refs.input.value ? '' : this.cachedPlaceHolder;
	      }
	    },
	    resetInputState: function resetInputState(e) {
	      if (e.keyCode !== 8) this.toggleLastOptionHitState(false);
	      this.inputLength = this.$refs.input.value.length * 15 + 20;
	    },
	    resetInputHeight: function resetInputHeight() {
	      var _this4 = this;

	      this.$nextTick(function () {
	        var inputChildNodes = _this4.$refs.reference.$el.childNodes;
	        var input = [].filter.call(inputChildNodes, function (item) {
	          return item.tagName === 'INPUT';
	        })[0];
	        input.style.height = Math.max(_this4.$refs.tags.clientHeight + 6, _this4.size === 'small' ? 28 : 36) + 'px';
	        _this4.broadcast('select-dropdown', 'updatePopper');
	      });
	    },
	    resetHoverIndex: function resetHoverIndex() {
	      var _this5 = this;

	      setTimeout(function () {
	        if (!_this5.multiple) {
	          _this5.hoverIndex = _this5.options.indexOf(_this5.selected);
	        } else {
	          if (_this5.selected.length > 0) {
	            _this5.hoverIndex = Math.min.apply(null, _this5.selected.map(function (item) {
	              return _this5.options.indexOf(item);
	            }));
	          } else {
	            _this5.hoverIndex = -1;
	          }
	        }
	      }, 300);
	    },
	    handleOptionSelect: function handleOptionSelect(option) {
	      if (!this.multiple) {
	        this.selected = option;
	        this.selectedLabel = option.currentLabel;
	        this.visible = false;
	      } else {
	        var optionIndex = -1;
	        this.selected.forEach(function (item, index) {
	          if (item === option || item.currentLabel === option.currentLabel) {
	            optionIndex = index;
	          }
	        });
	        if (optionIndex > -1) {
	          this.selected.splice(optionIndex, 1);
	        } else {
	          this.selected.push(option);
	        }
	      }
	    },
	    toggleMenu: function toggleMenu() {
	      if (this.filterable && this.query === '' && this.visible) {
	        return;
	      }
	      if (!this.disabled) {
	        this.visible = !this.visible;
	        if (this.remote && this.visible) {
	          this.selectedLabel = '';
	        }
	      }
	    },
	    navigateOptions: function navigateOptions(direction) {
	      if (!this.visible) {
	        this.visible = true;
	        return;
	      }
	      if (!this.optionsAllDisabled) {
	        if (direction === 'next') {
	          this.hoverIndex++;
	          if (this.hoverIndex === this.options.length) {
	            this.hoverIndex = 0;
	          }
	          this.resetScrollTop();
	          if (this.options[this.hoverIndex].disabled === true || !this.options[this.hoverIndex].queryPassed) {
	            this.navigateOptions('next');
	          }
	        }
	        if (direction === 'prev') {
	          this.hoverIndex--;
	          if (this.hoverIndex < 0) {
	            this.hoverIndex = this.options.length - 1;
	          }
	          this.resetScrollTop();
	          if (this.options[this.hoverIndex].disabled === true || !this.options[this.hoverIndex].queryPassed) {
	            this.navigateOptions('prev');
	          }
	        }
	      }
	    },
	    resetScrollTop: function resetScrollTop() {
	      var bottomOverflowDistance = this.options[this.hoverIndex].$el.getBoundingClientRect().bottom - this.$refs.popper.$el.getBoundingClientRect().bottom;
	      var topOverflowDistance = this.options[this.hoverIndex].$el.getBoundingClientRect().top - this.$refs.popper.$el.getBoundingClientRect().top;
	      if (bottomOverflowDistance > 0) {
	        this.dropdownUl.scrollTop += bottomOverflowDistance;
	      }
	      if (topOverflowDistance < 0) {
	        this.dropdownUl.scrollTop += topOverflowDistance;
	      }
	    },
	    selectOption: function selectOption() {
	      if (this.options[this.hoverIndex]) {
	        this.handleOptionSelect(this.options[this.hoverIndex]);
	      }
	    },
	    deleteSelected: function deleteSelected(event) {
	      event.stopPropagation();
	      this.selected = {};
	      this.selectedLabel = '';
	      this.$emit('input', '');
	      this.$emit('change', '');
	      this.visible = false;
	    },
	    deleteTag: function deleteTag(event, tag) {
	      if (event.target.tagName === 'I') {
	        var index = this.selected.indexOf(tag);
	        if (index > -1) {
	          this.selected.splice(index, 1);
	        }
	        event.stopPropagation();
	      }
	    },
	    onInputChange: function onInputChange() {
	      if (this.filterable && this.selectedLabel !== this.value) {
	        this.query = this.selectedLabel;
	      }
	    },
	    onOptionDestroy: function onOptionDestroy(option) {
	      this.optionsCount--;
	      this.filteredOptionsCount--;
	      var index = this.options.indexOf(option);
	      if (index > -1) {
	        this.options.splice(index, 1);
	      }
	      this.broadcast('option', 'resetIndex');
	    }
	  },

	  created: function created() {
	    var _this6 = this;

	    this.cachedPlaceHolder = this.currentPlaceholder = this.placeholder;
	    if (this.multiple) {
	      this.selectedInit = true;
	      this.selected = [];
	    }
	    if (this.remote) {
	      this.voidRemoteQuery = true;
	    }

	    this.debouncedOnInputChange = (0, _debounce2.default)(this.debounce, function () {
	      _this6.onInputChange();
	    });

	    this.$on('addOptionToValue', this.addOptionToValue);
	    this.$on('handleOptionClick', this.handleOptionSelect);
	    this.$on('onOptionDestroy', this.onOptionDestroy);
	  },
	  mounted: function mounted() {
	    var _this7 = this;

	    this.$nextTick(function () {
	      if (_this7.$refs.reference.$el) {
	        _this7.inputWidth = _this7.$refs.reference.$el.getBoundingClientRect().width;
	      }
	    });
	  }
	};

/***/ },
/* 18 */
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;
	function _broadcast(componentName, eventName, params) {
	  this.$children.forEach(function (child) {
	    var name = child.$options.componentName;

	    if (name === componentName) {
	      child.$emit.apply(child, [eventName].concat(params));
	    } else {
	      _broadcast.apply(child, [componentName, eventName].concat(params));
	    }
	  });
	}
	exports.default = {
	  methods: {
	    dispatch: function dispatch(componentName, eventName, params) {
	      var parent = this.$parent || this.$root;
	      var name = parent.$options.componentName;

	      while (parent && (!name || name !== componentName)) {
	        parent = parent.$parent;

	        if (parent) {
	          name = parent.$options.componentName;
	        }
	      }
	      if (parent) {
	        parent.$emit.apply(parent, [eventName].concat(params));
	      }
	    },
	    broadcast: function broadcast(componentName, eventName, params) {
	      _broadcast.call(this, componentName, eventName, params);
	    }
	  }
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ElInput = __webpack_require__(20);

	ElInput.install = function (Vue) {
	  Vue.component(ElInput.name, ElInput);
	};

	module.exports = ElInput;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(21)

	/* template */
	var __vue_template__ = __webpack_require__(23)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _emitter = __webpack_require__(18);

	var _emitter2 = _interopRequireDefault(_emitter);

	var _calcTextareaHeight = __webpack_require__(22);

	var _calcTextareaHeight2 = _interopRequireDefault(_calcTextareaHeight);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  name: 'ElInput',

	  mixins: [_emitter2.default],

	  props: {
	    value: [String, Number],
	    placeholder: {
	      type: String,
	      default: ''
	    },
	    size: {
	      type: String,
	      default: ''
	    },
	    readonly: {
	      type: Boolean,
	      default: false
	    },
	    icon: {
	      type: String,
	      default: ''
	    },
	    disabled: {
	      type: Boolean,
	      default: false
	    },
	    type: {
	      type: String,
	      default: 'text'
	    },
	    name: {
	      type: String,
	      default: ''
	    },
	    number: {
	      type: Boolean,
	      default: false
	    },
	    autosize: {
	      type: [Boolean, Object],
	      default: false
	    },
	    rows: {
	      type: Number,
	      default: 2
	    },
	    autoComplete: {
	      type: String,
	      default: 'off'
	    },
	    maxlength: Number,
	    minlength: Number
	  },

	  methods: {
	    handleBlur: function handleBlur(event) {
	      this.$emit('onblur', this.currentValue);
	      this.dispatch('form-item', 'el.form.blur', [this.currentValue]);
	    },
	    inputSelect: function inputSelect() {
	      this.$refs.input.select();
	    },
	    resizeTextarea: function resizeTextarea() {
	      var autosize = this.autosize;
	      var type = this.type;

	      if (!autosize || type !== 'textarea') {
	        return;
	      }
	      var minRows = autosize ? autosize.minRows : null;
	      var maxRows = autosize ? autosize.maxRows : null;
	      this.textareaStyle = (0, _calcTextareaHeight2.default)(this.$refs.textarea, minRows, maxRows);
	    },
	    handleFocus: function handleFocus(ev) {
	      this.$emit('focus', ev);
	    }
	  },

	  data: function data() {
	    return {
	      currentValue: this.value,
	      textareaStyle: {}
	    };
	  },
	  created: function created() {
	    this.$on('inputSelect', this.inputSelect);
	  },
	  mounted: function mounted() {
	    this.resizeTextarea();
	  },


	  computed: {
	    validating: function validating() {
	      return this.$parent.validating;
	    }
	  },

	  watch: {
	    'value': function value(val, oldValue) {
	      this.currentValue = val;
	      this.resizeTextarea();
	    },
	    'currentValue': function currentValue(val) {
	      this.$emit('input', val);
	      this.$emit('change', val);
	      this.dispatch('form-item', 'el.form.change', [val]);
	    }
	  }
	};

/***/ },
/* 22 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports.default = calcTextareaHeight;
	var hiddenTextarea = void 0;

	var HIDDEN_STYLE = '\n  height:0 !important;\n  visibility:hidden !important;\n  overflow:hidden !important;\n  position:absolute !important;\n  z-index:-1000 !important;\n  top:0 !important;\n  right:0 !important\n';

	var CONTEXT_STYLE = ['letter-spacing', 'line-height', 'padding-top', 'padding-bottom', 'font-family', 'font-weight', 'font-size', 'text-rendering', 'text-transform', 'width', 'text-indent', 'padding-left', 'padding-right', 'border-width', 'box-sizing'];

	function calculateNodeStyling(node) {
	  var style = window.getComputedStyle(node);

	  var boxSizing = style.getPropertyValue('box-sizing');

	  var paddingSize = parseFloat(style.getPropertyValue('padding-bottom')) + parseFloat(style.getPropertyValue('padding-top'));

	  var borderSize = parseFloat(style.getPropertyValue('border-bottom-width')) + parseFloat(style.getPropertyValue('border-top-width'));

	  var contextStyle = CONTEXT_STYLE.map(function (name) {
	    return name + ':' + style.getPropertyValue(name);
	  }).join(';');

	  return { contextStyle: contextStyle, paddingSize: paddingSize, borderSize: borderSize, boxSizing: boxSizing };
	}

	function calcTextareaHeight(targetNode) {
	  var minRows = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
	  var maxRows = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

	  if (!hiddenTextarea) {
	    hiddenTextarea = document.createElement('textarea');
	    document.body.appendChild(hiddenTextarea);
	  }

	  var _calculateNodeStyling = calculateNodeStyling(targetNode);

	  var paddingSize = _calculateNodeStyling.paddingSize;
	  var borderSize = _calculateNodeStyling.borderSize;
	  var boxSizing = _calculateNodeStyling.boxSizing;
	  var contextStyle = _calculateNodeStyling.contextStyle;


	  hiddenTextarea.setAttribute('style', contextStyle + ';' + HIDDEN_STYLE);
	  hiddenTextarea.value = targetNode.value || targetNode.placeholder || '';

	  var height = hiddenTextarea.scrollHeight;

	  if (boxSizing === 'border-box') {
	    height = height + borderSize;
	  } else if (boxSizing === 'content-box') {
	    height = height - paddingSize;
	  }

	  hiddenTextarea.value = '';
	  var singleRowHeight = hiddenTextarea.scrollHeight - paddingSize;

	  if (minRows !== null) {
	    var minHeight = singleRowHeight * minRows;
	    if (boxSizing === 'border-box') {
	      minHeight = minHeight + paddingSize + borderSize;
	    }
	    height = Math.max(minHeight, height);
	  }
	  if (maxRows !== null) {
	    var maxHeight = singleRowHeight * maxRows;
	    if (boxSizing === 'border-box') {
	      maxHeight = maxHeight + paddingSize + borderSize;
	    }
	    height = Math.min(maxHeight, height);
	  }

	  return { height: height + 'px' };
	};

/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('div', {
	    class: [
	      type === 'textarea' ? 'el-textarea' : 'el-input',
	      size ? 'el-input-' + size : '', {
	        'is-disabled': disabled,
	        'el-input-group': $slots.prepend || $slots.append
	      }
	    ]
	  }, [(type !== 'textarea') ? [($slots.prepend) ? _h('div', {
	    staticClass: "el-input-group__prepend"
	  }, [_t("prepend")]) : _e(), " ", (type === 'text') ? _h('input', {
	    directives: [{
	      name: "model",
	      rawName: "v-model",
	      value: (currentValue),
	      expression: "currentValue"
	    }],
	    ref: "input",
	    staticClass: "el-input__inner",
	    attrs: {
	      "type": "text",
	      "name": name,
	      "placeholder": placeholder,
	      "disabled": disabled,
	      "readonly": readonly,
	      "number": number,
	      "maxlength": maxlength,
	      "minlength": minlength,
	      "autocomplete": autoComplete
	    },
	    domProps: {
	      "value": _s(currentValue)
	    },
	    on: {
	      "focus": handleFocus,
	      "blur": handleBlur,
	      "input": function($event) {
	        if ($event.target.composing) return;
	        currentValue = $event.target.value
	      }
	    }
	  }) : _e(), " ", (type === 'password') ? _h('input', {
	    directives: [{
	      name: "model",
	      rawName: "v-model",
	      value: (currentValue),
	      expression: "currentValue"
	    }],
	    ref: "input",
	    staticClass: "el-input__inner",
	    attrs: {
	      "type": "password",
	      "name": name,
	      "placeholder": placeholder,
	      "disabled": disabled,
	      "readonly": readonly,
	      "number": number,
	      "maxlength": maxlength,
	      "minlength": minlength,
	      "autocomplete": autoComplete
	    },
	    domProps: {
	      "value": _s(currentValue)
	    },
	    on: {
	      "focus": handleFocus,
	      "blur": handleBlur,
	      "input": function($event) {
	        if ($event.target.composing) return;
	        currentValue = $event.target.value
	      }
	    }
	  }) : _e(), " ", " ", (icon) ? _h('i', {
	    staticClass: "el-input__icon",
	    class: [icon ? 'el-icon-' + icon : '']
	  }) : _e(), " ", (validating) ? _h('i', {
	    staticClass: "el-input__icon el-icon-loading"
	  }) : _e(), " ", " ", ($slots.append) ? _h('div', {
	    staticClass: "el-input-group__append"
	  }, [_t("append")]) : _e()] : _h('textarea', {
	    directives: [{
	      name: "model",
	      rawName: "v-model",
	      value: (currentValue),
	      expression: "currentValue"
	    }],
	    ref: "textarea",
	    staticClass: "el-textarea__inner",
	    style: (textareaStyle),
	    attrs: {
	      "name": name,
	      "placeholder": placeholder,
	      "disabled": disabled,
	      "readonly": readonly,
	      "rows": rows,
	      "maxlength": maxlength,
	      "minlength": minlength
	    },
	    domProps: {
	      "value": _s(currentValue)
	    },
	    on: {
	      "focus": handleFocus,
	      "blur": handleBlur,
	      "input": function($event) {
	        if ($event.target.composing) return;
	        currentValue = $event.target.value
	      }
	    }
	  }), " "])
	}},staticRenderFns: []}

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ElTag = __webpack_require__(25);

	ElTag.install = function (Vue) {
	  Vue.component(ElTag.name, ElTag);
	};

	module.exports = ElTag;

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(26)

	/* template */
	var __vue_template__ = __webpack_require__(27)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 26 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports.default = {
	  name: 'ElTag',
	  props: {
	    text: String,
	    closable: Boolean,
	    type: String,
	    hit: Boolean,
	    closeTransition: Boolean
	  },
	  methods: {
	    handleClose: function handleClose(event) {
	      this.$emit('close', event);
	    }
	  }
	};

/***/ },
/* 27 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('transition', {
	    attrs: {
	      "name": closeTransition ? '' : 'md-fade-center'
	    }
	  }, [_h('span', {
	    staticClass: "el-tag",
	    class: [type ? 'el-tag--' + type : '', {
	      'is-hit': hit
	    }]
	  }, [_t("default"), " ", (closable) ? _h('i', {
	    staticClass: "el-tag__close el-icon-close",
	    on: {
	      "click": handleClose
	    }
	  }) : _e()])])
	}},staticRenderFns: []}

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	/* eslint-disable no-undefined */

	var throttle = __webpack_require__(29);

	/**
	 * Debounce execution of a function. Debouncing, unlike throttling,
	 * guarantees that a function is only executed a single time, either at the
	 * very beginning of a series of calls, or at the very end.
	 *
	 * @param  {Number}   delay         A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
	 * @param  {Boolean}  atBegin       Optional, defaults to false. If atBegin is false or unspecified, callback will only be executed `delay` milliseconds
	 *                                  after the last debounced-function call. If atBegin is true, callback will be executed only at the first debounced-function call.
	 *                                  (After the throttled-function has not been called for `delay` milliseconds, the internal counter is reset).
	 * @param  {Function} callback      A function to be executed after delay milliseconds. The `this` context and all arguments are passed through, as-is,
	 *                                  to `callback` when the debounced-function is executed.
	 *
	 * @return {Function} A new, debounced function.
	 */
	module.exports = function ( delay, atBegin, callback ) {
		return callback === undefined ? throttle(delay, atBegin, false) : throttle(delay, callback, atBegin !== false);
	};


/***/ },
/* 29 */
/***/ function(module, exports) {

	/* eslint-disable no-undefined,no-param-reassign,no-shadow */

	/**
	 * Throttle execution of a function. Especially useful for rate limiting
	 * execution of handlers on events like resize and scroll.
	 *
	 * @param  {Number}    delay          A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
	 * @param  {Boolean}   noTrailing     Optional, defaults to false. If noTrailing is true, callback will only execute every `delay` milliseconds while the
	 *                                    throttled-function is being called. If noTrailing is false or unspecified, callback will be executed one final time
	 *                                    after the last throttled-function call. (After the throttled-function has not been called for `delay` milliseconds,
	 *                                    the internal counter is reset)
	 * @param  {Function}  callback       A function to be executed after delay milliseconds. The `this` context and all arguments are passed through, as-is,
	 *                                    to `callback` when the throttled-function is executed.
	 * @param  {Boolean}   debounceMode   If `debounceMode` is true (at begin), schedule `clear` to execute after `delay` ms. If `debounceMode` is false (at end),
	 *                                    schedule `callback` to execute after `delay` ms.
	 *
	 * @return {Function}  A new, throttled, function.
	 */
	module.exports = function ( delay, noTrailing, callback, debounceMode ) {

		// After wrapper has stopped being called, this timeout ensures that
		// `callback` is executed at the proper times in `throttle` and `end`
		// debounce modes.
		var timeoutID;

		// Keep track of the last time `callback` was executed.
		var lastExec = 0;

		// `noTrailing` defaults to falsy.
		if ( typeof noTrailing !== 'boolean' ) {
			debounceMode = callback;
			callback = noTrailing;
			noTrailing = undefined;
		}

		// The `wrapper` function encapsulates all of the throttling / debouncing
		// functionality and when executed will limit the rate at which `callback`
		// is executed.
		function wrapper () {

			var self = this;
			var elapsed = Number(new Date()) - lastExec;
			var args = arguments;

			// Execute `callback` and update the `lastExec` timestamp.
			function exec () {
				lastExec = Number(new Date());
				callback.apply(self, args);
			}

			// If `debounceMode` is true (at begin) this is used to clear the flag
			// to allow future `callback` executions.
			function clear () {
				timeoutID = undefined;
			}

			if ( debounceMode && !timeoutID ) {
				// Since `wrapper` is being called for the first time and
				// `debounceMode` is true (at begin), execute `callback`.
				exec();
			}

			// Clear any existing timeout.
			if ( timeoutID ) {
				clearTimeout(timeoutID);
			}

			if ( debounceMode === undefined && elapsed > delay ) {
				// In throttle mode, if `delay` time has been exceeded, execute
				// `callback`.
				exec();

			} else if ( noTrailing !== true ) {
				// In trailing throttle mode, since `delay` time has not been
				// exceeded, schedule `callback` to execute `delay` ms after most
				// recent execution.
				//
				// If `debounceMode` is true (at begin), schedule `clear` to execute
				// after `delay` ms.
				//
				// If `debounceMode` is false (at end), schedule `callback` to
				// execute after `delay` ms.
				timeoutID = setTimeout(debounceMode ? clear : exec, debounceMode === undefined ? delay - elapsed : delay);
			}

		}

		// Return the wrapper function.
		return wrapper;

	};


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _event = __webpack_require__(31);

	var clickoutsideContext = '@@clickoutsideContext';

	exports.default = {
	  bind: function bind(el, binding, vnode) {
	    var documentHandler = function documentHandler(e) {
	      if (!vnode.context || el.contains(e.target) || !vnode.context.popperElm || vnode.context.popperElm.contains(e.target)) return;
	      if (binding.expression) {
	        vnode.context[el[clickoutsideContext].methodName]();
	      } else {
	        el[clickoutsideContext].bindingFn();
	      }
	    };
	    el[clickoutsideContext] = {
	      documentHandler: documentHandler,
	      methodName: binding.expression,
	      bindingFn: binding.value
	    };
	    (0, _event.on)(document, 'click', documentHandler);
	  },
	  update: function update(el, binding) {
	    el[clickoutsideContext].methodName = binding.expression;
	    el[clickoutsideContext].bindingFn = binding.value;
	  },
	  unbind: function unbind(el) {
	    (0, _event.off)(document, 'click', el[clickoutsideContext].documentHandler);
	  },
	  install: function install(Vue) {
	    Vue.directive('clickoutside', {
	      bind: this.bind,
	      unbind: this.unbind
	    });
	  }
	};

/***/ },
/* 31 */
/***/ function(module, exports) {

	var bindEvent = (function() {
	  if(document.addEventListener) {
	    return function(element, event, handler) {
	      if (element && event && handler) {
	        element.addEventListener(event, handler, false);
	      }
	    };
	  } else {
	    return function(element, event, handler) {
	      if (element && event && handler) {
	        element.attachEvent('on' + event, handler);
	      }
	    };
	  }
	})();

	var unbindEvent = (function() {
	  if(document.removeEventListener) {
	    return function(element, event, handler) {
	      if (element && event) {
	        element.removeEventListener(event, handler, false);
	      }
	    };
	  } else {
	    return function(element, event, handler) {
	      if (element && event) {
	        element.detachEvent('on' + event, handler);
	      }
	    };
	  }
	})();

	var bindOnce = function(el, event, fn) {
	  var listener = function() {
	    if (fn) {
	      fn.apply(this, arguments);
	    }
	    unbindEvent(el, event, listener);
	  };
	  bindEvent(el, event, listener);
	};

	module.exports = {
	  on: bindEvent,
	  off: unbindEvent,
	  once: bindOnce
	};

/***/ },
/* 32 */
/***/ function(module, exports) {

	var trim = function (string) {
	  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
	};

	var hasClass = function (el, cls) {
	  if (!el || !cls) return false;
	  if (cls.indexOf(' ') != -1) throw new Error('className should not contain space.');
	  if (el.classList) {
	    return el.classList.contains(cls);
	  } else {
	    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
	  }
	};

	var addClass = function (el, cls) {
	  if (!el) return;
	  var curClass = el.className;
	  var classes = (cls || '').split(' ');

	  for (var i = 0, j = classes.length; i < j; i++) {
	    var clsName = classes[i];
	    if (!clsName) continue;

	    if (el.classList) {
	      el.classList.add(clsName);
	    } else {
	      if (!hasClass(el, clsName)) {
	        curClass += ' ' + clsName;
	      }
	    }
	  }
	  if (!el.classList) {
	    el.className = curClass;
	  }
	};

	var removeClass = function (el, cls) {
	  if (!el || !cls) return;
	  var classes = cls.split(' ');
	  var curClass = ' ' + el.className + ' ';

	  for (var i = 0, j = classes.length; i < j; i++) {
	    var clsName = classes[i];
	    if (!clsName) continue;

	    if (el.classList) {
	      el.classList.remove(clsName);
	    } else {
	      if (hasClass(el, clsName)) {
	        curClass = curClass.replace(' ' + clsName + ' ', ' ');
	      }
	    }
	  }
	  if (!el.classList) {
	    el.className = trim(curClass);
	  }
	};

	module.exports = {
	  hasClass: hasClass,
	  addClass: addClass,
	  removeClass: removeClass
	};

/***/ },
/* 33 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('div', {
	    directives: [{
	      name: "clickoutside",
	      rawName: "v-clickoutside",
	      value: (handleClose),
	      expression: "handleClose"
	    }],
	    staticClass: "el-select",
	    class: {
	      'is-multiple': multiple, 'is-small': size === 'small'
	    }
	  }, [(multiple) ? _h('div', {
	    ref: "tags",
	    staticClass: "el-select__tags",
	    style: ({
	      'max-width': inputWidth - 32 + 'px'
	    }),
	    on: {
	      "click": function($event) {
	        $event.stopPropagation();
	        toggleMenu($event)
	      }
	    }
	  }, [_h('transition-group', {
	    on: {
	      "after-leave": resetInputHeight
	    }
	  }, [_l((selected), function(item) {
	    return _h('el-tag', {
	      key: item,
	      attrs: {
	        "closable": "",
	        "hit": item.hitState,
	        "type": "primary",
	        "close-transition": ""
	      },
	      nativeOn: {
	        "click": function($event) {
	          deleteTag($event, item)
	        }
	      }
	    }, [_s(item.currentLabel)])
	  })]), " ", (filterable) ? _h('input', {
	    directives: [{
	      name: "model",
	      rawName: "v-model",
	      value: (query),
	      expression: "query"
	    }],
	    ref: "input",
	    staticClass: "el-select__input",
	    style: ({
	      width: inputLength + 'px',
	      'max-width': inputWidth - 42 + 'px'
	    }),
	    attrs: {
	      "type": "text",
	      "debounce": remote ? 300 : 0
	    },
	    domProps: {
	      "value": _s(query)
	    },
	    on: {
	      "focus": function($event) {
	        visible = true
	      },
	      "keyup": managePlaceholder,
	      "keydown": [resetInputState, function($event) {
	        if ($event.keyCode !== 40) return;
	        $event.preventDefault();
	        navigateOptions('next')
	      }, function($event) {
	        if ($event.keyCode !== 38) return;
	        $event.preventDefault();
	        navigateOptions('prev')
	      }, function($event) {
	        if ($event.keyCode !== 13) return;
	        $event.preventDefault();
	        selectOption($event)
	      }, function($event) {
	        if ($event.keyCode !== 27) return;
	        $event.preventDefault();
	        visible = false
	      }, function($event) {
	        if ($event.keyCode !== 8 && $event.keyCode !== 46) return;
	        deletePrevTag($event)
	      }],
	      "input": function($event) {
	        if ($event.target.composing) return;
	        query = $event.target.value
	      }
	    }
	  }) : _e()]) : _e(), " ", _h('el-input', {
	    directives: [{
	      name: "model",
	      rawName: "v-model",
	      value: (selectedLabel),
	      expression: "selectedLabel"
	    }],
	    ref: "reference",
	    attrs: {
	      "type": "text",
	      "placeholder": currentPlaceholder,
	      "name": name,
	      "disabled": disabled,
	      "readonly": !filterable || multiple,
	      "icon": iconClass
	    },
	    domProps: {
	      "value": (selectedLabel)
	    },
	    on: {
	      "input": function($event) {
	        selectedLabel = $event
	      }
	    },
	    nativeOn: {
	      "click": function($event) {
	        toggleMenu($event)
	      },
	      "keyup": function($event) {
	        debouncedOnInputChange($event)
	      },
	      "keydown": [function($event) {
	        if ($event.keyCode !== 40) return;
	        $event.preventDefault();
	        navigateOptions('next')
	      }, function($event) {
	        if ($event.keyCode !== 38) return;
	        $event.preventDefault();
	        navigateOptions('prev')
	      }, function($event) {
	        if ($event.keyCode !== 13) return;
	        $event.preventDefault();
	        selectOption($event)
	      }, function($event) {
	        if ($event.keyCode !== 27) return;
	        $event.preventDefault();
	        visible = false
	      }, function($event) {
	        if ($event.keyCode !== 9) return;
	        visible = false
	      }],
	      "mouseenter": function($event) {
	        inputHovering = true
	      },
	      "mouseleave": function($event) {
	        inputHovering = false
	      }
	    }
	  }), " ", _h('transition', {
	    attrs: {
	      "name": "md-fade-bottom"
	    },
	    on: {
	      "after-leave": doDestroy
	    }
	  }, [_h('el-select-menu', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (visible && nodataText !== false),
	      expression: "visible && nodataText !== false"
	    }],
	    ref: "popper"
	  }, [_h('ul', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (options.length > 0 && filteredOptionsCount > 0 && !loading),
	      expression: "options.length > 0 && filteredOptionsCount > 0 && !loading"
	    }],
	    staticClass: "el-select-dropdown__list"
	  }, [_t("default")]), " ", (nodataText) ? _h('p', {
	    staticClass: "el-select-dropdown__nodata"
	  }, [_s(nodataText)]) : _e()])])])
	}},staticRenderFns: []}

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ElOption = __webpack_require__(35);

	ElOption.install = function (Vue) {
	  Vue.component(ElOption.name, ElOption);
	};

	module.exports = ElOption;

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(36)

	/* template */
	var __vue_template__ = __webpack_require__(37)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _emitter = __webpack_require__(18);

	var _emitter2 = _interopRequireDefault(_emitter);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  mixins: [_emitter2.default],

	  name: 'el-option',

	  componentName: 'option',

	  props: {
	    value: {
	      required: true
	    },
	    label: [String, Number],
	    selected: {
	      type: Boolean,
	      default: false
	    },
	    disabled: {
	      type: Boolean,
	      default: false
	    }
	  },

	  data: function data() {
	    return {
	      index: -1,
	      queryPassed: true,
	      hitState: false,
	      currentLabel: this.label
	    };
	  },


	  computed: {
	    parent: function parent() {
	      var result = this.$parent;
	      while (!result.isSelect) {
	        result = result.$parent;
	      }
	      return result;
	    },
	    itemSelected: function itemSelected() {
	      if (Object.prototype.toString.call(this.parent.selected) === '[object Object]') {
	        return this === this.parent.selected;
	      } else if (Array.isArray(this.parent.selected)) {
	        return this.parent.value.indexOf(this.value) > -1;
	      }
	    },
	    currentSelected: function currentSelected() {
	      return this.selected || (this.parent.multiple ? this.parent.value.indexOf(this.value) > -1 : this.parent.value === this.value);
	    }
	  },

	  watch: {
	    currentSelected: function currentSelected(val) {
	      if (val === true) {
	        this.dispatch('select', 'addOptionToValue', this);
	      }
	    }
	  },

	  methods: {
	    disableOptions: function disableOptions() {
	      this.disabled = true;
	    },
	    hoverItem: function hoverItem() {
	      if (!this.disabled) {
	        this.parent.hoverIndex = this.parent.options.indexOf(this);
	      }
	    },
	    selectOptionClick: function selectOptionClick() {
	      if (this.disabled !== true) {
	        this.dispatch('select', 'handleOptionClick', this);
	      }
	    },
	    queryChange: function queryChange(query) {
	      this.queryPassed = new RegExp(query, 'i').test(this.currentLabel);
	      if (!this.queryPassed) {
	        this.parent.filteredOptionsCount--;
	      }
	    },
	    resetIndex: function resetIndex() {
	      var _this = this;

	      this.$nextTick(function () {
	        _this.index = _this.parent.options.indexOf(_this);
	      });
	    }
	  },

	  created: function created() {
	    this.currentLabel = this.currentLabel || (typeof this.value === 'string' || typeof this.value === 'number' ? this.value : '');
	    this.parent.options.push(this);
	    this.parent.optionsCount++;
	    this.parent.filteredOptionsCount++;
	    this.index = this.parent.options.indexOf(this);

	    if (this.currentSelected === true) {
	      this.dispatch('select', 'addOptionToValue', [this, true]);
	    }

	    this.$on('queryChange', this.queryChange);
	    this.$on('disableOptions', this.disableOptions);
	    this.$on('resetIndex', this.resetIndex);
	  },
	  beforeDestroy: function beforeDestroy() {
	    this.dispatch('select', 'onOptionDestroy', this);
	  }
	};

/***/ },
/* 37 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('li', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (queryPassed),
	      expression: "queryPassed"
	    }],
	    staticClass: "el-select-dropdown__item",
	    class: {
	      'selected': itemSelected, 'is-disabled': disabled, 'hover': parent.hoverIndex === index
	    },
	    on: {
	      "mouseenter": hoverItem,
	      "click": function($event) {
	        $event.stopPropagation();
	        selectOptionClick($event)
	      }
	    }
	  }, [_t("default", [_h('span', [_s(currentLabel)])])])
	}},staticRenderFns: []}

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ElDialog = __webpack_require__(39);

	ElDialog.install = function (Vue) {
	  Vue.component('el-dialog', ElDialog);
	};

	module.exports = ElDialog;

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(40)

	/* template */
	var __vue_template__ = __webpack_require__(42)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _vuePopup = __webpack_require__(41);

	var _vuePopup2 = _interopRequireDefault(_vuePopup);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  name: 'el-dialog',

	  mixins: [_vuePopup2.default],

	  props: {
	    title: {
	      type: String,
	      default: ''
	    },

	    modal: {
	      type: Boolean,
	      default: true
	    },

	    lockScroll: {
	      type: Boolean,
	      default: true
	    },

	    closeOnClickModal: {
	      type: Boolean,
	      default: true
	    },

	    closeOnPressEscape: {
	      type: Boolean,
	      default: true
	    },

	    size: {
	      type: String,
	      default: 'small'
	    },

	    customClass: {
	      type: String,
	      default: ''
	    },

	    top: {
	      type: String,
	      default: '15%'
	    }
	  },

	  watch: {
	    value: function value(val) {
	      var _this = this;

	      if (val) {
	        this.$emit('open');
	        this.$nextTick(function () {
	          _this.$refs.dialog.scrollTop = 0;
	        });
	      } else {
	        this.$emit('close');
	      }
	    }
	  },

	  computed: {
	    sizeClass: function sizeClass() {
	      return 'el-dialog--' + this.size;
	    },
	    style: function style() {
	      return this.size === 'full' ? {} : { 'margin-bottom': '50px', 'top': this.top };
	    }
	  },

	  methods: {
	    handleWrapperClick: function handleWrapperClick() {
	      if (this.closeOnClickModal) {
	        this.$emit('input', false);
	      }
	    }
	  },

	  mounted: function mounted() {
	    if (this.value) {
	      this.rendered = true;
	      this.open();
	    }
	  }
	};

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	!function(e,t){ true?module.exports=t(__webpack_require__(8)):"function"==typeof define&&define.amd?define("VuePopup",["vue"],t):"object"==typeof exports?exports.VuePopup=t(require("vue")):e.VuePopup=t(e.vue)}(this,function(e){return function(e){function t(n){if(o[n])return o[n].exports;var i=o[n]={i:n,l:!1,exports:{}};return e[n].call(i.exports,i,i.exports,t),i.l=!0,i.exports}var o={};return t.m=e,t.c=o,t.i=function(e){return e},t.d=function(e,t,o){Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:o})},t.n=function(e){var o=e&&e.__esModule?function(){return e["default"]}:function(){return e};return t.d(o,"a",o),o},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="/lib/",t(t.s=5)}([function(e,t,o){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0});var i=o(4),l=n(i),d=o(2),s=o(1),r=n(s);o(3);var a=1,u=[],c=function(e){if(u.indexOf(e)===-1){var t=function(e){var t=e.__vue__;if(!t){var o=e.previousSibling;o.__vue__&&(t=o.__vue__)}return t};l["default"].transition(e,{afterEnter:function(e){var o=t(e);o&&o.doAfterOpen&&o.doAfterOpen()},afterLeave:function(e){var o=t(e);o&&o.doAfterClose&&o.doAfterClose()}})}},f=void 0,p=function(){if(void 0!==f)return f;var e=document.createElement("div");e.style.visibility="hidden",e.style.width="100px",e.style.position="absolute",e.style.top="-9999px",document.body.appendChild(e);var t=e.offsetWidth;e.style.overflow="scroll";var o=document.createElement("div");o.style.width="100%",e.appendChild(o);var n=o.offsetWidth;return e.parentNode.removeChild(e),t-n},h=function m(e){return 3===e.nodeType&&(e=e.nextElementSibling||e.nextSibling,m(e)),e};t["default"]={props:{value:{type:Boolean,"default":!1},transition:{type:String,"default":""},openDelay:{},closeDelay:{},zIndex:{},modal:{type:Boolean,"default":!1},modalFade:{type:Boolean,"default":!0},modalClass:{},lockScroll:{type:Boolean,"default":!0},closeOnPressEscape:{type:Boolean,"default":!1},closeOnClickModal:{type:Boolean,"default":!1}},created:function(){this.transition&&c(this.transition)},beforeMount:function(){this._popupId="popup-"+a++,r["default"].register(this._popupId,this)},beforeDestroy:function(){r["default"].deregister(this._popupId),r["default"].closeModal(this._popupId)},data:function(){return{opened:!1,bodyOverflow:null,bodyPaddingRight:null,rendered:!1}},watch:{value:function(e){var t=this;if(e){if(this._opening)return;this.rendered?this.open():(this.rendered=!0,l["default"].nextTick(function(){t.open()}))}else this.close()}},methods:{open:function(e){var t=this;if(!this.rendered)return this.rendered=!0,void this.$emit("input",!0);var o=(0,d.merge)({},this,e);this._closeTimer&&(clearTimeout(this._closeTimer),this._closeTimer=null),clearTimeout(this._openTimer);var n=Number(o.openDelay);n>0?this._openTimer=setTimeout(function(){t._openTimer=null,t.doOpen(o)},n):this.doOpen(o)},doOpen:function(e){if((!this.willOpen||this.willOpen())&&!this.opened){this._opening=!0,this.$emit("input",!0);var t=h(this.$el),o=e.modal,n=e.zIndex;n&&(r["default"].zIndex=n),o&&(this._closing&&(r["default"].closeModal(this._popupId),this._closing=!1),r["default"].openModal(this._popupId,r["default"].nextZIndex(),t,e.modalClass,e.modalFade),e.lockScroll&&(this.bodyOverflow||(this.bodyPaddingRight=document.body.style.paddingRight,this.bodyOverflow=document.body.style.overflow),f=p(),f>0&&(document.body.style.paddingRight=f+"px"),document.body.style.overflow="hidden")),"static"===getComputedStyle(t).position&&(t.style.position="absolute"),o?t.style.zIndex=r["default"].nextZIndex():n&&(t.style.zIndex=n),this.opened=!0,this.onOpen&&this.onOpen(),this.transition||this.doAfterOpen()}},doAfterOpen:function(){this._opening=!1},close:function(){var e=this;if(!this.willClose||this.willClose()){null!==this._openTimer&&(clearTimeout(this._openTimer),this._openTimer=null),clearTimeout(this._closeTimer);var t=Number(this.closeDelay);t>0?this._closeTimer=setTimeout(function(){e._closeTimer=null,e.doClose()},t):this.doClose()}},doClose:function(){var e=this;this.$emit("input",!1),this._closing=!0,this.onClose&&this.onClose(),this.lockScroll&&setTimeout(function(){e.modal&&"hidden"!==e.bodyOverflow&&(document.body.style.overflow=e.bodyOverflow,document.body.style.paddingRight=e.bodyPaddingRight),e.bodyOverflow=null,e.bodyPaddingRight=null},200),this.opened=!1,this.transition||this.doAfterClose()},doAfterClose:function(){r["default"].closeModal(this._popupId),this._closing=!1}}}},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=function(){var e=i.modalDom;return e||(e=document.createElement("div"),i.modalDom=e,e.addEventListener("touchmove",function(e){e.preventDefault(),e.stopPropagation()}),e.addEventListener("click",function(){i.doOnModalClick&&i.doOnModalClick()})),e},n={},i={zIndex:1e3,modalFade:!0,getInstance:function(e){return n[e]},register:function(e,t){e&&t&&(n[e]=t)},deregister:function(e){e&&(n[e]=null,delete n[e])},nextZIndex:function(){return i.zIndex++},modalStack:[],doOnModalClick:function(){var e=i.modalStack[i.modalStack.length-1];if(e){var t=i.getInstance(e.id);t&&t.closeOnClickModal&&t.close()}},openModal:function(e,t,n,i,l){if(e&&void 0!==t){this.modalFade=l;for(var d=this.modalStack,s=0,r=d.length;s<r;s++){var a=d[s];if(a.id===e)return}var u=o();if(u.classList.add("v-modal"),this.modalFade&&u.classList.add("v-modal-enter"),i){var c=i.trim().split(/\s+/);c.forEach(function(e){return u.classList.add(e)})}setTimeout(function(){u.classList.remove("v-modal-enter")},200),n&&n.parentNode&&11!==n.parentNode.nodeType?n.parentNode.appendChild(u):document.body.appendChild(u),t&&(u.style.zIndex=t),u.style.display="",this.modalStack.push({id:e,zIndex:t,modalClass:i})}},closeModal:function(e){var t=this.modalStack,n=o();if(t.length>0){var i=t[t.length-1];if(i.id===e){if(i.modalClass){var l=i.modalClass.trim().split(/\s+/);l.forEach(function(e){return n.classList.remove(e)})}t.pop(),t.length>0&&(n.style.zIndex=t[t.length-1].zIndex)}else for(var d=t.length-1;d>=0;d--)if(t[d].id===e){t.splice(d,1);break}}0===t.length&&(this.modalFade&&n.classList.add("v-modal-leave"),setTimeout(function(){0===t.length&&(n.parentNode&&n.parentNode.removeChild(n),n.style.display="none"),n.classList.remove("v-modal-leave")},200))}};window.addEventListener("keydown",function(e){if(27===e.keyCode&&i.modalStack.length>0){var t=i.modalStack[i.modalStack.length-1];if(!t)return;var o=i.getInstance(t.id);o.closeOnPressEscape&&o.close()}}),t["default"]=i},function(e,t){"use strict";function o(e){for(var t=1,o=arguments.length;t<o;t++){var n=arguments[t];for(var i in n)if(n.hasOwnProperty(i)){var l=n[i];void 0!==l&&(e[i]=l)}}return e}Object.defineProperty(t,"__esModule",{value:!0}),t.merge=o},function(e,t){},function(t,o){t.exports=e},function(e,t,o){e.exports=o(0)}])});
	//# sourceMappingURL=index.js.map

/***/ },
/* 42 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('transition', {
	    attrs: {
	      "name": "dialog-fade"
	    }
	  }, [_h('div', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (value),
	      expression: "value"
	    }],
	    staticClass: "el-dialog__wrapper",
	    on: {
	      "click": function($event) {
	        if ($event.target !== $event.currentTarget) return;
	        handleWrapperClick($event)
	      }
	    }
	  }, [_h('div', {
	    ref: "dialog",
	    staticClass: "el-dialog",
	    class: [sizeClass, customClass],
	    style: (style)
	  }, [_h('div', {
	    staticClass: "el-dialog__header"
	  }, [_h('span', {
	    staticClass: "el-dialog__title"
	  }, [_s(title)]), " ", _h('div', {
	    staticClass: "el-dialog__headerbtn"
	  }, [_h('i', {
	    staticClass: "el-dialog__close el-icon el-icon-close",
	    on: {
	      "click": function($event) {
	        close()
	      }
	    }
	  })])]), " ", (rendered) ? _h('div', {
	    staticClass: "el-dialog__body"
	  }, [_t("default")]) : _e(), " ", ($slots.footer) ? _h('div', {
	    staticClass: "el-dialog__footer"
	  }, [_t("footer")]) : _e()])])])
	}},staticRenderFns: []}

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ElAutocomplete = __webpack_require__(44);

	ElAutocomplete.install = function (Vue) {
	  Vue.component(ElAutocomplete.name, ElAutocomplete);
	};

	module.exports = ElAutocomplete;

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(45)

	/* template */
	var __vue_template__ = __webpack_require__(46)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _index = __webpack_require__(19);

	var _index2 = _interopRequireDefault(_index);

	var _clickoutside = __webpack_require__(30);

	var _clickoutside2 = _interopRequireDefault(_clickoutside);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  name: 'ElAutocomplete',

	  components: {
	    ElInput: _index2.default
	  },
	  directives: { Clickoutside: _clickoutside2.default },
	  props: {
	    placeholder: String,
	    disabled: Boolean,
	    name: String,
	    value: String,
	    fetchSuggestions: Function,
	    triggerOnFocus: {
	      type: Boolean,
	      default: true
	    },
	    customItem: String
	  },
	  data: function data() {
	    return {
	      suggestions: [],
	      suggestionVisible: false,
	      loading: false,
	      highlightedIndex: -1
	    };
	  },

	  methods: {
	    handleChange: function handleChange(value) {
	      this.$emit('input', value);
	      this.showSuggestions(value);
	    },
	    handleFocus: function handleFocus() {
	      if (this.triggerOnFocus) {
	        this.showSuggestions(this.value);
	      }
	    },
	    handleBlur: function handleBlur() {
	      this.hideSuggestions();
	    },
	    select: function select(index) {
	      var _this = this;

	      if (this.suggestions && this.suggestions[index]) {
	        this.$emit('input', this.suggestions[index].value);
	        this.$emit('select', this.suggestions[index]);
	        this.$nextTick(function () {
	          _this.hideSuggestions();
	        });
	      }
	    },
	    hideSuggestions: function hideSuggestions() {
	      this.suggestionVisible = false;
	      this.suggestions = [];
	      this.loading = false;
	    },
	    showSuggestions: function showSuggestions(value) {
	      var _this2 = this;

	      this.suggestionVisible = true;
	      this.loading = true;
	      this.fetchSuggestions(value, function (suggestions) {
	        _this2.loading = false;
	        if (Array.isArray(suggestions) && suggestions.length > 0) {
	          _this2.suggestions = suggestions;
	        } else {
	          _this2.hideSuggestions();
	        }
	      });
	    },
	    highlight: function highlight(index) {
	      if (!this.suggestionVisible || this.loading) {
	        return;
	      }
	      if (index < 0) {
	        index = 0;
	      } else if (index >= this.suggestions.length) {
	        index = this.suggestions.length - 1;
	      }

	      var elSuggestions = this.$refs.suggestions;
	      var elSelect = elSuggestions.children[index];
	      var scrollTop = elSuggestions.scrollTop;
	      var offsetTop = elSelect.offsetTop;

	      if (offsetTop + elSelect.scrollHeight > scrollTop + elSuggestions.clientHeight) {
	        elSuggestions.scrollTop += elSelect.scrollHeight;
	      }
	      if (offsetTop < scrollTop) {
	        elSuggestions.scrollTop -= elSelect.scrollHeight;
	      }

	      this.highlightedIndex = index;
	    }
	  }
	};

/***/ },
/* 46 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('div', {
	    directives: [{
	      name: "clickoutside",
	      rawName: "v-clickoutside",
	      value: (handleBlur),
	      expression: "handleBlur"
	    }],
	    staticClass: "el-autocomplete"
	  }, [_h('el-input', {
	    attrs: {
	      "disabled": disabled,
	      "placeholder": placeholder,
	      "name": name
	    },
	    domProps: {
	      "value": value
	    },
	    on: {
	      "change": handleChange,
	      "focus": handleFocus
	    },
	    nativeOn: {
	      "keydown": [function($event) {
	        if ($event.keyCode !== 38) return;
	        highlight(highlightedIndex - 1)
	      }, function($event) {
	        if ($event.keyCode !== 40) return;
	        highlight(highlightedIndex + 1)
	      }, function($event) {
	        if ($event.keyCode !== 13) return;
	        select(highlightedIndex)
	      }]
	    }
	  }), " ", _h('transition', {
	    attrs: {
	      "name": "md-fade-bottom"
	    }
	  }, [(suggestionVisible) ? _h('ul', {
	    ref: "suggestions",
	    staticClass: "el-autocomplete__suggestions",
	    class: {
	      'is-loading': loading
	    }
	  }, [(loading) ? _h('li', [_m(0)]) : _l((suggestions), function(item, index) {
	    return [(!customItem) ? _h('li', {
	      class: {
	        'highlighted': highlightedIndex === index
	      },
	      on: {
	        "click": function($event) {
	          select(index)
	        }
	      }
	    }, ["\n          " + _s(item.value) + "\n        "]) : _h(customItem, {
	      tag: "component",
	      class: {
	        'highlighted': highlightedIndex === index
	      },
	      attrs: {
	        "item": item,
	        "index": index
	      },
	      on: {
	        "click": function($event) {
	          select(index)
	        }
	      }
	    }), " "]
	  }), " "]) : _e()])])
	}},staticRenderFns: [function (){with(this) {
	  return _h('i', {
	    staticClass: "el-icon-loading"
	  })
	}}]}

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ElDropdown = __webpack_require__(48);

	ElDropdown.install = function (Vue) {
	  Vue.component(ElDropdown.name, ElDropdown);
	};

	module.exports = ElDropdown;

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(49)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}

	module.exports = __vue_exports__


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _clickoutside = __webpack_require__(30);

	var _clickoutside2 = _interopRequireDefault(_clickoutside);

	var _emitter = __webpack_require__(18);

	var _emitter2 = _interopRequireDefault(_emitter);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  name: 'ElDropdown',

	  mixins: [_emitter2.default],

	  directives: { Clickoutside: _clickoutside2.default },

	  props: {
	    trigger: {
	      type: String,
	      default: 'hover'
	    },
	    menuAlign: {
	      type: String,
	      default: 'end'
	    },
	    type: String,
	    size: String,
	    splitButton: Boolean
	  },

	  data: function data() {
	    return {
	      timeout: null,
	      visible: false
	    };
	  },
	  mounted: function mounted() {
	    this.initEvent();
	  },


	  watch: {
	    visible: function visible(val) {
	      this.broadcast('ElDropdownMenu', 'visible', val);
	    }
	  },

	  methods: {
	    show: function show() {
	      var _this = this;

	      clearTimeout(this.timeout);
	      this.timeout = setTimeout(function () {
	        _this.visible = true;
	      }, 250);
	    },
	    hide: function hide() {
	      var _this2 = this;

	      clearTimeout(this.timeout);
	      this.timeout = setTimeout(function () {
	        _this2.visible = false;
	      }, 150);
	    },
	    handleClick: function handleClick() {
	      this.visible = !this.visible;
	    },
	    initEvent: function initEvent() {
	      var trigger = this.trigger;
	      var show = this.show;
	      var hide = this.hide;
	      var handleClick = this.handleClick;
	      var splitButton = this.splitButton;

	      var triggerElm = splitButton ? this.$refs.trigger.$el : this.$slots.default[0].elm;

	      if (trigger === 'hover') {
	        triggerElm.addEventListener('mouseenter', show);
	        triggerElm.addEventListener('mouseleave', hide);

	        var dropdownElm = this.$slots.dropdown[0].elm;

	        dropdownElm.addEventListener('mouseenter', show);
	        dropdownElm.addEventListener('mouseleave', hide);
	      } else if (trigger === 'click') {
	        triggerElm.addEventListener('click', handleClick);
	      }
	    }
	  },

	  render: function render(h) {
	    var _this3 = this;

	    var hide = this.hide;
	    var splitButton = this.splitButton;
	    var type = this.type;
	    var size = this.size;


	    var handleClick = function handleClick(_) {
	      _this3.$emit('click');
	    };

	    var triggerElm = !splitButton ? this.$slots.default : h(
	      'el-button-group',
	      null,
	      [h(
	        'el-button',
	        {
	          attrs: { type: type, size: size },
	          nativeOn: {
	            click: handleClick
	          }
	        },
	        [this.$slots.default]
	      ), h(
	        'el-button',
	        { ref: 'trigger', attrs: { type: type, size: size },
	          'class': 'el-dropdown__caret-button' },
	        [h(
	          'i',
	          { 'class': 'el-dropdown__icon el-icon-caret-bottom' },
	          []
	        )]
	      )]
	    );

	    return h(
	      'div',
	      { 'class': 'el-dropdown', directives: [{
	          name: 'clickoutside',
	          value: hide
	        }]
	      },
	      [triggerElm, this.$slots.dropdown]
	    );
	  }
	};

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ElDropdownMenu = __webpack_require__(51);

	ElDropdownMenu.install = function (Vue) {
	  Vue.component(ElDropdownMenu.name, ElDropdownMenu);
	};

	module.exports = ElDropdownMenu;

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(52)

	/* template */
	var __vue_template__ = __webpack_require__(53)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _vuePopper = __webpack_require__(5);

	var _vuePopper2 = _interopRequireDefault(_vuePopper);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  name: 'ElDropdownMenu',

	  componentName: 'ElDropdownMenu',

	  mixins: [_vuePopper2.default],

	  created: function created() {
	    var _this = this;

	    this.$on('visible', function (val) {
	      _this.showPopper = val;
	    });
	  },
	  mounted: function mounted() {
	    this.$parent.popperElm = this.popperElm = this.$el;
	    this.referenceElm = this.$parent.$el;
	  },


	  computed: {
	    placement: function placement() {
	      return 'bottom-' + this.$parent.menuAlign;
	    }
	  }
	};

/***/ },
/* 53 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('transition', {
	    attrs: {
	      "name": "md-fade-bottom"
	    },
	    on: {
	      "after-leave": doDestroy
	    }
	  }, [_h('ul', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (showPopper),
	      expression: "showPopper"
	    }],
	    staticClass: "el-dropdown__menu"
	  }, [_t("default")])])
	}},staticRenderFns: []}

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ElDropdownItem = __webpack_require__(55);

	ElDropdownItem.install = function (Vue) {
	  Vue.component(ElDropdownItem.name, ElDropdownItem);
	};

	module.exports = ElDropdownItem;

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(56)

	/* template */
	var __vue_template__ = __webpack_require__(57)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _emitter = __webpack_require__(18);

	var _emitter2 = _interopRequireDefault(_emitter);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  name: 'ElDropdownItem',

	  mixins: [_emitter2.default],

	  methods: {
	    handleClick: function handleClick(e) {
	      this.dispatch('ElDropdownMenu', 'visible', [false]);
	    }
	  }
	};

/***/ },
/* 57 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('li', {
	    staticClass: "el-dropdown-item",
	    on: {
	      "click": handleClick
	    }
	  }, [_t("default")])
	}},staticRenderFns: []}

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ElMenu = __webpack_require__(59);

	ElMenu.install = function (Vue) {
	  Vue.component(ElMenu.name, ElMenu);
	};

	module.exports = ElMenu;

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(60)

	/* template */
	var __vue_template__ = __webpack_require__(61)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _emitter = __webpack_require__(18);

	var _emitter2 = _interopRequireDefault(_emitter);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  name: 'ElMenu',

	  componentName: 'menu',

	  mixins: [_emitter2.default],

	  props: {
	    mode: {
	      type: String,
	      default: 'vertical'
	    },
	    defaultActive: {
	      type: String,
	      default: ''
	    },
	    defaultOpeneds: Array,
	    theme: {
	      type: String,
	      default: 'light'
	    },
	    uniqueOpened: Boolean,
	    router: Boolean
	  },
	  data: function data() {
	    return {
	      activeIndex: this.defaultActive,
	      openedMenus: this.defaultOpeneds ? this.defaultOpeneds.slice(0) : [],
	      menuItems: {},
	      submenus: {}
	    };
	  },

	  watch: {
	    defaultActive: function defaultActive(value) {
	      this.activeIndex = value;
	      var indexPath = this.menuItems[value].indexPath;

	      this.handleSelect(value, indexPath);
	    },
	    defaultOpeneds: function defaultOpeneds(value) {
	      this.openedMenus = value;
	    }
	  },
	  methods: {
	    openMenu: function openMenu(index, indexPath) {
	      var openedMenus = this.openedMenus;
	      if (openedMenus.indexOf(index) !== -1) return;

	      if (this.uniqueOpened) {
	        this.openedMenus = openedMenus.filter(function (index) {
	          return indexPath.indexOf(index) !== -1;
	        });
	      }
	      this.openedMenus.push(index);
	    },
	    closeMenu: function closeMenu(index, indexPath) {
	      this.openedMenus.splice(this.openedMenus.indexOf(index), 1);
	    },
	    handleSubmenuClick: function handleSubmenuClick(index, indexPath) {
	      var isOpened = this.openedMenus.indexOf(index) !== -1;

	      if (isOpened) {
	        this.closeMenu(index, indexPath);
	        this.$emit('close', index, indexPath);
	      } else {
	        this.openMenu(index, indexPath);
	        this.$emit('open', index, indexPath);
	      }
	    },
	    handleSelect: function handleSelect(index, indexPath, route) {
	      this.activeIndex = index;
	      this.$emit('select', index, indexPath);

	      if (this.mode === 'horizontal') {
	        this.broadcast('submenu', 'item-select', [index, indexPath]);
	        this.openedMenus = [];
	      } else {
	        this.openActiveItemMenus();
	      }

	      if (this.router && route) {
	        this.$router.push(route);
	      }
	    },
	    openActiveItemMenus: function openActiveItemMenus() {
	      var _this = this;

	      var index = this.activeIndex;
	      if (index && this.mode === 'vertical') {
	        var indexPath = this.menuItems[index].indexPath;

	        indexPath.forEach(function (index) {
	          var submenu = _this.submenus[index];
	          submenu && _this.openMenu(index, submenu.indexPath);
	        });
	      }
	    }
	  },
	  mounted: function mounted() {
	    this.openActiveItemMenus();
	  }
	};

/***/ },
/* 61 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('ul', {
	    staticClass: "el-menu",
	    class: {
	      'el-menu--horizontal': mode === 'horizontal',
	        'el-menu--dark': theme === 'dark'
	    }
	  }, [_t("default")])
	}},staticRenderFns: []}

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ElSubmenu = __webpack_require__(63);

	ElSubmenu.install = function (Vue) {
	  Vue.component(ElSubmenu.name, ElSubmenu);
	};

	module.exports = ElSubmenu;

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(64)

	/* template */
	var __vue_template__ = __webpack_require__(66)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _menuMixin = __webpack_require__(65);

	var _menuMixin2 = _interopRequireDefault(_menuMixin);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	module.exports = {
	  name: 'el-submenu',

	  componentName: 'submenu',

	  mixins: [_menuMixin2.default],

	  props: {
	    index: {
	      type: String,
	      required: true
	    }
	  },
	  data: function data() {
	    return {
	      timeout: null,
	      active: false
	    };
	  },

	  computed: {
	    opened: function opened() {
	      return this.rootMenu.openedMenus.indexOf(this.index) !== -1;
	    }
	  },
	  methods: {
	    handleClick: function handleClick() {
	      this.rootMenu.handleSubmenuClick(this.index, this.indexPath);
	    },
	    handleMouseenter: function handleMouseenter() {
	      var _this = this;

	      if (this.rootMenu.mode === 'horizontal') {
	        clearTimeout(this.timeout);
	        this.timeout = setTimeout(function () {
	          _this.rootMenu.openMenu(_this.index, _this.indexPath);
	        }, 300);
	      }
	    },
	    handleMouseleave: function handleMouseleave() {
	      var _this2 = this;

	      if (this.rootMenu.mode === 'horizontal') {
	        clearTimeout(this.timeout);
	        this.timeout = setTimeout(function () {
	          _this2.rootMenu.closeMenu(_this2.index, _this2.indexPath);
	        }, 300);
	      }
	    }
	  },
	  created: function created() {
	    this.rootMenu.submenus[this.index] = this;
	  },
	  mounted: function mounted() {
	    var _this3 = this;

	    this.$on('item-select', function (index, indexPath) {
	      _this3.active = indexPath.indexOf(_this3.index) !== -1;
	    });
	  }
	};

/***/ },
/* 65 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  computed: {
	    indexPath: function indexPath() {
	      var path = [this.index];
	      var parent = this.$parent;
	      while (parent.$options._componentTag !== 'el-menu') {
	        if (parent.index) {
	          path.unshift(parent.index);
	        }
	        parent = parent.$parent;
	      }
	      return path;
	    },
	    rootMenu: function rootMenu() {
	      var parent = this.$parent;
	      while (parent.$options._componentTag !== 'el-menu') {
	        parent = parent.$parent;
	      }
	      return parent;
	    }
	  }
	};

/***/ },
/* 66 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('li', {
	    class: {
	      'el-submenu': true, 'is-active': active, 'is-opened': opened
	    },
	    on: {
	      "mouseenter": handleMouseenter,
	      "mouseleave": handleMouseleave
	    }
	  }, [_h('div', {
	    staticClass: "el-submenu__title",
	    on: {
	      "click": handleClick
	    }
	  }, [_t("title"), " ", _h('i', {
	    class: {
	      'el-submenu__icon-arrow': true,
	      'el-icon-arrow-down': rootMenu.mode === 'vertical',
	        'el-icon-caret-bottom': rootMenu.mode === 'horizontal'
	    }
	  })]), " ", _h('transition', {
	    attrs: {
	      "name": rootMenu.mode === 'horizontal' ? 'md-fade-bottom' : ''
	    }
	  }, [_h('ul', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (opened),
	      expression: "opened"
	    }],
	    staticClass: "el-menu"
	  }, [_t("default")])])])
	}},staticRenderFns: []}

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ElMenuItem = __webpack_require__(68);

	ElMenuItem.install = function (Vue) {
	  Vue.component(ElMenuItem.name, ElMenuItem);
	};

	module.exports = ElMenuItem;

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(69)

	/* template */
	var __vue_template__ = __webpack_require__(70)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _menuMixin = __webpack_require__(65);

	var _menuMixin2 = _interopRequireDefault(_menuMixin);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	module.exports = {
	  name: 'el-menu-item',

	  componentName: 'menu-item',

	  mixins: [_menuMixin2.default],

	  props: {
	    index: {
	      type: String,
	      required: true
	    },
	    route: {
	      type: Object,
	      required: false
	    },
	    disabled: {
	      type: Boolean,
	      required: false
	    }
	  },
	  computed: {
	    active: function active() {
	      return this.index === this.rootMenu.activeIndex;
	    }
	  },
	  methods: {
	    handleClick: function handleClick() {
	      this.rootMenu.handleSelect(this.index, this.indexPath, this.route || this.index);
	    }
	  },
	  created: function created() {
	    this.rootMenu.menuItems[this.index] = this;
	  }
	};

/***/ },
/* 70 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('li', {
	    staticClass: "el-menu-item",
	    class: {
	      'is-active': active,
	      'is-disabled': disabled
	    },
	    on: {
	      "click": handleClick
	    }
	  }, [_t("default")])
	}},staticRenderFns: []}

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ElMenuItemGroup = __webpack_require__(72);

	ElMenuItemGroup.install = function (Vue) {
	  Vue.component(ElMenuItemGroup.name, ElMenuItemGroup);
	};

	module.exports = ElMenuItemGroup;

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(73)

	/* template */
	var __vue_template__ = __webpack_require__(74)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 73 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  name: 'el-menu-item-group',

	  componentName: 'menu-item-group',

	  props: {
	    title: {
	      type: String,
	      required: true
	    }
	  },
	  data: function data() {
	    return {
	      paddingLeft: 20
	    };
	  },

	  methods: {
	    initPadding: function initPadding() {
	      var parent = this.$parent;
	      var level = 0;
	      var componentTag = parent.$options._componentTag;

	      while (componentTag !== 'el-menu') {
	        if (componentTag === 'el-submenu') {
	          level++;
	        }
	        parent = parent.$parent;
	        componentTag = parent.$options._componentTag;
	      }
	      this.paddingLeft += level * 10;
	    }
	  },
	  mounted: function mounted() {
	    this.initPadding();
	  }
	};

/***/ },
/* 74 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('li', {
	    staticClass: "el-menu-item-group"
	  }, [_h('div', {
	    staticClass: "el-menu-item-group__title",
	    style: ({
	      'padding-left': paddingLeft + 'px'
	    })
	  }, [_s(title)]), " ", _h('ul', [_t("default")])])
	}},staticRenderFns: []}

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ElInputNumber = __webpack_require__(76);

	ElInputNumber.install = function (Vue) {
	  Vue.component(ElInputNumber.name, ElInputNumber);
	};

	module.exports = ElInputNumber;

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(77)

	/* template */
	var __vue_template__ = __webpack_require__(79)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _index = __webpack_require__(19);

	var _index2 = _interopRequireDefault(_index);

	var _event = __webpack_require__(78);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  name: 'ElInputNumber',
	  props: {
	    value: {
	      default: 1
	    },
	    step: {
	      type: Number,
	      default: 1
	    },
	    max: {
	      type: Number,
	      default: Infinity
	    },
	    min: {
	      type: Number,
	      default: 0
	    },
	    disabled: Boolean,
	    size: String
	  },
	  directives: {
	    repeatClick: {
	      bind: function bind(el, binding, vnode) {
	        var interval = null;
	        var startTime = void 0;

	        var handler = function handler() {
	          vnode.context[binding.expression]();
	        };

	        var clear = function clear() {
	          if (new Date() - startTime < 100) {
	            handler();
	          }
	          clearInterval(interval);
	          interval = null;
	        };

	        (0, _event.on)(el, 'mousedown', function () {
	          startTime = new Date();
	          (0, _event.once)(document, 'mouseup', clear);
	          interval = setInterval(function () {
	            handler();
	          }, 100);
	        });
	      }
	    }
	  },
	  components: {
	    ElInput: _index2.default
	  },
	  data: function data() {
	    return {
	      currentValue: this.value,
	      inputActive: false
	    };
	  },

	  watch: {
	    value: function value(val) {
	      this.currentValue = val;
	    },
	    currentValue: function currentValue(newVal, oldVal) {
	      var _this = this;

	      if (!isNaN(newVal) && newVal <= this.max && newVal >= this.min) {
	        this.$emit('change', newVal);
	        this.$emit('input', newVal);
	      } else {
	        this.$nextTick(function () {
	          _this.currentValue = oldVal;
	        });
	      }
	    }
	  },
	  computed: {
	    minDisabled: function minDisabled() {
	      return this.currentValue - this.step < this.min;
	    },
	    maxDisabled: function maxDisabled() {
	      return this.currentValue + this.step > this.max;
	    }
	  },
	  methods: {
	    accSub: function accSub(arg1, arg2) {
	      var r1, r2, m, n;
	      try {
	        r1 = arg1.toString().split('.')[1].length;
	      } catch (e) {
	        r1 = 0;
	      }
	      try {
	        r2 = arg2.toString().split('.')[1].length;
	      } catch (e) {
	        r2 = 0;
	      }
	      m = Math.pow(10, Math.max(r1, r2));
	      n = r1 >= r2 ? r1 : r2;
	      return parseFloat(((arg1 * m - arg2 * m) / m).toFixed(n));
	    },
	    accAdd: function accAdd(arg1, arg2) {
	      var r1, r2, m, c;
	      try {
	        r1 = arg1.toString().split('.')[1].length;
	      } catch (e) {
	        r1 = 0;
	      }
	      try {
	        r2 = arg2.toString().split('.')[1].length;
	      } catch (e) {
	        r2 = 0;
	      }
	      c = Math.abs(r1 - r2);
	      m = Math.pow(10, Math.max(r1, r2));
	      if (c > 0) {
	        var cm = Math.pow(10, c);
	        if (r1 > r2) {
	          arg1 = Number(arg1.toString().replace('.', ''));
	          arg2 = Number(arg2.toString().replace('.', '')) * cm;
	        } else {
	          arg1 = Number(arg1.toString().replace('.', '')) * cm;
	          arg2 = Number(arg2.toString().replace('.', ''));
	        }
	      } else {
	        arg1 = Number(arg1.toString().replace('.', ''));
	        arg2 = Number(arg2.toString().replace('.', ''));
	      }
	      return (arg1 + arg2) / m;
	    },
	    increase: function increase() {
	      if (this.currentValue + this.step > this.max || this.disabled) return;
	      this.currentValue = this.accAdd(this.step, this.currentValue);
	      if (this.maxDisabled) {
	        this.inputActive = false;
	      }
	    },
	    decrease: function decrease() {
	      if (this.currentValue - this.step < this.min || this.disabled) return;
	      this.currentValue = this.accSub(this.currentValue, this.step);
	      if (this.minDisabled) {
	        this.inputActive = false;
	      }
	    },
	    activeInput: function activeInput(disabled) {
	      if (!this.disabled && !disabled) {
	        this.inputActive = true;
	      }
	    },
	    inactiveInput: function inactiveInput(disabled) {
	      if (!this.disabled && !disabled) {
	        this.inputActive = false;
	      }
	    }
	  }
	};

/***/ },
/* 78 */
/***/ function(module, exports) {

	var bindEvent = (function() {
	  if(document.addEventListener) {
	    return function(element, event, handler) {
	      if (element && event && handler) {
	        element.addEventListener(event, handler, false);
	      }
	    };
	  } else {
	    return function(element, event, handler) {
	      if (element && event && handler) {
	        element.attachEvent('on' + event, handler);
	      }
	    };
	  }
	})();

	var unbindEvent = (function() {
	  if(document.removeEventListener) {
	    return function(element, event, handler) {
	      if (element && event) {
	        element.removeEventListener(event, handler, false);
	      }
	    };
	  } else {
	    return function(element, event, handler) {
	      if (element && event) {
	        element.detachEvent('on' + event, handler);
	      }
	    };
	  }
	})();

	var bindOnce = function(el, event, fn) {
	  var listener = function() {
	    if (fn) {
	      fn.apply(this, arguments);
	    }
	    unbindEvent(el, event, listener);
	  };
	  bindEvent(el, event, listener);
	};

	module.exports = {
	  on: bindEvent,
	  off: unbindEvent,
	  once: bindOnce
	};

/***/ },
/* 79 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('div', {
	    staticClass: "el-input-number",
	    class: [
	      size ? 'is-' + size : '', {
	        'is-disabled': disabled
	      }
	    ]
	  }, [_h('el-input', {
	    directives: [{
	      name: "model",
	      rawName: "v-model",
	      value: (currentValue),
	      expression: "currentValue"
	    }],
	    class: {
	      'is-active': inputActive
	    },
	    attrs: {
	      "disabled": disabled,
	      "size": size,
	      "number": true
	    },
	    domProps: {
	      "value": (currentValue)
	    },
	    on: {
	      "input": function($event) {
	        currentValue = $event
	      }
	    }
	  }), " ", _h('span', {
	    directives: [{
	      name: "repeat-click",
	      rawName: "v-repeat-click",
	      value: (decrease),
	      expression: "decrease"
	    }],
	    staticClass: "el-input-number__decrease el-icon-minus",
	    class: {
	      'is-disabled': minDisabled
	    },
	    on: {
	      "mouseenter": function($event) {
	        activeInput(minDisabled)
	      },
	      "mouseleave": function($event) {
	        inactiveInput(minDisabled)
	      }
	    }
	  }), " ", _h('span', {
	    directives: [{
	      name: "repeat-click",
	      rawName: "v-repeat-click",
	      value: (increase),
	      expression: "increase"
	    }],
	    staticClass: "el-input-number__increase el-icon-plus",
	    class: {
	      'is-disabled': maxDisabled
	    },
	    on: {
	      "mouseenter": function($event) {
	        activeInput(maxDisabled)
	      },
	      "mouseleave": function($event) {
	        inactiveInput(maxDisabled)
	      }
	    }
	  })])
	}},staticRenderFns: []}

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ElRadio = __webpack_require__(81);

	ElRadio.install = function (Vue) {
	  Vue.component('el-radio', ElRadio);
	};

	module.exports = ElRadio;

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(82)

	/* template */
	var __vue_template__ = __webpack_require__(83)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 82 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports.default = {
	  name: 'ElRadio',

	  props: {
	    value: [String, Number],
	    label: {
	      type: [String, Number],
	      required: true
	    },
	    disabled: Boolean,
	    name: String
	  },
	  data: function data() {
	    return {
	      focus: false
	    };
	  },

	  computed: {
	    _value: {
	      get: function get() {
	        return this.value !== undefined ? this.value : this.$parent.value;
	      },
	      set: function set(newValue) {
	        if (this.value !== undefined) {
	          this.$emit('input', newValue);
	        } else {
	          this.$parent.$emit('input', newValue);
	        }
	      }
	    }
	  }
	};

/***/ },
/* 83 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('label', {
	    staticClass: "el-radio"
	  }, [_h('span', {
	    staticClass: "el-radio__input"
	  }, [_h('span', {
	    staticClass: "el-radio__inner",
	    class: {
	      'is-disabled': disabled,
	      'is-checked': _value === label,
	        'is-focus': focus
	    }
	  }), " ", _h('input', {
	    staticClass: "el-radio__original",
	    attrs: {
	      "type": "radio",
	      "name": name,
	      "disabled": disabled
	    },
	    domProps: {
	      "value": label,
	      "checked": _q(_value, label)
	    },
	    on: {
	      "focus": function($event) {
	        focus = true
	      },
	      "blur": function($event) {
	        focus = false
	      },
	      "change": function($event) {
	        _value = label
	      }
	    }
	  })]), " ", _h('span', {
	    staticClass: "el-radio__label"
	  }, [_t("default"), " ", (!$slots.default) ? [_s(label)] : _e()])])
	}},staticRenderFns: []}

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var RadioGroup = __webpack_require__(85);

	RadioGroup.install = function (Vue) {
	  Vue.component(RadioGroup.name, RadioGroup);
	};

	module.exports = RadioGroup;

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(86)

	/* template */
	var __vue_template__ = __webpack_require__(87)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _emitter = __webpack_require__(18);

	var _emitter2 = _interopRequireDefault(_emitter);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  name: 'ElRadioGroup',

	  componentName: 'radio-group',

	  mixins: [_emitter2.default],

	  props: {
	    value: [String, Number],
	    size: String
	  },
	  watch: {
	    value: function value(_value) {
	      this.$emit('change', _value);
	      this.dispatch('form-item', 'el.form.change', [this.value]);
	    }
	  }
	};

/***/ },
/* 87 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('div', {
	    staticClass: "el-radio-group"
	  }, [_t("default")])
	}},staticRenderFns: []}

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var RadioButton = __webpack_require__(89);

	RadioButton.install = function (Vue) {
	  Vue.component(RadioButton.name, RadioButton);
	};

	module.exports = RadioButton;

/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(90)

	/* template */
	var __vue_template__ = __webpack_require__(91)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 90 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports.default = {
	  name: 'ElRadioButton',

	  props: {
	    label: {
	      type: [String, Number],
	      required: true
	    },
	    disabled: Boolean,
	    name: String
	  },
	  data: function data() {
	    return {
	      size: this.$parent.size
	    };
	  },

	  computed: {
	    value: {
	      get: function get() {
	        return this.$parent.value;
	      },
	      set: function set(newValue) {
	        this.$parent.$emit('input', newValue);
	      }
	    }
	  }
	};

/***/ },
/* 91 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('label', {
	    staticClass: "el-radio-button",
	    class: [
	      size ? 'el-radio-button-' + size : '', {
	        'is-active': value === label
	      }
	    ]
	  }, [_h('input', {
	    staticClass: "el-radio-button__orig-radio",
	    attrs: {
	      "type": "radio",
	      "name": name,
	      "disabled": disabled
	    },
	    domProps: {
	      "value": label,
	      "checked": _q(value, label)
	    },
	    on: {
	      "change": function($event) {
	        value = label
	      }
	    }
	  }), " ", _h('span', {
	    staticClass: "el-radio-button__inner"
	  }, [_t("default"), " ", (!$slots.default) ? [_s(label)] : _e()])])
	}},staticRenderFns: []}

/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ElCheckbox = __webpack_require__(93);

	ElCheckbox.install = function (Vue) {
	  Vue.component('el-checkbox', ElCheckbox);
	};

	module.exports = ElCheckbox;

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(94)

	/* template */
	var __vue_template__ = __webpack_require__(95)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _emitter = __webpack_require__(18);

	var _emitter2 = _interopRequireDefault(_emitter);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  name: 'ElCheckbox',

	  mixins: [_emitter2.default],

	  props: {
	    value: {},
	    label: String,
	    indeterminate: Boolean,
	    disabled: Boolean,
	    checked: Boolean,
	    trueLabel: [String, Number],
	    falseLabel: [String, Number]
	  },

	  computed: {
	    _value: {
	      get: function get() {
	        return !this.wrapInGroup ? this.value : this.$parent.value;
	      },
	      set: function set(newValue) {
	        if (!this.wrapInGroup) {
	          this.$emit('input', newValue);
	        } else {
	          this.$parent.$emit('input', newValue);
	        }
	      }
	    },
	    isChecked: function isChecked() {
	      var type = Object.prototype.toString.call(this._value);

	      if (type === '[object Boolean]') {
	        return this._value;
	      } else if (type === '[object Array]') {
	        return this._value.indexOf(this.label) > -1;
	      } else if (type === '[object String]' || type === '[object Number]') {
	        return this._value === this.trueLabel;
	      }
	    }
	  },

	  data: function data() {
	    return {
	      focus: false,
	      wrapInGroup: this.$parent.$options._componentTag === 'el-checkbox-group'
	    };
	  },


	  watch: {
	    checked: {
	      immediate: true,
	      handler: function handler(value) {
	        if (value) {
	          var type = Object.prototype.toString.call(this._value);
	          if (type !== '[object Array]') {
	            this._value = this.trueLabel || true;
	          } else {
	            this._value.push(this.label);
	          }
	        }
	      }
	    }
	  },

	  methods: {
	    handleChange: function handleChange(ev) {
	      this.$emit('change', ev);
	    }
	  }
	};

/***/ },
/* 95 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('label', {
	    staticClass: "el-checkbox"
	  }, [_h('span', {
	    staticClass: "el-checkbox__input"
	  }, [_h('span', {
	    staticClass: "el-checkbox__inner",
	    class: {
	      'is-disabled': disabled,
	      'is-checked': isChecked,
	      'is-indeterminate': indeterminate,
	      'is-focus': focus
	    }
	  }), " ", (trueLabel || falseLabel) ? _h('input', {
	    ref: "checkbox",
	    staticClass: "el-checkbox__original",
	    attrs: {
	      "type": "checkbox",
	      "disabled": disabled,
	      "true-value": trueLabel,
	      "false-value": falseLabel
	    },
	    domProps: {
	      "checked": Array.isArray(_value) ? _i(_value, null) > -1 : _q(_value, trueLabel)
	    },
	    on: {
	      "focus": function($event) {
	        focus = true
	      },
	      "blur": function($event) {
	        focus = false
	      },
	      "change": [function($event) {
	        var $$a = _value,
	          $$el = $event.target,
	          $$c = $$el.checked ? (trueLabel) : (falseLabel);
	        if (Array.isArray($$a)) {
	          var $$v = null,
	            $$i = _i($$a, $$v);
	          if ($$c) {
	            $$i < 0 && (_value = $$a.concat($$v))
	          } else {
	            $$i > -1 && (_value = $$a.slice(0, $$i).concat($$a.slice($$i + 1)))
	          }
	        } else {
	          _value = $$c
	        }
	      }, handleChange]
	    }
	  }) : _h('input', {
	    staticClass: "el-checkbox__original",
	    attrs: {
	      "type": "checkbox",
	      "disabled": disabled
	    },
	    domProps: {
	      "value": label,
	      "checked": Array.isArray(_value) ? _i(_value, label) > -1 : _q(_value, true)
	    },
	    on: {
	      "focus": function($event) {
	        focus = true
	      },
	      "blur": function($event) {
	        focus = false
	      },
	      "change": [function($event) {
	        var $$a = _value,
	          $$el = $event.target,
	          $$c = $$el.checked ? (true) : (false);
	        if (Array.isArray($$a)) {
	          var $$v = label,
	            $$i = _i($$a, $$v);
	          if ($$c) {
	            $$i < 0 && (_value = $$a.concat($$v))
	          } else {
	            $$i > -1 && (_value = $$a.slice(0, $$i).concat($$a.slice($$i + 1)))
	          }
	        } else {
	          _value = $$c
	        }
	      }, handleChange]
	    }
	  }), " "]), " ", ($slots.default || label) ? _h('span', {
	    staticClass: "el-checkbox__label"
	  }, [_t("default"), " ", (!$slots.default) ? [_s(label)] : _e()]) : _e()])
	}},staticRenderFns: []}

/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ElCheckboxGroup = __webpack_require__(97);

	ElCheckboxGroup.install = function (Vue) {
	  Vue.component(ElCheckboxGroup.name, ElCheckboxGroup);
	};

	module.exports = ElCheckboxGroup;

/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(98)

	/* template */
	var __vue_template__ = __webpack_require__(99)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _emitter = __webpack_require__(18);

	var _emitter2 = _interopRequireDefault(_emitter);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  name: 'ElCheckboxGroup',

	  mixins: [_emitter2.default],

	  props: {
	    value: {}
	  },

	  watch: {
	    value: function value(_value) {
	      this.$emit('change', _value);
	      this.dispatch('form-item', 'el.form.change', [_value]);
	    }
	  }
	};

/***/ },
/* 99 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('div', {
	    staticClass: "el-checkbox-group"
	  }, [_t("default")])
	}},staticRenderFns: []}

/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ElSwitch = __webpack_require__(101);

	ElSwitch.install = function (Vue) {
	  Vue.component('el-switch', ElSwitch);
	};

	module.exports = ElSwitch;

/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(102)

	/* template */
	var __vue_template__ = __webpack_require__(103)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 102 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports.default = {
	  name: 'el-switch',
	  props: {
	    value: {
	      type: Boolean,
	      default: true
	    },
	    disabled: {
	      type: Boolean,
	      default: false
	    },
	    width: {
	      type: Number,
	      default: 0
	    },
	    onIconClass: {
	      type: String,
	      default: ''
	    },
	    offIconClass: {
	      type: String,
	      default: ''
	    },
	    onText: {
	      type: String,
	      default: 'ON'
	    },
	    offText: {
	      type: String,
	      default: 'OFF'
	    },
	    onColor: {
	      type: String,
	      default: ''
	    },
	    offColor: {
	      type: String,
	      default: ''
	    },
	    name: {
	      type: String,
	      default: ''
	    }
	  },
	  data: function data() {
	    return {
	      coreWidth: 0
	    };
	  },

	  computed: {
	    hasText: function hasText() {
	      return this.onText || this.offText;
	    }
	  },
	  watch: {
	    value: function value(val) {
	      if (this.onColor || this.offColor) {
	        this.handleCoreColor();
	      }
	      this.handleButtonTransform();
	      this.$emit('change', val);
	    }
	  },
	  methods: {
	    handleMiscClick: function handleMiscClick() {
	      if (!this.disabled) {
	        this.$emit('input', !this.value);
	      }
	    },
	    handleButtonTransform: function handleButtonTransform() {
	      this.$refs.button.style.transform = this.value ? 'translate3d(' + (this.coreWidth - 20) + 'px, 2px, 0)' : 'translate3d(2px, 2px, 0)';
	    },
	    handleCoreColor: function handleCoreColor() {
	      this.$refs.core.style.borderColor = this.value ? this.onColor : this.offColor;
	      this.$refs.core.style.backgroundColor = this.value ? this.onColor : this.offColor;
	    }
	  },
	  mounted: function mounted() {
	    if (this.width === 0) {
	      this.coreWidth = this.hasText ? 58 : 46;
	    }
	    this.handleButtonTransform();
	    if ((this.onColor || this.offColor) && !this.disabled) {
	      this.handleCoreColor();
	    }
	  }
	};

/***/ },
/* 103 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('div', {
	    staticClass: "el-switch",
	    class: {
	      'is-disabled': disabled, 'el-switch--wide': hasText
	    }
	  }, [_h('div', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (disabled),
	      expression: "disabled"
	    }],
	    staticClass: "el-switch__mask"
	  }), " ", _h('input', {
	    staticClass: "el-switch__input",
	    attrs: {
	      "type": "checkbox",
	      "name": name,
	      "disabled": disabled,
	      "style": "display: none;"
	    },
	    domProps: {
	      "checked": Array.isArray(value) ? _i(value, null) > -1 : _q(value, true)
	    },
	    on: {
	      "change": function($event) {
	        var $$a = value,
	          $$el = $event.target,
	          $$c = $$el.checked ? (true) : (false);
	        if (Array.isArray($$a)) {
	          var $$v = null,
	            $$i = _i($$a, $$v);
	          if ($$c) {
	            $$i < 0 && (value = $$a.concat($$v))
	          } else {
	            $$i > -1 && (value = $$a.slice(0, $$i).concat($$a.slice($$i + 1)))
	          }
	        } else {
	          value = $$c
	        }
	      }
	    }
	  }), " ", _h('span', {
	    ref: "core",
	    staticClass: "el-switch__core",
	    style: ({
	      'width': coreWidth + 'px'
	    }),
	    on: {
	      "click": handleMiscClick
	    }
	  }, [_h('span', {
	    ref: "button",
	    staticClass: "el-switch__button"
	  })]), " ", _h('transition', {
	    attrs: {
	      "name": "label-fade"
	    }
	  }, [_h('div', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (value),
	      expression: "value"
	    }],
	    staticClass: "el-switch__label el-switch__label--left",
	    style: ({
	      'width': coreWidth + 'px'
	    }),
	    on: {
	      "click": handleMiscClick
	    }
	  }, [(onIconClass) ? _h('i', {
	    class: [onIconClass]
	  }) : _e(), " ", (!onIconClass && onText) ? _h('span', [_s(onText)]) : _e()])]), " ", _h('transition', {
	    attrs: {
	      "name": "label-fade"
	    }
	  }, [_h('div', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (!value),
	      expression: "!value"
	    }],
	    staticClass: "el-switch__label el-switch__label--right",
	    style: ({
	      'width': coreWidth + 'px'
	    }),
	    on: {
	      "click": handleMiscClick
	    }
	  }, [(offIconClass) ? _h('i', {
	    class: [offIconClass]
	  }) : _e(), " ", (!offIconClass && offText) ? _h('span', [_s(offText)]) : _e()])])])
	}},staticRenderFns: []}

/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ElOptionGroup = __webpack_require__(105);

	ElOptionGroup.install = function (Vue) {
	  Vue.component(ElOptionGroup.name, ElOptionGroup);
	};

	module.exports = ElOptionGroup;

/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(106)

	/* template */
	var __vue_template__ = __webpack_require__(107)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 106 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _emitter = __webpack_require__(18);

	var _emitter2 = _interopRequireDefault(_emitter);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  mixins: [_emitter2.default],

	  name: 'el-option-group',

	  props: {
	    label: String,
	    disabled: {
	      type: Boolean,
	      default: false
	    }
	  },

	  mounted: function mounted() {
	    if (this.disabled) {
	      this.broadcast('option', 'disableOptions');
	    }
	  }
	};

/***/ },
/* 107 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('ul', {
	    staticClass: "el-select-group__wrap"
	  }, [_h('li', {
	    staticClass: "el-select-group__title"
	  }, [_s(label)]), " ", _h('li', [_h('ul', {
	    staticClass: "el-select-group"
	  }, [_t("default")])])])
	}},staticRenderFns: []}

/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ElButton = __webpack_require__(109);
	var ElButtonGroup = __webpack_require__(112);

	ElButton.install = function (Vue) {
	  Vue.component(ElButton.name, ElButton);
	  Vue.component(ElButtonGroup.name, ElButtonGroup);
	};

	module.exports = ElButton;

/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(110)

	/* template */
	var __vue_template__ = __webpack_require__(111)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 110 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports.default = {
	  name: 'ElButton',

	  props: {
	    type: {
	      type: String,
	      default: 'default'
	    },
	    size: String,
	    icon: {
	      type: String,
	      default: ''
	    },
	    nativeType: {
	      type: String,
	      default: 'button'
	    },
	    loading: {
	      type: Boolean,
	      default: false
	    },
	    disabled: {
	      type: Boolean,
	      default: false
	    },
	    plain: {
	      type: Boolean,
	      default: false
	    }
	  }
	};

/***/ },
/* 111 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('button', {
	    staticClass: "el-button",
	    class: [
	      type ? 'el-button-' + type : '',
	      size ? 'el-button-' + size : '', {
	        'is-disabled': disabled,
	        'is-loading': loading,
	        'is-plain': plain
	      }
	    ],
	    attrs: {
	      "disabled": disabled,
	      "type": nativeType
	    }
	  }, [(loading) ? _h('i', {
	    staticClass: "el-icon-loading"
	  }) : _e(), " ", (icon && !loading) ? _h('i', {
	    class: 'el-icon-' + icon
	  }) : _e(), " ", _t("default")])
	}},staticRenderFns: []}

/***/ },
/* 112 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(113)

	/* template */
	var __vue_template__ = __webpack_require__(114)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 113 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports.default = {
	  name: 'ElButtonGroup'
	};

/***/ },
/* 114 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('div', {
	    staticClass: "el-button-group"
	  }, [_t("default")])
	}},staticRenderFns: []}

/***/ },
/* 115 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ElButtonGroup = __webpack_require__(112);

	ElButtonGroup.install = function (Vue) {
	  Vue.component(ElButtonGroup.name, ElButtonGroup);
	};

	module.exports = ElButtonGroup;

/***/ },
/* 116 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ElTable = __webpack_require__(117);

	ElTable.install = function (Vue) {
	  Vue.component('el-table', ElTable);
	};

	module.exports = ElTable;

/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(118)

	/* template */
	var __vue_template__ = __webpack_require__(126)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 118 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _throttle = __webpack_require__(119);

	var _throttle2 = _interopRequireDefault(_throttle);

	var _debounce = __webpack_require__(120);

	var _debounce2 = _interopRequireDefault(_debounce);

	var _util = __webpack_require__(121);

	var _objectAssign = __webpack_require__(122);

	var _objectAssign2 = _interopRequireDefault(_objectAssign);

	var _resizeEvent = __webpack_require__(123);

	var _tableBody = __webpack_require__(124);

	var _tableBody2 = _interopRequireDefault(_tableBody);

	var _tableHeader = __webpack_require__(125);

	var _tableHeader2 = _interopRequireDefault(_tableHeader);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var gridIdSeed = 1;
	var GUTTER_WIDTH = void 0;

	exports.default = {
	  name: 'el-table',

	  props: {
	    data: {
	      type: Array,
	      default: function _default() {
	        return [];
	      }
	    },

	    width: [String, Number],

	    height: [String, Number],

	    fit: {
	      type: Boolean,
	      default: true
	    },

	    stripe: {
	      type: Boolean,
	      default: false
	    },

	    border: {
	      type: Boolean,
	      default: false
	    },

	    fixedColumnCount: {
	      type: Number,
	      default: 0
	    },

	    selectionMode: {
	      type: String,
	      default: 'none'
	    },

	    selection: {},

	    allowNoSelection: {
	      type: Boolean,
	      default: false
	    },

	    gutterWidth: {
	      default: 0
	    },

	    customCriteria: Array,
	    customBackgroundColors: Array
	  },

	  components: {
	    TableHeader: _tableHeader2.default,
	    TableBody: _tableBody2.default
	  },

	  methods: {
	    handleAllSelectedChange: function handleAllSelectedChange(val) {
	      this.allSelected = val;
	    },
	    doOnDataChange: function doOnDataChange(data) {
	      data = data || [];

	      if (this.selectionMode === 'single') {
	        var oldSelection = this.selected;
	        if (oldSelection === null) {
	          if (!this.allowNoSelection) {
	            this.selected = data[0];
	            if (this.selected !== oldSelection) {
	              this.$emit('selectionchange', this.selected);
	            }
	          }
	        } else if (data.indexOf(oldSelection) === -1) {
	          if (!this.allowNoSelection) {
	            this.selected = data[0];
	          } else {
	            this.selected = null;
	          }
	          if (this.selected !== oldSelection) {
	            this.$emit('selectionchange', this.selected);
	          }
	        }
	      }
	    },
	    toggleAllSelection: function toggleAllSelection() {
	      var _this = this;

	      setTimeout(function () {
	        _this.tableData.forEach(function (item) {
	          item.$selected = _this.allSelected;
	        });
	      }, 0);
	    },
	    $calcColumns: function $calcColumns() {
	      var _this2 = this;

	      var fit = this.fit;
	      var columns = this.columns;

	      var bodyWidth = this.$el.clientWidth;
	      var bodyMinWidth = 0;

	      var flattenColumns = [];

	      columns.forEach(function (column) {
	        if (column.isColumnGroup) {
	          flattenColumns.push.apply(flattenColumns, column.columns);
	        } else {
	          flattenColumns.push(column);
	        }
	      });

	      if (fit) {
	        (function () {
	          var flexColumns = [];


	          flattenColumns.forEach(function (column) {
	            bodyMinWidth += column.width || column.minWidth || 80;

	            if (typeof column.width === 'number') {} else {
	              flexColumns.push(column);
	            }
	          });

	          if (bodyMinWidth < bodyWidth - _this2.currentGutterWidth) {
	            (function () {
	              var flexWidthTotal = bodyWidth - _this2.currentGutterWidth - columns.length - bodyMinWidth;
	              var flexWidthPerColumn = Math.floor(flexWidthTotal / flexColumns.length);
	              var flexWidthFirstColumn = flexWidthTotal - flexWidthPerColumn * flexColumns.length + flexWidthPerColumn;

	              flexColumns.forEach(function (column, index) {
	                if (index === 0) {
	                  column.realWidth = (column.minWidth || 80) + flexWidthFirstColumn;
	                } else {
	                  column.realWidth = (column.minWidth || 80) + flexWidthPerColumn;
	                }
	              });
	            })();
	          } else {
	            _this2.showHScrollBar = true;
	            flexColumns.forEach(function (column) {
	              column.realWidth = column.minWidth;
	            });
	          }

	          _this2.bodyWidth = Math.max(bodyMinWidth, bodyWidth);
	        })();
	      } else {
	        flattenColumns.forEach(function (column) {
	          if (!column.width && !column.minWidth) {
	            column.realWidth = 80;
	          }

	          bodyMinWidth += column.realWidth;
	        });
	        this.showHScrollBar = bodyMinWidth > bodyWidth;

	        this.bodyWidth = bodyMinWidth;
	      }

	      if (this.styleNode) {
	        var _ret3 = function () {
	          var styleSheet = _this2.styleNode.sheet;

	          if (!styleSheet) return {
	              v: void 0
	            };
	          for (var i = 0, j = styleSheet.cssRules.length; i < j; i++) {
	            styleSheet.deleteRule(0);
	          }

	          columns.forEach(function (column) {
	            var addRule = function addRule(rule) {
	              styleSheet.insertRule(rule, styleSheet.cssRules.length);
	            };

	            if (column.isColumnGroup) {
	              var childColumns = column.columns;
	              var groupWidth = 0;
	              childColumns.forEach(function (childColumn) {
	                groupWidth += childColumn.realWidth;
	                addRule('.' + childColumn.id + ', .' + childColumn.id + ' > div { width: ' + childColumn.realWidth + 'px; }');
	              });

	              addRule('.' + column.id + ', .' + column.id + ' > div { width: ' + groupWidth + 'px; }');
	            } else {
	              addRule('.' + column.id + ', .' + column.id + ' > div { width: ' + column.realWidth + 'px; }');
	            }
	          });
	        }();

	        if ((typeof _ret3 === 'undefined' ? 'undefined' : _typeof(_ret3)) === "object") return _ret3.v;
	      }

	      if (this.fixedColumnCount > 0) {
	        (function () {
	          var fixedBodyWidth = 0;
	          var fixedColumnCount = _this2.fixedColumnCount;
	          columns.forEach(function (column, index) {
	            if (index < fixedColumnCount) {
	              fixedBodyWidth += column.realWidth;
	            }
	          });

	          _this2.fixedBodyWidth = fixedBodyWidth;
	        })();
	      }

	      this.$nextTick(function () {
	        _this2.headerHeight = _this2.$el.querySelector('.el-table__header-wrapper').offsetHeight;
	      });
	    },
	    $calcHeight: function $calcHeight(height) {
	      if (typeof height === 'string' && /^\d+$/.test(height)) {
	        height = Number(height);
	      }

	      if (!isNaN(height) && this.$el) {
	        var headerHeight = this.headerHeight = this.$el.querySelector('.el-table__header-wrapper').offsetHeight;
	        var bodyHeight = height - headerHeight;
	        var gridWrapper = this.$el.querySelector('.el-table__body-wrapper');
	        gridWrapper.style.height = bodyHeight + 'px';
	        this.$el.style.height = height + 'px';
	        if (this.$refs.fixed) {
	          this.$refs.fixed.style.height = height + 'px';
	        }
	        var fixedBodyWrapper = this.$el.querySelector('.el-table__fixed-body-wrapper');
	        if (fixedBodyWrapper) {
	          fixedBodyWrapper.style.height = (this.showHScrollBar ? gridWrapper.offsetHeight - this.currentGutterWidth : gridWrapper.offsetHeight) + 'px';
	        }
	      }
	    },
	    handleMouseLeave: function handleMouseLeave() {
	      this.hoverRowIndex = null;
	      var hoverState = this.hoverState;
	      if (hoverState) {
	        this.hoverState = null;
	      }
	    },
	    updateScrollInfo: function updateScrollInfo() {
	      var _this3 = this;

	      this.$nextTick(function () {
	        if (_this3.$el) {
	          var gridBodyWrapper = _this3.$el.querySelector('.el-table__body-wrapper');
	          var gridBody = _this3.$el.querySelector('.el-table__body-wrapper .el-table__body');

	          _this3.showVScrollBar = gridBody.offsetHeight > gridBodyWrapper.offsetHeight;
	        }
	      });
	    },
	    doRender: function doRender() {
	      var _this4 = this;

	      var bodyWrapper = this.$el.querySelector('.el-table__body-wrapper');
	      var headerWrapper = this.$el.querySelector('.el-table__header-wrapper');
	      var el = this.$el;

	      if (!this.$ready) {
	        bodyWrapper.addEventListener('scroll', function () {
	          headerWrapper.scrollLeft = this.scrollLeft;
	          var fixedBodyWrapper = el.querySelector('.el-table__fixed-body-wrapper');
	          if (fixedBodyWrapper) {
	            fixedBodyWrapper.scrollTop = this.scrollTop;
	          }
	        });
	      }

	      this.$calcColumns();

	      if (!this.$ready && this.fit) {
	        this.windowResizeListener = (0, _throttle2.default)(50, function () {
	          _this4.$calcColumns();
	        });
	        (0, _resizeEvent.addResizeListener)(this.$el, this.windowResizeListener);
	      }

	      this.$nextTick(function () {
	        if (_this4.height) {
	          _this4.$calcHeight(_this4.height);
	        }
	      });
	    }
	  },

	  created: function created() {
	    var _this5 = this;

	    this.gridId = 'grid_' + gridIdSeed + '_';

	    if (GUTTER_WIDTH === undefined) {
	      GUTTER_WIDTH = (0, _util.getScrollBarWidth)();
	    }
	    this.currentGutterWidth = GUTTER_WIDTH;

	    this.debouncedReRender = (0, _debounce2.default)(50, function () {
	      _this5.doRender();
	    });
	  },


	  computed: {
	    selection: function selection() {
	      if (this.selectionMode === 'multiple') {
	        var data = this.tableData || [];
	        return data.filter(function (item) {
	          return item.$selected === true;
	        });
	      } else if (this.selectionMode === 'single') {
	        return this.selected;
	      } else {
	        return null;
	      }
	    },
	    fixedColumns: function fixedColumns() {
	      var columns = this.columns || [];
	      var fixedColumnCount = this.fixedColumnCount;
	      return columns.filter(function (item, index) {
	        return index < fixedColumnCount;
	      });
	    },
	    filterData: function filterData() {
	      return (0, _util.orderBy)(this.tableData, this.sortingProperty, this.sortingDirection);
	    }
	  },

	  watch: {
	    fixedColumnCount: function fixedColumnCount() {
	      this.debouncedReRender();
	    },
	    selection: function selection(val) {
	      this.$emit('selectionchange', val);
	      if (this.selectionMode === 'multiple') {
	        this.allSelected = this.tableData.length > 0 && val.length === this.tableData.length;
	      }
	    },
	    visibleFilter: function visibleFilter(val) {
	      this.$broadcast('toggleFilterPopup', val);
	    },
	    height: function height(value) {
	      this.$calcHeight(value);
	    },


	    data: {
	      immediate: true,
	      handler: function handler(val) {
	        if (val && this.selectionMode === 'multiple') {
	          this.tableData = val.map(function (item) {
	            return (0, _objectAssign2.default)({ '$selected': false }, item);
	          });
	        } else {
	          this.tableData = val;
	        }
	      }
	    },

	    tableData: function tableData(newVal) {
	      var _this6 = this;

	      this.$nextTick(function (_) {
	        return _this6.doRender();
	      });
	      this.doOnDataChange(newVal);
	      this.updateScrollInfo();
	    }
	  },

	  destroyed: function destroyed() {
	    if (this.styleNode) {
	      this.styleNode.parentNode.removeChild(this.styleNode);
	    }

	    if (this.windowResizeListener) {
	      (0, _resizeEvent.removeResizeListener)(this.$el, this.windowResizeListener);
	    }
	  },
	  mounted: function mounted() {
	    var _this7 = this;

	    var styleNode = document.createElement('style');
	    styleNode.type = 'text/css';
	    styleNode.rel = 'stylesheet';
	    styleNode.title = 'Grid Column Style';
	    document.getElementsByTagName('head')[0].appendChild(styleNode);

	    this.styleNode = styleNode;

	    this.doRender();

	    this.$ready = true;
	    if (this.tableData) {
	      this.doOnDataChange(this.tableData);
	    }
	    this.updateScrollInfo();
	    if (this.fixedColumnCount > 0) {
	      this.$nextTick(function () {
	        var style = _this7.$refs.fixed.style;
	        if (!style) return;

	        style.height = (_this7.showHScrollBar ? _this7.$el.clientHeight - _this7.currentGutterWidth : _this7.$el.clientHeight) + 'px';

	        var bodyHeight = _this7.$el.querySelector('.el-table__body-wrapper').offsetHeight;
	        var fixedBodyHeight = _this7.$el.querySelector('.el-table__fixed-body-wrapper').offsetHeight;
	        if (bodyHeight !== fixedBodyHeight) {
	          (function () {
	            var bodyTrs = _this7.$el.querySelector('.el-table__body-wrapper').querySelectorAll('tr');
	            var fixedBodyTrs = _this7.$el.querySelector('.el-table__fixed-body-wrapper').querySelectorAll('tr');
	            bodyTrs.forEach(function (tr, index) {
	              var trHeight = tr.offsetHeight;
	              var fixedTrHeight = fixedBodyTrs[index].offsetHeight;
	              if (trHeight !== fixedTrHeight) {
	                fixedBodyTrs[index].style.height = trHeight + 'px';
	              }
	            });
	          })();
	        }
	      });
	    }
	  },
	  data: function data() {
	    return {
	      tableData: this.data,
	      showHScrollBar: false,
	      showVScrollBar: false,
	      hoverRowIndex: null,
	      headerHeight: 35,
	      selected: null,
	      allSelected: false,
	      columns: [],
	      resizeProxyVisible: false,
	      bodyWidth: '',
	      fixedBodyWidth: '',
	      sortingColumn: null,
	      sortingProperty: null,
	      sortingDirection: 1,
	      visibleFilter: null,
	      currentGutterWidth: this.gutterWidth
	    };
	  }
	};

/***/ },
/* 119 */
/***/ function(module, exports) {

	/* eslint-disable no-undefined,no-param-reassign,no-shadow */

	/**
	 * Throttle execution of a function. Especially useful for rate limiting
	 * execution of handlers on events like resize and scroll.
	 *
	 * @param  {Number}    delay          A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
	 * @param  {Boolean}   noTrailing     Optional, defaults to false. If noTrailing is true, callback will only execute every `delay` milliseconds while the
	 *                                    throttled-function is being called. If noTrailing is false or unspecified, callback will be executed one final time
	 *                                    after the last throttled-function call. (After the throttled-function has not been called for `delay` milliseconds,
	 *                                    the internal counter is reset)
	 * @param  {Function}  callback       A function to be executed after delay milliseconds. The `this` context and all arguments are passed through, as-is,
	 *                                    to `callback` when the throttled-function is executed.
	 * @param  {Boolean}   debounceMode   If `debounceMode` is true (at begin), schedule `clear` to execute after `delay` ms. If `debounceMode` is false (at end),
	 *                                    schedule `callback` to execute after `delay` ms.
	 *
	 * @return {Function}  A new, throttled, function.
	 */
	module.exports = function ( delay, noTrailing, callback, debounceMode ) {

		// After wrapper has stopped being called, this timeout ensures that
		// `callback` is executed at the proper times in `throttle` and `end`
		// debounce modes.
		var timeoutID;

		// Keep track of the last time `callback` was executed.
		var lastExec = 0;

		// `noTrailing` defaults to falsy.
		if ( typeof noTrailing !== 'boolean' ) {
			debounceMode = callback;
			callback = noTrailing;
			noTrailing = undefined;
		}

		// The `wrapper` function encapsulates all of the throttling / debouncing
		// functionality and when executed will limit the rate at which `callback`
		// is executed.
		function wrapper () {

			var self = this;
			var elapsed = Number(new Date()) - lastExec;
			var args = arguments;

			// Execute `callback` and update the `lastExec` timestamp.
			function exec () {
				lastExec = Number(new Date());
				callback.apply(self, args);
			}

			// If `debounceMode` is true (at begin) this is used to clear the flag
			// to allow future `callback` executions.
			function clear () {
				timeoutID = undefined;
			}

			if ( debounceMode && !timeoutID ) {
				// Since `wrapper` is being called for the first time and
				// `debounceMode` is true (at begin), execute `callback`.
				exec();
			}

			// Clear any existing timeout.
			if ( timeoutID ) {
				clearTimeout(timeoutID);
			}

			if ( debounceMode === undefined && elapsed > delay ) {
				// In throttle mode, if `delay` time has been exceeded, execute
				// `callback`.
				exec();

			} else if ( noTrailing !== true ) {
				// In trailing throttle mode, since `delay` time has not been
				// exceeded, schedule `callback` to execute `delay` ms after most
				// recent execution.
				//
				// If `debounceMode` is true (at begin), schedule `clear` to execute
				// after `delay` ms.
				//
				// If `debounceMode` is false (at end), schedule `callback` to
				// execute after `delay` ms.
				timeoutID = setTimeout(debounceMode ? clear : exec, debounceMode === undefined ? delay - elapsed : delay);
			}

		}

		// Return the wrapper function.
		return wrapper;

	};


/***/ },
/* 120 */
/***/ function(module, exports, __webpack_require__) {

	/* eslint-disable no-undefined */

	var throttle = __webpack_require__(119);

	/**
	 * Debounce execution of a function. Debouncing, unlike throttling,
	 * guarantees that a function is only executed a single time, either at the
	 * very beginning of a series of calls, or at the very end.
	 *
	 * @param  {Number}   delay         A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
	 * @param  {Boolean}  atBegin       Optional, defaults to false. If atBegin is false or unspecified, callback will only be executed `delay` milliseconds
	 *                                  after the last debounced-function call. If atBegin is true, callback will be executed only at the first debounced-function call.
	 *                                  (After the throttled-function has not been called for `delay` milliseconds, the internal counter is reset).
	 * @param  {Function} callback      A function to be executed after delay milliseconds. The `this` context and all arguments are passed through, as-is,
	 *                                  to `callback` when the debounced-function is executed.
	 *
	 * @return {Function} A new, debounced function.
	 */
	module.exports = function ( delay, atBegin, callback ) {
		return callback === undefined ? throttle(delay, atBegin, false) : throttle(delay, callback, atBegin !== false);
	};


/***/ },
/* 121 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var scrollBarWidth;

	var getScrollBarWidth = exports.getScrollBarWidth = function getScrollBarWidth() {
	  if (scrollBarWidth !== undefined) return scrollBarWidth;

	  var outer = document.createElement('div');
	  outer.style.visibility = 'hidden';
	  outer.style.width = '100px';
	  outer.style.position = 'absolute';
	  outer.style.top = '-9999px';
	  document.body.appendChild(outer);

	  var widthNoScroll = outer.offsetWidth;
	  outer.style.overflow = 'scroll';

	  var inner = document.createElement('div');
	  inner.style.width = '100%';
	  outer.appendChild(inner);

	  var widthWithScroll = inner.offsetWidth;
	  outer.parentNode.removeChild(outer);

	  return widthNoScroll - widthWithScroll;
	};

	var getCell = exports.getCell = function getCell(event) {
	  var cell = event.target;

	  while (cell && cell.tagName.toUpperCase() !== 'HTML') {
	    if (cell.tagName.toUpperCase() === 'TD') {
	      return cell;
	    }
	    cell = cell.parentNode;
	  }

	  return null;
	};

	var getValueByPath = exports.getValueByPath = function getValueByPath(object, prop) {
	  prop = prop || '';
	  var paths = prop.split('.');
	  var current = object;
	  var result = null;
	  for (var i = 0, j = paths.length; i < j; i++) {
	    var path = paths[i];
	    if (!current) break;

	    if (i === j - 1) {
	      result = current[path];
	      break;
	    }
	    current = current[path];
	  }
	  return result;
	};

	var isObject = function isObject(obj) {
	  return obj !== null && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object';
	};

	var orderBy = exports.orderBy = function orderBy(array, sortKey, reverse) {
	  if (!sortKey) {
	    return array;
	  }
	  var order = reverse && reverse < 0 ? -1 : 1;

	  return array.slice().sort(function (a, b) {
	    if (sortKey !== '$key') {
	      if (isObject(a) && '$value' in a) a = a.$value;
	      if (isObject(b) && '$value' in b) b = b.$value;
	    }
	    a = isObject(a) ? getValueByPath(a, sortKey) : a;
	    b = isObject(b) ? getValueByPath(b, sortKey) : b;
	    return a === b ? 0 : a > b ? order : -order;
	  });
	};

	var getChild = exports.getChild = function getChild(event) {
	  return event.target.querySelector('.cell');
	};

/***/ },
/* 122 */
/***/ function(module, exports) {

	'use strict';
	/* eslint-disable no-unused-vars */
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;

	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	function shouldUseNative() {
		try {
			if (!Object.assign) {
				return false;
			}

			// Detect buggy property enumeration order in older V8 versions.

			// https://bugs.chromium.org/p/v8/issues/detail?id=4118
			var test1 = new String('abc');  // eslint-disable-line
			test1[5] = 'de';
			if (Object.getOwnPropertyNames(test1)[0] === '5') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test2 = {};
			for (var i = 0; i < 10; i++) {
				test2['_' + String.fromCharCode(i)] = i;
			}
			var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
				return test2[n];
			});
			if (order2.join('') !== '0123456789') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test3 = {};
			'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
				test3[letter] = letter;
			});
			if (Object.keys(Object.assign({}, test3)).join('') !==
					'abcdefghijklmnopqrst') {
				return false;
			}

			return true;
		} catch (e) {
			// We don't expect any of the above to throw, but better to be safe.
			return false;
		}
	}

	module.exports = shouldUseNative() ? Object.assign : function (target, source) {
		var from;
		var to = toObject(target);
		var symbols;

		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);

			for (var key in from) {
				if (hasOwnProperty.call(from, key)) {
					to[key] = from[key];
				}
			}

			if (Object.getOwnPropertySymbols) {
				symbols = Object.getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}

		return to;
	};


/***/ },
/* 123 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;


	var requestFrame = function () {
	  var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || function (fn) {
	    return window.setTimeout(fn, 20);
	  };
	  return function (fn) {
	    return raf(fn);
	  };
	}();

	var cancelFrame = function () {
	  var cancel = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.clearTimeout;
	  return function (id) {
	    return cancel(id);
	  };
	}();

	var resetTrigger = function resetTrigger(element) {
	  var trigger = element.__resizeTrigger__;
	  var expand = trigger.firstElementChild;
	  var contract = trigger.lastElementChild;
	  var expandChild = expand.firstElementChild;

	  contract.scrollLeft = contract.scrollWidth;
	  contract.scrollTop = contract.scrollHeight;
	  expandChild.style.width = expand.offsetWidth + 1 + 'px';
	  expandChild.style.height = expand.offsetHeight + 1 + 'px';
	  expand.scrollLeft = expand.scrollWidth;
	  expand.scrollTop = expand.scrollHeight;
	};

	var checkTriggers = function checkTriggers(element) {
	  return element.offsetWidth !== element.__resizeLast__.width || element.offsetHeight !== element.__resizeLast__.height;
	};

	var scrollListener = function scrollListener(event) {
	  var _this = this;

	  resetTrigger(this);
	  if (this.__resizeRAF__) cancelFrame(this.__resizeRAF__);
	  this.__resizeRAF__ = requestFrame(function () {
	    if (checkTriggers(_this)) {
	      _this.__resizeLast__.width = _this.offsetWidth;
	      _this.__resizeLast__.height = _this.offsetHeight;
	      _this.__resizeListeners__.forEach(function (fn) {
	        fn.call(_this, event);
	      });
	    }
	  });
	};

	var attachEvent = document.attachEvent;
	var DOM_PREFIXES = 'Webkit Moz O ms'.split(' ');
	var START_EVENTS = 'webkitAnimationStart animationstart oAnimationStart MSAnimationStart'.split(' ');
	var RESIZE_ANIMATION_NAME = 'resizeanim';
	var animation = false;
	var keyFramePrefix = '';
	var animationStartEvent = 'animationstart';

	if (!attachEvent) {
	  var testElement = document.createElement('fakeelement');
	  if (testElement.style.animationName !== undefined) {
	    animation = true;
	  }

	  if (animation === false) {
	    var prefix = '';
	    for (var i = 0; i < DOM_PREFIXES.length; i++) {
	      if (testElement.style[DOM_PREFIXES[i] + 'AnimationName'] !== undefined) {
	        prefix = DOM_PREFIXES[i];
	        keyFramePrefix = '-' + prefix.toLowerCase() + '-';
	        animationStartEvent = START_EVENTS[i];
	        animation = true;
	        break;
	      }
	    }
	  }
	}

	var stylesCreated = false;
	var createStyles = function createStyles() {
	  if (!stylesCreated) {
	    var animationKeyframes = '@' + keyFramePrefix + 'keyframes ' + RESIZE_ANIMATION_NAME + ' { from { opacity: 0; } to { opacity: 0; } } ';
	    var animationStyle = keyFramePrefix + 'animation: 1ms ' + RESIZE_ANIMATION_NAME + ';';

	    var css = animationKeyframes + '\n      .resize-triggers { ' + animationStyle + ' visibility: hidden; opacity: 0; }\n      .resize-triggers, .resize-triggers > div, .contract-trigger:before { content: " "; display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; }\n      .resize-triggers > div { background: #eee; overflow: auto; }\n      .contract-trigger:before { width: 200%; height: 200%; }';

	    var head = document.head || document.getElementsByTagName('head')[0];
	    var style = document.createElement('style');

	    style.type = 'text/css';
	    if (style.styleSheet) {
	      style.styleSheet.cssText = css;
	    } else {
	      style.appendChild(document.createTextNode(css));
	    }

	    head.appendChild(style);
	    stylesCreated = true;
	  }
	};

	var addResizeListener = exports.addResizeListener = function addResizeListener(element, fn) {
	  if (attachEvent) {
	    element.attachEvent('onresize', fn);
	  } else {
	    if (!element.__resizeTrigger__) {
	      if (getComputedStyle(element).position === 'static') {
	        element.style.position = 'relative';
	      }
	      createStyles();
	      element.__resizeLast__ = {};
	      element.__resizeListeners__ = [];

	      var resizeTrigger = element.__resizeTrigger__ = document.createElement('div');
	      resizeTrigger.className = 'resize-triggers';
	      resizeTrigger.innerHTML = '<div class="expand-trigger"><div></div></div><div class="contract-trigger"></div>';
	      element.appendChild(resizeTrigger);

	      resetTrigger(element);
	      element.addEventListener('scroll', scrollListener, true);

	      if (animationStartEvent) {
	        resizeTrigger.addEventListener(animationStartEvent, function (event) {
	          if (event.animationName === RESIZE_ANIMATION_NAME) {
	            resetTrigger(element);
	          }
	        });
	      }
	    }
	    element.__resizeListeners__.push(fn);
	  }
	};

	var removeResizeListener = exports.removeResizeListener = function removeResizeListener(element, fn) {
	  if (attachEvent) {
	    element.detachEvent('onresize', fn);
	  } else {
	    element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
	    if (!element.__resizeListeners__.length) {
	      element.removeEventListener('scroll', scrollListener);
	      element.__resizeTrigger__ = !element.removeChild(element.__resizeTrigger__);
	    }
	  }
	};

/***/ },
/* 124 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _util = __webpack_require__(121);

	var getColumnById = function getColumnById(grid, columnId) {
	  var column = null;
	  grid.columns.forEach(function (item) {
	    if (item.id === columnId) {
	      column = item;
	    }
	  });
	  return column;
	};

	var getColumnByCell = function getColumnByCell(grid, cell) {
	  var matches = (cell.className || '').match(/grid_[^\s]+/gm);
	  if (matches) {
	    return getColumnById(grid, matches[0]);
	  }
	  return null;
	};

	exports.default = {
	  props: {
	    columns: {},
	    data: {},
	    fixed: {},
	    selection: {
	      default: function _default() {
	        return [];
	      }
	    }
	  },

	  render: function render(h) {
	    var _this = this;

	    return h(
	      'table',
	      {
	        'class': 'el-table__body',
	        attrs: { cellspacing: '0',
	          cellpadding: '0',
	          border: '0' }
	      },
	      [h(
	        'tbody',
	        null,
	        [this._l(this.data, function (row, $index) {
	          return h(
	            'tr',
	            {
	              on: {
	                click: function click($event) {
	                  return _this.handleClick($event, row);
	                },
	                mouseenter: function mouseenter(_) {
	                  return _this.handleMouseEnter($index);
	                }
	              },

	              style: _this.getCustomStyle(row),
	              'class': {
	                'current-row': row === _this.$parent.selected,
	                'hover': _this.$parent.$parent.hoverRowIndex === $index
	              } },
	            [_this._l(_this.columns, function (column) {
	              return h(
	                'td',
	                {
	                  style: _this.getColumnWhiteSpaceStyle(column),
	                  'class': [column.id, column.align],
	                  on: {
	                    mouseenter: function mouseenter($event) {
	                      return _this.handleCellMouseEnter($event, row);
	                    },
	                    mouseleave: _this.handleCellMouseLeave
	                  }
	                },
	                [column.template ? column.template.call(_this._renderProxy, h, { row: row, column: column, $index: $index, _self: _this.$parent.$vnode.context }) : h(
	                  'div',
	                  { 'class': 'cell' },
	                  [_this.$getPropertyText(row, column.property, column.id)]
	                )]
	              );
	            }).concat(_this.fixed ? h(
	              'td',
	              { 'class': 'gutter' },
	              []
	            ) : '')]
	          );
	        })]
	      )]
	    );
	  },
	  data: function data() {
	    return {
	      criteria: this.$parent.customCriteria,
	      colors: this.$parent.customBackgroundColors,
	      tooltipDisabled: true
	    };
	  },


	  filters: {
	    orderBy: _util.orderBy
	  },

	  methods: {
	    getColumnWhiteSpaceStyle: function getColumnWhiteSpaceStyle(column) {
	      return column.showTooltipWhenOverflow ? { 'white-space': 'nowrap' } : {};
	    },
	    checkProperty: function checkProperty(row) {
	      if (this.criteria && this.criteria.length > 0) {
	        for (var i = 0, len = this.criteria.length; i < len; i++) {
	          if (row[this.criteria[i]] === true) {
	            return i;
	          }
	        }
	      }
	      return -1;
	    },
	    getCustomStyle: function getCustomStyle(row) {
	      if (!this.criteria || !this.colors || this.criteria.length !== this.colors.length) {
	        return {};
	      }
	      var criterionIndex = this.checkProperty(row);
	      return criterionIndex > -1 ? { 'background-color': this.colors[criterionIndex] } : {};
	    },
	    handleCellMouseEnter: function handleCellMouseEnter(event, row) {
	      var grid = this.$parent;
	      var cell = (0, _util.getCell)(event);

	      if (cell) {
	        var column = getColumnByCell(grid, cell);
	        var hoverState = grid.hoverState = { cell: cell, column: column, row: row };
	        grid.$emit('cellmouseenter', hoverState.row, hoverState.column, hoverState.cell, event);
	      }

	      var cellChild = (0, _util.getChild)(event);

	      this.tooltipDisabled = cellChild.scrollWidth <= cellChild.offsetWidth;
	    },
	    handleCellMouseLeave: function handleCellMouseLeave(event) {
	      var grid = this.$parent;
	      var cell = (0, _util.getCell)(event);

	      if (cell) {
	        var oldHoverState = grid.hoverState;
	        grid.$emit('cellmouseleave', oldHoverState.row, oldHoverState.column, oldHoverState.cell, event);
	      }
	    },
	    handleMouseEnter: function handleMouseEnter(index) {
	      this.$parent.hoverRowIndex = index;
	    },
	    handleClick: function handleClick(event, row) {
	      var grid = this.$parent;
	      var cell = (0, _util.getCell)(event);

	      if (cell) {
	        var column = getColumnByCell(grid, cell);
	        if (column) {
	          grid.$emit('cellclick', row, column, cell, event);
	        }
	      }

	      if (grid.selectionMode === 'single') {
	        grid.selected = row;
	      }

	      grid.$emit('rowclick', row, event);
	    },
	    $getPropertyText: function $getPropertyText(row, property, columnId) {
	      var grid = this.$parent;
	      var column = getColumnById(grid, columnId);
	      if (column && column.formatter) {
	        return column.formatter(row, column);
	      }

	      return (0, _util.getValueByPath)(row, property);
	    }
	  }
	};

/***/ },
/* 125 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _index = __webpack_require__(92);

	var _index2 = _interopRequireDefault(_index);

	var _index3 = __webpack_require__(24);

	var _index4 = _interopRequireDefault(_index3);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  name: 'el-table-header',

	  render: function render(h) {
	    var _this = this;

	    return h(
	      'table',
	      {
	        'class': 'el-table__header',
	        attrs: { cellspacing: '0',
	          cellpadding: '0',
	          border: '0' }
	      },
	      [this._l(this.columns, function (column) {
	        return h(
	          'colgroup',
	          {
	            attrs: {
	              name: column.id,
	              width: column.realWidth || column.width
	            }
	          },
	          []
	        );
	      }).concat(h(
	        'thead',
	        null,
	        [h(
	          'tr',
	          null,
	          [this._l(this.columns, function (column) {
	            return h(
	              'th',
	              {
	                on: {
	                  mousemove: function mousemove($event) {
	                    return _this.handleMouseMove($event, column);
	                  },
	                  mouseout: _this.handleMouseOut,
	                  mousedown: function mousedown($event) {
	                    return _this.handleMouseDown($event, column);
	                  },
	                  click: function click($event) {
	                    return _this.handleHeaderClick($event, column);
	                  }
	                },

	                'class': [column.id, column.direction, column.align] },
	              [[column.headerTemplate ? column.headerTemplate.call(_this._renderProxy, h, column.label) : h(
	                'div',
	                null,
	                [column.label]
	              ), column.sortable ? h(
	                'div',
	                { 'class': 'caret-wrapper' },
	                [h(
	                  'i',
	                  { 'class': 'sort-caret ascending' },
	                  []
	                ), h(
	                  'i',
	                  { 'class': 'sort-caret descending' },
	                  []
	                )]
	              ) : '']]
	            );
	          }).concat(this.$parent.showVScrollBar && this.$parent.currentGutterWidth ? h(
	            'th',
	            { 'class': 'gutter',
	              style: { width: this.$parent.currentGutterWidth + 'px' } },
	            []
	          ) : '')]
	        )]
	      ))]
	    );
	  },


	  props: {
	    columns: {},
	    fixed: Boolean,
	    allSelected: {
	      default: Boolean
	    },
	    border: Boolean
	  },

	  components: {
	    ElCheckbox: _index2.default,
	    ElTag: _index4.default
	  },

	  methods: {
	    toggleAllSelection: function toggleAllSelection($event) {
	      this.$parent.toggleAllSelection($event);
	    },
	    handleMouseDown: function handleMouseDown(event, column) {
	      var _this2 = this;

	      if (this.draggingColumn && this.border) {
	        (function () {
	          _this2.dragging = true;

	          _this2.$parent.resizeProxyVisible = true;

	          var gridEl = _this2.$parent.$el;
	          var gridLeft = gridEl.getBoundingClientRect().left;
	          var columnEl = _this2.$el.querySelector('th.' + column.id);
	          var columnRect = columnEl.getBoundingClientRect();
	          var minLeft = columnRect.left - gridLeft + 30;

	          columnEl.classList.add('noclick');

	          _this2.dragState = {
	            startMouseLeft: event.clientX,
	            startLeft: columnRect.right - gridLeft,
	            startColumnLeft: columnRect.left - gridLeft,
	            gridLeft: gridLeft
	          };

	          var resizeProxy = _this2.$parent.$refs.resizeProxy;
	          resizeProxy.style.left = _this2.dragState.startLeft + 'px';

	          document.onselectstart = function () {
	            return false;
	          };
	          document.ondragstart = function () {
	            return false;
	          };

	          var mousemove = function mousemove(event) {
	            var deltaLeft = event.clientX - _this2.dragState.startMouseLeft;
	            var proxyLeft = _this2.dragState.startLeft + deltaLeft;

	            resizeProxy.style.left = Math.max(minLeft, proxyLeft) + 'px';
	          };

	          var mouseup = function mouseup() {
	            if (_this2.dragging) {
	              var finalLeft = parseInt(resizeProxy.style.left, 10);
	              var columnWidth = finalLeft - _this2.dragState.startColumnLeft;
	              column.width = column.realWidth = columnWidth;

	              _this2.$nextTick(function () {
	                _this2.$parent.$calcColumns();
	              });

	              document.body.style.cursor = '';
	              _this2.dragging = false;
	              _this2.draggingColumn = null;
	              _this2.dragState = {};

	              _this2.$parent.resizeProxyVisible = false;
	            }

	            document.removeEventListener('mousemove', mousemove);
	            document.removeEventListener('mouseup', mouseup);
	            document.onselectstart = null;
	            document.ondragstart = null;

	            setTimeout(function () {
	              columnEl.classList.remove('noclick');
	            }, 0);
	          };

	          document.addEventListener('mousemove', mousemove);
	          document.addEventListener('mouseup', mouseup);
	        })();
	      }
	    },
	    handleMouseMove: function handleMouseMove(event, column) {
	      var target = event.target;

	      if (!column || !column.resizable) return;

	      if (!this.dragging && this.border) {
	        var rect = target.getBoundingClientRect();

	        if (rect.width > 12 && rect.right - event.pageX < 8) {
	          document.body.style.cursor = 'col-resize';
	          this.draggingColumn = column;
	        } else if (!this.dragging) {
	          document.body.style.cursor = '';
	          this.draggingColumn = null;
	          if (column.sortable) document.body.style.cursor = 'pointer';
	        }
	      }
	    },
	    handleMouseOut: function handleMouseOut() {
	      document.body.style.cursor = '';
	    },
	    handleHeaderClick: function handleHeaderClick(event, column) {
	      var target = event.target;
	      while (target && target.tagName !== 'TH') {
	        target = target.parentNode;
	      }

	      if (target && target.tagName === 'TH') {
	        if (target.classList.contains('noclick')) {
	          target.classList.remove('noclick');
	          return;
	        }
	      }

	      if (!column.sortable) return;

	      var grid = this.$parent;

	      if (grid.sortingColumn !== column) {
	        if (grid.sortingColumn) {
	          grid.sortingColumn.direction = '';
	        }
	        grid.sortingColumn = column;
	        grid.sortingProperty = column.property;
	      }

	      if (!column.direction) {
	        column.direction = 'ascending';
	      } else if (column.direction === 'ascending') {
	        column.direction = 'descending';
	      } else {
	        column.direction = '';
	        grid.sortingColumn = null;
	        grid.sortingProperty = null;
	      }

	      grid.sortingDirection = column.direction === 'descending' ? -1 : 1;
	    },
	    $setVisibleFilter: function $setVisibleFilter(property) {
	      if (this.visibleFilter) {
	        this.visibleFilter = null;
	      } else {
	        this.visibleFilter = property;
	      }
	    }
	  },

	  watch: {
	    visibleFilter: function visibleFilter(val) {
	      this.$parent.visibleFilter = val;
	    }
	  },

	  data: function data() {
	    return {
	      draggingColumn: null,
	      dragging: false,
	      dragState: {},
	      columnsMap: null,
	      visibleFilter: null
	    };
	  }
	};

/***/ },
/* 126 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('div', {
	    staticClass: "el-table",
	    class: {
	      'el-table--fit': fit, 'el-table--striped': stripe, 'el-table--border': border
	    },
	    on: {
	      "mouseleave": function($event) {
	        handleMouseLeave($event)
	      }
	    }
	  }, [_h('div', {
	    ref: "hiddenColumns",
	    staticClass: "hidden-columns"
	  }, [_t("default")]), " ", _h('div', {
	    staticClass: "el-table__header-wrapper"
	  }, [_h('table-header', {
	    style: ({
	      width: bodyWidth ? bodyWidth + 'px' : ''
	    }),
	    attrs: {
	      "columns": columns,
	      "all-selected": allSelected,
	      "selection": selection,
	      "border": border
	    },
	    on: {
	      "allselectedchange": handleAllSelectedChange
	    }
	  })]), " ", _h('div', {
	    staticClass: "el-table__body-wrapper"
	  }, [_h('table-body', {
	    style: ({
	      width: bodyWidth ? bodyWidth - (showVScrollBar ? currentGutterWidth : 0) + 'px' : ''
	    }),
	    attrs: {
	      "columns": columns,
	      "selection": selection,
	      "data": filterData
	    }
	  })]), " ", _h('div', {
	    ref: "fixed",
	    staticClass: "el-table__fixed",
	    style: ({
	      width: fixedBodyWidth ? fixedBodyWidth + 'px' : ''
	    })
	  }, [(fixedColumnCount > 0) ? _h('div', {
	    staticClass: "el-table__fixed-header-wrapper"
	  }, [_h('table-header', {
	    style: ({
	      width: fixedBodyWidth ? fixedBodyWidth + 'px' : ''
	    }),
	    attrs: {
	      "columns": fixedColumns,
	      "all-selected": allSelected,
	      "selection": selection,
	      "border": border
	    },
	    on: {
	      "allselectedchange": handleAllSelectedChange
	    }
	  })]) : _e(), " ", (fixedColumnCount > 0) ? _h('div', {
	    staticClass: "el-table__fixed-body-wrapper",
	    style: ({
	      top: headerHeight + 'px'
	    })
	  }, [_h('table-body', {
	    style: ({
	      width: fixedBodyWidth ? fixedBodyWidth + 'px' : ''
	    }),
	    attrs: {
	      "columns": fixedColumns,
	      "fixed": "",
	      "selection": selection,
	      "data": filterData
	    }
	  })]) : _e()]), " ", _h('div', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (resizeProxyVisible),
	      expression: "resizeProxyVisible"
	    }],
	    ref: "resizeProxy",
	    staticClass: "el-table__column-resize-proxy"
	  }), " ", _t("bottom")])
	}},staticRenderFns: []}

/***/ },
/* 127 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ElTableColumn = __webpack_require__(128);

	ElTableColumn.install = function (Vue) {
	  Vue.component(ElTableColumn.name, ElTableColumn);
	};

	module.exports = ElTableColumn;

/***/ },
/* 128 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _index = __webpack_require__(92);

	var _index2 = _interopRequireDefault(_index);

	var _index3 = __webpack_require__(24);

	var _index4 = _interopRequireDefault(_index3);

	var _objectAssign = __webpack_require__(122);

	var _objectAssign2 = _interopRequireDefault(_objectAssign);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var columnIdSeed = 1;

	var defaults = {
	  default: {
	    direction: ''
	  },
	  selection: {
	    width: 48,
	    minWidth: 48,
	    realWidth: 48,
	    direction: ''
	  },
	  index: {
	    width: 48,
	    minWidth: 48,
	    realWidth: 48,
	    direction: ''
	  },
	  filter: {
	    headerTemplate: function headerTemplate(h) {
	      return h(
	        'span',
	        null,
	        ['filter header']
	      );
	    },
	    direction: ''
	  }
	};

	var forced = {
	  selection: {
	    headerTemplate: function headerTemplate(h) {
	      var _this = this;

	      return h(
	        'div',
	        null,
	        [h(
	          'el-checkbox',
	          {
	            nativeOn: {
	              click: this.toggleAllSelection
	            },
	            domProps: {
	              value: this.allSelected
	            },
	            on: {
	              input: function input($event) {
	                return _this.$emit('allselectedchange', $event);
	              }
	            }
	          },
	          []
	        )]
	      );
	    },
	    template: function template(h, _ref) {
	      var row = _ref.row;
	      return h(
	        'el-checkbox',
	        {
	          domProps: {
	            value: row.$selected
	          },
	          on: {
	            input: function input($event) {
	              row.$selected = $event;
	            }
	          }
	        },
	        []
	      );
	    },
	    sortable: false,
	    resizable: false
	  },
	  index: {
	    headerTemplate: function headerTemplate(h, label) {
	      return h(
	        'div',
	        null,
	        [label || '#']
	      );
	    },
	    template: function template(h, _ref2) {
	      var row = _ref2.row;
	      var $index = _ref2.$index;
	      return h(
	        'div',
	        null,
	        [$index + 1]
	      );
	    },
	    sortable: false
	  },
	  filter: {
	    headerTemplate: function headerTemplate(h) {
	      return h(
	        'div',
	        null,
	        ['#']
	      );
	    },
	    template: function template(h, _ref3) {
	      var row = _ref3.row;
	      var column = _ref3.column;
	      return h(
	        'el-tag',
	        {
	          attrs: { type: 'primary' },
	          style: 'height: 16px; line-height: 16px; min-width: 40px; text-align: center' },
	        [row[column.property]]
	      );
	    },
	    resizable: false
	  }
	};

	var getDefaultColumn = function getDefaultColumn(type, options) {
	  var column = {};

	  (0, _objectAssign2.default)(column, defaults[type || 'default']);

	  for (var name in options) {
	    if (options.hasOwnProperty(name)) {
	      var value = options[name];
	      if (typeof value !== 'undefined') {
	        column[name] = value;
	      }
	    }
	  }

	  return column;
	};

	exports.default = {
	  name: 'el-table-column',

	  props: {
	    type: {
	      type: String,
	      default: 'default'
	    },
	    label: String,
	    property: String,
	    width: {},
	    minWidth: {},
	    template: String,
	    sortable: {
	      type: Boolean,
	      default: false
	    },
	    resizable: {
	      type: Boolean,
	      default: true
	    },
	    align: String,
	    showTooltipWhenOverflow: {
	      type: Boolean,
	      default: false
	    },
	    formatter: Function
	  },

	  render: function render() {},
	  data: function data() {
	    return {
	      isChildColumn: false,
	      columns: []
	    };
	  },
	  beforeCreate: function beforeCreate() {
	    this.row = {};
	    this.column = {};
	    this.$index = 0;
	  },


	  components: {
	    ElCheckbox: _index2.default,
	    ElTag: _index4.default
	  },

	  created: function created() {
	    this.customRender = this.$options.render;
	    this.$options.render = function (h) {
	      return h('div');
	    };

	    var columnId = this.columnId = (this.$parent.gridId || this.$parent.columnId + '_') + 'column_' + columnIdSeed++;

	    var parent = this.$parent;
	    if (!parent.gridId) {
	      this.isChildColumn = true;
	    }

	    var type = this.type;

	    var width = this.width;
	    if (width !== undefined) {
	      width = parseInt(width, 10);
	      if (isNaN(width)) {
	        width = null;
	      }
	    }

	    var minWidth = this.minWidth;
	    if (minWidth !== undefined) {
	      minWidth = parseInt(minWidth, 10);
	      if (isNaN(minWidth)) {
	        minWidth = 80;
	      }
	    } else {
	      minWidth = 80;
	    }

	    var isColumnGroup = false;
	    var template = void 0;

	    var property = this.property;
	    if (property) {
	      template = function template(h, _ref4, parent) {
	        var row = _ref4.row;

	        return h(
	          'span',
	          null,
	          [parent.$getPropertyText(row, property, columnId)]
	        );
	      };
	    }

	    var column = getDefaultColumn(type, {
	      id: columnId,
	      label: this.label,
	      property: this.property,
	      type: type,
	      template: template,
	      minWidth: minWidth,
	      width: width,
	      isColumnGroup: isColumnGroup,
	      align: this.align ? 'is-' + this.align : null,
	      realWidth: width || minWidth,
	      sortable: this.sortable,
	      resizable: this.resizable,
	      showTooltipWhenOverflow: this.showTooltipWhenOverflow,
	      formatter: this.formatter
	    });

	    (0, _objectAssign2.default)(column, forced[type] || {});

	    var renderColumn = column.template;
	    var _self = this;

	    column.template = function (h, data) {
	      if (_self.$vnode.data.inlineTemplate) {
	        renderColumn = function renderColumn() {
	          data._staticTrees = _self._staticTrees;
	          data.$options = {};
	          data.$options.staticRenderFns = _self.$options.staticRenderFns;
	          data._renderProxy = _self._renderProxy;
	          data._m = _self._m;

	          return _self.customRender.call(data);
	        };
	      };

	      return _self.showTooltipWhenOverflow ? h(
	        'el-tooltip',
	        {
	          attrs: {
	            effect: this.effect,
	            placement: 'top',
	            disabled: this.tooltipDisabled }
	        },
	        [h(
	          'div',
	          { 'class': 'cell' },
	          [renderColumn(h, data, this._renderProxy)]
	        ), h(
	          'span',
	          { slot: 'content' },
	          [renderColumn(h, data, this._renderProxy)]
	        )]
	      ) : h(
	        'div',
	        { 'class': 'cell' },
	        [renderColumn(h, data, this._renderProxy)]
	      );
	    };

	    this.columnConfig = column;
	  },
	  destroyed: function destroyed() {
	    if (!this.$parent) {
	      return;
	    }
	    var columns = this.$parent.columns;
	    if (columns) {
	      var columnId = this.columnId;
	      for (var i = 0, j = columns.length; i < j; i++) {
	        var column = columns[i];

	        if (column.id === columnId) {
	          columns.splice(i, 1);
	          break;
	        }
	      }
	    }

	    if (this.isChildColumn) {
	      if (this.$parent.$parent.$ready) {
	        this.$parent.$parent.debouncedReRender();
	      }
	    } else {
	      if (this.$parent.$ready) {
	        this.$parent.debouncedReRender();
	      }
	    }
	  },


	  watch: {
	    label: function label(newVal) {
	      if (this.columnConfig) {
	        this.columnConfig.label = newVal;
	      }
	    },
	    property: function property(newVal) {
	      if (this.columnConfig) {
	        this.columnConfig.property = newVal;
	      }
	    }
	  },

	  mounted: function mounted() {
	    var parent = this.$parent;
	    var columnConfig = this.columnConfig;
	    var columnIndex = void 0;

	    if (!this.isChildColumn) {
	      columnIndex = [].indexOf.call(parent.$refs.hiddenColumns.children, this.$el);
	    } else {
	      columnIndex = [].indexOf.call(parent.$el.children, this.$el);
	    }

	    parent.columns.splice(columnIndex, 0, columnConfig);

	    if (this.isChildColumn) {
	      parent.columnConfig.columns = parent.columns;

	      if (parent.$parent.$ready) {
	        parent.$parent.debouncedReRender();
	      }
	    } else {
	      if (parent.$ready) {
	        parent.debouncedReRender();
	      }
	    }
	  }
	};

/***/ },
/* 129 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _datePicker = __webpack_require__(130);

	var _datePicker2 = _interopRequireDefault(_datePicker);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	module.exports = _datePicker2.default;

/***/ },
/* 130 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _picker = __webpack_require__(131);

	var _picker2 = _interopRequireDefault(_picker);

	var _date = __webpack_require__(137);

	var _date2 = _interopRequireDefault(_date);

	var _dateRange = __webpack_require__(156);

	var _dateRange2 = _interopRequireDefault(_dateRange);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var getPanel = function getPanel(type) {
	  if (type === 'daterange' || type === 'datetimerange') {
	    return _dateRange2.default;
	  }
	  return _date2.default;
	};

	exports.default = {
	  mixins: [_picker2.default],

	  name: 'ElDatePicker',

	  props: {
	    type: String,
	    default: 'date'
	  },

	  created: function created() {
	    this.panel = getPanel(this.type);
	  }
	};

/***/ },
/* 131 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(132)

	/* template */
	var __vue_template__ = __webpack_require__(136)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 132 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _vue = __webpack_require__(8);

	var _vue2 = _interopRequireDefault(_vue);

	var _clickoutside = __webpack_require__(30);

	var _clickoutside2 = _interopRequireDefault(_clickoutside);

	var _util = __webpack_require__(133);

	var _vuePopper = __webpack_require__(5);

	var _vuePopper2 = _interopRequireDefault(_vuePopper);

	var _emitter = __webpack_require__(18);

	var _emitter2 = _interopRequireDefault(_emitter);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var newPopper = {
	  props: {
	    appendToBody: _vuePopper2.default.props.appendToBody,
	    offset: _vuePopper2.default.props.offset,
	    boundariesPadding: _vuePopper2.default.props.boundariesPadding
	  },
	  methods: _vuePopper2.default.methods,
	  data: _vuePopper2.default.data,
	  beforeDestroy: _vuePopper2.default.beforeDestroy
	};

	var FUNCTION_KEYS = [13, 16, 17, 18, 19, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40];
	var RANGE_SEPARATOR = ' - ';
	var DEFAULT_FORMATS = {
	  date: 'yyyy-MM-dd',
	  month: 'yyyy-MM',
	  datetime: 'yyyy-MM-dd HH:mm:ss',
	  time: 'HH:mm:ss',
	  timerange: 'HH:mm:ss',
	  daterange: 'yyyy-MM-dd',
	  datetimerange: 'yyyy-MM-dd HH:mm:ss'
	};
	var HAVE_TRIGGER_TYPES = ['date', 'datetime', 'time', 'time-select', 'week', 'month', 'year', 'daterange', 'timerange', 'datetimerange'];
	var DATE_FORMATTER = function DATE_FORMATTER(value, format) {
	  return (0, _util.formatDate)(value, format);
	};
	var DATE_PARSER = function DATE_PARSER(text, format) {
	  text = text.split(':');
	  if (text.length > 1) text = text.map(function (item) {
	    return item.slice(-2);
	  });
	  text = text.join(':');

	  return (0, _util.parseDate)(text, format);
	};
	var RANGE_FORMATTER = function RANGE_FORMATTER(value, format) {
	  if (Array.isArray(value) && value.length === 2) {
	    var start = value[0];
	    var end = value[1];

	    if (start && end) {
	      return (0, _util.formatDate)(start, format) + RANGE_SEPARATOR + (0, _util.formatDate)(end, format);
	    }
	  }
	  return '';
	};
	var RANGE_PARSER = function RANGE_PARSER(text, format) {
	  var array = text.split(RANGE_SEPARATOR);
	  if (array.length === 2) {
	    var range1 = array[0].split(':').map(function (item) {
	      return item.slice(-2);
	    }).join(':');
	    var range2 = array[1].split(':').map(function (item) {
	      return item.slice(-2);
	    }).join(':');
	    return [(0, _util.parseDate)(range1, format), (0, _util.parseDate)(range2, format)];
	  }
	  return [];
	};
	var TYPE_VALUE_RESOLVER_MAP = {
	  default: {
	    formatter: function formatter(value) {
	      if (!value) return '';
	      return '' + value;
	    },
	    parser: function parser(text) {
	      if (text === undefined || text === '') return null;
	      return text;
	    }
	  },
	  week: {
	    formatter: function formatter(value) {
	      if (value instanceof Date) {
	        var weekNumber = (0, _util.getWeekNumber)(value);
	        return value.getFullYear() + 'w' + (weekNumber > 9 ? weekNumber : '0' + weekNumber);
	      }
	      return value;
	    },
	    parser: function parser(text) {
	      var array = (text || '').split('w');
	      if (array.length === 2) {
	        var year = Number(array[0]);
	        var month = Number(array[1]);

	        if (!isNaN(year) && !isNaN(month) && month < 54) {
	          return text;
	        }
	      }
	      return null;
	    }
	  },
	  date: {
	    formatter: DATE_FORMATTER,
	    parser: DATE_PARSER
	  },
	  datetime: {
	    formatter: DATE_FORMATTER,
	    parser: DATE_PARSER
	  },
	  daterange: {
	    formatter: RANGE_FORMATTER,
	    parser: RANGE_PARSER
	  },
	  datetimerange: {
	    formatter: RANGE_FORMATTER,
	    parser: RANGE_PARSER
	  },
	  timerange: {
	    formatter: RANGE_FORMATTER,
	    parser: RANGE_PARSER
	  },
	  time: {
	    formatter: DATE_FORMATTER,
	    parser: DATE_PARSER
	  },
	  month: {
	    formatter: DATE_FORMATTER,
	    parser: DATE_PARSER
	  },
	  year: {
	    formatter: function formatter(value) {
	      if (!value) return '';
	      return '' + value;
	    },
	    parser: function parser(text) {
	      var year = Number(text);
	      if (!isNaN(year)) return year;

	      return null;
	    }
	  },
	  number: {
	    formatter: function formatter(value) {
	      if (!value) return '';
	      return '' + value;
	    },
	    parser: function parser(text) {
	      var result = Number(text);

	      if (!isNaN(text)) {
	        return result;
	      } else {
	        return null;
	      }
	    }
	  }
	};
	var PLACEMENT_MAP = {
	  left: 'bottom-start',
	  center: 'bottom-center',
	  right: 'bottom-end'
	};

	exports.default = {
	  mixins: [_emitter2.default, newPopper],

	  props: {
	    format: String,
	    readonly: Boolean,
	    placeholder: String,
	    align: {
	      type: String,
	      default: 'left'
	    },
	    value: {},
	    haveTrigger: {},
	    pickerOptions: {}
	  },

	  directives: {
	    Clickoutside: _clickoutside2.default
	  },

	  data: function data() {
	    return {
	      pickerVisible: false
	    };
	  },


	  watch: {
	    pickerVisible: function pickerVisible(val) {
	      val ? this.showPicker() : this.hidePicker();
	    },
	    value: function value(val) {
	      this.dispatch('form-item', 'el.form.change');
	    }
	  },

	  computed: {
	    triggerClass: function triggerClass() {
	      return this.type.indexOf('time') !== -1 ? 'el-icon-time' : 'el-icon-date';
	    },
	    editable: function editable() {
	      return this.type.indexOf('range') === -1;
	    },
	    selectionMode: function selectionMode() {
	      if (this.type === 'week') {
	        return 'week';
	      } else if (this.type === 'month') {
	        return 'month';
	      } else if (this.type === 'year') {
	        return 'year';
	      }

	      return 'day';
	    },
	    haveTrigger: function haveTrigger() {
	      if (typeof this.showTrigger !== 'undefined') {
	        return this.showTrigger;
	      }
	      return HAVE_TRIGGER_TYPES.indexOf(this.type) !== -1;
	    },


	    visualValue: {
	      get: function get() {
	        var value = this.value;
	        var formatter = (TYPE_VALUE_RESOLVER_MAP[this.type] || TYPE_VALUE_RESOLVER_MAP['default']).formatter;
	        var format = DEFAULT_FORMATS[this.type];

	        return formatter(value, this.format || format);
	      },
	      set: function set(value) {
	        if (value) {
	          var type = this.type;
	          var parser = (TYPE_VALUE_RESOLVER_MAP[type] || TYPE_VALUE_RESOLVER_MAP['default']).parser;
	          var parsedValue = parser(value, this.format || DEFAULT_FORMATS[type]);

	          if (parsedValue) {
	            this.$emit('input', parsedValue);
	          }
	          return;
	        }
	        this.$emit('input', value);
	      }
	    }
	  },

	  created: function created() {
	    this.options = {
	      boundariesPadding: 0,
	      gpuAcceleration: false
	    };
	    this.placement = PLACEMENT_MAP[this.align] || PLACEMENT_MAP.left;
	  },


	  methods: {
	    handleClose: function handleClose() {
	      this.pickerVisible = false;
	    },
	    handleFocus: function handleFocus() {
	      var type = this.type;

	      if (HAVE_TRIGGER_TYPES.indexOf(type) !== -1 && !this.pickerVisible) {
	        this.pickerVisible = true;
	      }
	      this.$emit('focus', this);
	    },
	    handleBlur: function handleBlur() {
	      this.$emit('blur', this);
	      this.dispatch('form-item', 'el.form.blur');
	    },
	    handleKeydown: function handleKeydown(event) {
	      var keyCode = event.keyCode;
	      var selectionStart = event.target.selectionStart;
	      var selectionEnd = event.target.selectionEnd;
	      var length = event.target.value.length;

	      if (keyCode === 9) {
	        this.pickerVisible = false;
	      } else if (keyCode === 27) {
	        this.pickerVisible = this.picker.visible = false;
	      } else if (keyCode === 37) {
	        event.preventDefault();

	        if (selectionEnd === length && selectionStart === length) {
	          event.target.selectionStart = length - 2;
	        } else if (selectionStart >= 3) {
	          event.target.selectionStart -= 3;
	        } else {
	          event.target.selectionStart = 0;
	        }
	        event.target.selectionEnd = event.target.selectionStart + 2;
	      } else if (keyCode === 39) {
	        event.preventDefault();
	        if (selectionEnd === 0 && selectionStart === 0) {
	          event.target.selectionEnd = 2;
	        } else if (selectionEnd <= length - 3) {
	          event.target.selectionEnd += 3;
	        } else {
	          event.target.selectionEnd = length;
	        }
	        event.target.selectionStart = event.target.selectionEnd - 2;
	      }
	    },
	    handleKeyup: function handleKeyup(event) {
	      var keyCode = event.keyCode;
	      if (FUNCTION_KEYS.indexOf(keyCode) > -1) return;
	      if (!(this.picker && this.pickerVisible)) return;
	      var selectionStart = event.target.selectionStart;
	      var value = event.target.value;
	      var type = this.type;
	      var parser = (TYPE_VALUE_RESOLVER_MAP[type] || TYPE_VALUE_RESOLVER_MAP['default']).parser;
	      var parsedValue = parser(value, this.format || DEFAULT_FORMATS[type]);

	      if (!parsedValue) return;
	      this.picker.value = parsedValue;
	      this.$emit('input', parsedValue);

	      if (this.type.indexOf('date') > -1) return;

	      setTimeout(function (_) {
	        var start = selectionStart;
	        var end = selectionStart;
	        var offset = 2;

	        if (selectionStart === 9) {
	          start += offset;
	        }
	        if (selectionStart >= 12) {
	          if (selectionStart % 3 === 0) {
	            start += 1;
	            end = start;
	          } else if (selectionStart % 3 === 2) {
	            end = start + offset;
	          }
	        } else {
	          if (selectionStart % 3 === 1) {
	            start += 1;
	            end = start;
	          } else if (selectionStart % 3 === 0) {
	            end = start + offset;
	          }
	        }

	        event.target.selectionStart = start;
	        event.target.selectionEnd = end;
	      }, 0);
	    },
	    togglePicker: function togglePicker() {
	      !this.pickerVisible ? this.showPicker() : this.hidePicker();
	    },
	    hidePicker: function hidePicker() {
	      if (this.picker) {
	        this.picker.resetView && this.picker.resetView();
	        this.pickerVisible = this.picker.visible = false;
	        this.destroyPopper();
	      }
	    },
	    showPicker: function showPicker() {
	      var _this = this;

	      if (!this.picker) {
	        this.panel.defaultValue = this.value;
	        this.picker = new _vue2.default(this.panel).$mount(document.createElement('div'));
	        this.popperElm = this.picker.$el;
	        this.picker.width = this.$refs.reference.getBoundingClientRect().width;
	        this.picker.showTime = this.type === 'datetime' || this.type === 'datetimerange';
	        this.picker.selectionMode = this.selectionMode;
	        if (this.format) {
	          this.picker.format = this.format;
	        }

	        var options = this.pickerOptions;

	        if (options && options.selectableRange) {
	          (function () {
	            var ranges = options.selectableRange;
	            var parser = TYPE_VALUE_RESOLVER_MAP.datetimerange.parser;
	            var format = DEFAULT_FORMATS.timerange;

	            ranges = Array.isArray(ranges) ? ranges : [ranges];
	            _this.picker.selectableRange = ranges.map(function (range) {
	              return parser(range, format);
	            });
	          })();
	        }

	        if (this.type === 'time-select' && options) {
	          this.$watch('pickerOptions.minTime', function (val) {
	            _this.picker.minTime = val;
	          });
	        }

	        for (var option in options) {
	          if (options.hasOwnProperty(option) && option !== 'selectableRange') {
	            this.picker[option] = options[option];
	          }
	        }

	        this.$el.appendChild(this.picker.$el);
	        this.pickerVisible = this.picker.visible = true;
	        this.picker.resetView && this.picker.resetView();

	        this.picker.$on('dodestroy', this.doDestroy);
	        this.picker.$on('pick', function (date) {
	          var visible = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

	          _this.$emit('input', date);

	          if (!visible) {
	            _this.pickerVisible = _this.picker.visible = !_this.picker.visible;
	          }
	          _this.picker.resetView && _this.picker.resetView();
	        });

	        this.picker.$on('select-range', function (start, end) {
	          setTimeout(function () {
	            _this.$refs.reference.setSelectionRange(start, end);
	            _this.$refs.reference.focus();
	          }, 0);
	        });
	      } else {
	        this.pickerVisible = this.picker.visible = true;
	      }

	      this.updatePopper();

	      if (this.value instanceof Date) {
	        this.picker.date = new Date(this.value.getTime());
	        this.picker.resetView && this.picker.resetView();
	      } else {
	        this.picker.value = this.value;
	      }

	      this.$nextTick(function () {
	        if (_this.type.indexOf('time') !== -1) {
	          _this.picker.focusEditor && _this.picker.focusEditor('hours');
	        }
	        _this.picker.ajustScrollTop && _this.picker.ajustScrollTop();
	      });
	    }
	  }
	};

/***/ },
/* 133 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.$t = exports.limitRange = exports.getRangeHours = exports.nextMonth = exports.prevMonth = exports.getWeekNumber = exports.getStartDateOfMonth = exports.DAY_DURATION = exports.getFirstDayOfMonth = exports.getDayCountOfMonth = exports.parseDate = exports.formatDate = exports.toDate = undefined;

	var _date = __webpack_require__(134);

	var _date2 = _interopRequireDefault(_date);

	var _i18n = __webpack_require__(135);

	var _i18n2 = _interopRequireDefault(_i18n);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var newArray = function newArray(start, end) {
	  var result = [];
	  for (var i = start; i <= end; i++) {
	    result.push(i);
	  }
	  return result;
	};

	var toDate = exports.toDate = function toDate(date) {
	  date = new Date(date);
	  if (isNaN(date.getTime())) return null;
	  return date;
	};

	var formatDate = exports.formatDate = function formatDate(date, format) {
	  date = toDate(date);
	  if (!date) return '';
	  return _date2.default.format(date, format || 'yyyy-MM-dd');
	};

	var parseDate = exports.parseDate = function parseDate(string, format) {
	  return _date2.default.parse(string, format || 'yyyy-MM-dd');
	};

	var getDayCountOfMonth = exports.getDayCountOfMonth = function getDayCountOfMonth(year, month) {
	  if (month === 3 || month === 5 || month === 8 || month === 10) {
	    return 30;
	  }

	  if (month === 1) {
	    if (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) {
	      return 29;
	    } else {
	      return 28;
	    }
	  }

	  return 31;
	};

	var getFirstDayOfMonth = exports.getFirstDayOfMonth = function getFirstDayOfMonth(date) {
	  var temp = new Date(date.getTime());
	  temp.setDate(1);
	  return temp.getDay();
	};

	var DAY_DURATION = exports.DAY_DURATION = 86400000;

	var getStartDateOfMonth = exports.getStartDateOfMonth = function getStartDateOfMonth(year, month) {
	  var result = new Date(year, month, 1);
	  var day = result.getDay();

	  if (day === 0) {
	    result.setTime(result.getTime() - DAY_DURATION * 7);
	  } else {
	    result.setTime(result.getTime() - DAY_DURATION * day);
	  }

	  return result;
	};

	var getWeekNumber = exports.getWeekNumber = function getWeekNumber(src) {
	  var date = new Date(src.getTime());
	  date.setHours(0, 0, 0, 0);

	  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);

	  var week1 = new Date(date.getFullYear(), 0, 4);

	  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
	};

	var prevMonth = exports.prevMonth = function prevMonth(src) {
	  var year = src.getFullYear();
	  var month = src.getMonth();
	  var date = src.getDate();

	  var newYear = month === 0 ? year - 1 : year;
	  var newMonth = month === 0 ? 11 : month - 1;

	  var newMonthDayCount = getDayCountOfMonth(newYear, newMonth);
	  if (newMonthDayCount < date) {
	    src.setDate(newMonthDayCount);
	  }

	  src.setMonth(newMonth);
	  src.setFullYear(newYear);

	  return new Date(src.getTime());
	};

	var nextMonth = exports.nextMonth = function nextMonth(src) {
	  var year = src.getFullYear();
	  var month = src.getMonth();
	  var date = src.getDate();

	  var newYear = month === 11 ? year + 1 : year;
	  var newMonth = month === 11 ? 0 : month + 1;

	  var newMonthDayCount = getDayCountOfMonth(newYear, newMonth);
	  if (newMonthDayCount < date) {
	    src.setDate(newMonthDayCount);
	  }

	  src.setMonth(newMonth);
	  src.setFullYear(newYear);

	  return new Date(src.getTime());
	};

	var getRangeHours = exports.getRangeHours = function getRangeHours(ranges) {
	  var hours = [];
	  var disabledHours = [];

	  (ranges || []).forEach(function (range) {
	    var value = range.map(function (date) {
	      return date.getHours();
	    });

	    disabledHours = disabledHours.concat(newArray(value[0], value[1]));
	  });

	  if (disabledHours.length) {
	    for (var i = 0; i < 24; i++) {
	      hours[i] = disabledHours.indexOf(i) === -1;
	    }
	  } else {
	    for (var _i = 0; _i < 24; _i++) {
	      hours[_i] = false;
	    }
	  }

	  return hours;
	};

	var limitRange = exports.limitRange = function limitRange(date, ranges) {
	  if (!ranges || !ranges.length) return date;

	  var len = ranges.length;
	  var format = 'HH:mm:ss';

	  date = _date2.default.parse(_date2.default.format(date, format), format);
	  for (var i = 0; i < len; i++) {
	    var range = ranges[i];
	    if (date >= range[0] && date <= range[1]) {
	      return date;
	    }
	  }

	  var maxDate = ranges[0][0];
	  var minDate = ranges[0][0];

	  ranges.forEach(function (range) {
	    minDate = new Date(Math.min(range[0], minDate));
	    maxDate = new Date(Math.max(range[1], maxDate));
	  });

	  return date < minDate ? minDate : maxDate;
	};

	var $t = exports.$t = function $t(path, options) {
	  var vuei18n = Object.getPrototypeOf(this).$t;
	  if (typeof vuei18n === 'function') {
	    return vuei18n.apply(this, [path, options]);
	  }
	  var array = path.split('.');
	  var current = _i18n2.default;
	  for (var i = 0, j = array.length; i < j; i++) {
	    var property = array[i];
	    var value = current[property];
	    if (i === j - 1) return value;
	    if (!value) return '';
	    current = value;
	  }
	  return '';
	};

/***/ },
/* 134 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*eslint-disable*/
	// 把 YYYY-MM-DD 改成了 yyyy-MM-dd
	(function (main) {
	  'use strict';

	  /**
	   * Parse or format dates
	   * @class fecha
	   */
	  var fecha = {};
	  var token = /d{1,4}|M{1,4}|yy(?:yy)?|S{1,3}|Do|ZZ|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g;
	  var twoDigits = /\d\d?/;
	  var threeDigits = /\d{3}/;
	  var fourDigits = /\d{4}/;
	  var word = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;
	  var noop = function () {
	  };

	  function shorten(arr, sLen) {
	    var newArr = [];
	    for (var i = 0, len = arr.length; i < len; i++) {
	      newArr.push(arr[i].substr(0, sLen));
	    }
	    return newArr;
	  }

	  function monthUpdate(arrName) {
	    return function (d, v, i18n) {
	      var index = i18n[arrName].indexOf(v.charAt(0).toUpperCase() + v.substr(1).toLowerCase());
	      if (~index) {
	        d.month = index;
	      }
	    };
	  }

	  function pad(val, len) {
	    val = String(val);
	    len = len || 2;
	    while (val.length < len) {
	      val = '0' + val;
	    }
	    return val;
	  }

	  var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	  var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	  var monthNamesShort = shorten(monthNames, 3);
	  var dayNamesShort = shorten(dayNames, 3);
	  fecha.i18n = {
	    dayNamesShort: dayNamesShort,
	    dayNames: dayNames,
	    monthNamesShort: monthNamesShort,
	    monthNames: monthNames,
	    amPm: ['am', 'pm'],
	    DoFn: function DoFn(D) {
	      return D + ['th', 'st', 'nd', 'rd'][D % 10 > 3 ? 0 : (D - D % 10 !== 10) * D % 10];
	    }
	  };

	  var formatFlags = {
	    D: function(dateObj) {
	      return dateObj.getDay();
	    },
	    DD: function(dateObj) {
	      return pad(dateObj.getDay());
	    },
	    Do: function(dateObj, i18n) {
	      return i18n.DoFn(dateObj.getDate());
	    },
	    d: function(dateObj) {
	      return dateObj.getDate();
	    },
	    dd: function(dateObj) {
	      return pad(dateObj.getDate());
	    },
	    ddd: function(dateObj, i18n) {
	      return i18n.dayNamesShort[dateObj.getDay()];
	    },
	    dddd: function(dateObj, i18n) {
	      return i18n.dayNames[dateObj.getDay()];
	    },
	    M: function(dateObj) {
	      return dateObj.getMonth() + 1;
	    },
	    MM: function(dateObj) {
	      return pad(dateObj.getMonth() + 1);
	    },
	    MMM: function(dateObj, i18n) {
	      return i18n.monthNamesShort[dateObj.getMonth()];
	    },
	    MMMM: function(dateObj, i18n) {
	      return i18n.monthNames[dateObj.getMonth()];
	    },
	    yy: function(dateObj) {
	      return String(dateObj.getFullYear()).substr(2);
	    },
	    yyyy: function(dateObj) {
	      return dateObj.getFullYear();
	    },
	    h: function(dateObj) {
	      return dateObj.getHours() % 12 || 12;
	    },
	    hh: function(dateObj) {
	      return pad(dateObj.getHours() % 12 || 12);
	    },
	    H: function(dateObj) {
	      return dateObj.getHours();
	    },
	    HH: function(dateObj) {
	      return pad(dateObj.getHours());
	    },
	    m: function(dateObj) {
	      return dateObj.getMinutes();
	    },
	    mm: function(dateObj) {
	      return pad(dateObj.getMinutes());
	    },
	    s: function(dateObj) {
	      return dateObj.getSeconds();
	    },
	    ss: function(dateObj) {
	      return pad(dateObj.getSeconds());
	    },
	    S: function(dateObj) {
	      return Math.round(dateObj.getMilliseconds() / 100);
	    },
	    SS: function(dateObj) {
	      return pad(Math.round(dateObj.getMilliseconds() / 10), 2);
	    },
	    SSS: function(dateObj) {
	      return pad(dateObj.getMilliseconds(), 3);
	    },
	    a: function(dateObj, i18n) {
	      return dateObj.getHours() < 12 ? i18n.amPm[0] : i18n.amPm[1];
	    },
	    A: function(dateObj, i18n) {
	      return dateObj.getHours() < 12 ? i18n.amPm[0].toUpperCase() : i18n.amPm[1].toUpperCase();
	    },
	    ZZ: function(dateObj) {
	      var o = dateObj.getTimezoneOffset();
	      return (o > 0 ? '-' : '+') + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4);
	    }
	  };

	  var parseFlags = {
	    d: [twoDigits, function (d, v) {
	      d.day = v;
	    }],
	    M: [twoDigits, function (d, v) {
	      d.month = v - 1;
	    }],
	    yy: [twoDigits, function (d, v) {
	      var da = new Date(), cent = +('' + da.getFullYear()).substr(0, 2);
	      d.year = '' + (v > 68 ? cent - 1 : cent) + v;
	    }],
	    h: [twoDigits, function (d, v) {
	      d.hour = v;
	    }],
	    m: [twoDigits, function (d, v) {
	      d.minute = v;
	    }],
	    s: [twoDigits, function (d, v) {
	      d.second = v;
	    }],
	    yyyy: [fourDigits, function (d, v) {
	      d.year = v;
	    }],
	    S: [/\d/, function (d, v) {
	      d.millisecond = v * 100;
	    }],
	    SS: [/\d{2}/, function (d, v) {
	      d.millisecond = v * 10;
	    }],
	    SSS: [threeDigits, function (d, v) {
	      d.millisecond = v;
	    }],
	    D: [twoDigits, noop],
	    ddd: [word, noop],
	    MMM: [word, monthUpdate('monthNamesShort')],
	    MMMM: [word, monthUpdate('monthNames')],
	    a: [word, function (d, v, i18n) {
	      var val = v.toLowerCase();
	      if (val === i18n.amPm[0]) {
	        d.isPm = false;
	      } else if (val === i18n.amPm[1]) {
	        d.isPm = true;
	      }
	    }],
	    ZZ: [/[\+\-]\d\d:?\d\d/, function (d, v) {
	      var parts = (v + '').match(/([\+\-]|\d\d)/gi), minutes;

	      if (parts) {
	        minutes = +(parts[1] * 60) + parseInt(parts[2], 10);
	        d.timezoneOffset = parts[0] === '+' ? minutes : -minutes;
	      }
	    }]
	  };
	  parseFlags.DD = parseFlags.DD;
	  parseFlags.dddd = parseFlags.ddd;
	  parseFlags.Do = parseFlags.dd = parseFlags.d;
	  parseFlags.mm = parseFlags.m;
	  parseFlags.hh = parseFlags.H = parseFlags.HH = parseFlags.h;
	  parseFlags.MM = parseFlags.M;
	  parseFlags.ss = parseFlags.s;
	  parseFlags.A = parseFlags.a;


	  // Some common format strings
	  fecha.masks = {
	    'default': 'ddd MMM dd yyyy HH:mm:ss',
	    shortDate: 'M/D/yy',
	    mediumDate: 'MMM d, yyyy',
	    longDate: 'MMMM d, yyyy',
	    fullDate: 'dddd, MMMM d, yyyy',
	    shortTime: 'HH:mm',
	    mediumTime: 'HH:mm:ss',
	    longTime: 'HH:mm:ss.SSS'
	  };

	  /***
	   * Format a date
	   * @method format
	   * @param {Date|number} dateObj
	   * @param {string} mask Format of the date, i.e. 'mm-dd-yy' or 'shortDate'
	   */
	  fecha.format = function (dateObj, mask, i18nSettings) {
	    var i18n = i18nSettings || fecha.i18n;

	    if (typeof dateObj === 'number') {
	      dateObj = new Date(dateObj);
	    }

	    if (Object.prototype.toString.call(dateObj) !== '[object Date]' || isNaN(dateObj.getTime())) {
	      throw new Error('Invalid Date in fecha.format');
	    }

	    mask = fecha.masks[mask] || mask || fecha.masks['default'];

	    return mask.replace(token, function ($0) {
	      return $0 in formatFlags ? formatFlags[$0](dateObj, i18n) : $0.slice(1, $0.length - 1);
	    });
	  };

	  /**
	   * Parse a date string into an object, changes - into /
	   * @method parse
	   * @param {string} dateStr Date string
	   * @param {string} format Date parse format
	   * @returns {Date|boolean}
	   */
	  fecha.parse = function (dateStr, format, i18nSettings) {
	    var i18n = i18nSettings || fecha.i18n;

	    if (typeof format !== 'string') {
	      throw new Error('Invalid format in fecha.parse');
	    }

	    format = fecha.masks[format] || format;

	    // Avoid regular expression denial of service, fail early for really long strings
	    // https://www.owasp.org/index.php/Regular_expression_Denial_of_Service_-_ReDoS
	    if (dateStr.length > 1000) {
	      return false;
	    }

	    var isValid = true;
	    var dateInfo = {};
	    format.replace(token, function ($0) {
	      if (parseFlags[$0]) {
	        var info = parseFlags[$0];
	        var index = dateStr.search(info[0]);
	        if (!~index) {
	          isValid = false;
	        } else {
	          dateStr.replace(info[0], function (result) {
	            info[1](dateInfo, result, i18n);
	            dateStr = dateStr.substr(index + result.length);
	            return result;
	          });
	        }
	      }

	      return parseFlags[$0] ? '' : $0.slice(1, $0.length - 1);
	    });

	    if (!isValid) {
	      return false;
	    }

	    var today = new Date();
	    if (dateInfo.isPm === true && dateInfo.hour != null && +dateInfo.hour !== 12) {
	      dateInfo.hour = +dateInfo.hour + 12;
	    } else if (dateInfo.isPm === false && +dateInfo.hour === 12) {
	      dateInfo.hour = 0;
	    }

	    var date;
	    if (dateInfo.timezoneOffset != null) {
	      dateInfo.minute = +(dateInfo.minute || 0) - +dateInfo.timezoneOffset;
	      date = new Date(Date.UTC(dateInfo.year || today.getFullYear(), dateInfo.month || 0, dateInfo.day || 1,
	        dateInfo.hour || 0, dateInfo.minute || 0, dateInfo.second || 0, dateInfo.millisecond || 0));
	    } else {
	      date = new Date(dateInfo.year || today.getFullYear(), dateInfo.month || 0, dateInfo.day || 1,
	        dateInfo.hour || 0, dateInfo.minute || 0, dateInfo.second || 0, dateInfo.millisecond || 0);
	    }
	    return date;
	  };

	  /* istanbul ignore next */
	  if (typeof module !== 'undefined' && module.exports) {
	    module.exports = fecha;
	  } else if (true) {
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	      return fecha;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else {
	    main.fecha = fecha;
	  }
	})(this);


/***/ },
/* 135 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports.default = {
	  datepicker: {
	    now: '此刻',
	    today: '今天',
	    cancel: '取消',
	    clear: '清空',
	    confirm: '确定',
	    selectDate: '选择日期',
	    selectTime: '选择时间',
	    startTime: '开始时间',
	    endTime: '结束时间',
	    year: '年',
	    month: '月',
	    week: '周次',
	    weeks: {
	      sun: '日',
	      mon: '一',
	      tue: '二',
	      wed: '三',
	      thu: '四',
	      fri: '五',
	      sat: '六'
	    },
	    months: {
	      jan: '一月',
	      feb: '二月',
	      mar: '三月',
	      apr: '四月',
	      may: '五月',
	      jun: '六月',
	      jul: '七月',
	      aug: '八月',
	      sep: '九月',
	      oct: '十月',
	      nov: '十一月',
	      dec: '十二月'
	    }
	  }
	};

/***/ },
/* 136 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('span', {
	    directives: [{
	      name: "clickoutside",
	      rawName: "v-clickoutside",
	      value: (handleClose),
	      expression: "handleClose"
	    }],
	    staticClass: "el-date-editor",
	    class: {
	      'is-have-trigger': haveTrigger,
	      'is-active': pickerVisible,
	      'is-filled': !!this.value
	    }
	  }, [_h('input', {
	    ref: "reference",
	    staticClass: "el-date-editor__editor",
	    attrs: {
	      "readonly": readonly,
	      "type": "text",
	      "placeholder": placeholder
	    },
	    domProps: {
	      "value": _s(visualValue)
	    },
	    on: {
	      "focus": handleFocus,
	      "blur": handleBlur,
	      "keydown": handleKeydown,
	      "keyup": handleKeyup,
	      "change": function($event) {
	        visualValue = $event.target.value
	      }
	    }
	  }), " ", (haveTrigger) ? _h('span', {
	    staticClass: "el-date-editor__trigger el-icon",
	    class: [triggerClass],
	    on: {
	      "click": function($event) {
	        togglePicker()
	      }
	    }
	  }) : _e()])
	}},staticRenderFns: []}

/***/ },
/* 137 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(138)

	/* template */
	var __vue_template__ = __webpack_require__(155)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 138 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _util = __webpack_require__(133);

	exports.default = {
	  watch: {
	    showTime: function showTime(val) {
	      var _this = this;

	      if (!val) return;
	      this.$nextTick(function (_) {
	        var inputElm = _this.$refs.input;
	        if (inputElm) {
	          _this.pickerWidth = inputElm.getBoundingClientRect().width + 10;
	        }
	      });
	    },
	    value: function value(newVal) {
	      if (this.selectionMode === 'day' && newVal instanceof Date) {
	        this.date = newVal;
	        this.year = newVal.getFullYear();
	        this.month = newVal.getMonth();
	      }
	    },
	    timePickerVisible: function timePickerVisible(val) {
	      var _this2 = this;

	      if (val) this.$nextTick(function () {
	        return _this2.$refs.timepicker.ajustScrollTop();
	      });
	    },
	    selectionMode: function selectionMode(newVal) {
	      if (newVal === 'month') {
	        if (this.currentView !== 'year' || this.currentView !== 'month') {
	          this.currentView = 'month';
	        }
	      }
	    },
	    date: function date(newVal) {
	      if (!this.year) {
	        this.year = newVal.getFullYear();
	        this.month = newVal.getMonth();
	      }
	    }
	  },

	  directives: {
	    Clickoutside: __webpack_require__(30).default
	  },

	  methods: {
	    $t: function $t() {
	      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }

	      return _util.$t.apply(this, args);
	    },
	    resetDate: function resetDate() {
	      this.date = new Date(this.date);
	    },
	    showMonthPicker: function showMonthPicker() {
	      this.currentView = 'month';
	    },
	    showYearPicker: function showYearPicker() {
	      this.currentView = 'year';
	    },
	    handleLabelClick: function handleLabelClick() {
	      if (this.currentView === 'date') {
	        this.showMonthPicker();
	      } else if (this.currentView === 'month') {
	        this.showYearPicker();
	      }
	    },
	    prevMonth: function prevMonth() {
	      this.month--;
	      if (this.month < 0) {
	        this.month = 11;
	        this.year--;
	      }
	    },
	    nextMonth: function nextMonth() {
	      this.month++;
	      if (this.month > 11) {
	        this.month = 0;
	        this.year++;
	      }
	    },
	    nextYear: function nextYear() {
	      if (this.currentView === 'year') {
	        this.$refs.yearTable.nextTenYear();
	      } else {
	        this.year++;
	      }
	    },
	    prevYear: function prevYear() {
	      if (this.currentView === 'year') {
	        this.$refs.yearTable.prevTenYear();
	      } else {
	        this.year--;
	      }
	    },
	    handleShortcutClick: function handleShortcutClick(shortcut) {
	      if (shortcut.onClick) {
	        shortcut.onClick(this);
	      }
	    },
	    handleTimePick: function handleTimePick(picker, visible, first) {
	      if (picker) {
	        var oldDate = new Date(this.date.getTime());
	        var hour = picker.getHours();
	        var minute = picker.getMinutes();
	        var second = picker.getSeconds();
	        oldDate.setHours(hour);
	        oldDate.setMinutes(minute);
	        oldDate.setSeconds(second);
	        this.date = new Date(oldDate.getTime());
	      }

	      if (!first) {
	        this.timePickerVisible = visible;
	      }
	    },
	    handleMonthPick: function handleMonthPick(month) {
	      this.month = month;
	      var selectionMode = this.selectionMode;
	      if (selectionMode !== 'month') {
	        this.date.setMonth(month);
	        this.currentView = 'date';
	        this.resetDate();
	      } else {
	        this.date.setMonth(month);
	        this.resetDate();
	        this.value = new Date(this.date.getFullYear(), month, 1);
	        this.$emit('pick', this.value);
	      }
	    },
	    handleDatePick: function handleDatePick(value) {
	      if (this.selectionMode === 'day') {
	        if (!this.showTime) {
	          this.$emit('pick', new Date(value.getTime()));
	        }
	        this.date.setFullYear(value.getFullYear());
	        this.date.setMonth(value.getMonth());
	        this.date.setDate(value.getDate());
	      } else if (this.selectionMode === 'week') {
	        var date = (0, _util.formatDate)(value.date, this.format || 'yyyywWW');
	        var week = this.week = value.week;

	        date = /WW/.test(date) ? date.replace(/WW/, week < 10 ? '0' + week : week) : date.replace(/W/, week);

	        this.$emit('pick', date);
	      }

	      this.resetDate();
	    },
	    handleYearPick: function handleYearPick(year) {
	      var close = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

	      this.year = year;
	      if (!close) return;

	      this.date.setFullYear(year);
	      if (this.selectionMode === 'year') {
	        this.$emit('pick', year);
	      } else {
	        this.currentView = 'month';
	      }

	      this.resetDate();
	    },
	    changeToToday: function changeToToday() {
	      this.date.setTime(+new Date());
	      this.$emit('pick', new Date(this.date.getTime()));
	      this.resetDate();
	    },
	    confirm: function confirm() {
	      this.$emit('pick', this.date);
	    },
	    resetView: function resetView() {
	      if (this.selectionMode === 'month') {
	        this.currentView = 'month';
	      } else if (this.selectionMode === 'year') {
	        this.currentView = 'year';
	      } else {
	        this.currentView = 'date';
	      }

	      if (this.selectionMode !== 'week') {
	        this.year = this.date.getFullYear();
	        this.month = this.date.getMonth();
	      }
	    },
	    closeTimePicker: function closeTimePicker() {
	      this.timePickerVisible = false;
	    }
	  },

	  components: {
	    TimePicker: __webpack_require__(139),
	    YearTable: __webpack_require__(145),
	    MonthTable: __webpack_require__(148),
	    DateTable: __webpack_require__(151)
	  },

	  mounted: function mounted() {
	    if (this.selectionMode === 'month') {
	      this.currentView = 'month';
	    }

	    if (this.date && !this.year) {
	      this.year = this.date.getFullYear();
	      this.month = this.date.getMonth();
	    }
	  },
	  data: function data() {
	    return {
	      pickerWidth: 0,
	      date: new Date(),
	      value: '',
	      showTime: false,
	      selectionMode: 'day',
	      shortcuts: '',
	      visible: false,
	      currentView: 'date',
	      disabledDate: '',
	      year: null,
	      month: null,
	      week: null,
	      timePickerVisible: false,
	      width: 0
	    };
	  },


	  computed: {
	    footerVisible: function footerVisible() {
	      return this.showTime;
	    },


	    visibleTime: {
	      get: function get() {
	        return (0, _util.formatDate)(this.date, 'HH:mm:ss');
	      },
	      set: function set(val) {
	        if (val) {
	          var date = (0, _util.parseDate)(val, 'HH:mm:ss');
	          if (date) {
	            date.setFullYear(this.date.getFullYear());
	            date.setMonth(this.date.getMonth());
	            date.setDate(this.date.getDate());
	            this.date = date;
	          }
	        }
	      }
	    },

	    visibleDate: {
	      get: function get() {
	        return (0, _util.formatDate)(this.date);
	      },
	      set: function set(val) {
	        var date = (0, _util.parseDate)(val, 'yyyy-MM-dd');
	        if (date) {
	          date.setHours(this.date.getHours());
	          date.setMinutes(this.date.getMinutes());
	          date.setSeconds(this.date.getSeconds());
	          this.date = date;
	        }
	      }
	    },

	    yearLabel: function yearLabel() {
	      var year = this.year;
	      if (!year) return '';
	      var yearTranslation = this.$t('datepicker.year');
	      if (this.currentView === 'year') {
	        var startYear = Math.floor(year / 10) * 10;
	        return startYear + ' ' + yearTranslation + '-' + (startYear + 9) + ' ' + yearTranslation;
	      }
	      return this.year + ' ' + yearTranslation;
	    },


	    hours: {
	      get: function get() {
	        return this.date.getHours();
	      },
	      set: function set(hours) {
	        this.date.setHours(hours);
	      }
	    },

	    minutes: {
	      get: function get() {
	        return this.date.getMinutes();
	      },
	      set: function set(minutes) {
	        this.date.setMinutes(minutes);
	      }
	    },

	    seconds: {
	      get: function get() {
	        return this.date.getSeconds();
	      },
	      set: function set(seconds) {
	        this.date.setSeconds(seconds);
	      }
	    },

	    timeText: function timeText() {
	      var hours = this.hours;
	      var minutes = this.minutes;
	      return (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes);
	    },
	    label: function label() {
	      var year = this.year;
	      var month = this.month + 1;

	      if (this.currentView === 'date') {
	        return year + ' / ' + month;
	      }

	      return year;
	    }
	  }
	};

/***/ },
/* 139 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(140)

	/* template */
	var __vue_template__ = __webpack_require__(144)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 140 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _util = __webpack_require__(133);

	var _vue = __webpack_require__(8);

	var _vue2 = _interopRequireDefault(_vue);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  components: {
	    TimeSpinner: __webpack_require__(141)
	  },

	  props: {
	    pickerWidth: {},
	    date: {
	      default: function _default() {
	        return new Date();
	      }
	    },
	    visible: Boolean
	  },

	  watch: {
	    visible: function visible(val) {
	      this.currentVisible = val;
	    },
	    pickerWidth: function pickerWidth(val) {
	      this.width = val;
	    },
	    value: function value(newVal) {
	      var date = void 0;
	      if (newVal instanceof Date) {
	        date = (0, _util.limitRange)(newVal, this.selectableRange);
	      } else if (!newVal) {
	        date = new Date();
	      }

	      this.hours = date.getHours();
	      this.minutes = date.getMinutes();
	      this.seconds = date.getSeconds();
	      this.handleConfirm(true);
	    },
	    selectableRange: function selectableRange(val) {
	      this.$refs.spinner.selectableRange = val;
	    }
	  },

	  data: function data() {
	    return {
	      format: 'HH:mm:ss',
	      value: '',
	      hours: 0,
	      minutes: 0,
	      seconds: 0,
	      selectableRange: [],
	      currentDate: this.$options.defaultValue || this.date,
	      currentVisible: this.visible,
	      width: this.pickerWidth || 0
	    };
	  },


	  computed: {
	    showSeconds: function showSeconds() {
	      return (this.format || '').indexOf('ss') !== -1;
	    }
	  },

	  methods: {
	    $t: function $t() {
	      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }

	      return _util.$t.apply(this, args);
	    },
	    handleCancel: function handleCancel() {
	      this.$emit('pick', null);
	    },
	    handleChange: function handleChange(date) {
	      if (date.hours !== undefined) {
	        this.currentDate.setHours(date.hours);
	        this.hours = this.currentDate.getHours();
	      }
	      if (date.minutes !== undefined) {
	        this.currentDate.setMinutes(date.minutes);
	        this.minutes = this.currentDate.getMinutes();
	      }
	      if (date.seconds !== undefined) {
	        this.currentDate.setSeconds(date.seconds);
	        this.seconds = this.currentDate.getSeconds();
	      }

	      this.handleConfirm(true);
	    },
	    setSelectionRange: function setSelectionRange(start, end) {
	      this.$emit('select-range', start, end);
	    },
	    handleConfirm: function handleConfirm() {
	      var visible = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
	      var first = arguments[1];

	      var date = new Date((0, _util.limitRange)(this.currentDate, this.selectableRange));

	      this.$emit('pick', date, visible, first);
	    },
	    focusEditor: function focusEditor(val) {
	      return this.$refs.spinner.focusEditor(val);
	    },
	    ajustScrollTop: function ajustScrollTop() {
	      return this.$refs.spinner.ajustScrollTop();
	    }
	  },

	  created: function created() {
	    !this.currentDate && _vue2.default.set(this, 'currentDate', new Date());
	    !this.currentVisible && _vue2.default.set(this, 'currentVisible', false);

	    this.hours = this.currentDate.getHours();
	    this.minutes = this.currentDate.getMinutes();
	    this.seconds = this.currentDate.getSeconds();
	  },
	  mounted: function mounted() {
	    var _this = this;

	    this.$nextTick(function () {
	      return _this.handleConfirm(true, true);
	    });
	  }
	};

/***/ },
/* 141 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(142)

	/* template */
	var __vue_template__ = __webpack_require__(143)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 142 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _util = __webpack_require__(133);

	exports.default = {
	  props: {
	    hours: {
	      type: Number,
	      default: 0
	    },

	    minutes: {
	      type: Number,
	      default: 0
	    },

	    seconds: {
	      type: Number,
	      default: 0
	    },

	    showSeconds: {
	      type: Boolean,
	      default: true
	    }
	  },

	  watch: {
	    hoursPrivate: function hoursPrivate(newVal, oldVal) {
	      if (!(newVal >= 0 && newVal <= 23)) {
	        this.hoursPrivate = oldVal;
	      }
	      this.$refs.hour.scrollTop = Math.max(0, (this.hoursPrivate - 2.5) * 32 + 80);

	      this.$emit('change', { hours: newVal });
	    },
	    minutesPrivate: function minutesPrivate(newVal, oldVal) {
	      if (!(newVal >= 0 && newVal <= 59)) {
	        this.minutesPrivate = oldVal;
	      }
	      this.$refs.minute.scrollTop = Math.max(0, (this.minutesPrivate - 2.5) * 32 + 80);
	      this.$emit('change', { minutes: newVal });
	    },
	    secondsPrivate: function secondsPrivate(newVal, oldVal) {
	      if (!(newVal >= 0 && newVal <= 59)) {
	        this.secondsPrivate = oldVal;
	      }
	      this.$refs.second.scrollTop = Math.max(0, (this.secondsPrivate - 2.5) * 32 + 80);
	      this.$emit('change', { seconds: newVal });
	    }
	  },

	  computed: {
	    hoursList: function hoursList() {
	      return (0, _util.getRangeHours)(this.selectableRange);
	    }
	  },

	  data: function data() {
	    return {
	      hoursPrivate: 0,
	      minutesPrivate: 0,
	      secondsPrivate: 0,
	      selectableRange: []
	    };
	  },


	  methods: {
	    focusEditor: function focusEditor(type) {
	      var editor = this.$refs[type + 'Editor'];
	      if (editor) {
	        editor.focus();
	      }
	    },
	    handleClick: function handleClick(type, value, disabled) {
	      if (value.disabled) {
	        return;
	      }

	      this[type + 'Private'] = value.value >= 0 ? value.value : value;

	      this.emitSelectRange(type);
	    },
	    emitSelectRange: function emitSelectRange(type) {
	      if (type === 'hours') {
	        this.$emit('select-range', 0, 2);
	      } else if (type === 'minutes') {
	        this.$emit('select-range', 3, 5);
	      } else if (type === 'seconds') {
	        this.$emit('select-range', 6, 8);
	      }
	    },
	    handleScroll: function handleScroll(type) {
	      var ajust = {};

	      ajust[type + 's'] = Math.min(Math.floor((this.$refs[type].scrollTop - 80) / 32 + 3), 59);
	      this.$emit('change', ajust);
	    },
	    ajustScrollTop: function ajustScrollTop() {
	      this.$refs.hour.scrollTop = Math.max(0, (this.hours - 2.5) * 32 + 80);
	      this.$refs.minute.scrollTop = Math.max(0, (this.minutes - 2.5) * 32 + 80);
	      this.$refs.second.scrollTop = Math.max(0, (this.seconds - 2.5) * 32 + 80);
	    }
	  }
	};

/***/ },
/* 143 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('div', {
	    staticClass: "el-time-spinner"
	  }, ["\n  " + _s(hours) + "\n  ", _h('div', {
	    ref: "hour",
	    staticClass: "el-time-spinner__wrapper",
	    on: {
	      "mouseenter": function($event) {
	        emitSelectRange('hours')
	      },
	      "mousewheel": function($event) {
	        handleScroll('hour')
	      }
	    }
	  }, [_h('ul', {
	    staticClass: "el-time-spinner__list"
	  }, [_l((hoursList), function(disabled, hour) {
	    return _h('li', {
	      staticClass: "el-time-spinner__item",
	      class: {
	        'active': hour === hours, 'disabled': disabled
	      },
	      attrs: {
	        "track-by": "hour"
	      },
	      domProps: {
	        "textContent": _s(hour)
	      },
	      on: {
	        "click": function($event) {
	          handleClick('hours', {
	            value: hour,
	            disabled: disabled
	          }, true)
	        }
	      }
	    })
	  })])]), " ", _h('div', {
	    ref: "minute",
	    staticClass: "el-time-spinner__wrapper",
	    on: {
	      "mouseenter": function($event) {
	        emitSelectRange('minutes')
	      },
	      "mousewheel": function($event) {
	        handleScroll('minute')
	      }
	    }
	  }, [_h('ul', {
	    staticClass: "el-time-spinner__list"
	  }, [_l((60), function(minute, key) {
	    return _h('li', {
	      staticClass: "el-time-spinner__item",
	      class: {
	        'active': key === minutes
	      },
	      domProps: {
	        "textContent": _s(key)
	      },
	      on: {
	        "click": function($event) {
	          handleClick('minutes', key, true)
	        }
	      }
	    })
	  })])]), " ", _h('div', {
	    ref: "second",
	    staticClass: "el-time-spinner__wrapper",
	    on: {
	      "mouseenter": function($event) {
	        emitSelectRange('seconds')
	      },
	      "mousewheel": function($event) {
	        handleScroll('second')
	      }
	    }
	  }, [_h('ul', {
	    staticClass: "el-time-spinner__list"
	  }, [_l((60), function(second, key) {
	    return _h('li', {
	      staticClass: "el-time-spinner__item",
	      class: {
	        'active': key === seconds
	      },
	      domProps: {
	        "textContent": _s(key)
	      },
	      on: {
	        "click": function($event) {
	          handleClick('seconds', key, true)
	        }
	      }
	    })
	  })])])])
	}},staticRenderFns: []}

/***/ },
/* 144 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('transition', {
	    attrs: {
	      "name": "md-fade-bottom"
	    },
	    on: {
	      "after-leave": function($event) {
	        $emit('dodestroy')
	      }
	    }
	  }, [_h('div', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (currentVisible),
	      expression: "currentVisible"
	    }],
	    staticClass: "el-time-panel",
	    style: ({
	      width: width + 'px'
	    })
	  }, [_h('div', {
	    staticClass: "el-time-panel__content"
	  }, [_h('time-spinner', {
	    ref: "spinner",
	    attrs: {
	      "show-seconds": showSeconds,
	      "hours": hours,
	      "minutes": minutes,
	      "seconds": seconds
	    },
	    on: {
	      "change": handleChange,
	      "select-range": setSelectionRange
	    }
	  })]), " ", _h('div', {
	    staticClass: "el-time-panel__footer"
	  }, [_h('button', {
	    staticClass: "el-time-panel__btn cancel",
	    attrs: {
	      "type": "button"
	    },
	    on: {
	      "click": function($event) {
	        handleCancel()
	      }
	    }
	  }, [_s($t('datepicker.cancel'))]), " ", _h('button', {
	    staticClass: "el-time-panel__btn confirm",
	    attrs: {
	      "type": "button"
	    },
	    on: {
	      "click": function($event) {
	        handleConfirm()
	      }
	    }
	  }, [_s($t('datepicker.confirm'))])])])])
	}},staticRenderFns: []}

/***/ },
/* 145 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(146)

	/* template */
	var __vue_template__ = __webpack_require__(147)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 146 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports.default = {
	  props: {
	    year: {
	      type: Number
	    }
	  },

	  computed: {
	    startYear: function startYear() {
	      return Math.floor(this.year / 10) * 10;
	    }
	  },

	  methods: {
	    nextTenYear: function nextTenYear() {
	      this.$emit('pick', this.year + 10, false);
	    },
	    prevTenYear: function prevTenYear() {
	      this.$emit('pick', this.year - 10, false);
	    },
	    handleYearTableClick: function handleYearTableClick(event) {
	      var target = event.target;
	      if (target.tagName === 'A') {
	        var year = parseInt(target.textContent || target.innerText, 10);
	        this.$emit('pick', year);
	      }
	    }
	  }
	};

/***/ },
/* 147 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('table', {
	    staticClass: "el-year-table",
	    on: {
	      "click": handleYearTableClick
	    }
	  }, [_h('tbody', [_h('tr', [_h('td', {
	    staticClass: "available",
	    class: {
	      current: year === startYear
	    }
	  }, [_h('a', {
	    staticClass: "cell"
	  }, [_s(startYear)])]), " ", _h('td', {
	    staticClass: "available",
	    class: {
	      current: year === startYear + 1
	    }
	  }, [_h('a', {
	    staticClass: "cell"
	  }, [_s(startYear + 1)])]), " ", _h('td', {
	    staticClass: "available",
	    class: {
	      current: year === startYear + 2
	    }
	  }, [_h('a', {
	    staticClass: "cell"
	  }, [_s(startYear + 2)])]), " ", _h('td', {
	    staticClass: "available",
	    class: {
	      current: year === startYear + 3
	    }
	  }, [_h('a', {
	    staticClass: "cell"
	  }, [_s(startYear + 3)])])]), " ", _h('tr', [_h('td', {
	    staticClass: "available",
	    class: {
	      current: year === startYear + 4
	    }
	  }, [_h('a', {
	    staticClass: "cell"
	  }, [_s(startYear + 4)])]), " ", _h('td', {
	    staticClass: "available",
	    class: {
	      current: year === startYear + 5
	    }
	  }, [_h('a', {
	    staticClass: "cell"
	  }, [_s(startYear + 5)])]), " ", _h('td', {
	    staticClass: "available",
	    class: {
	      current: year === startYear + 6
	    }
	  }, [_h('a', {
	    staticClass: "cell"
	  }, [_s(startYear + 6)])]), " ", _h('td', {
	    staticClass: "available",
	    class: {
	      current: year === startYear + 7
	    }
	  }, [_h('a', {
	    staticClass: "cell"
	  }, [_s(startYear + 7)])])]), " ", _h('tr', [_h('td', {
	    staticClass: "available",
	    class: {
	      current: year === startYear + 8
	    }
	  }, [_h('a', {
	    staticClass: "cell"
	  }, [_s(startYear + 8)])]), " ", _h('td', {
	    staticClass: "available",
	    class: {
	      current: year === startYear + 9
	    }
	  }, [_h('a', {
	    staticClass: "cell"
	  }, [_s(startYear + 9)])]), " ", _m(0), " ", _m(1)])])])
	}},staticRenderFns: [function (){with(this) {
	  return _h('td')
	}},function (){with(this) {
	  return _h('td')
	}}]}

/***/ },
/* 148 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(149)

	/* template */
	var __vue_template__ = __webpack_require__(150)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 149 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _util = __webpack_require__(133);

	exports.default = {
	  props: {
	    month: {
	      type: Number
	    }
	  },

	  methods: {
	    $t: function $t() {
	      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }

	      return _util.$t.apply(this, args);
	    },
	    handleMonthTableClick: function handleMonthTableClick(event) {
	      var target = event.target;
	      if (target.tagName !== 'A') return;
	      var column = target.parentNode.cellIndex;
	      var row = target.parentNode.parentNode.rowIndex;
	      var month = row * 4 + column;

	      this.$emit('pick', month);
	    }
	  }
	};

/***/ },
/* 150 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('table', {
	    staticClass: "el-month-table",
	    on: {
	      "click": handleMonthTableClick
	    }
	  }, [_h('tbody', [_h('tr', [_h('td', {
	    class: {
	      current: month === 0
	    }
	  }, [_h('a', {
	    staticClass: "cell"
	  }, [_s($t('datepicker.months.jan'))])]), " ", _h('td', {
	    class: {
	      current: month === 1
	    }
	  }, [_h('a', {
	    staticClass: "cell"
	  }, [_s($t('datepicker.months.feb'))])]), " ", _h('td', {
	    class: {
	      current: month === 2
	    }
	  }, [_h('a', {
	    staticClass: "cell"
	  }, [_s($t('datepicker.months.mar'))])]), " ", _h('td', {
	    class: {
	      current: month === 3
	    }
	  }, [_h('a', {
	    staticClass: "cell"
	  }, [_s($t('datepicker.months.apr'))])])]), " ", _h('tr', [_h('td', {
	    class: {
	      current: month === 4
	    }
	  }, [_h('a', {
	    staticClass: "cell"
	  }, [_s($t('datepicker.months.may'))])]), " ", _h('td', {
	    class: {
	      current: month === 5
	    }
	  }, [_h('a', {
	    staticClass: "cell"
	  }, [_s($t('datepicker.months.jun'))])]), " ", _h('td', {
	    class: {
	      current: month === 6
	    }
	  }, [_h('a', {
	    staticClass: "cell"
	  }, [_s($t('datepicker.months.jul'))])]), " ", _h('td', {
	    class: {
	      current: month === 7
	    }
	  }, [_h('a', {
	    staticClass: "cell"
	  }, [_s($t('datepicker.months.aug'))])])]), " ", _h('tr', [_h('td', {
	    class: {
	      current: month === 8
	    }
	  }, [_h('a', {
	    staticClass: "cell"
	  }, [_s($t('datepicker.months.sep'))])]), " ", _h('td', {
	    class: {
	      current: month === 9
	    }
	  }, [_h('a', {
	    staticClass: "cell"
	  }, [_s($t('datepicker.months.oct'))])]), " ", _h('td', {
	    class: {
	      current: month === 10
	    }
	  }, [_h('a', {
	    staticClass: "cell"
	  }, [_s($t('datepicker.months.nov'))])]), " ", _h('td', {
	    class: {
	      current: month === 11
	    }
	  }, [_h('a', {
	    staticClass: "cell"
	  }, [_s($t('datepicker.months.dec'))])])])])])
	}},staticRenderFns: []}

/***/ },
/* 151 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(152)

	/* template */
	var __vue_template__ = __webpack_require__(154)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 152 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _util = __webpack_require__(133);

	var _class = __webpack_require__(153);

	var _vue = __webpack_require__(8);

	var _vue2 = _interopRequireDefault(_vue);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var clearHours = function clearHours(time) {
	  var cloneDate = new Date(time);
	  cloneDate.setHours(0, 0, 0, 0);
	  return cloneDate.getTime();
	};

	exports.default = {
	  props: {
	    date: {},

	    year: {},

	    month: {},

	    week: {},

	    selectionMode: {
	      default: 'day'
	    },

	    showWeekNumber: {
	      type: Boolean,
	      default: false
	    },

	    disabledDate: {},

	    minDate: {},

	    maxDate: {},

	    rangeState: {
	      default: function _default() {
	        return {
	          endDate: null,
	          selecting: false,
	          row: null,
	          column: null
	        };
	      }
	    },

	    value: {}
	  },

	  computed: {
	    monthDate: function monthDate() {
	      return this.date.getDate();
	    },
	    startDate: function startDate() {
	      return (0, _util.getStartDateOfMonth)(this.year, this.month);
	    },
	    rows: function rows() {
	      var date = new Date(this.year, this.month, 1);
	      var day = (0, _util.getFirstDayOfMonth)(date);
	      var dateCountOfMonth = (0, _util.getDayCountOfMonth)(date.getFullYear(), date.getMonth());
	      var dateCountOfLastMonth = (0, _util.getDayCountOfMonth)(date.getFullYear(), date.getMonth() === 0 ? 11 : date.getMonth() - 1);

	      day = day === 0 ? 7 : day;

	      var rows = this.tableRows;
	      var count = 1;
	      var firstDayPosition = void 0;

	      var startDate = this.startDate;
	      var disabledDate = this.disabledDate;
	      var now = clearHours(new Date());

	      for (var i = 0; i < 6; i++) {
	        var row = rows[i];

	        if (this.showWeekNumber) {
	          if (!row[0]) {
	            row[0] = { type: 'week', text: (0, _util.getWeekNumber)(new Date(startDate.getTime() + _util.DAY_DURATION * (i * 7 + 1))) };
	          }
	        }

	        for (var j = 0; j < 7; j++) {
	          var cell = row[this.showWeekNumber ? j + 1 : j];
	          if (!cell) {
	            cell = { row: i, column: j, type: 'normal', inRange: false, start: false, end: false };
	          }

	          cell.type = 'normal';

	          var index = i * 7 + j;
	          var time = startDate.getTime() + _util.DAY_DURATION * index;
	          cell.inRange = time >= clearHours(this.minDate) && time <= clearHours(this.maxDate);
	          cell.start = this.minDate && time === clearHours(this.minDate);
	          cell.end = this.maxDate && time === clearHours(this.maxDate);
	          var isToday = time === now;

	          if (isToday) {
	            cell.type = 'today';
	          }

	          if (i === 0) {
	            if (j >= day) {
	              cell.text = count++;
	              if (count === 2) {
	                firstDayPosition = i * 7 + j;
	              }
	            } else {
	              cell.text = dateCountOfLastMonth - (day - j % 7) + 1;
	              cell.type = 'prev-month';
	            }
	          } else {
	            if (count <= dateCountOfMonth) {
	              cell.text = count++;
	              if (count === 2) {
	                firstDayPosition = i * 7 + j;
	              }
	            } else {
	              cell.text = count++ - dateCountOfMonth;
	              cell.type = 'next-month';
	            }
	          }

	          cell.disabled = typeof disabledDate === 'function' && disabledDate(new Date(time));

	          _vue2.default.set(row, this.showWeekNumber ? j + 1 : j, cell);
	        }

	        if (this.selectionMode === 'week') {
	          var start = this.showWeekNumber ? 1 : 0;
	          var end = this.showWeekNumber ? 7 : 6;
	          var isWeekActive = this.isWeekActive(row[start + 1]);

	          row[start].inRange = isWeekActive;
	          row[start].start = isWeekActive;
	          row[end].inRange = isWeekActive;
	          row[end].end = isWeekActive;
	        }
	      }

	      rows.firstDayPosition = firstDayPosition;

	      return rows;
	    }
	  },

	  watch: {
	    'rangeState.endDate': function rangeStateEndDate(newVal) {
	      this.markRange(newVal);
	    },
	    minDate: function minDate(newVal, oldVal) {
	      if (newVal && !oldVal) {
	        this.rangeState.selecting = true;
	        this.markRange(newVal);
	      } else if (!newVal) {
	        this.rangeState.selecting = false;
	        this.markRange(newVal);
	      } else {
	        this.markRange();
	      }
	    },
	    maxDate: function maxDate(newVal, oldVal) {
	      if (newVal && !oldVal) {
	        this.rangeState.selecting = false;
	        this.markRange(newVal);
	        this.$emit('pick', {
	          minDate: this.minDate,
	          maxDate: this.maxDate
	        });
	      }
	    }
	  },

	  data: function data() {
	    return {
	      tableRows: [[], [], [], [], [], []]
	    };
	  },


	  methods: {
	    $t: function $t() {
	      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }

	      return _util.$t.apply(this, args);
	    },
	    getCellClasses: function getCellClasses(cell) {
	      var selectionMode = this.selectionMode;
	      var monthDate = this.monthDate;

	      var classes = [];
	      if ((cell.type === 'normal' || cell.type === 'today') && !cell.disabled) {
	        classes.push('available');
	        if (cell.type === 'today') {
	          classes.push('today');
	        }
	      } else {
	        classes.push(cell.type);
	      }

	      if (selectionMode === 'day' && (cell.type === 'normal' || cell.type === 'today') && this.year === this.date.getFullYear() && this.month === this.date.getMonth() && monthDate === Number(cell.text)) {
	        classes.push('current');
	      }

	      if (cell.inRange && (cell.type === 'normal' || cell.type === 'today' || this.selectionMode === 'week')) {
	        classes.push('in-range');

	        if (cell.start) {
	          classes.push('start-date');
	        }

	        if (cell.end) {
	          classes.push('end-date');
	        }
	      }

	      if (cell.disabled) {
	        classes.push('disabled');
	      }

	      return classes.join(' ');
	    },
	    getDateOfCell: function getDateOfCell(row, column) {
	      var startDate = this.startDate;

	      return new Date(startDate.getTime() + (row * 7 + (column - (this.showWeekNumber ? 1 : 0))) * _util.DAY_DURATION);
	    },
	    getCellByDate: function getCellByDate(date) {
	      var startDate = this.startDate;
	      var rows = this.rows;
	      var index = (date - startDate) / _util.DAY_DURATION;
	      var row = rows[Math.floor(index / 7)];

	      if (this.showWeekNumber) {
	        return row[index % 7 + 1];
	      } else {
	        return row[index % 7];
	      }
	    },
	    isWeekActive: function isWeekActive(cell) {
	      if (this.selectionMode !== 'week') return false;
	      var newDate = new Date(this.year, this.month, 1);
	      var year = newDate.getFullYear();
	      var month = newDate.getMonth();

	      if (cell.type === 'prev-month') {
	        newDate.setMonth(month === 0 ? 11 : month - 1);
	        newDate.setFullYear(month === 0 ? year - 1 : year);
	      }

	      if (cell.type === 'next-month') {
	        newDate.setMonth(month === 11 ? 0 : month + 1);
	        newDate.setFullYear(month === 11 ? year + 1 : year);
	      }

	      newDate.setDate(parseInt(cell.text, 10));

	      return (0, _util.getWeekNumber)(newDate) === this.week;
	    },
	    markRange: function markRange(maxDate) {
	      var startDate = this.startDate;
	      if (!maxDate) {
	        maxDate = this.maxDate;
	      }

	      var rows = this.rows;
	      var minDate = this.minDate;
	      for (var i = 0, k = rows.length; i < k; i++) {
	        var row = rows[i];
	        for (var j = 0, l = row.length; j < l; j++) {
	          if (this.showWeekNumber && j === 0) continue;

	          var cell = row[j];
	          var index = i * 7 + j + (this.showWeekNumber ? -1 : 0);
	          var time = startDate.getTime() + _util.DAY_DURATION * index;

	          cell.inRange = minDate && time >= clearHours(minDate) && time <= clearHours(maxDate);
	          cell.start = minDate && time === clearHours(minDate.getTime());
	          cell.end = maxDate && time === clearHours(maxDate.getTime());
	        }
	      }
	    },
	    handleMouseMove: function handleMouseMove(event) {
	      if (!this.rangeState.selecting) return;

	      this.$emit('changerange', {
	        minDate: this.minDate,
	        maxDate: this.maxDate,
	        rangeState: this.rangeState
	      });

	      var target = event.target;
	      if (target.tagName !== 'TD') return;

	      var column = target.cellIndex;
	      var row = target.parentNode.rowIndex - 1;
	      var _rangeState = this.rangeState;
	      var oldRow = _rangeState.row;
	      var oldColumn = _rangeState.column;


	      if (oldRow !== row || oldColumn !== column) {
	        this.rangeState.row = row;
	        this.rangeState.column = column;

	        this.rangeState.endDate = this.getDateOfCell(row, column);
	      }
	    },
	    handleClick: function handleClick(event) {
	      var target = event.target;

	      if (target.tagName !== 'TD') return;
	      if ((0, _class.hasClass)(target, 'disabled') || (0, _class.hasClass)(target, 'week')) return;

	      var selectionMode = this.selectionMode;

	      if (selectionMode === 'week') {
	        target = target.parentNode.cells[1];
	      }

	      var year = this.year;
	      var month = this.month;

	      var cellIndex = target.cellIndex;
	      var rowIndex = target.parentNode.rowIndex;

	      var cell = this.rows[rowIndex - 1][cellIndex];
	      var text = cell.text;
	      var className = target.className;

	      var newDate = new Date(this.year, this.month, 1);

	      var clickNormalCell = className.indexOf('prev') === -1 && className.indexOf('next') === -1;

	      if (className.indexOf('prev') !== -1) {
	        if (month === 0) {
	          year = year - 1;
	          month = 11;
	        } else {
	          month = month - 1;
	        }
	        newDate.setFullYear(year);
	        newDate.setMonth(month);
	      } else if (className.indexOf('next') !== -1) {
	        if (month === 11) {
	          year = year + 1;
	          month = 0;
	        } else {
	          month = month + 1;
	        }
	        newDate.setFullYear(year);
	        newDate.setMonth(month);
	      }

	      newDate.setDate(parseInt(text, 10));

	      if (clickNormalCell && this.selectionMode === 'range') {
	        if (this.minDate && this.maxDate) {
	          var minDate = new Date(newDate.getTime());
	          var maxDate = null;

	          this.$emit('pick', { minDate: minDate, maxDate: maxDate }, false);
	          this.rangeState.selecting = true;
	          this.markRange(this.minDate);
	        } else if (this.minDate && !this.maxDate) {
	          if (newDate >= this.minDate) {
	            var _maxDate = new Date(newDate.getTime());
	            this.rangeState.selecting = false;

	            this.$emit('pick', {
	              minDate: this.minDate,
	              maxDate: _maxDate
	            });
	          } else {
	            var _minDate = new Date(newDate.getTime());

	            this.$emit('pick', { minDate: _minDate, maxDate: this.maxDate }, false);
	          }
	        } else if (!this.minDate) {
	          var _minDate2 = new Date(newDate.getTime());

	          this.$emit('pick', { minDate: _minDate2, maxDate: this.maxDate }, false);
	          this.rangeState.selecting = true;
	          this.markRange(this.minDate);
	        }
	      }

	      if (selectionMode === 'day') {
	        this.$emit('pick', newDate);
	      } else if (selectionMode === 'week') {
	        var weekNumber = (0, _util.getWeekNumber)(newDate);

	        var value = newDate.getFullYear() + 'w' + weekNumber;
	        this.$emit('pick', {
	          year: newDate.getFullYear(),
	          week: weekNumber,
	          value: value,
	          date: newDate
	        });
	      }
	    }
	  }
	};

/***/ },
/* 153 */
/***/ function(module, exports) {

	var trim = function (string) {
	  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
	};

	var hasClass = function (el, cls) {
	  if (!el || !cls) return false;
	  if (cls.indexOf(' ') != -1) throw new Error('className should not contain space.');
	  if (el.classList) {
	    return el.classList.contains(cls);
	  } else {
	    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
	  }
	};

	var addClass = function (el, cls) {
	  if (!el) return;
	  var curClass = el.className;
	  var classes = (cls || '').split(' ');

	  for (var i = 0, j = classes.length; i < j; i++) {
	    var clsName = classes[i];
	    if (!clsName) continue;

	    if (el.classList) {
	      el.classList.add(clsName);
	    } else {
	      if (!hasClass(el, clsName)) {
	        curClass += ' ' + clsName;
	      }
	    }
	  }
	  if (!el.classList) {
	    el.className = curClass;
	  }
	};

	var removeClass = function (el, cls) {
	  if (!el || !cls) return;
	  var classes = cls.split(' ');
	  var curClass = ' ' + el.className + ' ';

	  for (var i = 0, j = classes.length; i < j; i++) {
	    var clsName = classes[i];
	    if (!clsName) continue;

	    if (el.classList) {
	      el.classList.remove(clsName);
	    } else {
	      if (hasClass(el, clsName)) {
	        curClass = curClass.replace(' ' + clsName + ' ', ' ');
	      }
	    }
	  }
	  if (!el.classList) {
	    el.className = trim(curClass);
	  }
	};

	module.exports = {
	  hasClass: hasClass,
	  addClass: addClass,
	  removeClass: removeClass
	};

/***/ },
/* 154 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('table', {
	    staticClass: "el-date-table",
	    class: {
	      'is-week-mode': selectionMode === 'week'
	    },
	    attrs: {
	      "cellspacing": "0",
	      "cellpadding": "0"
	    },
	    on: {
	      "click": handleClick,
	      "mousemove": handleMouseMove
	    }
	  }, [_h('tbody', [_h('tr', [(showWeekNumber) ? _h('th', [_s($t('datepicker.week'))]) : _e(), " ", _h('th', [_s($t('datepicker.weeks.sun'))]), " ", _h('th', [_s($t('datepicker.weeks.mon'))]), " ", _h('th', [_s($t('datepicker.weeks.tue'))]), " ", _h('th', [_s($t('datepicker.weeks.wed'))]), " ", _h('th', [_s($t('datepicker.weeks.thu'))]), " ", _h('th', [_s($t('datepicker.weeks.fri'))]), " ", _h('th', [_s($t('datepicker.weeks.sat'))])]), " ", _l((rows), function(row) {
	    return _h('tr', {
	      staticClass: "el-date-table__row",
	      class: {
	        current: value && isWeekActive(row[1])
	      }
	    }, [_l((row), function(cell) {
	      return _h('td', {
	        class: getCellClasses(cell),
	        domProps: {
	          "textContent": _s(cell.type === 'today' ? $t('datepicker.today') : cell.text)
	        }
	      })
	    })])
	  })])])
	}},staticRenderFns: []}

/***/ },
/* 155 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('transition', {
	    attrs: {
	      "name": "md-fade-bottom"
	    },
	    on: {
	      "after-leave": function($event) {
	        $emit('dodestroy')
	      }
	    }
	  }, [_h('div', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (visible),
	      expression: "visible"
	    }],
	    staticClass: "el-picker-panel el-date-picker",
	    class: {
	      'has-sidebar': $slots.sidebar || shortcuts,
	        'has-time': showTime
	    },
	    style: ({
	      width: width + 'px'
	    })
	  }, [_h('div', {
	    staticClass: "el-picker-panel__body-wrapper"
	  }, [_t("sidebar"), " ", (shortcuts) ? _h('div', {
	    staticClass: "el-picker-panel__sidebar"
	  }, [_l((shortcuts), function(shortcut) {
	    return _h('button', {
	      staticClass: "el-picker-panel__shortcut",
	      attrs: {
	        "type": "button"
	      },
	      on: {
	        "click": function($event) {
	          handleShortcutClick(shortcut)
	        }
	      }
	    }, [_s(shortcut.text)])
	  })]) : _e(), " ", _h('div', {
	    staticClass: "el-picker-panel__body"
	  }, [(showTime) ? _h('div', {
	    staticClass: "el-date-picker__time-header"
	  }, [_h('input', {
	    directives: [{
	      name: "model",
	      rawName: "v-model",
	      value: (visibleDate),
	      expression: "visibleDate"
	    }],
	    staticClass: "el-date-picker__editor",
	    attrs: {
	      "placehoder": $t('datepicker.selectDate'),
	      "type": "text"
	    },
	    domProps: {
	      "value": _s(visibleDate)
	    },
	    on: {
	      "input": function($event) {
	        if ($event.target.composing) return;
	        visibleDate = $event.target.value
	      }
	    }
	  }), " ", _h('span', {
	    directives: [{
	      name: "clickoutside",
	      rawName: "v-clickoutside",
	      value: (closeTimePicker),
	      expression: "closeTimePicker"
	    }],
	    attrs: {
	      "style": "position: relative"
	    }
	  }, [_h('input', {
	    directives: [{
	      name: "model",
	      rawName: "v-model",
	      value: (visibleTime),
	      expression: "visibleTime"
	    }],
	    ref: "input",
	    staticClass: "el-date-picker__editor",
	    attrs: {
	      "placehoder": $t('datepicker.selectTime'),
	      "type": "text"
	    },
	    domProps: {
	      "value": _s(visibleTime)
	    },
	    on: {
	      "focus": function($event) {
	        timePickerVisible = true
	      },
	      "input": function($event) {
	        if ($event.target.composing) return;
	        visibleTime = $event.target.value
	      }
	    }
	  }), " ", _h('time-picker', {
	    ref: "timepicker",
	    attrs: {
	      "date": date,
	      "picker-width": pickerWidth,
	      "visible": timePickerVisible
	    },
	    on: {
	      "pick": handleTimePick
	    }
	  })])]) : _e(), " ", _h('div', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (currentView !== 'time'),
	      expression: "currentView !== 'time'"
	    }],
	    staticClass: "el-date-picker__header"
	  }, [_h('button', {
	    staticClass: "el-picker-panel__icon-btn el-date-picker__prev-btn el-icon-d-arrow-left",
	    attrs: {
	      "type": "button"
	    },
	    on: {
	      "click": prevYear
	    }
	  }), " ", _h('button', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (currentView === 'date'),
	      expression: "currentView === 'date'"
	    }],
	    staticClass: "el-picker-panel__icon-btn el-date-picker__prev-btn el-icon-arrow-left",
	    attrs: {
	      "type": "button"
	    },
	    on: {
	      "click": prevMonth
	    }
	  }), " ", _h('span', {
	    staticClass: "el-date-picker__header-label",
	    on: {
	      "click": showYearPicker
	    }
	  }, [_s(yearLabel)]), " ", _h('span', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (currentView === 'date'),
	      expression: "currentView === 'date'"
	    }],
	    staticClass: "el-date-picker__header-label",
	    class: {
	      active: currentView === 'month'
	    },
	    on: {
	      "click": showMonthPicker
	    }
	  }, [_s(month + 1) + " " + _s($t('datepicker.month'))]), " ", _h('button', {
	    staticClass: "el-picker-panel__icon-btn el-date-picker__next-btn el-icon-d-arrow-right",
	    attrs: {
	      "type": "button"
	    },
	    on: {
	      "click": nextYear
	    }
	  }), " ", _h('button', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (currentView === 'date'),
	      expression: "currentView === 'date'"
	    }],
	    staticClass: "el-picker-panel__icon-btn el-date-picker__next-btn el-icon-arrow-right",
	    attrs: {
	      "type": "button"
	    },
	    on: {
	      "click": nextMonth
	    }
	  })]), " ", _h('div', {
	    staticClass: "el-picker-panel__content"
	  }, [_h('date-table', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (currentView === 'date'),
	      expression: "currentView === 'date'"
	    }],
	    attrs: {
	      "year": year,
	      "month": month,
	      "date": date,
	      "week": week,
	      "selection-mode": selectionMode,
	      "disabled-date": disabledDate
	    },
	    domProps: {
	      "value": value
	    },
	    on: {
	      "pick": handleDatePick
	    }
	  }), " ", _h('year-table', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (currentView === 'year'),
	      expression: "currentView === 'year'"
	    }],
	    ref: "yearTable",
	    attrs: {
	      "year": year
	    },
	    on: {
	      "pick": handleYearPick
	    }
	  }), " ", _h('month-table', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (currentView === 'month'),
	      expression: "currentView === 'month'"
	    }],
	    attrs: {
	      "month": month
	    },
	    on: {
	      "pick": handleMonthPick
	    }
	  })])])]), " ", _h('div', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (footerVisible && currentView === 'date'),
	      expression: "footerVisible && currentView === 'date'"
	    }],
	    staticClass: "el-picker-panel__footer"
	  }, [_h('a', {
	    staticClass: "el-picker-panel__link-btn",
	    attrs: {
	      "href": "JavaScript:"
	    },
	    on: {
	      "click": changeToToday
	    }
	  }, [_s($t('datepicker.now'))]), " ", _h('button', {
	    staticClass: "el-picker-panel__btn",
	    attrs: {
	      "type": "button"
	    },
	    on: {
	      "click": confirm
	    }
	  }, [_s($t('datepicker.confirm'))])])])])
	}},staticRenderFns: []}

/***/ },
/* 156 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(157)

	/* template */
	var __vue_template__ = __webpack_require__(158)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 157 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _util = __webpack_require__(133);

	exports.default = {
	  computed: {
	    btnDisabled: function btnDisabled() {
	      return !(this.minDate && this.maxDate && !this.selecting);
	    },
	    leftLabel: function leftLabel() {
	      return this.date.getFullYear() + ' ' + this.$t('datepicker.year') + ' ' + (this.date.getMonth() + 1) + ' ' + this.$t('datepicker.month');
	    },
	    rightLabel: function rightLabel() {
	      return this.rightDate.getFullYear() + ' ' + this.$t('datepicker.year') + ' ' + (this.rightDate.getMonth() + 1) + ' ' + this.$t('datepicker.month');
	    },
	    leftYear: function leftYear() {
	      return this.date.getFullYear();
	    },
	    leftMonth: function leftMonth() {
	      return this.date.getMonth();
	    },
	    rightYear: function rightYear() {
	      return this.rightDate.getFullYear();
	    },
	    rightMonth: function rightMonth() {
	      return this.rightDate.getMonth();
	    },
	    leftVisibleDate: function leftVisibleDate() {
	      return (0, _util.formatDate)(this.minDate);
	    },
	    rightVisibleDate: function rightVisibleDate() {
	      return (0, _util.formatDate)(this.maxDate);
	    },
	    leftVisibleTime: function leftVisibleTime() {
	      return (0, _util.formatDate)(this.minDate, 'HH:mm:ss');
	    },
	    rightVisibleTime: function rightVisibleTime() {
	      return (0, _util.formatDate)(this.maxDate, 'HH:mm:ss');
	    },


	    leftHours: {
	      get: function get() {
	        return this.date.getHours();
	      },
	      set: function set(hours) {
	        this.date.setHours(hours);
	      }
	    },

	    leftMinutes: {
	      get: function get() {
	        return this.date.getMinutes();
	      },
	      set: function set(minutes) {
	        this.date.setMinutes(minutes);
	      }
	    },

	    leftSeconds: {
	      get: function get() {
	        return this.date.getSeconds();
	      },
	      set: function set(seconds) {
	        this.date.setSeconds(seconds);
	      }
	    },

	    rightHours: {
	      get: function get() {
	        return this.rightDate.getHours();
	      },
	      set: function set(hours) {
	        this.rightDate.setHours(hours);
	      }
	    },

	    rightMinutes: {
	      get: function get() {
	        return this.rightDate.getMinutes();
	      },
	      set: function set(minutes) {
	        this.rightDate.setMinutes(minutes);
	      }
	    },

	    rightSeconds: {
	      get: function get() {
	        return this.rightDate.getSeconds();
	      },
	      set: function set(seconds) {
	        this.rightDate.setSeconds(seconds);
	      }
	    },

	    rightDate: function rightDate() {
	      var newDate = new Date(this.date);
	      var month = newDate.getMonth();
	      newDate.setDate(1);

	      if (month === 11) {
	        newDate.setFullYear(newDate.getFullYear() + 1);
	        newDate.setMonth(0);
	      } else {
	        newDate.setMonth(month + 1);
	      }
	      return newDate;
	    }
	  },

	  directives: {
	    Clickoutside: __webpack_require__(30).default
	  },

	  data: function data() {
	    return {
	      leftPickerWidth: 0,
	      rightPickerWidth: 0,
	      date: new Date(),
	      minDate: '',
	      maxDate: '',
	      rangeState: {
	        endDate: null,
	        selecting: false,
	        row: null,
	        column: null
	      },
	      showTime: false,
	      shortcuts: '',
	      value: '',
	      visible: '',
	      disabledDate: '',
	      leftTimePickerVisible: false,
	      rightTimePickerVisible: false,
	      width: 0
	    };
	  },


	  watch: {
	    showTime: function showTime(val) {
	      var _this = this;

	      if (!val) return;
	      this.$nextTick(function (_) {
	        var leftInputElm = _this.$refs.leftInput;
	        var rightInputElm = _this.$refs.rightInput;
	        if (leftInputElm) {
	          _this.leftPickerWidth = leftInputElm.getBoundingClientRect().width + 10;
	        }
	        if (rightInputElm) {
	          _this.rightPickerWidth = rightInputElm.getBoundingClientRect().width + 10;
	        }
	      });
	    },
	    minDate: function minDate() {
	      var _this2 = this;

	      this.$nextTick(function () {
	        if (_this2.maxDate && _this2.maxDate < _this2.minDate) {
	          _this2.maxDate = null;
	        }
	      });
	    },
	    leftTimePickerVisible: function leftTimePickerVisible(val) {
	      var _this3 = this;

	      if (val) this.$nextTick(function () {
	        return _this3.$refs.lefttimepicker.ajustScrollTop();
	      });
	    },
	    rightTimePickerVisible: function rightTimePickerVisible(val) {
	      var _this4 = this;

	      if (val) this.$nextTick(function () {
	        return _this4.$refs.righttimepicker.ajustScrollTop();
	      });
	    },
	    value: function value(newVal) {
	      if (!newVal) {
	        this.minDate = null;
	        this.maxDate = null;
	      } else if (Array.isArray(newVal)) {
	        this.minDate = (0, _util.toDate)(newVal[0]);
	        this.maxDate = (0, _util.toDate)(newVal[1]);
	      }
	    }
	  },

	  methods: {
	    $t: function $t() {
	      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }

	      return _util.$t.apply(this, args);
	    },
	    closeLeftTimePicker: function closeLeftTimePicker() {
	      this.leftTimePickerVisible = false;
	    },
	    closeRightTimePicker: function closeRightTimePicker() {
	      this.rightTimePickerVisible = false;
	    },
	    handleDateInput: function handleDateInput(event, type) {
	      var value = event.target.value;
	      var parsedValue = (0, _util.parseDate)(value, 'yyyy-MM-dd');
	      if (parsedValue) {
	        var target = new Date(type === 'min' ? this.minDate : this.maxDate);
	        if (target) {
	          target.setFullYear(parsedValue.getFullYear());
	          target.setMonth(parsedValue.getMonth());
	          target.setDate(parsedValue.getDate());
	        }
	      }
	    },
	    handleChangeRange: function handleChangeRange(val) {
	      this.minDate = val.minDate;
	      this.maxDate = val.maxDate;
	      this.rangeState = val.rangeState;
	    },
	    handleDateChange: function handleDateChange(event, type) {
	      var value = event.target.value;
	      var parsedValue = (0, _util.parseDate)(value, 'yyyy-MM-dd');
	      if (parsedValue) {
	        var target = new Date(type === 'min' ? this.minDate : this.maxDate);
	        if (target) {
	          target.setFullYear(parsedValue.getFullYear());
	          target.setMonth(parsedValue.getMonth());
	          target.setDate(parsedValue.getDate());
	        }
	        if (type === 'min') {
	          if (target < this.maxDate) {
	            this.minDate = new Date(target.getTime());
	          }
	        } else {
	          if (target > this.minDate) {
	            this.maxDate = new Date(target.getTime());
	            if (this.minDate && this.minDate > this.maxDate) {
	              this.minDate = null;
	            }
	          }
	        }
	      }
	    },
	    handleTimeChange: function handleTimeChange(event, type) {
	      var value = event.target.value;
	      var parsedValue = (0, _util.parseDate)(value, 'HH:mm:ss');
	      if (parsedValue) {
	        var target = new Date(type === 'min' ? this.minDate : this.maxDate);
	        if (target) {
	          target.setHours(parsedValue.getHours());
	          target.setMinutes(parsedValue.getMinutes());
	          target.setSeconds(parsedValue.getSeconds());
	        }
	        if (type === 'min') {
	          if (target < this.maxDate) {
	            this.minDate = new Date(target.getTime());
	          }
	        } else {
	          if (target > this.minDate) {
	            this.maxDate = new Date(target.getTime());
	          }
	        }
	      }
	    },
	    handleRangePick: function handleRangePick(val) {
	      var close = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

	      this.maxDate = val.maxDate;
	      this.minDate = val.minDate;

	      if (!close) return;
	      if (!this.showTime) {
	        this.$emit('pick', [this.minDate, this.maxDate]);
	      }
	    },
	    changeToToday: function changeToToday() {
	      this.date = new Date();
	    },
	    handleShortcutClick: function handleShortcutClick(shortcut) {
	      if (shortcut.onClick) {
	        shortcut.onClick(this);
	      }
	    },
	    resetView: function resetView() {
	      this.leftTimePickerVisible = false;
	      this.rightTimePickerVisible = false;
	    },
	    setTime: function setTime(date, value) {
	      var oldDate = new Date(date.getTime());
	      var hour = value.getHours();
	      var minute = value.getMinutes();
	      var second = value.getSeconds();
	      oldDate.setHours(hour);
	      oldDate.setMinutes(minute);
	      oldDate.setSeconds(second);
	      return new Date(oldDate.getTime());
	    },
	    handleLeftTimePick: function handleLeftTimePick(value, visible, first) {
	      this.minDate = this.minDate || new Date();
	      if (value) {
	        this.minDate = this.setTime(this.minDate, value);
	      }

	      if (!first) {
	        this.leftTimePickerVisible = visible;
	      }
	    },
	    handleRightTimePick: function handleRightTimePick(value, visible, first) {
	      if (!this.maxDate) {
	        var now = new Date();
	        if (now >= this.minDate) {
	          this.maxDate = new Date();
	        }
	      }

	      if (this.maxDate && value) {
	        this.maxDate = this.setTime(this.maxDate, value);
	      }

	      if (!first) {
	        this.rightTimePickerVisible = visible;
	      }
	    },
	    prevMonth: function prevMonth() {
	      this.date = (0, _util.prevMonth)(this.date);
	    },
	    nextMonth: function nextMonth() {
	      this.date = (0, _util.nextMonth)(this.date);
	    },
	    nextYear: function nextYear() {
	      var date = this.date;
	      date.setFullYear(date.getFullYear() + 1);
	      this.resetDate();
	    },
	    prevYear: function prevYear() {
	      var date = this.date;
	      date.setFullYear(date.getFullYear() - 1);
	      this.resetDate();
	    },
	    handleConfirm: function handleConfirm() {
	      this.$emit('pick', [this.minDate, this.maxDate]);
	    },
	    resetDate: function resetDate() {
	      this.date = new Date(this.date);
	    }
	  },

	  components: {
	    TimePicker: __webpack_require__(139),
	    DateTable: __webpack_require__(151)
	  }
	};

/***/ },
/* 158 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('transition', {
	    attrs: {
	      "name": "md-fade-bottom"
	    },
	    on: {
	      "after-leave": function($event) {
	        $emit('dodestroy')
	      }
	    }
	  }, [_h('div', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (visible),
	      expression: "visible"
	    }],
	    staticClass: "el-picker-panel el-date-range-picker",
	    class: {
	      'has-sidebar': $slots.sidebar || shortcuts,
	        'has-time': showTime
	    },
	    style: ({
	      width: width + 'px'
	    })
	  }, [_h('div', {
	    staticClass: "el-picker-panel__body-wrapper"
	  }, [_t("sidebar"), " ", (shortcuts) ? _h('div', {
	    staticClass: "el-picker-panel__sidebar"
	  }, [_l((shortcuts), function(shortcut) {
	    return _h('button', {
	      staticClass: "el-picker-panel__shortcut",
	      attrs: {
	        "type": "button"
	      },
	      on: {
	        "click": function($event) {
	          handleShortcutClick(shortcut)
	        }
	      }
	    }, [_s(shortcut.text)])
	  })]) : _e(), " ", _h('div', {
	    staticClass: "el-picker-panel__body"
	  }, [(showTime) ? _h('div', {
	    staticClass: "el-date-range-picker__time-header"
	  }, [_h('span', {
	    staticClass: "el-date-range-picker__editors-wrap"
	  }, [_h('input', {
	    directives: [{
	      name: "model",
	      rawName: "v-model",
	      value: (leftVisibleDate),
	      expression: "leftVisibleDate"
	    }],
	    staticClass: "el-date-range-picker__editor",
	    attrs: {
	      "placeholder": "开始日期"
	    },
	    domProps: {
	      "value": _s(leftVisibleDate)
	    },
	    on: {
	      "input": [function($event) {
	        if ($event.target.composing) return;
	        leftVisibleDate = $event.target.value
	      }, function($event) {
	        handleDateInput($event, 'min')
	      }],
	      "change": function($event) {
	        handleDateChange($event, 'min')
	      }
	    }
	  }), " ", _h('span', {
	    directives: [{
	      name: "clickoutside",
	      rawName: "v-clickoutside",
	      value: (closeLeftTimePicker),
	      expression: "closeLeftTimePicker"
	    }],
	    staticClass: "el-date-range-picker__time-picker-wrap"
	  }, [_h('input', {
	    directives: [{
	      name: "model",
	      rawName: "v-model",
	      value: (leftVisibleTime),
	      expression: "leftVisibleTime"
	    }],
	    staticClass: "el-date-range-picker__editor",
	    attrs: {
	      "placeholder": "开始时间"
	    },
	    domProps: {
	      "value": _s(leftVisibleTime)
	    },
	    on: {
	      "focus": function($event) {
	        leftTimePickerVisible = true
	      },
	      "change": function($event) {
	        handleTimeChange($event, 'min')
	      },
	      "input": function($event) {
	        if ($event.target.composing) return;
	        leftVisibleTime = $event.target.value
	      }
	    }
	  }), " ", _h('time-picker', {
	    ref: "lefttimepicker",
	    attrs: {
	      "picker-width": leftPickerWidth,
	      "date": minDate,
	      "visible": leftTimePickerVisible
	    },
	    on: {
	      "pick": handleLeftTimePick
	    }
	  })])]), " ", _m(0), " ", _h('span', {
	    staticClass: "el-date-range-picker__editors-wrap is-right"
	  }, [_h('input', {
	    directives: [{
	      name: "model",
	      rawName: "v-model",
	      value: (rightVisibleDate),
	      expression: "rightVisibleDate"
	    }],
	    ref: "leftInput",
	    staticClass: "el-date-range-picker__editor",
	    attrs: {
	      "placeholder": "结束日期",
	      "readonly": !minDate
	    },
	    domProps: {
	      "value": _s(rightVisibleDate)
	    },
	    on: {
	      "input": [function($event) {
	        if ($event.target.composing) return;
	        rightVisibleDate = $event.target.value
	      }, function($event) {
	        handleDateInput($event, 'max')
	      }],
	      "change": function($event) {
	        handleDateChange($event, 'max')
	      }
	    }
	  }), " ", _h('span', {
	    directives: [{
	      name: "clickoutside",
	      rawName: "v-clickoutside",
	      value: (closeRightTimePicker),
	      expression: "closeRightTimePicker"
	    }],
	    staticClass: "el-date-range-picker__time-picker-wrap"
	  }, [_h('input', {
	    directives: [{
	      name: "model",
	      rawName: "v-model",
	      value: (rightVisibleTime),
	      expression: "rightVisibleTime"
	    }],
	    ref: "rightInput",
	    staticClass: "el-date-range-picker__editor",
	    attrs: {
	      "placeholder": "结束时间",
	      "readonly": !minDate
	    },
	    domProps: {
	      "value": _s(rightVisibleTime)
	    },
	    on: {
	      "focus": function($event) {
	        minDate && (rightTimePickerVisible = true)
	      },
	      "change": function($event) {
	        handleTimeChange($event, 'max')
	      },
	      "input": function($event) {
	        if ($event.target.composing) return;
	        rightVisibleTime = $event.target.value
	      }
	    }
	  }), " ", _h('time-picker', {
	    ref: "righttimepicker",
	    attrs: {
	      "picker-width": rightPickerWidth,
	      "date": maxDate,
	      "visible": rightTimePickerVisible
	    },
	    on: {
	      "pick": handleRightTimePick
	    }
	  })])])]) : _e(), " ", _h('div', {
	    staticClass: "el-picker-panel__content el-date-range-picker__content is-left"
	  }, [_h('div', {
	    staticClass: "el-date-range-picker__header"
	  }, [_h('button', {
	    staticClass: "el-picker-panel__icon-btn el-icon-d-arrow-left",
	    attrs: {
	      "type": "button"
	    },
	    on: {
	      "click": prevYear
	    }
	  }), " ", _h('button', {
	    staticClass: "el-picker-panel__icon-btn el-icon-arrow-left",
	    attrs: {
	      "type": "button"
	    },
	    on: {
	      "click": prevMonth
	    }
	  }), " ", _h('div', [_s(leftLabel)])]), " ", _h('date-table', {
	    attrs: {
	      "selection-mode": "range",
	      "date": date,
	      "year": leftYear,
	      "month": leftMonth,
	      "min-date": minDate,
	      "max-date": maxDate,
	      "range-state": rangeState,
	      "disabled-date": disabledDate
	    },
	    on: {
	      "changerange": handleChangeRange,
	      "pick": handleRangePick
	    }
	  })]), " ", _h('div', {
	    staticClass: "el-picker-panel__content el-date-range-picker__content is-right"
	  }, [_h('div', {
	    staticClass: "el-date-range-picker__header"
	  }, [_h('button', {
	    staticClass: "el-picker-panel__icon-btn el-icon-d-arrow-right",
	    attrs: {
	      "type": "button"
	    },
	    on: {
	      "click": nextYear
	    }
	  }), " ", _h('button', {
	    staticClass: "el-picker-panel__icon-btn el-icon-arrow-right",
	    attrs: {
	      "type": "button"
	    },
	    on: {
	      "click": nextMonth
	    }
	  }), " ", _h('div', [_s(rightLabel)])]), " ", _h('date-table', {
	    attrs: {
	      "selection-mode": "range",
	      "date": rightDate,
	      "year": rightYear,
	      "month": rightMonth,
	      "min-date": minDate,
	      "max-date": maxDate,
	      "range-state": rangeState,
	      "disabled-date": disabledDate
	    },
	    on: {
	      "changerange": handleChangeRange,
	      "pick": handleRangePick
	    }
	  })])])]), " ", (showTime) ? _h('div', {
	    staticClass: "el-picker-panel__footer"
	  }, [_h('button', {
	    staticClass: "el-picker-panel__btn",
	    attrs: {
	      "type": "button",
	      "disabled": btnDisabled
	    },
	    on: {
	      "click": handleConfirm
	    }
	  }, [_s($t('datepicker.confirm'))])]) : _e()])])
	}},staticRenderFns: [function (){with(this) {
	  return _h('span', {
	    staticClass: "el-icon-arrow-right"
	  })
	}}]}

/***/ },
/* 159 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _timeSelect = __webpack_require__(160);

	var _timeSelect2 = _interopRequireDefault(_timeSelect);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	module.exports = _timeSelect2.default;

/***/ },
/* 160 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _picker = __webpack_require__(131);

	var _picker2 = _interopRequireDefault(_picker);

	var _timeSelect = __webpack_require__(161);

	var _timeSelect2 = _interopRequireDefault(_timeSelect);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  mixins: [_picker2.default],

	  name: 'ElTimeSelect',

	  created: function created() {
	    this.type = 'time-select';
	    this.panel = _timeSelect2.default;
	  }
	};

/***/ },
/* 161 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(162)

	/* template */
	var __vue_template__ = __webpack_require__(163)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 162 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;


	var parseTime = function parseTime(time) {
	  var values = ('' || time).split(':');
	  if (values.length >= 2) {
	    var hours = parseInt(values[0], 10);
	    var minutes = parseInt(values[1], 10);

	    return {
	      hours: hours,
	      minutes: minutes
	    };
	  }
	  return null;
	};

	var compareTime = function compareTime(time1, time2) {
	  var value1 = parseTime(time1);
	  var value2 = parseTime(time2);

	  var minutes1 = value1.minutes + value1.hours * 60;
	  var minutes2 = value2.minutes + value2.hours * 60;

	  if (minutes1 === minutes2) {
	    return 0;
	  }

	  return minutes1 > minutes2 ? 1 : -1;
	};

	var formatTime = function formatTime(time) {
	  return (time.hours < 10 ? '0' + time.hours : time.hours) + ':' + (time.minutes < 10 ? '0' + time.minutes : time.minutes);
	};

	var nextTime = function nextTime(time, step) {
	  var timeValue = parseTime(time);
	  var stepValue = parseTime(step);

	  var next = {
	    hours: timeValue.hours,
	    minutes: timeValue.minutes
	  };

	  next.minutes += stepValue.minutes;
	  next.hours += stepValue.hours;

	  next.hours += Math.floor(next.minutes / 60);
	  next.minutes = next.minutes % 60;

	  return formatTime(next);
	};

	exports.default = {
	  watch: {
	    minTime: function minTime(val) {
	      if (this.value && val && compareTime(this.value, val) === -1) {
	        this.$emit('pick');
	      }
	    }
	  },

	  methods: {
	    handleClick: function handleClick(item) {
	      if (!item.disabled) {
	        this.$emit('pick', item.value);
	      }
	    }
	  },

	  data: function data() {
	    return {
	      start: '09:00',
	      end: '18:00',
	      step: '00:30',
	      value: '',
	      visible: false,
	      minTime: '',
	      width: 0
	    };
	  },


	  computed: {
	    items: function items() {
	      var start = this.start;
	      var end = this.end;
	      var step = this.step;

	      var result = [];

	      if (start && end && step) {
	        var current = start;
	        while (compareTime(current, end) <= 0) {
	          result.push({
	            value: current,
	            disabled: compareTime(current, this.minTime || '00:00') <= 0
	          });
	          current = nextTime(current, step);
	        }
	      }

	      return result;
	    }
	  }
	};

/***/ },
/* 163 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('transition', {
	    attrs: {
	      "name": "md-fade-bottom"
	    },
	    on: {
	      "after-leave": function($event) {
	        $emit('dodestroy')
	      }
	    }
	  }, [_h('div', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (visible),
	      expression: "visible"
	    }],
	    staticClass: "el-picker-panel time-select",
	    style: ({
	      width: width + 'px'
	    })
	  }, [_h('div', {
	    staticClass: "el-picker-panel__content"
	  }, [_l((items), function(item) {
	    return _h('div', {
	      staticClass: "time-select-item",
	      class: {
	        selected: value === item.value, disabled: item.disabled
	      },
	      attrs: {
	        "disabled": item.disabled
	      },
	      on: {
	        "click": function($event) {
	          handleClick(item)
	        }
	      }
	    }, ["\n        " + _s(item.value) + "\n      "])
	  })])])])
	}},staticRenderFns: []}

/***/ },
/* 164 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _timePicker = __webpack_require__(165);

	var _timePicker2 = _interopRequireDefault(_timePicker);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	module.exports = _timePicker2.default;

/***/ },
/* 165 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _picker = __webpack_require__(131);

	var _picker2 = _interopRequireDefault(_picker);

	var _time = __webpack_require__(139);

	var _time2 = _interopRequireDefault(_time);

	var _timeRange = __webpack_require__(166);

	var _timeRange2 = _interopRequireDefault(_timeRange);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  mixins: [_picker2.default],

	  name: 'ElTimePicker',

	  props: {
	    isRange: Boolean
	  },

	  created: function created() {
	    this.type = this.isRange ? 'timerange' : 'time';
	    this.panel = this.isRange ? _timeRange2.default : _time2.default;
	  }
	};

/***/ },
/* 166 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(167)

	/* template */
	var __vue_template__ = __webpack_require__(168)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 167 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _util = __webpack_require__(133);

	var MIN_TIME = (0, _util.parseDate)('00:00:00', 'HH:mm:ss');
	var MAX_TIME = (0, _util.parseDate)('23:59:59', 'HH:mm:ss');
	var isDisabled = function isDisabled(minTime, maxTime) {
	  var minValue = minTime.getHours() * 3600 + minTime.getMinutes() * 60 + minTime.getSeconds();
	  var maxValue = maxTime.getHours() * 3600 + maxTime.getMinutes() * 60 + maxTime.getSeconds();

	  return minValue > maxValue;
	};

	exports.default = {
	  components: {
	    TimeSpinner: __webpack_require__(141)
	  },

	  computed: {
	    showSeconds: function showSeconds() {
	      return (this.format || '').indexOf('ss') !== -1;
	    }
	  },

	  data: function data() {
	    var defaultValue = this.$options.defaultValue;
	    defaultValue = Array.isArray(defaultValue) ? defaultValue : [defaultValue];
	    var minTime = defaultValue[0] || new Date();
	    var date = new Date();
	    date.setHours(date.getHours() + 1);
	    var maxTime = defaultValue[1] || date;

	    return {
	      minTime: minTime,
	      maxTime: maxTime,
	      btnDisabled: isDisabled(minTime, maxTime),
	      maxHours: maxTime.getHours(),
	      maxMinutes: maxTime.getMinutes(),
	      maxSeconds: maxTime.getSeconds(),
	      minHours: minTime.getHours(),
	      minMinutes: minTime.getMinutes(),
	      minSeconds: minTime.getSeconds(),
	      format: 'HH:mm:ss',
	      visible: false,
	      width: 0
	    };
	  },


	  methods: {
	    $t: function $t() {
	      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }

	      return _util.$t.apply(this, args);
	    },
	    handleCancel: function handleCancel() {
	      this.$emit('pick');
	    },
	    handleChange: function handleChange() {
	      this.$refs.minSpinner.selectableRange = [[MIN_TIME, this.maxTime]];
	      this.$refs.maxSpinner.selectableRange = [[this.minTime, MAX_TIME]];
	      this.handleConfirm(true);
	    },
	    handleMaxChange: function handleMaxChange(date) {
	      if (date.hours !== undefined) {
	        this.maxTime.setHours(date.hours);
	        this.maxHours = this.maxTime.getHours();
	      }
	      if (date.minutes !== undefined) {
	        this.maxTime.setMinutes(date.minutes);
	        this.maxMinutes = this.maxTime.getMinutes();
	      }
	      if (date.seconds !== undefined) {
	        this.maxTime.setSeconds(date.seconds);
	        this.maxSeconds = this.maxTime.getSeconds();
	      }
	      this.handleChange();
	    },
	    handleMinChange: function handleMinChange(date) {
	      if (date.hours !== undefined) {
	        this.minTime.setHours(date.hours);
	        this.minHours = this.minTime.getHours();
	      }
	      if (date.minutes !== undefined) {
	        this.minTime.setMinutes(date.minutes);
	        this.minMinutes = this.minTime.getMinutes();
	      }
	      if (date.seconds !== undefined) {
	        this.minTime.setSeconds(date.seconds);
	        this.minSeconds = this.minTime.getSeconds();
	      }

	      this.handleChange();
	    },
	    setMinSelectionRange: function setMinSelectionRange(start, end) {
	      this.$emit('select-range', start, end);
	    },
	    setMaxSelectionRange: function setMaxSelectionRange(start, end) {
	      this.$emit('select-range', start + 11, end + 11);
	    },
	    handleConfirm: function handleConfirm() {
	      var visible = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
	      var first = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

	      var minSelectableRange = this.$refs.minSpinner.selectableRange;
	      var maxSelectableRange = this.$refs.maxSpinner.selectableRange;

	      this.minTime = (0, _util.limitRange)(this.minTime, minSelectableRange);
	      this.maxTime = (0, _util.limitRange)(this.maxTime, maxSelectableRange);

	      this.$emit('pick', [this.minTime, this.maxTime], visible, first);
	    },
	    ajustScrollTop: function ajustScrollTop() {
	      this.$refs.minSpinner.ajustScrollTop();
	      this.$refs.maxSpinner.ajustScrollTop();
	    },
	    focusEditor: function focusEditor(val) {
	      return this.$refs.minSpinner.focusEditor(val);
	    }
	  },

	  mounted: function mounted() {
	    var _this = this;

	    this.$nextTick(function () {
	      return _this.handleConfirm(true, true);
	    });
	  }
	};

/***/ },
/* 168 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('transition', {
	    attrs: {
	      "name": "md-fade-bottom"
	    },
	    on: {
	      "after-leave": function($event) {
	        $emit('dodestroy')
	      }
	    }
	  }, [_h('div', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (visible),
	      expression: "visible"
	    }],
	    staticClass: "el-time-range-picker el-picker-panel",
	    style: ({
	      width: width + 'px'
	    })
	  }, [_h('div', {
	    staticClass: "el-time-range-picker__content"
	  }, [_h('div', {
	    staticClass: "el-time-range-picker__cell"
	  }, [_h('div', {
	    staticClass: "el-time-range-picker__header"
	  }, [_s($t('datepicker.startTime'))]), " ", _h('div', {
	    staticClass: "el-time-range-picker__body el-time-panel__content"
	  }, [_h('time-spinner', {
	    ref: "minSpinner",
	    attrs: {
	      "show-seconds": showSeconds,
	      "hours": minHours,
	      "minutes": minMinutes,
	      "seconds": minSeconds
	    },
	    on: {
	      "change": handleMinChange,
	      "select-range": setMinSelectionRange
	    }
	  })])]), " ", _h('div', {
	    staticClass: "el-time-range-picker__cell"
	  }, [_h('div', {
	    staticClass: "el-time-range-picker__header"
	  }, [_s($t('datepicker.endTime'))]), " ", _h('div', {
	    staticClass: "el-time-range-picker__body el-time-panel__content"
	  }, [_h('time-spinner', {
	    ref: "maxSpinner",
	    attrs: {
	      "show-seconds": showSeconds,
	      "hours": maxHours,
	      "minutes": maxMinutes,
	      "seconds": maxSeconds
	    },
	    on: {
	      "change": handleMaxChange,
	      "select-range": setMaxSelectionRange
	    }
	  })])])]), " ", _h('div', {
	    staticClass: "el-time-panel__footer"
	  }, [_h('button', {
	    staticClass: "el-time-panel__btn cancel",
	    attrs: {
	      "type": "button"
	    },
	    on: {
	      "click": function($event) {
	        handleCancel()
	      }
	    }
	  }, [_s($t('datepicker.cancel'))]), " ", _h('button', {
	    staticClass: "el-time-panel__btn confirm",
	    attrs: {
	      "type": "button",
	      "disabled": btnDisabled
	    },
	    on: {
	      "click": function($event) {
	        handleConfirm()
	      }
	    }
	  }, [_s($t('datepicker.confirm'))])])])])
	}},staticRenderFns: []}

/***/ },
/* 169 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Popover = __webpack_require__(170);

	Popover.install = function (Vue) {
	  Vue.component(Popover.name, Popover);
	};

	module.exports = Popover;

/***/ },
/* 170 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(171)

	/* template */
	var __vue_template__ = __webpack_require__(173)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 171 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _vuePopper = __webpack_require__(5);

	var _vuePopper2 = _interopRequireDefault(_vuePopper);

	var _vue = __webpack_require__(8);

	var _vue2 = _interopRequireDefault(_vue);

	var _event = __webpack_require__(172);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_vue2.default.directive('popover', {
	  bind: function bind(el, binding, vnode) {
	    vnode.context.$refs[binding.arg].$refs.reference = el;
	  }
	});

	exports.default = {
	  name: 'el-popover',

	  mixins: [_vuePopper2.default],

	  props: {
	    trigger: {
	      type: String,
	      default: 'click',
	      validator: function validator(value) {
	        return ['click', 'focus', 'hover'].indexOf(value) > -1;
	      }
	    },
	    title: String,
	    content: String,
	    reference: {},
	    popperClass: String,
	    width: {},
	    visibleArrow: {
	      default: true
	    },
	    transition: {
	      type: String,
	      default: 'fade-in-linear'
	    }
	  },

	  mounted: function mounted() {
	    var _this = this;

	    var _timer = void 0;
	    var reference = this.reference || this.$refs.reference || this.$slots.reference[0].elm;
	    var popper = this.popper || this.$refs.popper;

	    this.$nextTick(function () {
	      if (_this.trigger === 'click') {
	        (0, _event.on)(reference, 'click', function () {
	          _this.showPopper = !_this.showPopper;
	        });
	        (0, _event.on)(document, 'click', function (e) {
	          if (!_this.$el || !reference || _this.$el.contains(e.target) || reference.contains(e.target) || !popper || popper.contains(e.target)) return;
	          _this.showPopper = false;
	        });
	      } else if (_this.trigger === 'hover') {
	        (0, _event.on)(reference, 'mouseenter', function () {
	          _this.showPopper = true;
	          clearTimeout(_timer);
	        });
	        (0, _event.on)(reference, 'mouseleave', function () {
	          _timer = setTimeout(function () {
	            _this.showPopper = false;
	          }, 200);
	        });
	      } else {
	        if ([].slice.call(reference.children).length) {
	          var children = reference.childNodes;

	          for (var i = 0; i < children.length; i++) {
	            if (children[i].nodeName === 'INPUT') {
	              (0, _event.on)(children[i], 'focus', function () {
	                _this.showPopper = true;
	              });
	              (0, _event.on)(children[i], 'blur', function () {
	                _this.showPopper = false;
	              });
	              break;
	            }
	          }
	        } else if (reference.nodeName === 'INPUT' || reference.nodeName === 'TEXTAREA') {
	          (0, _event.on)(reference, 'focus', function () {
	            _this.showPopper = true;
	          });
	          (0, _event.on)(reference, 'blur', function () {
	            _this.showPopper = false;
	          });
	        } else {
	          (0, _event.on)(reference, 'mousedown', function () {
	            _this.showPopper = true;
	          });
	          (0, _event.on)(reference, 'mouseup', function () {
	            _this.showPopper = false;
	          });
	        }
	      }
	    });
	  },
	  destroyed: function destroyed() {
	    var reference = this.reference;

	    (0, _event.off)(reference, 'mouseup');
	    (0, _event.off)(reference, 'mousedown');
	    (0, _event.off)(reference, 'focus');
	    (0, _event.off)(reference, 'blur');
	    (0, _event.off)(reference, 'mouseleave');
	    (0, _event.off)(reference, 'mouseenter');
	  }
	};

/***/ },
/* 172 */
/***/ function(module, exports) {

	var bindEvent = (function() {
	  if(document.addEventListener) {
	    return function(element, event, handler) {
	      if (element && event && handler) {
	        element.addEventListener(event, handler, false);
	      }
	    };
	  } else {
	    return function(element, event, handler) {
	      if (element && event && handler) {
	        element.attachEvent('on' + event, handler);
	      }
	    };
	  }
	})();

	var unbindEvent = (function() {
	  if(document.removeEventListener) {
	    return function(element, event, handler) {
	      if (element && event) {
	        element.removeEventListener(event, handler, false);
	      }
	    };
	  } else {
	    return function(element, event, handler) {
	      if (element && event) {
	        element.detachEvent('on' + event, handler);
	      }
	    };
	  }
	})();

	var bindOnce = function(el, event, fn) {
	  var listener = function() {
	    if (fn) {
	      fn.apply(this, arguments);
	    }
	    unbindEvent(el, event, listener);
	  };
	  bindEvent(el, event, listener);
	};

	module.exports = {
	  on: bindEvent,
	  off: unbindEvent,
	  once: bindOnce
	};

/***/ },
/* 173 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('span', [_h('transition', {
	    attrs: {
	      "name": transition
	    },
	    on: {
	      "after-leave": doDestroy
	    }
	  }, [_h('div', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (showPopper),
	      expression: "showPopper"
	    }],
	    ref: "popper",
	    staticClass: "el-popover",
	    class: [popperClass],
	    style: ({
	      width: width + 'px'
	    })
	  }, [(title) ? _h('div', {
	    staticClass: "el-popover__title",
	    domProps: {
	      "textContent": _s(title)
	    }
	  }) : _e(), " ", _t("default", [_s(content)])])]), " ", _t("reference")])
	}},staticRenderFns: []}

/***/ },
/* 174 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Tooltip = __webpack_require__(175);

	Tooltip.install = function (Vue) {
	  Vue.component(Tooltip.name, Tooltip);
	};

	module.exports = Tooltip;

/***/ },
/* 175 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(176)

	/* template */
	var __vue_template__ = __webpack_require__(177)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 176 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _vuePopper = __webpack_require__(5);

	var _vuePopper2 = _interopRequireDefault(_vuePopper);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  name: 'el-tooltip',

	  mixins: [_vuePopper2.default],

	  props: {
	    openDelay: {
	      type: Number,
	      default: 0
	    },
	    disabled: Boolean,
	    effect: {
	      type: String,
	      default: 'dark'
	    },
	    content: String,
	    visibleArrow: {
	      default: true
	    },
	    transition: {
	      type: String,
	      default: 'fade-in-linear'
	    },
	    options: {
	      default: function _default() {
	        return {
	          boundariesPadding: 10,
	          gpuAcceleration: false
	        };
	      }
	    }
	  },

	  methods: {
	    handleShowPopper: function handleShowPopper() {
	      var _this = this;

	      this.timeout = setTimeout(function () {
	        _this.showPopper = true;
	      }, this.openDelay);
	    },
	    handleClosePopper: function handleClosePopper() {
	      clearTimeout(this.timeout);
	      this.showPopper = false;
	    }
	  }
	};

/***/ },
/* 177 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('div', {
	    staticClass: "el-tooltip",
	    on: {
	      "mouseenter": handleShowPopper,
	      "mouseleave": handleClosePopper
	    }
	  }, [_h('div', {
	    ref: "reference",
	    staticClass: "el-tooltip__rel"
	  }, [_t("default")]), " ", _h('transition', {
	    attrs: {
	      "name": transition
	    },
	    on: {
	      "after-leave": doDestroy
	    }
	  }, [_h('div', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (!disabled && showPopper),
	      expression: "!disabled && showPopper"
	    }],
	    ref: "popper",
	    staticClass: "el-tooltip__popper",
	    class: ['is-' + effect]
	  }, [_t("content", [_h('div', {
	    domProps: {
	      "textContent": _s(content)
	    }
	  })])])])])
	}},staticRenderFns: []}

/***/ },
/* 178 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _main = __webpack_require__(179);

	var _main2 = _interopRequireDefault(_main);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	module.exports = _main2.default;

/***/ },
/* 179 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.MessageBox = undefined;

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _vue = __webpack_require__(8);

	var _vue2 = _interopRequireDefault(_vue);

	var _main = __webpack_require__(180);

	var _main2 = _interopRequireDefault(_main);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var CONFIRM_TEXT = '确定';
	var CANCEL_TEXT = '取消';

	var defaults = {
	  title: '提示',
	  message: '',
	  type: '',
	  showInput: false,
	  showClose: true,
	  modalFade: true,
	  lockScroll: true,
	  closeOnClickModal: true,
	  inputValue: null,
	  inputPlaceholder: '',
	  inputPattern: null,
	  inputValidator: null,
	  inputErrorMessage: '',
	  showConfirmButton: true,
	  showCancelButton: false,
	  confirmButtonPosition: 'right',
	  confirmButtonHighlight: false,
	  cancelButtonHighlight: false,
	  confirmButtonText: CONFIRM_TEXT,
	  cancelButtonText: CANCEL_TEXT,
	  confirmButtonClass: '',
	  cancelButtonClass: ''
	};

	var merge = function merge(target) {
	  for (var i = 1, j = arguments.length; i < j; i++) {
	    var source = arguments[i];
	    for (var prop in source) {
	      if (source.hasOwnProperty(prop)) {
	        var value = source[prop];
	        if (value !== undefined) {
	          target[prop] = value;
	        }
	      }
	    }
	  }

	  return target;
	};

	var MessageBoxConstructor = _vue2.default.extend(_main2.default);

	var currentMsg, instance;
	var msgQueue = [];

	var initInstance = function initInstance() {
	  instance = new MessageBoxConstructor({
	    el: document.createElement('div')
	  });

	  instance.callback = function (action) {
	    if (currentMsg) {
	      var callback = currentMsg.callback;
	      if (typeof callback === 'function') {
	        if (instance.showInput) {
	          callback(instance.inputValue, action);
	        } else {
	          callback(action);
	        }
	      }
	      if (currentMsg.resolve) {
	        var $type = currentMsg.options.$type;
	        if ($type === 'confirm' || $type === 'prompt') {
	          if (action === 'confirm') {
	            if (instance.showInput) {
	              currentMsg.resolve({ value: instance.inputValue, action: action });
	            } else {
	              currentMsg.resolve(action);
	            }
	          } else if (action === 'cancel' && currentMsg.reject) {
	            currentMsg.reject(action);
	          }
	        } else {
	          currentMsg.resolve(action);
	        }
	      }
	    }
	  };
	};

	var showNextMsg = function showNextMsg() {
	  if (!instance) {
	    initInstance();
	  }

	  if (!instance.value || instance.closeTimer) {
	    if (msgQueue.length > 0) {
	      currentMsg = msgQueue.shift();

	      var options = currentMsg.options;
	      for (var prop in options) {
	        if (options.hasOwnProperty(prop)) {
	          instance[prop] = options[prop];
	        }
	      }
	      ['modal', 'showClose', 'closeOnClickModal', 'closeOnPressEscape'].forEach(function (prop) {
	        if (instance[prop] === undefined) {
	          instance[prop] = true;
	        }
	      });
	      document.body.appendChild(instance.$el);

	      _vue2.default.nextTick(function () {
	        instance.value = true;
	      });
	    }
	  }
	};

	var MessageBox = function MessageBox(options, callback) {
	  if (typeof options === 'string') {
	    options = {
	      title: options
	    };
	    if (arguments[1]) {
	      options.message = arguments[1];
	    }
	    if (arguments[2]) {
	      options.type = arguments[2];
	    }
	  } else if (options.callback && !callback) {
	    callback = options.callback;
	  }

	  if (typeof Promise !== 'undefined') {
	    return new Promise(function (resolve, reject) {
	      msgQueue.push({
	        options: merge({}, defaults, MessageBox.defaults || {}, options),
	        callback: callback,
	        resolve: resolve,
	        reject: reject
	      });

	      showNextMsg();
	    });
	  } else {
	    msgQueue.push({
	      options: merge({}, defaults, MessageBox.defaults || {}, options),
	      callback: callback
	    });

	    showNextMsg();
	  }
	};

	MessageBox.setDefaults = function (defaults) {
	  MessageBox.defaults = defaults;
	};

	MessageBox.alert = function (message, title, options) {
	  if ((typeof title === 'undefined' ? 'undefined' : _typeof(title)) === 'object') {
	    options = title;
	    title = '';
	  }
	  return MessageBox(merge({
	    title: title,
	    message: message,
	    $type: 'alert',
	    closeOnPressEscape: false,
	    closeOnClickModal: false
	  }, options));
	};

	MessageBox.confirm = function (message, title, options) {
	  if ((typeof title === 'undefined' ? 'undefined' : _typeof(title)) === 'object') {
	    options = title;
	    title = '';
	  }
	  return MessageBox(merge({
	    title: title,
	    message: message,
	    $type: 'confirm',
	    showCancelButton: true
	  }, options));
	};

	MessageBox.prompt = function (message, title, options) {
	  if ((typeof title === 'undefined' ? 'undefined' : _typeof(title)) === 'object') {
	    options = title;
	    title = '';
	  }
	  return MessageBox(merge({
	    title: title,
	    message: message,
	    showCancelButton: true,
	    showInput: true,
	    $type: 'prompt'
	  }, options));
	};

	MessageBox.close = function () {
	  instance.value = false;
	  msgQueue = [];
	  currentMsg = null;
	};

	exports.default = MessageBox;
	exports.MessageBox = MessageBox;

/***/ },
/* 180 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(181)

	/* template */
	var __vue_template__ = __webpack_require__(184)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 181 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _vuePopup = __webpack_require__(182);

	var _vuePopup2 = _interopRequireDefault(_vuePopup);

	var _index = __webpack_require__(19);

	var _index2 = _interopRequireDefault(_index);

	var _index3 = __webpack_require__(108);

	var _index4 = _interopRequireDefault(_index3);

	var _class = __webpack_require__(183);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var CONFIRM_TEXT = '确定';
	var CANCEL_TEXT = '取消';
	var typeMap = {
	  success: 'circle-check',
	  info: 'information',
	  warning: 'warning',
	  error: 'circle-cross'
	};

	exports.default = {
	  mixins: [_vuePopup2.default],

	  props: {
	    modal: {
	      default: true
	    },
	    lockScroll: {
	      default: true
	    },
	    showClose: {
	      type: Boolean,
	      default: true
	    },
	    closeOnClickModal: {
	      default: true
	    },
	    closeOnPressEscape: {
	      default: true
	    }
	  },

	  components: {
	    ElInput: _index2.default,
	    ElButton: _index4.default
	  },

	  computed: {
	    typeClass: function typeClass() {
	      return this.type && typeMap[this.type] ? 'el-icon-' + typeMap[this.type] : '';
	    },
	    confirmButtonClasses: function confirmButtonClasses() {
	      return 'el-button el-button-primary ' + this.confirmButtonClass;
	    },
	    cancelButtonClasses: function cancelButtonClasses() {
	      return 'el-button el-button-default ' + this.cancelButtonClass;
	    }
	  },

	  methods: {
	    doClose: function doClose() {
	      var _this = this;

	      this.value = false;
	      this._closing = true;

	      this.onClose && this.onClose();

	      if (this.lockScroll) {
	        setTimeout(function () {
	          if (_this.modal && _this.bodyOverflow !== 'hidden') {
	            document.body.style.overflow = _this.bodyOverflow;
	            document.body.style.paddingRight = _this.bodyPaddingRight;
	          }
	          _this.bodyOverflow = null;
	          _this.bodyPaddingRight = null;
	        }, 200);
	      }
	      this.opened = false;

	      if (!this.transition) {
	        this.doAfterClose();
	      }
	    },
	    handleAction: function handleAction(action) {
	      if (this.$type === 'prompt' && action === 'confirm' && !this.validate()) {
	        return;
	      }
	      var callback = this.callback;
	      this.value = false;
	      callback(action);
	    },
	    validate: function validate() {
	      if (this.$type === 'prompt') {
	        var inputPattern = this.inputPattern;
	        if (inputPattern && !inputPattern.test(this.inputValue || '')) {
	          this.editorErrorMessage = this.inputErrorMessage || '输入的数据不合法!';
	          (0, _class.addClass)(this.$refs.input.$el.querySelector('input'), 'invalid');
	          return false;
	        }
	        var inputValidator = this.inputValidator;
	        if (typeof inputValidator === 'function') {
	          var validateResult = inputValidator(this.inputValue);
	          if (validateResult === false) {
	            this.editorErrorMessage = this.inputErrorMessage || '输入的数据不合法!';
	            (0, _class.addClass)(this.$refs.input.$el.querySelector('input'), 'invalid');
	            return false;
	          }
	          if (typeof validateResult === 'string') {
	            this.editorErrorMessage = validateResult;
	            return false;
	          }
	        }
	      }
	      this.editorErrorMessage = '';
	      (0, _class.removeClass)(this.$refs.input.$el.querySelector('input'), 'invalid');
	      return true;
	    }
	  },

	  watch: {
	    inputValue: function inputValue() {
	      if (this.$type === 'prompt') {
	        this.validate();
	      }
	    },
	    value: function value(val) {
	      var _this2 = this;

	      if (val && this.$type === 'prompt') {
	        setTimeout(function () {
	          if (_this2.$refs.input && _this2.$refs.input.$el) {
	            _this2.$refs.input.$el.querySelector('input').focus();
	          }
	        }, 500);
	      }
	    }
	  },

	  data: function data() {
	    return {
	      title: '',
	      message: '',
	      type: '',
	      showInput: false,
	      inputValue: null,
	      inputPlaceholder: '',
	      inputPattern: null,
	      inputValidator: null,
	      inputErrorMessage: '',
	      showConfirmButton: true,
	      showCancelButton: false,
	      confirmButtonText: CONFIRM_TEXT,
	      cancelButtonText: CANCEL_TEXT,
	      confirmButtonClass: '',
	      confirmButtonDisabled: false,
	      cancelButtonClass: '',

	      editorErrorMessage: null,
	      callback: null
	    };
	  }
	};

/***/ },
/* 182 */
/***/ function(module, exports, __webpack_require__) {

	!function(e,t){ true?module.exports=t(__webpack_require__(8)):"function"==typeof define&&define.amd?define("VuePopup",["vue"],t):"object"==typeof exports?exports.VuePopup=t(require("vue")):e.VuePopup=t(e.vue)}(this,function(e){return function(e){function t(n){if(o[n])return o[n].exports;var i=o[n]={i:n,l:!1,exports:{}};return e[n].call(i.exports,i,i.exports,t),i.l=!0,i.exports}var o={};return t.m=e,t.c=o,t.i=function(e){return e},t.d=function(e,t,o){Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:o})},t.n=function(e){var o=e&&e.__esModule?function(){return e["default"]}:function(){return e};return t.d(o,"a",o),o},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="/lib/",t(t.s=5)}([function(e,t,o){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0});var i=o(4),l=n(i),d=o(2),s=o(1),r=n(s);o(3);var a=1,u=[],c=function(e){if(u.indexOf(e)===-1){var t=function(e){var t=e.__vue__;if(!t){var o=e.previousSibling;o.__vue__&&(t=o.__vue__)}return t};l["default"].transition(e,{afterEnter:function(e){var o=t(e);o&&o.doAfterOpen&&o.doAfterOpen()},afterLeave:function(e){var o=t(e);o&&o.doAfterClose&&o.doAfterClose()}})}},f=void 0,p=function(){if(void 0!==f)return f;var e=document.createElement("div");e.style.visibility="hidden",e.style.width="100px",e.style.position="absolute",e.style.top="-9999px",document.body.appendChild(e);var t=e.offsetWidth;e.style.overflow="scroll";var o=document.createElement("div");o.style.width="100%",e.appendChild(o);var n=o.offsetWidth;return e.parentNode.removeChild(e),t-n},h=function m(e){return 3===e.nodeType&&(e=e.nextElementSibling||e.nextSibling,m(e)),e};t["default"]={props:{value:{type:Boolean,"default":!1},transition:{type:String,"default":""},openDelay:{},closeDelay:{},zIndex:{},modal:{type:Boolean,"default":!1},modalFade:{type:Boolean,"default":!0},modalClass:{},lockScroll:{type:Boolean,"default":!0},closeOnPressEscape:{type:Boolean,"default":!1},closeOnClickModal:{type:Boolean,"default":!1}},created:function(){this.transition&&c(this.transition)},beforeMount:function(){this._popupId="popup-"+a++,r["default"].register(this._popupId,this)},beforeDestroy:function(){r["default"].deregister(this._popupId),r["default"].closeModal(this._popupId)},data:function(){return{opened:!1,bodyOverflow:null,bodyPaddingRight:null,rendered:!1}},watch:{value:function(e){var t=this;if(e){if(this._opening)return;this.rendered?this.open():(this.rendered=!0,l["default"].nextTick(function(){t.open()}))}else this.close()}},methods:{open:function(e){var t=this;if(!this.rendered)return this.rendered=!0,void this.$emit("input",!0);var o=(0,d.merge)({},this,e);this._closeTimer&&(clearTimeout(this._closeTimer),this._closeTimer=null),clearTimeout(this._openTimer);var n=Number(o.openDelay);n>0?this._openTimer=setTimeout(function(){t._openTimer=null,t.doOpen(o)},n):this.doOpen(o)},doOpen:function(e){if((!this.willOpen||this.willOpen())&&!this.opened){this._opening=!0,this.$emit("input",!0);var t=h(this.$el),o=e.modal,n=e.zIndex;n&&(r["default"].zIndex=n),o&&(this._closing&&(r["default"].closeModal(this._popupId),this._closing=!1),r["default"].openModal(this._popupId,r["default"].nextZIndex(),t,e.modalClass,e.modalFade),e.lockScroll&&(this.bodyOverflow||(this.bodyPaddingRight=document.body.style.paddingRight,this.bodyOverflow=document.body.style.overflow),f=p(),f>0&&(document.body.style.paddingRight=f+"px"),document.body.style.overflow="hidden")),"static"===getComputedStyle(t).position&&(t.style.position="absolute"),o?t.style.zIndex=r["default"].nextZIndex():n&&(t.style.zIndex=n),this.opened=!0,this.onOpen&&this.onOpen(),this.transition||this.doAfterOpen()}},doAfterOpen:function(){this._opening=!1},close:function(){var e=this;if(!this.willClose||this.willClose()){null!==this._openTimer&&(clearTimeout(this._openTimer),this._openTimer=null),clearTimeout(this._closeTimer);var t=Number(this.closeDelay);t>0?this._closeTimer=setTimeout(function(){e._closeTimer=null,e.doClose()},t):this.doClose()}},doClose:function(){var e=this;this.$emit("input",!1),this._closing=!0,this.onClose&&this.onClose(),this.lockScroll&&setTimeout(function(){e.modal&&"hidden"!==e.bodyOverflow&&(document.body.style.overflow=e.bodyOverflow,document.body.style.paddingRight=e.bodyPaddingRight),e.bodyOverflow=null,e.bodyPaddingRight=null},200),this.opened=!1,this.transition||this.doAfterClose()},doAfterClose:function(){r["default"].closeModal(this._popupId),this._closing=!1}}}},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=function(){var e=i.modalDom;return e||(e=document.createElement("div"),i.modalDom=e,e.addEventListener("touchmove",function(e){e.preventDefault(),e.stopPropagation()}),e.addEventListener("click",function(){i.doOnModalClick&&i.doOnModalClick()})),e},n={},i={zIndex:1e3,modalFade:!0,getInstance:function(e){return n[e]},register:function(e,t){e&&t&&(n[e]=t)},deregister:function(e){e&&(n[e]=null,delete n[e])},nextZIndex:function(){return i.zIndex++},modalStack:[],doOnModalClick:function(){var e=i.modalStack[i.modalStack.length-1];if(e){var t=i.getInstance(e.id);t&&t.closeOnClickModal&&t.close()}},openModal:function(e,t,n,i,l){if(e&&void 0!==t){this.modalFade=l;for(var d=this.modalStack,s=0,r=d.length;s<r;s++){var a=d[s];if(a.id===e)return}var u=o();if(u.classList.add("v-modal"),this.modalFade&&u.classList.add("v-modal-enter"),i){var c=i.trim().split(/\s+/);c.forEach(function(e){return u.classList.add(e)})}setTimeout(function(){u.classList.remove("v-modal-enter")},200),n&&n.parentNode&&11!==n.parentNode.nodeType?n.parentNode.appendChild(u):document.body.appendChild(u),t&&(u.style.zIndex=t),u.style.display="",this.modalStack.push({id:e,zIndex:t,modalClass:i})}},closeModal:function(e){var t=this.modalStack,n=o();if(t.length>0){var i=t[t.length-1];if(i.id===e){if(i.modalClass){var l=i.modalClass.trim().split(/\s+/);l.forEach(function(e){return n.classList.remove(e)})}t.pop(),t.length>0&&(n.style.zIndex=t[t.length-1].zIndex)}else for(var d=t.length-1;d>=0;d--)if(t[d].id===e){t.splice(d,1);break}}0===t.length&&(this.modalFade&&n.classList.add("v-modal-leave"),setTimeout(function(){0===t.length&&(n.parentNode&&n.parentNode.removeChild(n),n.style.display="none"),n.classList.remove("v-modal-leave")},200))}};window.addEventListener("keydown",function(e){if(27===e.keyCode&&i.modalStack.length>0){var t=i.modalStack[i.modalStack.length-1];if(!t)return;var o=i.getInstance(t.id);o.closeOnPressEscape&&o.close()}}),t["default"]=i},function(e,t){"use strict";function o(e){for(var t=1,o=arguments.length;t<o;t++){var n=arguments[t];for(var i in n)if(n.hasOwnProperty(i)){var l=n[i];void 0!==l&&(e[i]=l)}}return e}Object.defineProperty(t,"__esModule",{value:!0}),t.merge=o},function(e,t){},function(t,o){t.exports=e},function(e,t,o){e.exports=o(0)}])});
	//# sourceMappingURL=index.js.map

/***/ },
/* 183 */
/***/ function(module, exports) {

	var trim = function (string) {
	  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
	};

	var hasClass = function (el, cls) {
	  if (!el || !cls) return false;
	  if (cls.indexOf(' ') != -1) throw new Error('className should not contain space.');
	  if (el.classList) {
	    return el.classList.contains(cls);
	  } else {
	    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
	  }
	};

	var addClass = function (el, cls) {
	  if (!el) return;
	  var curClass = el.className;
	  var classes = (cls || '').split(' ');

	  for (var i = 0, j = classes.length; i < j; i++) {
	    var clsName = classes[i];
	    if (!clsName) continue;

	    if (el.classList) {
	      el.classList.add(clsName);
	    } else {
	      if (!hasClass(el, clsName)) {
	        curClass += ' ' + clsName;
	      }
	    }
	  }
	  if (!el.classList) {
	    el.className = curClass;
	  }
	};

	var removeClass = function (el, cls) {
	  if (!el || !cls) return;
	  var classes = cls.split(' ');
	  var curClass = ' ' + el.className + ' ';

	  for (var i = 0, j = classes.length; i < j; i++) {
	    var clsName = classes[i];
	    if (!clsName) continue;

	    if (el.classList) {
	      el.classList.remove(clsName);
	    } else {
	      if (hasClass(el, clsName)) {
	        curClass = curClass.replace(' ' + clsName + ' ', ' ');
	      }
	    }
	  }
	  if (!el.classList) {
	    el.className = trim(curClass);
	  }
	};

	module.exports = {
	  hasClass: hasClass,
	  addClass: addClass,
	  removeClass: removeClass
	};

/***/ },
/* 184 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('div', {
	    staticClass: "el-message-box__wrapper"
	  }, [_h('transition', {
	    attrs: {
	      "name": "msgbox-bounce"
	    }
	  }, [_h('div', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (value),
	      expression: "value"
	    }],
	    staticClass: "el-message-box"
	  }, [(title !== '') ? _h('div', {
	    staticClass: "el-message-box__header"
	  }, [_h('div', {
	    staticClass: "el-message-box__title"
	  }, [_s(title)]), " ", (showClose) ? _h('i', {
	    staticClass: "el-message-box__close el-icon-close",
	    on: {
	      "click": function($event) {
	        handleAction('cancel')
	      }
	    }
	  }) : _e()]) : _e(), " ", (message !== '') ? _h('div', {
	    staticClass: "el-message-box__content"
	  }, [_h('div', {
	    staticClass: "el-message-box__status",
	    class: [typeClass]
	  }), " ", _h('div', {
	    staticClass: "el-message-box__message",
	    style: ({
	      'margin-left': typeClass ? '50px' : '0'
	    })
	  }, [_h('p', [_s(message)])]), " ", _h('div', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (showInput),
	      expression: "showInput"
	    }],
	    staticClass: "el-message-box__input"
	  }, [_h('el-input', {
	    directives: [{
	      name: "model",
	      rawName: "v-model",
	      value: (inputValue),
	      expression: "inputValue"
	    }],
	    ref: "input",
	    attrs: {
	      "placeholder": inputPlaceholder
	    },
	    domProps: {
	      "value": (inputValue)
	    },
	    on: {
	      "input": function($event) {
	        inputValue = $event
	      }
	    }
	  }), " ", _h('div', {
	    staticClass: "el-message-box__errormsg",
	    style: ({
	      visibility: !!editorErrorMessage ? 'visible' : 'hidden'
	    })
	  }, [_s(editorErrorMessage)])])]) : _e(), " ", _h('div', {
	    staticClass: "el-message-box__btns"
	  }, [_h('el-button', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (showCancelButton),
	      expression: "showCancelButton"
	    }],
	    class: [cancelButtonClasses],
	    nativeOn: {
	      "click": function($event) {
	        handleAction('cancel')
	      }
	    }
	  }, [_s(cancelButtonText)]), " ", _h('el-button', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (showConfirmButton),
	      expression: "showConfirmButton"
	    }],
	    class: [confirmButtonClasses],
	    attrs: {
	      "type": "primary"
	    },
	    nativeOn: {
	      "click": function($event) {
	        handleAction('confirm')
	      }
	    }
	  }, [_s(confirmButtonText)])])])])])
	}},staticRenderFns: []}

/***/ },
/* 185 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ElBreadcrumb = __webpack_require__(186);

	ElBreadcrumb.install = function (Vue) {
	  Vue.component(ElBreadcrumb.name, ElBreadcrumb);
	};

	module.exports = ElBreadcrumb;

/***/ },
/* 186 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(187)

	/* template */
	var __vue_template__ = __webpack_require__(188)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 187 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports.default = {
	  name: 'ElBreadcrumb',

	  props: {
	    separator: {
	      type: String,
	      default: '/'
	    }
	  }
	};

/***/ },
/* 188 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('div', {
	    staticClass: "el-breadcrumb"
	  }, [_t("default")])
	}},staticRenderFns: []}

/***/ },
/* 189 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ElBreadcrumbItem = __webpack_require__(190);

	ElBreadcrumbItem.install = function (Vue) {
	  Vue.component(ElBreadcrumbItem.name, ElBreadcrumbItem);
	};

	module.exports = ElBreadcrumbItem;

/***/ },
/* 190 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(191)

	/* template */
	var __vue_template__ = __webpack_require__(192)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 191 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports.default = {
	  name: 'ElBreadcrumbItem',
	  props: {
	    to: {},
	    replace: Boolean
	  },
	  data: function data() {
	    return {
	      separator: ''
	    };
	  },
	  mounted: function mounted() {
	    var _this = this;

	    this.separator = this.$parent.separator;
	    var self = this;
	    if (this.to) {
	      var link = this.$refs.link;
	      link.addEventListener('click', function (_) {
	        var to = _this.to;
	        self.replace ? self.$router.replace(to) : self.$router.push(to);
	      });
	    }
	  }
	};

/***/ },
/* 192 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('span', {
	    staticClass: "el-breadcrumb__item"
	  }, [_h('span', {
	    ref: "link",
	    staticClass: "el-breadcrumb__item__inner"
	  }, [_t("default")]), _h('span', {
	    staticClass: "el-breadcrumb__separator"
	  }, [_s(separator)])])
	}},staticRenderFns: []}

/***/ },
/* 193 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ElForm = __webpack_require__(194);

	ElForm.install = function (Vue) {
	  Vue.component(ElForm.name, ElForm);
	};

	module.exports = ElForm;

/***/ },
/* 194 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(195)

	/* template */
	var __vue_template__ = __webpack_require__(196)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 195 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports.default = {
	  name: 'ElForm',

	  componentName: 'form',

	  props: {
	    model: Object,
	    rules: Object,
	    type: String,
	    labelPosition: String,
	    labelWidth: String,
	    labelSuffix: {
	      type: String,
	      default: ''
	    },
	    inline: Boolean
	  },
	  data: function data() {
	    return {
	      fields: {},
	      fieldLength: 0
	    };
	  },
	  created: function created() {
	    var _this = this;

	    this.$on('el.form.addField', function (field) {
	      _this.fields[field.prop] = field;
	      _this.fieldLength++;
	    });
	    this.$on('el.form.removeField', function (field) {
	      delete _this.fields[field.prop];
	      _this.fieldLength--;
	    });
	  },

	  methods: {
	    resetFields: function resetFields() {
	      for (var prop in this.fields) {
	        var field = this.fields[prop];
	        field.resetField();
	      }
	    },
	    validate: function validate(callback) {
	      var _this2 = this;

	      var count = 0;
	      var valid = true;

	      for (var prop in this.fields) {
	        var field = this.fields[prop];
	        field.validate('', function (errors) {
	          if (errors) {
	            valid = false;
	          }

	          if (++count === _this2.fieldLength) {
	            callback(valid);
	          }
	        });
	      }
	    },
	    validateField: function validateField(prop, cb) {
	      var field = this.fields[prop];
	      if (!field) {
	        throw new Error('must call validateField with valid prop string!');
	      }

	      field.validate('', cb);
	    }
	  }
	};

/***/ },
/* 196 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('form', {
	    staticClass: "el-form",
	    class: [
	      labelPosition ? 'el-form--label-' + labelPosition : '', {
	        'el-form--inline': inline
	      }
	    ]
	  }, [_t("default")])
	}},staticRenderFns: []}

/***/ },
/* 197 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ElFormItem = __webpack_require__(198);

	ElFormItem.install = function (Vue) {
	  Vue.component(ElFormItem.name, ElFormItem);
	};

	module.exports = ElFormItem;

/***/ },
/* 198 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(199)

	/* template */
	var __vue_template__ = __webpack_require__(225)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 199 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _asyncValidator = __webpack_require__(200);

	var _asyncValidator2 = _interopRequireDefault(_asyncValidator);

	var _emitter = __webpack_require__(18);

	var _emitter2 = _interopRequireDefault(_emitter);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  name: 'ElFormItem',

	  componentName: 'form-item',

	  mixins: [_emitter2.default],

	  props: {
	    label: String,
	    labelWidth: String,
	    prop: String,
	    required: Boolean,
	    rules: [Object, Array]
	  },
	  computed: {
	    labelStyle: function labelStyle() {
	      var ret = {};
	      var labelWidth = this.labelWidth || this.form.labelWidth;
	      if (labelWidth) {
	        ret.width = labelWidth;
	      }
	      return ret;
	    },
	    contentStyle: function contentStyle() {
	      var ret = {};
	      var labelWidth = this.labelWidth || this.form.labelWidth;
	      if (labelWidth) {
	        ret.marginLeft = labelWidth;
	      }
	      return ret;
	    },
	    form: function form() {
	      var parent = this.$parent;
	      while (parent.$options.componentName !== 'form') {
	        parent = parent.$parent;
	      }
	      return parent;
	    },

	    fieldValue: {
	      cache: false,
	      get: function get() {
	        var model = this.form.model;
	        if (!model || !this.prop) {
	          return;
	        }

	        var temp = this.prop.split(':');

	        return temp.length > 1 ? model[temp[0]][temp[1]] : model[this.prop];
	      }
	    }
	  },
	  data: function data() {
	    return {
	      valid: true,
	      error: '',
	      validateDisabled: false,
	      validating: false,
	      validator: {},
	      isRequired: false
	    };
	  },

	  methods: {
	    validate: function validate(trigger, cb) {
	      var _this = this;

	      var rules = this.getFilteredRule(trigger);

	      if (!rules || rules.length === 0) {
	        cb && cb();
	        return true;
	      }

	      this.validating = true;

	      var descriptor = {};
	      descriptor[this.prop] = rules;

	      var validator = new _asyncValidator2.default(descriptor);
	      var model = {};

	      model[this.prop] = this.fieldValue;

	      validator.validate(model, { firstFields: true }, function (errors, fields) {
	        _this.valid = !errors;
	        _this.error = errors ? errors[0].message : '';

	        cb && cb(errors);
	        _this.validating = false;
	      });
	    },
	    resetField: function resetField() {
	      this.valid = true;
	      this.error = '';

	      var model = this.form.model;
	      var value = this.fieldValue;

	      if (Array.isArray(value) && value.length > 0) {
	        this.validateDisabled = true;
	        model[this.prop] = [];
	      } else if (typeof value === 'string' && value !== '') {
	        this.validateDisabled = true;
	        model[this.prop] = '';
	      } else if (typeof value === 'number') {
	        this.validateDisabled = true;
	        model[this.prop] = 0;
	      }
	    },
	    getRules: function getRules() {
	      var formRules = this.form.rules;
	      var selfRuels = this.rules;

	      formRules = formRules ? formRules[this.prop] : [];

	      return [].concat(selfRuels || formRules || []);
	    },
	    getFilteredRule: function getFilteredRule(trigger) {
	      var rules = this.getRules();

	      return rules.filter(function (rule) {
	        return !rule.trigger || rule.trigger.indexOf(trigger) !== -1;
	      });
	    },
	    onFieldBlur: function onFieldBlur() {
	      this.validate('blur');
	    },
	    onFieldChange: function onFieldChange() {
	      if (this.validateDisabled) {
	        this.validateDisabled = false;
	        return;
	      }

	      this.validate('change');
	    }
	  },
	  mounted: function mounted() {
	    var _this2 = this;

	    if (this.prop) {
	      this.dispatch('form', 'el.form.addField', [this]);

	      var rules = this.getRules();

	      if (rules.length) {
	        rules.every(function (rule) {
	          if (rule.required) {
	            _this2.isRequired = true;
	            return false;
	          }
	        });
	        this.$on('el.form.blur', this.onFieldBlur);
	        this.$on('el.form.change', this.onFieldChange);
	      }
	    }
	  },
	  beforeDestroy: function beforeDestroy() {
	    this.dispatch('form', 'el.form.removeField', [this]);
	  }
	};

/***/ },
/* 200 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _util = __webpack_require__(201);

	var _validator = __webpack_require__(202);

	var _validator2 = _interopRequireDefault(_validator);

	var _messages2 = __webpack_require__(224);

	var _rule = __webpack_require__(204);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	/**
	 *  Encapsulates a validation schema.
	 *
	 *  @param descriptor An object declaring validation rules
	 *  for this schema.
	 */
	function Schema(descriptor) {
	  this.rules = null;
	  this._messages = _messages2.messages;
	  this.define(descriptor);
	}

	Schema.prototype = {
	  messages: function messages(_messages) {
	    if (_messages) {
	      this._messages = (0, _util.deepMerge)((0, _messages2.newMessages)(), _messages);
	    }
	    return this._messages;
	  },
	  define: function define(rules) {
	    if (!rules) {
	      throw new Error('Cannot configure a schema with no rules');
	    }
	    if ((typeof rules === 'undefined' ? 'undefined' : _typeof(rules)) !== 'object' || Array.isArray(rules)) {
	      throw new Error('Rules must be an object');
	    }
	    this.rules = {};
	    var z = void 0;
	    var item = void 0;
	    for (z in rules) {
	      if (rules.hasOwnProperty(z)) {
	        item = rules[z];
	        this.rules[z] = Array.isArray(item) ? item : [item];
	      }
	    }
	  },
	  validate: function validate(source_) {
	    var _this = this;

	    var o = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	    var oc = arguments[2];

	    var source = source_;
	    var options = o;
	    var callback = oc;
	    if (typeof options === 'function') {
	      callback = options;
	      options = {};
	    }
	    if (!this.rules || Object.keys(this.rules).length === 0) {
	      if (callback) {
	        callback();
	      }
	      return;
	    }
	    function complete(results) {
	      var i = void 0;
	      var field = void 0;
	      var errors = [];
	      var fields = {};

	      function add(e) {
	        if (Array.isArray(e)) {
	          errors = errors.concat.apply(errors, e);
	        } else {
	          errors.push(e);
	        }
	      }

	      for (i = 0; i < results.length; i++) {
	        add(results[i]);
	      }
	      if (!errors.length) {
	        errors = null;
	        fields = null;
	      } else {
	        for (i = 0; i < errors.length; i++) {
	          field = errors[i].field;
	          fields[field] = fields[field] || [];
	          fields[field].push(errors[i]);
	        }
	      }
	      callback(errors, fields);
	    }

	    if (options.messages) {
	      var messages = this.messages();
	      if (messages === _messages2.messages) {
	        messages = (0, _messages2.newMessages)();
	      }
	      (0, _util.deepMerge)(messages, options.messages);
	      options.messages = messages;
	    } else {
	      options.messages = this.messages();
	    }

	    options.error = _rule.error;
	    var arr = void 0;
	    var value = void 0;
	    var series = {};
	    var keys = options.keys || Object.keys(this.rules);
	    keys.forEach(function (z) {
	      arr = _this.rules[z];
	      value = source[z];
	      arr.forEach(function (r) {
	        var rule = r;
	        if (typeof rule.transform === 'function') {
	          if (source === source_) {
	            source = _extends({}, source);
	          }
	          value = source[z] = rule.transform(value);
	        }
	        if (typeof rule === 'function') {
	          rule = {
	            validator: rule
	          };
	        } else {
	          rule = _extends({}, rule);
	        }
	        rule.validator = _this.getValidationMethod(rule);
	        rule.field = z;
	        rule.fullField = rule.fullField || z;
	        rule.type = _this.getType(rule);
	        if (!rule.validator) {
	          return;
	        }
	        series[z] = series[z] || [];
	        series[z].push({
	          rule: rule,
	          value: value,
	          source: source,
	          field: z
	        });
	      });
	    });
	    var errorFields = {};
	    (0, _util.asyncMap)(series, options, function (data, doIt) {
	      var rule = data.rule;
	      var deep = (rule.type === 'object' || rule.type === 'array') && (_typeof(rule.fields) === 'object' || _typeof(rule.defaultField) === 'object');
	      deep = deep && (rule.required || !rule.required && data.value);
	      rule.field = data.field;
	      function addFullfield(key, schema) {
	        return _extends({}, schema, {
	          fullField: rule.fullField + '.' + key
	        });
	      }

	      function cb() {
	        var e = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

	        var errors = e;
	        if (!Array.isArray(errors)) {
	          errors = [errors];
	        }
	        if (errors.length) {
	          (0, _util.warning)('async-validator:', errors);
	        }
	        if (errors.length && rule.message) {
	          errors = [].concat(rule.message);
	        }

	        errors = errors.map((0, _util.complementError)(rule));

	        if ((options.first || options.fieldFirst) && errors.length) {
	          errorFields[rule.field] = 1;
	          return doIt(errors);
	        }
	        if (!deep) {
	          doIt(errors);
	        } else {
	          // if rule is required but the target object
	          // does not exist fail at the rule level and don't
	          // go deeper
	          if (rule.required && !data.value) {
	            if (rule.message) {
	              errors = [].concat(rule.message).map((0, _util.complementError)(rule));
	            } else {
	              errors = [options.error(rule, (0, _util.format)(options.messages.required, rule.field))];
	            }
	            return doIt(errors);
	          }

	          var fieldsSchema = {};
	          if (rule.defaultField) {
	            for (var k in data.value) {
	              if (data.value.hasOwnProperty(k)) {
	                fieldsSchema[k] = rule.defaultField;
	              }
	            }
	          }
	          fieldsSchema = _extends({}, fieldsSchema, data.rule.fields);
	          for (var f in fieldsSchema) {
	            if (fieldsSchema.hasOwnProperty(f)) {
	              var fieldSchema = Array.isArray(fieldsSchema[f]) ? fieldsSchema[f] : [fieldsSchema[f]];
	              fieldsSchema[f] = fieldSchema.map(addFullfield.bind(null, f));
	            }
	          }
	          var schema = new Schema(fieldsSchema);
	          schema.messages(options.messages);
	          if (data.rule.options) {
	            data.rule.options.messages = options.messages;
	            data.rule.options.error = options.error;
	          }
	          schema.validate(data.value, data.rule.options || options, function (errs) {
	            doIt(errs && errs.length ? errors.concat(errs) : errs);
	          });
	        }
	      }

	      rule.validator(rule, data.value, cb, data.source, options);
	    }, function (results) {
	      complete(results);
	    });
	  },
	  getType: function getType(rule) {
	    if (rule.type === undefined && rule.pattern instanceof RegExp) {
	      rule.type = 'pattern';
	    }
	    if (typeof rule.validator !== 'function' && rule.type && !_validator2["default"].hasOwnProperty(rule.type)) {
	      throw new Error((0, _util.format)('Unknown rule type %s', rule.type));
	    }
	    return rule.type || 'string';
	  },
	  getValidationMethod: function getValidationMethod(rule) {
	    if (typeof rule.validator === 'function') {
	      return rule.validator;
	    }
	    var keys = Object.keys(rule);
	    if (keys.length === 1 && keys[0] === 'required') {
	      return _validator2["default"].required;
	    }
	    return _validator2["default"][this.getType(rule)] || false;
	  }
	};

	Schema.register = function register(type, validator) {
	  if (typeof validator !== 'function') {
	    throw new Error('Cannot register a validator by type, validator is not a function');
	  }
	  _validator2["default"][type] = validator;
	};

	Schema.messages = _messages2.messages;

	exports["default"] = Schema;
	module.exports = exports['default'];

/***/ },
/* 201 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	exports.warning = warning;
	exports.format = format;
	exports.isEmptyValue = isEmptyValue;
	exports.isEmptyObject = isEmptyObject;
	exports.asyncMap = asyncMap;
	exports.complementError = complementError;
	exports.deepMerge = deepMerge;
	var formatRegExp = /%[sdj%]/g;

	var warning2 = function warning2() {};

	if (false) {
	  warning2 = function warning2(type, message) {
	    if (typeof console !== 'undefined' && console.warn) {
	      console.warn(type, message);
	    }
	  };
	}

	function warning(type, errors) {
	  // only warn native warning, default type is string, confuses many people...
	  if (errors.every(function (e) {
	    return typeof e === 'string';
	  })) {
	    warning2(type, errors);
	  }
	}

	function format() {
	  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	    args[_key] = arguments[_key];
	  }

	  var i = 1;
	  var f = args[0];
	  var len = args.length;
	  if (typeof f === 'function') {
	    return f.apply(null, args.slice(1));
	  }
	  if (typeof f === 'string') {
	    var str = String(f).replace(formatRegExp, function (x) {
	      if (x === '%%') {
	        return '%';
	      }
	      if (i >= len) {
	        return x;
	      }
	      switch (x) {
	        case '%s':
	          return String(args[i++]);
	        case '%d':
	          return Number(args[i++]);
	        case '%j':
	          try {
	            return JSON.stringify(args[i++]);
	          } catch (_) {
	            return '[Circular]';
	          }
	          break;
	        default:
	          return x;
	      }
	    });
	    for (var arg = args[i]; i < len; arg = args[++i]) {
	      str += ' ' + arg;
	    }
	    return str;
	  }
	  return f;
	}

	function isNativeStringType(type) {
	  return type === 'string' || type === 'url' || type === 'hex' || type === 'email';
	}

	function isEmptyValue(value, type) {
	  if (value === undefined || value === null) {
	    return true;
	  }
	  if (type === 'array' && Array.isArray(value) && !value.length) {
	    return true;
	  }
	  if (isNativeStringType(type) && typeof value === 'string' && !value) {
	    return true;
	  }
	  return false;
	}

	function isEmptyObject(obj) {
	  return Object.keys(obj).length === 0;
	}

	function asyncParallelArray(arr, func, callback) {
	  var results = [];
	  var total = 0;
	  var arrLength = arr.length;

	  function count(errors) {
	    results.push.apply(results, errors);
	    total++;
	    if (total === arrLength) {
	      callback(results);
	    }
	  }

	  arr.forEach(function (a) {
	    func(a, count);
	  });
	}

	function asyncSerialArray(arr, func, callback) {
	  var index = 0;
	  var arrLength = arr.length;

	  function next(errors) {
	    if (errors && errors.length) {
	      callback(errors);
	      return;
	    }
	    var original = index;
	    index = index + 1;
	    if (original < arrLength) {
	      func(arr[original], next);
	    } else {
	      callback([]);
	    }
	  }

	  next([]);
	}

	function flattenObjArr(objArr) {
	  var ret = [];
	  Object.keys(objArr).forEach(function (k) {
	    ret.push.apply(ret, objArr[k]);
	  });
	  return ret;
	}

	function asyncMap(objArr, option, func, callback) {
	  if (option.first) {
	    var flattenArr = flattenObjArr(objArr);
	    return asyncSerialArray(flattenArr, func, callback);
	  }
	  var firstFields = option.firstFields || [];
	  if (firstFields === true) {
	    firstFields = Object.keys(objArr);
	  }
	  var objArrKeys = Object.keys(objArr);
	  var objArrLength = objArrKeys.length;
	  var total = 0;
	  var results = [];
	  var next = function next(errors) {
	    results.push.apply(results, errors);
	    total++;
	    if (total === objArrLength) {
	      callback(results);
	    }
	  };
	  objArrKeys.forEach(function (key) {
	    var arr = objArr[key];
	    if (firstFields.indexOf(key) !== -1) {
	      asyncSerialArray(arr, func, next);
	    } else {
	      asyncParallelArray(arr, func, next);
	    }
	  });
	}

	function complementError(rule) {
	  return function (oe) {
	    if (oe && oe.message) {
	      oe.field = oe.field || rule.fullField;
	      return oe;
	    }
	    return {
	      message: oe,
	      field: oe.field || rule.fullField
	    };
	  };
	}

	function deepMerge(target, source) {
	  if (source) {
	    for (var s in source) {
	      if (source.hasOwnProperty(s)) {
	        var value = source[s];
	        if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && _typeof(target[s]) === 'object') {
	          target[s] = _extends({}, target[s], value);
	        } else {
	          target[s] = value;
	        }
	      }
	    }
	  }
	  return target;
	}

/***/ },
/* 202 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = {
	  string: __webpack_require__(203),
	  method: __webpack_require__(211),
	  number: __webpack_require__(212),
	  "boolean": __webpack_require__(213),
	  regexp: __webpack_require__(214),
	  integer: __webpack_require__(215),
	  "float": __webpack_require__(216),
	  array: __webpack_require__(217),
	  object: __webpack_require__(218),
	  "enum": __webpack_require__(219),
	  pattern: __webpack_require__(220),
	  email: __webpack_require__(221),
	  url: __webpack_require__(221),
	  date: __webpack_require__(222),
	  hex: __webpack_require__(221),
	  required: __webpack_require__(223)
	};

/***/ },
/* 203 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _rule = __webpack_require__(204);

	var _rule2 = _interopRequireDefault(_rule);

	var _util = __webpack_require__(201);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	/**
	 *  Performs validation for string types.
	 *
	 *  @param rule The validation rule.
	 *  @param value The value of the field on the source object.
	 *  @param callback The callback function.
	 *  @param source The source object being validated.
	 *  @param options The validation options.
	 *  @param options.messages The validation messages.
	 */
	function string(rule, value, callback, source, options) {
	  var errors = [];
	  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
	  if (validate) {
	    if ((0, _util.isEmptyValue)(value, 'string') && !rule.required) {
	      return callback();
	    }
	    _rule2["default"].required(rule, value, source, errors, options, 'string');
	    if (!(0, _util.isEmptyValue)(value, 'string')) {
	      _rule2["default"].type(rule, value, source, errors, options);
	      _rule2["default"].range(rule, value, source, errors, options);
	      _rule2["default"].pattern(rule, value, source, errors, options);
	      if (rule.whitespace === true) {
	        _rule2["default"].whitespace(rule, value, source, errors, options);
	      }
	    }
	  }
	  callback(errors);
	}

	exports["default"] = string;
	module.exports = exports['default'];

/***/ },
/* 204 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports["default"] = {
	  required: __webpack_require__(205),
	  whitespace: __webpack_require__(206),
	  type: __webpack_require__(207),
	  range: __webpack_require__(208),
	  "enum": __webpack_require__(209),
	  pattern: __webpack_require__(210)
	};
	module.exports = exports['default'];

/***/ },
/* 205 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _util = __webpack_require__(201);

	var util = _interopRequireWildcard(_util);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

	/**
	 *  Rule for validating required fields.
	 *
	 *  @param rule The validation rule.
	 *  @param value The value of the field on the source object.
	 *  @param source The source object being validated.
	 *  @param errors An array of errors that this rule may add
	 *  validation errors to.
	 *  @param options The validation options.
	 *  @param options.messages The validation messages.
	 */
	function required(rule, value, source, errors, options, type) {
	  if (rule.required && (!source.hasOwnProperty(rule.field) || util.isEmptyValue(value, type))) {
	    errors.push(util.format(options.messages.required, rule.fullField));
	  }
	}

	exports["default"] = required;
	module.exports = exports['default'];

/***/ },
/* 206 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _util = __webpack_require__(201);

	var util = _interopRequireWildcard(_util);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

	/**
	 *  Rule for validating whitespace.
	 *
	 *  @param rule The validation rule.
	 *  @param value The value of the field on the source object.
	 *  @param source The source object being validated.
	 *  @param errors An array of errors that this rule may add
	 *  validation errors to.
	 *  @param options The validation options.
	 *  @param options.messages The validation messages.
	 */
	function whitespace(rule, value, source, errors, options) {
	  if (/^\s+$/.test(value) || value === '') {
	    errors.push(util.format(options.messages.whitespace, rule.fullField));
	  }
	}

	exports["default"] = whitespace;
	module.exports = exports['default'];

/***/ },
/* 207 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _util = __webpack_require__(201);

	var util = _interopRequireWildcard(_util);

	var _required = __webpack_require__(205);

	var _required2 = _interopRequireDefault(_required);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

	/* eslint max-len:0 */

	var pattern = {
	  email: /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,
	  url: new RegExp('^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$', 'i'),
	  hex: /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i
	};

	var types = {
	  integer: function integer(value) {
	    return types.number(value) && parseInt(value, 10) === value;
	  },
	  "float": function float(value) {
	    return types.number(value) && !types.integer(value);
	  },
	  array: function array(value) {
	    return Array.isArray(value);
	  },
	  regexp: function regexp(value) {
	    if (value instanceof RegExp) {
	      return true;
	    }
	    try {
	      return !!new RegExp(value);
	    } catch (e) {
	      return false;
	    }
	  },
	  date: function date(value) {
	    return typeof value.getTime === 'function' && typeof value.getMonth === 'function' && typeof value.getYear === 'function';
	  },
	  number: function number(value) {
	    if (isNaN(value)) {
	      return false;
	    }
	    return typeof value === 'number';
	  },
	  object: function object(value) {
	    return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && !types.array(value);
	  },
	  method: function method(value) {
	    return typeof value === 'function';
	  },
	  email: function email(value) {
	    return typeof value === 'string' && !!value.match(pattern.email);
	  },
	  url: function url(value) {
	    return typeof value === 'string' && !!value.match(pattern.url);
	  },
	  hex: function hex(value) {
	    return typeof value === 'string' && !!value.match(pattern.hex);
	  }
	};

	/**
	 *  Rule for validating the type of a value.
	 *
	 *  @param rule The validation rule.
	 *  @param value The value of the field on the source object.
	 *  @param source The source object being validated.
	 *  @param errors An array of errors that this rule may add
	 *  validation errors to.
	 *  @param options The validation options.
	 *  @param options.messages The validation messages.
	 */
	function type(rule, value, source, errors, options) {
	  if (rule.required && value === undefined) {
	    (0, _required2["default"])(rule, value, source, errors, options);
	    return;
	  }
	  var custom = ['integer', 'float', 'array', 'regexp', 'object', 'method', 'email', 'number', 'date', 'url', 'hex'];
	  var ruleType = rule.type;
	  if (custom.indexOf(ruleType) > -1) {
	    if (!types[ruleType](value)) {
	      errors.push(util.format(options.messages.types[ruleType], rule.fullField, rule.type));
	    }
	    // straight typeof check
	  } else if (ruleType && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== rule.type) {
	      errors.push(util.format(options.messages.types[ruleType], rule.fullField, rule.type));
	    }
	}

	exports["default"] = type;
	module.exports = exports['default'];

/***/ },
/* 208 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _util = __webpack_require__(201);

	var util = _interopRequireWildcard(_util);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

	/**
	 *  Rule for validating minimum and maximum allowed values.
	 *
	 *  @param rule The validation rule.
	 *  @param value The value of the field on the source object.
	 *  @param source The source object being validated.
	 *  @param errors An array of errors that this rule may add
	 *  validation errors to.
	 *  @param options The validation options.
	 *  @param options.messages The validation messages.
	 */
	function range(rule, value, source, errors, options) {
	  var len = typeof rule.len === 'number';
	  var min = typeof rule.min === 'number';
	  var max = typeof rule.max === 'number';
	  var val = value;
	  var key = null;
	  var num = typeof value === 'number';
	  var str = typeof value === 'string';
	  var arr = Array.isArray(value);
	  if (num) {
	    key = 'number';
	  } else if (str) {
	    key = 'string';
	  } else if (arr) {
	    key = 'array';
	  }
	  // if the value is not of a supported type for range validation
	  // the validation rule rule should use the
	  // type property to also test for a particular type
	  if (!key) {
	    return false;
	  }
	  if (str || arr) {
	    val = value.length;
	  }
	  if (len) {
	    if (val !== rule.len) {
	      errors.push(util.format(options.messages[key].len, rule.fullField, rule.len));
	    }
	  } else if (min && !max && val < rule.min) {
	    errors.push(util.format(options.messages[key].min, rule.fullField, rule.min));
	  } else if (max && !min && val > rule.max) {
	    errors.push(util.format(options.messages[key].max, rule.fullField, rule.max));
	  } else if (min && max && (val < rule.min || val > rule.max)) {
	    errors.push(util.format(options.messages[key].range, rule.fullField, rule.min, rule.max));
	  }
	}

	exports["default"] = range;
	module.exports = exports['default'];

/***/ },
/* 209 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _util = __webpack_require__(201);

	var util = _interopRequireWildcard(_util);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

	var ENUM = 'enum';

	/**
	 *  Rule for validating a value exists in an enumerable list.
	 *
	 *  @param rule The validation rule.
	 *  @param value The value of the field on the source object.
	 *  @param source The source object being validated.
	 *  @param errors An array of errors that this rule may add
	 *  validation errors to.
	 *  @param options The validation options.
	 *  @param options.messages The validation messages.
	 */
	function enumerable(rule, value, source, errors, options) {
	  rule[ENUM] = Array.isArray(rule[ENUM]) ? rule[ENUM] : [];
	  if (rule[ENUM].indexOf(value) === -1) {
	    errors.push(util.format(options.messages[ENUM], rule.fullField, rule[ENUM].join(', ')));
	  }
	}

	exports["default"] = enumerable;
	module.exports = exports['default'];

/***/ },
/* 210 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _util = __webpack_require__(201);

	var util = _interopRequireWildcard(_util);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

	/**
	 *  Rule for validating a regular expression pattern.
	 *
	 *  @param rule The validation rule.
	 *  @param value The value of the field on the source object.
	 *  @param source The source object being validated.
	 *  @param errors An array of errors that this rule may add
	 *  validation errors to.
	 *  @param options The validation options.
	 *  @param options.messages The validation messages.
	 */
	function pattern(rule, value, source, errors, options) {
	  if (rule.pattern instanceof RegExp) {
	    if (!rule.pattern.test(value)) {
	      errors.push(util.format(options.messages.pattern.mismatch, rule.fullField, value, rule.pattern));
	    }
	  }
	}

	exports["default"] = pattern;
	module.exports = exports['default'];

/***/ },
/* 211 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _rule = __webpack_require__(204);

	var _rule2 = _interopRequireDefault(_rule);

	var _util = __webpack_require__(201);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	/**
	 *  Validates a function.
	 *
	 *  @param rule The validation rule.
	 *  @param value The value of the field on the source object.
	 *  @param callback The callback function.
	 *  @param source The source object being validated.
	 *  @param options The validation options.
	 *  @param options.messages The validation messages.
	 */
	function method(rule, value, callback, source, options) {
	  var errors = [];
	  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
	  if (validate) {
	    if ((0, _util.isEmptyValue)(value) && !rule.required) {
	      return callback();
	    }
	    _rule2["default"].required(rule, value, source, errors, options);
	    if (value !== undefined) {
	      _rule2["default"].type(rule, value, source, errors, options);
	    }
	  }
	  callback(errors);
	}

	exports["default"] = method;
	module.exports = exports['default'];

/***/ },
/* 212 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _rule = __webpack_require__(204);

	var _rule2 = _interopRequireDefault(_rule);

	var _util = __webpack_require__(201);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	/**
	 *  Validates a number.
	 *
	 *  @param rule The validation rule.
	 *  @param value The value of the field on the source object.
	 *  @param callback The callback function.
	 *  @param source The source object being validated.
	 *  @param options The validation options.
	 *  @param options.messages The validation messages.
	 */
	function number(rule, value, callback, source, options) {
	  var errors = [];
	  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
	  if (validate) {
	    if ((0, _util.isEmptyValue)(value) && !rule.required) {
	      return callback();
	    }
	    _rule2["default"].required(rule, value, source, errors, options);
	    if (value !== undefined) {
	      _rule2["default"].type(rule, value, source, errors, options);
	      _rule2["default"].range(rule, value, source, errors, options);
	    }
	  }
	  callback(errors);
	}

	exports["default"] = number;
	module.exports = exports['default'];

/***/ },
/* 213 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _util = __webpack_require__(201);

	var _rule = __webpack_require__(204);

	var _rule2 = _interopRequireDefault(_rule);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	/**
	 *  Validates a boolean.
	 *
	 *  @param rule The validation rule.
	 *  @param value The value of the field on the source object.
	 *  @param callback The callback function.
	 *  @param source The source object being validated.
	 *  @param options The validation options.
	 *  @param options.messages The validation messages.
	 */
	function boolean(rule, value, callback, source, options) {
	  var errors = [];
	  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
	  if (validate) {
	    if ((0, _util.isEmptyValue)(value) && !rule.required) {
	      return callback();
	    }
	    _rule2["default"].required(rule, value, source, errors, options);
	    if (value !== undefined) {
	      _rule2["default"].type(rule, value, source, errors, options);
	    }
	  }
	  callback(errors);
	}

	exports["default"] = boolean;
	module.exports = exports['default'];

/***/ },
/* 214 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _rule = __webpack_require__(204);

	var _rule2 = _interopRequireDefault(_rule);

	var _util = __webpack_require__(201);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	/**
	 *  Validates the regular expression type.
	 *
	 *  @param rule The validation rule.
	 *  @param value The value of the field on the source object.
	 *  @param callback The callback function.
	 *  @param source The source object being validated.
	 *  @param options The validation options.
	 *  @param options.messages The validation messages.
	 */
	function regexp(rule, value, callback, source, options) {
	  var errors = [];
	  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
	  if (validate) {
	    if ((0, _util.isEmptyValue)(value) && !rule.required) {
	      return callback();
	    }
	    _rule2["default"].required(rule, value, source, errors, options);
	    if (!(0, _util.isEmptyValue)(value)) {
	      _rule2["default"].type(rule, value, source, errors, options);
	    }
	  }
	  callback(errors);
	}

	exports["default"] = regexp;
	module.exports = exports['default'];

/***/ },
/* 215 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _rule = __webpack_require__(204);

	var _rule2 = _interopRequireDefault(_rule);

	var _util = __webpack_require__(201);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	/**
	 *  Validates a number is an integer.
	 *
	 *  @param rule The validation rule.
	 *  @param value The value of the field on the source object.
	 *  @param callback The callback function.
	 *  @param source The source object being validated.
	 *  @param options The validation options.
	 *  @param options.messages The validation messages.
	 */
	function integer(rule, value, callback, source, options) {
	  var errors = [];
	  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
	  if (validate) {
	    if ((0, _util.isEmptyValue)(value) && !rule.required) {
	      return callback();
	    }
	    _rule2["default"].required(rule, value, source, errors, options);
	    if (value !== undefined) {
	      _rule2["default"].type(rule, value, source, errors, options);
	      _rule2["default"].range(rule, value, source, errors, options);
	    }
	  }
	  callback(errors);
	}

	exports["default"] = integer;
	module.exports = exports['default'];

/***/ },
/* 216 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _rule = __webpack_require__(204);

	var _rule2 = _interopRequireDefault(_rule);

	var _util = __webpack_require__(201);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	/**
	 *  Validates a number is a floating point number.
	 *
	 *  @param rule The validation rule.
	 *  @param value The value of the field on the source object.
	 *  @param callback The callback function.
	 *  @param source The source object being validated.
	 *  @param options The validation options.
	 *  @param options.messages The validation messages.
	 */
	function floatFn(rule, value, callback, source, options) {
	  var errors = [];
	  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
	  if (validate) {
	    if ((0, _util.isEmptyValue)(value) && !rule.required) {
	      return callback();
	    }
	    _rule2["default"].required(rule, value, source, errors, options);
	    if (value !== undefined) {
	      _rule2["default"].type(rule, value, source, errors, options);
	      _rule2["default"].range(rule, value, source, errors, options);
	    }
	  }
	  callback(errors);
	}

	exports["default"] = floatFn;
	module.exports = exports['default'];

/***/ },
/* 217 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _rule = __webpack_require__(204);

	var _rule2 = _interopRequireDefault(_rule);

	var _util = __webpack_require__(201);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	/**
	 *  Validates an array.
	 *
	 *  @param rule The validation rule.
	 *  @param value The value of the field on the source object.
	 *  @param callback The callback function.
	 *  @param source The source object being validated.
	 *  @param options The validation options.
	 *  @param options.messages The validation messages.
	 */
	function array(rule, value, callback, source, options) {
	  var errors = [];
	  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
	  if (validate) {
	    if ((0, _util.isEmptyValue)(value, 'array') && !rule.required) {
	      return callback();
	    }
	    _rule2["default"].required(rule, value, source, errors, options, 'array');
	    if (!(0, _util.isEmptyValue)(value, 'array')) {
	      _rule2["default"].type(rule, value, source, errors, options);
	      _rule2["default"].range(rule, value, source, errors, options);
	    }
	  }
	  callback(errors);
	}

	exports["default"] = array;
	module.exports = exports['default'];

/***/ },
/* 218 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _rule = __webpack_require__(204);

	var _rule2 = _interopRequireDefault(_rule);

	var _util = __webpack_require__(201);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	/**
	 *  Validates an object.
	 *
	 *  @param rule The validation rule.
	 *  @param value The value of the field on the source object.
	 *  @param callback The callback function.
	 *  @param source The source object being validated.
	 *  @param options The validation options.
	 *  @param options.messages The validation messages.
	 */
	function object(rule, value, callback, source, options) {
	  var errors = [];
	  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
	  if (validate) {
	    if ((0, _util.isEmptyValue)(value) && !rule.required) {
	      return callback();
	    }
	    _rule2["default"].required(rule, value, source, errors, options);
	    if (value !== undefined) {
	      _rule2["default"].type(rule, value, source, errors, options);
	    }
	  }
	  callback(errors);
	}

	exports["default"] = object;
	module.exports = exports['default'];

/***/ },
/* 219 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _rule = __webpack_require__(204);

	var _rule2 = _interopRequireDefault(_rule);

	var _util = __webpack_require__(201);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var ENUM = 'enum';

	/**
	 *  Validates an enumerable list.
	 *
	 *  @param rule The validation rule.
	 *  @param value The value of the field on the source object.
	 *  @param callback The callback function.
	 *  @param source The source object being validated.
	 *  @param options The validation options.
	 *  @param options.messages The validation messages.
	 */
	function enumerable(rule, value, callback, source, options) {
	  var errors = [];
	  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
	  if (validate) {
	    if ((0, _util.isEmptyValue)(value) && !rule.required) {
	      return callback();
	    }
	    _rule2["default"].required(rule, value, source, errors, options);
	    if (value) {
	      _rule2["default"][ENUM](rule, value, source, errors, options);
	    }
	  }
	  callback(errors);
	}

	exports["default"] = enumerable;
	module.exports = exports['default'];

/***/ },
/* 220 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _rule = __webpack_require__(204);

	var _rule2 = _interopRequireDefault(_rule);

	var _util = __webpack_require__(201);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	/**
	 *  Validates a regular expression pattern.
	 *
	 *  Performs validation when a rule only contains
	 *  a pattern property but is not declared as a string type.
	 *
	 *  @param rule The validation rule.
	 *  @param value The value of the field on the source object.
	 *  @param callback The callback function.
	 *  @param source The source object being validated.
	 *  @param options The validation options.
	 *  @param options.messages The validation messages.
	 */
	function pattern(rule, value, callback, source, options) {
	  var errors = [];
	  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
	  if (validate) {
	    if ((0, _util.isEmptyValue)(value, 'string') && !rule.required) {
	      return callback();
	    }
	    _rule2["default"].required(rule, value, source, errors, options);
	    if (!(0, _util.isEmptyValue)(value, 'string')) {
	      _rule2["default"].pattern(rule, value, source, errors, options);
	    }
	  }
	  callback(errors);
	}

	exports["default"] = pattern;
	module.exports = exports['default'];

/***/ },
/* 221 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _rule = __webpack_require__(204);

	var _rule2 = _interopRequireDefault(_rule);

	var _util = __webpack_require__(201);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function type(rule, value, callback, source, options) {
	  var ruleType = rule.type;
	  var errors = [];
	  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
	  if (validate) {
	    if ((0, _util.isEmptyValue)(value, ruleType) && !rule.required) {
	      return callback();
	    }
	    _rule2["default"].required(rule, value, source, errors, options, ruleType);
	    if (!(0, _util.isEmptyValue)(value, ruleType)) {
	      _rule2["default"].type(rule, value, source, errors, options);
	    }
	  }
	  callback(errors);
	}

	exports["default"] = type;
	module.exports = exports['default'];

/***/ },
/* 222 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _rule = __webpack_require__(204);

	var _rule2 = _interopRequireDefault(_rule);

	var _util = __webpack_require__(201);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function date(rule, value, callback, source, options) {
	  // console.log('integer rule called %j', rule);
	  var errors = [];
	  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
	  // console.log('validate on %s value', value);
	  if (validate) {
	    if ((0, _util.isEmptyValue)(value) && !rule.required) {
	      return callback();
	    }
	    _rule2["default"].required(rule, value, source, errors, options);
	    if (!(0, _util.isEmptyValue)(value)) {
	      _rule2["default"].type(rule, value, source, errors, options);
	      if (value) {
	        _rule2["default"].range(rule, value.getTime(), source, errors, options);
	      }
	    }
	  }
	  callback(errors);
	}

	exports["default"] = date;
	module.exports = exports['default'];

/***/ },
/* 223 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _rule = __webpack_require__(204);

	var _rule2 = _interopRequireDefault(_rule);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function required(rule, value, callback, source, options) {
	  var errors = [];
	  var type = Array.isArray(value) ? 'array' : typeof value === 'undefined' ? 'undefined' : _typeof(value);
	  _rule2["default"].required(rule, value, source, errors, options, type);
	  callback(errors);
	}

	exports["default"] = required;
	module.exports = exports['default'];

/***/ },
/* 224 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.newMessages = newMessages;
	function newMessages() {
	  return {
	    "default": 'Validation error on field %s',
	    required: '%s is required',
	    "enum": '%s must be one of %s',
	    whitespace: '%s cannot be empty',
	    date: {
	      format: '%s date %s is invalid for format %s',
	      parse: '%s date could not be parsed, %s is invalid ',
	      invalid: '%s date %s is invalid'
	    },
	    types: {
	      string: '%s is not a %s',
	      method: '%s is not a %s (function)',
	      array: '%s is not an %s',
	      object: '%s is not an %s',
	      number: '%s is not a %s',
	      date: '%s is not a %s',
	      "boolean": '%s is not a %s',
	      integer: '%s is not an %s',
	      "float": '%s is not a %s',
	      regexp: '%s is not a valid %s',
	      email: '%s is not a valid %s',
	      url: '%s is not a valid %s',
	      hex: '%s is not a valid %s'
	    },
	    string: {
	      len: '%s must be exactly %s characters',
	      min: '%s must be at least %s characters',
	      max: '%s cannot be longer than %s characters',
	      range: '%s must be between %s and %s characters'
	    },
	    number: {
	      len: '%s must equal %s',
	      min: '%s cannot be less than %s',
	      max: '%s cannot be greater than %s',
	      range: '%s must be between %s and %s'
	    },
	    array: {
	      len: '%s must be exactly %s in length',
	      min: '%s cannot be less than %s in length',
	      max: '%s cannot be greater than %s in length',
	      range: '%s must be between %s and %s in length'
	    },
	    pattern: {
	      mismatch: '%s value %s does not match pattern %s'
	    },
	    clone: function clone() {
	      var cloned = JSON.parse(JSON.stringify(this));
	      cloned.clone = this.clone;
	      return cloned;
	    }
	  };
	}

	var messages = exports.messages = newMessages();

/***/ },
/* 225 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('div', {
	    staticClass: "el-form-item",
	    class: {
	      'is-error': error !== '',
	        'is-validating': validating,
	        'is-required': isRequired || required
	    }
	  }, [(label) ? _h('label', {
	    staticClass: "el-form-item__label",
	    style: (labelStyle)
	  }, ["\n    " + _s(label + form.labelSuffix) + "\n  "]) : _e(), " ", _h('div', {
	    staticClass: "el-form-item__content",
	    style: (contentStyle)
	  }, [_t("default"), " ", _h('transition', {
	    attrs: {
	      "name": "md-fade-bottom"
	    }
	  }, [(error !== '') ? _h('div', {
	    staticClass: "el-form-item__error"
	  }, [_s(error)]) : _e()])])])
	}},staticRenderFns: []}

/***/ },
/* 226 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ElTabs = __webpack_require__(227);
	var ElTabPane = __webpack_require__(233);

	ElTabs.install = function (Vue) {
	  Vue.component(ElTabs.name, ElTabs);
	  Vue.component(ElTabPane.name, ElTabPane);
	};

	module.exports = ElTabs;

/***/ },
/* 227 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(228)

	/* template */
	var __vue_template__ = __webpack_require__(232)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 228 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _tab = __webpack_require__(229);

	var _tab2 = _interopRequireDefault(_tab);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	module.exports = {
	  name: 'el-tabs',

	  components: {
	    ElTab: _tab2.default
	  },

	  props: {
	    type: String,
	    tabPosition: String,
	    activeName: String,
	    closable: false,
	    tabWidth: 0
	  },

	  data: function data() {
	    return {
	      tabs: [],
	      children: null,
	      activeTab: null,
	      currentName: 0,
	      barStyle: ''
	    };
	  },


	  watch: {
	    activeName: {
	      handler: function handler(val) {
	        this.currentName = val;
	      }
	    },

	    'currentName': function currentName() {
	      this.calcBarStyle();
	    }
	  },

	  methods: {
	    handleTabRemove: function handleTabRemove(tab, ev) {
	      ev.stopPropagation();
	      tab.$destroy(true);

	      var index = this.tabs.indexOf(tab);

	      if (index !== -1) {
	        this.tabs.splice(index, 1);
	      }

	      if (tab.key === this.currentName) {
	        var nextChild = this.tabs[index];
	        var prevChild = this.tabs[index - 1];

	        this.currentName = nextChild ? nextChild.key : prevChild ? prevChild.key : '-1';
	      }
	      this.$emit('tab-remove', tab.key);
	    },
	    handleTabClick: function handleTabClick(tab, event) {
	      this.currentName = tab.key;
	      this.$emit('tab-click', tab.key, event);
	    },
	    calcBarStyle: function calcBarStyle(firstRendering) {
	      var _this = this;

	      if (this.type || !this.$refs.tabs) return {};
	      var style = {};
	      var offset = 0;
	      var tabWidth = 0;

	      this.tabs.every(function (tab, index) {
	        var $el = _this.$refs.tabs[index].$el;
	        if (tab.key !== _this.currentName) {
	          offset += $el.clientWidth;
	          return true;
	        } else {
	          tabWidth = $el.clientWidth;
	          return false;
	        }
	      });

	      style.width = tabWidth + 'px';
	      style.transform = 'translateX(' + offset + 'px)';

	      if (!firstRendering) {
	        style.transition = 'transform .3s cubic-bezier(.645,.045,.355,1), -webkit-transform .3s cubic-bezier(.645,.045,.355,1)';
	      }
	      this.barStyle = style;
	    }
	  },
	  mounted: function mounted() {
	    var _this2 = this;

	    var fisrtKey = this.$children[0].key || '1';
	    this.currentName = this.activeName || fisrtKey;
	    this.$children.forEach(function (tab) {
	      return _this2.tabs.push(tab);
	    });
	    this.$nextTick(function () {
	      return _this2.calcBarStyle(true);
	    });
	  }
	};

/***/ },
/* 229 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(230)

	/* template */
	var __vue_template__ = __webpack_require__(231)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 230 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  name: 'el-tab',

	  props: {
	    tab: {
	      type: Object,
	      required: true
	    },
	    closable: Boolean
	  }
	};

/***/ },
/* 231 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('div', {
	    staticClass: "el-tabs__item",
	    class: {
	      'is-active': $parent.currentName === tab.key,
	        'is-disabled': tab.disabled,
	        'is-closable': closable
	    }
	  }, ["\n  " + _s(tab.label) + "\n  ", (closable) ? _h('span', {
	    staticClass: "el-icon-close",
	    on: {
	      "click": function($event) {
	        $emit('remove', tab, $event)
	      }
	    }
	  }) : _e()])
	}},staticRenderFns: []}

/***/ },
/* 232 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('div', {
	    staticClass: "el-tabs",
	    class: [type ? 'el-tabs--' + type : '']
	  }, [_h('div', {
	    staticClass: "el-tabs__header"
	  }, [_l((tabs), function(tab) {
	    return _h('el-tab', {
	      ref: "tabs",
	      refInFor: true,
	      attrs: {
	        "tab": tab,
	        "closable": closable
	      },
	      on: {
	        "remove": handleTabRemove
	      },
	      nativeOn: {
	        "click": function($event) {
	          handleTabClick(tab, $event)
	        }
	      }
	    })
	  }), " ", (!this.type && tabs.length > 0) ? _h('div', {
	    staticClass: "el-tabs__active-bar",
	    style: (barStyle)
	  }) : _e()]), " ", _h('div', {
	    staticClass: "el-tabs__content"
	  }, [_t("default")])])
	}},staticRenderFns: []}

/***/ },
/* 233 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(234)

	/* template */
	var __vue_template__ = __webpack_require__(235)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 234 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  name: 'el-tab-pane',

	  props: {
	    label: {
	      type: String,
	      required: true
	    },
	    name: String
	  },

	  data: function data() {
	    return {
	      counter: 0,
	      transition: '',
	      paneStyle: {
	        position: 'relative'
	      },
	      key: ''
	    };
	  },
	  created: function created() {
	    if (!this.key) {
	      this.key = this.$parent.$children.indexOf(this) + 1 + '';
	    }
	  },


	  computed: {
	    show: function show() {
	      return this.$parent.currentName === this.key;
	    }
	  },

	  destroyed: function destroyed() {
	    this.$el.remove();
	  },


	  watch: {
	    name: {
	      immediate: true,
	      handler: function handler(val) {
	        this.key = val;
	      }
	    },
	    '$parent.currentName': function $parentCurrentName(newValue, oldValue) {
	      if (this.key === newValue) {
	        this.transition = newValue > oldValue ? 'slideInRight' : 'slideInLeft';
	      }
	      if (this.key === oldValue) {
	        this.transition = oldValue > newValue ? 'slideInRight' : 'slideInLeft';
	      }
	    }
	  }
	};

/***/ },
/* 235 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('div', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (show && $slots.default),
	      expression: "show && $slots.default"
	    }],
	    staticClass: "el-tab-pane"
	  }, [_t("default")])
	}},staticRenderFns: []}

/***/ },
/* 236 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var TabPane = __webpack_require__(233);

	TabPane.install = function (Vue) {
	  Vue.component(TabPane.name, TabPane);
	};

	module.exports = TabPane;

/***/ },
/* 237 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Tree = __webpack_require__(238);

	Tree.install = function (Vue) {
	  Vue.component(Tree.name, Tree);
	};

	module.exports = Tree;

/***/ },
/* 238 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(239)

	/* template */
	var __vue_template__ = __webpack_require__(246)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 239 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _tree = __webpack_require__(240);

	var _tree2 = _interopRequireDefault(_tree);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  name: 'el-tree',

	  props: {
	    data: {
	      type: Array
	    },
	    showCheckbox: {
	      type: Boolean,
	      default: false
	    },
	    props: {
	      default: function _default() {
	        return {
	          children: 'children',
	          label: 'label',
	          icon: 'icon'
	        };
	      }
	    },
	    lazy: {
	      type: Boolean,
	      default: false
	    },
	    load: {
	      type: Function
	    }
	  },

	  created: function created() {
	    this.$isTree = true;

	    this.tree = new _tree2.default({
	      data: this.data,
	      lazy: this.lazy,
	      props: this.props,
	      load: this.load
	    });
	  },
	  data: function data() {
	    return {
	      tree: {}
	    };
	  },


	  components: {
	    ElTreeNode: __webpack_require__(242)
	  },

	  computed: {
	    children: {
	      set: function set(value) {
	        this.data = value;
	      },
	      get: function get() {
	        return this.data;
	      }
	    }
	  },

	  watch: {
	    data: function data(newVal) {
	      this.tree.root.setData(newVal);
	    }
	  },

	  methods: {
	    getCheckedNodes: function getCheckedNodes(leafOnly) {
	      return this.tree.getCheckedNodes(leafOnly);
	    }
	  }
	};

/***/ },
/* 240 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _node = __webpack_require__(241);

	var _node2 = _interopRequireDefault(_node);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Tree = function () {
	  function Tree(options) {
	    var _this = this;

	    _classCallCheck(this, Tree);

	    for (var option in options) {
	      if (options.hasOwnProperty(option)) {
	        this[option] = options[option];
	      }
	    }

	    this._isTree = true;

	    this.root = new _node2.default({
	      data: this.data,
	      lazy: this.lazy,
	      props: this.props,
	      load: this.load
	    });

	    if (this.lazy && this.load) {
	      var loadFn = this.load;
	      loadFn(this.root, function (data) {
	        _this.root.doCreateChildren(data);
	      });
	    }
	  }

	  Tree.prototype.getCheckedNodes = function getCheckedNodes(leafOnly) {
	    var checkedNodes = [];
	    var walk = function walk(node) {
	      var children = node.root ? node.root.children : node.children;

	      children.forEach(function (child) {
	        if (!leafOnly && child.checked || leafOnly && child.isLeaf && child.checked) {
	          checkedNodes.push(child.data);
	        }

	        walk(child);
	      });
	    };

	    walk(this);

	    return checkedNodes;
	  };

	  return Tree;
	}();

	exports.default = Tree;
	;

/***/ },
/* 241 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _objectAssign = __webpack_require__(122);

	var _objectAssign2 = _interopRequireDefault(_objectAssign);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var idSeed = 0;


	var reInitChecked = function reInitChecked(node) {
	  var siblings = node.children;

	  var all = true;
	  var none = true;

	  for (var i = 0, j = siblings.length; i < j; i++) {
	    var sibling = siblings[i];
	    if (sibling.checked !== true || sibling.indeterminate) {
	      all = false;
	    }
	    if (sibling.checked !== false || sibling.indeterminate) {
	      none = false;
	    }
	  }

	  if (all) {
	    node.setChecked(true);
	  } else if (!all && !none) {
	    node.setChecked('half');
	  } else if (none) {
	    node.setChecked(false);
	  }
	};

	var getPropertyFromData = function getPropertyFromData(node, prop) {
	  var props = node.props;
	  var data = node.data || {};
	  var config = props[prop];

	  if (typeof config === 'function') {
	    return config(data, node);
	  } else if (typeof config === 'string') {
	    return data[config];
	  } else if (typeof config === 'undefined') {
	    return '';
	  }
	};

	var Node = function () {
	  function Node(options) {
	    _classCallCheck(this, Node);

	    this.id = idSeed++;
	    this.text = null;
	    this.checked = false;
	    this.indeterminate = false;
	    this.data = null;
	    this.expanded = false;
	    this.props = null;
	    this.parent = null;
	    this.lazy = false;

	    for (var name in options) {
	      if (options.hasOwnProperty(name)) {
	        this[name] = options[name];
	      }
	    }

	    this.level = -1;
	    this.loaded = false;
	    this.children = [];
	    this.loading = false;

	    if (this.parent) {
	      this.level = this.parent.level + 1;
	    }

	    if (this.lazy !== true && this.data) {
	      this.setData(this.data);
	    }
	  }

	  Node.prototype.setData = function setData(data) {
	    this.data = data;
	    this.children = [];

	    var children = void 0;
	    if (this.level === -1 && this.data instanceof Array) {
	      children = this.data;
	    } else {
	      children = getPropertyFromData(this, 'children') || [];
	    }

	    for (var i = 0, j = children.length; i < j; i++) {
	      var child = children[i];
	      this.insertChild(new Node({
	        data: child,
	        parent: this,
	        lazy: this.lazy,
	        load: this.load,
	        props: this.props
	      }));
	    }
	  };

	  Node.prototype.insertChild = function insertChild(child, index) {
	    if (!child) throw new Error('insertChild error: child is required.');

	    if (!child instanceof Node) {
	      throw new Error('insertChild error: child should an instance of Node.');
	    }

	    child.parent = this;
	    child.level = this.level + 1;

	    if (typeof index === 'undefined') {
	      this.children.push(child);
	    } else {
	      this.children.splice(index, 0, child);
	    }
	  };

	  Node.prototype.removeChild = function removeChild(child) {
	    var index = this.children.indexOf(child);

	    if (index > -1) {
	      child.parent = null;
	      this.children.splice(child, index);
	    }
	  };

	  Node.prototype.expand = function expand(callback) {
	    if (this.shouldLoadData()) {
	      this.loadData(function (data) {
	        if (data instanceof Array) {
	          callback();
	        }
	      });
	    } else {
	      this.expanded = true;
	      if (callback) {
	        callback();
	      }
	    }
	  };

	  Node.prototype.doCreateChildren = function doCreateChildren(array) {
	    var _this = this;

	    var defaultProps = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	    array.forEach(function (item) {
	      var node = new Node((0, _objectAssign2.default)({
	        data: item,
	        lazy: _this.lazy,
	        load: _this.load,
	        props: _this.props
	      }, defaultProps));
	      _this.insertChild(node);
	    });
	  };

	  Node.prototype.collapse = function collapse() {
	    this.expanded = false;
	  };

	  Node.prototype.shouldLoadData = function shouldLoadData() {
	    return this.lazy === true && this.load && !this.loaded;
	  };

	  Node.prototype.hasChild = function hasChild() {
	    var children = this.children;
	    if (!this.lazy || this.lazy === true && this.loaded === true) {
	      return children && children.length > 0;
	    }
	    return true;
	  };

	  Node.prototype.setChecked = function setChecked(value, deep) {
	    var _this2 = this;

	    this.indeterminate = value === 'half';
	    this.checked = value === true;

	    var handleDeep = function handleDeep() {
	      if (deep) {
	        var children = _this2.children;
	        for (var i = 0, j = children.length; i < j; i++) {
	          var child = children[i];
	          child.setChecked(value !== false, deep);
	        }
	      }
	    };

	    if (this.shouldLoadData()) {
	      this.loadData(function () {
	        handleDeep();
	      }, {
	        checked: value !== false
	      });
	    } else {
	      handleDeep();
	    }

	    var parent = this.parent;
	    if (parent.level === -1) return;

	    reInitChecked(parent);
	  };

	  Node.prototype.getChildren = function getChildren() {
	    var data = this.data;
	    if (!data) return null;

	    var props = this.props;
	    var children = 'children';
	    if (props) {
	      children = props.children || 'children';
	    }

	    if (data[children] === undefined) {
	      data[children] = null;
	    }

	    return data[children];
	  };

	  Node.prototype.loadData = function loadData(callback) {
	    var _this3 = this;

	    var defaultProps = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	    if (this.lazy === true && this.load && !this.loaded) {
	      this.loading = true;

	      var loadFn = this.load;
	      var resolve = function resolve(children) {
	        _this3.loaded = true;
	        _this3.loading = false;
	        _this3.children = [];

	        _this3.doCreateChildren(children, defaultProps);

	        if (callback) {
	          callback.call(_this3, children);
	        }
	      };

	      loadFn(this, resolve);
	    } else {
	      if (callback) {
	        callback.call(this);
	      }
	    }
	  };

	  _createClass(Node, [{
	    key: 'label',
	    get: function get() {
	      return getPropertyFromData(this, 'label');
	    }
	  }, {
	    key: 'icon',
	    get: function get() {
	      return getPropertyFromData(this, 'icon');
	    }
	  }, {
	    key: 'isLeaf',
	    get: function get() {
	      return !this.hasChild();
	    }
	  }]);

	  return Node;
	}();

	exports.default = Node;

/***/ },
/* 242 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(243)

	/* template */
	var __vue_template__ = __webpack_require__(245)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 243 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _transition = __webpack_require__(244);

	var _transition2 = _interopRequireDefault(_transition);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  name: 'el-tree-node',

	  props: {
	    node: {
	      default: function _default() {
	        return {};
	      }
	    }
	  },

	  components: {
	    CollapseTransition: _transition2.default
	  },

	  data: function data() {
	    return {
	      $tree: null,
	      expanded: false,
	      childrenRendered: false,
	      showCheckbox: false,
	      oldChecked: null,
	      oldIndeterminate: null
	    };
	  },


	  watch: {
	    'node.indeterminate': function nodeIndeterminate(val) {
	      this.handleSelectChange(this.node.checked, val);
	    },
	    'node.checked': function nodeChecked(val) {
	      this.handleSelectChange(val, this.node.indeterminate);
	    }
	  },

	  methods: {
	    handleSelectChange: function handleSelectChange(checked, indeterminate) {
	      if (this.oldChecked !== checked && this.oldIndeterminate !== indeterminate) {
	        this.$tree.$emit('check-change', this.node.data, checked, indeterminate);
	      }
	      this.oldChecked = checked;
	      this.indeterminate = indeterminate;
	    },
	    handleExpandIconClick: function handleExpandIconClick(event) {
	      var _this = this;

	      var target = event.target;
	      if (target.tagName.toUpperCase() !== 'DIV' && target.parentNode.nodeName.toUpperCase() !== 'DIV' || target.nodeName.toUpperCase() === 'LABLE') return;
	      if (this.expanded) {
	        this.node.collapse();
	        this.expanded = false;
	      } else {
	        this.node.expand(function () {
	          _this.expanded = true;
	          _this.childrenRendered = true;
	        });
	      }
	      this.$tree.$emit('node-click', this.node.data);
	    },
	    handleUserClick: function handleUserClick() {
	      if (this.node.indeterminate) {
	        this.node.setChecked(this.node.checked, true);
	      }
	    },
	    handleCheckChange: function handleCheckChange(ev) {
	      if (!this.node.indeterminate) {
	        this.node.setChecked(ev.target.checked, true);
	      }
	    }
	  },

	  created: function created() {
	    var parent = this.$parent;

	    if (parent.$isTree) {
	      this.$tree = parent;
	    } else {
	      this.$tree = parent.$tree;
	    }

	    var tree = this.$tree;

	    if (!tree) {
	      console.warn('Can not find node\'s tree.');
	    }

	    this.showCheckbox = tree.showCheckbox;
	  }
	};

/***/ },
/* 244 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Transition = function () {
	  function Transition() {
	    _classCallCheck(this, Transition);
	  }

	  Transition.prototype.beforeEnter = function beforeEnter(el) {
	    el.dataset.oldPaddingTop = el.style.paddingTop;
	    el.dataset.oldPaddingBottom = el.style.paddingBottom;
	    el.style.height = '0';
	    el.style.paddingTop = 0;
	    el.style.paddingBottom = 0;
	  };

	  Transition.prototype.enter = function enter(el) {
	    el.dataset.oldOverflow = el.style.overflow;

	    el.style.display = 'block';
	    if (el.scrollHeight !== 0) {
	      el.style.height = el.scrollHeight + 'px';
	      el.style.paddingTop = el.dataset.oldPaddingTop;
	      el.style.paddingBottom = el.dataset.oldPaddingBottom;
	    } else {
	      el.style.height = '';
	      el.style.paddingTop = el.dataset.oldPaddingTop;
	      el.style.paddingBottom = el.dataset.oldPaddingBottom;
	    }

	    el.style.overflow = 'hidden';
	  };

	  Transition.prototype.afterEnter = function afterEnter(el) {
	    el.style.display = '';
	    el.style.height = '';
	    el.style.overflow = el.dataset.oldOverflow;
	  };

	  Transition.prototype.beforeLeave = function beforeLeave(el) {
	    el.dataset.oldPaddingTop = el.style.paddingTop;
	    el.dataset.oldPaddingBottom = el.style.paddingBottom;
	    el.dataset.oldOverflow = el.style.overflow;

	    el.style.display = 'block';
	    if (el.scrollHeight !== 0) {
	      el.style.height = el.scrollHeight + 'px';
	    }
	    el.style.overflow = 'hidden';
	  };

	  Transition.prototype.leave = function leave(el) {
	    if (el.scrollHeight !== 0) {
	      setTimeout(function () {
	        el.style.height = 0;
	        el.style.paddingTop = 0;
	        el.style.paddingBottom = 0;
	      });
	    }
	  };

	  Transition.prototype.afterLeave = function afterLeave(el) {
	    el.style.display = el.style.height = '';
	    el.style.overflow = el.dataset.oldOverflow;
	    el.style.paddingTop = el.dataset.oldPaddingTop;
	    el.style.paddingBottom = el.dataset.oldPaddingBottom;
	  };

	  return Transition;
	}();

	;

	exports.default = {
	  functional: true,
	  render: function render(h, _ref) {
	    var children = _ref.children;

	    var data = {
	      on: new Transition()
	    };

	    children = children.map(function (item) {
	      item.data.class = ['collapse-transition'];
	      return item;
	    });

	    return h('transition', data, children);
	  }
	};

/***/ },
/* 245 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('div', {
	    staticClass: "el-tree-node",
	    class: {
	      expanded: childrenRendered && expanded
	    }
	  }, [_h('div', {
	    staticClass: "el-tree-node__content",
	    style: ({
	      'padding-left': node.level * 16 + 'px'
	    }),
	    on: {
	      "click": handleExpandIconClick
	    }
	  }, [_h('span', {
	    staticClass: "el-tree-node__expand-icon",
	    class: {
	      'is-leaf': node.isLeaf, expanded: !node.isLeaf && expanded
	    }
	  }), " ", (showCheckbox) ? _h('el-checkbox', {
	    directives: [{
	      name: "model",
	      rawName: "v-model",
	      value: (node.checked),
	      expression: "node.checked"
	    }],
	    attrs: {
	      "indeterminate": node.indeterminate
	    },
	    domProps: {
	      "value": (node.checked)
	    },
	    on: {
	      "change": handleCheckChange,
	      "input": function($event) {
	        node.checked = $event
	      }
	    },
	    nativeOn: {
	      "click": function($event) {
	        handleUserClick($event)
	      }
	    }
	  }) : _e(), " ", (node.loading) ? _h('span', {
	    staticClass: "el-tree-node__icon el-icon-loading"
	  }) : _e(), " ", _h('span', {
	    staticClass: "el-tree-node__label",
	    domProps: {
	      "innerHTML": _s(node.label)
	    }
	  })]), " ", _h('collapse-transition', [_h('div', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (expanded),
	      expression: "expanded"
	    }],
	    staticClass: "el-tree-node__children"
	  }, [_l((node.children), function(child) {
	    return _h('el-tree-node', {
	      attrs: {
	        "node": child
	      }
	    })
	  })])])])
	}},staticRenderFns: []}

/***/ },
/* 246 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('div', {
	    staticClass: "el-tree"
	  }, [_l((tree.root.children), function(child) {
	    return _h('el-tree-node', {
	      attrs: {
	        "node": child
	      }
	    })
	  })])
	}},staticRenderFns: []}

/***/ },
/* 247 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Alert = __webpack_require__(248);

	Alert.install = function (Vue) {
	  Vue.component(Alert.name, Alert);
	};

	module.exports = Alert;

/***/ },
/* 248 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(249)

	/* template */
	var __vue_template__ = __webpack_require__(250)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 249 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;


	var TYPE_CLASSES_MAP = {
	  'success': 'el-icon-circle-check',
	  'warning': 'el-icon-warning',
	  'error': 'el-icon-circle-cross'
	};
	exports.default = {
	  name: 'el-alert',

	  props: {
	    title: {
	      type: String,
	      default: '',
	      required: true
	    },
	    description: {
	      type: String,
	      default: ''
	    },
	    type: {
	      type: String,
	      default: 'info'
	    },
	    closable: {
	      type: Boolean,
	      default: true
	    },
	    closeText: {
	      type: String,
	      default: ''
	    },
	    showIcon: {
	      type: Boolean,
	      default: false
	    }
	  },

	  data: function data() {
	    return {
	      visible: true
	    };
	  },


	  methods: {
	    close: function close() {
	      this.visible = false;
	      this.$emit('close');
	    }
	  },

	  computed: {
	    typeClass: function typeClass() {
	      return 'el-alert--' + this.type;
	    },
	    iconClass: function iconClass() {
	      return TYPE_CLASSES_MAP[this.type] || 'el-icon-information';
	    },
	    isBigIcon: function isBigIcon() {
	      return this.description ? 'is-big' : '';
	    },
	    isBoldTitle: function isBoldTitle() {
	      return this.description ? 'is-bold' : '';
	    }
	  }
	};

/***/ },
/* 250 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('transition', {
	    attrs: {
	      "name": "el-alert-fade"
	    }
	  }, [_h('div', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (visible),
	      expression: "visible"
	    }],
	    staticClass: "el-alert",
	    class: [typeClass]
	  }, [(showIcon) ? _h('i', {
	    staticClass: "el-alert__icon",
	    class: [iconClass, isBigIcon]
	  }) : _e(), " ", _h('div', {
	    staticClass: "el-alert__content"
	  }, [(title) ? _h('span', {
	    staticClass: "el-alert__title",
	    class: [isBoldTitle]
	  }, [_s(title)]) : _e(), " ", (description) ? _h('p', {
	    staticClass: "el-alert__description"
	  }, [_s(description)]) : _e(), " ", _h('i', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (closable),
	      expression: "closable"
	    }],
	    staticClass: "el-alert__closebtn",
	    class: {
	      'is-customed': closeText !== '', 'el-icon-close': closeText === ''
	    },
	    on: {
	      "click": function($event) {
	        close()
	      }
	    }
	  }, [_s(closeText)])])])])
	}},staticRenderFns: []}

/***/ },
/* 251 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _main = __webpack_require__(252);

	var _main2 = _interopRequireDefault(_main);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	module.exports = _main2.default;

/***/ },
/* 252 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _vue = __webpack_require__(8);

	var _vue2 = _interopRequireDefault(_vue);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var NotificationConstructor = _vue2.default.extend(__webpack_require__(253));

	var instance = void 0;
	var instances = [];
	var seed = 1;

	var Notification = function Notification(options) {
	  options = options || {};
	  var userOnClose = options.onClose;
	  var id = 'notification_' + seed++;

	  options.onClose = function () {
	    Notification.close(id, userOnClose);
	  };

	  instance = new NotificationConstructor({
	    data: options
	  });
	  instance.id = id;
	  instance.vm = instance.$mount();
	  document.body.appendChild(instance.vm.$el);
	  instance.vm.visible = true;
	  instance.dom = instance.vm.$el;

	  var topDist = 0;
	  for (var i = 0, len = instances.length; i < len; i++) {
	    topDist += instances[i].$el.offsetHeight + 16;
	  }
	  topDist += 16;
	  instance.top = topDist;
	  instances.push(instance);
	};

	['success', 'warning', 'info', 'error'].forEach(function (type) {
	  Notification[type] = function (options) {
	    if (typeof options === 'string') {
	      options = {
	        message: options
	      };
	    }
	    options.type = type;
	    return Notification(options);
	  };
	});

	Notification.close = function (id, userOnClose) {
	  var index = void 0;
	  var removedHeight = void 0;
	  for (var i = 0, len = instances.length; i < len; i++) {
	    if (id === instances[i].id) {
	      if (typeof userOnClose === 'function') {
	        userOnClose(instances[i]);
	      }
	      index = i;
	      removedHeight = instances[i].dom.offsetHeight;
	      instances.splice(i, 1);
	      break;
	    }
	  }

	  if (len > 1) {
	    for (i = index; i < len - 1; i++) {
	      instances[i].dom.style.top = parseInt(instances[i].dom.style.top, 10) - removedHeight - 16 + 'px';
	    }
	  }
	};

	exports.default = Notification;

/***/ },
/* 253 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(254)

	/* template */
	var __vue_template__ = __webpack_require__(255)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 254 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;


	var typeMap = {
	  success: 'circle-check',
	  info: 'information',
	  warning: 'warning',
	  error: 'circle-cross'
	};

	exports.default = {
	  data: function data() {
	    return {
	      visible: false,
	      title: '',
	      message: '',
	      duration: 4500,
	      type: '',
	      onClose: null,
	      closed: false,
	      top: null,
	      timer: null
	    };
	  },


	  computed: {
	    typeClass: function typeClass() {
	      return this.type && typeMap[this.type] ? 'el-icon-' + typeMap[this.type] : '';
	    }
	  },

	  watch: {
	    closed: function closed(newVal) {
	      var _this = this;

	      if (newVal) {
	        this.visible = false;
	        this.$el.addEventListener('transitionend', function () {
	          _this.$destroy(true);
	          _this.$el.parentNode.removeChild(_this.$el);
	        });
	      }
	    }
	  },

	  methods: {
	    handleClose: function handleClose() {
	      this.closed = true;
	      if (typeof this.onClose === 'function') {
	        this.onClose();
	      }
	    },
	    clearTimer: function clearTimer() {
	      clearTimeout(this.timer);
	    },
	    startTimer: function startTimer() {
	      var _this2 = this;

	      if (this.duration > 0) {
	        this.timer = setTimeout(function () {
	          if (!_this2.closed) {
	            _this2.handleClose();
	          }
	        }, this.duration);
	      }
	    }
	  },

	  mounted: function mounted() {
	    var _this3 = this;

	    if (this.duration > 0) {
	      this.timer = setTimeout(function () {
	        if (!_this3.closed) {
	          _this3.handleClose();
	        }
	      }, this.duration);
	    }
	  }
	};

/***/ },
/* 255 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('transition', {
	    attrs: {
	      "name": "el-notification-fade"
	    }
	  }, [_h('div', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (visible),
	      expression: "visible"
	    }],
	    staticClass: "el-notification",
	    style: ({
	      top: top ? top + 'px' : 'auto'
	    }),
	    on: {
	      "mouseenter": function($event) {
	        clearTimer()
	      },
	      "mouseleave": function($event) {
	        startTimer()
	      }
	    }
	  }, [(type) ? _h('i', {
	    staticClass: "el-notification__icon",
	    class: [typeClass]
	  }) : _e(), " ", _h('div', {
	    staticClass: "el-notification__group",
	    style: ({
	      'margin-left': typeClass ? '55px' : '0'
	    })
	  }, [_h('span', [_s(title)]), " ", _h('p', [_s(message)]), " ", _h('div', {
	    staticClass: "el-notification__closeBtn el-icon-close",
	    on: {
	      "click": function($event) {
	        handleClose()
	      }
	    }
	  })])])])
	}},staticRenderFns: []}

/***/ },
/* 256 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Slider = __webpack_require__(257);

	Slider.install = function (Vue) {
	  Vue.component(Slider.name, Slider);
	};

	module.exports = Slider;

/***/ },
/* 257 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(258)

	/* template */
	var __vue_template__ = __webpack_require__(261)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 258 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _popper = __webpack_require__(6);

	var _popper2 = _interopRequireDefault(_popper);

	var _index = __webpack_require__(75);

	var _index2 = _interopRequireDefault(_index);

	var _style = __webpack_require__(259);

	var _class = __webpack_require__(260);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  name: 'ElSlider',

	  props: {
	    min: {
	      type: Number,
	      default: 0
	    },
	    max: {
	      type: Number,
	      default: 100
	    },
	    step: {
	      type: Number,
	      default: 1
	    },
	    defaultValue: {
	      type: Number,
	      default: 0
	    },
	    value: {
	      type: Number,
	      default: 0
	    },
	    showInput: {
	      type: Boolean,
	      default: false
	    },
	    showStops: {
	      type: Boolean,
	      default: false
	    }
	  },

	  components: {
	    ElInputNumber: _index2.default
	  },

	  data: function data() {
	    return {
	      inputValue: null,
	      timeout: null,
	      showTip: false,
	      hovering: false,
	      dragging: false,
	      popper: null,
	      newPos: null,
	      oldValue: this.value,
	      currentPosition: (this.value - this.min) / (this.max - this.min) * 100 + '%'
	    };
	  },


	  watch: {
	    inputValue: function inputValue(val) {
	      this.$emit('input', Number(val));
	    },
	    showTip: function showTip(val) {
	      var _this = this;

	      if (val) {
	        this.$nextTick(function () {
	          _this.updatePopper();
	        });
	      } else {
	        this.timeout = setTimeout(function () {
	          if (_this.popper) {
	            _this.popper.destroy();
	            _this.popper = null;
	          }
	        }, 300);
	      }
	    },
	    value: function value(val) {
	      var _this2 = this;

	      this.$nextTick(function () {
	        _this2.updatePopper();
	      });
	      if (val < this.min) {
	        this.$emit('input', this.min);
	        return;
	      }
	      if (val > this.max) {
	        this.$emit('input', this.max);
	        return;
	      }
	      this.inputValue = val;
	      this.setPosition((val - this.min) * 100 / (this.max - this.min));
	    }
	  },

	  methods: {
	    handlePopperStyle: function handlePopperStyle() {
	      var placementMap = { top: 'bottom', bottom: 'top' };
	      var placement = this.popper._popper.getAttribute('x-placement').split('-')[0];
	      var origin = placementMap[placement];
	      (0, _class.addClass)(this.popper._popper, placement);
	      (0, _class.removeClass)(this.popper._popper, placementMap[placement]);
	      this.popper._popper.style.transformOrigin = 'center ' + origin;
	    },
	    updatePopper: function updatePopper() {
	      var _this3 = this;

	      if (this.popper) {
	        clearTimeout(this.timeout);
	        this.popper.update();
	        this.handlePopperStyle();
	      } else {
	        this.popper = new _popper2.default(this.$refs.button, this.$refs.pop, { gpuAcceleration: false, placement: 'top' });
	        this.popper.onCreate(function () {
	          _this3.handlePopperStyle();
	        });
	        this.updatePopper();
	      }
	    },
	    setPosition: function setPosition(newPos) {
	      if (newPos >= 0 && newPos <= 100) {
	        var lengthPerStep = 100 / ((this.max - this.min) / this.step);
	        var steps = Math.round(newPos / lengthPerStep);
	        this.$emit('input', Math.round(steps * lengthPerStep * (this.max - this.min) * 0.01 + this.min));
	        this.currentPosition = (this.value - this.min) / (this.max - this.min) * 100 + '%';
	        if (!this.dragging) {
	          if (this.value !== this.oldValue) {
	            this.$emit('change', this.value);
	            this.oldValue = this.value;
	          }
	        }
	      }
	    },
	    onSliderClick: function onSliderClick(event) {
	      var currentX = event.clientX;
	      var sliderOffsetLeft = this.$refs.slider.getBoundingClientRect().left;
	      var newPos = (currentX - sliderOffsetLeft) / this.$sliderWidth * 100;
	      this.setPosition(newPos);
	    },
	    onInputChange: function onInputChange() {
	      if (this.value === '') {
	        return;
	      }
	      if (!isNaN(this.value)) {
	        this.setPosition((this.value - this.min) * 100 / (this.max - this.min));
	      }
	    }
	  },

	  computed: {
	    $sliderWidth: function $sliderWidth() {
	      return parseInt((0, _style.getStyle)(this.$refs.slider, 'width'), 10);
	    },
	    showTip: function showTip() {
	      return this.dragging || this.hovering;
	    },
	    stops: function stops() {
	      var stopCount = (this.max - this.value) / this.step;
	      var result = [];
	      var currentLeft = parseFloat(this.currentPosition);
	      var stepWidth = 100 * this.step / (this.max - this.min);
	      for (var i = 1; i < stopCount; i++) {
	        result.push(currentLeft + i * stepWidth);
	      }
	      return result;
	    }
	  },

	  mounted: function mounted() {
	    var _this4 = this;

	    var startX = 0;
	    var currentX = 0;
	    var startPos = 0;

	    var onDragStart = function onDragStart(event) {
	      _this4.dragging = true;
	      startX = event.clientX;
	      startPos = parseInt(_this4.currentPosition, 10);
	    };

	    var onDragging = function onDragging(event) {
	      if (_this4.dragging) {
	        currentX = event.clientX;
	        var diff = (currentX - startX) / _this4.$sliderWidth * 100;
	        _this4.newPos = startPos + diff;
	        _this4.setPosition(_this4.newPos);
	      }
	    };

	    var onDragEnd = function onDragEnd() {
	      if (_this4.dragging) {
	        _this4.dragging = false;
	        _this4.setPosition(_this4.newPos);
	        window.removeEventListener('mousemove', onDragging);
	        window.removeEventListener('mouseup', onDragEnd);
	      }
	    };

	    this.$refs.button.addEventListener('mousedown', function (event) {
	      onDragStart(event);
	      window.addEventListener('mousemove', onDragging);
	      window.addEventListener('mouseup', onDragEnd);
	    });
	  },
	  created: function created() {
	    if (typeof this.value !== 'number' || this.value < this.min || this.value > this.max) {
	      this.$emit('input', this.min);
	    }
	    this.inputValue = this.inputValue || this.value;
	  },
	  beforeDestroy: function beforeDestroy() {
	    if (this.popper) {
	      this.popper.destroy();
	    }
	  }
	};

/***/ },
/* 259 */
/***/ function(module, exports) {

	var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
	var MOZ_HACK_REGEXP = /^moz([A-Z])/;

	function camelCase(name) {
	  return name.
	    replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
	      return offset ? letter.toUpperCase() : letter;
	    }).
	    replace(MOZ_HACK_REGEXP, 'Moz$1');
	}

	var ieVersion = Number(document.documentMode);
	var getStyle = ieVersion < 9 ? function(element, styleName) {
	  if (!element || !styleName) return null;
	  styleName = camelCase(styleName);
	  if (styleName === 'float') {
	    styleName = 'styleFloat';
	  }
	  try {
	    switch (styleName) {
	      case 'opacity':
	        try {
	          return element.filters.item('alpha').opacity / 100;
	        }
	        catch (e) {
	          return 1.0;
	        }
	        break;
	      default:
	        return ( element.style[styleName] || element.currentStyle ? element.currentStyle[styleName] : null );
	    }
	  } catch(e) {
	    return element.style[styleName];
	  }
	} : function(element, styleName) {
	  if (!element || !styleName) return null;
	  styleName = camelCase(styleName);
	  if (styleName === 'float') {
	    styleName = 'cssFloat';
	  }
	  try {
	    var computed = document.defaultView.getComputedStyle(element, '');
	    return element.style[styleName] || computed ? computed[styleName] : null;
	  } catch(e) {
	    return element.style[styleName];
	  }
	};

	var setStyle = function(element, styleName, value) {
	  if (!element || !styleName) return;

	  if (typeof styleName === 'object') {
	    for (var prop in styleName) {
	      if (styleName.hasOwnProperty(prop)) {
	        setStyle(element, prop, styleName[prop]);
	      }
	    }
	  } else {
	    styleName = camelCase(styleName);
	    if (styleName === 'opacity' && ieVersion < 9) {
	      element.style.filter = isNaN(value) ? '' : 'alpha(opacity=' + value * 100 + ')';
	    } else {
	      element.style[styleName] = value;
	    }
	  }
	};

	module.exports = {
	  getStyle: getStyle,
	  setStyle: setStyle
	};

/***/ },
/* 260 */
/***/ function(module, exports) {

	var trim = function (string) {
	  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
	};

	var hasClass = function (el, cls) {
	  if (!el || !cls) return false;
	  if (cls.indexOf(' ') != -1) throw new Error('className should not contain space.');
	  if (el.classList) {
	    return el.classList.contains(cls);
	  } else {
	    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
	  }
	};

	var addClass = function (el, cls) {
	  if (!el) return;
	  var curClass = el.className;
	  var classes = (cls || '').split(' ');

	  for (var i = 0, j = classes.length; i < j; i++) {
	    var clsName = classes[i];
	    if (!clsName) continue;

	    if (el.classList) {
	      el.classList.add(clsName);
	    } else {
	      if (!hasClass(el, clsName)) {
	        curClass += ' ' + clsName;
	      }
	    }
	  }
	  if (!el.classList) {
	    el.className = curClass;
	  }
	};

	var removeClass = function (el, cls) {
	  if (!el || !cls) return;
	  var classes = cls.split(' ');
	  var curClass = ' ' + el.className + ' ';

	  for (var i = 0, j = classes.length; i < j; i++) {
	    var clsName = classes[i];
	    if (!clsName) continue;

	    if (el.classList) {
	      el.classList.remove(clsName);
	    } else {
	      if (hasClass(el, clsName)) {
	        curClass = curClass.replace(' ' + clsName + ' ', ' ');
	      }
	    }
	  }
	  if (!el.classList) {
	    el.className = trim(curClass);
	  }
	};

	module.exports = {
	  hasClass: hasClass,
	  addClass: addClass,
	  removeClass: removeClass
	};

/***/ },
/* 261 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('div', {
	    staticClass: "el-slider"
	  }, [(showInput) ? _h('el-input-number', {
	    directives: [{
	      name: "model",
	      rawName: "v-model",
	      value: (inputValue),
	      expression: "inputValue"
	    }],
	    ref: "input",
	    staticClass: "el-slider__input",
	    attrs: {
	      "step": step,
	      "min": min,
	      "max": max,
	      "size": "small"
	    },
	    domProps: {
	      "value": (inputValue)
	    },
	    on: {
	      "input": function($event) {
	        inputValue = $event
	      }
	    },
	    nativeOn: {
	      "keyup": function($event) {
	        onInputChange()
	      }
	    }
	  }) : _e(), " ", _h('div', {
	    ref: "slider",
	    staticClass: "el-slider__runway",
	    class: {
	      'show-input': showInput
	    },
	    on: {
	      "click": onSliderClick
	    }
	  }, [_h('div', {
	    staticClass: "el-slider__bar",
	    style: ({
	      width: currentPosition
	    })
	  }), " ", _h('div', {
	    ref: "button",
	    staticClass: "el-slider__button-wrapper",
	    style: ({
	      left: currentPosition
	    }),
	    on: {
	      "mouseenter": function($event) {
	        hovering = true
	      },
	      "mouseleave": function($event) {
	        hovering = false
	      }
	    }
	  }, [_h('div', {
	    staticClass: "el-slider__button",
	    class: {
	      'hover': hovering, 'dragging': dragging
	    }
	  })]), " ", _h('transition', {
	    attrs: {
	      "name": "popper-fade"
	    }
	  }, [_h('div', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (showTip),
	      expression: "showTip"
	    }],
	    ref: "pop",
	    staticClass: "el-slider__pop"
	  }, [_s(value)])]), " ", _l((stops), function(item) {
	    return (showStops) ? _h('div', {
	      staticClass: "el-slider__stop",
	      style: ({
	        'left': item + '%'
	      })
	    }) : _e()
	  })])])
	}},staticRenderFns: []}

/***/ },
/* 262 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _directive = __webpack_require__(263);

	var _directive2 = _interopRequireDefault(_directive);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_directive2.default.name = 'loading';

	module.exports = _directive2.default;

/***/ },
/* 263 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _spinner = __webpack_require__(264);

	var _spinner2 = _interopRequireDefault(_spinner);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.install = function (Vue) {
	  var toggleLoading = function toggleLoading(el, binding) {
	    if (binding.value) {
	      Vue.nextTick(function () {
	        if (binding.modifiers.fullscreen) {
	          el.originalPosition = document.body.style.position;
	          el.originalOverflow = document.body.style.overflow;

	          ['top', 'right', 'bottom', 'left'].forEach(function (property) {
	            el.maskStyle[property] = '0';
	          });
	          el.maskStyle.position = 'fixed';
	          el.spinnerStyle.position = 'fixed';

	          insertDom(document.body, el, binding);
	        } else {
	          if (binding.modifiers.body) {
	            el.originalPosition = document.body.style.position;

	            ['top', 'left'].forEach(function (property) {
	              var scroll = property === 'top' ? 'scrollTop' : 'scrollLeft';
	              el.maskStyle[property] = el.getBoundingClientRect()[property] + document.body[scroll] + document.documentElement[scroll] + 'px';
	            });
	            ['height', 'width'].forEach(function (property) {
	              el.maskStyle[property] = el.getBoundingClientRect()[property] + 'px';
	            });

	            insertDom(document.body, el, binding);
	          } else {
	            el.originalPosition = el.style.position;

	            ['top', 'right', 'bottom', 'left'].forEach(function (property) {
	              el.maskStyle[property] = '0';
	            });

	            insertDom(el, el, binding);
	          }
	        }
	      });
	    } else {
	      if (el.domVisible) {
	        el.mask.style.display = 'none';
	        el.spinner.style.display = 'none';
	        el.domVisible = false;

	        if (binding.modifiers.fullscreen) {
	          document.body.style.overflow = el.originalOverflow;
	        }
	        if (binding.modifiers.fullscreen || binding.modifiers.body) {
	          document.body.style.position = el.originalPosition;
	        } else {
	          el.style.position = el.originalPosition;
	        }
	      }
	    }
	  };
	  var insertDom = function insertDom(parent, directive, binding) {
	    if (!directive.domVisible) {
	      Object.keys(directive.maskStyle).forEach(function (property) {
	        directive.mask.style[property] = directive.maskStyle[property];
	      });

	      Object.keys(directive.spinnerStyle).forEach(function (property) {
	        directive.spinner.style[property] = directive.spinnerStyle[property];
	      });

	      if (directive.originalPosition !== 'absolute') {
	        parent.style.position = 'relative';
	      }
	      if (binding.modifiers.fullscreen) {
	        parent.style.overflow = 'hidden';
	      }
	      directive.mask.style.display = 'block';
	      directive.spinner.style.display = 'inline-block';
	      directive.domVisible = true;

	      parent.appendChild(directive.mask);
	      directive.mask.appendChild(directive.spinner);
	      directive.domInserted = true;
	    }
	  };

	  Vue.directive('loading', {
	    bind: function bind(el, binding) {
	      el.mask = document.createElement('div');
	      el.mask.className = 'el-loading-mask';
	      el.maskStyle = {
	        position: 'absolute',
	        zIndex: '10000',
	        backgroundColor: 'rgba(0, 0, 0, .65)',
	        margin: '0'
	      };

	      el.spinner = new _spinner2.default().el;
	      el.spinnerStyle = {
	        position: 'absolute'
	      };
	      toggleLoading(el, binding);
	    },

	    update: function update(el, binding) {
	      toggleLoading(el, binding);
	    },

	    unbind: function unbind(el, binding) {
	      if (el.domInserted) {
	        if (binding.modifiers.fullscreen || binding.modifiers.body) {
	          document.body.removeChild(el.mask);
	          el.mask.removeChild(el.spinner);
	        } else {
	          el.removeChild(el.mask);
	          el.mask.removeChild(el.spinner);
	        }
	      }
	    }
	  });
	};

/***/ },
/* 264 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _class = __webpack_require__(265);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Spinner = function Spinner() {
	  _classCallCheck(this, Spinner);

	  var spinner = document.createElement('div');
	  (0, _class.addClass)(spinner, 'el-loading-spinner');
	  [1, 2, 3].forEach(function (index) {
	    var bubble = document.createElement('div');
	    (0, _class.addClass)(bubble, 'el-loading-bubble bubble' + index);
	    spinner.appendChild(bubble);
	  });
	  this.el = spinner;
	};

	exports.default = Spinner;

/***/ },
/* 265 */
/***/ function(module, exports) {

	var trim = function (string) {
	  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
	};

	var hasClass = function (el, cls) {
	  if (!el || !cls) return false;
	  if (cls.indexOf(' ') != -1) throw new Error('className should not contain space.');
	  if (el.classList) {
	    return el.classList.contains(cls);
	  } else {
	    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
	  }
	};

	var addClass = function (el, cls) {
	  if (!el) return;
	  var curClass = el.className;
	  var classes = (cls || '').split(' ');

	  for (var i = 0, j = classes.length; i < j; i++) {
	    var clsName = classes[i];
	    if (!clsName) continue;

	    if (el.classList) {
	      el.classList.add(clsName);
	    } else {
	      if (!hasClass(el, clsName)) {
	        curClass += ' ' + clsName;
	      }
	    }
	  }
	  if (!el.classList) {
	    el.className = curClass;
	  }
	};

	var removeClass = function (el, cls) {
	  if (!el || !cls) return;
	  var classes = cls.split(' ');
	  var curClass = ' ' + el.className + ' ';

	  for (var i = 0, j = classes.length; i < j; i++) {
	    var clsName = classes[i];
	    if (!clsName) continue;

	    if (el.classList) {
	      el.classList.remove(clsName);
	    } else {
	      if (hasClass(el, clsName)) {
	        curClass = curClass.replace(' ' + clsName + ' ', ' ');
	      }
	    }
	  }
	  if (!el.classList) {
	    el.className = trim(curClass);
	  }
	};

	module.exports = {
	  hasClass: hasClass,
	  addClass: addClass,
	  removeClass: removeClass
	};

/***/ },
/* 266 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(267);

/***/ },
/* 267 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(268)

	/* template */
	var __vue_template__ = __webpack_require__(269)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 268 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports.default = {
	  name: 'ElIcon',

	  props: {
	    name: String
	  }
	};

/***/ },
/* 269 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('i', {
	    class: 'el-icon-' + name
	  })
	}},staticRenderFns: []}

/***/ },
/* 270 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ElRow = __webpack_require__(271);

	ElRow.install = function (Vue) {
	  Vue.component('el-row', ElRow);
	};

	module.exports = ElRow;

/***/ },
/* 271 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(272)

	/* template */
	var __vue_template__ = __webpack_require__(273)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 272 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports.default = {
	  name: 'ElRow',

	  props: {
	    gutter: Number,
	    type: String,
	    justify: {
	      type: String,
	      default: 'start'
	    },
	    align: {
	      type: String,
	      default: 'top'
	    }
	  },

	  computed: {
	    style: function style() {
	      var ret = {};

	      if (this.gutter) {
	        ret.marginLeft = '-' + this.gutter / 2 + 'px';
	        ret.marginRight = ret.marginLeft;
	      }

	      return ret;
	    }
	  }
	};

/***/ },
/* 273 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('div', {
	    staticClass: "el-row",
	    class: [
	      justify !== 'start' ? 'is-justify-' + justify : '',
	      align !== 'top' ? 'is-align-' + align : '', {
	        'el-row--flex': type === 'flex'
	      }
	    ],
	    style: (style)
	  }, [_t("default")])
	}},staticRenderFns: []}

/***/ },
/* 274 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ElCol = __webpack_require__(275);

	ElCol.install = function (Vue) {
	  Vue.component('el-col', ElCol);
	};

	module.exports = ElCol;

/***/ },
/* 275 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(276)

	/* template */
	var __vue_template__ = __webpack_require__(277)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 276 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports.default = {
	  name: 'ElCol',

	  props: {
	    span: {
	      type: Number,
	      required: true
	    },
	    offset: Number,
	    pull: Number,
	    push: Number
	  },

	  computed: {
	    gutter: function gutter() {
	      return this.$parent.gutter;
	    },
	    style: function style() {
	      var ret = {};

	      if (this.gutter) {
	        ret.paddingLeft = this.gutter / 2 + 'px';
	        ret.paddingRight = ret.paddingLeft;
	      }

	      return ret;
	    }
	  }
	};

/***/ },
/* 277 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('div', {
	    staticClass: "el-col",
	    class: [
	      'el-col-' + span,
	      offset ? 'el-col-offset-' + offset : '',
	      pull ? 'el-col-pull-' + pull : '',
	      push ? 'el-col-push-' + push : ''
	    ],
	    style: (style)
	  }, [_t("default")])
	}},staticRenderFns: []}

/***/ },
/* 278 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Upload = __webpack_require__(279);

	Upload.install = function (Vue) {
	  Vue.component(Upload.name, Upload);
	};

	module.exports = Upload;

/***/ },
/* 279 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(280)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}

	module.exports = __vue_exports__


/***/ },
/* 280 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _uploadList = __webpack_require__(281);

	var _uploadList2 = _interopRequireDefault(_uploadList);

	var _upload = __webpack_require__(284);

	var _upload2 = _interopRequireDefault(_upload);

	var _iframeUpload = __webpack_require__(291);

	var _iframeUpload2 = _interopRequireDefault(_iframeUpload);

	var _index = __webpack_require__(293);

	var _index2 = _interopRequireDefault(_index);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function noop() {}

	exports.default = {
	  name: 'el-upload',

	  components: {
	    ElProgress: _index2.default,
	    UploadList: _uploadList2.default,
	    Upload: _upload2.default,
	    IframeUpload: _iframeUpload2.default
	  },

	  props: {
	    action: {
	      type: String,
	      required: true
	    },
	    headers: {
	      type: Object,
	      default: function _default() {
	        return {};
	      }
	    },
	    data: Object,
	    multiple: Boolean,
	    name: {
	      type: String,
	      default: 'file'
	    },
	    withCredentials: Boolean,
	    thumbnailMode: Boolean,
	    showUploadList: {
	      type: Boolean,
	      default: true
	    },
	    accept: String,
	    type: {
	      type: String,
	      default: 'select'
	    },
	    beforeUpload: Function,
	    onRemove: {
	      type: Function,
	      default: noop
	    },
	    onChange: {
	      type: Function,
	      default: noop
	    },
	    onPreview: {
	      type: Function,
	      default: noop
	    },
	    onSuccess: {
	      type: Function,
	      default: noop
	    },
	    onError: {
	      type: Function,
	      default: noop
	    }
	  },

	  data: function data() {
	    return {
	      uploadedFiles: [],
	      dragOver: false,
	      draging: false,
	      tempIndex: 1
	    };
	  },


	  methods: {
	    handleStart: function handleStart(file) {
	      file.uid = Date.now() + this.tempIndex++;
	      var _file = {
	        status: 'uploading',
	        name: file.name,
	        size: file.size,
	        percentage: 0,
	        uid: file.uid,
	        showProgress: true
	      };

	      if (this.thumbnailMode) {
	        try {
	          _file.url = URL.createObjectURL(file);
	        } catch (err) {
	          console.log(err);
	          return;
	        }
	      }

	      this.uploadedFiles.push(_file);
	    },
	    handleProgress: function handleProgress(ev, file) {
	      var _file = this.getFile(file);
	      _file.percentage = ev.percent;
	    },
	    handleSuccess: function handleSuccess(res, file) {
	      var _file = this.getFile(file);

	      if (_file) {
	        _file.status = 'finished';
	        _file.response = res;

	        this.onSuccess(_file, this.uploadedFiles);

	        setTimeout(function () {
	          _file.showProgress = false;
	        }, 1000);
	      }
	    },
	    handleError: function handleError(err, file) {
	      var _file = this.getFile(file);
	      var fileList = this.uploadedFiles;

	      _file.status = 'fail';

	      fileList.splice(fileList.indexOf(_file), 1);

	      this.onError(err, _file, fileList);
	    },
	    handleRemove: function handleRemove(file) {
	      var fileList = this.uploadedFiles;
	      fileList.splice(fileList.indexOf(file), 1);
	      this.onRemove(file, fileList);
	    },
	    getFile: function getFile(file) {
	      var fileList = this.uploadedFiles;
	      var target;
	      fileList.every(function (item) {
	        target = file.uid === item.uid ? item : null;
	        return !target;
	      });
	      return target;
	    },
	    handlePreview: function handlePreview(file) {
	      if (file.status === 'finished') {
	        this.onPreview(file);
	      }
	    }
	  },

	  render: function render(h) {
	    var uploadList;

	    if (this.showUploadList && !this.thumbnailMode && this.uploadedFiles.length) {
	      uploadList = h(
	        _uploadList2.default,
	        {
	          attrs: {
	            files: this.uploadedFiles
	          },
	          on: {
	            remove: this.handleRemove,
	            preview: this.handlePreview
	          }
	        },
	        []
	      );
	    }

	    var props = {
	      props: {
	        type: this.type,
	        action: this.action,
	        multiple: this.multiple,
	        'before-upload': this.beforeUpload,
	        'with-credentials': this.withCredentials,
	        headers: this.headers,
	        name: this.name,
	        data: this.data,
	        accept: this.thumbnailMode ? 'image/*' : this.accept,
	        'on-start': this.handleStart,
	        'on-progress': this.handleProgress,
	        'on-success': this.handleSuccess,
	        'on-error': this.handleError,
	        'on-preview': this.handlePreview,
	        'on-remove': this.handleRemove
	      }
	    };

	    var uploadComponent = typeof FormData !== 'undefined' ? h(
	      'upload',
	      props,
	      [this.$slots.default]
	    ) : h(
	      'iframeUpload',
	      props,
	      [this.$slots.default]
	    );

	    if (this.type === 'select') {
	      return h(
	        'div',
	        { 'class': 'el-upload' },
	        [uploadList, uploadComponent, this.$slots.tip]
	      );
	    }

	    if (this.type === 'drag') {
	      return h(
	        'div',
	        { 'class': 'el-upload' },
	        [uploadComponent, this.$slots.tip, uploadList]
	      );
	    }
	  }
	};

/***/ },
/* 281 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(282)

	/* template */
	var __vue_template__ = __webpack_require__(283)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 282 */
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;
	exports.default = {
	  props: {
	    files: {
	      type: Array,
	      default: function _default() {
	        return [];
	      }
	    }
	  },
	  methods: {
	    parsePercentage: function parsePercentage(val) {
	      return parseInt(val, 10);
	    }
	  }
	};

/***/ },
/* 283 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('transition-group', {
	    staticClass: "el-upload__files",
	    attrs: {
	      "tag": "ul",
	      "name": "list"
	    }
	  }, [_l((files), function(file) {
	    return _h('li', {
	      key: file,
	      staticClass: "el-upload__file",
	      class: {
	        'is-finished': file.status === 'finished'
	      },
	      on: {
	        "click": function($event) {
	          $emit('clickFile', file)
	        }
	      }
	    }, [_h('a', {
	      staticClass: "el-upload__file__name",
	      on: {
	        "click": function($event) {
	          $emit('preview', file)
	        }
	      }
	    }, [_m(0), _s(file.name) + "\n    "]), " ", _h('span', {
	      directives: [{
	        name: "show",
	        rawName: "v-show",
	        value: (file.status === 'finished'),
	        expression: "file.status === 'finished'"
	      }],
	      staticClass: "el-upload__btn-delete",
	      on: {
	        "click": function($event) {
	          $emit('remove', file)
	        }
	      }
	    }, ["删除"]), " ", (file.showProgress) ? _h('el-progress', {
	      attrs: {
	        "stroke-width": 2,
	        "percentage": parsePercentage(file.percentage),
	        "status": file.status === 'finished' && file.showProgress ? 'success' : ''
	      }
	    }) : _e()])
	  })])
	}},staticRenderFns: [function (){with(this) {
	  return _h('i', {
	    staticClass: "el-icon-document"
	  })
	}}]}

/***/ },
/* 284 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(285)

	/* template */
	var __vue_template__ = __webpack_require__(290)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 285 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _ajax = __webpack_require__(286);

	var _ajax2 = _interopRequireDefault(_ajax);

	var _cover = __webpack_require__(287);

	var _cover2 = _interopRequireDefault(_cover);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  components: {
	    Cover: _cover2.default
	  },
	  props: {
	    type: String,
	    action: {
	      type: String,
	      required: true
	    },
	    name: {
	      type: String,
	      default: 'file'
	    },
	    data: Object,
	    headers: Object,
	    withCredentials: Boolean,
	    multiple: Boolean,
	    accept: String,
	    onStart: Function,
	    onProgress: Function,
	    onSuccess: Function,
	    onError: Function,
	    beforeUpload: Function,
	    onPreview: {
	      type: Function,
	      default: function _default() {}
	    },
	    onRemove: {
	      type: Function,
	      default: function _default() {}
	    }
	  },

	  data: function data() {
	    return {
	      dragOver: false,
	      mouseover: false
	    };
	  },


	  computed: {
	    lastestFile: function lastestFile() {
	      var uploadedFiles = this.$parent.uploadedFiles;
	      return uploadedFiles[uploadedFiles.length - 1];
	    },
	    showCover: function showCover() {
	      var file = this.lastestFile;
	      return this.thumbnailMode && file && file.status !== 'fail';
	    },
	    thumbnailMode: function thumbnailMode() {
	      return this.$parent.thumbnailMode;
	    }
	  },

	  methods: {
	    isImage: function isImage(str) {
	      return str.indexOf('image') !== -1;
	    },
	    handleChange: function handleChange(ev) {
	      var files = ev.target.files;

	      if (!files) {
	        return;
	      }
	      this.uploadFiles(files);
	    },
	    uploadFiles: function uploadFiles(files) {
	      var _this = this;

	      var postFiles = Array.prototype.slice.call(files);
	      if (!this.multiple) {
	        postFiles = postFiles.slice(0, 1);
	      }

	      if (postFiles.length === 0) {
	        return;
	      }

	      postFiles.forEach(function (file) {
	        var isImage = _this.isImage(file.type);

	        if (_this.thumbnailMode && !isImage) {
	          return;
	        } else {
	          _this.upload(file);
	        }
	      });
	    },
	    upload: function upload(file) {
	      var _this2 = this;

	      if (!this.beforeUpload) {
	        return this.post(file);
	      }

	      var before = this.beforeUpload(file);
	      if (before && before.then) {
	        before.then(function (processedFile) {
	          if (Object.prototype.toString.call(processedFile) === '[object File]') {
	            _this2.post(processedFile);
	          } else {
	            _this2.post(file);
	          }
	        }, function () {});
	      } else if (before !== false) {
	        this.post(file);
	      } else {}
	    },
	    post: function post(file) {
	      var _this3 = this;

	      this.onStart(file);
	      var formData = new FormData();
	      formData.append(this.name, file);

	      (0, _ajax2.default)(this.action, {
	        headers: this.headers,
	        withCredentials: this.withCredentials,
	        file: file,
	        data: this.data,
	        filename: this.name,
	        onProgress: function onProgress(e) {
	          _this3.onProgress(e, file);
	        },
	        onSuccess: function onSuccess(res) {
	          _this3.onSuccess(res, file);
	        },
	        onError: function onError(err) {
	          _this3.onError(err, file);
	        }
	      });
	    },
	    onDrop: function onDrop(e) {
	      this.dragOver = false;
	      this.uploadFiles(e.dataTransfer.files);
	    },
	    handleClick: function handleClick() {
	      this.$refs.input.click();
	    }
	  }
	};

/***/ },
/* 286 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports.default = upload;
	function getError(action, option, xhr) {
	  var msg = 'cannot post ' + action + ' ' + xhr.status + '\'';
	  var err = new Error(msg);
	  err.status = xhr.status;
	  err.method = 'post';
	  err.url = action;
	  return err;
	}

	function getBody(xhr) {
	  var text = xhr.responseText || xhr.response;
	  if (!text) {
	    return text;
	  }

	  try {
	    return JSON.parse(text);
	  } catch (e) {
	    return text;
	  }
	}

	function upload(action, option) {
	  if (typeof XMLHttpRequest === 'undefined') {
	    return;
	  }

	  var xhr = new XMLHttpRequest();
	  if (xhr.upload) {
	    xhr.upload.onprogress = function progress(e) {
	      if (e.total > 0) {
	        e.percent = e.loaded / e.total * 100;
	      }
	      option.onProgress(e);
	    };
	  }

	  var formData = new FormData();

	  if (option.data) {
	    Object.keys(option.data).map(function (key) {
	      formData.append(key, option.data[key]);
	    });
	  }

	  formData.append(option.filename, option.file);

	  xhr.onerror = function error(e) {
	    option.onError(e);
	  };

	  xhr.onload = function onload() {
	    if (xhr.status < 200 || xhr.status >= 300) {
	      return option.onError(getError(action, option, xhr), getBody(xhr));
	    }

	    option.onSuccess(getBody(xhr));
	  };

	  xhr.open('post', action, true);

	  if (option.withCredentials && 'withCredentials' in xhr) {
	    xhr.withCredentials = true;
	  }

	  var headers = option.headers || {};

	  for (var item in headers) {
	    if (headers.hasOwnProperty(item) && headers[item] !== null) {
	      xhr.setRequestHeader(item, headers[item]);
	    }
	  }
	  xhr.send(formData);
	}

/***/ },
/* 287 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(288)

	/* template */
	var __vue_template__ = __webpack_require__(289)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 288 */
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;
	exports.default = {
	  props: {
	    image: {},
	    onPreview: {
	      type: Function,
	      default: function _default() {}
	    },
	    onRemove: {
	      type: Function,
	      default: function _default() {}
	    }
	  },
	  data: function data() {
	    return {
	      mouseover: false
	    };
	  }
	};

/***/ },
/* 289 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return (image) ? _h('div', {
	    staticClass: "el-dragger__cover",
	    on: {
	      "click": function($event) {
	        $event.stopPropagation();
	      }
	    }
	  }, [_h('transition', {
	    attrs: {
	      "name": "fade-in"
	    }
	  }, [(image.status === 'uploading') ? _h('el-progress', {
	    staticClass: "el-dragger__cover__progress",
	    attrs: {
	      "percentage": image.percentage,
	      "show-text": false,
	      "status": image.status === 'finished' ? 'success' : ''
	    }
	  }) : _e()]), " ", (image.status === 'finished') ? _h('div', {
	    staticClass: "el-dragger__cover__content",
	    on: {
	      "mouseenter": function($event) {
	        mouseover = true
	      },
	      "mouseleave": function($event) {
	        mouseover = false
	      }
	    }
	  }, [_h('img', {
	    attrs: {
	      "src": image.url
	    }
	  }), " ", _h('transition', {
	    attrs: {
	      "name": "fade-in"
	    }
	  }, [_h('div', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (mouseover),
	      expression: "mouseover"
	    }],
	    staticClass: "el-dragger__cover__interact"
	  }, [_h('div', {
	    staticClass: "el-draggeer__cover__btns"
	  }, [_h('span', {
	    staticClass: "btn",
	    on: {
	      "click": function($event) {
	        $parent.handleClick()
	      }
	    }
	  }, [_m(0), _m(1)]), " ", _h('span', {
	    staticClass: "btn",
	    on: {
	      "click": function($event) {
	        onPreview(image)
	      }
	    }
	  }, [_m(2), _m(3)]), " ", _h('span', {
	    staticClass: "btn",
	    on: {
	      "click": function($event) {
	        onRemove(image)
	      }
	    }
	  }, [_m(4), _m(5)])])])]), " ", _h('transition', {
	    attrs: {
	      "name": "md-fade-top"
	    }
	  }, [_h('h4', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (mouseover),
	      expression: "mouseover"
	    }],
	    staticClass: "el-dragger__cover__title"
	  }, [_s(image.name)])])]) : _e()]) : _e()
	}},staticRenderFns: [function (){with(this) {
	  return _h('i', {
	    staticClass: "el-icon-upload2"
	  })
	}},function (){with(this) {
	  return _h('span', ["继续上传"])
	}},function (){with(this) {
	  return _h('i', {
	    staticClass: "el-icon-view"
	  })
	}},function (){with(this) {
	  return _h('span', ["查看图片"])
	}},function (){with(this) {
	  return _h('i', {
	    staticClass: "el-icon-delete2"
	  })
	}},function (){with(this) {
	  return _h('span', ["删除"])
	}}]}

/***/ },
/* 290 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('div', {
	    staticClass: "el-upload__inner",
	    class: {
	      'el-dragger': type === 'drag',
	        'is-dragOver': dragOver,
	        'is-showCover': showCover
	    },
	    on: {
	      "click": handleClick,
	      "drop": function($event) {
	        $event.preventDefault();
	        onDrop($event)
	      },
	      "dragover": function($event) {
	        $event.preventDefault();
	        dragOver = true
	      },
	      "dragleave": function($event) {
	        $event.preventDefault();
	        dragOver = false
	      }
	    }
	  }, [(!showCover) ? _t("default") : _h('cover', {
	    attrs: {
	      "image": lastestFile,
	      "on-preview": onPreview,
	      "on-remove": onRemove
	    }
	  }), " ", " ", _h('input', {
	    ref: "input",
	    staticClass: "el-upload__input",
	    attrs: {
	      "type": "file",
	      "multiple": multiple,
	      "accept": accept
	    },
	    on: {
	      "change": handleChange
	    }
	  })])
	}},staticRenderFns: []}

/***/ },
/* 291 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(292)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}

	module.exports = __vue_exports__


/***/ },
/* 292 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _cover = __webpack_require__(287);

	var _cover2 = _interopRequireDefault(_cover);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  components: {
	    Cover: _cover2.default
	  },
	  props: {
	    type: String,
	    data: {},
	    action: {
	      type: String,
	      required: true
	    },
	    name: {
	      type: String,
	      default: 'file'
	    },
	    withCredentials: Boolean,
	    multiple: Boolean,
	    accept: String,
	    onStart: Function,
	    onProgress: Function,
	    onSuccess: Function,
	    onError: Function,
	    beforeUpload: Function,
	    onPreview: {
	      type: Function,
	      default: function _default() {}
	    },
	    onRemove: {
	      type: Function,
	      default: function _default() {}
	    }
	  },

	  data: function data() {
	    return {
	      dragOver: false,
	      mouseover: false,
	      domain: '',
	      file: null,
	      disabled: false
	    };
	  },


	  computed: {
	    lastestFile: function lastestFile() {
	      var uploadedFiles = this.$parent.uploadedFiles;
	      return uploadedFiles[uploadedFiles.length - 1];
	    },
	    showCover: function showCover() {
	      var file = this.lastestFile;
	      return this.thumbnailMode && file && file.status !== 'fail';
	    },
	    thumbnailMode: function thumbnailMode() {
	      return this.$parent.thumbnailMode;
	    }
	  },

	  methods: {
	    resetIframe: function resetIframe() {
	      var iframeNode = this.getIframeNode();
	      var win = iframeNode.contentWindow;
	      var doc = win.document;

	      doc.open('text/html', 'replace');
	      doc.write(this.getIframeHTML(this.domain));
	      doc.close();
	    },
	    getIframeHTML: function getIframeHTML(domain) {
	      var domainScript = '';
	      if (domain) {
	        domainScript = '<script>document.domain="' + domain + '";<' + '/script>';
	      }
	      return '\n      <!DOCTYPE html>\n      <html>\n      <head>\n      <meta http-equiv="X-UA-Compatible" content="IE=edge" />\n      ' + domainScript + '\n      </head>\n      <body>\n      </body>\n      </html>\n      ';
	    },
	    isImage: function isImage(str) {
	      return str.indexOf('image') !== -1;
	    },
	    handleClick: function handleClick() {
	      if (!this.disabled) {
	        this.$refs.input.click();
	      }
	    },
	    handleChange: function handleChange(ev) {
	      var files = ev.target.files;
	      this.file = files;

	      this.onStart(files);

	      var formNode = this.getFormNode();
	      var dataSpan = this.getFormDataNode();
	      var data = this.data;
	      if (typeof data === 'function') {
	        data = data(files);
	      }
	      var inputs = [];
	      for (var key in data) {
	        if (data.hasOwnProperty(key)) {
	          inputs.push('<input name="' + key + '" value="' + data[key] + '"/>');
	        }
	      }
	      dataSpan.innerHTML = inputs.join('');
	      formNode.submit();
	      dataSpan.innerHTML = '';
	      this.disabled = true;
	    },
	    onLoad: function onLoad() {
	      var response = void 0;
	      var eventFile = this.file;
	      if (!eventFile) {
	        return;
	      }
	      try {
	        var doc = this.getIframeDocument();
	        var script = doc.getElementsByTagName('script')[0];
	        if (script && script.parentNode === doc.body) {
	          doc.body.removeChild(script);
	        }
	        response = doc.body.innerHTML;
	        this.onSuccess(response, eventFile);
	      } catch (err) {
	        console.log(err);
	        console.warn(false, 'cross domain error for Upload');
	        this.onError(err, eventFile);
	      }
	      this.resetIframe();
	      this.disabled = false;
	    },
	    onDrop: function onDrop(e) {
	      e.preventDefault();
	      this.dragOver = false;
	      this.uploadFiles(e.dataTransfer.files);
	    },
	    handleDragover: function handleDragover(e) {
	      e.preventDefault();
	      this.onDrop = true;
	    },
	    handleDragleave: function handleDragleave(e) {
	      e.preventDefault();
	      this.onDrop = false;
	    },
	    getIframeNode: function getIframeNode() {
	      return this.$refs.iframe;
	    },
	    getIframeDocument: function getIframeDocument() {
	      return this.getIframeNode().contentDocument;
	    },
	    getFormNode: function getFormNode() {
	      return this.$refs.form;
	    },
	    getFormDataNode: function getFormDataNode() {
	      return this.$refs.data;
	    }
	  },

	  render: function render(h) {
	    var cover = h(
	      'cover',
	      {
	        attrs: { image: this.lastestFile, onPreview: this.onPreview, onRemove: this.onRemove }
	      },
	      []
	    );
	    var frameName = 'frame-' + Date.now();
	    return h(
	      'div',
	      {
	        'class': {
	          'el-upload__inner': true,
	          'el-dragger': this.type === 'drag',
	          'is-dragOver': this.dragOver,
	          'is-showCover': this.showCover
	        },
	        on: {
	          click: this.handleClick
	        },
	        nativeOn: {
	          drop: this.onDrop,
	          dragover: this.handleDragover,
	          dragleave: this.handleDragleave
	        }
	      },
	      [h(
	        'iframe',
	        {
	          ref: 'iframe',
	          on: {
	            load: this.onLoad
	          },
	          attrs: {
	            name: frameName
	          }
	        },
	        []
	      ), h(
	        'form',
	        { ref: 'form', attrs: { action: this.action, target: frameName, enctype: 'multipart/form-data', method: 'POST' }
	        },
	        [h(
	          'input',
	          {
	            'class': 'el-upload__input',
	            attrs: { type: 'file',

	              name: 'file',

	              multiple: this.multiple,
	              accept: this.accept },
	            ref: 'input', on: {
	              change: this.handleChange
	            }
	          },
	          []
	        ), h(
	          'input',
	          {
	            attrs: { type: 'hidden', name: 'documentDomain', value: document.domain }
	          },
	          []
	        ), h(
	          'span',
	          { ref: 'data' },
	          []
	        )]
	      ), !this.showCover ? this.$slots.default : cover]
	    );
	  }
	};

/***/ },
/* 293 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ElProgress = __webpack_require__(294);

	ElProgress.install = function (Vue) {
	  Vue.component(ElProgress.name, ElProgress);
	};

	module.exports = ElProgress;

/***/ },
/* 294 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(295)

	/* template */
	var __vue_template__ = __webpack_require__(296)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 295 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports.default = {
	  name: 'ElProgress',
	  props: {
	    type: {
	      type: String,
	      default: 'line',
	      validator: function validator(val) {
	        return ['line', 'circle'].indexOf(val) > -1;
	      }
	    },
	    size: {
	      type: String,
	      validator: function validator(val) {
	        return !val || ['large', 'small'].indexOf(val) > -1;
	      }
	    },
	    percentage: {
	      type: Number,
	      default: 0,
	      required: true,
	      validator: function validator(val) {
	        return val >= 0 && val <= 100;
	      }
	    },
	    status: {
	      type: String
	    },
	    strokeWidth: {
	      type: Number,
	      default: 6
	    },
	    textInside: {
	      type: Boolean,
	      default: false
	    },
	    width: {
	      type: Number,
	      default: 126
	    },
	    showText: {
	      type: Boolean,
	      default: true
	    }
	  },
	  computed: {
	    barStyle: function barStyle() {
	      var style = {};
	      style.width = this.percentage + '%';
	      return style;
	    },
	    relativeStrokeWidth: function relativeStrokeWidth() {
	      return (this.strokeWidth / this.width * 100).toFixed(1);
	    },
	    trackPath: function trackPath() {
	      var radius = parseInt(50 - parseFloat(this.relativeStrokeWidth) / 2, 10);

	      return 'M 50 50 m 0 -' + radius + ' a ' + radius + ' ' + radius + ' 0 1 1 0 ' + radius * 2 + ' a ' + radius + ' ' + radius + ' 0 1 1 0 -' + radius * 2;
	    },
	    perimeter: function perimeter() {
	      var radius = 50 - parseFloat(this.relativeStrokeWidth) / 2;
	      return 2 * Math.PI * radius;
	    },
	    circlePathStyle: function circlePathStyle() {
	      var perimeter = this.perimeter;
	      return {
	        strokeDasharray: perimeter + 'px,' + perimeter + 'px',
	        strokeDashoffset: (1 - this.percentage / 100) * perimeter + 'px',
	        transition: 'stroke-dashoffset 0.6s ease 0s, stroke 0.6s ease'
	      };
	    },
	    stroke: function stroke() {
	      var ret;
	      switch (this.status) {
	        case 'success':
	          ret = '#13ce66';
	          break;
	        case 'exception':
	          ret = '#ff4949';
	          break;
	        default:
	          ret = '#20a0ff';
	      }
	      return ret;
	    },
	    iconClass: function iconClass() {
	      if (this.type === 'line') {
	        return this.status === 'success' ? 'el-icon-circle-check' : 'el-icon-circle-cross';
	      } else {
	        return this.status === 'success' ? 'el-icon-check' : 'el-icon-close';
	      }
	    },
	    progressTextSize: function progressTextSize() {
	      return this.type === 'line' ? 12 + this.strokeWidth * 0.4 : this.width * 0.111111 + 2;
	    }
	  }
	};

/***/ },
/* 296 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('div', {
	    staticClass: "el-progress",
	    class: [
	      'el-progress--' + type,
	      status ? 'is-' + status : '', {
	        'el-progress--without-text': !showText,
	        'el-progress--text-inside': textInside,
	      }
	    ]
	  }, [(type === 'line') ? _h('div', {
	    staticClass: "el-progress-bar"
	  }, [_h('div', {
	    staticClass: "el-progress-bar__outer",
	    style: ({
	      height: strokeWidth + 'px'
	    })
	  }, [_h('div', {
	    staticClass: "el-progress-bar__inner",
	    style: (barStyle)
	  }, [(showText && textInside) ? _h('div', {
	    staticClass: "el-progress-bar__innerText"
	  }, [_s(percentage) + "%"]) : _e()])])]) : _h('div', {
	    staticClass: "el-progress-circle",
	    style: ({
	      height: width + 'px',
	      width: width + 'px'
	    })
	  }, [_h('svg', {
	    attrs: {
	      "viewBox": "0 0 100 100"
	    }
	  }, [_h('path', {
	    staticClass: "el-progress-circle__track",
	    attrs: {
	      "d": trackPath,
	      "stroke": "#e5e9f2",
	      "stroke-width": relativeStrokeWidth,
	      "fill": "none"
	    }
	  }), " ", _h('path', {
	    staticClass: "el-progress-circle__path",
	    style: (circlePathStyle),
	    attrs: {
	      "d": trackPath,
	      "stroke-linecap": "round",
	      "stroke": stroke,
	      "stroke-width": relativeStrokeWidth,
	      "fill": "none"
	    }
	  })])]), " ", " ", (showText && !textInside) ? _h('div', {
	    staticClass: "el-progress__text",
	    style: ({
	      fontSize: progressTextSize + 'px'
	    })
	  }, [(!status) ? [_s(percentage) + "%"] : _h('i', {
	    class: iconClass
	  }), " "]) : _e()])
	}},staticRenderFns: []}

/***/ },
/* 297 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ElSpinner = __webpack_require__(298);

	ElSpinner.install = function (Vue) {
	  Vue.component(ElSpinner.name, ElSpinner);
	};

	module.exports = ElSpinner;

/***/ },
/* 298 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(299)

	/* template */
	var __vue_template__ = __webpack_require__(300)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 299 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports.default = {
	  name: 'ElSpinner',
	  props: {
	    type: String,
	    radius: {
	      type: Number,
	      default: 100
	    },
	    strokeWidth: {
	      type: Number,
	      default: 5
	    },
	    strokeColor: {
	      type: String,
	      default: '#efefef'
	    }
	  }
	};

/***/ },
/* 300 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('span', {
	    staticClass: "el-spinner"
	  }, [_h('svg', {
	    staticClass: "el-spinner-inner",
	    style: ({
	      width: radius / 2 + 'px',
	      height: radius / 2 + 'px'
	    }),
	    attrs: {
	      "viewBox": "0 0 50 50"
	    }
	  }, [_h('circle', {
	    staticClass: "path",
	    attrs: {
	      "cx": "25",
	      "cy": "25",
	      "r": "20",
	      "fill": "none",
	      "stroke": strokeColor,
	      "stroke-width": strokeWidth
	    }
	  })])])
	}},staticRenderFns: []}

/***/ },
/* 301 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _main = __webpack_require__(302);

	var _main2 = _interopRequireDefault(_main);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	module.exports = _main2.default;

/***/ },
/* 302 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _vue = __webpack_require__(8);

	var _vue2 = _interopRequireDefault(_vue);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var MessageConstructor = _vue2.default.extend(__webpack_require__(303));

	var instance = void 0;
	var instances = [];
	var seed = 1;

	var Message = function Message(options) {
	  options = options || {};
	  if (typeof options === 'string') {
	    options = {
	      message: options
	    };
	  }
	  var userOnClose = options.onClose;
	  var id = 'message_' + seed++;

	  options.onClose = function () {
	    Message.close(id, userOnClose);
	  };

	  instance = new MessageConstructor({
	    data: options
	  });
	  instance.id = id;
	  instance.vm = instance.$mount();
	  document.body.appendChild(instance.vm.$el);
	  instance.vm.visible = true;
	  instance.dom = instance.vm.$el;
	  instances.push(instance);
	};

	['success', 'warning', 'info', 'error'].forEach(function (type) {
	  Message[type] = function (options) {
	    if (typeof options === 'string') {
	      options = {
	        message: options
	      };
	    }
	    options.type = type;
	    return Message(options);
	  };
	});

	Message.close = function (id, userOnClose) {
	  for (var i = 0, len = instances.length; i < len; i++) {
	    if (id === instances[i].id) {
	      if (typeof userOnClose === 'function') {
	        userOnClose(instances[i]);
	      }
	      instances.splice(i, 1);
	      break;
	    }
	  }
	};

	exports.default = Message;

/***/ },
/* 303 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(304)

	/* template */
	var __vue_template__ = __webpack_require__(310)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 304 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.default = {
	  data: function data() {
	    return {
	      visible: false,
	      message: '',
	      duration: 3000,
	      type: 'info',
	      onClose: null,
	      showClose: false,
	      closed: false,
	      timer: null
	    };
	  },


	  computed: {
	    typeImg: function typeImg() {
	      return __webpack_require__(305)("./" + this.type + '.svg');
	    }
	  },

	  watch: {
	    closed: function closed(newVal) {
	      var _this = this;

	      if (newVal) {
	        this.visible = false;
	        this.$el.addEventListener('transitionend', function () {
	          _this.$destroy(true);
	          _this.$el.parentNode.removeChild(_this.$el);
	        });
	      }
	    }
	  },

	  methods: {
	    handleClose: function handleClose() {
	      this.closed = true;
	      if (typeof this.onClose === 'function') {
	        this.onClose();
	      }
	    },
	    clearTimer: function clearTimer() {
	      clearTimeout(this.timer);
	    },
	    startTimer: function startTimer() {
	      var _this2 = this;

	      if (this.duration > 0) {
	        this.timer = setTimeout(function () {
	          if (!_this2.closed) {
	            _this2.handleClose();
	          }
	        }, this.duration);
	      }
	    }
	  },

	  mounted: function mounted() {
	    this.startTimer();
	  }
	};

/***/ },
/* 305 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./error.svg": 306,
		"./info.svg": 307,
		"./success.svg": 308,
		"./warning.svg": 309
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 305;


/***/ },
/* 306 */
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjQwcHgiIGhlaWdodD0iNDBweCIgdmlld0JveD0iMCAwIDQwIDQwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzOS4xICgzMTcyMCkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8dGl0bGU+aWNvbl9kYW5nZXI8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZGVmcz48L2RlZnM+CiAgICA8ZyBpZD0iRWxlbWVudC1ndWlkZWxpbmUtdjAuMi40IiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iTWVzc2FnZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTYwLjAwMDAwMCwgLTMzMi4wMDAwMDApIj4KICAgICAgICAgICAgPGcgaWQ9IuW4puWAvuWQkV/kv6Hmga8iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDYwLjAwMDAwMCwgMzMyLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9IlJlY3RhbmdsZS0yIj4KICAgICAgICAgICAgICAgICAgICA8ZyBpZD0iaWNvbl9kYW5nZXIiPgogICAgICAgICAgICAgICAgICAgICAgICA8cmVjdCBpZD0iUmVjdGFuZ2xlLTIiIGZpbGw9IiNGRjQ5NDkiIHg9IjAiIHk9IjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PC9yZWN0PgogICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMjUuODE3MjYyNywxNi4zNDUxNzk2IEMyNS45MzkwOTAyLDE2LjIyMzM0ODMgMjYsMTYuMDc2MTQxOCAyNiwxNS45MDM1NTIzIEMyNiwxNS43MzA5NjI4IDI1LjkzOTA5MDIsMTUuNTgzNzU2MyAyNS44MTcyNjI3LDE1LjQ2MTkyODkgTDI0LjUwNzYxNTcsMTQuMTgyNzQxMSBDMjQuMzg1Nzg4MiwxNC4wNjA5MTM3IDI0LjI0MzY1NzUsMTQgMjQuMDgxMjE5NiwxNCBDMjMuOTE4NzgxNywxNCAyMy43NzY2NTEsMTQuMDYwOTEzNyAyMy42NTQ4MjM1LDE0LjE4Mjc0MTEgTDIwLDE3LjgzNzU2MzUgTDE2LjMxNDcyMTYsMTQuMTgyNzQxMSBDMTYuMTkyODkwMiwxNC4wNjA5MTM3IDE2LjA1MDc1OTUsMTQgMTUuODg4MzIxNiwxNCBDMTUuNzI1ODg3NiwxNCAxNS41ODM3NTY5LDE0LjA2MDkxMzcgMTUuNDYxOTI5NCwxNC4xODI3NDExIEwxNC4xNTIyODI0LDE1LjQ2MTkyODkgQzE0LjA1MDc1ODIsMTUuNTgzNzU2MyAxNCwxNS43MzA5NjI4IDE0LDE1LjkwMzU1MjMgQzE0LDE2LjA3NjE0MTggMTQuMDUwNzU4MiwxNi4yMjMzNDgzIDE0LjE1MjI4MjQsMTYuMzQ1MTc5NiBMMTcuODM3NTYwOCwyMC4wMDAwMDE5IEwxNC4xNTIyODI0LDIzLjY1NDgyNDMgQzE0LjA1MDc1ODIsMjMuNzc2NjUxNyAxNCwyMy45MjM4NTgyIDE0LDI0LjA5NjQ0NzcgQzE0LDI0LjI2OTAzNzIgMTQuMDUwNzU4MiwyNC40MTYyNDM3IDE0LjE1MjI4MjQsMjQuNTM4MDcxMSBMMTUuNDYxOTI5NCwyNS44MTcyNTg5IEMxNS41ODM3NTY5LDI1LjkzOTA4NjMgMTUuNzI1ODg3NiwyNiAxNS44ODgzMjE2LDI2IEMxNi4wNTA3NTk1LDI2IDE2LjE5Mjg5MDIsMjUuOTM5MDg2MyAxNi4zMTQ3MjE2LDI1LjgxNzI1ODkgTDIwLDIyLjE2MjQzNjUgTDIzLjY1NDgyMzUsMjUuODE3MjU4OSBDMjMuNzc2NjUxLDI1LjkzOTA4NjMgMjMuOTE4NzgxNywyNiAyNC4wODEyMTk2LDI2IEMyNC4yNDM2NTc1LDI2IDI0LjM4NTc4ODIsMjUuOTM5MDg2MyAyNC41MDc2MTU3LDI1LjgxNzI1ODkgTDI1LjgxNzI2MjcsMjQuNTM4MDcxMSBDMjUuOTM5MDkwMiwyNC40MTYyNDM3IDI2LDI0LjI2OTAzNzIgMjYsMjQuMDk2NDQ3NyBDMjYsMjMuOTIzODU4MiAyNS45MzkwOTAyLDIzLjc3NjY1MTcgMjUuODE3MjYyNywyMy42NTQ4MjQzIEwyMi4xMzE5ODA0LDIwLjAwMDAwMTkgTDI1LjgxNzI2MjcsMTYuMzQ1MTc5NiBaIiBpZD0iUGF0aCIgZmlsbD0iI0ZGRkZGRiI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+"

/***/ },
/* 307 */
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjQwcHgiIGhlaWdodD0iNDBweCIgdmlld0JveD0iMCAwIDQwIDQwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzOS4xICgzMTcyMCkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8dGl0bGU+aWNvbl9pbmZvPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGRlZnM+PC9kZWZzPgogICAgPGcgaWQ9IkVsZW1lbnQtZ3VpZGVsaW5lLXYwLjIuNCIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9Ik1lc3NhZ2UiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC02MC4wMDAwMDAsIC0xNTIuMDAwMDAwKSI+CiAgICAgICAgICAgIDxnIGlkPSLluKblgL7lkJFf5L+h5oGvIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2MC4wMDAwMDAsIDE1Mi4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxnIGlkPSJSZWN0YW5nbGUtMiI+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9Imljb25faW5mbyI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGUtMiIgZmlsbD0iIzUwQkZGRiIgeD0iMCIgeT0iMCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIj48L3JlY3Q+CiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0yMS42MTUzODQ2LDI2LjU0MzIwOTkgQzIxLjYxNTM4NDYsMjYuOTQ3ODc1MSAyMS40NTgzMzQ4LDI3LjI5MTgzNjggMjEuMTQ0MjMwOCwyNy41NzUxMDI5IEMyMC44MzAxMjY4LDI3Ljg1ODM2ODkgMjAuNDQ4NzE5NCwyOCAyMCwyOCBDMTkuNTUxMjgwNiwyOCAxOS4xNjk4NzMyLDI3Ljg1ODM2ODkgMTguODU1NzY5MiwyNy41NzUxMDI5IEMxOC41NDE2NjUyLDI3LjI5MTgzNjggMTguMzg0NjE1NCwyNi45NDc4NzUxIDE4LjM4NDYxNTQsMjYuNTQzMjA5OSBMMTguMzg0NjE1NCwxOS43NDQ4NTYgQzE4LjM4NDYxNTQsMTkuMzQwMTkwNyAxOC41NDE2NjUyLDE4Ljk5NjIyOSAxOC44NTU3NjkyLDE4LjcxMjk2MyBDMTkuMTY5ODczMiwxOC40Mjk2OTY5IDE5LjU1MTI4MDYsMTguMjg4MDY1OCAyMCwxOC4yODgwNjU4IEMyMC40NDg3MTk0LDE4LjI4ODA2NTggMjAuODMwMTI2OCwxOC40Mjk2OTY5IDIxLjE0NDIzMDgsMTguNzEyOTYzIEMyMS40NTgzMzQ4LDE4Ljk5NjIyOSAyMS42MTUzODQ2LDE5LjM0MDE5MDcgMjEuNjE1Mzg0NiwxOS43NDQ4NTYgTDIxLjYxNTM4NDYsMjYuNTQzMjA5OSBaIE0yMCwxNS44MDQyOTgxIEMxOS40NDQ0NDI3LDE1LjgwNDI5ODEgMTguOTcyMjI0LDE1LjYxOTM2ODcgMTguNTgzMzMzMywxNS4yNDk1MDQ2IEMxOC4xOTQ0NDI3LDE0Ljg3OTY0MDYgMTgsMTQuNDMwNTI1NSAxOCwxMy45MDIxNDkxIEMxOCwxMy4zNzM3NzI2IDE4LjE5NDQ0MjcsMTIuOTI0NjU3NSAxOC41ODMzMzMzLDEyLjU1NDc5MzUgQzE4Ljk3MjIyNCwxMi4xODQ5Mjk1IDE5LjQ0NDQ0MjcsMTIgMjAsMTIgQzIwLjU1NTU1NzMsMTIgMjEuMDI3Nzc2LDEyLjE4NDkyOTUgMjEuNDE2NjY2NywxMi41NTQ3OTM1IEMyMS44MDU1NTczLDEyLjkyNDY1NzUgMjIsMTMuMzczNzcyNiAyMiwxMy45MDIxNDkxIEMyMiwxNC40MzA1MjU1IDIxLjgwNTU1NzMsMTQuODc5NjQwNiAyMS40MTY2NjY3LDE1LjI0OTUwNDYgQzIxLjAyNzc3NiwxNS42MTkzNjg3IDIwLjU1NTU1NzMsMTUuODA0Mjk4MSAyMCwxNS44MDQyOTgxIFoiIGlkPSJDb21iaW5lZC1TaGFwZSIgZmlsbD0iI0ZGRkZGRiI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+"

/***/ },
/* 308 */
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjQwcHgiIGhlaWdodD0iNDBweCIgdmlld0JveD0iMCAwIDQwIDQwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzOS4xICgzMTcyMCkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8dGl0bGU+aWNvbl9zdWNjZXNzPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGRlZnM+PC9kZWZzPgogICAgPGcgaWQ9IkVsZW1lbnQtZ3VpZGVsaW5lLXYwLjIuNCIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9Ik1lc3NhZ2UiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC02MC4wMDAwMDAsIC0yMTIuMDAwMDAwKSI+CiAgICAgICAgICAgIDxnIGlkPSLluKblgL7lkJFf5L+h5oGvIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2MC4wMDAwMDAsIDIxMi4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxnIGlkPSJSZWN0YW5nbGUtMiI+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9Imljb25fc3VjY2VzcyI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGUtMiIgZmlsbD0iIzEzQ0U2NiIgeD0iMCIgeT0iMCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIj48L3JlY3Q+CiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0yNy44MjU1ODE0LDE3LjE0ODQzNTcgTDE5LjAxNzQ0LDI1LjgyODEyMTMgQzE4LjkwMTE2MDksMjUuOTQyNzA4MyAxOC43NjU1MDMzLDI2IDE4LjYxMDQ2NywyNiBDMTguNDU1NDI3LDI2IDE4LjMxOTc2OTMsMjUuOTQyNzA4MyAxOC4yMDM0ODY1LDI1LjgyODEyMTMgTDE4LjAyOTA3MTYsMjUuNjU2MjUgTDEzLjE3NDQxODYsMjAuODQzNzUgQzEzLjA1ODEzOTUsMjAuNzI5MTYzIDEzLDIwLjU5NTQ4MzcgMTMsMjAuNDQyNzA0NyBDMTMsMjAuMjg5OTI5MyAxMy4wNTgxMzk1LDIwLjE1NjI1IDEzLjE3NDQxODYsMjAuMDQxNjY2NyBMMTQuMzY2Mjc3MiwxOC44NjcxODU3IEMxNC40ODI1NiwxOC43NTI2MDIzIDE0LjYxODIxNzcsMTguNjk1MzEwNyAxNC43NzMyNTc3LDE4LjY5NTMxMDcgQzE0LjkyODI5NCwxOC42OTUzMTA3IDE1LjA2Mzk1MTYsMTguNzUyNjAyMyAxNS4xODAyMzA3LDE4Ljg2NzE4NTcgTDE4LjYxMDQ2NywyMi4yNzYwMzggTDI1LjgxOTc2OTMsMTUuMTcxODcxMyBDMjUuOTM2MDQ4NCwxNS4wNTcyODggMjYuMDcxNzA2LDE1IDI2LjIyNjc0MjMsMTUgQzI2LjM4MTc4MjMsMTUgMjYuNTE3NDQsMTUuMDU3Mjg4IDI2LjYzMzcyMjgsMTUuMTcxODcxMyBMMjcuODI1NTgxNCwxNi4zNDYzNTIzIEMyNy45NDE4NjA1LDE2LjQ2MDkzNTcgMjgsMTYuNTk0NjE1IDI4LDE2Ljc0NzM5NCBDMjgsMTYuOTAwMTczIDI3Ljk0MTg2MDUsMTcuMDMzODUyMyAyNy44MjU1ODE0LDE3LjE0ODQzNTcgTDI3LjgyNTU4MTQsMTcuMTQ4NDM1NyBaIiBpZD0iUGF0aCIgZmlsbD0iI0ZGRkZGRiI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+"

/***/ },
/* 309 */
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjQwcHgiIGhlaWdodD0iNDBweCIgdmlld0JveD0iMCAwIDQwIDQwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzOS4xICgzMTcyMCkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8dGl0bGU+aWNvbl93YXJuaW5nPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGRlZnM+PC9kZWZzPgogICAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9Ik1lc3NhZ2UiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC02MC4wMDAwMDAsIC0yNzIuMDAwMDAwKSI+CiAgICAgICAgICAgIDxnIGlkPSLluKblgL7lkJFf5L+h5oGvLWNvcHkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDYwLjAwMDAwMCwgMjcyLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9IlJlY3RhbmdsZS0yIj4KICAgICAgICAgICAgICAgICAgICA8ZyBpZD0iaWNvbl93YXJuaW5nIj4KICAgICAgICAgICAgICAgICAgICAgICAgPHJlY3QgaWQ9IlJlY3RhbmdsZS0yIiBmaWxsPSIjRjdCQTJBIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiPjwvcmVjdD4KICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTIxLjYxNTM4NDYsMjYuNTQzMjA5OSBDMjEuNjE1Mzg0NiwyNi45NDc4NzUxIDIxLjQ1ODMzNDgsMjcuMjkxODM2OCAyMS4xNDQyMzA4LDI3LjU3NTEwMjkgQzIwLjgzMDEyNjgsMjcuODU4MzY4OSAyMC40NDg3MTk0LDI4IDIwLDI4IEMxOS41NTEyODA2LDI4IDE5LjE2OTg3MzIsMjcuODU4MzY4OSAxOC44NTU3NjkyLDI3LjU3NTEwMjkgQzE4LjU0MTY2NTIsMjcuMjkxODM2OCAxOC4zODQ2MTU0LDI2Ljk0Nzg3NTEgMTguMzg0NjE1NCwyNi41NDMyMDk5IEwxOC4zODQ2MTU0LDE5Ljc0NDg1NiBDMTguMzg0NjE1NCwxOS4zNDAxOTA3IDE4LjU0MTY2NTIsMTguOTk2MjI5IDE4Ljg1NTc2OTIsMTguNzEyOTYzIEMxOS4xNjk4NzMyLDE4LjQyOTY5NjkgMTkuNTUxMjgwNiwxOC4yODgwNjU4IDIwLDE4LjI4ODA2NTggQzIwLjQ0ODcxOTQsMTguMjg4MDY1OCAyMC44MzAxMjY4LDE4LjQyOTY5NjkgMjEuMTQ0MjMwOCwxOC43MTI5NjMgQzIxLjQ1ODMzNDgsMTguOTk2MjI5IDIxLjYxNTM4NDYsMTkuMzQwMTkwNyAyMS42MTUzODQ2LDE5Ljc0NDg1NiBMMjEuNjE1Mzg0NiwyNi41NDMyMDk5IFogTTIwLDE1LjgwNDI5ODEgQzE5LjQ0NDQ0MjcsMTUuODA0Mjk4MSAxOC45NzIyMjQsMTUuNjE5MzY4NyAxOC41ODMzMzMzLDE1LjI0OTUwNDYgQzE4LjE5NDQ0MjcsMTQuODc5NjQwNiAxOCwxNC40MzA1MjU1IDE4LDEzLjkwMjE0OTEgQzE4LDEzLjM3Mzc3MjYgMTguMTk0NDQyNywxMi45MjQ2NTc1IDE4LjU4MzMzMzMsMTIuNTU0NzkzNSBDMTguOTcyMjI0LDEyLjE4NDkyOTUgMTkuNDQ0NDQyNywxMiAyMCwxMiBDMjAuNTU1NTU3MywxMiAyMS4wMjc3NzYsMTIuMTg0OTI5NSAyMS40MTY2NjY3LDEyLjU1NDc5MzUgQzIxLjgwNTU1NzMsMTIuOTI0NjU3NSAyMiwxMy4zNzM3NzI2IDIyLDEzLjkwMjE0OTEgQzIyLDE0LjQzMDUyNTUgMjEuODA1NTU3MywxNC44Nzk2NDA2IDIxLjQxNjY2NjcsMTUuMjQ5NTA0NiBDMjEuMDI3Nzc2LDE1LjYxOTM2ODcgMjAuNTU1NTU3MywxNS44MDQyOTgxIDIwLDE1LjgwNDI5ODEgWiIgaWQ9IkNvbWJpbmVkLVNoYXBlIiBmaWxsPSIjRkZGRkZGIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMC4wMDAwMDAsIDIwLjAwMDAwMCkgc2NhbGUoMSwgLTEpIHRyYW5zbGF0ZSgtMjAuMDAwMDAwLCAtMjAuMDAwMDAwKSAiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg=="

/***/ },
/* 310 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('transition', {
	    attrs: {
	      "name": "el-message-fade"
	    }
	  }, [_h('div', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (visible),
	      expression: "visible"
	    }],
	    staticClass: "el-message",
	    on: {
	      "mouseenter": clearTimer,
	      "mouseleave": startTimer
	    }
	  }, [_h('img', {
	    staticClass: "el-message__icon",
	    attrs: {
	      "src": typeImg,
	      "alt": ""
	    }
	  }), " ", _h('div', {
	    staticClass: "el-message__group"
	  }, [_h('p', [_s(message)]), " ", (showClose) ? _h('div', {
	    staticClass: "el-message__closeBtn el-icon-close",
	    on: {
	      "click": handleClose
	    }
	  }) : _e()])])])
	}},staticRenderFns: []}

/***/ },
/* 311 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Badge = __webpack_require__(312);

	Badge.install = function (Vue) {
	  Vue.component(Badge.name, Badge);
	};

	module.exports = Badge;

/***/ },
/* 312 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(313)

	/* template */
	var __vue_template__ = __webpack_require__(314)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 313 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports.default = {
	  name: 'el-badge',

	  props: {
	    value: {},
	    max: Number,
	    isDot: Boolean
	  },

	  computed: {
	    content: function content() {
	      if (this.isDot) return;

	      var value = this.value;
	      var max = this.max;

	      if (typeof value === 'number' && typeof max === 'number') {
	        return max < value ? max + '+' : value;
	      }

	      return value;
	    }
	  }
	};

/***/ },
/* 314 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('div', {
	    staticClass: "el-badge"
	  }, [_t("default"), " ", _h('sup', {
	    staticClass: "el-badge__content",
	    class: {
	      'is-fixed': $slots.default, 'is-dot': isDot
	    },
	    domProps: {
	      "textContent": _s(content)
	    }
	  })])
	}},staticRenderFns: []}

/***/ },
/* 315 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Card = __webpack_require__(316);

	Card.install = function (Vue) {
	  Vue.component(Card.name, Card);
	};

	module.exports = Card;

/***/ },
/* 316 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(317)

	/* template */
	var __vue_template__ = __webpack_require__(318)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 317 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports.default = {
	  name: 'el-card',

	  props: ['header', 'bodyStyle']
	};

/***/ },
/* 318 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('div', {
	    staticClass: "el-card"
	  }, [($slots.header) ? _h('div', {
	    staticClass: "el-card__header"
	  }, [_t("header", [_s(header)])]) : _e(), " ", _h('div', {
	    staticClass: "el-card__body",
	    style: (bodyStyle)
	  }, [_t("default")])])
	}},staticRenderFns: []}

/***/ },
/* 319 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Rate = __webpack_require__(320);

	Rate.install = function (Vue) {
	  Vue.component(Rate.name, Rate);
	};

	module.exports = Rate;

/***/ },
/* 320 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(321)

	/* template */
	var __vue_template__ = __webpack_require__(323)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 321 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _class = __webpack_require__(322);

	exports.default = {
	  name: 'el-rate',

	  data: function data() {
	    return {
	      classMap: {},
	      colorMap: {},
	      classes: null,
	      pointerAtLeftHalf: false,
	      currentValue: this.value,
	      hoverIndex: -1
	    };
	  },


	  props: {
	    value: {
	      type: Number,
	      default: 0
	    },
	    lowThreshold: {
	      type: Number,
	      default: 2
	    },
	    highThreshold: {
	      type: Number,
	      default: 4
	    },
	    max: {
	      type: Number,
	      default: 5
	    },
	    colors: {
	      type: Array,
	      default: function _default() {
	        return ['#F7BA2A', '#F7BA2A', '#F7BA2A'];
	      }
	    },
	    voidColor: {
	      type: String,
	      default: '#C6D1DE'
	    },
	    disabledVoidColor: {
	      type: String,
	      default: '#EFF2F7'
	    },
	    iconClasses: {
	      type: Array,
	      default: function _default() {
	        return ['el-icon-star-on', 'el-icon-star-on', 'el-icon-star-on'];
	      }
	    },
	    voidIconClass: {
	      type: String,
	      default: 'el-icon-star-off'
	    },
	    disabledVoidIconClass: {
	      type: String,
	      default: 'el-icon-star-on'
	    },
	    disabled: {
	      type: Boolean,
	      default: false
	    },
	    allowHalf: {
	      type: Boolean,
	      default: false
	    },
	    showText: {
	      type: Boolean,
	      default: false
	    },
	    textColor: {
	      type: String,
	      default: '1f2d3d'
	    },
	    texts: {
	      type: Array,
	      default: function _default() {
	        return ['极差', '失望', '一般', '满意', '惊喜'];
	      }
	    },
	    textTemplate: {
	      type: String,
	      default: '{value}'
	    }
	  },

	  computed: {
	    text: function text() {
	      var result = '';
	      if (this.disabled) {
	        result = this.textTemplate.replace(/\{\s*value\s*\}/, this.value);
	      } else {
	        result = this.texts[Math.ceil(this.currentValue) - 1];
	      }
	      return result;
	    },
	    decimalStyle: function decimalStyle() {
	      var width = '';
	      if (this.disabled) {
	        width = (this.valueDecimal < 50 ? 0 : 50) + '%';
	      }
	      if (this.allowHalf) {
	        width = '50%';
	      }
	      return {
	        color: this.activeColor,
	        width: width
	      };
	    },
	    valueDecimal: function valueDecimal() {
	      return this.value * 100 - Math.floor(this.value) * 100;
	    },
	    decimalIconClass: function decimalIconClass() {
	      return this.getValueFromMap(this.value, this.classMap);
	    },
	    voidClass: function voidClass() {
	      return this.disabled ? this.classMap.disabledVoidClass : this.classMap.voidClass;
	    },
	    activeClass: function activeClass() {
	      return this.getValueFromMap(this.currentValue, this.classMap);
	    },
	    activeColor: function activeColor() {
	      return this.getValueFromMap(this.currentValue, this.colorMap);
	    },
	    classes: function classes() {
	      var result = [];
	      var i = 0;
	      var threshold = this.currentValue;
	      if (this.allowHalf && this.currentValue !== Math.floor(this.currentValue)) {
	        threshold--;
	      }
	      for (; i < threshold; i++) {
	        result.push(this.activeClass);
	      }
	      for (; i < this.max; i++) {
	        result.push(this.voidClass);
	      }
	      return result;
	    }
	  },

	  watch: {
	    value: function value(val) {
	      this.$emit('change', val);
	      this.currentValue = val;
	    }
	  },

	  methods: {
	    getValueFromMap: function getValueFromMap(value, map) {
	      var result = '';
	      if (value <= this.lowThreshold) {
	        result = map.lowColor || map.lowClass;
	      } else if (value >= this.highThreshold) {
	        result = map.highColor || map.highClass;
	      } else {
	        result = map.mediumColor || map.mediumClass;
	      }
	      return result;
	    },
	    showDecimalIcon: function showDecimalIcon(item) {
	      var showWhenDisabled = this.disabled && this.valueDecimal > 0 && item - 1 < this.value && item > this.value;
	      var showWhenAllowHalf = this.allowHalf && this.pointerAtLeftHalf && (item - 0.5).toFixed(1) === this.currentValue.toFixed(1);
	      return showWhenDisabled || showWhenAllowHalf;
	    },
	    getIconStyle: function getIconStyle(item) {
	      var voidColor = this.disabled ? this.colorMap.disabledVoidColor : this.colorMap.voidColor;
	      return {
	        color: item <= this.currentValue ? this.activeColor : voidColor
	      };
	    },
	    selectValue: function selectValue(value) {
	      if (this.disabled) {
	        return;
	      }
	      if (this.allowHalf && this.pointerAtLeftHalf) {
	        this.$emit('input', this.currentValue);
	      } else {
	        this.$emit('input', value);
	      }
	    },
	    setCurrentValue: function setCurrentValue(value, event) {
	      if (this.disabled) {
	        return;
	      }
	      if (this.allowHalf) {
	        var target = event.target;
	        if ((0, _class.hasClass)(target, 'el-rate__item')) {
	          target = target.querySelector('.el-rate__icon');
	        }
	        if ((0, _class.hasClass)(target, 'el-rate__decimal')) {
	          target = target.parentNode;
	        }
	        this.pointerAtLeftHalf = event.offsetX * 2 <= target.clientWidth;
	        this.currentValue = this.pointerAtLeftHalf ? value - 0.5 : value;
	      } else {
	        this.currentValue = value;
	      }
	      this.hoverIndex = value;
	    },
	    resetCurrentValue: function resetCurrentValue() {
	      if (this.disabled) {
	        return;
	      }
	      if (this.allowHalf) {
	        this.pointerAtLeftHalf = this.value !== Math.floor(this.value);
	      }
	      this.currentValue = this.value;
	      this.hoverIndex = -1;
	    }
	  },

	  created: function created() {
	    if (!this.value) {
	      this.$emit('input', 0);
	    }
	    this.classMap = {
	      lowClass: this.iconClasses[0],
	      mediumClass: this.iconClasses[1],
	      highClass: this.iconClasses[2],
	      voidClass: this.voidIconClass,
	      disabledVoidClass: this.disabledVoidIconClass
	    };
	    this.colorMap = {
	      lowColor: this.colors[0],
	      mediumColor: this.colors[1],
	      highColor: this.colors[2],
	      voidColor: this.voidColor,
	      disabledVoidColor: this.disabledVoidColor
	    };
	  }
	};

/***/ },
/* 322 */
/***/ function(module, exports) {

	var trim = function (string) {
	  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
	};

	var hasClass = function (el, cls) {
	  if (!el || !cls) return false;
	  if (cls.indexOf(' ') != -1) throw new Error('className should not contain space.');
	  if (el.classList) {
	    return el.classList.contains(cls);
	  } else {
	    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
	  }
	};

	var addClass = function (el, cls) {
	  if (!el) return;
	  var curClass = el.className;
	  var classes = (cls || '').split(' ');

	  for (var i = 0, j = classes.length; i < j; i++) {
	    var clsName = classes[i];
	    if (!clsName) continue;

	    if (el.classList) {
	      el.classList.add(clsName);
	    } else {
	      if (!hasClass(el, clsName)) {
	        curClass += ' ' + clsName;
	      }
	    }
	  }
	  if (!el.classList) {
	    el.className = curClass;
	  }
	};

	var removeClass = function (el, cls) {
	  if (!el || !cls) return;
	  var classes = cls.split(' ');
	  var curClass = ' ' + el.className + ' ';

	  for (var i = 0, j = classes.length; i < j; i++) {
	    var clsName = classes[i];
	    if (!clsName) continue;

	    if (el.classList) {
	      el.classList.remove(clsName);
	    } else {
	      if (hasClass(el, clsName)) {
	        curClass = curClass.replace(' ' + clsName + ' ', ' ');
	      }
	    }
	  }
	  if (!el.classList) {
	    el.className = trim(curClass);
	  }
	};

	module.exports = {
	  hasClass: hasClass,
	  addClass: addClass,
	  removeClass: removeClass
	};

/***/ },
/* 323 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('div', {
	    staticClass: "el-rate"
	  }, [_l((max), function(item) {
	    return _h('span', {
	      staticClass: "el-rate__item",
	      style: ({
	        cursor: disabled ? 'auto' : 'pointer'
	      }),
	      on: {
	        "mousemove": function($event) {
	          setCurrentValue(item, $event)
	        },
	        "mouseleave": resetCurrentValue,
	        "click": function($event) {
	          selectValue(item)
	        }
	      }
	    }, [_h('i', {
	      staticClass: "el-rate__icon",
	      class: [classes[item - 1], {
	        'hover': hoverIndex === item
	      }],
	      style: (getIconStyle(item))
	    }, [(showDecimalIcon(item)) ? _h('i', {
	      staticClass: "el-rate__decimal",
	      class: decimalIconClass,
	      style: (decimalStyle)
	    }) : _e()])])
	  }), " ", (showText) ? _h('span', {
	    staticClass: "el-rate__text",
	    style: ({
	      color: textColor
	    })
	  }, [_s(text)]) : _e()])
	}},staticRenderFns: []}

/***/ },
/* 324 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Steps = __webpack_require__(325);

	Steps.install = function (Vue) {
	  Vue.component(Steps.name, Steps);
	};

	module.exports = Steps;

/***/ },
/* 325 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(326)

	/* template */
	var __vue_template__ = __webpack_require__(327)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 326 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports.default = {
	  name: 'el-steps',

	  props: {
	    space: Number,
	    active: Number,
	    direction: {
	      type: String,
	      default: 'horizontal'
	    },
	    finishStatus: {
	      type: String,
	      default: 'finish'
	    },
	    processStatus: {
	      type: String,
	      default: 'process'
	    }
	  },

	  data: function data() {
	    return {
	      steps: []
	    };
	  },


	  watch: {
	    active: function active(newVal, oldVal) {
	      this.$emit('change', newVal, oldVal);
	    }
	  },

	  mounted: function mounted() {
	    this.steps.forEach(function (child, index) {
	      child.index = index;
	    });
	  }
	};

/***/ },
/* 327 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('div', {
	    staticClass: "el-steps",
	    class: ['is-' + direction]
	  }, [_t("default")])
	}},staticRenderFns: []}

/***/ },
/* 328 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Step = __webpack_require__(329);

	Step.install = function (Vue) {
	  Vue.component(Step.name, Step);
	};

	module.exports = Step;

/***/ },
/* 329 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__

	/* script */
	__vue_exports__ = __webpack_require__(330)

	/* template */
	var __vue_template__ = __webpack_require__(331)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}
	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ },
/* 330 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports.default = {
	  name: 'el-step',

	  props: {
	    title: String,
	    icon: String,
	    description: String,
	    status: {
	      type: String,
	      default: 'wait'
	    }
	  },

	  data: function data() {
	    return {
	      index: -1,
	      style: {},
	      lineStyle: {},
	      mainOffset: 0,
	      currentStatus: this.status
	    };
	  },
	  created: function created() {
	    this.$parent.steps.push(this);
	  },


	  methods: {
	    updateStatus: function updateStatus(val) {
	      var prevChild = this.$parent.$children[this.index - 1];

	      if (val > this.index) {
	        this.currentStatus = this.$parent.finishStatus;
	      } else if (val === this.index) {
	        this.currentStatus = this.$parent.processStatus;
	      } else {
	        this.currentStatus = 'wait';
	      }

	      if (prevChild) prevChild.calcProgress(this.currentStatus);
	    },
	    calcProgress: function calcProgress(status) {
	      var step = 100;
	      var style = {};

	      style.transitionDelay = 150 * this.index + 'ms';
	      if (status === this.$parent.processStatus) {
	        step = 50;
	      } else if (status === 'wait') {
	        step = 0;
	        style.transitionDelay = -150 * this.index + 'ms';
	      }

	      this.$parent.direction === 'vertical' ? style.height = step + '%' : style.width = step + '%';

	      this.lineStyle = style;
	    }
	  },

	  mounted: function mounted() {
	    var _this = this;

	    var parent = this.$parent;
	    var space = parent.space ? parent.space + 'px' : 100 / parent.steps.length + '%';

	    if (parent.direction === 'horizontal') {
	      this.style = { width: space };
	    } else {
	      if (parent.steps[parent.steps.length - 1] !== this) {
	        this.style = { height: space };
	      }
	    }

	    var unwatch = this.$watch('index', function (val) {
	      _this.$watch('$parent.active', _this.updateStatus, { immediate: true });
	      unwatch();
	    });
	  }
	};

/***/ },
/* 331 */
/***/ function(module, exports) {

	module.exports={render:function (){with(this) {
	  return _h('div', {
	    staticClass: "el-step",
	    class: ['is-' + $parent.direction],
	    style: (style)
	  }, [_h('div', {
	    staticClass: "el-step__head",
	    class: ['is-' + currentStatus, {
	      'is-text': !icon
	    }]
	  }, [_h('div', {
	    staticClass: "el-step__line",
	    class: ['is-' + $parent.direction, {
	      'is-icon': icon
	    }]
	  }, [_h('i', {
	    staticClass: "el-step__line-inner",
	    style: (lineStyle)
	  })]), " ", _h('span', {
	    staticClass: "el-step__icon"
	  }, [(currentStatus !== 'success' && currentStatus !== 'error') ? _t("icon", [(icon) ? _h('i', {
	    class: ['el-icon-' + icon]
	  }) : _h('div', [_s(index + 1)]), " "]) : _h('i', {
	    class: ['el-icon-' + (currentStatus === 'success' ? 'check' : 'close')]
	  }), " "])]), " ", _h('div', {
	    staticClass: "el-step__main",
	    style: ({
	      marginLeft: mainOffset
	    })
	  }, [_h('div', {
	    ref: "title",
	    staticClass: "el-step__title",
	    class: ['is-' + currentStatus]
	  }, [_t("title", [_s(title)])]), " ", _h('div', {
	    staticClass: "el-step__description",
	    class: ['is-' + currentStatus]
	  }, [_t("description", [_s(description)])])])])
	}},staticRenderFns: []}

/***/ }
/******/ ]);

/***/ },
/* 8 */
/***/ function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* styles */
__webpack_require__(63)

/* script */
__vue_exports__ = __webpack_require__(12)

/* template */
var __vue_template__ = __webpack_require__(51)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/teddyzhu/Documents/JavaWork/code/lc4e/src/main/webapp/WEB-INF/views/themes/default/src/app.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-53b92194", __vue_options__)
  } else {
    hotAPI.reload("data-v-53b92194", __vue_options__)
  }
})()}
if (__vue_options__.functional) {console.error("[vue-loader] app.vue: functional components are not supported and should be defined in plain js files using render functions.")}

module.exports = __vue_exports__


/***/ },
/* 10 */
/***/ function(module, exports) {

"use strict";
/*!
 * vue-resource v1.0.3
 * https://github.com/vuejs/vue-resource
 * Released under the MIT License.
 */

'use strict';

/**
 * Promises/A+ polyfill v1.1.4 (https://github.com/bramstein/promis)
 */

var RESOLVED = 0;
var REJECTED = 1;
var PENDING = 2;

function Promise$1(executor) {

    this.state = PENDING;
    this.value = undefined;
    this.deferred = [];

    var promise = this;

    try {
        executor(function (x) {
            promise.resolve(x);
        }, function (r) {
            promise.reject(r);
        });
    } catch (e) {
        promise.reject(e);
    }
}

Promise$1.reject = function (r) {
    return new Promise$1(function (resolve, reject) {
        reject(r);
    });
};

Promise$1.resolve = function (x) {
    return new Promise$1(function (resolve, reject) {
        resolve(x);
    });
};

Promise$1.all = function all(iterable) {
    return new Promise$1(function (resolve, reject) {
        var count = 0,
            result = [];

        if (iterable.length === 0) {
            resolve(result);
        }

        function resolver(i) {
            return function (x) {
                result[i] = x;
                count += 1;

                if (count === iterable.length) {
                    resolve(result);
                }
            };
        }

        for (var i = 0; i < iterable.length; i += 1) {
            Promise$1.resolve(iterable[i]).then(resolver(i), reject);
        }
    });
};

Promise$1.race = function race(iterable) {
    return new Promise$1(function (resolve, reject) {
        for (var i = 0; i < iterable.length; i += 1) {
            Promise$1.resolve(iterable[i]).then(resolve, reject);
        }
    });
};

var p$1 = Promise$1.prototype;

p$1.resolve = function resolve(x) {
    var promise = this;

    if (promise.state === PENDING) {
        if (x === promise) {
            throw new TypeError('Promise settled with itself.');
        }

        var called = false;

        try {
            var then = x && x['then'];

            if (x !== null && typeof x === 'object' && typeof then === 'function') {
                then.call(x, function (x) {
                    if (!called) {
                        promise.resolve(x);
                    }
                    called = true;
                }, function (r) {
                    if (!called) {
                        promise.reject(r);
                    }
                    called = true;
                });
                return;
            }
        } catch (e) {
            if (!called) {
                promise.reject(e);
            }
            return;
        }

        promise.state = RESOLVED;
        promise.value = x;
        promise.notify();
    }
};

p$1.reject = function reject(reason) {
    var promise = this;

    if (promise.state === PENDING) {
        if (reason === promise) {
            throw new TypeError('Promise settled with itself.');
        }

        promise.state = REJECTED;
        promise.value = reason;
        promise.notify();
    }
};

p$1.notify = function notify() {
    var promise = this;

    nextTick(function () {
        if (promise.state !== PENDING) {
            while (promise.deferred.length) {
                var deferred = promise.deferred.shift(),
                    onResolved = deferred[0],
                    onRejected = deferred[1],
                    resolve = deferred[2],
                    reject = deferred[3];

                try {
                    if (promise.state === RESOLVED) {
                        if (typeof onResolved === 'function') {
                            resolve(onResolved.call(undefined, promise.value));
                        } else {
                            resolve(promise.value);
                        }
                    } else if (promise.state === REJECTED) {
                        if (typeof onRejected === 'function') {
                            resolve(onRejected.call(undefined, promise.value));
                        } else {
                            reject(promise.value);
                        }
                    }
                } catch (e) {
                    reject(e);
                }
            }
        }
    });
};

p$1.then = function then(onResolved, onRejected) {
    var promise = this;

    return new Promise$1(function (resolve, reject) {
        promise.deferred.push([onResolved, onRejected, resolve, reject]);
        promise.notify();
    });
};

p$1.catch = function (onRejected) {
    return this.then(undefined, onRejected);
};

/**
 * Promise adapter.
 */

if (typeof Promise === 'undefined') {
    window.Promise = Promise$1;
}

function PromiseObj(executor, context) {

    if (executor instanceof Promise) {
        this.promise = executor;
    } else {
        this.promise = new Promise(executor.bind(context));
    }

    this.context = context;
}

PromiseObj.all = function (iterable, context) {
    return new PromiseObj(Promise.all(iterable), context);
};

PromiseObj.resolve = function (value, context) {
    return new PromiseObj(Promise.resolve(value), context);
};

PromiseObj.reject = function (reason, context) {
    return new PromiseObj(Promise.reject(reason), context);
};

PromiseObj.race = function (iterable, context) {
    return new PromiseObj(Promise.race(iterable), context);
};

var p = PromiseObj.prototype;

p.bind = function (context) {
    this.context = context;
    return this;
};

p.then = function (fulfilled, rejected) {

    if (fulfilled && fulfilled.bind && this.context) {
        fulfilled = fulfilled.bind(this.context);
    }

    if (rejected && rejected.bind && this.context) {
        rejected = rejected.bind(this.context);
    }

    return new PromiseObj(this.promise.then(fulfilled, rejected), this.context);
};

p.catch = function (rejected) {

    if (rejected && rejected.bind && this.context) {
        rejected = rejected.bind(this.context);
    }

    return new PromiseObj(this.promise.catch(rejected), this.context);
};

p.finally = function (callback) {

    return this.then(function (value) {
        callback.call(this);
        return value;
    }, function (reason) {
        callback.call(this);
        return Promise.reject(reason);
    });
};

/**
 * Utility functions.
 */

var debug = false;var util = {};var slice = [].slice;


function Util (Vue) {
    util = Vue.util;
    debug = Vue.config.debug || !Vue.config.silent;
}

function warn(msg) {
    if (typeof console !== 'undefined' && debug) {
        console.warn('[VueResource warn]: ' + msg);
    }
}

function error(msg) {
    if (typeof console !== 'undefined') {
        console.error(msg);
    }
}

function nextTick(cb, ctx) {
    return util.nextTick(cb, ctx);
}

function trim(str) {
    return str.replace(/^\s*|\s*$/g, '');
}

function toLower(str) {
    return str ? str.toLowerCase() : '';
}

function toUpper(str) {
    return str ? str.toUpperCase() : '';
}

var isArray = Array.isArray;

function isString(val) {
    return typeof val === 'string';
}

function isBoolean(val) {
    return val === true || val === false;
}

function isFunction(val) {
    return typeof val === 'function';
}

function isObject(obj) {
    return obj !== null && typeof obj === 'object';
}

function isPlainObject(obj) {
    return isObject(obj) && Object.getPrototypeOf(obj) == Object.prototype;
}

function isBlob(obj) {
    return typeof Blob !== 'undefined' && obj instanceof Blob;
}

function isFormData(obj) {
    return typeof FormData !== 'undefined' && obj instanceof FormData;
}

function when(value, fulfilled, rejected) {

    var promise = PromiseObj.resolve(value);

    if (arguments.length < 2) {
        return promise;
    }

    return promise.then(fulfilled, rejected);
}

function options(fn, obj, opts) {

    opts = opts || {};

    if (isFunction(opts)) {
        opts = opts.call(obj);
    }

    return merge(fn.bind({ $vm: obj, $options: opts }), fn, { $options: opts });
}

function each(obj, iterator) {

    var i, key;

    if (obj && typeof obj.length == 'number') {
        for (i = 0; i < obj.length; i++) {
            iterator.call(obj[i], obj[i], i);
        }
    } else if (isObject(obj)) {
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                iterator.call(obj[key], obj[key], key);
            }
        }
    }

    return obj;
}

var assign = Object.assign || _assign;

function merge(target) {

    var args = slice.call(arguments, 1);

    args.forEach(function (source) {
        _merge(target, source, true);
    });

    return target;
}

function defaults(target) {

    var args = slice.call(arguments, 1);

    args.forEach(function (source) {

        for (var key in source) {
            if (target[key] === undefined) {
                target[key] = source[key];
            }
        }
    });

    return target;
}

function _assign(target) {

    var args = slice.call(arguments, 1);

    args.forEach(function (source) {
        _merge(target, source);
    });

    return target;
}

function _merge(target, source, deep) {
    for (var key in source) {
        if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
            if (isPlainObject(source[key]) && !isPlainObject(target[key])) {
                target[key] = {};
            }
            if (isArray(source[key]) && !isArray(target[key])) {
                target[key] = [];
            }
            _merge(target[key], source[key], deep);
        } else if (source[key] !== undefined) {
            target[key] = source[key];
        }
    }
}

/**
 * Root Prefix Transform.
 */

function root (options, next) {

    var url = next(options);

    if (isString(options.root) && !url.match(/^(https?:)?\//)) {
        url = options.root + '/' + url;
    }

    return url;
}

/**
 * Query Parameter Transform.
 */

function query (options, next) {

    var urlParams = Object.keys(Url.options.params),
        query = {},
        url = next(options);

    each(options.params, function (value, key) {
        if (urlParams.indexOf(key) === -1) {
            query[key] = value;
        }
    });

    query = Url.params(query);

    if (query) {
        url += (url.indexOf('?') == -1 ? '?' : '&') + query;
    }

    return url;
}

/**
 * URL Template v2.0.6 (https://github.com/bramstein/url-template)
 */

function expand(url, params, variables) {

    var tmpl = parse(url),
        expanded = tmpl.expand(params);

    if (variables) {
        variables.push.apply(variables, tmpl.vars);
    }

    return expanded;
}

function parse(template) {

    var operators = ['+', '#', '.', '/', ';', '?', '&'],
        variables = [];

    return {
        vars: variables,
        expand: function (context) {
            return template.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g, function (_, expression, literal) {
                if (expression) {

                    var operator = null,
                        values = [];

                    if (operators.indexOf(expression.charAt(0)) !== -1) {
                        operator = expression.charAt(0);
                        expression = expression.substr(1);
                    }

                    expression.split(/,/g).forEach(function (variable) {
                        var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
                        values.push.apply(values, getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
                        variables.push(tmp[1]);
                    });

                    if (operator && operator !== '+') {

                        var separator = ',';

                        if (operator === '?') {
                            separator = '&';
                        } else if (operator !== '#') {
                            separator = operator;
                        }

                        return (values.length !== 0 ? operator : '') + values.join(separator);
                    } else {
                        return values.join(',');
                    }
                } else {
                    return encodeReserved(literal);
                }
            });
        }
    };
}

function getValues(context, operator, key, modifier) {

    var value = context[key],
        result = [];

    if (isDefined(value) && value !== '') {
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            value = value.toString();

            if (modifier && modifier !== '*') {
                value = value.substring(0, parseInt(modifier, 10));
            }

            result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : null));
        } else {
            if (modifier === '*') {
                if (Array.isArray(value)) {
                    value.filter(isDefined).forEach(function (value) {
                        result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : null));
                    });
                } else {
                    Object.keys(value).forEach(function (k) {
                        if (isDefined(value[k])) {
                            result.push(encodeValue(operator, value[k], k));
                        }
                    });
                }
            } else {
                var tmp = [];

                if (Array.isArray(value)) {
                    value.filter(isDefined).forEach(function (value) {
                        tmp.push(encodeValue(operator, value));
                    });
                } else {
                    Object.keys(value).forEach(function (k) {
                        if (isDefined(value[k])) {
                            tmp.push(encodeURIComponent(k));
                            tmp.push(encodeValue(operator, value[k].toString()));
                        }
                    });
                }

                if (isKeyOperator(operator)) {
                    result.push(encodeURIComponent(key) + '=' + tmp.join(','));
                } else if (tmp.length !== 0) {
                    result.push(tmp.join(','));
                }
            }
        }
    } else {
        if (operator === ';') {
            result.push(encodeURIComponent(key));
        } else if (value === '' && (operator === '&' || operator === '?')) {
            result.push(encodeURIComponent(key) + '=');
        } else if (value === '') {
            result.push('');
        }
    }

    return result;
}

function isDefined(value) {
    return value !== undefined && value !== null;
}

function isKeyOperator(operator) {
    return operator === ';' || operator === '&' || operator === '?';
}

function encodeValue(operator, value, key) {

    value = operator === '+' || operator === '#' ? encodeReserved(value) : encodeURIComponent(value);

    if (key) {
        return encodeURIComponent(key) + '=' + value;
    } else {
        return value;
    }
}

function encodeReserved(str) {
    return str.split(/(%[0-9A-Fa-f]{2})/g).map(function (part) {
        if (!/%[0-9A-Fa-f]/.test(part)) {
            part = encodeURI(part);
        }
        return part;
    }).join('');
}

/**
 * URL Template (RFC 6570) Transform.
 */

function template (options) {

    var variables = [],
        url = expand(options.url, options.params, variables);

    variables.forEach(function (key) {
        delete options.params[key];
    });

    return url;
}

/**
 * Service for URL templating.
 */

var ie = document.documentMode;
var el = document.createElement('a');

function Url(url, params) {

    var self = this || {},
        options = url,
        transform;

    if (isString(url)) {
        options = { url: url, params: params };
    }

    options = merge({}, Url.options, self.$options, options);

    Url.transforms.forEach(function (handler) {
        transform = factory(handler, transform, self.$vm);
    });

    return transform(options);
}

/**
 * Url options.
 */

Url.options = {
    url: '',
    root: null,
    params: {}
};

/**
 * Url transforms.
 */

Url.transforms = [template, query, root];

/**
 * Encodes a Url parameter string.
 *
 * @param {Object} obj
 */

Url.params = function (obj) {

    var params = [],
        escape = encodeURIComponent;

    params.add = function (key, value) {

        if (isFunction(value)) {
            value = value();
        }

        if (value === null) {
            value = '';
        }

        this.push(escape(key) + '=' + escape(value));
    };

    serialize(params, obj);

    return params.join('&').replace(/%20/g, '+');
};

/**
 * Parse a URL and return its components.
 *
 * @param {String} url
 */

Url.parse = function (url) {

    if (ie) {
        el.href = url;
        url = el.href;
    }

    el.href = url;

    return {
        href: el.href,
        protocol: el.protocol ? el.protocol.replace(/:$/, '') : '',
        port: el.port,
        host: el.host,
        hostname: el.hostname,
        pathname: el.pathname.charAt(0) === '/' ? el.pathname : '/' + el.pathname,
        search: el.search ? el.search.replace(/^\?/, '') : '',
        hash: el.hash ? el.hash.replace(/^#/, '') : ''
    };
};

function factory(handler, next, vm) {
    return function (options) {
        return handler.call(vm, options, next);
    };
}

function serialize(params, obj, scope) {

    var array = isArray(obj),
        plain = isPlainObject(obj),
        hash;

    each(obj, function (value, key) {

        hash = isObject(value) || isArray(value);

        if (scope) {
            key = scope + '[' + (plain || hash ? key : '') + ']';
        }

        if (!scope && array) {
            params.add(value.name, value.value);
        } else if (hash) {
            serialize(params, value, key);
        } else {
            params.add(key, value);
        }
    });
}

/**
 * XDomain client (Internet Explorer).
 */

function xdrClient (request) {
    return new PromiseObj(function (resolve) {

        var xdr = new XDomainRequest(),
            handler = function (_ref) {
            var type = _ref.type;


            var status = 0;

            if (type === 'load') {
                status = 200;
            } else if (type === 'error') {
                status = 500;
            }

            resolve(request.respondWith(xdr.responseText, { status: status }));
        };

        request.abort = function () {
            return xdr.abort();
        };

        xdr.open(request.method, request.getUrl());
        xdr.timeout = 0;
        xdr.onload = handler;
        xdr.onerror = handler;
        xdr.ontimeout = handler;
        xdr.onprogress = function () {};
        xdr.send(request.getBody());
    });
}

/**
 * CORS Interceptor.
 */

var ORIGIN_URL = Url.parse(location.href);
var SUPPORTS_CORS = 'withCredentials' in new XMLHttpRequest();

function cors (request, next) {

    if (!isBoolean(request.crossOrigin) && crossOrigin(request)) {
        request.crossOrigin = true;
    }

    if (request.crossOrigin) {

        if (!SUPPORTS_CORS) {
            request.client = xdrClient;
        }

        delete request.emulateHTTP;
    }

    next();
}

function crossOrigin(request) {

    var requestUrl = Url.parse(Url(request));

    return requestUrl.protocol !== ORIGIN_URL.protocol || requestUrl.host !== ORIGIN_URL.host;
}

/**
 * Body Interceptor.
 */

function body (request, next) {

    if (isFormData(request.body)) {

        request.headers.delete('Content-Type');
    } else if (isObject(request.body) || isArray(request.body)) {

        if (request.emulateJSON) {
            request.body = Url.params(request.body);
            request.headers.set('Content-Type', 'application/x-www-form-urlencoded');
        } else {
            request.body = JSON.stringify(request.body);
        }
    }

    next(function (response) {

        Object.defineProperty(response, 'data', {
            get: function () {
                return this.body;
            },
            set: function (body) {
                this.body = body;
            }
        });

        return response.bodyText ? when(response.text(), function (text) {

            var type = response.headers.get('Content-Type');

            if (isString(type) && type.indexOf('application/json') === 0) {

                try {
                    response.body = JSON.parse(text);
                } catch (e) {
                    response.body = null;
                }
            } else {
                response.body = text;
            }

            return response;
        }) : response;
    });
}

/**
 * JSONP client.
 */

function jsonpClient (request) {
    return new PromiseObj(function (resolve) {

        var name = request.jsonp || 'callback',
            callback = '_jsonp' + Math.random().toString(36).substr(2),
            body = null,
            handler,
            script;

        handler = function (_ref) {
            var type = _ref.type;


            var status = 0;

            if (type === 'load' && body !== null) {
                status = 200;
            } else if (type === 'error') {
                status = 500;
            }

            resolve(request.respondWith(body, { status: status }));

            delete window[callback];
            document.body.removeChild(script);
        };

        request.params[name] = callback;

        window[callback] = function (result) {
            body = JSON.stringify(result);
        };

        script = document.createElement('script');
        script.src = request.getUrl();
        script.type = 'text/javascript';
        script.async = true;
        script.onload = handler;
        script.onerror = handler;

        document.body.appendChild(script);
    });
}

/**
 * JSONP Interceptor.
 */

function jsonp (request, next) {

    if (request.method == 'JSONP') {
        request.client = jsonpClient;
    }

    next(function (response) {

        if (request.method == 'JSONP') {

            return when(response.json(), function (json) {

                response.body = json;

                return response;
            });
        }
    });
}

/**
 * Before Interceptor.
 */

function before (request, next) {

    if (isFunction(request.before)) {
        request.before.call(this, request);
    }

    next();
}

/**
 * HTTP method override Interceptor.
 */

function method (request, next) {

    if (request.emulateHTTP && /^(PUT|PATCH|DELETE)$/i.test(request.method)) {
        request.headers.set('X-HTTP-Method-Override', request.method);
        request.method = 'POST';
    }

    next();
}

/**
 * Header Interceptor.
 */

function header (request, next) {

    var headers = assign({}, Http.headers.common, !request.crossOrigin ? Http.headers.custom : {}, Http.headers[toLower(request.method)]);

    each(headers, function (value, name) {
        if (!request.headers.has(name)) {
            request.headers.set(name, value);
        }
    });

    next();
}

/**
 * Timeout Interceptor.
 */

function timeout (request, next) {

    var timeout;

    if (request.timeout) {
        timeout = setTimeout(function () {
            request.abort();
        }, request.timeout);
    }

    next(function (response) {

        clearTimeout(timeout);
    });
}

/**
 * XMLHttp client.
 */

function xhrClient (request) {
    return new PromiseObj(function (resolve) {

        var xhr = new XMLHttpRequest(),
            handler = function (event) {

            var response = request.respondWith('response' in xhr ? xhr.response : xhr.responseText, {
                status: xhr.status === 1223 ? 204 : xhr.status, // IE9 status bug
                statusText: xhr.status === 1223 ? 'No Content' : trim(xhr.statusText)
            });

            each(trim(xhr.getAllResponseHeaders()).split('\n'), function (row) {
                response.headers.append(row.slice(0, row.indexOf(':')), row.slice(row.indexOf(':') + 1));
            });

            resolve(response);
        };

        request.abort = function () {
            return xhr.abort();
        };

        if (request.progress) {
            if (request.method === 'GET') {
                xhr.addEventListener('progress', request.progress);
            } else if (/^(POST|PUT)$/i.test(request.method)) {
                xhr.upload.addEventListener('progress', request.progress);
            }
        }

        xhr.open(request.method, request.getUrl(), true);

        if ('responseType' in xhr) {
            xhr.responseType = 'blob';
        }

        if (request.credentials === true) {
            xhr.withCredentials = true;
        }

        request.headers.forEach(function (value, name) {
            xhr.setRequestHeader(name, value);
        });

        xhr.timeout = 0;
        xhr.onload = handler;
        xhr.onerror = handler;
        xhr.send(request.getBody());
    });
}

/**
 * Base client.
 */

function Client (context) {

    var reqHandlers = [sendRequest],
        resHandlers = [],
        handler;

    if (!isObject(context)) {
        context = null;
    }

    function Client(request) {
        return new PromiseObj(function (resolve) {

            function exec() {

                handler = reqHandlers.pop();

                if (isFunction(handler)) {
                    handler.call(context, request, next);
                } else {
                    warn('Invalid interceptor of type ' + typeof handler + ', must be a function');
                    next();
                }
            }

            function next(response) {

                if (isFunction(response)) {

                    resHandlers.unshift(response);
                } else if (isObject(response)) {

                    resHandlers.forEach(function (handler) {
                        response = when(response, function (response) {
                            return handler.call(context, response) || response;
                        });
                    });

                    when(response, resolve);

                    return;
                }

                exec();
            }

            exec();
        }, context);
    }

    Client.use = function (handler) {
        reqHandlers.push(handler);
    };

    return Client;
}

function sendRequest(request, resolve) {

    var client = request.client || xhrClient;

    resolve(client(request));
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

/**
 * HTTP Headers.
 */

var Headers = function () {
    function Headers(headers) {
        var _this = this;

        classCallCheck(this, Headers);


        this.map = {};

        each(headers, function (value, name) {
            return _this.append(name, value);
        });
    }

    Headers.prototype.has = function has(name) {
        return getName(this.map, name) !== null;
    };

    Headers.prototype.get = function get(name) {

        var list = this.map[getName(this.map, name)];

        return list ? list[0] : null;
    };

    Headers.prototype.getAll = function getAll(name) {
        return this.map[getName(this.map, name)] || [];
    };

    Headers.prototype.set = function set(name, value) {
        this.map[normalizeName(getName(this.map, name) || name)] = [trim(value)];
    };

    Headers.prototype.append = function append(name, value) {

        var list = this.getAll(name);

        if (list.length) {
            list.push(trim(value));
        } else {
            this.set(name, value);
        }
    };

    Headers.prototype.delete = function _delete(name) {
        delete this.map[getName(this.map, name)];
    };

    Headers.prototype.forEach = function forEach(callback, thisArg) {
        var _this2 = this;

        each(this.map, function (list, name) {
            each(list, function (value) {
                return callback.call(thisArg, value, name, _this2);
            });
        });
    };

    return Headers;
}();

function getName(map, name) {
    return Object.keys(map).reduce(function (prev, curr) {
        return toLower(name) === toLower(curr) ? curr : prev;
    }, null);
}

function normalizeName(name) {

    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
        throw new TypeError('Invalid character in header field name');
    }

    return trim(name);
}

/**
 * HTTP Response.
 */

var Response = function () {
    function Response(body, _ref) {
        var url = _ref.url;
        var headers = _ref.headers;
        var status = _ref.status;
        var statusText = _ref.statusText;
        classCallCheck(this, Response);


        this.url = url;
        this.ok = status >= 200 && status < 300;
        this.status = status || 0;
        this.statusText = statusText || '';
        this.headers = new Headers(headers);
        this.body = body;

        if (isString(body)) {

            this.bodyText = body;
        } else if (isBlob(body)) {

            this.bodyBlob = body;

            if (isBlobText(body)) {
                this.bodyText = blobText(body);
            }
        }
    }

    Response.prototype.blob = function blob() {
        return when(this.bodyBlob);
    };

    Response.prototype.text = function text() {
        return when(this.bodyText);
    };

    Response.prototype.json = function json() {
        return when(this.text(), function (text) {
            return JSON.parse(text);
        });
    };

    return Response;
}();

function blobText(body) {
    return new PromiseObj(function (resolve) {

        var reader = new FileReader();

        reader.readAsText(body);
        reader.onload = function () {
            resolve(reader.result);
        };
    });
}

function isBlobText(body) {
    return body.type.indexOf('text') === 0 || body.type.indexOf('json') !== -1;
}

/**
 * HTTP Request.
 */

var Request = function () {
    function Request(options) {
        classCallCheck(this, Request);


        this.body = null;
        this.params = {};

        assign(this, options, {
            method: toUpper(options.method || 'GET')
        });

        if (!(this.headers instanceof Headers)) {
            this.headers = new Headers(this.headers);
        }
    }

    Request.prototype.getUrl = function getUrl() {
        return Url(this);
    };

    Request.prototype.getBody = function getBody() {
        return this.body;
    };

    Request.prototype.respondWith = function respondWith(body, options) {
        return new Response(body, assign(options || {}, { url: this.getUrl() }));
    };

    return Request;
}();

/**
 * Service for sending network requests.
 */

var CUSTOM_HEADERS = { 'X-Requested-With': 'XMLHttpRequest' };
var COMMON_HEADERS = { 'Accept': 'application/json, text/plain, */*' };
var JSON_CONTENT_TYPE = { 'Content-Type': 'application/json;charset=utf-8' };

function Http(options) {

    var self = this || {},
        client = Client(self.$vm);

    defaults(options || {}, self.$options, Http.options);

    Http.interceptors.forEach(function (handler) {
        client.use(handler);
    });

    return client(new Request(options)).then(function (response) {

        return response.ok ? response : PromiseObj.reject(response);
    }, function (response) {

        if (response instanceof Error) {
            error(response);
        }

        return PromiseObj.reject(response);
    });
}

Http.options = {};

Http.headers = {
    put: JSON_CONTENT_TYPE,
    post: JSON_CONTENT_TYPE,
    patch: JSON_CONTENT_TYPE,
    delete: JSON_CONTENT_TYPE,
    custom: CUSTOM_HEADERS,
    common: COMMON_HEADERS
};

Http.interceptors = [before, timeout, method, body, jsonp, header, cors];

['get', 'delete', 'head', 'jsonp'].forEach(function (method) {

    Http[method] = function (url, options) {
        return this(assign(options || {}, { url: url, method: method }));
    };
});

['post', 'put', 'patch'].forEach(function (method) {

    Http[method] = function (url, body, options) {
        return this(assign(options || {}, { url: url, method: method, body: body }));
    };
});

/**
 * Service for interacting with RESTful services.
 */

function Resource(url, params, actions, options) {

    var self = this || {},
        resource = {};

    actions = assign({}, Resource.actions, actions);

    each(actions, function (action, name) {

        action = merge({ url: url, params: assign({}, params) }, options, action);

        resource[name] = function () {
            return (self.$http || Http)(opts(action, arguments));
        };
    });

    return resource;
}

function opts(action, args) {

    var options = assign({}, action),
        params = {},
        body;

    switch (args.length) {

        case 2:

            params = args[0];
            body = args[1];

            break;

        case 1:

            if (/^(POST|PUT|PATCH)$/i.test(options.method)) {
                body = args[0];
            } else {
                params = args[0];
            }

            break;

        case 0:

            break;

        default:

            throw 'Expected up to 4 arguments [params, body], got ' + args.length + ' arguments';
    }

    options.body = body;
    options.params = assign({}, options.params, params);

    return options;
}

Resource.actions = {

    get: { method: 'GET' },
    save: { method: 'POST' },
    query: { method: 'GET' },
    update: { method: 'PUT' },
    remove: { method: 'DELETE' },
    delete: { method: 'DELETE' }

};

/**
 * Install plugin.
 */

function plugin(Vue) {

    if (plugin.installed) {
        return;
    }

    Util(Vue);

    Vue.url = Url;
    Vue.http = Http;
    Vue.resource = Resource;
    Vue.Promise = PromiseObj;

    Object.defineProperties(Vue.prototype, {

        $url: {
            get: function () {
                return options(Vue.url, this, this.$options.url);
            }
        },

        $http: {
            get: function () {
                return options(Vue.http, this, this.$options.http);
            }
        },

        $resource: {
            get: function () {
                return Vue.resource.bind(this);
            }
        },

        $promise: {
            get: function () {
                var _this = this;

                return function (executor) {
                    return new Vue.Promise(executor, _this);
                };
            }
        }

    });
}

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(plugin);
}

module.exports = plugin;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {



let smoothScrollWebSites =  __webpack_require__(36)

module.exports = {
    install(Vue, options = { name: 'smoothScrollWebsites' }) {
      Object.defineProperty(Vue.prototype, '$SmoothScrollWebSites', {
          get: function () {
              return smoothScrollWebSites;
          }
      });
      Object.defineProperty(Vue.prototype, '$SmoothScrollWebSitesOptions', {
          get: function () {
              return window.SmoothScrollOptions;
          },
          set: function (value) {
              window.SmoothScrollOptions = value;
          }
      });
    }
}


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__views_compments_header_vue__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__views_compments_header_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__views_compments_header_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__views_compments_footer_vue__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__views_compments_footer_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__views_compments_footer_vue__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ exports["default"] = {
    name: 'app',
    data: function data() {
        return preLoadData;
    },
    created: function created() {
        this.$SmoothScrollWebSites();
        console.log("created");
    },

    components: {
        'sg-header': __WEBPACK_IMPORTED_MODULE_0__views_compments_header_vue___default.a,
        'sg-footer': __WEBPACK_IMPORTED_MODULE_1__views_compments_footer_vue___default.a
    }
};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__compments_body_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__compments_body_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__compments_body_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__others_pager_vue__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__others_pager_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__others_pager_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__index_topicLine_vue__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__index_topicLine_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__index_topicLine_vue__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ exports["default"] = {
    name: 'area',
    data: function data() {
        return {
            menus: preLoadData.menus,
            topics: [],
            page: this.$route.params.page ? this.$route.params.page : 1,
            area: this.$route.params.area,
            size: 30,
            total: 0,
            orderNow: this.$route.params.order ? this.$route.params.order : '1',
            orders: [{
                value: '1',
                label: '最新发布'
            }, {
                value: '2',
                label: '最后回复'
            }, {
                value: '3',
                label: '个人喜好'
            }]
        };
    },
    created: function created() {
        this.getData();
    },

    watch: {
        $route: function $route() {
            this.getData();
        },
        page: function page(val, OldVal) {
            this.getData();
        }
    },
    methods: {
        pageChange: function pageChange(page) {
            this.page = page;
        },
        getData: function getData() {
            var _this = this;

            var url = '/a/' + this.area + "/" + this.page + '/' + this.orderNow;

            this.$http.post(url).then(function (response) {
                if (response.data.result) {
                    _this.topics = response.data.data.topics.result;
                    _this.page = response.data.data.topics.pageNumber;
                    _this.total = response.data.data.topics.totalPage;
                    _this.size = response.data.data.topics.pageSize;
                }
            }, function (response) {});
        },
        nextPage: function nextPage() {
            this.page = this.page + 1;
        },
        prevPage: function prevPage() {
            this.page = this.page - 1;
        }
    },
    components: {
        'sg-body': __WEBPACK_IMPORTED_MODULE_0__compments_body_vue___default.a,
        'sg-pager': __WEBPACK_IMPORTED_MODULE_1__others_pager_vue___default.a,
        'sg-topic-Line': __WEBPACK_IMPORTED_MODULE_2__index_topicLine_vue___default.a
    }
};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ exports["default"] = {
    name: 'sg-body',
    props: {
        col: {
            type: Number,
            default: 20
        }
    }
};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ exports["default"] = {
    name: 'sg-footer',
    props: {
        siteName: {
            type: String
        },
        version: {
            type: String
        }
    }
};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_wind_dom_src_event__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_wind_dom_src_event___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_wind_dom_src_event__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__others_menu_vue__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__others_menu_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__others_menu_vue__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ exports["default"] = {
    name: "sg-header",
    data: function data() {
        return {
            fixed: false
        };
    },

    props: {
        mode: {
            type: String,
            default: 'horizontal'
        },
        menus: {
            type: Array,
            required: true
        }
    },
    created: function created() {
        var self = this;
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_wind_dom_src_event__["on"])(window, 'scroll', function (event) {
            self.fixed = window.scrollY > 0;
        });
    },

    methods: {
        select: function select(index, indexPath) {
            if (index) this.$router.push(index);
        }
    },
    components: {
        'sg-menu': __WEBPACK_IMPORTED_MODULE_1__others_menu_vue___default.a
    }
};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__compments_body_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__compments_body_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__compments_body_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__others_pager_vue__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__others_pager_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__others_pager_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__index_topicLine_vue__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__index_topicLine_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__index_topicLine_vue__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ exports["default"] = {
    name: 'index',
    data: function data() {
        return {
            menus: preLoadData.menus,
            topics: [],
            page: 1,
            size: 30,
            total: 0,
            orderNow: '1',
            orders: [{
                value: '1',
                label: '最新发布'
            }, {
                value: '2',
                label: '最后回复'
            }, {
                value: '3',
                label: '个人喜好'
            }],
            hots: [{
                area: 'c++',
                link: '/asd',
                title: 'xx'
            }, {
                area: 'c++',
                link: '/asd',
                title: 'casasdassss'
            }, {
                area: 'c++',
                link: '/asd',
                title: 'asds'
            }, {
                area: 'c++',
                link: '/asd',
                title: 'asds'
            }]
        };
    },
    created: function created() {
        this.getData();
    },

    watch: {
        $route: function $route() {
            this.getData();
        },
        page: function page(val, OldVal) {
            this.getData();
        }
    },
    methods: {
        pageChange: function pageChange(page) {
            this.page = page;
        },
        getData: function getData() {
            var _this = this;

            var url = '/' + this.page + '/' + this.orderNow;

            this.$http.post(url).then(function (response) {
                if (response.data.result) {
                    _this.topics = response.data.data.topics.result;
                    _this.page = response.data.data.topics.pageNumber;
                    _this.total = response.data.data.topics.totalPage;
                    _this.size = response.data.data.topics.pageSize;
                }
            }, function (response) {});
        },
        nextPage: function nextPage() {
            this.page = this.page + 1;
        },
        prevPage: function prevPage() {
            this.page = this.page - 1;
        }
    },
    components: {
        'sg-body': __WEBPACK_IMPORTED_MODULE_0__compments_body_vue___default.a,
        'sg-pager': __WEBPACK_IMPORTED_MODULE_1__others_pager_vue___default.a,
        'sg-topic-Line': __WEBPACK_IMPORTED_MODULE_2__index_topicLine_vue___default.a
    }
};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ exports["default"] = {
    name: 'sg-topic-Line',
    props: {
        data: {
            type: Object
        }
    },
    components: {}
};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//

/* harmony default export */ exports["default"] = {
    name: 'sg-comment',
    props: {
        body: {
            type: String,
            default: ""
        }
    },
    components: {}
};

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__subMenu_vue__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__subMenu_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__subMenu_vue__);
//
//
//
//
//
//
//
//
//



/* harmony default export */ exports["default"] = {
    name: "sg-menu",
    props: {
        menu: {
            type: Object
        }
    },
    components: {
        'sg-subMenu': __WEBPACK_IMPORTED_MODULE_0__subMenu_vue___default.a
    }
};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ exports["default"] = {
    name: 'sg-pager',
    props: {
        pageSize: {
            type: Number,
            default: 30
        },
        pageNow: {
            type: Number,
            default: 1
        },
        pageTotal: {
            type: Number,
            default: 0
        }
    },
    methods: {
        handleSizeChange: function handleSizeChange(internalCurrentPage) {
            this.$emit('sizechange', internalCurrentPage);
        },
        handleCurrentChange: function handleCurrentChange(internalCurrentPage) {
            this.$emit('currentchange', internalCurrentPage);
        }
    }
};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//

/* harmony default export */ exports["default"] = {
    name: 'sg-subMenu',
    props: {
        menu: {
            type: Object
        }
    }
};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__compments_body_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__compments_body_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__compments_body_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__others_pager_vue__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__others_pager_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__others_pager_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__others_comment_vue__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__others_comment_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__others_comment_vue__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//





/* harmony default export */ exports["default"] = {
    data: function data() {
        return {
            page: 1,
            size: 20,
            total: 0,
            topic: {},
            comments: []
        };
    },
    created: function created() {},

    components: {
        'sg-body': __WEBPACK_IMPORTED_MODULE_0__compments_body_vue___default.a,
        'sg-pager': __WEBPACK_IMPORTED_MODULE_1__others_pager_vue___default.a,
        'sg-comment': __WEBPACK_IMPORTED_MODULE_2__others_comment_vue___default.a
    }
};

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.topic-hot-line {\n    margin: 5px 0;\n    border-bottom: 1px solid #c2c8dc;\n    padding-left: 5px;\n    padding-bottom: 5px;\n}\n.topic-hot-line a {\n    display: inline;\n}\n.topic-hot div:first-child h3 {\n    text-align: center;\n    margin: .4em 0;\n}\n.topic-hot {\n    min-height: 100px;\n    padding: 10px 0;\n    border-radius: 0.2em;\n    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);\n    border-bottom: 1px solid rgba(162, 162, 162, 0.31);\n}\n.topic-hot-line a {\n    text-decoration: none;\n    color: black;\n}\n.el-select-mini {\n    margin: 5px 0;\n}\n.el-select-mini .el-input__inner {\n    height: 24px;\n    background-color: #f2f3f5;\n}\n.pager-center {\n    text-align: center;\n    margin-top: 10px;\n    margin-bottom: 10px;\n}\n.inline-block {\n    display: inline-block;\n}\n.br-path {\n    margin: 10px 0;\n}\n", "", {"version":3,"sources":["/./Users/teddyzhu/Documents/JavaWork/code/lc4e/src/main/webapp/WEB-INF/views/themes/default/src/views/index.vue?7265b371"],"names":[],"mappings":";AAsDA;IACA,cAAA;IACA,iCAAA;IACA,kBAAA;IACA,oBAAA;CACA;AAEA;IACA,gBAAA;CACA;AAEA;IACA,mBAAA;IACA,eAAA;CACA;AAEA;IACA,kBAAA;IACA,gBAAA;IACA,qBAAA;IACA,yCAAA;IACA,mDAAA;CACA;AAEA;IACA,sBAAA;IACA,aAAA;CACA;AAEA;IACA,cAAA;CACA;AAEA;IACA,aAAA;IACA,0BAAA;CACA;AAEA;IACA,mBAAA;IACA,iBAAA;IACA,oBAAA;CACA;AAEA;IACA,sBAAA;CACA;AAEA;IACA,eAAA;CACA","file":"index.vue","sourcesContent":["<template>\n    <sg-body>\n        <slot>\n            <el-row>\n                <el-col :span=\"15\">\n                    <el-row type=\"flex\" justify=\"space-between\">\n                        <el-col :span=\"13\" class=\"br-path\">\n                            <el-breadcrumb separator=\">\">\n                                <el-breadcrumb-item :to=\"{ path: '/' }\">首页</el-breadcrumb-item>\n                                <el-breadcrumb-item>Area</el-breadcrumb-item>\n                            </el-breadcrumb>\n                        </el-col>\n                        <el-col :span=\"5\">\n                            <el-select v-model=\"orderNow\" class=\"el-select-mini\">\n                                <el-option\n                                        v-for=\"orderItem in orders\"\n                                        :label=\"orderItem.label\"\n                                        :key=\"orderItem.value\"\n                                        :value=\"orderItem.value\">\n                                </el-option>\n                            </el-select>\n                        </el-col>\n                    </el-row>\n                    <el-row>\n                        <el-col :span=\"24\">\n                            <sg-topic-Line :data=\"data\" v-for=\"data in topics\"></sg-topic-Line>\n                        </el-col>\n                    </el-row>\n                    <el-row type=\"flex\" justify=\"center\">\n                        <el-col :span=\"24\" class=\"pager-center\">\n                            <sg-pager :pageNow=\"page\" :pageSize=\"size\" :pageTotal=\"total\"\n                                      @currentchange=\"pageChange\" class=\"inline-block\"></sg-pager>\n                        </el-col>\n                    </el-row>\n                </el-col>\n                <el-col :span=\"7\" :offset=\"1\">\n                    <el-row class=\"topic-hot\">\n                        <el-col :span=\"24\">\n                            <h3>Topic Hot</h3>\n                        </el-col>\n                        <el-col :span=\"24\" class=\"topic-hot-line\" v-for=\"hot in hots\">\n                            <el-tag type=\"primary\">\n                                <router-link tag=\"a\" :to=\"'/a/' + hot.area\">{{hot.area}}</router-link>\n                            </el-tag>\n                            <router-link tag=\"a\" :to=\"hot.link\">{{hot.title}}</router-link>\n                        </el-col>\n                    </el-row>\n                </el-col>\n            </el-row>\n        </slot>\n    </sg-body>\n</template>\n<style>\n\n    .topic-hot-line {\n        margin: 5px 0;\n        border-bottom: 1px solid #c2c8dc;\n        padding-left: 5px;\n        padding-bottom: 5px;\n    }\n\n    .topic-hot-line a {\n        display: inline;\n    }\n\n    .topic-hot div:first-child h3 {\n        text-align: center;\n        margin: .4em 0;\n    }\n\n    .topic-hot {\n        min-height: 100px;\n        padding: 10px 0;\n        border-radius: 0.2em;\n        box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);\n        border-bottom: 1px solid rgba(162, 162, 162, 0.31);\n    }\n\n    .topic-hot-line a {\n        text-decoration: none;\n        color: black;\n    }\n\n    .el-select-mini {\n        margin: 5px 0;\n    }\n\n    .el-select-mini .el-input__inner {\n        height: 24px;\n        background-color: #f2f3f5;\n    }\n\n    .pager-center {\n        text-align: center;\n        margin-top: 10px;\n        margin-bottom: 10px;\n    }\n\n    .inline-block {\n        display: inline-block;\n    }\n\n    .br-path {\n        margin: 10px 0;\n    }\n</style>\n<script type=\"text/javascript\">\n    import Body from './compments/body.vue'\n    import Pager from './others/pager.vue'\n    import TopicLine from './index/topicLine.vue'\n    export default  {\n        name: 'index',\n        data () {\n            return {\n                menus: preLoadData.menus,\n                topics: [],\n                page: 1,\n                size: 30,\n                total: 0,\n                orderNow: '1',\n                orders: [{\n                    value: '1',\n                    label: '最新发布'\n                }, {\n                    value: '2',\n                    label: '最后回复'\n                }, {\n                    value: '3',\n                    label: '个人喜好'\n                }],\n                hots: [{\n                    area: 'c++',\n                    link: '/asd',\n                    title: 'xx'\n                }, {\n                    area: 'c++',\n                    link: '/asd',\n                    title: 'casasdassss'\n                }, {\n                    area: 'c++',\n                    link: '/asd',\n                    title: 'asds'\n                }, {\n                    area: 'c++',\n                    link: '/asd',\n                    title: 'asds'\n                }]\n            }\n        },\n        created () {\n            this.getData();\n        },\n        watch: {\n            $route() {\n                this.getData();\n            },\n            page(val, OldVal){\n                this.getData();\n            }\n        },\n        methods: {\n            pageChange(page){\n                this.page = page;\n            },\n            getData () {\n                var url = '/' + this.page + '/' + this.orderNow;\n\n                this.$http.post(url).then((response)=> {\n                    if (response.data.result) {\n                        this.topics = response.data.data.topics.result;\n                        this.page = response.data.data.topics.pageNumber;\n                        this.total = response.data.data.topics.totalPage;\n                        this.size = response.data.data.topics.pageSize;\n                    }\n                }, (response)=> {\n                });\n            },\n            nextPage () {\n                this.page = this.page + 1;\n            },\n            prevPage () {\n                this.page = this.page - 1;\n            }\n        },\n        components: {\n            'sg-body': Body,\n            'sg-pager': Pager,\n            'sg-topic-Line': TopicLine\n        }\n    }\n</script>"],"sourceRoot":"webpack://"}]);

// exports


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n", "", {"version":3,"sources":[],"names":[],"mappings":"","file":"subMenu.vue","sourceRoot":"webpack://"}]);

// exports


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.topic-hot-line {\n    margin: 5px 0;\n    border-bottom: 1px solid #c2c8dc;\n    padding-left: 5px;\n    padding-bottom: 5px;\n}\n.topic-hot-line a {\n    display: inline;\n}\n.topic-hot div:first-child h3 {\n    text-align: center;\n    margin: .4em 0;\n}\n.topic-hot {\n    min-height: 100px;\n    padding: 10px 0;\n    border-radius: 0.2em;\n    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);\n    border-bottom: 1px solid rgba(162, 162, 162, 0.31);\n}\n.topic-hot-line a {\n    text-decoration: none;\n    color: black;\n}\n.el-select-mini {\n    margin: 5px 0;\n}\n.el-select-mini .el-input__inner {\n    height: 24px;\n    background-color: #f2f3f5;\n}\n.pager-center {\n    text-align: center;\n    margin-top: 10px;\n    margin-bottom: 10px;\n}\n.inline-block {\n    display: inline-block;\n}\n.br-path {\n    margin: 10px 0;\n}\n", "", {"version":3,"sources":["/./Users/teddyzhu/Documents/JavaWork/code/lc4e/src/main/webapp/WEB-INF/views/themes/default/src/views/area.vue?326e78df"],"names":[],"mappings":";AAmDA;IACA,cAAA;IACA,iCAAA;IACA,kBAAA;IACA,oBAAA;CACA;AAEA;IACA,gBAAA;CACA;AAEA;IACA,mBAAA;IACA,eAAA;CACA;AAEA;IACA,kBAAA;IACA,gBAAA;IACA,qBAAA;IACA,yCAAA;IACA,mDAAA;CACA;AAEA;IACA,sBAAA;IACA,aAAA;CACA;AAEA;IACA,cAAA;CACA;AAEA;IACA,aAAA;IACA,0BAAA;CACA;AAEA;IACA,mBAAA;IACA,iBAAA;IACA,oBAAA;CACA;AAEA;IACA,sBAAA;CACA;AAEA;IACA,eAAA;CACA","file":"area.vue","sourcesContent":["<template>\n    <sg-body>\n        <slot>\n            <el-row>\n                <el-col :span=\"15\">\n                    <el-row type=\"flex\" justify=\"space-between\">\n                        <el-col :span=\"13\" class=\"br-path\">\n                            <el-breadcrumb separator=\">\">\n                                <el-breadcrumb-item :to=\"{ path: '/' }\">首页</el-breadcrumb-item>\n                                <el-breadcrumb-item>Area</el-breadcrumb-item>\n                            </el-breadcrumb>\n                        </el-col>\n                        <el-col :span=\"5\">\n                            <el-select v-model=\"orderNow\" class=\"el-select-mini\">\n                                <el-option\n                                        v-for=\"orderItem in orders\"\n                                        :label=\"orderItem.label\"\n                                        :key=\"orderItem.value\"\n                                        :value=\"orderItem.value\">\n                                </el-option>\n                            </el-select>\n                        </el-col>\n                    </el-row>\n                    <el-row>\n                        <el-col :span=\"24\">\n                            <sg-topic-Line :data=\"data\" v-for=\"data in topics\"></sg-topic-Line>\n                        </el-col>\n                    </el-row>\n                    <el-row type=\"flex\" justify=\"center\">\n                        <el-col :span=\"24\" class=\"pager-center\">\n                            <sg-pager :pageNow=\"page\" :pageSize=\"size\" :pageTotal=\"total\"\n                                      @currentchange=\"pageChange\" class=\"inline-block\"></sg-pager>\n                        </el-col>\n                    </el-row>\n                </el-col>\n                <el-col :span=\"7\" :offset=\"1\">\n                    <el-row class=\"topic-hot\">\n                        <el-col :span=\"24\">\n                            <h3>{{area}}</h3>\n                        </el-col>\n                        <el-col :span=\"24\" class=\"topic-hot-line\">\n                            <p>it's the description of area</p>\n                        </el-col>\n                    </el-row>\n                </el-col>\n            </el-row>\n        </slot>\n    </sg-body>\n</template>\n<style>\n\n    .topic-hot-line {\n        margin: 5px 0;\n        border-bottom: 1px solid #c2c8dc;\n        padding-left: 5px;\n        padding-bottom: 5px;\n    }\n\n    .topic-hot-line a {\n        display: inline;\n    }\n\n    .topic-hot div:first-child h3 {\n        text-align: center;\n        margin: .4em 0;\n    }\n\n    .topic-hot {\n        min-height: 100px;\n        padding: 10px 0;\n        border-radius: 0.2em;\n        box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);\n        border-bottom: 1px solid rgba(162, 162, 162, 0.31);\n    }\n\n    .topic-hot-line a {\n        text-decoration: none;\n        color: black;\n    }\n\n    .el-select-mini {\n        margin: 5px 0;\n    }\n\n    .el-select-mini .el-input__inner {\n        height: 24px;\n        background-color: #f2f3f5;\n    }\n\n    .pager-center {\n        text-align: center;\n        margin-top: 10px;\n        margin-bottom: 10px;\n    }\n\n    .inline-block {\n        display: inline-block;\n    }\n\n    .br-path {\n        margin: 10px 0;\n    }\n</style>\n<script type=\"text/javascript\">\n    import Body from './compments/body.vue'\n    import Pager from './others/pager.vue'\n    import TopicLine from './index/topicLine.vue'\n    export default  {\n        name: 'area',\n        data () {\n            return {\n                menus: preLoadData.menus,\n                topics: [],\n                page: this.$route.params.page ? this.$route.params.page : 1,\n                area: this.$route.params.area,\n                size: 30,\n                total: 0,\n                orderNow: this.$route.params.order ? this.$route.params.order : '1',\n                orders: [{\n                    value: '1',\n                    label: '最新发布'\n                }, {\n                    value: '2',\n                    label: '最后回复'\n                }, {\n                    value: '3',\n                    label: '个人喜好'\n                }]\n            }\n        },\n        created () {\n            this.getData();\n        },\n        watch: {\n            $route() {\n                this.getData();\n            },\n            page(val, OldVal){\n                this.getData();\n            }\n        },\n        methods: {\n            pageChange(page){\n                this.page = page;\n            },\n            getData () {\n                var url = '/a/' + this.area + \"/\" + this.page + '/' + this.orderNow;\n\n                this.$http.post(url).then((response)=> {\n                    if (response.data.result) {\n                        this.topics = response.data.data.topics.result;\n                        this.page = response.data.data.topics.pageNumber;\n                        this.total = response.data.data.topics.totalPage;\n                        this.size = response.data.data.topics.pageSize;\n                    }\n                }, (response)=> {\n                });\n            },\n            nextPage () {\n                this.page = this.page + 1;\n            },\n            prevPage () {\n                this.page = this.page - 1;\n            }\n        },\n        components: {\n            'sg-body': Body,\n            'sg-pager': Pager,\n            'sg-topic-Line': TopicLine\n        }\n    }\n</script>"],"sourceRoot":"webpack://"}]);

// exports


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.el-tag-mini {\n    height: 12px;\n    line-height: 12px;\n}\n.topic-author-img-a {\n    display: inline-block;\n    margin: 0 5px;\n}\n.el-tag.clickable {\n    cursor: pointer;\n}\n.topic-line-img {\n    width: 3em;\n    height: 3em;\n}\n.topic-table {\n    width: 100%;\n}\n.topic-line {\n    padding: .3em 0;\n    border-bottom: 1px solid #c2c8dc;\n    transition: box-shadow 500ms;\n}\n.topic-line:hover {\n    background-color: white;\n    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);\n}\n.topic-line-title {\n    word-break: break-all;\n    word-wrap: break-word;\n    display: inline-block;\n    text-align: left;\n    cursor: pointer;\n    font-size: 1.1em;\n    line-height: 1.1em;\n}\n.topic-line-title:after {\n    width: 100%;\n    height: 2px;\n    background-color: #4183C4;\n    content: '';\n    -webkit-transition: all 0.2s;\n    -webkit-backface-visibility: hidden;\n    transition: all 0.2s;\n    backface-visibility: hidden;\n    -ms-transform: scaleX(0);\n        transform: scaleX(0);\n    clear: both;\n    display: block;\n}\n.topic-line-title:hover:after {\n    -ms-transform: scaleX(1);\n        transform: scaleX(1);\n}\n.topic-line-meta {\n    margin-top: .2em;\n}\n.topic-line-body {\n}\n", "", {"version":3,"sources":["/./Users/teddyzhu/Documents/JavaWork/code/lc4e/src/main/webapp/WEB-INF/views/themes/default/src/views/index/topicLine.vue?6dc2f95f"],"names":[],"mappings":";AA6CA;IACA,aAAA;IACA,kBAAA;CACA;AAEA;IACA,sBAAA;IACA,cAAA;CACA;AAEA;IACA,gBAAA;CACA;AAEA;IACA,WAAA;IACA,YAAA;CACA;AAEA;IACA,YAAA;CACA;AAEA;IACA,gBAAA;IACA,iCAAA;IACA,6BAAA;CACA;AAEA;IACA,wBAAA;IACA,yCAAA;CACA;AAEA;IACA,sBAAA;IACA,sBAAA;IACA,sBAAA;IACA,iBAAA;IACA,gBAAA;IACA,iBAAA;IACA,mBAAA;CACA;AAEA;IACA,YAAA;IACA,YAAA;IACA,0BAAA;IACA,YAAA;IACA,6BAAA;IACA,oCAAA;IACA,qBAAA;IACA,4BAAA;IAEA,yBAAA;QAAA,qBAAA;IACA,YAAA;IACA,eAAA;CACA;AAEA;IAEA,yBAAA;QAAA,qBAAA;CACA;AAEA;IACA,iBAAA;CACA;AAEA;CAEA","file":"topicLine.vue","sourcesContent":["<template>\n    <el-row class=\"topic-line\">\n        <el-col :span=\"24\">\n            <table class=\"topic-table\">\n                <tr>\n                    <td align=\"center\" width=\"10%\">\n                        <a class=\"topic-author-img-a\">\n                            <img :src=\"data.imageUrl\" class=\"topic-line-img\">\n                        </a>\n                    </td>\n                    <td align=\"left\" width=\"75%\">\n                        <router-link :to=\"data.articleUrl\" tag=\"div\" class=\"topic-line-title\">\n                            {{data.articleTitle}}\n                        </router-link>\n                        <div class=\"topic-line-meta\">\n                            <el-breadcrumb separator=\"/\">\n                                <el-breadcrumb-item :to=\"{ path: '/a/' +data.category }\">\n                                    <el-tag type=\"primary\" class=\"el-tag-mini\"><i class=\"iconfont icon-area\"></i>{{data.category}}\n                                    </el-tag>\n                                </el-breadcrumb-item>\n                                <el-breadcrumb-item>\n                                    <el-tag type=\"gray\" class=\"clickable el-tag-mini\"><i\n                                            class=\"iconfont icon-people\"></i>{{data.user}}\n                                    </el-tag>\n                                </el-breadcrumb-item>\n                                <el-breadcrumb-item>\n                                    <el-tag type=\"gray\" class=\"clickable el-tag-mini\"><i class=\"iconfont icon-cmt\"></i>{{data.comments}}\n                                    </el-tag>\n                                </el-breadcrumb-item>\n                                <el-breadcrumb-item>\n                                    <el-tag type=\"gray\" class=\"clickable el-tag-mini\"><i class=\"iconfont icon-time\"></i>{{data.publishTime}}\n                                    </el-tag>\n                                </el-breadcrumb-item>\n                            </el-breadcrumb>\n                        </div>\n                    </td>\n                    <td align=\"right\">\n                        <el-tag type=\"warning\" v-if=\"label != ''\" v-for=\"label in data.statusText\">{{label}}</el-tag>\n                    </td>\n                </tr>\n            </table>\n        </el-col>\n    </el-row>\n</template>\n<style>\n    .el-tag-mini {\n        height: 12px;\n        line-height: 12px;\n    }\n\n    .topic-author-img-a {\n        display: inline-block;\n        margin: 0 5px;\n    }\n\n    .el-tag.clickable {\n        cursor: pointer;\n    }\n\n    .topic-line-img {\n        width: 3em;\n        height: 3em;\n    }\n\n    .topic-table {\n        width: 100%;\n    }\n\n    .topic-line {\n        padding: .3em 0;\n        border-bottom: 1px solid #c2c8dc;\n        transition: box-shadow 500ms;\n    }\n\n    .topic-line:hover {\n        background-color: white;\n        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);\n    }\n\n    .topic-line-title {\n        word-break: break-all;\n        word-wrap: break-word;\n        display: inline-block;\n        text-align: left;\n        cursor: pointer;\n        font-size: 1.1em;\n        line-height: 1.1em;\n    }\n\n    .topic-line-title:after {\n        width: 100%;\n        height: 2px;\n        background-color: #4183C4;\n        content: '';\n        -webkit-transition: all 0.2s;\n        -webkit-backface-visibility: hidden;\n        transition: all 0.2s;\n        backface-visibility: hidden;\n        -webkit-transform: scaleX(0);\n        transform: scaleX(0);\n        clear: both;\n        display: block;\n    }\n\n    .topic-line-title:hover:after {\n        -webkit-transform: scaleX(1);\n        transform: scaleX(1);\n    }\n\n    .topic-line-meta {\n        margin-top: .2em;\n    }\n\n    .topic-line-body {\n\n    }\n</style>\n<script>\n    export default{\n        name: 'sg-topic-Line',\n        props: {\n            data: {\n                type: Object\n            }\n        },\n        components: {}\n    }\n</script>\n"],"sourceRoot":"webpack://"}]);

// exports


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", "", {"version":3,"sources":[],"names":[],"mappings":"","file":"topic.vue","sourceRoot":"webpack://"}]);

// exports


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n[v-cloak] {\n    display: none;\n}\n", "", {"version":3,"sources":["/./Users/teddyzhu/Documents/JavaWork/code/lc4e/src/main/webapp/WEB-INF/views/themes/default/src/app.vue?308ceefe"],"names":[],"mappings":";AACA;IACA,cAAA;CACA","file":"app.vue","sourcesContent":["<style>\n    [v-cloak] {\n        display: none;\n    }\n</style>\n<template>\n    <el-row>\n        <el-col :span=\"24\">\n            <sg-header :menus=\"menus\"></sg-header>\n            <router-view></router-view>\n            <sg-footer :siteName=\"siteName\" :version=\"version\"></sg-footer>\n        </el-col>\n    </el-row>\n</template>\n\n<script>\n    import Header from './views/compments/header.vue'\n    import Footer from './views/compments/footer.vue'\n\n    export default {\n        name: 'app',\n        data () {\n            return preLoadData;\n        },\n        created () {\n            this.$SmoothScrollWebSites();\n            console.log(\"created\")\n        },\n        components: {\n            'sg-header': Header,\n            'sg-footer': Footer\n        }\n    }\n</script>"],"sourceRoot":"webpack://"}]);

// exports


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n", "", {"version":3,"sources":[],"names":[],"mappings":"","file":"comment.vue","sourceRoot":"webpack://"}]);

// exports


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.footer-des {\n    display: inline-block;\n}\n.footer-des p {\n    color: white;\n}\n.footer-a {\n    display: inline-block;\n    margin: 0 11px 12px 0;\n    line-height: 1;\n    font-size: 12px;\n    color: #768193;\n    text-decoration: none;\n}\n.footer-icon a i {\n    font-size: 25px;\n}\n.footer-icon a {\n    color: white;\n    text-decoration: none;\n}\n.footer-icon {\n    padding-top: 1em;\n    float: right;\n}\n", "", {"version":3,"sources":["/./Users/teddyzhu/Documents/JavaWork/code/lc4e/src/main/webapp/WEB-INF/views/themes/default/src/views/compments/footer.vue?0202a973"],"names":[],"mappings":";AAmBA;IACA,sBAAA;CACA;AAEA;IACA,aAAA;CACA;AAEA;IACA,sBAAA;IACA,sBAAA;IACA,eAAA;IACA,gBAAA;IACA,eAAA;IACA,sBAAA;CACA;AAEA;IACA,gBAAA;CACA;AAEA;IACA,aAAA;IACA,sBAAA;CACA;AAEA;IACA,iBAAA;IACA,aAAA;CACA","file":"footer.vue","sourcesContent":["<template>\n    <el-row type=\"flex\" justify=\"center\" class=\"bg-black-light\">\n        <el-col :span=\"22\">\n            <div class=\"footer-des\">\n                <p>{{siteName}} {{version}}</p>\n                <a class=\"footer-a\" target=\"_blank\"\n                   href=\"http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html\">JDK8</a>\n                <a class=\"footer-a\" target=\"_blank\" href=\"https://github.com/Teddy-Zhu/SilentGo\">SilentGo</a>\n                <a class=\"footer-a\" target=\"_blank\" href=\"https://github.com/vuejs/vue\">Vue2</a>\n            </div>\n            <div class=\"footer-icon\">\n                <a href=\"https://github.com/Teddy-Zhu/lc4e\" target=\"_blank\">\n                    <i class=\"iconfont icon-github\"></i>\n                </a>\n            </div>\n        </el-col>\n    </el-row>\n</template>\n<style>\n    .footer-des {\n        display: inline-block;\n    }\n\n    .footer-des p {\n        color: white;\n    }\n\n    .footer-a {\n        display: inline-block;\n        margin: 0 11px 12px 0;\n        line-height: 1;\n        font-size: 12px;\n        color: #768193;\n        text-decoration: none;\n    }\n\n    .footer-icon a i {\n        font-size: 25px;\n    }\n\n    .footer-icon a {\n        color: white;\n        text-decoration: none;\n    }\n\n    .footer-icon {\n        padding-top: 1em;\n        float: right;\n    }\n</style>\n<script>\n\n    export default{\n        name: 'sg-footer',\n        props: {\n            siteName: {\n                type: String\n            },\n            version: {\n                type: String\n            }\n        }\n    }\n</script>\n"],"sourceRoot":"webpack://"}]);

// exports


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.el-pagination[data-v-bd9e1816] {\n    background-color: #f2f3f5;\n}\n", "", {"version":3,"sources":["/./Users/teddyzhu/Documents/JavaWork/code/lc4e/src/main/webapp/WEB-INF/views/themes/default/src/views/others/pager.vue?65fd6e8b"],"names":[],"mappings":";AAWA;IACA,0BAAA;CACA","file":"pager.vue","sourcesContent":["<template>\n    <el-pagination\n            @sizechange=\"handleSizeChange\"\n            @currentchange=\"handleCurrentChange\"\n            :current-page=\"pageNow\"\n            :page-size=\"pageSize\"\n            layout=\"prev, pager, next, jumper\"\n            :total=\"pageTotal\">\n    </el-pagination>\n</template>\n<style scoped>\n    .el-pagination {\n        background-color: #f2f3f5;\n    }\n</style>\n<script>\n\n    export default{\n        name: 'sg-pager',\n        props: {\n            pageSize: {\n                type: Number,\n                default: 30\n            },\n            pageNow: {\n                type: Number,\n                default: 1\n            },\n            pageTotal: {\n                type: Number,\n                default: 0\n            }\n        },\n        methods: {\n            handleSizeChange(internalCurrentPage){\n                this.$emit('sizechange', internalCurrentPage);\n            },\n            handleCurrentChange(internalCurrentPage){\n                this.$emit('currentchange', internalCurrentPage);\n            }\n        }\n    }\n</script>\n"],"sourceRoot":"webpack://"}]);

// exports


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.sg-body {\n    margin-top: 10px;\n}\n", "", {"version":3,"sources":["/./Users/teddyzhu/Documents/JavaWork/code/lc4e/src/main/webapp/WEB-INF/views/themes/default/src/views/compments/body.vue?d12aecda"],"names":[],"mappings":";AAQA;IACA,iBAAA;CACA","file":"body.vue","sourcesContent":["<template>\n    <el-row type=\"flex\" justify=\"center\" class=\"sg-body\">\n        <el-col :span=\"col\">\n            <slot></slot>\n        </el-col>\n    </el-row>\n</template>\n<style>\n    .sg-body {\n        margin-top: 10px;\n    }\n</style>\n<script>\n    export default{\n        name: 'sg-body',\n        props: {\n            col: {\n                type: Number,\n                default: 20\n            }\n        }\n    }\n</script>\n"],"sourceRoot":"webpack://"}]);

// exports


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "\n.menu-panel {\n    height: 60px;\n}\n.sg-header {\n    box-shadow: 0 2px 4px -1px rgba(0, 0, 0, .25);\n    padding: 0 5rem;\n}\n.sg-header.fixed {\n    width: 100%;\n    z-index: 1;\n    position: fixed;\n    background-color: rgba(50, 64, 87, 0.84);\n}\n\n", "", {"version":3,"sources":["/./Users/teddyzhu/Documents/JavaWork/code/lc4e/src/main/webapp/WEB-INF/views/themes/default/src/views/compments/header.vue?7ec87774"],"names":[],"mappings":";AAWA;IACA,aAAA;CACA;AAEA;IACA,8CAAA;IACA,gBAAA;CACA;AAEA;IACA,YAAA;IACA,WAAA;IACA,gBAAA;IACA,yCAAA;CACA","file":"header.vue","sourcesContent":["<template>\n    <el-row>\n        <el-col :span=\"24\" class=\"menu-panel\">\n            <el-menu default-active=\"/\" theme=\"dark\" :mode=\"mode\" @select=\"select\"\n                     class=\"sg-header\" :class=\"{ fixed:fixed }\">\n                <sg-menu :menu=\"menu\" v-for=\"menu in menus\"></sg-menu>\n            </el-menu>\n        </el-col>\n    </el-row>\n</template>\n<style>\n    .menu-panel {\n        height: 60px;\n    }\n\n    .sg-header {\n        box-shadow: 0 2px 4px -1px rgba(0, 0, 0, .25);\n        padding: 0 5rem;\n    }\n\n    .sg-header.fixed {\n        width: 100%;\n        z-index: 1;\n        position: fixed;\n        background-color: rgba(50, 64, 87, 0.84);\n    }\n\n</style>\n<script>\n    import {on} from 'wind-dom/src/event';\n    import sgmenu from '../others/menu.vue';\n\n    export default{\n        name: \"sg-header\",\n        data(){\n            return {\n                fixed: false\n            }\n        },\n        props: {\n            mode: {\n                type: String,\n                default: 'horizontal'\n            },\n            menus: {\n                type: Array,\n                required: true\n            }\n        },\n        created(){\n            let self = this;\n            on(window, 'scroll', function (event) {\n                self.fixed = window.scrollY > 0;\n            })\n        },\n        methods: {\n            select(index, indexPath){\n                if (index)\n                    this.$router.push(index);\n            }\n        },\n        components: {\n            'sg-menu': sgmenu\n        }\n    }\n</script>\n"],"sourceRoot":"webpack://"}]);

// exports


/***/ },
/* 35 */
/***/ function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;//
// SmoothScroll for websites v1.4.0 (Balazs Galambosi)
// http://www.smoothscroll.net/
//
// Licensed under the terms of the MIT license.
//
// You may use it in your theme if you credit me. 
// It is also free to use on any individual website.
//
// Exception:
// The only restriction is to not publish any  
// extension for browsers or native application
// without getting a written permission first.
//

(function () {
  
// Scroll Variables (tweakable)
var defaultOptions = {

    // Scrolling Core
    frameRate        : 150, // [Hz]
    animationTime    : 400, // [ms]
    stepSize         : 100, // [px]

    // Pulse (less tweakable)
    // ratio of "tail" to "acceleration"
    pulseAlgorithm   : true,
    pulseScale       : 4,
    pulseNormalize   : 1,

    // Acceleration
    accelerationDelta : 50,  // 50
    accelerationMax   : 3,   // 3

    // Keyboard Settings
    keyboardSupport   : true,  // option
    arrowScroll       : 50,    // [px]

    // Other
    touchpadSupport   : false, // ignore touchpad by default
    fixedBackground   : true, 
    excluded          : ''    
};

var options = defaultOptions;


// Other Variables
var isExcluded = false;
var isFrame = false;
var direction = { x: 0, y: 0 };
var initDone  = false;
var root = document.documentElement;
var activeElement;
var observer;
var refreshSize;
var deltaBuffer = [];
var isMac = /^Mac/.test(navigator.platform);

var key = { left: 37, up: 38, right: 39, down: 40, spacebar: 32, 
            pageup: 33, pagedown: 34, end: 35, home: 36 };


/***********************************************
 * INITIALIZE
 ***********************************************/

/**
 * Tests if smooth scrolling is allowed. Shuts down everything if not.
 */
function initTest() {
    if (options.keyboardSupport) {
        addEvent('keydown', keydown);
    }
}

/**
 * Sets up scrolls array, determines if frames are involved.
 */
function init() {
  
    if (initDone || !document.body) return;

    initDone = true;

    var body = document.body;
    var html = document.documentElement;
    var windowHeight = window.innerHeight; 
    var scrollHeight = body.scrollHeight;
    
    // check compat mode for root element
    root = (document.compatMode.indexOf('CSS') >= 0) ? html : body;
    activeElement = body;
    
    initTest();

    // Checks if this script is running in a frame
    if (top != self) {
        isFrame = true;
    }

    /**
     * Please duplicate this radar for a Safari fix! 
     * rdar://22376037
     * https://openradar.appspot.com/radar?id=4965070979203072
     * 
     * Only applies to Safari now, Chrome fixed it in v45:
     * This fixes a bug where the areas left and right to 
     * the content does not trigger the onmousewheel event
     * on some pages. e.g.: html, body { height: 100% }
     */
    else if (scrollHeight > windowHeight &&
            (body.offsetHeight <= windowHeight || 
             html.offsetHeight <= windowHeight)) {

        var fullPageElem = document.createElement('div');
        fullPageElem.style.cssText = 'position:absolute; z-index:-10000; ' +
                                     'top:0; left:0; right:0; height:' + 
                                      root.scrollHeight + 'px';
        document.body.appendChild(fullPageElem);
        
        // DOM changed (throttled) to fix height
        var pendingRefresh;
        refreshSize = function () {
            if (pendingRefresh) return; // could also be: clearTimeout(pendingRefresh);
            pendingRefresh = setTimeout(function () {
                if (isExcluded) return; // could be running after cleanup
                fullPageElem.style.height = '0';
                fullPageElem.style.height = root.scrollHeight + 'px';
                pendingRefresh = null;
            }, 500); // act rarely to stay fast
        };
  
        setTimeout(refreshSize, 10);

        addEvent('resize', refreshSize);

        // TODO: attributeFilter?
        var config = {
            attributes: true, 
            childList: true, 
            characterData: false 
            // subtree: true
        };

        observer = new MutationObserver(refreshSize);
        observer.observe(body, config);

        if (root.offsetHeight <= windowHeight) {
            var clearfix = document.createElement('div');   
            clearfix.style.clear = 'both';
            body.appendChild(clearfix);
        }
    }

    // disable fixed background
    if (!options.fixedBackground && !isExcluded) {
        body.style.backgroundAttachment = 'scroll';
        html.style.backgroundAttachment = 'scroll';
    }
}

/**
 * Removes event listeners and other traces left on the page.
 */
function cleanup() {
    observer && observer.disconnect();
    removeEvent(wheelEvent, wheel);
    removeEvent('mousedown', mousedown);
    removeEvent('keydown', keydown);
    removeEvent('resize', refreshSize);
    removeEvent('load', init);
}


/************************************************
 * SCROLLING 
 ************************************************/
 
var que = [];
var pending = false;
var lastScroll = Date.now();

/**
 * Pushes scroll actions to the scrolling queue.
 */
function scrollArray(elem, left, top) {
    
    directionCheck(left, top);

    if (options.accelerationMax != 1) {
        var now = Date.now();
        var elapsed = now - lastScroll;
        if (elapsed < options.accelerationDelta) {
            var factor = (1 + (50 / elapsed)) / 2;
            if (factor > 1) {
                factor = Math.min(factor, options.accelerationMax);
                left *= factor;
                top  *= factor;
            }
        }
        lastScroll = Date.now();
    }          
    
    // push a scroll command
    que.push({
        x: left, 
        y: top, 
        lastX: (left < 0) ? 0.99 : -0.99,
        lastY: (top  < 0) ? 0.99 : -0.99, 
        start: Date.now()
    });
        
    // don't act if there's a pending queue
    if (pending) {
        return;
    }  

    var scrollWindow = (elem === document.body);
    
    var step = function (time) {
        
        var now = Date.now();
        var scrollX = 0;
        var scrollY = 0; 
    
        for (var i = 0; i < que.length; i++) {
            
            var item = que[i];
            var elapsed  = now - item.start;
            var finished = (elapsed >= options.animationTime);
            
            // scroll position: [0, 1]
            var position = (finished) ? 1 : elapsed / options.animationTime;
            
            // easing [optional]
            if (options.pulseAlgorithm) {
                position = pulse(position);
            }
            
            // only need the difference
            var x = (item.x * position - item.lastX) >> 0;
            var y = (item.y * position - item.lastY) >> 0;
            
            // add this to the total scrolling
            scrollX += x;
            scrollY += y;            
            
            // update last values
            item.lastX += x;
            item.lastY += y;
        
            // delete and step back if it's over
            if (finished) {
                que.splice(i, 1); i--;
            }           
        }

        // scroll left and top
        if (scrollWindow) {
            window.scrollBy(scrollX, scrollY);
        } 
        else {
            if (scrollX) elem.scrollLeft += scrollX;
            if (scrollY) elem.scrollTop  += scrollY;                    
        }
        
        // clean up if there's nothing left to do
        if (!left && !top) {
            que = [];
        }
        
        if (que.length) { 
            requestFrame(step, elem, (1000 / options.frameRate + 1)); 
        } else { 
            pending = false;
        }
    };
    
    // start a new queue of actions
    requestFrame(step, elem, 0);
    pending = true;
}


/***********************************************
 * EVENTS
 ***********************************************/

/**
 * Mouse wheel handler.
 * @param {Object} event
 */
function wheel(event) {

    if (!initDone) {
        init();
    }
    
    var target = event.target;
    var overflowing = overflowingAncestor(target);

    // use default if there's no overflowing
    // element or default action is prevented   
    // or it's a zooming event with CTRL 
    if (!overflowing || event.defaultPrevented || event.ctrlKey) {
        return true;
    }
    
    // leave embedded content alone (flash & pdf)
    if (isNodeName(activeElement, 'embed') || 
       (isNodeName(target, 'embed') && /\.pdf/i.test(target.src)) ||
       isNodeName(activeElement, 'object')) {
        return true;
    }

    var deltaX = -event.wheelDeltaX || event.deltaX || 0;
    var deltaY = -event.wheelDeltaY || event.deltaY || 0;
    
    if (isMac) {
        if (event.wheelDeltaX && isDivisible(event.wheelDeltaX, 120)) {
            deltaX = -120 * (event.wheelDeltaX / Math.abs(event.wheelDeltaX));
        }
        if (event.wheelDeltaY && isDivisible(event.wheelDeltaY, 120)) {
            deltaY = -120 * (event.wheelDeltaY / Math.abs(event.wheelDeltaY));
        }
    }
    
    // use wheelDelta if deltaX/Y is not available
    if (!deltaX && !deltaY) {
        deltaY = -event.wheelDelta || 0;
    }

    // line based scrolling (Firefox mostly)
    if (event.deltaMode === 1) {
        deltaX *= 40;
        deltaY *= 40;
    }
    
    // check if it's a touchpad scroll that should be ignored
    if (!options.touchpadSupport && isTouchpad(deltaY)) {
        return true;
    }

    // scale by step size
    // delta is 120 most of the time
    // synaptics seems to send 1 sometimes
    if (Math.abs(deltaX) > 1.2) {
        deltaX *= options.stepSize / 120;
    }
    if (Math.abs(deltaY) > 1.2) {
        deltaY *= options.stepSize / 120;
    }
    
    scrollArray(overflowing, deltaX, deltaY);
    event.preventDefault();
    scheduleClearCache();
}

/**
 * Keydown event handler.
 * @param {Object} event
 */
function keydown(event) {

    var target   = event.target;
    var modifier = event.ctrlKey || event.altKey || event.metaKey || 
                  (event.shiftKey && event.keyCode !== key.spacebar);
    
    // our own tracked active element could've been removed from the DOM
    if (!document.body.contains(activeElement)) {
        activeElement = document.activeElement;
    }

    // do nothing if user is editing text
    // or using a modifier key (except shift)
    // or in a dropdown
    // or inside interactive elements
    var inputNodeNames = /^(textarea|select|embed|object)$/i;
    var buttonTypes = /^(button|submit|radio|checkbox|file|color|image)$/i;
    if ( inputNodeNames.test(target.nodeName) ||
         isNodeName(target, 'input') && !buttonTypes.test(target.type) ||
         isNodeName(activeElement, 'video') ||
         isInsideYoutubeVideo(event) ||
         target.isContentEditable || 
         event.defaultPrevented   ||
         modifier ) {
      return true;
    }
    
    // spacebar should trigger button press
    if ((isNodeName(target, 'button') ||
         isNodeName(target, 'input') && buttonTypes.test(target.type)) &&
        event.keyCode === key.spacebar) {
      return true;
    }
    
    var shift, x = 0, y = 0;
    var elem = overflowingAncestor(activeElement);
    var clientHeight = elem.clientHeight;

    if (elem == document.body) {
        clientHeight = window.innerHeight;
    }

    switch (event.keyCode) {
        case key.up:
            y = -options.arrowScroll;
            break;
        case key.down:
            y = options.arrowScroll;
            break;         
        case key.spacebar: // (+ shift)
            shift = event.shiftKey ? 1 : -1;
            y = -shift * clientHeight * 0.9;
            break;
        case key.pageup:
            y = -clientHeight * 0.9;
            break;
        case key.pagedown:
            y = clientHeight * 0.9;
            break;
        case key.home:
            y = -elem.scrollTop;
            break;
        case key.end:
            var damt = elem.scrollHeight - elem.scrollTop - clientHeight;
            y = (damt > 0) ? damt+10 : 0;
            break;
        case key.left:
            x = -options.arrowScroll;
            break;
        case key.right:
            x = options.arrowScroll;
            break;            
        default:
            return true; // a key we don't care about
    }

    scrollArray(elem, x, y);
    event.preventDefault();
    scheduleClearCache();
}

/**
 * Mousedown event only for updating activeElement
 */
function mousedown(event) {
    activeElement = event.target;
}


/***********************************************
 * OVERFLOW
 ***********************************************/

var uniqueID = (function () {
    var i = 0;
    return function (el) {
        return el.uniqueID || (el.uniqueID = i++);
    };
})();

var cache = {}; // cleared out after a scrolling session
var clearCacheTimer;

//setInterval(function () { cache = {}; }, 10 * 1000);

function scheduleClearCache() {
    clearTimeout(clearCacheTimer);
    clearCacheTimer = setInterval(function () { cache = {}; }, 1*1000);
}

function setCache(elems, overflowing) {
    for (var i = elems.length; i--;)
        cache[uniqueID(elems[i])] = overflowing;
    return overflowing;
}

//  (body)                (root)
//         | hidden | visible | scroll |  auto  |
// hidden  |   no   |    no   |   YES  |   YES  |
// visible |   no   |   YES   |   YES  |   YES  |
// scroll  |   no   |   YES   |   YES  |   YES  |
// auto    |   no   |   YES   |   YES  |   YES  |

function overflowingAncestor(el) {
    var elems = [];
    var body = document.body;
    var rootScrollHeight = root.scrollHeight;
    do {
        var cached = cache[uniqueID(el)];
        if (cached) {
            return setCache(elems, cached);
        }
        elems.push(el);
        if (rootScrollHeight === el.scrollHeight) {
            var topOverflowsNotHidden = overflowNotHidden(root) && overflowNotHidden(body);
            var isOverflowCSS = topOverflowsNotHidden || overflowAutoOrScroll(root);
            if (isFrame && isContentOverflowing(root) || 
               !isFrame && isOverflowCSS) {
                return setCache(elems, getScrollRoot()); 
            }
        } else if (isContentOverflowing(el) && overflowAutoOrScroll(el)) {
            return setCache(elems, el);
        }
    } while (el = el.parentElement);
}

function isContentOverflowing(el) {
    return (el.clientHeight + 10 < el.scrollHeight);
}

// typically for <body> and <html>
function overflowNotHidden(el) {
    var overflow = getComputedStyle(el, '').getPropertyValue('overflow-y');
    return (overflow !== 'hidden');
}

// for all other elements
function overflowAutoOrScroll(el) {
    var overflow = getComputedStyle(el, '').getPropertyValue('overflow-y');
    return (overflow === 'scroll' || overflow === 'auto');
}


/***********************************************
 * HELPERS
 ***********************************************/

function addEvent(type, fn) {
    window.addEventListener(type, fn, false);
}

function removeEvent(type, fn) {
    window.removeEventListener(type, fn, false);  
}

function isNodeName(el, tag) {
    return (el.nodeName||'').toLowerCase() === tag.toLowerCase();
}

function directionCheck(x, y) {
    x = (x > 0) ? 1 : -1;
    y = (y > 0) ? 1 : -1;
    if (direction.x !== x || direction.y !== y) {
        direction.x = x;
        direction.y = y;
        que = [];
        lastScroll = 0;
    }
}

var deltaBufferTimer;

if (window.localStorage && localStorage.SS_deltaBuffer) {
    deltaBuffer = localStorage.SS_deltaBuffer.split(',');
}

function isTouchpad(deltaY) {
    if (!deltaY) return;
    if (!deltaBuffer.length) {
        deltaBuffer = [deltaY, deltaY, deltaY];
    }
    deltaY = Math.abs(deltaY)
    deltaBuffer.push(deltaY);
    deltaBuffer.shift();
    clearTimeout(deltaBufferTimer);
    deltaBufferTimer = setTimeout(function () {
        if (window.localStorage) {
            localStorage.SS_deltaBuffer = deltaBuffer.join(',');
        }
    }, 1000);
    return !allDeltasDivisableBy(120) && !allDeltasDivisableBy(100);
} 

function isDivisible(n, divisor) {
    return (Math.floor(n / divisor) == n / divisor);
}

function allDeltasDivisableBy(divisor) {
    return (isDivisible(deltaBuffer[0], divisor) &&
            isDivisible(deltaBuffer[1], divisor) &&
            isDivisible(deltaBuffer[2], divisor));
}

function isInsideYoutubeVideo(event) {
    var elem = event.target;
    var isControl = false;
    if (document.URL.indexOf ('www.youtube.com/watch') != -1) {
        do {
            isControl = (elem.classList && 
                         elem.classList.contains('html5-video-controls'));
            if (isControl) break;
        } while (elem = elem.parentNode);
    }
    return isControl;
}

var requestFrame = (function () {
      return (window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    ||
              function (callback, element, delay) {
                 window.setTimeout(callback, delay || (1000/60));
             });
})();

var MutationObserver = (window.MutationObserver || 
                        window.WebKitMutationObserver ||
                        window.MozMutationObserver);  

var getScrollRoot = (function() {
  var SCROLL_ROOT;
  return function() {
    if (!SCROLL_ROOT) {
      var dummy = document.createElement('div');
      dummy.style.cssText = 'height:10000px;width:1px;';
      document.body.appendChild(dummy);
      var bodyScrollTop  = document.body.scrollTop;
      var docElScrollTop = document.documentElement.scrollTop;
      window.scrollBy(0, 3);
      if (document.body.scrollTop != bodyScrollTop)
        (SCROLL_ROOT = document.body);
      else 
        (SCROLL_ROOT = document.documentElement);
      window.scrollBy(0, -3);
      document.body.removeChild(dummy);
    }
    return SCROLL_ROOT;
  };
})();


/***********************************************
 * PULSE (by Michael Herf)
 ***********************************************/
 
/**
 * Viscous fluid with a pulse for part and decay for the rest.
 * - Applies a fixed force over an interval (a damped acceleration), and
 * - Lets the exponential bleed away the velocity over a longer interval
 * - Michael Herf, http://stereopsis.com/stopping/
 */
function pulse_(x) {
    var val, start, expx;
    // test
    x = x * options.pulseScale;
    if (x < 1) { // acceleartion
        val = x - (1 - Math.exp(-x));
    } else {     // tail
        // the previous animation ended here:
        start = Math.exp(-1);
        // simple viscous drag
        x -= 1;
        expx = 1 - Math.exp(-x);
        val = start + (expx * (1 - start));
    }
    return val * options.pulseNormalize;
}

function pulse(x) {
    if (x >= 1) return 1;
    if (x <= 0) return 0;

    if (options.pulseNormalize == 1) {
        options.pulseNormalize /= pulse_(1);
    }
    return pulse_(x);
}


/***********************************************
 * FIRST RUN
 ***********************************************/

var userAgent = window.navigator.userAgent;
var isEdge    = /Edge/.test(userAgent); // thank you MS
var isChrome  = /chrome/i.test(userAgent) && !isEdge; 
var isSafari  = /safari/i.test(userAgent) && !isEdge; 
var isMobile  = /mobile/i.test(userAgent);
var isIEWin7  = /Windows NT 6.1/i.test(userAgent) && /rv:11/i.test(userAgent);
var isEnabledForBrowser = (isChrome || isSafari || isIEWin7) && !isMobile;

var wheelEvent;
if ('onwheel' in document.createElement('div'))
    wheelEvent = 'wheel';
else if ('onmousewheel' in document.createElement('div'))
    wheelEvent = 'mousewheel';

if (wheelEvent && isEnabledForBrowser) {
    addEvent(wheelEvent, wheel);
    addEvent('mousedown', mousedown);
    addEvent('load', init);
}


/***********************************************
 * PUBLIC INTERFACE
 ***********************************************/

function SmoothScroll(optionsToSet) {
    for (var key in optionsToSet)
        if (defaultOptions.hasOwnProperty(key)) 
            options[key] = optionsToSet[key];
}
SmoothScroll.destroy = cleanup;

if (window.SmoothScrollOptions) // async API
    SmoothScroll(window.SmoothScrollOptions)

if (true)
    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
        return SmoothScroll;
    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
else if ('object' == typeof exports)
    module.exports = SmoothScroll;
else
    window.SmoothScroll = SmoothScroll;

})();

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* styles */
__webpack_require__(60)

/* script */
__vue_exports__ = __webpack_require__(13)

/* template */
var __vue_template__ = __webpack_require__(47)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/teddyzhu/Documents/JavaWork/code/lc4e/src/main/webapp/WEB-INF/views/themes/default/src/views/area.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2a84fd6b", __vue_options__)
  } else {
    hotAPI.reload("data-v-2a84fd6b", __vue_options__)
  }
})()}
if (__vue_options__.functional) {console.error("[vue-loader] area.vue: functional components are not supported and should be defined in plain js files using render functions.")}

module.exports = __vue_exports__


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* styles */
__webpack_require__(65)

/* script */
__vue_exports__ = __webpack_require__(15)

/* template */
var __vue_template__ = __webpack_require__(53)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/teddyzhu/Documents/JavaWork/code/lc4e/src/main/webapp/WEB-INF/views/themes/default/src/views/compments/footer.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6ed27702", __vue_options__)
  } else {
    hotAPI.reload("data-v-6ed27702", __vue_options__)
  }
})()}
if (__vue_options__.functional) {console.error("[vue-loader] footer.vue: functional components are not supported and should be defined in plain js files using render functions.")}

module.exports = __vue_exports__


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* styles */
__webpack_require__(68)

/* script */
__vue_exports__ = __webpack_require__(16)

/* template */
var __vue_template__ = __webpack_require__(56)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/teddyzhu/Documents/JavaWork/code/lc4e/src/main/webapp/WEB-INF/views/themes/default/src/views/compments/header.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-dff64a18", __vue_options__)
  } else {
    hotAPI.reload("data-v-dff64a18", __vue_options__)
  }
})()}
if (__vue_options__.functional) {console.error("[vue-loader] header.vue: functional components are not supported and should be defined in plain js files using render functions.")}

module.exports = __vue_exports__


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* styles */
__webpack_require__(58)

/* script */
__vue_exports__ = __webpack_require__(17)

/* template */
var __vue_template__ = __webpack_require__(45)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/teddyzhu/Documents/JavaWork/code/lc4e/src/main/webapp/WEB-INF/views/themes/default/src/views/index.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-02ce9b38", __vue_options__)
  } else {
    hotAPI.reload("data-v-02ce9b38", __vue_options__)
  }
})()}
if (__vue_options__.functional) {console.error("[vue-loader] index.vue: functional components are not supported and should be defined in plain js files using render functions.")}

module.exports = __vue_exports__


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* styles */
__webpack_require__(64)

/* script */
__vue_exports__ = __webpack_require__(19)

/* template */
var __vue_template__ = __webpack_require__(52)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/teddyzhu/Documents/JavaWork/code/lc4e/src/main/webapp/WEB-INF/views/themes/default/src/views/others/comment.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5b17e611", __vue_options__)
  } else {
    hotAPI.reload("data-v-5b17e611", __vue_options__)
  }
})()}
if (__vue_options__.functional) {console.error("[vue-loader] comment.vue: functional components are not supported and should be defined in plain js files using render functions.")}

module.exports = __vue_exports__


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* script */
__vue_exports__ = __webpack_require__(20)

/* template */
var __vue_template__ = __webpack_require__(50)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/teddyzhu/Documents/JavaWork/code/lc4e/src/main/webapp/WEB-INF/views/themes/default/src/views/others/menu.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4ac54a1d", __vue_options__)
  } else {
    hotAPI.reload("data-v-4ac54a1d", __vue_options__)
  }
})()}
if (__vue_options__.functional) {console.error("[vue-loader] menu.vue: functional components are not supported and should be defined in plain js files using render functions.")}

module.exports = __vue_exports__


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* styles */
__webpack_require__(59)

/* script */
__vue_exports__ = __webpack_require__(22)

/* template */
var __vue_template__ = __webpack_require__(46)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/teddyzhu/Documents/JavaWork/code/lc4e/src/main/webapp/WEB-INF/views/themes/default/src/views/others/subMenu.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-08136f71", __vue_options__)
  } else {
    hotAPI.reload("data-v-08136f71", __vue_options__)
  }
})()}
if (__vue_options__.functional) {console.error("[vue-loader] subMenu.vue: functional components are not supported and should be defined in plain js files using render functions.")}

module.exports = __vue_exports__


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__

/* styles */
__webpack_require__(62)

/* script */
__vue_exports__ = __webpack_require__(23)

/* template */
var __vue_template__ = __webpack_require__(49)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/teddyzhu/Documents/JavaWork/code/lc4e/src/main/webapp/WEB-INF/views/themes/default/src/views/topic.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-45e0e041", __vue_options__)
  } else {
    hotAPI.reload("data-v-45e0e041", __vue_options__)
  }
})()}
if (__vue_options__.functional) {console.error("[vue-loader] topic.vue: functional components are not supported and should be defined in plain js files using render functions.")}

module.exports = __vue_exports__


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

module.exports={render:function (){with(this) {
  return _h('sg-body', [_t("default", [_h('el-row', [_h('el-col', {
    attrs: {
      "span": 15
    }
  }, [_h('el-row', {
    attrs: {
      "type": "flex",
      "justify": "space-between"
    }
  }, [_h('el-col', {
    staticClass: "br-path",
    attrs: {
      "span": 13
    }
  }, [_h('el-breadcrumb', {
    attrs: {
      "separator": ">"
    }
  }, [_h('el-breadcrumb-item', {
    attrs: {
      "to": {
        path: '/'
      }
    }
  }, ["首页"]), " ", _h('el-breadcrumb-item', ["Area"])])]), " ", _h('el-col', {
    attrs: {
      "span": 5
    }
  }, [_h('el-select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (orderNow),
      expression: "orderNow"
    }],
    staticClass: "el-select-mini",
    domProps: {
      "value": (orderNow)
    },
    on: {
      "input": function($event) {
        orderNow = $event
      }
    }
  }, [_l((orders), function(orderItem) {
    return _h('el-option', {
      key: orderItem.value,
      attrs: {
        "label": orderItem.label
      },
      domProps: {
        "value": orderItem.value
      }
    })
  })])])]), " ", _h('el-row', [_h('el-col', {
    attrs: {
      "span": 24
    }
  }, [_l((topics), function(data) {
    return _h('sg-topic-Line', {
      attrs: {
        "data": data
      }
    })
  })])]), " ", _h('el-row', {
    attrs: {
      "type": "flex",
      "justify": "center"
    }
  }, [_h('el-col', {
    staticClass: "pager-center",
    attrs: {
      "span": 24
    }
  }, [_h('sg-pager', {
    staticClass: "inline-block",
    attrs: {
      "pageNow": page,
      "pageSize": size,
      "pageTotal": total
    },
    on: {
      "currentchange": pageChange
    }
  })])])]), " ", _h('el-col', {
    attrs: {
      "span": 7,
      "offset": 1
    }
  }, [_h('el-row', {
    staticClass: "topic-hot"
  }, [_h('el-col', {
    attrs: {
      "span": 24
    }
  }, [_m(0)]), " ", _l((hots), function(hot) {
    return _h('el-col', {
      staticClass: "topic-hot-line",
      attrs: {
        "span": 24
      }
    }, [_h('el-tag', {
      attrs: {
        "type": "primary"
      }
    }, [_h('router-link', {
      attrs: {
        "tag": "a",
        "to": '/a/' + hot.area
      }
    }, [_s(hot.area)])]), " ", _h('router-link', {
      attrs: {
        "tag": "a",
        "to": hot.link
      }
    }, [_s(hot.title)])])
  })])])])])])
}},staticRenderFns: [function (){with(this) {
  return _h('h3', ["Topic Hot"])
}}]}
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-02ce9b38", module.exports)
  }
}

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

module.exports={render:function (){with(this) {
  return _h('el-submenu', {
    attrs: {
      "index": menu.abbr
    }
  }, [_h('template', {
    slot: "title"
  }, [_s(menu.name)]), " ", _t("default")])
}},staticRenderFns: []}
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-08136f71", module.exports)
  }
}

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

module.exports={render:function (){with(this) {
  return _h('sg-body', [_t("default", [_h('el-row', [_h('el-col', {
    attrs: {
      "span": 15
    }
  }, [_h('el-row', {
    attrs: {
      "type": "flex",
      "justify": "space-between"
    }
  }, [_h('el-col', {
    staticClass: "br-path",
    attrs: {
      "span": 13
    }
  }, [_h('el-breadcrumb', {
    attrs: {
      "separator": ">"
    }
  }, [_h('el-breadcrumb-item', {
    attrs: {
      "to": {
        path: '/'
      }
    }
  }, ["首页"]), " ", _h('el-breadcrumb-item', ["Area"])])]), " ", _h('el-col', {
    attrs: {
      "span": 5
    }
  }, [_h('el-select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (orderNow),
      expression: "orderNow"
    }],
    staticClass: "el-select-mini",
    domProps: {
      "value": (orderNow)
    },
    on: {
      "input": function($event) {
        orderNow = $event
      }
    }
  }, [_l((orders), function(orderItem) {
    return _h('el-option', {
      key: orderItem.value,
      attrs: {
        "label": orderItem.label
      },
      domProps: {
        "value": orderItem.value
      }
    })
  })])])]), " ", _h('el-row', [_h('el-col', {
    attrs: {
      "span": 24
    }
  }, [_l((topics), function(data) {
    return _h('sg-topic-Line', {
      attrs: {
        "data": data
      }
    })
  })])]), " ", _h('el-row', {
    attrs: {
      "type": "flex",
      "justify": "center"
    }
  }, [_h('el-col', {
    staticClass: "pager-center",
    attrs: {
      "span": 24
    }
  }, [_h('sg-pager', {
    staticClass: "inline-block",
    attrs: {
      "pageNow": page,
      "pageSize": size,
      "pageTotal": total
    },
    on: {
      "currentchange": pageChange
    }
  })])])]), " ", _h('el-col', {
    attrs: {
      "span": 7,
      "offset": 1
    }
  }, [_h('el-row', {
    staticClass: "topic-hot"
  }, [_h('el-col', {
    attrs: {
      "span": 24
    }
  }, [_h('h3', [_s(area)])]), " ", _h('el-col', {
    staticClass: "topic-hot-line",
    attrs: {
      "span": 24
    }
  }, [_m(0)])])])])])])
}},staticRenderFns: [function (){with(this) {
  return _h('p', ["it's the description of area"])
}}]}
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-2a84fd6b", module.exports)
  }
}

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

module.exports={render:function (){with(this) {
  return _h('el-row', {
    staticClass: "topic-line"
  }, [_h('el-col', {
    attrs: {
      "span": 24
    }
  }, [_h('table', {
    staticClass: "topic-table"
  }, [_h('tr', [_h('td', {
    attrs: {
      "align": "center",
      "width": "10%"
    }
  }, [_h('a', {
    staticClass: "topic-author-img-a"
  }, [_h('img', {
    staticClass: "topic-line-img",
    attrs: {
      "src": data.imageUrl
    }
  })])]), " ", _h('td', {
    attrs: {
      "align": "left",
      "width": "75%"
    }
  }, [_h('router-link', {
    staticClass: "topic-line-title",
    attrs: {
      "to": data.articleUrl,
      "tag": "div"
    }
  }, ["\n                        " + _s(data.articleTitle) + "\n                    "]), " ", _h('div', {
    staticClass: "topic-line-meta"
  }, [_h('el-breadcrumb', {
    attrs: {
      "separator": "/"
    }
  }, [_h('el-breadcrumb-item', {
    attrs: {
      "to": {
        path: '/a/' + data.category
      }
    }
  }, [_h('el-tag', {
    staticClass: "el-tag-mini",
    attrs: {
      "type": "primary"
    }
  }, [_m(0), _s(data.category) + "\n                                "])]), " ", _h('el-breadcrumb-item', [_h('el-tag', {
    staticClass: "clickable el-tag-mini",
    attrs: {
      "type": "gray"
    }
  }, [_m(1), _s(data.user) + "\n                                "])]), " ", _h('el-breadcrumb-item', [_h('el-tag', {
    staticClass: "clickable el-tag-mini",
    attrs: {
      "type": "gray"
    }
  }, [_m(2), _s(data.comments) + "\n                                "])]), " ", _h('el-breadcrumb-item', [_h('el-tag', {
    staticClass: "clickable el-tag-mini",
    attrs: {
      "type": "gray"
    }
  }, [_m(3), _s(data.publishTime) + "\n                                "])])])])]), " ", _h('td', {
    attrs: {
      "align": "right"
    }
  }, [_l((data.statusText), function(label) {
    return (label != '') ? _h('el-tag', {
      attrs: {
        "type": "warning"
      }
    }, [_s(label)]) : _e()
  })])])])])])
}},staticRenderFns: [function (){with(this) {
  return _h('i', {
    staticClass: "iconfont icon-area"
  })
}},function (){with(this) {
  return _h('i', {
    staticClass: "iconfont icon-people"
  })
}},function (){with(this) {
  return _h('i', {
    staticClass: "iconfont icon-cmt"
  })
}},function (){with(this) {
  return _h('i', {
    staticClass: "iconfont icon-time"
  })
}}]}
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-441ae050", module.exports)
  }
}

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

module.exports={render:function (){with(this) {
  return _h('sg-body', [_t("default", [_h('el-row', [_h('el-col', {
    attrs: {
      "span": 15
    }
  }, [_h('el-row', [_h('el-col', {
    attrs: {
      "span": 24
    }
  }, [_h('table', [_h('tr', [_h('td', [_s(topic.name)]), " ", _h('td', [_s(topic.title)])]), " ", _h('tr', [_h('td', [_h('img', {
    attrs: {
      "src": '/images/avatar' + topic.imgUrl
    }
  })]), " ", _h('td', [_h('sg-common', {
    attrs: {
      "body": topic.body
    }
  })])])])])]), " ", _h('el-row', [_h('el-col', {
    attrs: {
      "span": 24
    }
  }, [_l((comments), function(comment) {
    return _h('table', {
      staticClass: "comment"
    }, [_h('tr', [_h('td', [_h('img', {
      attrs: {
        "src": '/images/avatar' + comment.imgUrl
      }
    })]), " ", _h('td', [_h('sg-common', {
      attrs: {
        "body": topic.body
      }
    })])]), " ", _h('tr', [_h('td', {
      attrs: {
        "align": "center"
      }
    }, ["\n                                    " + _s(comment.name) + "\n                                "]), " ", _h('td', [_h('sg-common', {
      attrs: {
        "body": comment.body
      }
    })])])])
  })])]), " ", _h('el-row', {
    attrs: {
      "type": "flex",
      "justify": "center"
    }
  }, [_h('el-col', {
    staticClass: "pager-center",
    attrs: {
      "span": 24
    }
  }, [_h('sg-pager', {
    staticClass: "inline-block",
    attrs: {
      "pageNow": page,
      "pageSize": size,
      "pageTotal": total
    },
    on: {
      "currentchange": pageChange
    }
  })])])]), " ", _h('el-col', {
    attrs: {
      "span": 7,
      "offset": 1
    }
  }, ["\n                right\n            "])])])])
}},staticRenderFns: []}
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-45e0e041", module.exports)
  }
}

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

module.exports={render:function (){with(this) {
  return (menu.children.length == 0) ? _h('el-menu-item', {
    attrs: {
      "index": menu.abbr
    }
  }, [_s(menu.name)]) : _h('sg-subMenu', {
    attrs: {
      "menu": menu
    }
  }, [_t("default", [_l((menu.children), function(menuchild) {
    return _h('sg-menu', {
      attrs: {
        "menu": menuchild
      }
    })
  })])])
}},staticRenderFns: []}
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-4ac54a1d", module.exports)
  }
}

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

module.exports={render:function (){with(this) {
  return _h('el-row', [_h('el-col', {
    attrs: {
      "span": 24
    }
  }, [_h('sg-header', {
    attrs: {
      "menus": menus
    }
  }), " ", _h('router-view'), " ", _h('sg-footer', {
    attrs: {
      "siteName": siteName,
      "version": version
    }
  })])])
}},staticRenderFns: []}
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-53b92194", module.exports)
  }
}

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

module.exports={render:function (){with(this) {
  return _h('el-row', [_h('el-col', {
    attrs: {
      "span": 24
    }
  }, ["\n        " + _s(body) + "\n    "])])
}},staticRenderFns: []}
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-5b17e611", module.exports)
  }
}

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

module.exports={render:function (){with(this) {
  return _h('el-row', {
    staticClass: "bg-black-light",
    attrs: {
      "type": "flex",
      "justify": "center"
    }
  }, [_h('el-col', {
    attrs: {
      "span": 22
    }
  }, [_h('div', {
    staticClass: "footer-des"
  }, [_h('p', [_s(siteName) + " " + _s(version)]), " ", _m(0), " ", _m(1), " ", _m(2)]), " ", _m(3)])])
}},staticRenderFns: [function (){with(this) {
  return _h('a', {
    staticClass: "footer-a",
    attrs: {
      "target": "_blank",
      "href": "http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html"
    }
  }, ["JDK8"])
}},function (){with(this) {
  return _h('a', {
    staticClass: "footer-a",
    attrs: {
      "target": "_blank",
      "href": "https://github.com/Teddy-Zhu/SilentGo"
    }
  }, ["SilentGo"])
}},function (){with(this) {
  return _h('a', {
    staticClass: "footer-a",
    attrs: {
      "target": "_blank",
      "href": "https://github.com/vuejs/vue"
    }
  }, ["Vue2"])
}},function (){with(this) {
  return _h('div', {
    staticClass: "footer-icon"
  }, [_h('a', {
    attrs: {
      "href": "https://github.com/Teddy-Zhu/lc4e",
      "target": "_blank"
    }
  }, [_h('i', {
    staticClass: "iconfont icon-github"
  })])])
}}]}
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-6ed27702", module.exports)
  }
}

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

module.exports={render:function (){with(this) {
  return _h('el-pagination', {
    attrs: {
      "current-page": pageNow,
      "page-size": pageSize,
      "layout": "prev, pager, next, jumper",
      "total": pageTotal
    },
    on: {
      "sizechange": handleSizeChange,
      "currentchange": handleCurrentChange
    }
  })
}},staticRenderFns: []}
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-bd9e1816", module.exports)
  }
}

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

module.exports={render:function (){with(this) {
  return _h('el-row', {
    staticClass: "sg-body",
    attrs: {
      "type": "flex",
      "justify": "center"
    }
  }, [_h('el-col', {
    attrs: {
      "span": col
    }
  }, [_t("default")])])
}},staticRenderFns: []}
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-ca8d316e", module.exports)
  }
}

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

module.exports={render:function (){with(this) {
  return _h('el-row', [_h('el-col', {
    staticClass: "menu-panel",
    attrs: {
      "span": 24
    }
  }, [_h('el-menu', {
    staticClass: "sg-header",
    class: {
      fixed: fixed
    },
    attrs: {
      "default-active": "/",
      "theme": "dark",
      "mode": mode
    },
    on: {
      "select": select
    }
  }, [_l((menus), function(menu) {
    return _h('sg-menu', {
      attrs: {
        "menu": menu
      }
    })
  })])])])
}},staticRenderFns: []}
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-dff64a18", module.exports)
  }
}

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

/**
 * vue-router v2.0.1
 * (c) 2016 Evan You
 * @license MIT
 */
(function (global, factory) {
   true ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.VueRouter = factory());
}(this, (function () { 'use strict';

var View = {
  name: 'router-view',
  functional: true,
  props: {
    name: {
      type: String,
      default: 'default'
    }
  },
  render: function render (h, ref) {
    var props = ref.props;
    var children = ref.children;
    var parent = ref.parent;
    var data = ref.data;

    data.routerView = true

    var route = parent.$route
    var cache = parent._routerViewCache || (parent._routerViewCache = {})
    var depth = 0
    var inactive = false

    while (parent) {
      if (parent.$vnode && parent.$vnode.data.routerView) {
        depth++
      }
      if (parent._inactive) {
        inactive = true
      }
      parent = parent.$parent
    }

    data.routerViewDepth = depth
    var matched = route.matched[depth]
    if (!matched) {
      return h()
    }

    var name = props.name
    var component = inactive
      ? cache[name]
      : (cache[name] = matched.components[name])

    if (!inactive) {
      var hooks = data.hook || (data.hook = {})
      hooks.init = function (vnode) {
        matched.instances[name] = vnode.child
      }
      hooks.destroy = function (vnode) {
        if (matched.instances[name] === vnode.child) {
          matched.instances[name] = undefined
        }
      }
    }

    return h(component, data, children)
  }
}

/*  */

function resolvePath (
  relative,
  base,
  append
) {
  if (relative.charAt(0) === '/') {
    return relative
  }

  if (relative.charAt(0) === '?' || relative.charAt(0) === '#') {
    return base + relative
  }

  var stack = base.split('/')

  // remove trailing segment if:
  // - not appending
  // - appending to trailing slash (last segment is empty)
  if (!append || !stack[stack.length - 1]) {
    stack.pop()
  }

  // resolve relative path
  var segments = relative.replace(/^\//, '').split('/')
  for (var i = 0; i < segments.length; i++) {
    var segment = segments[i]
    if (segment === '.') {
      continue
    } else if (segment === '..') {
      stack.pop()
    } else {
      stack.push(segment)
    }
  }

  // ensure leading slash
  if (stack[0] !== '') {
    stack.unshift('')
  }

  return stack.join('/')
}

function parsePath (path) {
  var hash = ''
  var query = ''

  var hashIndex = path.indexOf('#')
  if (hashIndex >= 0) {
    hash = path.slice(hashIndex)
    path = path.slice(0, hashIndex)
  }

  var queryIndex = path.indexOf('?')
  if (queryIndex >= 0) {
    query = path.slice(queryIndex + 1)
    path = path.slice(0, queryIndex)
  }

  return {
    path: path,
    query: query,
    hash: hash
  }
}

function cleanPath (path) {
  return path.replace(/\/\//g, '/')
}

/*  */

function assert (condition, message) {
  if (!condition) {
    throw new Error(("[vue-router] " + message))
  }
}

function warn (condition, message) {
  if (!condition) {
    typeof console !== 'undefined' && console.warn(("[vue-router] " + message))
  }
}

/*  */

var encode = encodeURIComponent
var decode = decodeURIComponent

function resolveQuery (
  query,
  extraQuery
) {
  if ( extraQuery === void 0 ) extraQuery = {};

  if (query) {
    var parsedQuery
    try {
      parsedQuery = parseQuery(query)
    } catch (e) {
      warn(false, e.message)
      parsedQuery = {}
    }
    for (var key in extraQuery) {
      parsedQuery[key] = extraQuery[key]
    }
    return parsedQuery
  } else {
    return extraQuery
  }
}

function parseQuery (query) {
  var res = Object.create(null)

  query = query.trim().replace(/^(\?|#|&)/, '')

  if (!query) {
    return res
  }

  query.split('&').forEach(function (param) {
    var parts = param.replace(/\+/g, ' ').split('=')
    var key = decode(parts.shift())
    var val = parts.length > 0
      ? decode(parts.join('='))
      : null

    if (res[key] === undefined) {
      res[key] = val
    } else if (Array.isArray(res[key])) {
      res[key].push(val)
    } else {
      res[key] = [res[key], val]
    }
  })

  return res
}

function stringifyQuery (obj) {
  var res = obj ? Object.keys(obj).sort().map(function (key) {
    var val = obj[key]

    if (val === undefined) {
      return ''
    }

    if (val === null) {
      return encode(key)
    }

    if (Array.isArray(val)) {
      var result = []
      val.slice().forEach(function (val2) {
        if (val2 === undefined) {
          return
        }
        if (val2 === null) {
          result.push(encode(key))
        } else {
          result.push(encode(key) + '=' + encode(val2))
        }
      })
      return result.join('&')
    }

    return encode(key) + '=' + encode(val)
  }).filter(function (x) { return x.length > 0; }).join('&') : null
  return res ? ("?" + res) : ''
}

/*  */

function createRoute (
  record,
  location,
  redirectedFrom
) {
  var route = {
    name: location.name || (record && record.name),
    meta: (record && record.meta) || {},
    path: location.path || '/',
    hash: location.hash || '',
    query: location.query || {},
    params: location.params || {},
    fullPath: getFullPath(location),
    matched: record ? formatMatch(record) : []
  }
  if (redirectedFrom) {
    route.redirectedFrom = getFullPath(redirectedFrom)
  }
  return Object.freeze(route)
}

// the starting route that represents the initial state
var START = createRoute(null, {
  path: '/'
})

function formatMatch (record) {
  var res = []
  while (record) {
    res.unshift(record)
    record = record.parent
  }
  return res
}

function getFullPath (ref) {
  var path = ref.path;
  var query = ref.query; if ( query === void 0 ) query = {};
  var hash = ref.hash; if ( hash === void 0 ) hash = '';

  return (path || '/') + stringifyQuery(query) + hash
}

var trailingSlashRE = /\/$/
function isSameRoute (a, b) {
  if (b === START) {
    return a === b
  } else if (!b) {
    return false
  } else if (a.path && b.path) {
    return (
      a.path.replace(trailingSlashRE, '') === b.path.replace(trailingSlashRE, '') &&
      a.hash === b.hash &&
      isObjectEqual(a.query, b.query)
    )
  } else if (a.name && b.name) {
    return (
      a.name === b.name &&
      a.hash === b.hash &&
      isObjectEqual(a.query, b.query) &&
      isObjectEqual(a.params, b.params)
    )
  } else {
    return false
  }
}

function isObjectEqual (a, b) {
  if ( a === void 0 ) a = {};
  if ( b === void 0 ) b = {};

  var aKeys = Object.keys(a)
  var bKeys = Object.keys(b)
  if (aKeys.length !== bKeys.length) {
    return false
  }
  return aKeys.every(function (key) { return String(a[key]) === String(b[key]); })
}

function isIncludedRoute (current, target) {
  return (
    current.path.indexOf(target.path) === 0 &&
    (!target.hash || current.hash === target.hash) &&
    queryIncludes(current.query, target.query)
  )
}

function queryIncludes (current, target) {
  for (var key in target) {
    if (!(key in current)) {
      return false
    }
  }
  return true
}

/*  */

function normalizeLocation (
  raw,
  current,
  append
) {
  var next = typeof raw === 'string' ? { path: raw } : raw
  if (next.name || next._normalized) {
    return next
  }

  var parsedPath = parsePath(next.path || '')
  var basePath = (current && current.path) || '/'
  var path = parsedPath.path
    ? resolvePath(parsedPath.path, basePath, append)
    : (current && current.path) || '/'
  var query = resolveQuery(parsedPath.query, next.query)
  var hash = next.hash || parsedPath.hash
  if (hash && hash.charAt(0) !== '#') {
    hash = "#" + hash
  }

  return {
    _normalized: true,
    path: path,
    query: query,
    hash: hash
  }
}

/*  */

// work around weird flow bug
var toTypes = [String, Object]

var Link = {
  name: 'router-link',
  props: {
    to: {
      type: toTypes,
      required: true
    },
    tag: {
      type: String,
      default: 'a'
    },
    exact: Boolean,
    append: Boolean,
    replace: Boolean,
    activeClass: String
  },
  render: function render (h) {
    var this$1 = this;

    var router = this.$router
    var current = this.$route
    var to = normalizeLocation(this.to, current, this.append)
    var resolved = router.match(to)
    var fullPath = resolved.redirectedFrom || resolved.fullPath
    var base = router.history.base
    var href = base ? cleanPath(base + fullPath) : fullPath
    var classes = {}
    var activeClass = this.activeClass || router.options.linkActiveClass || 'router-link-active'
    var compareTarget = to.path ? createRoute(null, to) : resolved
    classes[activeClass] = this.exact
      ? isSameRoute(current, compareTarget)
      : isIncludedRoute(current, compareTarget)

    var on = {
      click: function (e) {
        // don't redirect with control keys
        /* istanbul ignore if */
        if (e.metaKey || e.ctrlKey || e.shiftKey) { return }
        // don't redirect when preventDefault called
        /* istanbul ignore if */
        if (e.defaultPrevented) { return }
        // don't redirect on right click
        /* istanbul ignore if */
        if (e.button !== 0) { return }
        e.preventDefault()
        if (this$1.replace) {
          router.replace(to)
        } else {
          router.push(to)
        }
      }
    }

    var data = {
      class: classes
    }

    if (this.tag === 'a') {
      data.on = on
      data.attrs = { href: href }
    } else {
      // find the first <a> child and apply listener and href
      var a = findAnchor(this.$slots.default)
      if (a) {
        var aData = a.data || (a.data = {})
        aData.on = on
        var aAttrs = aData.attrs || (aData.attrs = {})
        aAttrs.href = href
      } else {
        // doesn't have <a> child, apply listener to self
        data.on = on
      }
    }

    return h(this.tag, data, this.$slots.default)
  }
}

function findAnchor (children) {
  if (children) {
    var child
    for (var i = 0; i < children.length; i++) {
      child = children[i]
      if (child.tag === 'a') {
        return child
      }
      if (child.children && (child = findAnchor(child.children))) {
        return child
      }
    }
  }
}

function install (Vue) {
  if (install.installed) { return }
  install.installed = true

  Object.defineProperty(Vue.prototype, '$router', {
    get: function get () { return this.$root._router }
  })

  Object.defineProperty(Vue.prototype, '$route', {
    get: function get$1 () { return this.$root._route }
  })

  Vue.mixin({
    beforeCreate: function beforeCreate () {
      if (this.$options.router) {
        this._router = this.$options.router
        this._router.init(this)
        Vue.util.defineReactive(this, '_route', this._router.history.current)
      }
    }
  })

  Vue.component('router-view', View)
  Vue.component('router-link', Link)
}

var __moduleExports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

var isarray = __moduleExports

/**
 * Expose `pathToRegexp`.
 */
var index = pathToRegexp
var parse_1 = parse
var compile_1 = compile
var tokensToFunction_1 = tokensToFunction
var tokensToRegExp_1 = tokensToRegExp

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
  // Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'
].join('|'), 'g')

/**
 * Parse a string for the raw tokens.
 *
 * @param  {string} str
 * @return {!Array}
 */
function parse (str) {
  var tokens = []
  var key = 0
  var index = 0
  var path = ''
  var res

  while ((res = PATH_REGEXP.exec(str)) != null) {
    var m = res[0]
    var escaped = res[1]
    var offset = res.index
    path += str.slice(index, offset)
    index = offset + m.length

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1]
      continue
    }

    var next = str[index]
    var prefix = res[2]
    var name = res[3]
    var capture = res[4]
    var group = res[5]
    var modifier = res[6]
    var asterisk = res[7]

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path)
      path = ''
    }

    var partial = prefix != null && next != null && next !== prefix
    var repeat = modifier === '+' || modifier === '*'
    var optional = modifier === '?' || modifier === '*'
    var delimiter = res[2] || '/'
    var pattern = capture || group || (asterisk ? '.*' : '[^' + delimiter + ']+?')

    tokens.push({
      name: name || key++,
      prefix: prefix || '',
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      partial: partial,
      asterisk: !!asterisk,
      pattern: escapeGroup(pattern)
    })
  }

  // Match any characters still remaining.
  if (index < str.length) {
    path += str.substr(index)
  }

  // If the path exists, push it onto the end.
  if (path) {
    tokens.push(path)
  }

  return tokens
}

/**
 * Compile a string to a template function for the path.
 *
 * @param  {string}             str
 * @return {!function(Object=, Object=)}
 */
function compile (str) {
  return tokensToFunction(parse(str))
}

/**
 * Prettier encoding of URI path segments.
 *
 * @param  {string}
 * @return {string}
 */
function encodeURIComponentPretty (str) {
  return encodeURI(str).replace(/[\/?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
 *
 * @param  {string}
 * @return {string}
 */
function encodeAsterisk (str) {
  return encodeURI(str).replace(/[?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction (tokens) {
  // Compile all the tokens into regexps.
  var matches = new Array(tokens.length)

  // Compile all the patterns before compilation.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] === 'object') {
      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$')
    }
  }

  return function (obj, opts) {
    var path = ''
    var data = obj || {}
    var options = opts || {}
    var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i]

      if (typeof token === 'string') {
        path += token

        continue
      }

      var value = data[token.name]
      var segment

      if (value == null) {
        if (token.optional) {
          // Prepend partial segment prefixes.
          if (token.partial) {
            path += token.prefix
          }

          continue
        } else {
          throw new TypeError('Expected "' + token.name + '" to be defined')
        }
      }

      if (isarray(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`')
        }

        if (value.length === 0) {
          if (token.optional) {
            continue
          } else {
            throw new TypeError('Expected "' + token.name + '" to not be empty')
          }
        }

        for (var j = 0; j < value.length; j++) {
          segment = encode(value[j])

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`')
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment
        }

        continue
      }

      segment = token.asterisk ? encodeAsterisk(value) : encode(value)

      if (!matches[i].test(segment)) {
        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
      }

      path += token.prefix + segment
    }

    return path
  }
}

/**
 * Escape a regular expression string.
 *
 * @param  {string} str
 * @return {string}
 */
function escapeString (str) {
  return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1')
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {string} group
 * @return {string}
 */
function escapeGroup (group) {
  return group.replace(/([=!:$\/()])/g, '\\$1')
}

/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {!RegExp} re
 * @param  {Array}   keys
 * @return {!RegExp}
 */
function attachKeys (re, keys) {
  re.keys = keys
  return re
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {string}
 */
function flags (options) {
  return options.sensitive ? '' : 'i'
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {!RegExp} path
 * @param  {!Array}  keys
 * @return {!RegExp}
 */
function regexpToRegexp (path, keys) {
  // Use a negative lookahead to match only capturing groups.
  var groups = path.source.match(/\((?!\?)/g)

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name: i,
        prefix: null,
        delimiter: null,
        optional: false,
        repeat: false,
        partial: false,
        asterisk: false,
        pattern: null
      })
    }
  }

  return attachKeys(path, keys)
}

/**
 * Transform an array into a regexp.
 *
 * @param  {!Array}  path
 * @param  {Array}   keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function arrayToRegexp (path, keys, options) {
  var parts = []

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source)
  }

  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options))

  return attachKeys(regexp, keys)
}

/**
 * Create a path regexp from string input.
 *
 * @param  {string}  path
 * @param  {!Array}  keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function stringToRegexp (path, keys, options) {
  var tokens = parse(path)
  var re = tokensToRegExp(tokens, options)

  // Attach keys back to the regexp.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] !== 'string') {
      keys.push(tokens[i])
    }
  }

  return attachKeys(re, keys)
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {!Array}  tokens
 * @param  {Object=} options
 * @return {!RegExp}
 */
function tokensToRegExp (tokens, options) {
  options = options || {}

  var strict = options.strict
  var end = options.end !== false
  var route = ''
  var lastToken = tokens[tokens.length - 1]
  var endsWithSlash = typeof lastToken === 'string' && /\/$/.test(lastToken)

  // Iterate over the tokens and create our regexp string.
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i]

    if (typeof token === 'string') {
      route += escapeString(token)
    } else {
      var prefix = escapeString(token.prefix)
      var capture = '(?:' + token.pattern + ')'

      if (token.repeat) {
        capture += '(?:' + prefix + capture + ')*'
      }

      if (token.optional) {
        if (!token.partial) {
          capture = '(?:' + prefix + '(' + capture + '))?'
        } else {
          capture = prefix + '(' + capture + ')?'
        }
      } else {
        capture = prefix + '(' + capture + ')'
      }

      route += capture
    }
  }

  // In non-strict mode we allow a slash at the end of match. If the path to
  // match already ends with a slash, we remove it for consistency. The slash
  // is valid at the end of a path match, not in the middle. This is important
  // in non-ending mode, where "/test/" shouldn't match "/test//route".
  if (!strict) {
    route = (endsWithSlash ? route.slice(0, -2) : route) + '(?:\\/(?=$))?'
  }

  if (end) {
    route += '$'
  } else {
    // In non-ending mode, we need the capturing groups to match as much as
    // possible by using a positive lookahead to the end or next path segment.
    route += strict && endsWithSlash ? '' : '(?=\\/|$)'
  }

  return new RegExp('^' + route, flags(options))
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(string|RegExp|Array)} path
 * @param  {(Array|Object)=}       keys
 * @param  {Object=}               options
 * @return {!RegExp}
 */
function pathToRegexp (path, keys, options) {
  keys = keys || []

  if (!isarray(keys)) {
    options = /** @type {!Object} */ (keys)
    keys = []
  } else if (!options) {
    options = {}
  }

  if (path instanceof RegExp) {
    return regexpToRegexp(path, /** @type {!Array} */ (keys))
  }

  if (isarray(path)) {
    return arrayToRegexp(/** @type {!Array} */ (path), /** @type {!Array} */ (keys), options)
  }

  return stringToRegexp(/** @type {string} */ (path), /** @type {!Array} */ (keys), options)
}

index.parse = parse_1;
index.compile = compile_1;
index.tokensToFunction = tokensToFunction_1;
index.tokensToRegExp = tokensToRegExp_1;

/*  */

function createRouteMap (routes) {
  var pathMap = Object.create(null)
  var nameMap = Object.create(null)

  routes.forEach(function (route) {
    addRouteRecord(pathMap, nameMap, route)
  })

  return {
    pathMap: pathMap,
    nameMap: nameMap
  }
}

function addRouteRecord (
  pathMap,
  nameMap,
  route,
  parent,
  matchAs
) {
  var path = route.path;
  var name = route.name;
  assert(path != null, "\"path\" is required in a route configuration.")

  var record = {
    path: normalizePath(path, parent),
    components: route.components || { default: route.component },
    instances: {},
    name: name,
    parent: parent,
    matchAs: matchAs,
    redirect: route.redirect,
    beforeEnter: route.beforeEnter,
    meta: route.meta || {}
  }

  if (route.children) {
    // Warn if route is named and has a default child route.
    // If users navigate to this route by name, the default child will
    // not be rendered (GH Issue #629)
    if (false) {}
    route.children.forEach(function (child) {
      addRouteRecord(pathMap, nameMap, child, record)
    })
  }

  if (route.alias) {
    if (Array.isArray(route.alias)) {
      route.alias.forEach(function (alias) {
        addRouteRecord(pathMap, nameMap, { path: alias }, parent, record.path)
      })
    } else {
      addRouteRecord(pathMap, nameMap, { path: route.alias }, parent, record.path)
    }
  }

  pathMap[record.path] = record
  if (name) { nameMap[name] = record }
}

function normalizePath (path, parent) {
  path = path.replace(/\/$/, '')
  if (path[0] === '/') { return path }
  if (parent == null) { return path }
  return cleanPath(((parent.path) + "/" + path))
}

/*  */

var regexpCache = Object.create(null)

var regexpCompileCache = Object.create(null)

function createMatcher (routes) {
  var ref = createRouteMap(routes);
  var pathMap = ref.pathMap;
  var nameMap = ref.nameMap;

  function match (
    raw,
    currentRoute,
    redirectedFrom
  ) {
    var location = normalizeLocation(raw, currentRoute)
    var name = location.name;

    if (name) {
      var record = nameMap[name]
      if (record) {
        location.path = fillParams(record.path, location.params, ("named route \"" + name + "\""))
        return _createRoute(record, location, redirectedFrom)
      }
    } else if (location.path) {
      location.params = {}
      for (var path in pathMap) {
        if (matchRoute(path, location.params, location.path)) {
          return _createRoute(pathMap[path], location, redirectedFrom)
        }
      }
    }
    // no match
    return _createRoute(null, location)
  }

  function redirect (
    record,
    location
  ) {
    var originalRedirect = record.redirect
    var redirect = typeof originalRedirect === 'function'
        ? originalRedirect(createRoute(record, location))
        : originalRedirect

    if (typeof redirect === 'string') {
      redirect = { path: redirect }
    }

    if (!redirect || typeof redirect !== 'object') {
      warn(false, ("invalid redirect option: " + (JSON.stringify(redirect))))
      return _createRoute(null, location)
    }

    var re = redirect
    var name = re.name;
    var path = re.path;
    var query = location.query;
    var hash = location.hash;
    var params = location.params;
    query = re.hasOwnProperty('query') ? re.query : query
    hash = re.hasOwnProperty('hash') ? re.hash : hash
    params = re.hasOwnProperty('params') ? re.params : params

    if (name) {
      // resolved named direct
      var targetRecord = nameMap[name]
      assert(targetRecord, ("redirect failed: named route \"" + name + "\" not found."))
      return match({
        _normalized: true,
        name: name,
        query: query,
        hash: hash,
        params: params
      }, undefined, location)
    } else if (path) {
      // 1. resolve relative redirect
      var rawPath = resolveRecordPath(path, record)
      // 2. resolve params
      var resolvedPath = fillParams(rawPath, params, ("redirect route with path \"" + rawPath + "\""))
      // 3. rematch with existing query and hash
      return match({
        _normalized: true,
        path: resolvedPath,
        query: query,
        hash: hash
      }, undefined, location)
    } else {
      warn(false, ("invalid redirect option: " + (JSON.stringify(redirect))))
      return _createRoute(null, location)
    }
  }

  function alias (
    record,
    location,
    matchAs
  ) {
    var aliasedPath = fillParams(matchAs, location.params, ("aliased route with path \"" + matchAs + "\""))
    var aliasedMatch = match({
      _normalized: true,
      path: aliasedPath
    })
    if (aliasedMatch) {
      var matched = aliasedMatch.matched
      var aliasedRecord = matched[matched.length - 1]
      location.params = aliasedMatch.params
      return _createRoute(aliasedRecord, location)
    }
    return _createRoute(null, location)
  }

  function _createRoute (
    record,
    location,
    redirectedFrom
  ) {
    if (record && record.redirect) {
      return redirect(record, redirectedFrom || location)
    }
    if (record && record.matchAs) {
      return alias(record, location, record.matchAs)
    }
    return createRoute(record, location, redirectedFrom)
  }

  return match
}

function matchRoute (
  path,
  params,
  pathname
) {
  var keys, regexp
  var hit = regexpCache[path]
  if (hit) {
    keys = hit.keys
    regexp = hit.regexp
  } else {
    keys = []
    regexp = index(path, keys)
    regexpCache[path] = { keys: keys, regexp: regexp }
  }
  var m = pathname.match(regexp)

  if (!m) {
    return false
  } else if (!params) {
    return true
  }

  for (var i = 1, len = m.length; i < len; ++i) {
    var key = keys[i - 1]
    var val = typeof m[i] === 'string' ? decodeURIComponent(m[i]) : m[i]
    if (key) { params[key.name] = val }
  }

  return true
}

function fillParams (
  path,
  params,
  routeMsg
) {
  try {
    var filler =
      regexpCompileCache[path] ||
      (regexpCompileCache[path] = index.compile(path))
    return filler(params || {}, { pretty: true })
  } catch (e) {
    assert(false, ("missing param for " + routeMsg + ": " + (e.message)))
    return ''
  }
}

function resolveRecordPath (path, record) {
  return resolvePath(path, record.parent ? record.parent.path : '/', true)
}

/*  */

var inBrowser = typeof window !== 'undefined'

var supportsHistory = inBrowser && (function () {
  var ua = window.navigator.userAgent

  if (
    (ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
    ua.indexOf('Mobile Safari') !== -1 &&
    ua.indexOf('Chrome') === -1 &&
    ua.indexOf('Windows Phone') === -1
  ) {
    return false
  }

  return window.history && 'pushState' in window.history
})()

/*  */

function runQueue (queue, fn, cb) {
  var step = function (index) {
    if (index >= queue.length) {
      cb()
    } else {
      if (queue[index]) {
        fn(queue[index], function () {
          step(index + 1)
        })
      } else {
        step(index + 1)
      }
    }
  }
  step(0)
}

/*  */


var History = function History (router, base) {
  this.router = router
  this.base = normalizeBase(base)
  // start with a route object that stands for "nowhere"
  this.current = START
  this.pending = null
};

History.prototype.listen = function listen (cb) {
  this.cb = cb
};

History.prototype.transitionTo = function transitionTo (location, cb) {
    var this$1 = this;

  var route = this.router.match(location, this.current)
  this.confirmTransition(route, function () {
    this$1.updateRoute(route)
    cb && cb(route)
    this$1.ensureURL()
  })
};

History.prototype.confirmTransition = function confirmTransition (route, cb) {
    var this$1 = this;

  var current = this.current
  if (isSameRoute(route, current)) {
    this.ensureURL()
    return
  }

  var ref = resolveQueue(this.current.matched, route.matched);
    var deactivated = ref.deactivated;
    var activated = ref.activated;

  var queue = [].concat(
    // in-component leave guards
    extractLeaveGuards(deactivated),
    // global before hooks
    this.router.beforeHooks,
    // enter guards
    activated.map(function (m) { return m.beforeEnter; }),
    // async components
    resolveAsyncComponents(activated)
  )

  this.pending = route
  var iterator = function (hook, next) {
    if (this$1.pending !== route) { return }
    hook(route, current, function (to) {
      if (to === false) {
        // next(false) -> abort navigation, ensure current URL
        this$1.ensureURL()
      } else if (typeof to === 'string' || typeof to === 'object') {
        // next('/') or next({ path: '/' }) -> redirect
        this$1.push(to)
      } else {
        // confirm transition and pass on the value
        next(to)
      }
    })
  }

  runQueue(queue, iterator, function () {
    var postEnterCbs = []
    var enterGuards = extractEnterGuards(activated, postEnterCbs, function () {
      return this$1.current === route
    })
    // wait until async components are resolved before
    // extracting in-component enter guards
    runQueue(enterGuards, iterator, function () {
      if (this$1.pending === route) {
        this$1.pending = null
        cb(route)
        this$1.router.app.$nextTick(function () {
          postEnterCbs.forEach(function (cb) { return cb(); })
        })
      }
    })
  })
};

History.prototype.updateRoute = function updateRoute (route) {
  var prev = this.current
  this.current = route
  this.cb && this.cb(route)
  this.router.afterHooks.forEach(function (hook) {
    hook && hook(route, prev)
  })
};

function normalizeBase (base) {
  if (!base) {
    if (inBrowser) {
      // respect <base> tag
      var baseEl = document.querySelector('base')
      base = baseEl ? baseEl.getAttribute('href') : '/'
    } else {
      base = '/'
    }
  }
  // make sure there's the starting slash
  if (base.charAt(0) !== '/') {
    base = '/' + base
  }
  // remove trailing slash
  return base.replace(/\/$/, '')
}

function resolveQueue (
  current,
  next
) {
  var i
  var max = Math.max(current.length, next.length)
  for (i = 0; i < max; i++) {
    if (current[i] !== next[i]) {
      break
    }
  }
  return {
    activated: next.slice(i),
    deactivated: current.slice(i)
  }
}

function extractLeaveGuards (matched) {
  return flatMapComponents(matched, function (def, instance) {
    var guard = def && def.beforeRouteLeave
    if (guard) {
      return function routeLeaveGuard () {
        return guard.apply(instance, arguments)
      }
    }
  }).reverse()
}

function extractEnterGuards (
  matched,
  cbs,
  isValid
) {
  return flatMapComponents(matched, function (def, _, match, key) {
    var guard = def && def.beforeRouteEnter
    if (guard) {
      return function routeEnterGuard (to, from, next) {
        return guard(to, from, function (cb) {
          next(cb)
          if (typeof cb === 'function') {
            cbs.push(function () {
              // #750
              // if a router-view is wrapped with an out-in transition,
              // the instance may not have been registered at this time.
              // we will need to poll for registration until current route
              // is no longer valid.
              poll(cb, match.instances, key, isValid)
            })
          }
        })
      }
    }
  })
}

function poll (cb, instances, key, isValid) {
  if (instances[key]) {
    cb(instances[key])
  } else if (isValid()) {
    setTimeout(function () {
      poll(cb, instances, key, isValid)
    }, 16)
  }
}

function resolveAsyncComponents (matched) {
  return flatMapComponents(matched, function (def, _, match, key) {
    // if it's a function and doesn't have Vue options attached,
    // assume it's an async component resolve function.
    // we are not using Vue's default async resolving mechanism because
    // we want to halt the navigation until the incoming component has been
    // resolved.
    if (typeof def === 'function' && !def.options) {
      return function (to, from, next) {
        var resolve = function (resolvedDef) {
          match.components[key] = resolvedDef
          next()
        }

        var reject = function (reason) {
          warn(false, ("Failed to resolve async component " + key + ": " + reason))
          next(false)
        }

        var res = def(resolve, reject)
        if (res && typeof res.then === 'function') {
          res.then(resolve, reject)
        }
      }
    }
  })
}

function flatMapComponents (
  matched,
  fn
) {
  return Array.prototype.concat.apply([], matched.map(function (m) {
    return Object.keys(m.components).map(function (key) { return fn(
      m.components[key],
      m.instances[key],
      m, key
    ); })
  }))
}

/*  */

function saveScrollPosition (key) {
  if (!key) { return }
  window.sessionStorage.setItem(key, JSON.stringify({
    x: window.pageXOffset,
    y: window.pageYOffset
  }))
}

function getScrollPosition (key) {
  if (!key) { return }
  return JSON.parse(window.sessionStorage.getItem(key))
}

function getElementPosition (el) {
  var docRect = document.documentElement.getBoundingClientRect()
  var elRect = el.getBoundingClientRect()
  return {
    x: elRect.left - docRect.left,
    y: elRect.top - docRect.top
  }
}

function isValidPosition (obj) {
  return isNumber(obj.x) || isNumber(obj.y)
}

function normalizePosition (obj) {
  return {
    x: isNumber(obj.x) ? obj.x : window.pageXOffset,
    y: isNumber(obj.y) ? obj.y : window.pageYOffset
  }
}

function isNumber (v) {
  return typeof v === 'number'
}

/*  */


var genKey = function () { return String(Date.now()); }
var _key = genKey()

var HTML5History = (function (History) {
  function HTML5History (router, base) {
    var this$1 = this;

    History.call(this, router, base)

    this.transitionTo(getLocation(this.base))

    var expectScroll = router.options.scrollBehavior
    window.addEventListener('popstate', function (e) {
      _key = e.state && e.state.key
      var current = this$1.current
      this$1.transitionTo(getLocation(this$1.base), function (next) {
        if (expectScroll) {
          this$1.handleScroll(next, current, true)
        }
      })
    })

    if (expectScroll) {
      window.addEventListener('scroll', function () {
        saveScrollPosition(_key)
      })
    }
  }

  if ( History ) HTML5History.__proto__ = History;
  HTML5History.prototype = Object.create( History && History.prototype );
  HTML5History.prototype.constructor = HTML5History;

  HTML5History.prototype.go = function go (n) {
    window.history.go(n)
  };

  HTML5History.prototype.push = function push (location) {
    var this$1 = this;

    var current = this.current
    this.transitionTo(location, function (route) {
      pushState(cleanPath(this$1.base + route.fullPath))
      this$1.handleScroll(route, current, false)
    })
  };

  HTML5History.prototype.replace = function replace (location) {
    var this$1 = this;

    var current = this.current
    this.transitionTo(location, function (route) {
      replaceState(cleanPath(this$1.base + route.fullPath))
      this$1.handleScroll(route, current, false)
    })
  };

  HTML5History.prototype.ensureURL = function ensureURL () {
    if (getLocation(this.base) !== this.current.fullPath) {
      replaceState(cleanPath(this.base + this.current.fullPath))
    }
  };

  HTML5History.prototype.handleScroll = function handleScroll (to, from, isPop) {
    var router = this.router
    if (!router.app) {
      return
    }

    var behavior = router.options.scrollBehavior
    if (!behavior) {
      return
    }
    assert(typeof behavior === 'function', "scrollBehavior must be a function")

    // wait until re-render finishes before scrolling
    router.app.$nextTick(function () {
      var position = getScrollPosition(_key)
      var shouldScroll = behavior(to, from, isPop ? position : null)
      if (!shouldScroll) {
        return
      }
      var isObject = typeof shouldScroll === 'object'
      if (isObject && typeof shouldScroll.selector === 'string') {
        var el = document.querySelector(shouldScroll.selector)
        if (el) {
          position = getElementPosition(el)
        } else if (isValidPosition(shouldScroll)) {
          position = normalizePosition(shouldScroll)
        }
      } else if (isObject && isValidPosition(shouldScroll)) {
        position = normalizePosition(shouldScroll)
      }

      if (position) {
        window.scrollTo(position.x, position.y)
      }
    })
  };

  return HTML5History;
}(History));

function getLocation (base) {
  var path = window.location.pathname
  if (base && path.indexOf(base) === 0) {
    path = path.slice(base.length)
  }
  return (path || '/') + window.location.search + window.location.hash
}

function pushState (url, replace) {
  // try...catch the pushState call to get around Safari
  // DOM Exception 18 where it limits to 100 pushState calls
  var history = window.history
  try {
    if (replace) {
      history.replaceState({ key: _key }, '', url)
    } else {
      _key = genKey()
      history.pushState({ key: _key }, '', url)
    }
    saveScrollPosition(_key)
  } catch (e) {
    window.location[replace ? 'assign' : 'replace'](url)
  }
}

function replaceState (url) {
  pushState(url, true)
}

/*  */


var HashHistory = (function (History) {
  function HashHistory (router, base, fallback) {
    var this$1 = this;

    History.call(this, router, base)

    // check history fallback deeplinking
    if (fallback && this.checkFallback()) {
      return
    }

    ensureSlash()
    this.transitionTo(getHash(), function () {
      window.addEventListener('hashchange', function () {
        this$1.onHashChange()
      })
    })
  }

  if ( History ) HashHistory.__proto__ = History;
  HashHistory.prototype = Object.create( History && History.prototype );
  HashHistory.prototype.constructor = HashHistory;

  HashHistory.prototype.checkFallback = function checkFallback () {
    var location = getLocation(this.base)
    if (!/^\/#/.test(location)) {
      window.location.replace(
        cleanPath(this.base + '/#' + location)
      )
      return true
    }
  };

  HashHistory.prototype.onHashChange = function onHashChange () {
    if (!ensureSlash()) {
      return
    }
    this.transitionTo(getHash(), function (route) {
      replaceHash(route.fullPath)
    })
  };

  HashHistory.prototype.push = function push (location) {
    this.transitionTo(location, function (route) {
      pushHash(route.fullPath)
    })
  };

  HashHistory.prototype.replace = function replace (location) {
    this.transitionTo(location, function (route) {
      replaceHash(route.fullPath)
    })
  };

  HashHistory.prototype.go = function go (n) {
    window.history.go(n)
  };

  HashHistory.prototype.ensureURL = function ensureURL () {
    if (getHash() !== this.current.fullPath) {
      replaceHash(this.current.fullPath)
    }
  };

  return HashHistory;
}(History));

function ensureSlash () {
  var path = getHash()
  if (path.charAt(0) === '/') {
    return true
  }
  replaceHash('/' + path)
  return false
}

function getHash () {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  var href = window.location.href
  var index = href.indexOf('#')
  return index === -1 ? '' : href.slice(index + 1)
}

function pushHash (path) {
  window.location.hash = path
}

function replaceHash (path) {
  var i = window.location.href.indexOf('#')
  window.location.replace(
    window.location.href.slice(0, i >= 0 ? i : 0) + '#' + path
  )
}

/*  */


var AbstractHistory = (function (History) {
  function AbstractHistory (router) {
    History.call(this, router)
    this.stack = []
    this.index = -1
  }

  if ( History ) AbstractHistory.__proto__ = History;
  AbstractHistory.prototype = Object.create( History && History.prototype );
  AbstractHistory.prototype.constructor = AbstractHistory;

  AbstractHistory.prototype.push = function push (location) {
    var this$1 = this;

    this.transitionTo(location, function (route) {
      this$1.stack = this$1.stack.slice(0, this$1.index + 1).concat(route)
      this$1.index++
    })
  };

  AbstractHistory.prototype.replace = function replace (location) {
    var this$1 = this;

    this.transitionTo(location, function (route) {
      this$1.stack = this$1.stack.slice(0, this$1.index).concat(route)
    })
  };

  AbstractHistory.prototype.go = function go (n) {
    var this$1 = this;

    var targetIndex = this.index + n
    if (targetIndex < 0 || targetIndex >= this.stack.length) {
      return
    }
    var route = this.stack[targetIndex]
    this.confirmTransition(route, function () {
      this$1.index = targetIndex
      this$1.updateRoute(route)
    })
  };

  AbstractHistory.prototype.ensureURL = function ensureURL () {
    // noop
  };

  return AbstractHistory;
}(History));

/*  */

var VueRouter = function VueRouter (options) {
  if ( options === void 0 ) options = {};

  this.app = null
  this.options = options
  this.beforeHooks = []
  this.afterHooks = []
  this.match = createMatcher(options.routes || [])

  var mode = options.mode || 'hash'
  this.fallback = mode === 'history' && !supportsHistory
  if (this.fallback) {
    mode = 'hash'
  }
  if (!inBrowser) {
    mode = 'abstract'
  }
  this.mode = mode
};

var prototypeAccessors = { currentRoute: {} };

prototypeAccessors.currentRoute.get = function () {
  return this.history && this.history.current
};

VueRouter.prototype.init = function init (app /* Vue component instance */) {
    var this$1 = this;

  assert(
    install.installed,
    "not installed. Make sure to call `Vue.use(VueRouter)` " +
    "before creating root instance."
  )

  this.app = app

  var ref = this;
    var mode = ref.mode;
    var options = ref.options;
    var fallback = ref.fallback;
  switch (mode) {
    case 'history':
      this.history = new HTML5History(this, options.base)
      break
    case 'hash':
      this.history = new HashHistory(this, options.base, fallback)
      break
    case 'abstract':
      this.history = new AbstractHistory(this)
      break
    default:
      assert(false, ("invalid mode: " + mode))
  }

  this.history.listen(function (route) {
    this$1.app._route = route
  })
};

VueRouter.prototype.beforeEach = function beforeEach (fn) {
  this.beforeHooks.push(fn)
};

VueRouter.prototype.afterEach = function afterEach (fn) {
  this.afterHooks.push(fn)
};

VueRouter.prototype.push = function push (location) {
  this.history.push(location)
};

VueRouter.prototype.replace = function replace (location) {
  this.history.replace(location)
};

VueRouter.prototype.go = function go (n) {
  this.history.go(n)
};

VueRouter.prototype.back = function back () {
  this.go(-1)
};

VueRouter.prototype.forward = function forward () {
  this.go(1)
};

VueRouter.prototype.getMatchedComponents = function getMatchedComponents () {
  if (!this.currentRoute) {
    return []
  }
  return [].concat.apply([], this.currentRoute.matched.map(function (m) {
    return Object.keys(m.components).map(function (key) {
      return m.components[key]
    })
  }))
};

Object.defineProperties( VueRouter.prototype, prototypeAccessors );

VueRouter.install = install

if (inBrowser && window.Vue) {
  window.Vue.use(VueRouter)
}

return VueRouter;

})));

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(24);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../node_modules/css-loader/index.js?sourceMap!./../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-02ce9b38!./../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./index.vue", function() {
			var newContent = require("!!./../../node_modules/css-loader/index.js?sourceMap!./../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-02ce9b38!./../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./index.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(25);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/css-loader/index.js?sourceMap!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-08136f71!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./subMenu.vue", function() {
			var newContent = require("!!./../../../node_modules/css-loader/index.js?sourceMap!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-08136f71!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./subMenu.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(26);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../node_modules/css-loader/index.js?sourceMap!./../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-2a84fd6b!./../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./area.vue", function() {
			var newContent = require("!!./../../node_modules/css-loader/index.js?sourceMap!./../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-2a84fd6b!./../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./area.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(27);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/css-loader/index.js?sourceMap!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-441ae050!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./topicLine.vue", function() {
			var newContent = require("!!./../../../node_modules/css-loader/index.js?sourceMap!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-441ae050!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./topicLine.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(28);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../node_modules/css-loader/index.js?sourceMap!./../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-45e0e041!./../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./topic.vue", function() {
			var newContent = require("!!./../../node_modules/css-loader/index.js?sourceMap!./../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-45e0e041!./../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./topic.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(29);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../node_modules/css-loader/index.js?sourceMap!./../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-53b92194!./../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./app.vue", function() {
			var newContent = require("!!./../node_modules/css-loader/index.js?sourceMap!./../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-53b92194!./../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./app.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(30);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/css-loader/index.js?sourceMap!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-5b17e611!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./comment.vue", function() {
			var newContent = require("!!./../../../node_modules/css-loader/index.js?sourceMap!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-5b17e611!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./comment.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(31);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/css-loader/index.js?sourceMap!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-6ed27702!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./footer.vue", function() {
			var newContent = require("!!./../../../node_modules/css-loader/index.js?sourceMap!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-6ed27702!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./footer.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(32);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/css-loader/index.js?sourceMap!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-bd9e1816&scoped=true!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./pager.vue", function() {
			var newContent = require("!!./../../../node_modules/css-loader/index.js?sourceMap!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-bd9e1816&scoped=true!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./pager.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(33);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/css-loader/index.js?sourceMap!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-ca8d316e!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./body.vue", function() {
			var newContent = require("!!./../../../node_modules/css-loader/index.js?sourceMap!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-ca8d316e!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./body.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(34);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/css-loader/index.js?sourceMap!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-dff64a18!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./header.vue", function() {
			var newContent = require("!!./../../../node_modules/css-loader/index.js?sourceMap!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-dff64a18!./../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./header.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 69 */
/***/ function(module, exports) {

var bindEvent = (function() {
  if(document.addEventListener) {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false);
      }
    };
  } else {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler);
      }
    };
  }
})();

var unbindEvent = (function() {
  if(document.removeEventListener) {
    return function(element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false);
      }
    };
  } else {
    return function(element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler);
      }
    };
  }
})();

var bindOnce = function(el, event, fn) {
  var listener = function() {
    if (fn) {
      fn.apply(this, arguments);
    }
    unbindEvent(el, event, listener);
  };
  bindEvent(el, event, listener);
};

module.exports = {
  on: bindEvent,
  off: unbindEvent,
  once: bindOnce
};

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__route__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_vue_resource__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_vue_resource___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_vue_resource__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_vue__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__app_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_element_ui__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_element_ui___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_element_ui__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_element_ui_lib_theme_default_index_css__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_element_ui_lib_theme_default_index_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_element_ui_lib_theme_default_index_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_vue_smoothscroll_websites__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_vue_smoothscroll_websites___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_vue_smoothscroll_websites__);
/**
 * Created by teddyzhu on 15/12/5.
 */









__WEBPACK_IMPORTED_MODULE_0_vue___default.a.use(__WEBPACK_IMPORTED_MODULE_4_element_ui___default.a);
__WEBPACK_IMPORTED_MODULE_0_vue___default.a.use(__WEBPACK_IMPORTED_MODULE_2_vue_resource___default.a);
__WEBPACK_IMPORTED_MODULE_0_vue___default.a.use(__WEBPACK_IMPORTED_MODULE_6_vue_smoothscroll_websites___default.a);

var app = new __WEBPACK_IMPORTED_MODULE_0_vue___default.a({
  router: __WEBPACK_IMPORTED_MODULE_1__route__["a" /* default */],
  render: function render(h) {
    return h(__WEBPACK_IMPORTED_MODULE_3__app_vue___default.a);
  }
}).$mount("#app");

__WEBPACK_IMPORTED_MODULE_0_vue___default.a.config.silent = false;
__WEBPACK_IMPORTED_MODULE_0_vue___default.a.config.devtools = true;

/***/ }
/******/ ]);
//# sourceMappingURL=app.js.map