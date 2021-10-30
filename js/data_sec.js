class DataDef {
  strName;
  arrContent;
  #size;
  #isFilled = false;
  static dataSizes = {
    "b": 0x01, // BYTE
    "w": 0x02, // WORD
    "u": 0x02, // WORD
    "d": 0x04, // DWORD
    "p": 0x06, // 6 BYTES
    "f": 0x06, // 6 BYTES
    "q": 0x08, // 8 BYTES
    "t": 0x0A  // 10 BYTES
  };
  static dataContaining = {
    "d": 0x00, // DATA
    "r": 0x01  // FREE FIELD
  };

  /**
   * Constructor
   * @param {String} strName         name of field
   * @param {String} strMSxizeOp     sizing operand
   * @param {Number} realSize        size of defined content
   * @param {Array}  [arrContent=[]] defined content (desearialized)
   */
  constructor(strName, strMSxizeOp, realSize, arrContent=[]) {
    strMSxizeOp = strMSxizeOp.toLowerCase();
    strName = strName.toLowerCase();
    this.strName = strName;
    if (strMSxizeOp.length!==2) {
      console.warn("Wrong data size: "+strMSxizeOp);
    }
    this.#isFilled = DataDef.dataContaining[strMSxizeOp[0]]?true:false;
    let sizing = DataDef.dataSizes[strMSxizeOp[1]];
    this.#size = Math.ceil(realSize/sizing)*sizing;
    this.arrContent = arrContent;
  }

  get contentSize() {
    return this.arrContent.length;
  }

  getAddress(orgAddr, codeAddr) {
    return orgAddr+codeAddr;
  }

  get size() {
    return this.#size;
  }

  get filledContent() {
    let cmpL = this.#size - this.arrContent.length;
    if (cmpL<0) {
      console.error("Internal error");
      return [];
    }
    return this.arrContent.concat(Array(cmpL).fill(0x00));
  }
}
