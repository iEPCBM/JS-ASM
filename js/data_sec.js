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
    "d": 0x00, // DATA
    "r": 0x01  // FREE FIELD
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
   * @param {String} strName         name of field
   * @param {String} strMSxizeOp     sizing operand
   * @param {Number} realSize        size of defined content (undefined - auto)
   * @param {Array}  [arrContent=[]] defined content (desearialized)
   */
  constructor(strName, strMSxizeOp, strRaw, realSize) {
    this.addrLabel = AddrLabel(strName.toLowerCase());
    strMSxizeOp = strMSxizeOp.toLowerCase();
    if (strMSxizeOp.length!==2) {
      console.warn("Wrong data size: "+strMSxizeOp);
    }
    this.#isFilled = DataDef.dataContaining[strMSxizeOp[0]]?true:false;

    let sizing = DataDef.dataSizes[strMSxizeOp[1]];
    this.#size = Math.ceil(realSize/sizing)*sizing;
    if (this.#isFilled) {
      this.arrContent = DataDef.unserializedData(strRaw);
    }
    else {
      this.arrContent = [];
    }
    
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
