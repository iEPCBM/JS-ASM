regNum = {
  "a": 0,
  "c": 1,
  "d": 2,
  "b": 3,
  "sp": 4,
  "bp": 5,
  "si": 6,
  "di": 7,
};

regOrder = {
  "l": 0,
  "h": 1,
  "x": 0
};

/**
 * encodeRegBits encodes REG bits
 * @param  {string} register register name (AX, DL, SI, EAX, etc.)
 * @return {number}          REG bits (000b-111b); undefined - error
 */
function encodeRegBits(register) {
  if (typeof(register)==="string") {
    let rnum, rorder;
    if (register[0]==="e") { // 32bit regs
      register = register.substring(1);
    }
    if (register.length===2) {
      if (register in regNum) {
        return regNum[register]&0x07;
      }
      else if (register[0] in regNum &&
              register[1] in regOrder) {
        rnum = regNum[register[0]];
        rorder = regOrder[register[1]];
        return ((rorder<<0x02)|rnum)&0x07;
      }
    }
  }
  return undefined;
}

function getModBits(arg1, arg2) {
// TODO: MOD detector
}

/**
 * assembleModRM assebles ModR/M byte. ModR/M byte schema:
 * 1     2     5     8
 * ^*****^*****^*****^
 * | Mod | Reg | R/M |
 * *******************
 * | x x | xxx | xxx |
 * *******************
 * @param  {Number} mod Mod field
 * @param  {Number} reg Reg field (or OpCode extension field)
 * @param  {Number} rm  R/M field
 * @return {Number}     ModR/M byte [0-255]
 */
function assembleModRM(mod, reg, rm) {
  try {
    if (!checkMod(mod)) throw "Invalid Mod [0;3]";
    if (!checkRegOpcode(reg)) throw "Invalid Reg (not 3 bits)";
    if (!checkRM(rm)) throw "Invalid R/M (not 3 bits)";
  } catch (e) {
    console.log(e);
  } finally {
    comparedByte = ((mod << 0x06)|(reg << 0x03)|rm)&0xFF;
    return comparedByte;
  }
}

function getModRM() {

}

/**
 * [ModRM description]
 */
class ModRM {
  #objReg;
  #objRM;

  constructor(reg, rm) {
    if (!(ModRM.isRegister(rm) || ModRM.isEA(rm))) {
      console.error("Invalid (S)RM field");
    }
    if (!(ModRM.isRegister(reg) || ModRM.isOpExt(reg))) {
      console.error("Invalid Reg field");
    }
    this.#objReg = reg;
    this.#objRM = rm;
  }

  get mod() {
    let retMod = 0;
    if (ModRM.isRegister(this.#objRM)) {
      retMod = 0x03;
    }
    else if (ModRM.isEA(this.#objRM)) {
      let dispSize = this.#objRM.getDispMinSize();
      if (!this.#objRM.hasBase() && !this.#objRM.hasIndex() && dispSize===0x08) {
        retMod = 0;
      }
      else if (dispSize/8<3) {
        retMod = Math.trunc(dispSize/8);
      }
      else {
        console.warn("Displacement size is very large. Setup mod = 0x00");
      }
    }
    else {
      console.warn("(S)RM field object is not detected. Setup mod = 0x00");
    }
    return retMod&0x03;
  }

  static isRegister(reg) {
    return reg instanceof Register;
  }

  static isEA (ea) {
    return ea instanceof EffectiveAddress;
  }

  static isOpExt(ext) {
    return typeof(ext)==="number" & this.constructor.checkRegOpcode(ext);
  }

  static checkMod(mod) {
    return mod<=3 && mod>=0;
  }

  static checkRegOpcode(reg_opcode) {
    return reg_opcode<=7 && reg_opcode>=0;
  }

  static checkRM(rm) {
    return rm<=7 && rm>=0;
  }

  assembleModRM () {
    var reg, rm, comparedByte;
    if (this.constructor.isRegister(this.#objReg)) {
      reg=this.#objReg.regBits;
    }
    else if (this.constructor.isOpExt(this.#objReg)) {
      reg=this.#objReg
    }
    else {
      return undefined;
    }

    if (this.constructor.isRegister(this.#objRM)) {
      rm=this.#objRM.regBits;
    }
    else if (this.constructor.isEA(this.#objRM)) {
      rm=this.#objRM.rmBits;
    }
    else {
      return undefined;
    }
    try {
      if (!ModRM.checkMod(this.mod)) throw "Invalid Mod [0;3]";
      if (!ModRM.checkRegOpcode(reg)) throw "Invalid Reg (not 3 bits)";
      if (!ModRM.checkRM(rm)) throw "Invalid R/M (not 3 bits)";
    } catch (e) {
      console.log(e);
    } finally {
      comparedByte = ((this.mod << 0x06)|(reg << 0x03)|rm)&0xFF;
    }
    return comparedByte;
  }
}

exArrOps = [
  {
    type: "register",
    obj: "object"
  },
  {
    type: "effective address",

  }
];
