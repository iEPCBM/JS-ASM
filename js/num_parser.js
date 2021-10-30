/**
 * Checked.
 */
class NumParser {
  /**
   * Radix dictionary
   * @type {Object}
   */
  static radixes = {
    "b": 2,
    "o": 8,
    "h": 16,
    "d": 10,
    "x": 32
  };

  static getMinSize(val) {
    // BUG 17-08-21: 32 bit values only. this.#disp>32 bits freezes the cycle
    /*
    let bitness=0;
    for (let t_disp = this.#disp; t_disp!==0; bitness++) {
      t_disp>>=0x08;
    }
    return 1<<Math.floor(bitness/2);
    */

    // FIXED:
    if (typeof(val) === "number") {
      let bytes = Math.ceil(val.toString(0x10).length/2);
      return 8*1<<Math.ceil(Math.log2(bytes));
    }
    return NaN;
  }

  /**
   * Is numeric the value in the following radix.
   * @param  {String}  value number as string
   * @param  {Number}  radix radix (from 2 to 36)
   * @return {Boolean}       true - value is numeric, false - value is not numeric
   */
  static isNumeric(value, radix) {
    let regexp;
    if (radix<=1||radix>36) return false;
    if (radix<=10) {
      regexp = RegExp("[0-"+(radix-1).toString()+"]+", "i");
    }
    else {
      regexp = RegExp("[0-9][0-9a-"+String.fromCharCode(radix-11+"a".charCodeAt(0))+"]*", "i");
    }
    return value.match(regexp)!==null?value.match(regexp)[0]===value:false;
  }

  static str2number(str) {
    str = str.trim();
    str = str.toLowerCase();
    let rval;
    let base = str.slice(-1);
    if (base in NumParser.radixes&&NumParser.isNumeric(str.slice(0, -1), NumParser.radixes[base])) {
      let strNum = str.slice(0, -1);
      rval = parseInt(strNum, NumParser.radixes[base]);
    }
    else if (NumParser.isNumeric(str, 10)) {
      rval = parseInt(str, 10);
    }
    else {
      rval = NaN;
    }
    return rval;
  }
}
