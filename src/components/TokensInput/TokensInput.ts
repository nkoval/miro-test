type TokensInputValidator = (str: string) => boolean;
type TokensInputOptions = {
    delimiters?: string[];
    validator?: RegExp | TokensInputValidator;
    inputPlaceholder?: string;
}
type Token = {
    value: string;
    valid?: boolean;
}

class TokensInput {
    public clear() {
        this.updateTokens([], 'clear');
    }

    public add(value: string | string[]) {
        let newTokens: Token[] = [];

        if (value && value.length > 0) {
            newTokens = this.parseInputValue(value);
        }

        if (newTokens.length === 0) {
            return;
        }

        this.updateTokens([...this.tokens, ...newTokens], 'add');
    }

    public replaceAllWith(value: string | string[]) {
        let newTokens = this.parseInputValue(value);
        this.updateTokens(newTokens, 'replace');
    }

    public remove(indexToRemove: number) {
        if (isNaN(indexToRemove) || indexToRemove < 0 || indexToRemove >= this.tokens.length) {
            return;
        }

        this.updateTokens(this.tokens.filter( (_token, index) => index !== indexToRemove ), 'remove');
    }

    public getAll(): Token[] {
        return TokensInput.makeDeepCopyOf(this.tokens);
    }

    private readonly options: TokensInputOptions = {
        delimiters: [',', 'Enter'],
        inputPlaceholder: 'add more people...',
    };

    private tokens: Token[] = [];
    private inputEl!: HTMLInputElement;
    private isCtrl = false;
    private isVKey = false;

    constructor(private containerEl: HTMLElement, options: TokensInputOptions={}, initValue?: string | string[]) {
        if (!this.containerEl) {
            throw new Error('The container element is missing');
        }

        this.options = {
            ...this.options,
            ...options,
        };

        if (initValue) {
            this.tokens = this.parseInputValue(initValue);
        }

        this.init();
    }

    private init() {
        this.render();
        this.attachEvents();
        this.publishEvent('ready', {oldValue: [], newValue: TokensInput.makeDeepCopyOf(this.tokens)});
    }

    private render() {
        this.containerEl.classList.add('tokens-input');
        this.renderTokens();
        this.renderInput();
    }

    private renderTokens() {
        const fragment = document.createDocumentFragment();

        this.tokens.forEach( (token, index) => {
            const tokenEl = this.renderToken(token);
            tokenEl.setAttribute('data-index', index.toString());
            fragment.appendChild(tokenEl)
        });

        this.containerEl.insertBefore(fragment, this.inputEl);
    }

    private renderToken(token: Token): HTMLElement {
        const tokenEl = document.createElement('span');
        const removeButton = document.createElement('span');

        tokenEl.classList.add('tokens-input__token');
        tokenEl.innerText = token.value;

        removeButton.classList.add('tokens-input__token-remove');

        tokenEl.appendChild(removeButton);

        if (token.valid === false) {
            tokenEl.classList.add('tokens-input__token--invalid');
        }

        return tokenEl;
    }

    private renderInput() {
        this.inputEl = document.createElement('input');
        this.inputEl.classList.add('tokens-input__input');
        this.inputEl.setAttribute('placeholder', this.options.inputPlaceholder!);

        this.containerEl.appendChild(this.inputEl);
    }

    private attachEvents() {
        this.inputEl.addEventListener('keydown', this.onInputKeyDown.bind(this));
        this.inputEl.addEventListener('keyup', this.onInputKeyUp.bind(this));
        this.inputEl.addEventListener('blur', this.onInputBlur.bind(this));
        this.containerEl.addEventListener('click', this.setupClickEventDelegation.bind(this));
    }

    private onInputKeyDown(event: KeyboardEvent) {
        const {key, code, ctrlKey, metaKey, char}  = event;
        const delimiters= this.options.delimiters!;

        this.isCtrl = ctrlKey || metaKey;
        this.isVKey = key === 'v';

        if (delimiters.indexOf(key) !== -1 || delimiters.indexOf(code) !== -1 || delimiters.indexOf(char) !== -1) {
            this.processInputElValue();
            event.preventDefault();
        }
    }

    private onInputKeyUp(event: KeyboardEvent) {
        const {key}  = event;

        if (this.isCtrl && (key === 'v' || this.isVKey)) {
            this.onBufferInsert()
        }
    }

    private onBufferInsert() {
        this.processInputElValue();
    }

    private onInputBlur(_event: FocusEvent) {
        this.processInputElValue();
    }

    private setupClickEventDelegation(event: MouseEvent) {
        const target = event.target as HTMLElement;

        if (target.classList.contains('tokens-input__token-remove')) {
            this.onRemoveButtonClick(event);
        }
    }

    private onRemoveButtonClick(event: MouseEvent) {
        const target = event.target as HTMLElement;
        const tokenEl = target.parentElement!;
        const indexAttr = tokenEl.getAttribute('data-index') || '';
        const index = parseInt(indexAttr, 10);

        if (!isNaN(index)) {
            this.remove(index);
        }
    }

    private processInputElValue() {
        this.add(this.inputEl.value);
        this.inputEl.value = '';
    }

    private parseInputValue(rawValue: string[] | string): Token[] {
        let tokens: string[] = [];

        if (typeof rawValue === 'string' ) {
            tokens = this.parseRawTokensString(rawValue);
        } else if (Array.isArray(rawValue)) {
            tokens = rawValue;
        } else {
            throw new Error('Unknown input format');
        }

        return tokens.map(this.convertToInnerFormat.bind(this)).filter(Boolean) as Token[];
    }

    private parseRawTokensString(value: string): string[] {
        const delimiters= this.options.delimiters!;
        let res: string[] = [value];

        for (let i = 0; i < delimiters.length; i++) {
            const delimiter = delimiters[i];
            if (value.indexOf(delimiter) !== -1) {
                res = value.split(delimiter);
                break;
            }
        }

        return res;
    }

    private convertToInnerFormat(token: string): Token | null {
        const parsedToken: Token = {
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

    private validateToken(value: string): boolean {
        const { validator } = this.options;

        if (typeof validator === 'function') {
            return validator(value);
        } else if ( validator instanceof  RegExp) {
            return validator.test(value);
        } else  {
            throw new Error('Unknown type of the validator');
        }

    }

    private updateTokens(newValue: Token[], action: string) {
        const oldValue = this.tokens;
        this.removeAllTokensEl();
        this.tokens = newValue;
        this.renderTokens();
        this.publishEvent(action, {oldValue: TokensInput.makeDeepCopyOf(oldValue), newValue: TokensInput.makeDeepCopyOf(newValue), action});
    }

    private removeAllTokensEl() {
        const tokensList = this.containerEl.querySelectorAll('.tokens-input__token');
        const tokensArray = Array.prototype.slice.call(tokensList);
        tokensArray.forEach( tokenEl => this.containerEl.removeChild(tokenEl));
    }

    private publishEvent(eventName: string, data?: {}) {
        const fullEventName = `tokens-input.${eventName}`;
        let event: CustomEvent;

        if (typeof window.CustomEvent === "function") {
            event = new CustomEvent(fullEventName, {
                detail: data,
                bubbles: true,
            })
        } else {
            event = document.createEvent( 'CustomEvent' );
            event.initCustomEvent( fullEventName, true, true, data);
        }

        this.containerEl.dispatchEvent(event);
    }

    // To avoid changing the inner state of the component from the outside via references
    // we should only share a deep copy of the state
    private static makeDeepCopyOf(tokens: Token[]) {
        return tokens.map(token => ({...token}))
    }
}


