class LogProc {
  static logLevels = {
    info: 0,
    notice: 1,
    warning: 2,
    error: 3,
    fatal_error: 4
  };
  #f_renderer = function (logLevel, strMsg, lineOfCode=-1) {
    alert("line: "+lineOfCode.toString()+"\nlog level: "+logLevel.toString()+"\nmessage: "+strMsg);
  };
  constructor(f_renderer) {
    if (typeof(f_renderer)==="function") {
        this.#f_renderer = f_renderer;
    }
  }
  sendLogMessage(logLevel, strMsg, line=-1) {
    this.#f_renderer(logLevel, strMsg, line);
  }
}
