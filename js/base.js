$(document).ready(function() {
  var myCodeMirror = CodeMirror.fromTextArea(document.getElementById("code-area"), {
    mode:  "asm",
    lineNumbers: true,
    theme: "abcdef"
  });
});
