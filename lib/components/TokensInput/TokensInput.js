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

      if (delimiters.indexOf(key) !== -1 || delimiters.indexOf(code) !== -1 || delimiters.indexOf(_char) !== -1) {
        this.processInputElValue();
        event.preventDefault();
      }
    }
  }, {
    key: "onInputKeyUp",
    value: function onInputKeyUp(event) {
      var key = event.key;

      if (this.isCtrl && key === 'v') {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1Rva2Vuc0lucHV0L1Rva2Vuc0lucHV0LnRzIl0sIm5hbWVzIjpbIlRva2Vuc0lucHV0IiwidXBkYXRlVG9rZW5zIiwidmFsdWUiLCJuZXdUb2tlbnMiLCJsZW5ndGgiLCJwYXJzZUlucHV0VmFsdWUiLCJ0b2tlbnMiLCJpbmRleFRvUmVtb3ZlIiwiaXNOYU4iLCJmaWx0ZXIiLCJfdG9rZW4iLCJpbmRleCIsIm1ha2VEZWVwQ29weU9mIiwiY29udGFpbmVyRWwiLCJvcHRpb25zIiwiaW5pdFZhbHVlIiwiZGVsaW1pdGVycyIsImlucHV0UGxhY2Vob2xkZXIiLCJFcnJvciIsImluaXQiLCJyZW5kZXIiLCJhdHRhY2hFdmVudHMiLCJwdWJsaXNoRXZlbnQiLCJvbGRWYWx1ZSIsIm5ld1ZhbHVlIiwiY2xhc3NMaXN0IiwiYWRkIiwicmVuZGVyVG9rZW5zIiwicmVuZGVySW5wdXQiLCJmcmFnbWVudCIsImRvY3VtZW50IiwiY3JlYXRlRG9jdW1lbnRGcmFnbWVudCIsImZvckVhY2giLCJ0b2tlbiIsInRva2VuRWwiLCJyZW5kZXJUb2tlbiIsInNldEF0dHJpYnV0ZSIsInRvU3RyaW5nIiwiYXBwZW5kQ2hpbGQiLCJpbnNlcnRCZWZvcmUiLCJpbnB1dEVsIiwiY3JlYXRlRWxlbWVudCIsInJlbW92ZUJ1dHRvbiIsImlubmVyVGV4dCIsInZhbGlkIiwiYWRkRXZlbnRMaXN0ZW5lciIsIm9uSW5wdXRLZXlEb3duIiwiYmluZCIsIm9uSW5wdXRLZXlVcCIsIm9uSW5wdXRCbHVyIiwic2V0dXBDbGlja0V2ZW50RGVsZWdhdGlvbiIsImV2ZW50Iiwia2V5IiwiY29kZSIsImN0cmxLZXkiLCJtZXRhS2V5IiwiY2hhciIsImlzQ3RybCIsImluZGV4T2YiLCJwcm9jZXNzSW5wdXRFbFZhbHVlIiwicHJldmVudERlZmF1bHQiLCJvbkJ1ZmZlckluc2VydCIsIl9ldmVudCIsInRhcmdldCIsImNvbnRhaW5zIiwib25SZW1vdmVCdXR0b25DbGljayIsInBhcmVudEVsZW1lbnQiLCJpbmRleEF0dHIiLCJnZXRBdHRyaWJ1dGUiLCJwYXJzZUludCIsInJlbW92ZSIsInJhd1ZhbHVlIiwicGFyc2VSYXdUb2tlbnNTdHJpbmciLCJBcnJheSIsImlzQXJyYXkiLCJtYXAiLCJjb252ZXJ0VG9Jbm5lckZvcm1hdCIsIkJvb2xlYW4iLCJyZXMiLCJpIiwiZGVsaW1pdGVyIiwic3BsaXQiLCJwYXJzZWRUb2tlbiIsInRyaW0iLCJ2YWxpZGF0b3IiLCJ2YWxpZGF0ZVRva2VuIiwiUmVnRXhwIiwidGVzdCIsImFjdGlvbiIsInJlbW92ZUFsbFRva2Vuc0VsIiwidG9rZW5zTGlzdCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJ0b2tlbnNBcnJheSIsInByb3RvdHlwZSIsInNsaWNlIiwiY2FsbCIsInJlbW92ZUNoaWxkIiwiZXZlbnROYW1lIiwiZGF0YSIsImZ1bGxFdmVudE5hbWUiLCJ3aW5kb3ciLCJDdXN0b21FdmVudCIsImRldGFpbCIsImJ1YmJsZXMiLCJjcmVhdGVFdmVudCIsImluaXRDdXN0b21FdmVudCIsImRpc3BhdGNoRXZlbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFXTUEsVzs7Ozs7NEJBQ2E7QUFDWCxXQUFLQyxZQUFMLENBQWtCLEVBQWxCLEVBQXNCLE9BQXRCO0FBQ0g7Ozt3QkFFVUMsSyxFQUEwQjtBQUNqQyxVQUFJQyxTQUFrQixHQUFHLEVBQXpCOztBQUVBLFVBQUlELEtBQUssSUFBSUEsS0FBSyxDQUFDRSxNQUFOLEdBQWUsQ0FBNUIsRUFBK0I7QUFDM0JELFFBQUFBLFNBQVMsR0FBRyxLQUFLRSxlQUFMLENBQXFCSCxLQUFyQixDQUFaO0FBQ0g7O0FBRUQsVUFBSUMsU0FBUyxDQUFDQyxNQUFWLEtBQXFCLENBQXpCLEVBQTRCO0FBQ3hCO0FBQ0g7O0FBRUQsV0FBS0gsWUFBTCw4QkFBc0IsS0FBS0ssTUFBM0Isc0JBQXNDSCxTQUF0QyxJQUFrRCxLQUFsRDtBQUNIOzs7bUNBRXFCRCxLLEVBQTBCO0FB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UjtBQUNBckQsUUFBQUEsS0FBSyxDQUFDc0QsZUFBTixDQUF1Qk4sYUFBdkIsRUFBc0MsSUFBdEMsRUFBNEMsSUFBNUMsRUFBa0RELElBQWxEO0FBQ0g7O0FBRUQsV0FBS3JGLFdBQUwsQ0FBaUI2RixhQUFqQixDQUErQnZELEtBQS9CO0FBQ0gsSyxDQUVEO0FBQ0E7Ozs7bUNBQzhCN0MsTSxFQUFpQjtBQUMzQyxhQUFPQSxNQUFNLENBQUNxRSxHQUFQLENBQVcsVUFBQTFDLEtBQUs7QUFBQSxpQ0FBU0EsS0FBVDtBQUFBLE9BQWhCLENBQVA7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbInR5cGUgVG9rZW5zSW5wdXRWYWxpZGF0b3IgPSAoc3RyOiBzdHJpbmcpID0+IGJvb2xlYW47XHJcbnR5cGUgVG9rZW5zSW5wdXRPcHRpb25zID0ge1xyXG4gICAgZGVsaW1pdGVycz86IHN0cmluZ1tdO1xyXG4gICAgdmFsaWRhdG9yPzogUmVnRXhwIHwgVG9rZW5zSW5wdXRWYWxpZGF0b3I7XHJcbiAgICBpbnB1dFBsYWNlaG9sZGVyPzogc3RyaW5nO1xyXG59XHJcbnR5cGUgVG9rZW4gPSB7XHJcbiAgICB2YWx1ZTogc3RyaW5nO1xyXG4gICAgdmFsaWQ/OiBib29sZWFuO1xyXG59XHJcblxyXG5jbGFzcyBUb2tlbnNJbnB1dCB7XHJcbiAgICBwdWJsaWMgY2xlYXIoKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVUb2tlbnMoW10sICdjbGVhcicpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGQodmFsdWU6IHN0cmluZyB8IHN0cmluZ1tdKSB7XHJcbiAgICAgICAgbGV0IG5ld1Rva2VuczogVG9rZW5bXSA9IFtdO1xyXG5cclxuICAgICAgICBpZiAodmFsdWUgJiYgdmFsdWUubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBuZXdUb2tlbnMgPSB0aGlzLnBhcnNlSW5wdXRWYWx1ZSh2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobmV3VG9rZW5zLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZVRva2VucyhbLi4udGhpcy50b2tlbnMsIC4uLm5ld1Rva2Vuc10sICdhZGQnKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVwbGFjZUFsbFdpdGgodmFsdWU6IHN0cmluZyB8IHN0cmluZ1tdKSB7XHJcbiAgICAgICAgbGV0IG5ld1Rva2VucyA9IHRoaXMucGFyc2VJbnB1dFZhbHVlKHZhbHVlKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVRva2VucyhuZXdUb2tlbnMsICdyZXBsYWNlJyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbW92ZShpbmRleFRvUmVtb3ZlOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAoaXNOYU4oaW5kZXhUb1JlbW92ZSkgfHwgaW5kZXhUb1JlbW92ZSA8IDAgfHwgaW5kZXhUb1JlbW92ZSA+PSB0aGlzLnRva2Vucy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVUb2tlbnModGhpcy50b2tlbnMuZmlsdGVyKCAoX3Rva2VuLCBpbmRleCkgPT4gaW5kZXggIT09IGluZGV4VG9SZW1vdmUgKSwgJ3JlbW92ZScpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRBbGwoKTogVG9rZW5bXSB7XHJcbiAgICAgICAgcmV0dXJuIFRva2Vuc0lucHV0Lm1ha2VEZWVwQ29weU9mKHRoaXMudG9rZW5zKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IG9wdGlvbnM6IFRva2Vuc0lucHV0T3B0aW9ucyA9IHtcclxuICAgICAgICBkZWxpbWl0ZXJzOiBbJywnLCAnRW50ZXInXSxcclxuICAgICAgICBpbnB1dFBsYWNlaG9sZGVyOiAnYWRkIG1vcmUgcGVvcGxlLi4uJyxcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSB0b2tlbnM6IFRva2VuW10gPSBbXTtcclxuICAgIHByaXZhdGUgaW5wdXRFbCE6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIGlzQ3RybCA9IGZhbHNlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgY29udGFpbmVyRWw6IEhUTUxFbGVtZW50LCBvcHRpb25zOiBUb2tlbnNJbnB1dE9wdGlvbnM9e30sIGluaXRWYWx1ZT86IHN0cmluZyB8IHN0cmluZ1tdKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbnRhaW5lckVsKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIGNvbnRhaW5lciBlbGVtZW50IGlzIG1pc3NpbmcnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgLi4udGhpcy5vcHRpb25zLFxyXG4gICAgICAgICAgICAuLi5vcHRpb25zLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmIChpbml0VmFsdWUpIHtcclxuICAgICAgICAgICAgdGhpcy50b2tlbnMgPSB0aGlzLnBhcnNlSW5wdXRWYWx1ZShpbml0VmFsdWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5pbml0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbml0KCkge1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgdGhpcy5hdHRhY2hFdmVudHMoKTtcclxuICAgICAgICB0aGlzLnB1Ymxpc2hFdmVudCgncmVhZHknLCB7b2xkVmFsdWU6IFtdLCBuZXdWYWx1ZTogVG9rZW5zSW5wdXQubWFrZURlZXBDb3B5T2YodGhpcy50b2tlbnMpfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZW5kZXIoKSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXJFbC5jbGFzc0xpc3QuYWRkKCd0b2tlbnMtaW5wdXQnKTtcclxuICAgICAgICB0aGlzLnJlbmRlclRva2VucygpO1xyXG4gICAgICAgIHRoaXMucmVuZGVySW5wdXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlbmRlclRva2VucygpIHtcclxuICAgICAgICBjb25zdCBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcclxuXHJcbiAgICAgICAgdGhpcy50b2tlbnMuZm9yRWFjaCggKHRva2VuLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB0b2tlbkVsID0gdGhpcy5yZW5kZXJUb2tlbih0b2tlbik7XHJcbiAgICAgICAgICAgIHRva2VuRWwuc2V0QXR0cmlidXRlKCdkYXRhLWluZGV4JywgaW5kZXgudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKHRva2VuRWwpXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuY29udGFpbmVyRWwuaW5zZXJ0QmVmb3JlKGZyYWdtZW50LCB0aGlzLmlucHV0RWwpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVuZGVyVG9rZW4odG9rZW46IFRva2VuKTogSFRNTEVsZW1lbnQge1xyXG4gICAgICAgIGNvbnN0IHRva2VuRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgY29uc3QgcmVtb3ZlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG5cclxuICAgICAgICB0b2tlbkVsLmNsYXNzTGlzdC5hZGQoJ3Rva2Vucy1pbnB1dF9fdG9rZW4nKTtcclxuICAgICAgICB0b2tlbkVsLmlubmVyVGV4dCA9IHRva2VuLnZhbHVlO1xyXG5cclxuICAgICAgICByZW1vdmVCdXR0b24uY2xhc3NMaXN0LmFkZCgndG9rZW5zLWlucHV0X190b2tlbi1yZW1vdmUnKTtcclxuXHJcbiAgICAgICAgdG9rZW5FbC5hcHBlbmRDaGlsZChyZW1vdmVCdXR0b24pO1xyXG5cclxuICAgICAgICBpZiAodG9rZW4udmFsaWQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIHRva2VuRWwuY2xhc3NMaXN0LmFkZCgndG9rZW5zLWlucHV0X190b2tlbi0taW52YWxpZCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRva2VuRWw7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZW5kZXJJbnB1dCgpIHtcclxuICAgICAgICB0aGlzLmlucHV0RWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xyXG4gICAgICAgIHRoaXMuaW5wdXRFbC5jbGFzc0xpc3QuYWRkKCd0b2tlbnMtaW5wdXRfX2lucHV0Jyk7XHJcbiAgICAgICAgdGhpcy5pbnB1dEVsLnNldEF0dHJpYnV0ZSgncGxhY2Vob2xkZXInLCB0aGlzLm9wdGlvbnMuaW5wdXRQbGFjZWhvbGRlciEpO1xyXG5cclxuICAgICAgICB0aGlzLmNvbnRhaW5lckVsLmFwcGVuZENoaWxkKHRoaXMuaW5wdXRFbCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhdHRhY2hFdmVudHMoKSB7XHJcbiAgICAgICAgdGhpcy5pbnB1dEVsLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLm9uSW5wdXRLZXlEb3duLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMuaW5wdXRFbC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIHRoaXMub25JbnB1dEtleVVwLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMuaW5wdXRFbC5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgdGhpcy5vbklucHV0Qmx1ci5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lckVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5zZXR1cENsaWNrRXZlbnREZWxlZ2F0aW9uLmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25JbnB1dEtleURvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcclxuICAgICAgICBjb25zdCB7a2V5LCBjb2RlLCBjdHJsS2V5LCBtZXRhS2V5LCBjaGFyfSAgPSBldmVudDtcclxuICAgICAgICBjb25zdCBkZWxpbWl0ZXJzPSB0aGlzLm9wdGlvbnMuZGVsaW1pdGVycyE7XHJcblxyXG4gICAgICAgIHRoaXMuaXNDdHJsID0gY3RybEtleSB8fCBtZXRhS2V5O1xyXG5cclxuICAgICAgICBpZiAoZGVsaW1pdGVycy5pbmRleE9mKGtleSkgIT09IC0xIHx8IGRlbGltaXRlcnMuaW5kZXhPZihjb2RlKSAhPT0gLTEgfHwgZGVsaW1pdGVycy5pbmRleE9mKGNoYXIpICE9PSAtMSkge1xyXG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NJbnB1dEVsVmFsdWUoKTtcclxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvbklucHV0S2V5VXAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcclxuICAgICAgICBjb25zdCB7a2V5fSAgPSBldmVudDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNDdHJsICYmIGtleSA9PT0gJ3YnKSB7XHJcbiAgICAgICAgICAgIHRoaXMub25CdWZmZXJJbnNlcnQoKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uQnVmZmVySW5zZXJ0KCkge1xyXG4gICAgICAgIHRoaXMucHJvY2Vzc0lucHV0RWxWYWx1ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25JbnB1dEJsdXIoX2V2ZW50OiBGb2N1c0V2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzSW5wdXRFbFZhbHVlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXR1cENsaWNrRXZlbnREZWxlZ2F0aW9uKGV2ZW50OiBNb3VzZUV2ZW50KSB7XHJcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xyXG5cclxuICAgICAgICBpZiAodGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygndG9rZW5zLWlucHV0X190b2tlbi1yZW1vdmUnKSkge1xyXG4gICAgICAgICAgICB0aGlzLm9uUmVtb3ZlQnV0dG9uQ2xpY2soZXZlbnQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uUmVtb3ZlQnV0dG9uQ2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpIHtcclxuICAgICAgICBjb25zdCB0YXJnZXQgPSBldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XHJcbiAgICAgICAgY29uc3QgdG9rZW5FbCA9IHRhcmdldC5wYXJlbnRFbGVtZW50ITtcclxuICAgICAgICBjb25zdCBpbmRleEF0dHIgPSB0b2tlbkVsLmdldEF0dHJpYnV0ZSgnZGF0YS1pbmRleCcpIHx8ICcnO1xyXG4gICAgICAgIGNvbnN0IGluZGV4ID0gcGFyc2VJbnQoaW5kZXhBdHRyLCAxMCk7XHJcblxyXG4gICAgICAgIGlmICghaXNOYU4oaW5kZXgpKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlKGluZGV4KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBwcm9jZXNzSW5wdXRFbFZhbHVlKCkge1xyXG4gICAgICAgIHRoaXMuYWRkKHRoaXMuaW5wdXRFbC52YWx1ZSk7XHJcbiAgICAgICAgdGhpcy5pbnB1dEVsLnZhbHVlID0gJyc7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBwYXJzZUlucHV0VmFsdWUocmF3VmFsdWU6IHN0cmluZ1tdIHwgc3RyaW5nKTogVG9rZW5bXSB7XHJcbiAgICAgICAgbGV0IHRva2Vuczogc3RyaW5nW10gPSBbXTtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiByYXdWYWx1ZSA9PT0gJ3N0cmluZycgKSB7XHJcbiAgICAgICAgICAgIHRva2VucyA9IHRoaXMucGFyc2VSYXdUb2tlbnNTdHJpbmcocmF3VmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShyYXdWYWx1ZSkpIHtcclxuICAgICAgICAgICAgdG9rZW5zID0gcmF3VmFsdWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGlucHV0IGZvcm1hdCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRva2Vucy5tYXAodGhpcy5jb252ZXJ0VG9Jbm5lckZvcm1hdC5iaW5kKHRoaXMpKS5maWx0ZXIoQm9vbGVhbikgYXMgVG9rZW5bXTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHBhcnNlUmF3VG9rZW5zU3RyaW5nKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmdbXSB7XHJcbiAgICAgICAgY29uc3QgZGVsaW1pdGVycz0gdGhpcy5vcHRpb25zLmRlbGltaXRlcnMhO1xyXG4gICAgICAgIGxldCByZXM6IHN0cmluZ1tdID0gW3ZhbHVlXTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkZWxpbWl0ZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRlbGltaXRlciA9IGRlbGltaXRlcnNbaV07XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZS5pbmRleE9mKGRlbGltaXRlcikgIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICByZXMgPSB2YWx1ZS5zcGxpdChkZWxpbWl0ZXIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjb252ZXJ0VG9Jbm5lckZvcm1hdCh0b2tlbjogc3RyaW5nKTogVG9rZW4gfCBudWxsIHtcclxuICAgICAgICBjb25zdCBwYXJzZWRUb2tlbjogVG9rZW4gPSB7XHJcbiAgICAgICAgICAgIHZhbHVlOiB0b2tlbi50cmltKClcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpZiAocGFyc2VkVG9rZW4udmFsdWUgPT09ICcnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy52YWxpZGF0b3IpIHtcclxuICAgICAgICAgICAgcGFyc2VkVG9rZW4udmFsaWQgPSB0aGlzLnZhbGlkYXRlVG9rZW4odG9rZW4pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHBhcnNlZFRva2VuO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdmFsaWRhdGVUb2tlbih2YWx1ZTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgY29uc3QgeyB2YWxpZGF0b3IgfSA9IHRoaXMub3B0aW9ucztcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiB2YWxpZGF0b3IgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbGlkYXRvcih2YWx1ZSk7XHJcbiAgICAgICAgfSBlbHNlIGlmICggdmFsaWRhdG9yIGluc3RhbmNlb2YgIFJlZ0V4cCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdmFsaWRhdG9yLnRlc3QodmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSAge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gdHlwZSBvZiB0aGUgdmFsaWRhdG9yJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZVRva2VucyhuZXdWYWx1ZTogVG9rZW5bXSwgYWN0aW9uOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCBvbGRWYWx1ZSA9IHRoaXMudG9rZW5zO1xyXG4gICAgICAgIHRoaXMucmVtb3ZlQWxsVG9rZW5zRWwoKTtcclxuICAgICAgICB0aGlzLnRva2VucyA9IG5ld1ZhbHVlO1xyXG4gICAgICAgIHRoaXMucmVuZGVyVG9rZW5zKCk7XHJcbiAgICAgICAgdGhpcy5wdWJsaXNoRXZlbnQoYWN0aW9uLCB7b2xkVmFsdWU6IFRva2Vuc0lucHV0Lm1ha2VEZWVwQ29weU9mKG9sZFZhbHVlKSwgbmV3VmFsdWU6IFRva2Vuc0lucHV0Lm1ha2VEZWVwQ29weU9mKG5ld1ZhbHVlKSwgYWN0aW9ufSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZW1vdmVBbGxUb2tlbnNFbCgpIHtcclxuICAgICAgICBjb25zdCB0b2tlbnNMaXN0ID0gdGhpcy5jb250YWluZXJFbC5xdWVyeVNlbGVjdG9yQWxsKCcudG9rZW5zLWlucHV0X190b2tlbicpO1xyXG4gICAgICAgIGNvbnN0IHRva2Vuc0FycmF5ID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodG9rZW5zTGlzdCk7XHJcbiAgICAgICAgdG9rZW5zQXJyYXkuZm9yRWFjaCggdG9rZW5FbCA9PiB0aGlzLmNvbnRhaW5lckVsLnJlbW92ZUNoaWxkKHRva2VuRWwpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHB1Ymxpc2hFdmVudChldmVudE5hbWU6IHN0cmluZywgZGF0YT86IHt9KSB7XHJcbiAgICAgICAgY29uc3QgZnVsbEV2ZW50TmFtZSA9IGB0b2tlbnMtaW5wdXQuJHtldmVudE5hbWV9YDtcclxuICAgICAgICBsZXQgZXZlbnQ6IEN1c3RvbUV2ZW50O1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdy5DdXN0b21FdmVudCA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgIGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KGZ1bGxFdmVudE5hbWUsIHtcclxuICAgICAgICAgICAgICAgIGRldGFpbDogZGF0YSxcclxuICAgICAgICAgICAgICAgIGJ1YmJsZXM6IHRydWUsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCggJ0N1c3RvbUV2ZW50JyApO1xyXG4gICAgICAgICAgICBldmVudC5pbml0Q3VzdG9tRXZlbnQoIGZ1bGxFdmVudE5hbWUsIHRydWUsIHRydWUsIGRhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jb250YWluZXJFbC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBUbyBhdm9pZCBjaGFuZ2luZyB0aGUgaW5uZXIgc3RhdGUgb2YgdGhlIGNvbXBvbmVudCBmcm9tIHRoZSBvdXRzaWRlIHZpYSByZWZlcmVuY2VzXHJcbiAgICAvLyB3ZSBzaG91bGQgb25seSBzaGFyZSBhIGRlZXAgY29weSBvZiB0aGUgc3RhdGVcclxuICAgIHByaXZhdGUgc3RhdGljIG1ha2VEZWVwQ29weU9mKHRva2VuczogVG9rZW5bXSkge1xyXG4gICAgICAgIHJldHVybiB0b2tlbnMubWFwKHRva2VuID0+ICh7Li4udG9rZW59KSlcclxuICAgIH1cclxufVxyXG5cclxuXHJcbiJdfQ==