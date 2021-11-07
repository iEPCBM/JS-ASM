var logger;
$(document).ready(function() {
  initAsmMode();
  var myCodeMirror = CodeMirror.fromTextArea(document.getElementById("code-area"), {
    mode:  "asm",
    lineNumbers: true,
    theme: "abcdef"
  });

  logger = new LogProc(function(logLevel, strMsg, lineOfCode=-1) {
    let colors = {
      notice:  "#3366ee",
      warning: "#ebb734",
      error: "#eb5634"
    }
    let color = "#000";
    if (logLevel === LogProc.logLevels.notice) {
      color = colors.notice;
    }
    else if (logLevel === LogProc.logLevels.warning) {
      color = colors.warning;
    }
    else if (logLevel === LogProc.logLevels.error ||
    logLevel === LogProc.logLevels.fatal_error) {
      color = colors.error;
    }
    $("#log-wrapper").append("<p style=\"color: "+color+";\">Line "+lineOfCode.toString()+": "+strMsg+"</p>");
  });
  $("#btn-assembly").click(function(){
    $("#log-wrapper").empty();
    compile(myCodeMirror.getValue(), logger);
  });
});
