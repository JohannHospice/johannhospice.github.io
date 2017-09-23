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
})();

document.querySelectorAll("[jh-code]").forEach(function (e) {
    var text = e.getAttribute("jh-code").split(",").join('/')
    var size = e.getAttribute("jh-size")

    if (size == null)
        size = 500

    var code = Translator.code(text)
    
    var codeConcat = ""
    var i = 0
    while (codeConcat.length < size) {
        codeConcat += code[i] + " "
        i = (i + 1) % code.length
    }
    e.innerHTML = codeConcat
})