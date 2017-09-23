var Translator = (function () {
    const translator = new Map();
    translator.set('a', '4');
    translator.set('e', '3');
    translator.set('i', '1');
    translator.set('o', '0');
    translator.set('s', '5');
    translator.set('t', '7');
    return {
        code: function (str) {
            return str.toLowerCase().split('').map(function (c) {
                return translator.has(c) ? translator.get(c) : c
            }).join('').toUpperCase()
        }
    }
})()

var selectors = ['.jh-code']
selectors.forEach(function (selector) {
    document.querySelectorAll(selector).forEach(function (e) {
        const LIMIT_CHAR = 500
        const CODE = Translator.code(e.innerText)
        const CODE_SPLITED = CODE.split('').join(' ')

        e.innerHTML = "" + CODE_SPLITED
        while(e.innerHTML.length < LIMIT_CHAR)
            e.innerHTML += " " + CODE_SPLITED
    })
})