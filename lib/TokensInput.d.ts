declare type TokensInputValidator = (str: string) => boolean;
declare type TokensInputOptions = {
    delimiters?: string[];
    validator?: RegExp | TokensInputValidator;
    inputPlaceholder?: string;
};
declare type Token = {
    value: string;
    valid?: boolean;
};
declare class TokensInput {
    private containerEl;
    clear(): void;
    add(value: string | string[]): void;
    replaceAllWith(value: string | string[]): void;
    remove(indexToRemove: number): void;
    getAll(): Token[];
    toString(): string;
    destroy(): void;
    private readonly options;
    private destroyed;
    private tokens;
    private inputEl;
    private isCtrl;
    private isVKey;
    constructor(containerEl: HTMLElement, options?: TokensInputOptions, initValue?: string | string[]);
    private init;
    private render;
    private renderTokens;
    private renderToken;
    private renderInput;
    private attachEvents;
    private onInputKeyDown;
    private onInputKeyUp;
    private onBufferInsert;
    private onInputBlur;
    private setupClickEventDelegation;
    private onRemoveButtonClick;
    private processInputElValue;
    private parseInputValue;
    private parseRawTokensString;
    private convertToInnerFormat;
    private validateToken;
    private updateTokens;
    private removeAllTokensEl;
    private publishEvent;
    private static makeDeepCopyOf;
}
