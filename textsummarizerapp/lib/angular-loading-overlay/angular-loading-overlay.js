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
/******/ 	__webpack_require__.p = "./dist/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var angular = __webpack_require__(1);
	var BsLoadingOverlayDirective_1 = __webpack_require__(2);
	var BsLoadingOverlayService_1 = __webpack_require__(4);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = angular.module('bsLoadingOverlay', [])
	    .directive('bsLoadingOverlay', BsLoadingOverlayDirective_1.BsLoadingOverlayDirectiveFactory)
	    .factory('bsLoadingOverlayService', BsLoadingOverlayService_1.default);


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = angular;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var BsLoadingOverlayInstance_1 = __webpack_require__(3);
	var BsLoadingOverlayDirective = (function () {
	    function BsLoadingOverlayDirective($compile, $rootScope, $templateRequest, $q, $timeout, bsLoadingOverlayService) {
	        var _this = this;
	        this.$compile = $compile;
	        this.$rootScope = $rootScope;
	        this.$templateRequest = $templateRequest;
	        this.$q = $q;
	        this.$timeout = $timeout;
	        this.bsLoadingOverlayService = bsLoadingOverlayService;
	        this.restrict = 'EA';
	        this.link = function (scope, $element, $attributes) {
	            var templatePromise;
	            var overlayElementScope;
	            var globalConfig = _this.bsLoadingOverlayService.getGlobalConfig();
	            var templateUrl = $attributes.bsLoadingOverlayTemplateUrl || globalConfig.templateUrl;
	            var templateOptions = scope.$eval($attributes.bsLoadingOverlayTemplateOptions) || globalConfig.templateOptions;
	            var overlayElement = null;
	            if (templateUrl) {
	                templatePromise = _this.$templateRequest(templateUrl);
	            }
	            else {
	                templatePromise = _this.$q.reject();
	            }
	            templatePromise.then(function (loadedTemplate) {
	                overlayElementScope = scope.$new();
	                overlayElementScope.bsLoadingOverlayTemplateOptions = templateOptions;
	                overlayElement = _this.$compile(loadedTemplate)(overlayElementScope);
	                overlayElement.data('isAttached', false);
	            }).finally(function () {
	                var overlayInstance = new BsLoadingOverlayInstance_1.default($attributes.bsLoadingOverlayReferenceId || ($attributes.bsLoadingOverlay === '' ? undefined : $attributes.bsLoadingOverlay), +$attributes.bsLoadingOverlayDelay || globalConfig.delay, $attributes.bsLoadingOverlayActiveClass || globalConfig.activeClass, $element, overlayElement, _this.$timeout, _this.$q);
	                var unsubscribe = _this.$rootScope.$on('bsLoadingOverlayUpdateEvent', function (event, options) {
	                    if (options.referenceId === overlayInstance.referenceId) {
	                        _this.updateOverlayElement(overlayInstance);
	                    }
	                });
	                $element.on('$destroy', function () {
	                    overlayElementScope.$destroy();
	                    unsubscribe();
	                });
	                _this.updateOverlayElement(overlayInstance);
	            });
	        };
	    }
	    BsLoadingOverlayDirective.prototype.updateOverlayElement = function (overlayInstance) {
	        if (this.bsLoadingOverlayService.isActive(overlayInstance.referenceId)) {
	            overlayInstance.add();
	        }
	        else {
	            overlayInstance.remove();
	        }
	    };
	    ;
	    return BsLoadingOverlayDirective;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = BsLoadingOverlayDirective;
	exports.BsLoadingOverlayDirectiveFactory = function ($compile, $rootScope, $templateRequest, $q, $timeout, bsLoadingOverlayService) { return (new BsLoadingOverlayDirective($compile, $rootScope, $templateRequest, $q, $timeout, bsLoadingOverlayService)); };
	exports.BsLoadingOverlayDirectiveFactory.$inject = [
	    '$compile',
	    '$rootScope',
	    '$templateRequest',
	    '$q',
	    '$timeout',
	    'bsLoadingOverlayService'
	];


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var angular = __webpack_require__(1);
	var BsLoadingOverlayInstance = (function () {
	    function BsLoadingOverlayInstance(referenceId, delay, activeClass, $element, overlayElement, $timeout, $q) {
	        this.referenceId = referenceId;
	        this.delay = delay;
	        this.activeClass = activeClass;
	        this.$element = $element;
	        this.overlayElement = overlayElement;
	        this.$timeout = $timeout;
	        this.$q = $q;
	    }
	    BsLoadingOverlayInstance.prototype.isAdded = function () {
	        return !!this.delayPromise;
	    };
	    BsLoadingOverlayInstance.prototype.add = function () {
	        if (this.delay) {
	            if (this.delayPromise) {
	                this.$timeout.cancel(this.delayPromise);
	            }
	            this.delayPromise = this.$timeout(angular.noop, this.delay);
	        }
	        else {
	            this.delayPromise = this.$q.when();
	        }
	        if (this.overlayElement && !this.overlayElement.data('isAttached')) {
	            this.$element.append(this.overlayElement);
	            this.overlayElement.data('isAttached', true);
	        }
	        this.$element.addClass(this.activeClass);
	    };
	    ;
	    BsLoadingOverlayInstance.prototype.remove = function () {
	        var _this = this;
	        if (this.isAdded()) {
	            this.delayPromise.then(function () {
	                if (_this.overlayElement && _this.overlayElement.data('isAttached')) {
	                    _this.overlayElement.data('isAttached', false);
	                    _this.overlayElement.detach();
	                }
	                _this.$element.removeClass(_this.activeClass);
	                _this.delayPromise = undefined;
	            });
	        }
	    };
	    ;
	    return BsLoadingOverlayInstance;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = BsLoadingOverlayInstance;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var angular = __webpack_require__(1);
	var BsLoadingOverlayService = (function () {
	    function BsLoadingOverlayService($rootScope, $q) {
	        var _this = this;
	        this.$rootScope = $rootScope;
	        this.$q = $q;
	        this.globalConfig = {};
	        this.activeOverlays = {};
	        this.createHandler = function (options) { return ({
	            start: _this.start.bind(_this, options),
	            stop: _this.stop.bind(_this, options),
	            wrap: _this.wrap.bind(_this, options)
	        }); };
	        this.isActive = function (referenceId) {
	            if (referenceId === void 0) { referenceId = undefined; }
	            return _this.activeOverlays[referenceId];
	        };
	        this.setGlobalConfig = function (options) { return angular.extend(_this.globalConfig, options); };
	        this.getGlobalConfig = function () { return _this.globalConfig; };
	    }
	    BsLoadingOverlayService.prototype.start = function (options) {
	        if (options === void 0) { options = {}; }
	        this.activeOverlays[options.referenceId] = true;
	        this.notifyOverlays(options.referenceId);
	    };
	    BsLoadingOverlayService.prototype.wrap = function (options, promiseFunction) {
	        var promise;
	        if (typeof promiseFunction === 'function') {
	            promise = promiseFunction;
	        }
	        else {
	            promise = function () { return promiseFunction; };
	        }
	        return this.$q.when(this.start(options))
	            .then(promise)
	            .finally(this.stop.bind(this, options));
	    };
	    BsLoadingOverlayService.prototype.notifyOverlays = function (referenceId) {
	        this.$rootScope.$emit('bsLoadingOverlayUpdateEvent', {
	            referenceId: referenceId
	        });
	    };
	    BsLoadingOverlayService.prototype.stop = function (options) {
	        if (options === void 0) { options = {}; }
	        delete this.activeOverlays[options.referenceId];
	        this.notifyOverlays(options.referenceId);
	    };
	    return BsLoadingOverlayService;
	}());
	exports.BsLoadingOverlayService = BsLoadingOverlayService;
	var bsLoadingOverlayServiceFactory = function ($rootScope, $q) { return new BsLoadingOverlayService($rootScope, $q); };
	bsLoadingOverlayServiceFactory.$inject = ['$rootScope', '$q'];
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = bsLoadingOverlayServiceFactory;


/***/ }
/******/ ]);