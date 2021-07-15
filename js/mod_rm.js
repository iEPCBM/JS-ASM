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
 * getRegisterSize returns size
 * @param  {string} register register name (AX, DL, SI, EAX, etc.)
 * @return {number}          size (8,16 or 32). undefined - error
 */
function getRegisterSize(register) {
  if (typeof(register)==="string") {
    if (register[0]==='e') {
      return 0x20;
    }
    else if (register.slice(-1)==='x'||
             register.slice(-1)==='i'||
             register.slice(-1)==='p') {
      return 0x10;
    }
    else if (register.slice(-1)==='l'||
             register.slice(-1)==='h') {
      return 0x8;
    }
  }
  return undefined;
}

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
        return regNum[register]&0x7;
      }
      else if (register[0] in regNum &&
              register[1] in regOrder) {
        rnum = regNum[register[0]];
        rorder = regOrder[register[1]];
        return ((rorder<<2)|rnum)&0x7;
      }
    }
  }
  return undefined;
}

function getModBits(arg1, arg2) {
// TODO: MOD detector
}

function assembleModRM(mod, reg, rm) {
  try {
    if (!checkMod(mod)) throw "Invalid Mod [0;3]";
    if (!checkRegOpcode(reg)) throw "Invalid reg_opcode (not 3 bits)";
    if (!checkRM(rm)) throw "Invalid R/M (not 3 bits)";
  } catch (e) {
    console.log(e);
  } finally {
    mod <<= 0x6;
    reg <<= 0x3;
    comparedByte = mod|reg|rm;
    return comparedByte&0xFF;
  }
}

function checkMod(mod) {
  return mod<=3 && mod>=0;
}

function checkRegOpcode(reg_opcode) {
  return reg_opcode<=7 && reg_opcode>=0;
}

function checkRM(rm) {
  return rm<=7 && rm>=0;
}

function getModRM() {

}
