compileErrors = {
  0: "Unknown command or syntax",
  1: "Syntax error",
  2: "Data definition before commands",
  3: "Label overloaded",
  4: "Register sizes are not equal",
  5: "Unknown error"
}

function callCompileError(errCode, line) {
  strErr = "[Compile error] Line " + line + ": " + compileErrors[errCode] + " (code: " + errCode + ")."
  $("#err-wrapper").append("<p>"+strErr+"</p>");
}

function resetErrorLog() {
  $("#err-wrapper").empty();
}
