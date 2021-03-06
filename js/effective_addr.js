/**
 * Notice.
 * GPR type only
 * Supports 16 bits addressation only, without scale factor and SIB byte.
 * Effective eddress Shema: [Base+Index+/-disp] (none or disp8 or disp16).
 *
 * For redefine segment register, please use segment prefixes, e.g.:
 * SS MOV CX, [0X0F]
 * Not:
 * MOV CX, [SS:0X0F]
 *
 * Checked.
 */
class EffectiveAddress {
  #objBase;
  #objIndex;
  #disp = 0x0000;
  #dispName;

  static maxDispSize = 0x10; // Supports 16-bit addr. mode only (max - disp16)

  static baseBits = {
    "BX": 0,
    "BP": 1
  };

  static indexBits = {
    "SI": 0,
    "DI": 1
  };

  /**
   * Constructor.
   * @param {Object} objBase  object of Register (BX, BP)
   * @param {Object} objIndex object of Register (SI, DI)
   * @param {Number} disp     displacement
   */
  constructor(strEA) {
    !EffectiveAddress.isValidEA(strEA)
      && console.error("Wrong effective address.");
    var arrEA = EffectiveAddress.splitEA(strEA);
    this.#objBase=undefined;
    this.#objIndex=undefined;
    for (var i = 0; i < arrEA.length; i++) {
      if (EffectiveAddress.isValidBase(arrEA[i])) {
        this.#objBase = new Register(arrEA[i]);
      }
      else if (EffectiveAddress.isValidIndex(arrEA[i])) {
        this.#objIndex = new Register(arrEA[i]);
      }
      else if (!isNaN(NumParser.str2number(arrEA[i]))) {
        this.#disp=NumParser.str2number(arrEA[i]);
      }
      else if (/[A-Za-z_][A-Za-z0-9_]+/i.test(arrEA[i])) {
        this.#dispName = arrEA[i];
      }
    }
  }

  hasBase() {
    return (this.#objBase instanceof Register);
  }

  hasIndex() {
    return (this.#objIndex instanceof Register);
  }

  hasDisp() {
    return !(this.#disp===0&&this.#dispName===undefined);
  }

  get base() {
    return this.#objBase;
  }

  get index() {
    return this.#objIndex;
  }

  get displacement() {
    return this.#disp;
  }

  get dispName() {
    return this.#dispName;
  }

  /**
   * returns count of bits of displacement.
   * Notice: be careful with large values: max counting size - 32 bits
   * @return {Number} count of bits
   */
  getDispMinSize() {
    if (this.hasDisp()) {
      if (this.#dispName!==undefined) {
        return 16; // Named displacement always imagine as disp16 (2 bytes).
      }
      else {
        return NumParser.getMinSize(this.#disp);
      }
    }
    return 0;
  }

  get rmBits() {
    let retBits = 0;
    if (this.hasIndex()) { // 0xxb (complex) section
      retBits|=EffectiveAddress.indexBits[this.#objIndex.name];
      if (this.hasBase()) {
        retBits|=EffectiveAddress.baseBits[this.#objBase.name]<<0x01;
      }
      else {
        retBits|=1<<0x02;
      }
    }
    else { // 1xxb (reduced) section
      retBits|=3<<0x01;
      if (this.hasBase()) {
        retBits|=!EffectiveAddress.baseBits[this.#objBase.name];
      }
      else if (this.hasDisp() &&
              this.getDispMinSize()===0x08) {
        retBits&=0x06; // Mod = 00b
      } else {
        console.warn("Unsupported addresation set.");
      }
    }
    return retBits&0x07;
  }

  predictMod() {
    let dispSize = this.getDispMinSize();
    if (!this.hasBase() && !this.hasIndex() && dispSize===0x08) {
      return 0;
    }
    else if (dispSize/8<3) {
      return dispSize/8;
    }
    return -1;
  }

  static isValidBase(strBase) {
    if (Register.isValidRegister(strBase)) {
      let objBase = new Register(strBase);
      return objBase.type===Register.regTypes.GPR &&
        (objBase.name in EffectiveAddress.baseBits);
    }
    return false;
  }

  static isValidIndex(strIndex) {
    if (Register.isValidRegister(strIndex)) {
      let objIndex = new Register(strIndex);
      return objIndex.type===Register.regTypes.GPR &&
        (objIndex.name in EffectiveAddress.indexBits);
    }
    return false;
  }

  static splitEA(strEA) {
    strEA = strEA.trim();
    strEA = strEA.slice(1, -1); // Remove brackets
    var retArr = strEA.split("+");
    for (var i = 0; i < retArr.length; i++) {
      retArr[i] = retArr[i].trim();
    }
    return retArr;
  }

  /**
   * Check suggested EA.
   * Effective Address schema:
   * [Base+Index+/-disp]
   * @param  {String}  strEA suggested effective address string
   * @return {Boolean}       true - valid; false - invalid
   */
  static isValidEA(strEA) {
    strEA = strEA.trim();
    if (!/^\[.*\]$/i.test(strEA)) {
      return false;
    }
    let strElems = EffectiveAddress.splitEA(strEA);
    if (strElems.length>3) {
      return false;
    }
    let hasBase, hasIndex, hasDisp;
    hasBase = hasIndex = hasDisp = false;

    for (var i = 0; i < strElems.length; i++) {
      if (EffectiveAddress.isValidBase(strElems[i])) { // Base
        if (hasBase) return false;
        hasBase = true;
      }
      else if (EffectiveAddress.isValidIndex(strElems[i])) { // Index
        if (hasIndex) return false;
        hasIndex = true;
      }
      else if (!isNaN(NumParser.str2number(strElems[i]))||   // Disp
              /[A-Za-z_][A-Za-z0-9_]+/i.test(strElems[i])) {
        if (hasDisp) return false;
        hasDisp = true;
      }
      else {
        return false;
      }
    }
    return true;
  }
}

// Start Unit
function Unit1() {
  let sets = [
    // Mod = 00b
    [new Register("BX"), new Register("SI"), 0],
    [new Register("BX"), new Register("DI"), 0],
    [new Register("BP"), new Register("SI"), 0],
    [new Register("BP"), new Register("DI"), 0],
    [undefined, new Register("SI"), 0],
    [undefined, new Register("DI"), 0],
    [undefined, undefined, 2],
    [new Register("BX"), undefined, 0],
    // Mod = 01b
    [new Register("BX"), new Register("SI"), 32],
    [new Register("BX"), new Register("DI"), 32],
    [new Register("BP"), new Register("SI"), 32],
    [new Register("BP"), new Register("DI"), 32],
    [undefined, new Register("SI"), 32],
    [undefined, new Register("DI"), 32],
    [new Register("BP"), undefined, 32],
    [new Register("BX"), undefined, 32],
    // Mod = 10b
    [new Register("BX"), new Register("SI"), 632],
    [new Register("BX"), new Register("DI"), 632],
    [new Register("BP"), new Register("SI"), 632],
    [new Register("BP"), new Register("DI"), 632],
    [undefined, new Register("SI"), 632],
    [undefined, new Register("DI"), 632],
    [new Register("BP"), undefined, 632],
    [new Register("BX"), undefined, 632],
  ];

  for (var i = 0; i < sets.length; i++) {
    sets[i]
    let ea = new EffectiveAddress(...sets[i]);
    console.log("R/M: "+ea.rmBits);
    console.log("Mod: "+ea.predictMod());

  }

  console.log("=== Mistakes test");

  sets = [
    // Mod = 00b
    [new Register("SI"), new Register("BX"), 0],
    [new Register("BX"), new Register("BP"), 1],
    [new Register("DI"), new Register("SI"), 632],
    [new Register("BP"), new Register("DI"), 0],
    [undefined, undefined, 0],
    [new Register("BX"), undefined, 0],
  ];

  for (var i = 0; i < sets.length; i++) {
    sets[i]
    let ea = new EffectiveAddress(...sets[i]);
    console.log("R/M: "+ea.rmBits);
    console.log("Mod: "+ea.predictMod());
  }
}
// End user
