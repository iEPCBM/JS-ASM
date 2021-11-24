class DataDef {
  arrContent = [];
  #size;
  #isFilled = false;
  addrLabel;

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
    "d": 0x01, // DATA
    "r": 0x00  // FREE FIELD
  };

  static str2code(str) {
    var retVal = [];
    for (var i = 0; i < str.length; i++) {
      retVal.push(str.charCodeAt(i))
    }
    return retVal;
  }

  static unserializeBytedData(str) {
    var arrData = str.split(/,(?=(?:[^']*'[^']*')*[^']*$)/i);
    var code;
    var retVal = [];
    for (var i = 0; i < arrData.length; i++) {
      arrData[i] = arrData[i].trim();
      if (!isNaN(code = NumParser.str2number(arrData[i])) && NumParser.getMinSize(code)<=8) {
        retVal.push(code);
      }
      else {
        console.warn("Unreadable byte: "+arrData[i]+" in array: "+str);
      }
    }
    return retVal;
  }

  static unserializedData(str) {
    var arrVals = str.split(/,(?=(?:[^']*'[^']*')*[^']*$)/i);
    var retVal = [];
    for (var i = 0; i < arrVals.length; i++) {
      arrVals[i] = arrVals[i].trim();
      let code;
      if (!isNaN(code = NumParser.str2number(arrVals[i])) && NumParser.getMinSize(code)<=8) {
        retVal.push(code);
      }
      else if (/^'((?![']).)*'$/i.test(arrVals[i])) {
        let data = DataDef.str2code(arrVals[i].slice(1, -1));
        retVal = retVal.concat(data);
      }
      else {
        console.warn("Unreadable data: "+arrVals[i]+" in array: "+str);
      }
    }
    return retVal;
  }

  /**
   * Constructor
   * @param {String} strLine line of code
   */
  constructor(strLine) {
    strLine = strLine.trim();
    var arrLine = strLine.split(/(?:(?<=^\w+)\s)|(?:(?<=^\w+\s+\w+)\s)/i);
    if (arrLine.length>3) {
      console.warn("Wrong data");
    }
    this.addrLabel = new AddrLabel(arrLine.at(0));
    var strMSizeOp = arrLine.at(1).toLowerCase();
    if (strMSizeOp.length!==2) {
      console.warn("Wrong data size: "+strMSizeOp);
    }
    this.#isFilled = DataDef.dataContaining[strMSizeOp[0]]?true:false;
    if (this.#isFilled) {
      this.arrContent = DataDef.unserializedData(arrLine.at(-1));
    }
    else {
      this.arrContent = [0x00];
      if (arrLine.length===3) {
        let size = NumParser.str2number(arrLine.at(-1));
        for (var i = 1; i < size; i++) {
          this.arrContent.push(0x00);
        }
      }
    }

    let sizing = DataDef.dataSizes[strMSizeOp[1]];
    this.#size = Math.ceil(this.arrContent.length/sizing)*sizing;
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
