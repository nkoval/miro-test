"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var TokensInput =
/*#__PURE__*/
function () {
  _createClass(TokensInput, [{
    key: "clear",
    value: function clear() {
      this.updateTokens([], 'clear');
    }
  }, {
    key: "add",
    value: function add(value) {
      var newTokens = [];

      if (value && value.length > 0) {
        newTokens = this.parseInputValue(value);
      }

      if (newTokens.length === 0) {
        return;
      }

      this.updateTokens([].concat(_toConsumableArray(this.tokens), _toConsumableArray(newTokens)), 'add');
    }
  }, {
    key: "replaceAllWith",
    value: function replaceAllWith(value) {
      var newTokens = this.parseInputValue(value);
      this.updateTokens(newTokens, 'replace');
    }
  }, {
    key: "remove",
    value: function remove(indexToRemove) {
      if (isNaN(indexToRemove) || indexToRemove < 0 || indexToRemove >= this.tokens.length) {
        return;
      }

      this.updateTokens(this.tokens.filter(function (_token, index) {
        return index !== indexToRemove;
      }), 'remove');
    }
  }, {
    key: "getAll",
    value: function getAll() {
      return TokensInput.makeDeepCopyOf(this.tokens);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.containerEl.classList.remove('tokens-input');
      this.tokens = [];
      this.containerEl.innerHTML = '';
      this.inputEl.removeEventListener('keydown', this.onInputKeyDown);
      this.inputEl.removeEventListener('keyup', this.onInputKeyUp);
      this.inputEl.removeEventListener('blur', this.onInputBlur);
      this.containerEl.removeEventListener('click', this.setupClickEventDelegation);
      this.destroyed = true;
    }
  }]);

  function TokensInput(containerEl) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var initValue = arguments.length > 2 ? arguments[2] : undefined;

    _classCallCheck(this, TokensInput);

    this.containerEl = containerEl;

    _defineProperty(this, "options", {
      delimiters: [',', 'Enter'],
      inputPlaceholder: 'add more people...'
    });

    _defineProperty(this, "destroyed", false);

    _defineProperty(this, "tokens", []);

    _defineProperty(this, "inputEl", void 0);

    _defineProperty(this, "isCtrl", false);

    _defineProperty(this, "isVKey", false);

    if (!this.containerEl) {
      throw new Error('The container element is missing');
    }

    this.options = _objectSpread({}, this.options, {}, options);

    if (initValue) {
      this.tokens = this.parseInputValue(initValue);
    }

    this.onInputKeyDown = this.onInputKeyDown.bind(this);
    this.onInputKeyUp = this.onInputKeyUp.bind(this);
    this.onInputBlur = this.onInputBlur.bind(this);
    this.setupClickEventDelegation = this.setupClickEventDelegation.bind(this);
    this.init();
  }

  _createClass(TokensInput, [{
    key: "init",
    value: function init() {
      this.render();
      this.attachEvents();
      this.publishEvent('ready', {
        oldValue: [],
        newValue: TokensInput.makeDeepCopyOf(this.tokens)
      });
    }
  }, {
    key: "render",
    value: function render() {
      this.containerEl.classList.add('tokens-input');
      this.renderTokens();
      this.renderInput();
    }
  }, {
    key: "renderTokens",
    value: function renderTokens() {
      var _this = this;

      var fragment = document.createDocumentFragment();
      this.tokens.forEach(function (token, index) {
        var tokenEl = _this.renderToken(token);

        tokenEl.setAttribute('data-index', index.toString());
        fragment.appendChild(tokenEl);
      });
      this.containerEl.insertBefore(fragment, this.inputEl);
    }
  }, {
    key: "renderToken",
    value: function renderToken(token) {
      var tokenEl = document.createElement('span');
      var removeButton = document.createElement('span');
      tokenEl.classList.add('tokens-input__token');
      tokenEl.innerText = token.value;
      removeButton.classList.add('tokens-input__token-remove');
      tokenEl.appendChild(removeButton);

      if (token.valid === false) {
        tokenEl.classList.add('tokens-input__token--invalid');
      }

      return tokenEl;
    }
  }, {
    key: "renderInput",
    value: function renderInput() {
      this.inputEl = document.createElement('input');
      this.inputEl.classList.add('tokens-input__input');
      this.inputEl.setAttribute('placeholder', this.options.inputPlaceholder);
      this.containerEl.appendChild(this.inputEl);
    }
  }, {
    key: "attachEvents",
    value: function attachEvents() {
      this.inputEl.addEventListener('keydown', this.onInputKeyDown);
      this.inputEl.addEventListener('keyup', this.onInputKeyUp);
      this.inputEl.addEventListener('blur', this.onInputBlur);
      this.containerEl.addEventListener('click', this.setupClickEventDelegation);
    }
  }, {
    key: "onInputKeyDown",
    value: function onInputKeyDown(event) {
      var key = event.key,
          code = event.code,
          ctrlKey = event.ctrlKey,
          metaKey = event.metaKey,
          _char = event["char"];
      var delimiters = this.options.delimiters;
      this.isCtrl = ctrlKey || metaKey;
      this.isVKey = key === 'v';

      if (delimiters.indexOf(key) !== -1 || delimiters.indexOf(code) !== -1 || delimiters.indexOf(_char) !== -1) {
        this.processInputElValue();
        event.preventDefault();
      }
    }
  }, {
    key: "onInputKeyUp",
    value: function onInputKeyUp(event) {
      var key = event.key;

      if (this.isCtrl && (key === 'v' || this.isVKey)) {
        this.onBufferInsert(event);
      }
    }
  }, {
    key: "onBufferInsert",
    value: function onBufferInsert(_event) {
      this.processInputElValue();
    }
  }, {
    key: "onInputBlur",
    value: function onInputBlur(_event) {
      this.processInputElValue();
    }
  }, {
    key: "setupClickEventDelegation",
    value: function setupClickEventDelegation(event) {
      var target = event.target;

      if (target.classList.contains('tokens-input__token-remove')) {
        this.onRemoveButtonClick(event);
      }
    }
  }, {
    key: "onRemoveButtonClick",
    value: function onRemoveButtonClick(event) {
      var target = event.target;
      var tokenEl = target.parentElement;
      var indexAttr = tokenEl.getAttribute('data-index') || '';
      var index = parseInt(indexAttr, 10);

      if (!isNaN(index)) {
        this.remove(index);
      }
    }
  }, {
    key: "processInputElValue",
    value: function processInputElValue() {
      this.add(this.inputEl.value);
      this.inputEl.value = '';
    }
  }, {
    key: "parseInputValue",
    value: function parseInputValue(rawValue) {
      var tokens = [];

      if (typeof rawValue === 'string') {
        tokens = this.parseRawTokensString(rawValue);
      } else if (Array.isArray(rawValue)) {
        tokens = rawValue;
      } else {
        throw new Error('Unknown input format');
      }

      return tokens.map(this.convertToInnerFormat.bind(this)).filter(Boolean);
    }
  }, {
    key: "parseRawTokensString",
    value: function parseRawTokensString(value) {
      var delimiters = this.options.delimiters;
      var res = [value];

      for (var i = 0; i < delimiters.length; i++) {
        var delimiter = delimiters[i];

        if (value.indexOf(delimiter) !== -1) {
          res = value.split(delimiter);
          break;
        }
      }

      return res;
    }
  }, {
    key: "convertToInnerFormat",
    value: function convertToInnerFormat(token) {
      var parsedToken = {
        value: token.trim()
      };

      if (parsedToken.value === '') {
        return null;
      }

      if (this.options.validator) {
        parsedToken.valid = this.validateToken(token);
      }

      return parsedToken;
    }
  }, {
    key: "validateToken",
    value: function validateToken(value) {
      var validator = this.options.validator;

      if (typeof validator === 'function') {
        return validator(value);
      } else if (validator instanceof RegExp) {
        return validator.test(value);
      } else {
        throw new Error('Unknown type of the validator');
      }
    }
  }, {
    key: "updateTokens",
    value: function updateTokens(newValue, action) {
      if (this.destroyed) {
        throw new Error('The component has been destroyed and can\'t be used anymore');
      }

      var oldValue = this.tokens;
      this.removeAllTokensEl();
      this.tokens = newValue;
      this.renderTokens();
      this.publishEvent(action, {
        oldValue: TokensInput.makeDeepCopyOf(oldValue),
        newValue: TokensInput.makeDeepCopyOf(newValue),
        action: action
      });
    }
  }, {
    key: "removeAllTokensEl",
    value: function removeAllTokensEl() {
      var _this2 = this;

      var tokensList = this.containerEl.querySelectorAll('.tokens-input__token');
      var tokensArray = Array.prototype.slice.call(tokensList);
      tokensArray.forEach(function (tokenEl) {
        return _this2.containerEl.removeChild(tokenEl);
      });
    }
  }, {
    key: "publishEvent",
    value: function publishEvent(eventName, data) {
      var fullEventName = "tokens-input.".concat(eventName);
      var event;

      if (typeof window.CustomEvent === "function") {
        event = new CustomEvent(fullEventName, {
          detail: data,
          bubbles: true
        });
      } else {
        event = document.createEvent('CustomEvent');
        event.initCustomEvent(fullEventName, true, true, data);
      }

      this.containerEl.dispatchEvent(event);
    } // To avoid changing the inner state of the component from the outside via references
    // we should only share a deep copy of the state

  }], [{
    key: "makeDeepCopyOf",
    value: function makeDeepCopyOf(tokens) {
      return tokens.map(function (token) {
        return _objectSpread({}, token);
      });
    }
  }]);

  return TokensInput;
}();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1Rva2Vuc0lucHV0L1Rva2Vuc0lucHV0LnRzIl0sIm5hbWVzIjpbIlRva2Vuc0lucHV0IiwidXBkYXRlVG9rZW5zIiwidmFsdWUiLCJuZXdUb2tlbnMiLCJsZW5ndGgiLCJwYXJzZUlucHV0VmFsdWUiLCJ0b2tlbnMiLCJpbmRleFRvUmVtb3ZlIiwiaXNOYU4iLCJmaWx0ZXIiLCJfdG9rZW4iLCJpbmRleCIsIm1ha2VEZWVwQ29weU9mIiwiY29udGFpbmVyRWwiLCJjbGFzc0xpc3QiLCJyZW1vdmUiLCJpbm5lckhUTUwiLCJpbnB1dEVsIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIm9uSW5wdXRLZXlEb3duIiwib25JbnB1dEtleVVwIiwib25JbnB1dEJsdXIiLCJzZXR1cENsaWNrRXZlbnREZWxlZ2F0aW9uIiwiZGVzdHJveWVkIiwib3B0aW9ucyIsImluaXRWYWx1ZSIsImRlbGltaXRlcnMiLCJpbnB1dFBsYWNlaG9sZGVyIiwiRXJyb3IiLCJiaW5kIiwiaW5pdCIsInJlbmRlciIsImF0dGFjaEV2ZW50cyIsInB1Ymxpc2hFdmVudCIsIm9sZFZhbHVlIiwibmV3VmFsdWUiLCJhZGQiLCJyZW5kZXJUb2tlbnMiLCJyZW5kZXJJbnB1dCIsImZyYWdtZW50IiwiZG9jdW1lbnQiLCJjcmVhdGVEb2N1bWVudEZyYWdtZW50IiwiZm9yRWFjaCIsInRva2VuIiwidG9rZW5FbCIsInJlbmRlclRva2VuIiwic2V0QXR0cmlidXRlIiwidG9TdHJpbmciLCJhcHBlbmRDaGlsZCIsImluc2VydEJlZm9yZSIsImNyZWF0ZUVsZW1lbnQiLCJyZW1vdmVCdXR0b24iLCJpbm5lclRleHQiLCJ2YWxpZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJldmVudCIsImtleSIsImNvZGUiLCJjdHJsS2V5IiwibWV0YUtleSIsImNoYXIiLCJpc0N0cmwiLCJpc1ZLZXkiLCJpbmRleE9mIiwicHJvY2Vzc0lucHV0RWxWYWx1ZSIsInByZXZlbnREZWZhdWx0Iiwib25CdWZmZXJJbnNlcnQiLCJfZXZlbnQiLCJ0YXJnZXQiLCJjb250YWlucyIsIm9uUmVtb3ZlQnV0dG9uQ2xpY2siLCJwYXJlbnRFbGVtZW50IiwiaW5kZXhBdHRyIiwiZ2V0QXR0cmlidXRlIiwicGFyc2VJbnQiLCJyYXdWYWx1ZSIsInBhcnNlUmF3VG9rZW5zU3RyaW5nIiwiQXJyYXkiLCJpc0FycmF5IiwibWFwIiwiY29udmVydFRvSW5uZXJGb3JtYXQiLCJCb29sZWFuIiwicmVzIiwiaSIsImRlbGltaXRlciIsInNwbGl0IiwicGFyc2VkVG9rZW4iLCJ0cmltIiwidmFsaWRhdG9yIiwidmFsaWRhdGVUb2tlbiIsIlJlZ0V4cCIsInRlc3QiLCJhY3Rpb24iLCJyZW1vdmVBbGxUb2tlbnNFbCIsInRva2Vuc0xpc3QiLCJxdWVyeVNlbGVjdG9yQWxsIiwidG9rZW5zQXJyYXkiLCJwcm90b3R5cGUiLCJzbGljZSIsImNhbGwiLCJyZW1vdmVDaGlsZCIsImV2ZW50TmFtZSIsImRhdGEiLCJmdWxsRXZlbnROYW1lIiwid2luZG93IiwiQ3VzdG9tRXZlbnQiLCJkZXRhaWwiLCJidWJibGVzIiwiY3JlYXRlRXZlbnQiLCJpbml0Q3VzdG9tRXZlbnQiLCJkaXNwYXRjaEV2ZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBV01BLFc7Ozs7OzRCQUNhO0FBQ1gsV0FBS0MsWUFBTCxDQUFrQixFQUFsQixFQUFzQixPQUF0QjtBQUNIOzs7d0JBRVVDLEssRUFBMEI7QUFDakMsVUFBSUMsU0FBa0IsR0FBRyxFQUF6Qjs7QUFFQSxVQUFJRCxLQUFLLElBQUlBLEtBQUssQ0FBQ0UsTUFBTixHQUFlLENBQTVCLEVBQStCO0FBQzNCRCxRQUFBQSxTQUFTLEdBQUcsS0FBS0UsZUFBTCxDQUFxQkgsS0FBckIsQ0FBWjtBQUNIOztBQUVELFVBQUlDLFNBQVMsQ0FBQ0MsTUFBVixLQUFxQixDQUF6QixFQUE0QjtBQUN4QjtBQUNIOztBQUVELFdBQUtILFlBQUwsOEJBQXNCLEtBQUtLLE1B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LFdBQUt6RixXQUFMLENBQWlCaUcsYUFBakIsQ0FBK0J2RCxLQUEvQjtBQUNILEssQ0FFRDtBQUNBOzs7O21DQUM4QmpELE0sRUFBaUI7QUFDM0MsYUFBT0EsTUFBTSxDQUFDeUUsR0FBUCxDQUFXLFVBQUFwQyxLQUFLO0FBQUEsaUNBQVNBLEtBQVQ7QUFBQSxPQUFoQixDQUFQO0FBQ0giLCJzb3VyY2VzQ29udGVudCI6WyJ0eXBlIFRva2Vuc0lucHV0VmFsaWRhdG9yID0gKHN0cjogc3RyaW5nKSA9PiBib29sZWFuO1xyXG50eXBlIFRva2Vuc0lucHV0T3B0aW9ucyA9IHtcclxuICAgIGRlbGltaXRlcnM/OiBzdHJpbmdbXTtcclxuICAgIHZhbGlkYXRvcj86IFJlZ0V4cCB8IFRva2Vuc0lucHV0VmFsaWRhdG9yO1xyXG4gICAgaW5wdXRQbGFjZWhvbGRlcj86IHN0cmluZztcclxufVxyXG50eXBlIFRva2VuID0ge1xyXG4gICAgdmFsdWU6IHN0cmluZztcclxuICAgIHZhbGlkPzogYm9vbGVhbjtcclxufVxyXG5cclxuY2xhc3MgVG9rZW5zSW5wdXQge1xyXG4gICAgcHVibGljIGNsZWFyKCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlVG9rZW5zKFtdLCAnY2xlYXInKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkKHZhbHVlOiBzdHJpbmcgfCBzdHJpbmdbXSkge1xyXG4gICAgICAgIGxldCBuZXdUb2tlbnM6IFRva2VuW10gPSBbXTtcclxuXHJcbiAgICAgICAgaWYgKHZhbHVlICYmIHZhbHVlLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgbmV3VG9rZW5zID0gdGhpcy5wYXJzZUlucHV0VmFsdWUodmFsdWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG5ld1Rva2Vucy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVUb2tlbnMoWy4uLnRoaXMudG9rZW5zLCAuLi5uZXdUb2tlbnNdLCAnYWRkJyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlcGxhY2VBbGxXaXRoKHZhbHVlOiBzdHJpbmcgfCBzdHJpbmdbXSkge1xyXG4gICAgICAgIGxldCBuZXdUb2tlbnMgPSB0aGlzLnBhcnNlSW5wdXRWYWx1ZSh2YWx1ZSk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVUb2tlbnMobmV3VG9rZW5zLCAncmVwbGFjZScpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW1vdmUoaW5kZXhUb1JlbW92ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKGlzTmFOKGluZGV4VG9SZW1vdmUpIHx8IGluZGV4VG9SZW1vdmUgPCAwIHx8IGluZGV4VG9SZW1vdmUgPj0gdGhpcy50b2tlbnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlVG9rZW5zKHRoaXMudG9rZW5zLmZpbHRlciggKF90b2tlbiwgaW5kZXgpID0+IGluZGV4ICE9PSBpbmRleFRvUmVtb3ZlICksICdyZW1vdmUnKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0QWxsKCk6IFRva2VuW10ge1xyXG4gICAgICAgIHJldHVybiBUb2tlbnNJbnB1dC5tYWtlRGVlcENvcHlPZih0aGlzLnRva2Vucyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlc3Ryb3koKSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXJFbC5jbGFzc0xpc3QucmVtb3ZlKCd0b2tlbnMtaW5wdXQnKTtcclxuXHJcbiAgICAgICAgdGhpcy50b2tlbnMgPSBbXTtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lckVsLmlubmVySFRNTCA9ICcnO1xyXG5cclxuICAgICAgICB0aGlzLmlucHV0RWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMub25JbnB1dEtleURvd24pO1xyXG4gICAgICAgIHRoaXMuaW5wdXRFbC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXl1cCcsIHRoaXMub25JbnB1dEtleVVwKTtcclxuICAgICAgICB0aGlzLmlucHV0RWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignYmx1cicsIHRoaXMub25JbnB1dEJsdXIpO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyRWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLnNldHVwQ2xpY2tFdmVudERlbGVnYXRpb24pO1xyXG5cclxuICAgICAgICB0aGlzLmRlc3Ryb3llZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBvcHRpb25zOiBUb2tlbnNJbnB1dE9wdGlvbnMgPSB7XHJcbiAgICAgICAgZGVsaW1pdGVyczogWycsJywgJ0VudGVyJ10sXHJcbiAgICAgICAgaW5wdXRQbGFjZWhvbGRlcjogJ2FkZCBtb3JlIHBlb3BsZS4uLicsXHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgZGVzdHJveWVkID0gZmFsc2U7XHJcbiAgICBwcml2YXRlIHRva2VuczogVG9rZW5bXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBpbnB1dEVsITogSFRNTElucHV0RWxlbWVudDtcclxuICAgIHByaXZhdGUgaXNDdHJsID0gZmFsc2U7XHJcbiAgICBwcml2YXRlIGlzVktleSA9IGZhbHNlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgY29udGFpbmVyRWw6IEhUTUxFbGVtZW50LCBvcHRpb25zOiBUb2tlbnNJbnB1dE9wdGlvbnM9e30sIGluaXRWYWx1ZT86IHN0cmluZyB8IHN0cmluZ1tdKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbnRhaW5lckVsKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIGNvbnRhaW5lciBlbGVtZW50IGlzIG1pc3NpbmcnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgLi4udGhpcy5vcHRpb25zLFxyXG4gICAgICAgICAgICAuLi5vcHRpb25zLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmIChpbml0VmFsdWUpIHtcclxuICAgICAgICAgICAgdGhpcy50b2tlbnMgPSB0aGlzLnBhcnNlSW5wdXRWYWx1ZShpbml0VmFsdWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5vbklucHV0S2V5RG93biA9IHRoaXMub25JbnB1dEtleURvd24uYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLm9uSW5wdXRLZXlVcCA9IHRoaXMub25JbnB1dEtleVVwLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5vbklucHV0Qmx1ciA9IHRoaXMub25JbnB1dEJsdXIuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLnNldHVwQ2xpY2tFdmVudERlbGVnYXRpb24gPSB0aGlzLnNldHVwQ2xpY2tFdmVudERlbGVnYXRpb24uYmluZCh0aGlzKTtcclxuXHJcbiAgICAgICAgdGhpcy5pbml0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbml0KCkge1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgdGhpcy5hdHRhY2hFdmVudHMoKTtcclxuICAgICAgICB0aGlzLnB1Ymxpc2hFdmVudCgncmVhZHknLCB7b2xkVmFsdWU6IFtdLCBuZXdWYWx1ZTogVG9rZW5zSW5wdXQubWFrZURlZXBDb3B5T2YodGhpcy50b2tlbnMpfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZW5kZXIoKSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXJFbC5jbGFzc0xpc3QuYWRkKCd0b2tlbnMtaW5wdXQnKTtcclxuICAgICAgICB0aGlzLnJlbmRlclRva2VucygpO1xyXG4gICAgICAgIHRoaXMucmVuZGVySW5wdXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlbmRlclRva2VucygpIHtcclxuICAgICAgICBjb25zdCBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcclxuXHJcbiAgICAgICAgdGhpcy50b2tlbnMuZm9yRWFjaCggKHRva2VuLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB0b2tlbkVsID0gdGhpcy5yZW5kZXJUb2tlbih0b2tlbik7XHJcbiAgICAgICAgICAgIHRva2VuRWwuc2V0QXR0cmlidXRlKCdkYXRhLWluZGV4JywgaW5kZXgudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKHRva2VuRWwpXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuY29udGFpbmVyRWwuaW5zZXJ0QmVmb3JlKGZyYWdtZW50LCB0aGlzLmlucHV0RWwpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVuZGVyVG9rZW4odG9rZW46IFRva2VuKTogSFRNTEVsZW1lbnQge1xyXG4gICAgICAgIGNvbnN0IHRva2VuRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgY29uc3QgcmVtb3ZlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG5cclxuICAgICAgICB0b2tlbkVsLmNsYXNzTGlzdC5hZGQoJ3Rva2Vucy1pbnB1dF9fdG9rZW4nKTtcclxuICAgICAgICB0b2tlbkVsLmlubmVyVGV4dCA9IHRva2VuLnZhbHVlO1xyXG5cclxuICAgICAgICByZW1vdmVCdXR0b24uY2xhc3NMaXN0LmFkZCgndG9rZW5zLWlucHV0X190b2tlbi1yZW1vdmUnKTtcclxuXHJcbiAgICAgICAgdG9rZW5FbC5hcHBlbmRDaGlsZChyZW1vdmVCdXR0b24pO1xyXG5cclxuICAgICAgICBpZiAodG9rZW4udmFsaWQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIHRva2VuRWwuY2xhc3NMaXN0LmFkZCgndG9rZW5zLWlucHV0X190b2tlbi0taW52YWxpZCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRva2VuRWw7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZW5kZXJJbnB1dCgpIHtcclxuICAgICAgICB0aGlzLmlucHV0RWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xyXG4gICAgICAgIHRoaXMuaW5wdXRFbC5jbGFzc0xpc3QuYWRkKCd0b2tlbnMtaW5wdXRfX2lucHV0Jyk7XHJcbiAgICAgICAgdGhpcy5pbnB1dEVsLnNldEF0dHJpYnV0ZSgncGxhY2Vob2xkZXInLCB0aGlzLm9wdGlvbnMuaW5wdXRQbGFjZWhvbGRlciEpO1xyXG5cclxuICAgICAgICB0aGlzLmNvbnRhaW5lckVsLmFwcGVuZENoaWxkKHRoaXMuaW5wdXRFbCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhdHRhY2hFdmVudHMoKSB7XHJcbiAgICAgICAgdGhpcy5pbnB1dEVsLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLm9uSW5wdXRLZXlEb3duKTtcclxuICAgICAgICB0aGlzLmlucHV0RWwuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCB0aGlzLm9uSW5wdXRLZXlVcCk7XHJcbiAgICAgICAgdGhpcy5pbnB1dEVsLmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCB0aGlzLm9uSW5wdXRCbHVyKTtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lckVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5zZXR1cENsaWNrRXZlbnREZWxlZ2F0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uSW5wdXRLZXlEb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XHJcbiAgICAgICAgY29uc3Qge2tleSwgY29kZSwgY3RybEtleSwgbWV0YUtleSwgY2hhcn0gID0gZXZlbnQ7XHJcbiAgICAgICAgY29uc3QgZGVsaW1pdGVycz0gdGhpcy5vcHRpb25zLmRlbGltaXRlcnMhO1xyXG5cclxuICAgICAgICB0aGlzLmlzQ3RybCA9IGN0cmxLZXkgfHwgbWV0YUtleTtcclxuICAgICAgICB0aGlzLmlzVktleSA9IGtleSA9PT0gJ3YnO1xyXG5cclxuICAgICAgICBpZiAoZGVsaW1pdGVycy5pbmRleE9mKGtleSkgIT09IC0xIHx8IGRlbGltaXRlcnMuaW5kZXhPZihjb2RlKSAhPT0gLTEgfHwgZGVsaW1pdGVycy5pbmRleE9mKGNoYXIpICE9PSAtMSkge1xyXG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NJbnB1dEVsVmFsdWUoKTtcclxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvbklucHV0S2V5VXAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcclxuICAgICAgICBjb25zdCB7a2V5fSAgPSBldmVudDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNDdHJsICYmIChrZXkgPT09ICd2JyB8fCB0aGlzLmlzVktleSkpIHtcclxuICAgICAgICAgICAgdGhpcy5vbkJ1ZmZlckluc2VydChldmVudClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvbkJ1ZmZlckluc2VydChfZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcclxuICAgICAgICB0aGlzLnByb2Nlc3NJbnB1dEVsVmFsdWUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uSW5wdXRCbHVyKF9ldmVudDogRm9jdXNFdmVudCkge1xyXG4gICAgICAgIHRoaXMucHJvY2Vzc0lucHV0RWxWYWx1ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0dXBDbGlja0V2ZW50RGVsZWdhdGlvbihldmVudDogTW91c2VFdmVudCkge1xyXG4gICAgICAgIGNvbnN0IHRhcmdldCA9IGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudDtcclxuXHJcbiAgICAgICAgaWYgKHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3Rva2Vucy1pbnB1dF9fdG9rZW4tcmVtb3ZlJykpIHtcclxuICAgICAgICAgICAgdGhpcy5vblJlbW92ZUJ1dHRvbkNsaWNrKGV2ZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvblJlbW92ZUJ1dHRvbkNsaWNrKGV2ZW50OiBNb3VzZUV2ZW50KSB7XHJcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xyXG4gICAgICAgIGNvbnN0IHRva2VuRWwgPSB0YXJnZXQucGFyZW50RWxlbWVudCE7XHJcbiAgICAgICAgY29uc3QgaW5kZXhBdHRyID0gdG9rZW5FbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW5kZXgnKSB8fCAnJztcclxuICAgICAgICBjb25zdCBpbmRleCA9IHBhcnNlSW50KGluZGV4QXR0ciwgMTApO1xyXG5cclxuICAgICAgICBpZiAoIWlzTmFOKGluZGV4KSkge1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZShpbmRleCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcHJvY2Vzc0lucHV0RWxWYWx1ZSgpIHtcclxuICAgICAgICB0aGlzLmFkZCh0aGlzLmlucHV0RWwudmFsdWUpO1xyXG4gICAgICAgIHRoaXMuaW5wdXRFbC52YWx1ZSA9ICcnO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcGFyc2VJbnB1dFZhbHVlKHJhd1ZhbHVlOiBzdHJpbmdbXSB8IHN0cmluZyk6IFRva2VuW10ge1xyXG4gICAgICAgIGxldCB0b2tlbnM6IHN0cmluZ1tdID0gW107XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgcmF3VmFsdWUgPT09ICdzdHJpbmcnICkge1xyXG4gICAgICAgICAgICB0b2tlbnMgPSB0aGlzLnBhcnNlUmF3VG9rZW5zU3RyaW5nKHJhd1ZhbHVlKTtcclxuICAgICAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkocmF3VmFsdWUpKSB7XHJcbiAgICAgICAgICAgIHRva2VucyA9IHJhd1ZhbHVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBpbnB1dCBmb3JtYXQnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0b2tlbnMubWFwKHRoaXMuY29udmVydFRvSW5uZXJGb3JtYXQuYmluZCh0aGlzKSkuZmlsdGVyKEJvb2xlYW4pIGFzIFRva2VuW107XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBwYXJzZVJhd1Rva2Vuc1N0cmluZyh2YWx1ZTogc3RyaW5nKTogc3RyaW5nW10ge1xyXG4gICAgICAgIGNvbnN0IGRlbGltaXRlcnM9IHRoaXMub3B0aW9ucy5kZWxpbWl0ZXJzITtcclxuICAgICAgICBsZXQgcmVzOiBzdHJpbmdbXSA9IFt2YWx1ZV07XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGVsaW1pdGVycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBkZWxpbWl0ZXIgPSBkZWxpbWl0ZXJzW2ldO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUuaW5kZXhPZihkZWxpbWl0ZXIpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgcmVzID0gdmFsdWUuc3BsaXQoZGVsaW1pdGVyKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY29udmVydFRvSW5uZXJGb3JtYXQodG9rZW46IHN0cmluZyk6IFRva2VuIHwgbnVsbCB7XHJcbiAgICAgICAgY29uc3QgcGFyc2VkVG9rZW46IFRva2VuID0ge1xyXG4gICAgICAgICAgICB2YWx1ZTogdG9rZW4udHJpbSgpXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKHBhcnNlZFRva2VuLnZhbHVlID09PSAnJykge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMudmFsaWRhdG9yKSB7XHJcbiAgICAgICAgICAgIHBhcnNlZFRva2VuLnZhbGlkID0gdGhpcy52YWxpZGF0ZVRva2VuKHRva2VuKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBwYXJzZWRUb2tlbjtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHZhbGlkYXRlVG9rZW4odmFsdWU6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGNvbnN0IHsgdmFsaWRhdG9yIH0gPSB0aGlzLm9wdGlvbnM7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgdmFsaWRhdG9yID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB2YWxpZGF0b3IodmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoIHZhbGlkYXRvciBpbnN0YW5jZW9mICBSZWdFeHApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbGlkYXRvci50ZXN0KHZhbHVlKTtcclxuICAgICAgICB9IGVsc2UgIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIHR5cGUgb2YgdGhlIHZhbGlkYXRvcicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVUb2tlbnMobmV3VmFsdWU6IFRva2VuW10sIGFjdGlvbjogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGVzdHJveWVkKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIGNvbXBvbmVudCBoYXMgYmVlbiBkZXN0cm95ZWQgYW5kIGNhblxcJ3QgYmUgdXNlZCBhbnltb3JlJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBvbGRWYWx1ZSA9IHRoaXMudG9rZW5zO1xyXG4gICAgICAgIHRoaXMucmVtb3ZlQWxsVG9rZW5zRWwoKTtcclxuICAgICAgICB0aGlzLnRva2VucyA9IG5ld1ZhbHVlO1xyXG4gICAgICAgIHRoaXMucmVuZGVyVG9rZW5zKCk7XHJcbiAgICAgICAgdGhpcy5wdWJsaXNoRXZlbnQoYWN0aW9uLCB7b2xkVmFsdWU6IFRva2Vuc0lucHV0Lm1ha2VEZWVwQ29weU9mKG9sZFZhbHVlKSwgbmV3VmFsdWU6IFRva2Vuc0lucHV0Lm1ha2VEZWVwQ29weU9mKG5ld1ZhbHVlKSwgYWN0aW9ufSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZW1vdmVBbGxUb2tlbnNFbCgpIHtcclxuICAgICAgICBjb25zdCB0b2tlbnNMaXN0ID0gdGhpcy5jb250YWluZXJFbC5xdWVyeVNlbGVjdG9yQWxsKCcudG9rZW5zLWlucHV0X190b2tlbicpO1xyXG4gICAgICAgIGNvbnN0IHRva2Vuc0FycmF5ID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodG9rZW5zTGlzdCk7XHJcbiAgICAgICAgdG9rZW5zQXJyYXkuZm9yRWFjaCggdG9rZW5FbCA9PiB0aGlzLmNvbnRhaW5lckVsLnJlbW92ZUNoaWxkKHRva2VuRWwpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHB1Ymxpc2hFdmVudChldmVudE5hbWU6IHN0cmluZywgZGF0YT86IHt9KSB7XHJcbiAgICAgICAgY29uc3QgZnVsbEV2ZW50TmFtZSA9IGB0b2tlbnMtaW5wdXQuJHtldmVudE5hbWV9YDtcclxuICAgICAgICBsZXQgZXZlbnQ6IEN1c3RvbUV2ZW50O1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdy5DdXN0b21FdmVudCA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgIGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KGZ1bGxFdmVudE5hbWUsIHtcclxuICAgICAgICAgICAgICAgIGRldGFpbDogZGF0YSxcclxuICAgICAgICAgICAgICAgIGJ1YmJsZXM6IHRydWUsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCggJ0N1c3RvbUV2ZW50JyApO1xyXG4gICAgICAgICAgICBldmVudC5pbml0Q3VzdG9tRXZlbnQoIGZ1bGxFdmVudE5hbWUsIHRydWUsIHRydWUsIGRhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jb250YWluZXJFbC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBUbyBhdm9pZCBjaGFuZ2luZyB0aGUgaW5uZXIgc3RhdGUgb2YgdGhlIGNvbXBvbmVudCBmcm9tIHRoZSBvdXRzaWRlIHZpYSByZWZlcmVuY2VzXHJcbiAgICAvLyB3ZSBzaG91bGQgb25seSBzaGFyZSBhIGRlZXAgY29weSBvZiB0aGUgc3RhdGVcclxuICAgIHByaXZhdGUgc3RhdGljIG1ha2VEZWVwQ29weU9mKHRva2VuczogVG9rZW5bXSkge1xyXG4gICAgICAgIHJldHVybiB0b2tlbnMubWFwKHRva2VuID0+ICh7Li4udG9rZW59KSlcclxuICAgIH1cclxufVxyXG5cclxuXHJcbiJdfQ==