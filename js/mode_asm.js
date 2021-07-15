//CodeMirror required

/**
 * initAsmMode initialize mode Assembly language for CodeMirror
 * @return {undefined}
 */
function initAsmMode() {
  CodeMirror.defineSimpleMode("asm", {
    start: [
      {regex: /"(?:[^\\]|\\.)*?(?:"|$)/, token: "string"},
      {regex: /'(?:[^\\]|\\.)*?(?:'|$)/, token: "string"},
      {regex: RegExp("("+mnemonicComands.join("|")+")(\\s|$)", "i"),
      token: ["keyword", null]},
      {regex: (/[a-zA-Z_$][\w$]*:/),
        token: "variable-2"},
      {regex: /(?:\d+[a-f\d]+h)|(?:[0-7]+o)|(?:[01]+b)|(?:\d+d?)/i,
       token: "number"},
       {regex:  RegExp("(?:"+registers16bit.join("|")+")", "i"),
       token: "variable-2"},
       {regex:  RegExp("(?:"+dataSizes.join("|")+")", "i"),
       token: "keyword"},
       {regex: /[\[\]\+\-]+/, token: "operator"},
       {regex: /[a-zA-Z_][\w]*/, token: "variable"},
       {regex: /;.*/, token: "comment"},
    ],
    meta: {
      dontIndentStates: ["comment"],
      lineComment: ";"
    }
  });
}
