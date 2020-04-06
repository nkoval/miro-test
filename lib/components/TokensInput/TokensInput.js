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
      this.inputEl.addEventListener('keydown', this.onInputKeyDown.bind(this));
      this.inputEl.addEventListener('keyup', this.onInputKeyUp.bind(this));
      this.inputEl.addEventListener('blur', this.onInputBlur.bind(this));
      this.containerEl.addEventListener('click', this.setupClickEventDelegation.bind(this));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1Rva2Vuc0lucHV0L1Rva2Vuc0lucHV0LnRzIl0sIm5hbWVzIjpbIlRva2Vuc0lucHV0IiwidXBkYXRlVG9rZW5zIiwidmFsdWUiLCJuZXdUb2tlbnMiLCJsZW5ndGgiLCJwYXJzZUlucHV0VmFsdWUiLCJ0b2tlbnMiLCJpbmRleFRvUmVtb3ZlIiwiaXNOYU4iLCJmaWx0ZXIiLCJfdG9rZW4iLCJpbmRleCIsIm1ha2VEZWVwQ29weU9mIiwiY29udGFpbmVyRWwiLCJvcHRpb25zIiwiaW5pdFZhbHVlIiwiZGVsaW1pdGVycyIsImlucHV0UGxhY2Vob2xkZXIiLCJFcnJvciIsImluaXQiLCJyZW5kZXIiLCJhdHRhY2hFdmVudHMiLCJwdWJsaXNoRXZlbnQiLCJvbGRWYWx1ZSIsIm5ld1ZhbHVlIiwiY2xhc3NMaXN0IiwiYWRkIiwicmVuZGVyVG9rZW5zIiwicmVuZGVySW5wdXQiLCJmcmFnbWVudCIsImRvY3VtZW50IiwiY3JlYXRlRG9jdW1lbnRGcmFnbWVudCIsImZvckVhY2giLCJ0b2tlbiIsInRva2VuRWwiLCJyZW5kZXJUb2tlbiIsInNldEF0dHJpYnV0ZSIsInRvU3RyaW5nIiwiYXBwZW5kQ2hpbGQiLCJpbnNlcnRCZWZvcmUiLCJpbnB1dEVsIiwiY3JlYXRlRWxlbWVudCIsInJlbW92ZUJ1dHRvbiIsImlubmVyVGV4dCIsInZhbGlkIiwiYWRkRXZlbnRMaXN0ZW5lciIsIm9uSW5wdXRLZXlEb3duIiwiYmluZCIsIm9uSW5wdXRLZXlVcCIsIm9uSW5wdXRCbHVyIiwic2V0dXBDbGlja0V2ZW50RGVsZWdhdGlvbiIsImV2ZW50Iiwia2V5IiwiY29kZSIsImN0cmxLZXkiLCJtZXRhS2V5IiwiY2hhciIsImlzQ3RybCIsImlzVktleSIsImluZGV4T2YiLCJwcm9jZXNzSW5wdXRFbFZhbHVlIiwicHJldmVudERlZmF1bHQiLCJvbkJ1ZmZlckluc2VydCIsIl9ldmVudCIsInRhcmdldCIsImNvbnRhaW5zIiwib25SZW1vdmVCdXR0b25DbGljayIsInBhcmVudEVsZW1lbnQiLCJpbmRleEF0dHIiLCJnZXRBdHRyaWJ1dGUiLCJwYXJzZUludCIsInJlbW92ZSIsInJhd1ZhbHVlIiwicGFyc2VSYXdUb2tlbnNTdHJpbmciLCJBcnJheSIsImlzQXJyYXkiLCJtYXAiLCJjb252ZXJ0VG9Jbm5lckZvcm1hdCIsIkJvb2xlYW4iLCJyZXMiLCJpIiwiZGVsaW1pdGVyIiwic3BsaXQiLCJwYXJzZWRUb2tlbiIsInRyaW0iLCJ2YWxpZGF0b3IiLCJ2YWxpZGF0ZVRva2VuIiwiUmVnRXhwIiwidGVzdCIsImFjdGlvbiIsInJlbW92ZUFsbFRva2Vuc0VsIiwidG9rZW5zTGlzdCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJ0b2tlbnNBcnJheSIsInByb3RvdHlwZSIsInNsaWNlIiwiY2FsbCIsInJlbW92ZUNoaWxkIiwiZXZlbnROYW1lIiwiZGF0YSIsImZ1bGxFdmVudE5hbWUiLCJ3aW5kb3ciLCJDdXN0b21FdmVudCIsImRldGFpbCIsImJ1YmJsZXMiLCJjcmVhdGVFdmVudCIsImluaXRDdXN0b21FdmVudCIsImRpc3BhdGNoRXZlbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFXTUEsVzs7Ozs7NEJBQ2E7QUFDWCxXQUFLQyxZQUFMLENBQWtCLEVBQWxCLEVBQXNCLE9BQXRCO0FBQ0g7Ozt3QkFFVUMsSyxFQUEwQjtBQUNqQyxVQUFJQyxTQUFrQixHQUFHLEVBQXpCOztBQUVBLFVBQUlELEtBQUssSUFBSUEsS0FBSyxDQUFDRSxNQUFOLEdBQWUsQ0FBNUIsRUFBK0I7QUFDM0JELFFBQUFBLFNBQVMsR0FBRyxLQUFLRSxlQUFMLENBQXFCSCxLQUFyQixDQUFaO0FBQ0g7O0FBRUQsVUFBSUMsU0FBUyxDQUFDQyxNQUFWLEtBQXFCLENBQXpCLEVBQTRCO0FBQ3hCO0FBQ0g7O0FBRUQsV0FBS0gsWUFBTCw4QkFBc0IsS0FBS0ssTUFBM0Isc0JBQXNDSCxTQUF0QyxJQUFrRCxLQUFsRDtBQUNIOzs7bUNBRXFCRCxLLEVBQTBCO0FBQzVDLFVBQUlDLFNBQVMsR0FBRyxLQUFLRSxlQUFMLENBQXFCSCxLQUFyQixDQUFoQjtBQUNBLFdBQUtELFlBQUwsQ0FBa0JFLFNBQWxCLEVBQTZCLFNBQTdCO0FBQ0g7OzsyQkFFYUksYSxFQUF1QjtBQUNqQyxVQUFJQyxLQUFLLENBQUNELGFBQUQsQ0FBTCxJQUF3QkEsYUFBYSxHQUFHLENBQXhDLElBQTZDQSxhQUFhLElBQUksS0FBS0QsTUFBTCxDQUFZRixNQUE5RSxFQUFzRjtBQUNsRjtBQUNIOztBQUVELFdBQUtILFlBQUwsQ0FBa0IsS0FBS0ssTUFBTCxDQUFZRyxNQUFaLENBQW9CLFVBQUNDLE1BQUQsRUFBU0MsS0FBVDtBQUFBLGVBQW1CQSxLQUFLLEtBQUtKLGFBQTdCO0FBQUEsT0FBcEIsQ0FBbEIsRUFBb0YsUUFBcEY7QUFDSDs7OzZCQUV3QjtBQUNyQixhQUFPUCxXQUFXLENBQUNZLGNBQVosQ0FBMkIsS0FBS04sTUFBaEMsQ0FBUDtBQUNIOzs7QUFZRCx1QkFBb0JPLFdBQXBCLEVBQTZHO0FBQUEsUUFBL0RDLE9BQStELHVFQUFuQyxFQUFtQztBQUFBLFFBQS9CQyxTQUErQjs7QUFBQTs7QUFBQSxTQUF6RkYsV0FBeUYsR0FBekZBLFdBQXlGOztBQUFBLHFDQVY5RDtBQUMzQ0csTUFBQUEsVUFBVSxFQUFFLENBQUMsR0FBRCxFQUFNLE9BQU4sQ0FEK0I7QUFFM0NDLE1BQUFBLGdCQUFnQixFQUFFO0FBRnlCLEtBVThEOztBQUFBLG9DQUxuRixFQUttRjs7QUFBQTs7QUFBQSxvQ0FINUYsS0FHNEY7O0FBQUEsb0NBRjVGLEtBRTRGOztBQUN6RyxRQUFJLENBQUMsS0FBS0osV0FBVixFQUF1QjtBQUNuQixZQUFNLElBQUlLLEtBQUosQ0FBVSxrQ0FBVixDQUFOO0FBQ0g7O0FBRUQsU0FBS0osT0FBTCxxQkFDTyxLQUFLQSxPQURaLE1BRU9BLE9BRlA7O0FBS0EsUUFBSUMsU0FBSixFQUFlO0FBQ1gsV0FBS1QsTUFBTCxHQUFjLEtBQUtELGVBQUwsQ0FBcUJVLFNBQXJCLENBQWQ7QUFDSDs7QUFFRCxTQUFLSSxJQUFMO0FBQ0g7Ozs7MkJBRWM7QUFDWCxXQUFLQyxNQUFMO0FBQ0EsV0FBS0MsWUFBTDtBQUNBLFdBQUtDLFlBQUwsQ0FBa0IsT0FBbEIsRUFBMkI7QUFBQ0MsUUFBQUEsUUFBUSxFQUFFLEVBQVg7QUFBZUMsUUFBQUEsUUFBUSxFQUFFeEIsV0FBVyxDQUFDWSxjQUFaLENBQTJCLEtBQUtOLE1BQWhDO0FBQXpCLE9BQTNCO0FBQ0g7Ozs2QkFFZ0I7QUFDYixXQUFLTyxXQUFMLENBQWlCWSxTQUFqQixDQUEyQkMsR0FBM0IsQ0FBK0IsY0FBL0I7QUFDQSxXQUFLQyxZQUFMO0FBQ0EsV0FBS0MsV0FBTDtBQUNIOzs7bUNBRXNCO0FBQUE7O0FBQ25CLFVBQU1DLFFBQVEsR0FBR0MsUUFBUSxDQUFDQyxzQkFBVCxFQUFqQjtBQUVBLFdBQUt6QixNQUFMLENBQVkwQixPQUFaLENBQXFCLFVBQUNDLEtBQUQsRUFBUXRCLEtBQVIsRUFBa0I7QUFDbkMsWUFBTXVCLE9BQU8sR0FBRyxLQUFJLENBQUNDLFdBQUwsQ0FBaUJGLEtBQWpCLENBQWhCOztBQUNBQyxRQUFBQSxPQUFPLENBQUNFLFlBQVIsQ0FBcUIsWUFBckIsRUFBbUN6QixLQUFLLENBQUMwQixRQUFOLEVBQW5DO0FBQ0FSLFFBQUFBLFFBQVEsQ0FBQ1MsV0FBVCxDQUFxQkosT0FBckI7QUFDSCxPQUpEO0FBTUEsV0FBS3JCLFdBQUwsQ0FBaUIwQixZQUFqQixDQUE4QlYsUUFBOUIsRUFBd0MsS0FBS1csT0FBN0M7QUFDSDs7O2dDQUVtQlAsSyxFQUEyQjtBQUMzQyxVQUFNQyxPQUFPLEdBQUdKLFFBQVEsQ0FBQ1csYUFBVCxDQUF1QixNQUF2QixDQUFoQjtBQUNBLFVBQU1DLFlBQVksR0FBR1osUUFBUSxDQUFDVyxhQUFULENBQXVCLE1BQXZCLENBQXJCO0FBRUFQLE1BQUFBLE9BQU8sQ0FBQ1QsU0FBUixDQUFrQkMsR0FBbEIsQ0FBc0IscUJBQXRCO0FBQ0FRLE1BQUFBLE9BQU8sQ0FBQ1MsU0FBUixHQUFvQlYsS0FBSyxDQUFDL0IsS0FBMUI7QUFFQXdDLE1BQUFBLFlBQVksQ0FBQ2pCLFNBQWIsQ0FBdUJDLEdBQXZCLENBQTJCLDRCQUEzQjtBQUVBUSxNQUFBQSxPQUFPLENBQUNJLFdBQVIsQ0FBb0JJLFlBQXBCOztBQUVBLFVBQUlULEtBQUssQ0FBQ1csS0FBTixLQUFnQixLQUFwQixFQUEyQjtBQUN2QlYsUUFBQUEsT0FBTyxDQUFDVCxTQUFSLENBQWtCQyxHQUFsQixDQUFzQiw4QkFBdEI7QUFDSDs7QUFFRCxhQUFPUSxPQUFQO0FBQ0g7OztrQ0FFcUI7QUFDbEIsV0FBS00sT0FBTCxHQUFlVixRQUFRLENBQUNXLGFBQVQsQ0FBdUIsT0FBdkIsQ0FBZjtBQUNBLFdBQUtELE9BQUwsQ0FBYWYsU0FBYixDQUF1QkMsR0FBdkIsQ0FBMkIscUJBQTNCO0FBQ0EsV0FBS2MsT0FBTCxDQUFhSixZQUFiLENBQTBCLGFBQTFCLEVBQXlDLEtBQUt0QixPQUFMLENBQWFHLGdCQUF0RDtBQUVBLFdBQUtKLFdBQUwsQ0FBaUJ5QixXQUFqQixDQUE2QixLQUFLRSxPQUFsQztBQUNIOzs7bUNBRXNCO0FBQ25CLFdBQUtBLE9BQUwsQ0FBYUssZ0JBQWIsQ0FBOEIsU0FBOUIsRUFBeUMsS0FBS0MsY0FBTCxDQUFvQkMsSUFBcEIsQ0FBeUIsSUFBekIsQ0FBekM7QUFDQSxXQUFLUCxPQUFMLENBQWFLLGdCQUFiLENBQThCLE9BQTlCLEVBQXVDLEtBQUtHLFlBQUwsQ0FBa0JELElBQWxCLENBQXVCLElBQXZCLENBQXZDO0FBQ0EsV0FBS1AsT0FBTCxDQUFhSyxnQkFBYixDQUE4QixNQUE5QixFQUFzQyxLQUFLSSxXQUFMLENBQWlCRixJQUFqQixDQUFzQixJQUF0QixDQUF0QztBQUNBLFdBQUtsQyxXQUFMLENBQWlCZ0MsZ0JBQWpCLENBQWtDLE9BQWxDLEVBQTJDLEtBQUtLLHlCQUFMLENBQStCSCxJQUEvQixDQUFvQyxJQUFwQyxDQUEzQztBQUNIOzs7bUNBRXNCSSxLLEVBQXNCO0FBQUEsVUFDbENDLEdBRGtDLEdBQ0lELEtBREosQ0FDbENDLEdBRGtDO0FBQUEsVUFDN0JDLElBRDZCLEdBQ0lGLEtBREosQ0FDN0JFLElBRDZCO0FBQUEsVUFDdkJDLE9BRHVCLEdBQ0lILEtBREosQ0FDdkJHLE9BRHVCO0FBQUEsVUFDZEMsT0FEYyxHQUNJSixLQURKLENBQ2RJLE9BRGM7QUFBQSxVQUNMQyxLQURLLEdBQ0lMLEtBREo7QUFFekMsVUFBTW5DLFVBQVUsR0FBRSxLQUFLRixPQUFMLENBQWFFLFVBQS9CO0FBRUEsV0FBS3lDLE1BQUwsR0FBY0gsT0FBTyxJQUFJQyxPQUF6QjtBQUNBLFdBQUtHLE1BQUwsR0FBY04sR0FBRyxLQUFLLEdBQXRCOztBQUVBLFVBQUlwQyxVQUFVLENBQUMyQyxPQUFYLENBQW1CUCxHQUFuQixNQUE0QixDQUFDLENBQTdCLElBQWtDcEMsVUFBVSxDQUFDMkMsT0FBWCxDQUFtQk4sSUFBbkIsTUFBNkIsQ0FBQyxDQUFoRSxJQUFxRXJDLFVBQVUsQ0FBQzJDLE9BQVgsQ0FBbUJILEtBQW5CLE1BQTZCLENBQUMsQ0FBdkcsRUFBMEc7QUFDdEcsYUFBS0ksbUJBQUw7QUFDQVQsUUFBQUEsS0FBSyxDQUFDVSxjQUFOO0FBQ0g7QUFDSjs7O2lDQUVvQlYsSyxFQUFzQjtBQUFBLFVBQ2hDQyxHQURnQyxHQUN4QkQsS0FEd0IsQ0FDaENDLEdBRGdDOztBQUd2QyxVQUFJLEtBQUtLLE1BQUwsS0FBZ0JMLEdBQUcsS0FBSyxHQUFSLElBQWUsS0FBS00sTUFBcEMsQ0FBSixFQUFpRDtBQUM3QyxhQUFLSSxjQUFMO0FBQ0g7QUFDSjs7O3FDQUV3QjtBQUNyQixXQUFLRixtQkFBTDtBQUNIOzs7Z0NBRW1CRyxNLEVBQW9CO0FBQ3BDLFdBQUtILG1CQUFMO0FBQ0g7Ozs4Q0FFaUNULEssRUFBbUI7QUFDakQsVUFBTWEsTUFBTSxHQUFHYixLQUFLLENBQUNhLE1BQXJCOztBQUVBLFVBQUlBLE1BQU0sQ0FBQ3ZDLFNBQVAsQ0FBaUJ3QyxRQUFqQixDQUEwQiw0QkFBMUIsQ0FBSixFQUE2RDtBQUN6RCxhQUFLQyxtQkFBTCxDQUF5QmYsS0FBekI7QUFDSDtBQUNKOzs7d0NBRTJCQSxLLEVBQW1CO0FBQzNDLFVBQU1hLE1BQU0sR0FBR2IsS0FBSyxDQUFDYSxNQUFyQjtBQUNBLFVBQU05QixPQUFPLEdBQUc4QixNQUFNLENBQUNHLGFBQXZCO0FBQ0EsVUFBTUMsU0FBUyxHQUFHbEMsT0FBTyxDQUFDbUMsWUFBUixDQUFxQixZQUFyQixLQUFzQyxFQUF4RDtBQUNBLFVBQU0xRCxLQUFLLEdBQUcyRCxRQUFRLENBQUNGLFNBQUQsRUFBWSxFQUFaLENBQXRCOztBQUVBLFVBQUksQ0FBQzVELEtBQUssQ0FBQ0csS0FBRCxDQUFWLEVBQW1CO0FBQ2YsYUFBSzRELE1BQUwsQ0FBWTVELEtBQVo7QUFDSDtBQUNKOzs7MENBRTZCO0FBQzFCLFdBQUtlLEdBQUwsQ0FBUyxLQUFLYyxPQUFMLENBQWF0QyxLQUF0QjtBQUNBLFdBQUtzQyxPQUFMLENBQWF0QyxLQUFiLEdBQXFCLEVBQXJCO0FBQ0g7OztvQ0FFdUJzRSxRLEVBQXNDO0FBQzFELFVBQUlsRSxNQUFnQixHQUFHLEVBQXZCOztBQUVBLFVBQUksT0FBT2tFLFFBQVAsS0FBb0IsUUFBeEIsRUFBbUM7QUFDL0JsRSxRQUFBQSxNQUFNLEdBQUcsS0FBS21FLG9CQUFMLENBQTBCRCxRQUExQixDQUFUO0FBQ0gsT0FGRCxNQUVPLElBQUlFLEtBQUssQ0FBQ0MsT0FBTixDQUFjSCxRQUFkLENBQUosRUFBNkI7QUFDaENsRSxRQUFBQSxNQUFNLEdBQUdrRSxRQUFUO0FBQ0gsT0FGTSxNQUVBO0FBQ0gsY0FBTSxJQUFJdEQsS0FBSixDQUFVLHNCQUFWLENBQU47QUFDSDs7QUFFRCxhQUFPWixNQUFNLENBQUNzRSxHQUFQLENBQVcsS0FBS0Msb0JBQUwsQ0FBMEI5QixJQUExQixDQUErQixJQUEvQixDQUFYLEVBQWlEdEMsTUFBakQsQ0FBd0RxRSxPQUF4RCxDQUFQO0FBQ0g7Ozt5Q0FFNEI1RSxLLEVBQXlCO0FBQ2xELFVBQU1jLFVBQVUsR0FBRSxLQUFLRixPQUFMLENBQWFFLFVBQS9CO0FBQ0EsVUFBSStELEdBQWEsR0FBRyxDQUFDN0UsS0FBRCxDQUFwQjs7QUFFQSxXQUFLLElBQUk4RSxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHaEUsVUFBVSxDQUFDWixNQUEvQixFQUF1QzRFLENBQUMsRUFBeEMsRUFBNEM7QUFDeEMsWUFBTUMsU0FBUyxHQUFHakUsVUFBVSxDQUFDZ0UsQ0FBRCxDQUE1Qjs7QUFDQSxZQUFJOUUsS0FBSyxDQUFDeUQsT0FBTixDQUFjc0IsU0FBZCxNQUE2QixDQUFDLENBQWxDLEVBQXFDO0FBQ2pDRixVQUFBQSxHQUFHLEdBQUc3RSxLQUFLLENBQUNnRixLQUFOLENBQVlELFNBQVosQ0FBTjtBQUNBO0FBQ0g7QUFDSjs7QUFFRCxhQUFPRixHQUFQO0FBQ0g7Ozt5Q0FFNEI5QyxLLEVBQTZCO0FBQ3RELFVBQU1rRCxXQUFrQixHQUFHO0FBQ3ZCakYsUUFBQUEsS0FBSyxFQUFFK0IsS0FBSyxDQUFDbUQsSUFBTjtBQURnQixPQUEzQjs7QUFJQSxVQUFJRCxXQUFXLENBQUNqRixLQUFaLEtBQXNCLEVBQTFCLEVBQThCO0FBQzFCLGVBQU8sSUFBUDtBQUNIOztBQUVELFVBQUksS0FBS1ksT0FBTCxDQUFhdUUsU0FBakIsRUFBNEI7QUFDeEJGLFFBQUFBLFdBQVcsQ0FBQ3ZDLEtBQVosR0FBb0IsS0FBSzBDLGFBQUwsQ0FBbUJyRCxLQUFuQixDQUFwQjtBQUNIOztBQUVELGFBQU9rRCxXQUFQO0FBQ0g7OztrQ0FFcUJqRixLLEVBQXdCO0FBQUEsVUFDbENtRixTQURrQyxHQUNwQixLQUFLdkUsT0FEZSxDQUNsQ3VFLFNBRGtDOztBQUcxQyxVQUFJLE9BQU9BLFNBQVAsS0FBcUIsVUFBekIsRUFBcUM7QUFDakMsZUFBT0EsU0FBUyxDQUFDbkYsS0FBRCxDQUFoQjtBQUNILE9BRkQsTUFFTyxJQUFLbUYsU0FBUyxZQUFhRSxNQUEzQixFQUFtQztBQUN0QyxlQUFPRixTQUFTLENBQUNHLElBQVYsQ0FBZXRGLEtBQWYsQ0FBUDtBQUNILE9BRk0sTUFFQztBQUNKLGNBQU0sSUFBSWdCLEtBQUosQ0FBVSwrQkFBVixDQUFOO0FBQ0g7QUFFSjs7O2lDQUVvQk0sUSxFQUFtQmlFLE0sRUFBZ0I7QUFDcEQsVUFBTWxFLFFBQVEsR0FBRyxLQUFLakIsTUFBdEI7QUFDQSxXQUFLb0YsaUJBQUw7QUFDQSxXQUFLcEYsTUFBTCxHQUFja0IsUUFBZDtBQUNBLFdBQUtHLFlBQUw7QUFDQSxXQUFLTCxZQUFMLENBQWtCbUUsTUFBbEIsRUFBMEI7QUFBQ2xFLFFBQUFBLFFBQVEsRUFBRXZCLFdBQVcsQ0FBQ1ksY0FBWixDQUEyQlcsUUFBM0IsQ0FBWDtBQUFpREMsUUFBQUEsUUFBUSxFQUFFeEIsV0FBVyxDQUFDWSxjQUFaLENBQTJCWSxRQUEzQixDQUEzRDtBQUFpR2lFLFFBQUFBLE1BQU0sRUFBTkE7QUFBakcsT0FBMUI7QUFDSDs7O3dDQUUyQjtBQUFBOztBQUN4QixVQUFNRSxVQUFVLEdBQUcsS0FBSzlFLFdBQUwsQ0FBaUIrRSxnQkFBakIsQ0FBa0Msc0JBQWxDLENBQW5CO0FBQ0EsVUFBTUMsV0FBVyxHQUFHbkIsS0FBSyxDQUFDb0IsU0FBTixDQUFnQkMsS0FBaEIsQ0FBc0JDLElBQXRCLENBQTJCTCxVQUEzQixDQUFwQjtBQUNBRSxNQUFBQSxXQUFXLENBQUM3RCxPQUFaLENBQXFCLFVBQUFFLE9BQU87QUFBQSxlQUFJLE1BQUksQ0FBQ3JCLFdBQUwsQ0FBaUJvRixXQUFqQixDQUE2Qi9ELE9BQTdCLENBQUo7QUFBQSxPQUE1QjtBQUNIOzs7aUNBRW9CZ0UsUyxFQUFtQkMsSSxFQUFXO0FBQy9DLFVBQU1DLGFBQWEsMEJBQW1CRixTQUFuQixDQUFuQjtBQUNBLFVBQUkvQyxLQUFKOztBQUVBLFVBQUksT0FBT2tELE1BQU0sQ0FBQ0MsV0FBZCxLQUE4QixVQUFsQyxFQUE4QztBQUMxQ25ELFFBQUFBLEtBQUssR0FBRyxJQUFJbUQsV0FBSixDQUFnQkYsYUFBaEIsRUFBK0I7QUFDbkNHLFVBQUFBLE1BQU0sRUFBRUosSUFEMkI7QUFFbkNLLFVBQUFBLE9BQU8sRUFBRTtBQUYwQixTQUEvQixDQUFSO0FBSUgsT0FMRCxNQUtPO0FBQ0hyRCxRQUFBQSxLQUFLLEdBQUdyQixRQUFRLENBQUMyRSxXQUFULENBQXNCLGFBQXRCLENBQVI7QUFDQXRELFFBQUFBLEtBQUssQ0FBQ3VELGVBQU4sQ0FBdUJOLGFBQXZCLEVBQXNDLElBQXRDLEVBQTRDLElBQTVDLEVBQWtERCxJQUFsRDtBQUNIOztBQUVELFdBQUt0RixXQUFMLENBQWlCOEYsYUFBakIsQ0FBK0J4RCxLQUEvQjtBQUNILEssQ0FFRDtBQUNBOzs7O21DQUM4QjdDLE0sRUFBaUI7QUFDM0MsYUFBT0EsTUFBTSxDQUFDc0UsR0FBUCxDQUFXLFVBQUEzQyxLQUFLO0FBQUEsaUNBQVNBLEtBQVQ7QUFBQSxPQUFoQixDQUFQO0FBQ0giLCJzb3VyY2VzQ29udGVudCI6WyJ0eXBlIFRva2Vuc0lucHV0VmFsaWRhdG9yID0gKHN0cjogc3RyaW5nKSA9PiBib29sZWFuO1xyXG50eXBlIFRva2Vuc0lucHV0T3B0aW9ucyA9IHtcclxuICAgIGRlbGltaXRlcnM/OiBzdHJpbmdbXTtcclxuICAgIHZhbGlkYXRvcj86IFJlZ0V4cCB8IFRva2Vuc0lucHV0VmFsaWRhdG9yO1xyXG4gICAgaW5wdXRQbGFjZWhvbGRlcj86IHN0cmluZztcclxufVxyXG50eXBlIFRva2VuID0ge1xyXG4gICAgdmFsdWU6IHN0cmluZztcclxuICAgIHZhbGlkPzogYm9vbGVhbjtcclxufVxyXG5cclxuY2xhc3MgVG9rZW5zSW5wdXQge1xyXG4gICAgcHVibGljIGNsZWFyKCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlVG9rZW5zKFtdLCAnY2xlYXInKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkKHZhbHVlOiBzdHJpbmcgfCBzdHJpbmdbXSkge1xyXG4gICAgICAgIGxldCBuZXdUb2tlbnM6IFRva2VuW10gPSBbXTtcclxuXHJcbiAgICAgICAgaWYgKHZhbHVlICYmIHZhbHVlLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgbmV3VG9rZW5zID0gdGhpcy5wYXJzZUlucHV0VmFsdWUodmFsdWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG5ld1Rva2Vucy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVUb2tlbnMoWy4uLnRoaXMudG9rZW5zLCAuLi5uZXdUb2tlbnNdLCAnYWRkJyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlcGxhY2VBbGxXaXRoKHZhbHVlOiBzdHJpbmcgfCBzdHJpbmdbXSkge1xyXG4gICAgICAgIGxldCBuZXdUb2tlbnMgPSB0aGlzLnBhcnNlSW5wdXRWYWx1ZSh2YWx1ZSk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVUb2tlbnMobmV3VG9rZW5zLCAncmVwbGFjZScpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW1vdmUoaW5kZXhUb1JlbW92ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKGlzTmFOKGluZGV4VG9SZW1vdmUpIHx8IGluZGV4VG9SZW1vdmUgPCAwIHx8IGluZGV4VG9SZW1vdmUgPj0gdGhpcy50b2tlbnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlVG9rZW5zKHRoaXMudG9rZW5zLmZpbHRlciggKF90b2tlbiwgaW5kZXgpID0+IGluZGV4ICE9PSBpbmRleFRvUmVtb3ZlICksICdyZW1vdmUnKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0QWxsKCk6IFRva2VuW10ge1xyXG4gICAgICAgIHJldHVybiBUb2tlbnNJbnB1dC5tYWtlRGVlcENvcHlPZih0aGlzLnRva2Vucyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBvcHRpb25zOiBUb2tlbnNJbnB1dE9wdGlvbnMgPSB7XHJcbiAgICAgICAgZGVsaW1pdGVyczogWycsJywgJ0VudGVyJ10sXHJcbiAgICAgICAgaW5wdXRQbGFjZWhvbGRlcjogJ2FkZCBtb3JlIHBlb3BsZS4uLicsXHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgdG9rZW5zOiBUb2tlbltdID0gW107XHJcbiAgICBwcml2YXRlIGlucHV0RWwhOiBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBpc0N0cmwgPSBmYWxzZTtcclxuICAgIHByaXZhdGUgaXNWS2V5ID0gZmFsc2U7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBjb250YWluZXJFbDogSFRNTEVsZW1lbnQsIG9wdGlvbnM6IFRva2Vuc0lucHV0T3B0aW9ucz17fSwgaW5pdFZhbHVlPzogc3RyaW5nIHwgc3RyaW5nW10pIHtcclxuICAgICAgICBpZiAoIXRoaXMuY29udGFpbmVyRWwpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgY29udGFpbmVyIGVsZW1lbnQgaXMgbWlzc2luZycpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0ge1xyXG4gICAgICAgICAgICAuLi50aGlzLm9wdGlvbnMsXHJcbiAgICAgICAgICAgIC4uLm9wdGlvbnMsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKGluaXRWYWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnRva2VucyA9IHRoaXMucGFyc2VJbnB1dFZhbHVlKGluaXRWYWx1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmluaXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXQoKSB7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICB0aGlzLmF0dGFjaEV2ZW50cygpO1xyXG4gICAgICAgIHRoaXMucHVibGlzaEV2ZW50KCdyZWFkeScsIHtvbGRWYWx1ZTogW10sIG5ld1ZhbHVlOiBUb2tlbnNJbnB1dC5tYWtlRGVlcENvcHlPZih0aGlzLnRva2Vucyl9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlbmRlcigpIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lckVsLmNsYXNzTGlzdC5hZGQoJ3Rva2Vucy1pbnB1dCcpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyVG9rZW5zKCk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJJbnB1dCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVuZGVyVG9rZW5zKCkge1xyXG4gICAgICAgIGNvbnN0IGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xyXG5cclxuICAgICAgICB0aGlzLnRva2Vucy5mb3JFYWNoKCAodG9rZW4sIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRva2VuRWwgPSB0aGlzLnJlbmRlclRva2VuKHRva2VuKTtcclxuICAgICAgICAgICAgdG9rZW5FbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtaW5kZXgnLCBpbmRleC50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQodG9rZW5FbClcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5jb250YWluZXJFbC5pbnNlcnRCZWZvcmUoZnJhZ21lbnQsIHRoaXMuaW5wdXRFbCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZW5kZXJUb2tlbih0b2tlbjogVG9rZW4pOiBIVE1MRWxlbWVudCB7XHJcbiAgICAgICAgY29uc3QgdG9rZW5FbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICBjb25zdCByZW1vdmVCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcblxyXG4gICAgICAgIHRva2VuRWwuY2xhc3NMaXN0LmFkZCgndG9rZW5zLWlucHV0X190b2tlbicpO1xyXG4gICAgICAgIHRva2VuRWwuaW5uZXJUZXh0ID0gdG9rZW4udmFsdWU7XHJcblxyXG4gICAgICAgIHJlbW92ZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKCd0b2tlbnMtaW5wdXRfX3Rva2VuLXJlbW92ZScpO1xyXG5cclxuICAgICAgICB0b2tlbkVsLmFwcGVuZENoaWxkKHJlbW92ZUJ1dHRvbik7XHJcblxyXG4gICAgICAgIGlmICh0b2tlbi52YWxpZCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgdG9rZW5FbC5jbGFzc0xpc3QuYWRkKCd0b2tlbnMtaW5wdXRfX3Rva2VuLS1pbnZhbGlkJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdG9rZW5FbDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlbmRlcklucHV0KCkge1xyXG4gICAgICAgIHRoaXMuaW5wdXRFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XHJcbiAgICAgICAgdGhpcy5pbnB1dEVsLmNsYXNzTGlzdC5hZGQoJ3Rva2Vucy1pbnB1dF9faW5wdXQnKTtcclxuICAgICAgICB0aGlzLmlucHV0RWwuc2V0QXR0cmlidXRlKCdwbGFjZWhvbGRlcicsIHRoaXMub3B0aW9ucy5pbnB1dFBsYWNlaG9sZGVyISk7XHJcblxyXG4gICAgICAgIHRoaXMuY29udGFpbmVyRWwuYXBwZW5kQ2hpbGQodGhpcy5pbnB1dEVsKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGF0dGFjaEV2ZW50cygpIHtcclxuICAgICAgICB0aGlzLmlucHV0RWwuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMub25JbnB1dEtleURvd24uYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5pbnB1dEVsLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgdGhpcy5vbklucHV0S2V5VXAuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5pbnB1dEVsLmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCB0aGlzLm9uSW5wdXRCbHVyLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyRWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLnNldHVwQ2xpY2tFdmVudERlbGVnYXRpb24uYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvbklucHV0S2V5RG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xyXG4gICAgICAgIGNvbnN0IHtrZXksIGNvZGUsIGN0cmxLZXksIG1ldGFLZXksIGNoYXJ9ICA9IGV2ZW50O1xyXG4gICAgICAgIGNvbnN0IGRlbGltaXRlcnM9IHRoaXMub3B0aW9ucy5kZWxpbWl0ZXJzITtcclxuXHJcbiAgICAgICAgdGhpcy5pc0N0cmwgPSBjdHJsS2V5IHx8IG1ldGFLZXk7XHJcbiAgICAgICAgdGhpcy5pc1ZLZXkgPSBrZXkgPT09ICd2JztcclxuXHJcbiAgICAgICAgaWYgKGRlbGltaXRlcnMuaW5kZXhPZihrZXkpICE9PSAtMSB8fCBkZWxpbWl0ZXJzLmluZGV4T2YoY29kZSkgIT09IC0xIHx8IGRlbGltaXRlcnMuaW5kZXhPZihjaGFyKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgdGhpcy5wcm9jZXNzSW5wdXRFbFZhbHVlKCk7XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25JbnB1dEtleVVwKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XHJcbiAgICAgICAgY29uc3Qge2tleX0gID0gZXZlbnQ7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlzQ3RybCAmJiAoa2V5ID09PSAndicgfHwgdGhpcy5pc1ZLZXkpKSB7XHJcbiAgICAgICAgICAgIHRoaXMub25CdWZmZXJJbnNlcnQoKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uQnVmZmVySW5zZXJ0KCkge1xyXG4gICAgICAgIHRoaXMucHJvY2Vzc0lucHV0RWxWYWx1ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25JbnB1dEJsdXIoX2V2ZW50OiBGb2N1c0V2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzSW5wdXRFbFZhbHVlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXR1cENsaWNrRXZlbnREZWxlZ2F0aW9uKGV2ZW50OiBNb3VzZUV2ZW50KSB7XHJcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xyXG5cclxuICAgICAgICBpZiAodGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygndG9rZW5zLWlucHV0X190b2tlbi1yZW1vdmUnKSkge1xyXG4gICAgICAgICAgICB0aGlzLm9uUmVtb3ZlQnV0dG9uQ2xpY2soZXZlbnQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uUmVtb3ZlQnV0dG9uQ2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpIHtcclxuICAgICAgICBjb25zdCB0YXJnZXQgPSBldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XHJcbiAgICAgICAgY29uc3QgdG9rZW5FbCA9IHRhcmdldC5wYXJlbnRFbGVtZW50ITtcclxuICAgICAgICBjb25zdCBpbmRleEF0dHIgPSB0b2tlbkVsLmdldEF0dHJpYnV0ZSgnZGF0YS1pbmRleCcpIHx8ICcnO1xyXG4gICAgICAgIGNvbnN0IGluZGV4ID0gcGFyc2VJbnQoaW5kZXhBdHRyLCAxMCk7XHJcblxyXG4gICAgICAgIGlmICghaXNOYU4oaW5kZXgpKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlKGluZGV4KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBwcm9jZXNzSW5wdXRFbFZhbHVlKCkge1xyXG4gICAgICAgIHRoaXMuYWRkKHRoaXMuaW5wdXRFbC52YWx1ZSk7XHJcbiAgICAgICAgdGhpcy5pbnB1dEVsLnZhbHVlID0gJyc7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBwYXJzZUlucHV0VmFsdWUocmF3VmFsdWU6IHN0cmluZ1tdIHwgc3RyaW5nKTogVG9rZW5bXSB7XHJcbiAgICAgICAgbGV0IHRva2Vuczogc3RyaW5nW10gPSBbXTtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiByYXdWYWx1ZSA9PT0gJ3N0cmluZycgKSB7XHJcbiAgICAgICAgICAgIHRva2VucyA9IHRoaXMucGFyc2VSYXdUb2tlbnNTdHJpbmcocmF3VmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShyYXdWYWx1ZSkpIHtcclxuICAgICAgICAgICAgdG9rZW5zID0gcmF3VmFsdWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGlucHV0IGZvcm1hdCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRva2Vucy5tYXAodGhpcy5jb252ZXJ0VG9Jbm5lckZvcm1hdC5iaW5kKHRoaXMpKS5maWx0ZXIoQm9vbGVhbikgYXMgVG9rZW5bXTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHBhcnNlUmF3VG9rZW5zU3RyaW5nKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmdbXSB7XHJcbiAgICAgICAgY29uc3QgZGVsaW1pdGVycz0gdGhpcy5vcHRpb25zLmRlbGltaXRlcnMhO1xyXG4gICAgICAgIGxldCByZXM6IHN0cmluZ1tdID0gW3ZhbHVlXTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkZWxpbWl0ZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRlbGltaXRlciA9IGRlbGltaXRlcnNbaV07XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZS5pbmRleE9mKGRlbGltaXRlcikgIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICByZXMgPSB2YWx1ZS5zcGxpdChkZWxpbWl0ZXIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjb252ZXJ0VG9Jbm5lckZvcm1hdCh0b2tlbjogc3RyaW5nKTogVG9rZW4gfCBudWxsIHtcclxuICAgICAgICBjb25zdCBwYXJzZWRUb2tlbjogVG9rZW4gPSB7XHJcbiAgICAgICAgICAgIHZhbHVlOiB0b2tlbi50cmltKClcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpZiAocGFyc2VkVG9rZW4udmFsdWUgPT09ICcnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy52YWxpZGF0b3IpIHtcclxuICAgICAgICAgICAgcGFyc2VkVG9rZW4udmFsaWQgPSB0aGlzLnZhbGlkYXRlVG9rZW4odG9rZW4pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHBhcnNlZFRva2VuO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdmFsaWRhdGVUb2tlbih2YWx1ZTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgY29uc3QgeyB2YWxpZGF0b3IgfSA9IHRoaXMub3B0aW9ucztcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiB2YWxpZGF0b3IgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbGlkYXRvcih2YWx1ZSk7XHJcbiAgICAgICAgfSBlbHNlIGlmICggdmFsaWRhdG9yIGluc3RhbmNlb2YgIFJlZ0V4cCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdmFsaWRhdG9yLnRlc3QodmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSAge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gdHlwZSBvZiB0aGUgdmFsaWRhdG9yJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZVRva2VucyhuZXdWYWx1ZTogVG9rZW5bXSwgYWN0aW9uOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCBvbGRWYWx1ZSA9IHRoaXMudG9rZW5zO1xyXG4gICAgICAgIHRoaXMucmVtb3ZlQWxsVG9rZW5zRWwoKTtcclxuICAgICAgICB0aGlzLnRva2VucyA9IG5ld1ZhbHVlO1xyXG4gICAgICAgIHRoaXMucmVuZGVyVG9rZW5zKCk7XHJcbiAgICAgICAgdGhpcy5wdWJsaXNoRXZlbnQoYWN0aW9uLCB7b2xkVmFsdWU6IFRva2Vuc0lucHV0Lm1ha2VEZWVwQ29weU9mKG9sZFZhbHVlKSwgbmV3VmFsdWU6IFRva2Vuc0lucHV0Lm1ha2VEZWVwQ29weU9mKG5ld1ZhbHVlKSwgYWN0aW9ufSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZW1vdmVBbGxUb2tlbnNFbCgpIHtcclxuICAgICAgICBjb25zdCB0b2tlbnNMaXN0ID0gdGhpcy5jb250YWluZXJFbC5xdWVyeVNlbGVjdG9yQWxsKCcudG9rZW5zLWlucHV0X190b2tlbicpO1xyXG4gICAgICAgIGNvbnN0IHRva2Vuc0FycmF5ID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodG9rZW5zTGlzdCk7XHJcbiAgICAgICAgdG9rZW5zQXJyYXkuZm9yRWFjaCggdG9rZW5FbCA9PiB0aGlzLmNvbnRhaW5lckVsLnJlbW92ZUNoaWxkKHRva2VuRWwpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHB1Ymxpc2hFdmVudChldmVudE5hbWU6IHN0cmluZywgZGF0YT86IHt9KSB7XHJcbiAgICAgICAgY29uc3QgZnVsbEV2ZW50TmFtZSA9IGB0b2tlbnMtaW5wdXQuJHtldmVudE5hbWV9YDtcclxuICAgICAgICBsZXQgZXZlbnQ6IEN1c3RvbUV2ZW50O1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdy5DdXN0b21FdmVudCA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgIGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KGZ1bGxFdmVudE5hbWUsIHtcclxuICAgICAgICAgICAgICAgIGRldGFpbDogZGF0YSxcclxuICAgICAgICAgICAgICAgIGJ1YmJsZXM6IHRydWUsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCggJ0N1c3RvbUV2ZW50JyApO1xyXG4gICAgICAgICAgICBldmVudC5pbml0Q3VzdG9tRXZlbnQoIGZ1bGxFdmVudE5hbWUsIHRydWUsIHRydWUsIGRhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jb250YWluZXJFbC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBUbyBhdm9pZCBjaGFuZ2luZyB0aGUgaW5uZXIgc3RhdGUgb2YgdGhlIGNvbXBvbmVudCBmcm9tIHRoZSBvdXRzaWRlIHZpYSByZWZlcmVuY2VzXHJcbiAgICAvLyB3ZSBzaG91bGQgb25seSBzaGFyZSBhIGRlZXAgY29weSBvZiB0aGUgc3RhdGVcclxuICAgIHByaXZhdGUgc3RhdGljIG1ha2VEZWVwQ29weU9mKHRva2VuczogVG9rZW5bXSkge1xyXG4gICAgICAgIHJldHVybiB0b2tlbnMubWFwKHRva2VuID0+ICh7Li4udG9rZW59KSlcclxuICAgIH1cclxufVxyXG5cclxuXHJcbiJdfQ==