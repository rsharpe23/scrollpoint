"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

(function ($) {
  'use strict';

  var ScrollPointListener =
  /*#__PURE__*/
  function () {
    function ScrollPointListener(sPoint, options) {
      _classCallCheck(this, ScrollPointListener);

      this.sPoint = sPoint;
      this.options = options;
      this._eventAccess = 1;
    }

    _createClass(ScrollPointListener, [{
      key: "triggerAll",
      value: function triggerAll(events, data) {
        var _this = this;

        events.forEach(function (event) {
          return _this.trigger(event, data);
        });
      }
    }, {
      key: "trigger",
      value: function trigger(event, data) {
        var success = this._tryAccessEvent(event);

        if (success) {
          this.options[event] && this.options[event].call(this.sPoint.$element[0], data);
        }

        return success;
      }
    }, {
      key: "_tryAccessEvent",
      value: function _tryAccessEvent(event) {
        if (event == 'stay') {
          return true;
        }

        if (event == 'enter' || event == 'exit') {
          var isEntry = event == 'enter';
          var newEventAccess = isEntry ? this._eventAccess : ~this._eventAccess;
          newEventAccess &= 1;

          if (newEventAccess) {
            isEntry ? this._eventAccess <<= 1 : this._eventAccess >>>= 1;
          }

          return !!newEventAccess;
        }

        return false;
      }
    }, {
      key: "calcOffset",
      value: function calcOffset(height) {
        var offset = this.options.offset || 0;

        if (typeof offset == 'string') {
          offset = parseInt(offset);
        }

        return height * offset * 0.01;
      }
    }]);

    return ScrollPointListener;
  }();

  var ScrollPoint =
  /*#__PURE__*/
  function () {
    function ScrollPoint($element) {
      _classCallCheck(this, ScrollPoint);

      this.$element = $element;
      this.listeners = [];
      $(window).on('scroll resize', this._execute.bind(this));
    }

    _createClass(ScrollPoint, [{
      key: "refresh",
      value: function refresh() {
        this._execute();
      } // _execute() {
      //   const DOMRect = this.$element[0].getBoundingClientRect();
      //   if (this._DOMRect) {
      //     const wHeight = window.innerHeight;
      //     const data = { scrollDelta: this._DOMRect.top - DOMRect.top };
      //     this.listeners.forEach((listener, index) => {
      //       const offset = listener.calcOffset(wHeight);
      //       // Устанавлить offset стоит только для верхней стороны, 
      //       // иначе на маленьких элементах будет неправильный расчет соотношений.
      //       if ((DOMRect.top + offset) < wHeight && (DOMRect.top + DOMRect.height) > 0) {
      //         listener.triggerAll(['enter', 'stay'], data);
      //       } else {
      //         if (listener.trigger('exit', data) && listener.options.once) {
      //           // HACK: Т.к. метод вызывается в процессе цикла,
      //           // необходимо чтобы текущий listener удалялся после его завершения.
      //           // setTimeout(..., 0) вызывает переданную функцию только
      //           // после завершения выполнения текущего кода.
      //           setTimeout(() => this.listeners.splice(index, 1));
      //         }
      //       }
      //     });
      //   }
      //   this._DOMRect = DOMRect;
      // }

    }, {
      key: "_execute",
      value: function _execute() {
        var _this2 = this;

        var DOMRect = this.$element[0].getBoundingClientRect();
        var wHeight = window.innerHeight;
        var data = {
          scrollDelta: this._DOMRect ? this._DOMRect.top - DOMRect.top : 0
        };
        this.listeners.forEach(function (listener, index) {
          var offset = listener.calcOffset(wHeight); // Устанавлить offset стоит только для верхней стороны, 
          // иначе на маленьких элементах будет неправильный расчет соотношений.

          if (DOMRect.top + offset < wHeight && DOMRect.top + DOMRect.height > 0) {
            listener.triggerAll(['enter', 'stay'], data);
          } else {
            if (listener.trigger('exit', data) && listener.options.once) {
              // HACK: Т.к. метод вызывается в процессе цикла,
              // необходимо чтобы текущий listener удалялся после его завершения.
              // setTimeout(..., 0) вызывает переданную функцию только
              // после завершения выполнения текущего кода.
              setTimeout(function () {
                return _this2.listeners.splice(index, 1);
              });
            }
          }
        });
        this._DOMRect = DOMRect;
      }
    }, {
      key: "addListener",
      value: function addListener(options) {
        this.listeners.push(new ScrollPointListener(this, options));
      }
    }]);

    return ScrollPoint;
  }();

  var FullPageScrollPoint =
  /*#__PURE__*/
  function (_ScrollPoint) {
    _inherits(FullPageScrollPoint, _ScrollPoint);

    function FullPageScrollPoint() {
      var _getPrototypeOf2;

      var _this3;

      _classCallCheck(this, FullPageScrollPoint);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this3 = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(FullPageScrollPoint)).call.apply(_getPrototypeOf2, [this].concat(args))); // super() должен вызываться перед первым this
      // Подписываться на this.$element неверно, т.к.
      // scrollPoint может быть не только экран но элемент внутри экрана.

      $('.fp-container:first').on('fullpagescroll', _this3._execute.bind(_assertThisInitialized(_this3)));
      return _this3;
    }

    return FullPageScrollPoint;
  }(ScrollPoint);

  var DATA_KEY = 'rsh.scrollpoint'; // Здесь используется функциональное выражение вместо
  // стрелочной функций, т.к. та не имеет своего this

  $.fn.scrollpoint = function (options) {
    return this.each(function (index, element) {
      var $element = $(element);
      var instance = $element.data(DATA_KEY);

      if (!instance) {
        $element.data(DATA_KEY, instance = new FullPageScrollPoint($element));
      }

      instance.addListener(options);
    });
  };
})($);
//# sourceMappingURL=jquery.scrollpoint.js.map
