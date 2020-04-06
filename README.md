# Tokens/Tags input
A component that allows creating a tokens input with optional validation that may serve as emails input, phone number inputs etc.

## Getting Started

* Add component's CSS and JS to your page:
```
<script src="lib/components/TokensInput/TokensInput.js" ></script>
<link type="text/css" href="lib/components/TokensInput/TokensInput.css" rel="stylesheet">
```

* Call the constructor to create new tokens input

```
let tokensInputContainer = document.querySelector('#token-input');
let tokensInput = new TokensInput(tokensInputContainer);
```

* You are set to go!

## Arguments

`TokensInput` constructor accepts the following arguments :

* `containerEl: HTMLElement` - Element that will become a tokens input
* `[options]: {[delimeters], [validator], [inputPlaceholder]}` - Custom options
* `[initialTokes]: string | string[]` - An array or a string of tokens. Tokens in a string should be separated by one
type of delimiters. Mixing delimiters is not allowed.
Eg. `token1,token2,token3` is good but `token1,token2;token3` is not

## Custom options

* `delimiters` - An array of characters that will trigger token creation. Default `[',', 'Enter']`
* `validator` - A RegExp or a callback function to validate input tokens. Default `undefined`
    * callback function takes a `string` as an arguments and expected to return a `boolean`
* `inputPlaceholder` - A string that will be used as a placeholder for tokens input. Default `add more people...`

## Methods

* `clear()` - Clears the token input
* `getAll()`- Return an array of all tokens
* `add(string | string[])` - Adds tokens to the component
* `remove(number)` - Removes the n'th token
* `replaceAllWith(string | string[])` - Replaces all existing tokens with new ones

## Events
`TokensInput` emits the following events:

* `tokens-input.ready` - happens right after the component was rendered and initialised
* `tokens-input.update` - happens every time when the content of the component is updated

Both events contain additional data `{oldValue, newValue, action}`. Where `oldValue` and `newValue` are the content of 
the component before and after the update, `action` - the name of the action that triggered update. 
`action` can be `clear`, `add`, `replace` or `remove`.

## Example

Let's now create an emails input that has basic email validation, uses `[',', ' ', 'Enter']` as delimiters
and has an initial state:

```
<div id="emails-input"></div>
let emailsInputContainer = document.querySelector('#emails-input');

emailsInputContainer.addEventListener('tokens-input.ready', function(event) {console.log('TokensInput is ready', event)});

let emailsInput = new TokensInput(emailsInputContainer, {
        delimiters: [',', ' ', 'Enter'],
        validator: /(.+)@(.+){2,}\.(.+){2,}/
    }, 'koval.nikolay@gmail.com, test@email.com, invalid.email'
);
```
