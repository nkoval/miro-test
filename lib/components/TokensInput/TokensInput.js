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
    key: "toString",
    value: function toString() {
      return this.tokens.map(function (token) {
        return token.value;
      }).join(', ');
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
        this.onBufferInsert();
      }
    }
  }, {
    key: "onBufferInsert",
    value: function onBufferInsert() {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1Rva2Vuc0lucHV0L1Rva2Vuc0lucHV0LnRzIl0sIm5hbWVzIjpbIlRva2Vuc0lucHV0IiwidXBkYXRlVG9rZW5zIiwidmFsdWUiLCJuZXdUb2tlbnMiLCJsZW5ndGgiLCJwYXJzZUlucHV0VmFsdWUiLCJ0b2tlbnMiLCJpbmRleFRvUmVtb3ZlIiwiaXNOYU4iLCJmaWx0ZXIiLCJfdG9rZW4iLCJpbmRleCIsIm1ha2VEZWVwQ29weU9mIiwibWFwIiwidG9rZW4iLCJqb2luIiwiY29udGFpbmVyRWwiLCJjbGFzc0xpc3QiLCJyZW1vdmUiLCJpbm5lckhUTUwiLCJpbnB1dEVsIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIm9uSW5wdXRLZXlEb3duIiwib25JbnB1dEtleVVwIiwib25JbnB1dEJsdXIiLCJzZXR1cENsaWNrRXZlbnREZWxlZ2F0aW9uIiwiZGVzdHJveWVkIiwib3B0aW9ucyIsImluaXRWYWx1ZSIsImRlbGltaXRlcnMiLCJpbnB1dFBsYWNlaG9sZGVyIiwiRXJyb3IiLCJiaW5kIiwiaW5pdCIsInJlbmRlciIsImF0dGFjaEV2ZW50cyIsInB1Ymxpc2hFdmVudCIsIm9sZFZhbHVlIiwibmV3VmFsdWUiLCJhZGQiLCJyZW5kZXJUb2tlbnMiLCJyZW5kZXJJbnB1dCIsImZyYWdtZW50IiwiZG9jdW1lbnQiLCJjcmVhdGVEb2N1bWVudEZyYWdtZW50IiwiZm9yRWFjaCIsInRva2VuRWwiLCJyZW5kZXJUb2tlbiIsInNldEF0dHJpYnV0ZSIsInRvU3RyaW5nIiwiYXBwZW5kQ2hpbGQiLCJpbnNlcnRCZWZvcmUiLCJjcmVhdGVFbGVtZW50IiwicmVtb3ZlQnV0dG9uIiwiaW5uZXJUZXh0IiwidmFsaWQiLCJhZGRFdmVudExpc3RlbmVyIiwiZXZlbnQiLCJrZXkiLCJjb2RlIiwiY3RybEtleSIsIm1ldGFLZXkiLCJjaGFyIiwiaXNDdHJsIiwiaXNWS2V5IiwiaW5kZXhPZiIsInByb2Nlc3NJbnB1dEVsVmFsdWUiLCJwcmV2ZW50RGVmYXVsdCIsIm9uQnVmZmVySW5zZXJ0IiwiX2V2ZW50IiwidGFyZ2V0IiwiY29udGFpbnMiLCJvblJlbW92ZUJ1dHRvbkNsaWNrIiwicGFyZW50RWxlbWVudCIsImluZGV4QXR0ciIsImdldEF0dHJpYnV0ZSIsInBhcnNlSW50IiwicmF3VmFsdWUiLCJwYXJzZVJhd1Rva2Vuc1N0cmluZyIsIkFycmF5IiwiaXNBcnJheSIsImNvbnZlcnRUb0lubmVyRm9ybWF0IiwiQm9vbGVhbiIsInJlcyIsImkiLCJkZWxpbWl0ZXIiLCJzcGxpdCIsInBhcnNlZFRva2VuIiwidHJpbSIsInZhbGlkYXRvciIsInZhbGlkYXRlVG9rZW4iLCJSZWdFeHAiLCJ0ZXN0IiwiYWN0aW9uIiwicmVtb3ZlQWxsVG9rZW5zRWwiLCJ0b2tlbnNMaXN0IiwicXVlcnlTZWxlY3RvckFsbCIsInRva2Vuc0FycmF5IiwicHJvdG90eXBlIiwic2xpY2UiLCJjYWxsIiwicmVtb3ZlQ2hpbGQiLCJldmVudE5hbWUiLCJkYXRhIiwiZnVsbEV2ZW50TmFtZSIsIndpbmRvdyIsIkN1c3RvbUV2ZW50IiwiZGV0YWlsIiwiYnViYmxlcyIsImNyZWF0ZUV2ZW50IiwiaW5pdEN1c3RvbUV2ZW50IiwiZGlzcGF0Y2hFdmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQVdNQSxXOzs7Ozs0QkFDYTtBQUNYLFdBQUtDLFlBQUwsQ0FBa0IsRUFBbEIsRUFBc0IsT0FBdEI7QUFDSDs7O3dCQUVVQyxLLEVBQTBCO0FBQ2pDLFVBQUlDLFNBQWtCLEdBQUcsRUFBekI7O0FBRUEsVUFBSUQsS0FBSyxJQUFJQSxLQUFLLENBQUNFLE1BQU4sR0FBZSxDQUE1QixFQUErQjtBQUMzQkQsUUFBQUEsU0FBUyxHQUFHLEtBQUtFLGVBQUwsQ0FBcUJILEtBQXJCLENBQVo7QUFDSDs7QUFFRCxVQUFJQyxTQUFTLENBQUNDLE1BQVYsS0FBcUIsQ0FBekIsRUFBNEI7QUFDeEI7QUFDSDs7QUFFRCxXQUFLSCxZQUFMLDhCQUFzQixL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QVEsQ0FBQ2tFLFdBQVQsQ0FBc0IsYUFBdEIsQ0FBUjtBQUNBcEQsUUFBQUEsS0FBSyxDQUFDcUQsZUFBTixDQUF1Qk4sYUFBdkIsRUFBc0MsSUFBdEMsRUFBNEMsSUFBNUMsRUFBa0RELElBQWxEO0FBQ0g7O0FBRUQsV0FBS3ZGLFdBQUwsQ0FBaUIrRixhQUFqQixDQUErQnRELEtBQS9CO0FBQ0gsSyxDQUVEO0FBQ0E7Ozs7bUNBQzhCbkQsTSxFQUFpQjtBQUMzQyxhQUFPQSxNQUFNLENBQUNPLEdBQVAsQ0FBVyxVQUFBQyxLQUFLO0FBQUEsaUNBQVNBLEtBQVQ7QUFBQSxPQUFoQixDQUFQO0FBQ0giLCJzb3VyY2VzQ29udGVudCI6WyJ0eXBlIFRva2Vuc0lucHV0VmFsaWRhdG9yID0gKHN0cjogc3RyaW5nKSA9PiBib29sZWFuO1xyXG50eXBlIFRva2Vuc0lucHV0T3B0aW9ucyA9IHtcclxuICAgIGRlbGltaXRlcnM/OiBzdHJpbmdbXTtcclxuICAgIHZhbGlkYXRvcj86IFJlZ0V4cCB8IFRva2Vuc0lucHV0VmFsaWRhdG9yO1xyXG4gICAgaW5wdXRQbGFjZWhvbGRlcj86IHN0cmluZztcclxufVxyXG50eXBlIFRva2VuID0ge1xyXG4gICAgdmFsdWU6IHN0cmluZztcclxuICAgIHZhbGlkPzogYm9vbGVhbjtcclxufVxyXG5cclxuY2xhc3MgVG9rZW5zSW5wdXQge1xyXG4gICAgcHVibGljIGNsZWFyKCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlVG9rZW5zKFtdLCAnY2xlYXInKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkKHZhbHVlOiBzdHJpbmcgfCBzdHJpbmdbXSkge1xyXG4gICAgICAgIGxldCBuZXdUb2tlbnM6IFRva2VuW10gPSBbXTtcclxuXHJcbiAgICAgICAgaWYgKHZhbHVlICYmIHZhbHVlLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgbmV3VG9rZW5zID0gdGhpcy5wYXJzZUlucHV0VmFsdWUodmFsdWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG5ld1Rva2Vucy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVUb2tlbnMoWy4uLnRoaXMudG9rZW5zLCAuLi5uZXdUb2tlbnNdLCAnYWRkJyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlcGxhY2VBbGxXaXRoKHZhbHVlOiBzdHJpbmcgfCBzdHJpbmdbXSkge1xyXG4gICAgICAgIGxldCBuZXdUb2tlbnMgPSB0aGlzLnBhcnNlSW5wdXRWYWx1ZSh2YWx1ZSk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVUb2tlbnMobmV3VG9rZW5zLCAncmVwbGFjZScpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW1vdmUoaW5kZXhUb1JlbW92ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKGlzTmFOKGluZGV4VG9SZW1vdmUpIHx8IGluZGV4VG9SZW1vdmUgPCAwIHx8IGluZGV4VG9SZW1vdmUgPj0gdGhpcy50b2tlbnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlVG9rZW5zKHRoaXMudG9rZW5zLmZpbHRlciggKF90b2tlbiwgaW5kZXgpID0+IGluZGV4ICE9PSBpbmRleFRvUmVtb3ZlICksICdyZW1vdmUnKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0QWxsKCk6IFRva2VuW10ge1xyXG4gICAgICAgIHJldHVybiBUb2tlbnNJbnB1dC5tYWtlRGVlcENvcHlPZih0aGlzLnRva2Vucyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHRvU3RyaW5nKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRva2Vucy5tYXAoIHRva2VuID0+IHRva2VuLnZhbHVlICkuam9pbignLCAnKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGVzdHJveSgpIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lckVsLmNsYXNzTGlzdC5yZW1vdmUoJ3Rva2Vucy1pbnB1dCcpO1xyXG5cclxuICAgICAgICB0aGlzLnRva2VucyA9IFtdO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyRWwuaW5uZXJIVE1MID0gJyc7XHJcblxyXG4gICAgICAgIHRoaXMuaW5wdXRFbC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5vbklucHV0S2V5RG93bik7XHJcbiAgICAgICAgdGhpcy5pbnB1dEVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleXVwJywgdGhpcy5vbklucHV0S2V5VXApO1xyXG4gICAgICAgIHRoaXMuaW5wdXRFbC5yZW1vdmVFdmVudExpc3RlbmVyKCdibHVyJywgdGhpcy5vbklucHV0Qmx1cik7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXJFbC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuc2V0dXBDbGlja0V2ZW50RGVsZWdhdGlvbik7XHJcblxyXG4gICAgICAgIHRoaXMuZGVzdHJveWVkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IG9wdGlvbnM6IFRva2Vuc0lucHV0T3B0aW9ucyA9IHtcclxuICAgICAgICBkZWxpbWl0ZXJzOiBbJywnLCAnRW50ZXInXSxcclxuICAgICAgICBpbnB1dFBsYWNlaG9sZGVyOiAnYWRkIG1vcmUgcGVvcGxlLi4uJyxcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBkZXN0cm95ZWQgPSBmYWxzZTtcclxuICAgIHByaXZhdGUgdG9rZW5zOiBUb2tlbltdID0gW107XHJcbiAgICBwcml2YXRlIGlucHV0RWwhOiBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBpc0N0cmwgPSBmYWxzZTtcclxuICAgIHByaXZhdGUgaXNWS2V5ID0gZmFsc2U7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBjb250YWluZXJFbDogSFRNTEVsZW1lbnQsIG9wdGlvbnM6IFRva2Vuc0lucHV0T3B0aW9ucz17fSwgaW5pdFZhbHVlPzogc3RyaW5nIHwgc3RyaW5nW10pIHtcclxuICAgICAgICBpZiAoIXRoaXMuY29udGFpbmVyRWwpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgY29udGFpbmVyIGVsZW1lbnQgaXMgbWlzc2luZycpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0ge1xyXG4gICAgICAgICAgICAuLi50aGlzLm9wdGlvbnMsXHJcbiAgICAgICAgICAgIC4uLm9wdGlvbnMsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKGluaXRWYWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnRva2VucyA9IHRoaXMucGFyc2VJbnB1dFZhbHVlKGluaXRWYWx1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLm9uSW5wdXRLZXlEb3duID0gdGhpcy5vbklucHV0S2V5RG93bi5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMub25JbnB1dEtleVVwID0gdGhpcy5vbklucHV0S2V5VXAuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLm9uSW5wdXRCbHVyID0gdGhpcy5vbklucHV0Qmx1ci5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuc2V0dXBDbGlja0V2ZW50RGVsZWdhdGlvbiA9IHRoaXMuc2V0dXBDbGlja0V2ZW50RGVsZWdhdGlvbi5iaW5kKHRoaXMpO1xyXG5cclxuICAgICAgICB0aGlzLmluaXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXQoKSB7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICB0aGlzLmF0dGFjaEV2ZW50cygpO1xyXG4gICAgICAgIHRoaXMucHVibGlzaEV2ZW50KCdyZWFkeScsIHtvbGRWYWx1ZTogW10sIG5ld1ZhbHVlOiBUb2tlbnNJbnB1dC5tYWtlRGVlcENvcHlPZih0aGlzLnRva2Vucyl9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlbmRlcigpIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lckVsLmNsYXNzTGlzdC5hZGQoJ3Rva2Vucy1pbnB1dCcpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyVG9rZW5zKCk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJJbnB1dCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVuZGVyVG9rZW5zKCkge1xyXG4gICAgICAgIGNvbnN0IGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xyXG5cclxuICAgICAgICB0aGlzLnRva2Vucy5mb3JFYWNoKCAodG9rZW4sIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRva2VuRWwgPSB0aGlzLnJlbmRlclRva2VuKHRva2VuKTtcclxuICAgICAgICAgICAgdG9rZW5FbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtaW5kZXgnLCBpbmRleC50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQodG9rZW5FbClcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5jb250YWluZXJFbC5pbnNlcnRCZWZvcmUoZnJhZ21lbnQsIHRoaXMuaW5wdXRFbCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZW5kZXJUb2tlbih0b2tlbjogVG9rZW4pOiBIVE1MRWxlbWVudCB7XHJcbiAgICAgICAgY29uc3QgdG9rZW5FbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICBjb25zdCByZW1vdmVCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcblxyXG4gICAgICAgIHRva2VuRWwuY2xhc3NMaXN0LmFkZCgndG9rZW5zLWlucHV0X190b2tlbicpO1xyXG4gICAgICAgIHRva2VuRWwuaW5uZXJUZXh0ID0gdG9rZW4udmFsdWU7XHJcblxyXG4gICAgICAgIHJlbW92ZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKCd0b2tlbnMtaW5wdXRfX3Rva2VuLXJlbW92ZScpO1xyXG5cclxuICAgICAgICB0b2tlbkVsLmFwcGVuZENoaWxkKHJlbW92ZUJ1dHRvbik7XHJcblxyXG4gICAgICAgIGlmICh0b2tlbi52YWxpZCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgdG9rZW5FbC5jbGFzc0xpc3QuYWRkKCd0b2tlbnMtaW5wdXRfX3Rva2VuLS1pbnZhbGlkJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdG9rZW5FbDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlbmRlcklucHV0KCkge1xyXG4gICAgICAgIHRoaXMuaW5wdXRFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XHJcbiAgICAgICAgdGhpcy5pbnB1dEVsLmNsYXNzTGlzdC5hZGQoJ3Rva2Vucy1pbnB1dF9faW5wdXQnKTtcclxuICAgICAgICB0aGlzLmlucHV0RWwuc2V0QXR0cmlidXRlKCdwbGFjZWhvbGRlcicsIHRoaXMub3B0aW9ucy5pbnB1dFBsYWNlaG9sZGVyISk7XHJcblxyXG4gICAgICAgIHRoaXMuY29udGFpbmVyRWwuYXBwZW5kQ2hpbGQodGhpcy5pbnB1dEVsKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGF0dGFjaEV2ZW50cygpIHtcclxuICAgICAgICB0aGlzLmlucHV0RWwuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMub25JbnB1dEtleURvd24pO1xyXG4gICAgICAgIHRoaXMuaW5wdXRFbC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIHRoaXMub25JbnB1dEtleVVwKTtcclxuICAgICAgICB0aGlzLmlucHV0RWwuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIHRoaXMub25JbnB1dEJsdXIpO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyRWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLnNldHVwQ2xpY2tFdmVudERlbGVnYXRpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25JbnB1dEtleURvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcclxuICAgICAgICBjb25zdCB7a2V5LCBjb2RlLCBjdHJsS2V5LCBtZXRhS2V5LCBjaGFyfSAgPSBldmVudDtcclxuICAgICAgICBjb25zdCBkZWxpbWl0ZXJzPSB0aGlzLm9wdGlvbnMuZGVsaW1pdGVycyE7XHJcblxyXG4gICAgICAgIHRoaXMuaXNDdHJsID0gY3RybEtleSB8fCBtZXRhS2V5O1xyXG4gICAgICAgIHRoaXMuaXNWS2V5ID0ga2V5ID09PSAndic7XHJcblxyXG4gICAgICAgIGlmIChkZWxpbWl0ZXJzLmluZGV4T2Yoa2V5KSAhPT0gLTEgfHwgZGVsaW1pdGVycy5pbmRleE9mKGNvZGUpICE9PSAtMSB8fCBkZWxpbWl0ZXJzLmluZGV4T2YoY2hhcikgIT09IC0xKSB7XHJcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc0lucHV0RWxWYWx1ZSgpO1xyXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uSW5wdXRLZXlVcChldmVudDogS2V5Ym9hcmRFdmVudCkge1xyXG4gICAgICAgIGNvbnN0IHtrZXl9ICA9IGV2ZW50O1xyXG5cclxuICAgICAgICBpZiAodGhpcy5pc0N0cmwgJiYgKGtleSA9PT0gJ3YnIHx8IHRoaXMuaXNWS2V5KSkge1xyXG4gICAgICAgICAgICB0aGlzLm9uQnVmZmVySW5zZXJ0KClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvbkJ1ZmZlckluc2VydCgpIHtcclxuICAgICAgICB0aGlzLnByb2Nlc3NJbnB1dEVsVmFsdWUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uSW5wdXRCbHVyKF9ldmVudDogRm9jdXNFdmVudCkge1xyXG4gICAgICAgIHRoaXMucHJvY2Vzc0lucHV0RWxWYWx1ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0dXBDbGlja0V2ZW50RGVsZWdhdGlvbihldmVudDogTW91c2VFdmVudCkge1xyXG4gICAgICAgIGNvbnN0IHRhcmdldCA9IGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudDtcclxuXHJcbiAgICAgICAgaWYgKHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3Rva2Vucy1pbnB1dF9fdG9rZW4tcmVtb3ZlJykpIHtcclxuICAgICAgICAgICAgdGhpcy5vblJlbW92ZUJ1dHRvbkNsaWNrKGV2ZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvblJlbW92ZUJ1dHRvbkNsaWNrKGV2ZW50OiBNb3VzZUV2ZW50KSB7XHJcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xyXG4gICAgICAgIGNvbnN0IHRva2VuRWwgPSB0YXJnZXQucGFyZW50RWxlbWVudCE7XHJcbiAgICAgICAgY29uc3QgaW5kZXhBdHRyID0gdG9rZW5FbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW5kZXgnKSB8fCAnJztcclxuICAgICAgICBjb25zdCBpbmRleCA9IHBhcnNlSW50KGluZGV4QXR0ciwgMTApO1xyXG5cclxuICAgICAgICBpZiAoIWlzTmFOKGluZGV4KSkge1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZShpbmRleCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcHJvY2Vzc0lucHV0RWxWYWx1ZSgpIHtcclxuICAgICAgICB0aGlzLmFkZCh0aGlzLmlucHV0RWwudmFsdWUpO1xyXG4gICAgICAgIHRoaXMuaW5wdXRFbC52YWx1ZSA9ICcnO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcGFyc2VJbnB1dFZhbHVlKHJhd1ZhbHVlOiBzdHJpbmdbXSB8IHN0cmluZyk6IFRva2VuW10ge1xyXG4gICAgICAgIGxldCB0b2tlbnM6IHN0cmluZ1tdID0gW107XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgcmF3VmFsdWUgPT09ICdzdHJpbmcnICkge1xyXG4gICAgICAgICAgICB0b2tlbnMgPSB0aGlzLnBhcnNlUmF3VG9rZW5zU3RyaW5nKHJhd1ZhbHVlKTtcclxuICAgICAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkocmF3VmFsdWUpKSB7XHJcbiAgICAgICAgICAgIHRva2VucyA9IHJhd1ZhbHVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBpbnB1dCBmb3JtYXQnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0b2tlbnMubWFwKHRoaXMuY29udmVydFRvSW5uZXJGb3JtYXQuYmluZCh0aGlzKSkuZmlsdGVyKEJvb2xlYW4pIGFzIFRva2VuW107XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBwYXJzZVJhd1Rva2Vuc1N0cmluZyh2YWx1ZTogc3RyaW5nKTogc3RyaW5nW10ge1xyXG4gICAgICAgIGNvbnN0IGRlbGltaXRlcnM9IHRoaXMub3B0aW9ucy5kZWxpbWl0ZXJzITtcclxuICAgICAgICBsZXQgcmVzOiBzdHJpbmdbXSA9IFt2YWx1ZV07XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGVsaW1pdGVycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBkZWxpbWl0ZXIgPSBkZWxpbWl0ZXJzW2ldO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUuaW5kZXhPZihkZWxpbWl0ZXIpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgcmVzID0gdmFsdWUuc3BsaXQoZGVsaW1pdGVyKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY29udmVydFRvSW5uZXJGb3JtYXQodG9rZW46IHN0cmluZyk6IFRva2VuIHwgbnVsbCB7XHJcbiAgICAgICAgY29uc3QgcGFyc2VkVG9rZW46IFRva2VuID0ge1xyXG4gICAgICAgICAgICB2YWx1ZTogdG9rZW4udHJpbSgpXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKHBhcnNlZFRva2VuLnZhbHVlID09PSAnJykge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMudmFsaWRhdG9yKSB7XHJcbiAgICAgICAgICAgIHBhcnNlZFRva2VuLnZhbGlkID0gdGhpcy52YWxpZGF0ZVRva2VuKHRva2VuKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBwYXJzZWRUb2tlbjtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHZhbGlkYXRlVG9rZW4odmFsdWU6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGNvbnN0IHsgdmFsaWRhdG9yIH0gPSB0aGlzLm9wdGlvbnM7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgdmFsaWRhdG9yID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB2YWxpZGF0b3IodmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoIHZhbGlkYXRvciBpbnN0YW5jZW9mICBSZWdFeHApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbGlkYXRvci50ZXN0KHZhbHVlKTtcclxuICAgICAgICB9IGVsc2UgIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIHR5cGUgb2YgdGhlIHZhbGlkYXRvcicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVUb2tlbnMobmV3VmFsdWU6IFRva2VuW10sIGFjdGlvbjogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGVzdHJveWVkKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIGNvbXBvbmVudCBoYXMgYmVlbiBkZXN0cm95ZWQgYW5kIGNhblxcJ3QgYmUgdXNlZCBhbnltb3JlJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBvbGRWYWx1ZSA9IHRoaXMudG9rZW5zO1xyXG4gICAgICAgIHRoaXMucmVtb3ZlQWxsVG9rZW5zRWwoKTtcclxuICAgICAgICB0aGlzLnRva2VucyA9IG5ld1ZhbHVlO1xyXG4gICAgICAgIHRoaXMucmVuZGVyVG9rZW5zKCk7XHJcbiAgICAgICAgdGhpcy5wdWJsaXNoRXZlbnQoYWN0aW9uLCB7b2xkVmFsdWU6IFRva2Vuc0lucHV0Lm1ha2VEZWVwQ29weU9mKG9sZFZhbHVlKSwgbmV3VmFsdWU6IFRva2Vuc0lucHV0Lm1ha2VEZWVwQ29weU9mKG5ld1ZhbHVlKSwgYWN0aW9ufSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZW1vdmVBbGxUb2tlbnNFbCgpIHtcclxuICAgICAgICBjb25zdCB0b2tlbnNMaXN0ID0gdGhpcy5jb250YWluZXJFbC5xdWVyeVNlbGVjdG9yQWxsKCcudG9rZW5zLWlucHV0X190b2tlbicpO1xyXG4gICAgICAgIGNvbnN0IHRva2Vuc0FycmF5ID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodG9rZW5zTGlzdCk7XHJcbiAgICAgICAgdG9rZW5zQXJyYXkuZm9yRWFjaCggdG9rZW5FbCA9PiB0aGlzLmNvbnRhaW5lckVsLnJlbW92ZUNoaWxkKHRva2VuRWwpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHB1Ymxpc2hFdmVudChldmVudE5hbWU6IHN0cmluZywgZGF0YT86IHt9KSB7XHJcbiAgICAgICAgY29uc3QgZnVsbEV2ZW50TmFtZSA9IGB0b2tlbnMtaW5wdXQuJHtldmVudE5hbWV9YDtcclxuICAgICAgICBsZXQgZXZlbnQ6IEN1c3RvbUV2ZW50O1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdy5DdXN0b21FdmVudCA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgIGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KGZ1bGxFdmVudE5hbWUsIHtcclxuICAgICAgICAgICAgICAgIGRldGFpbDogZGF0YSxcclxuICAgICAgICAgICAgICAgIGJ1YmJsZXM6IHRydWUsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCggJ0N1c3RvbUV2ZW50JyApO1xyXG4gICAgICAgICAgICBldmVudC5pbml0Q3VzdG9tRXZlbnQoIGZ1bGxFdmVudE5hbWUsIHRydWUsIHRydWUsIGRhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jb250YWluZXJFbC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBUbyBhdm9pZCBjaGFuZ2luZyB0aGUgaW5uZXIgc3RhdGUgb2YgdGhlIGNvbXBvbmVudCBmcm9tIHRoZSBvdXRzaWRlIHZpYSByZWZlcmVuY2VzXHJcbiAgICAvLyB3ZSBzaG91bGQgb25seSBzaGFyZSBhIGRlZXAgY29weSBvZiB0aGUgc3RhdGVcclxuICAgIHByaXZhdGUgc3RhdGljIG1ha2VEZWVwQ29weU9mKHRva2VuczogVG9rZW5bXSkge1xyXG4gICAgICAgIHJldHVybiB0b2tlbnMubWFwKHRva2VuID0+ICh7Li4udG9rZW59KSlcclxuICAgIH1cclxufVxyXG5cclxuXHJcbiJdfQ==