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
 * @param  {Number} mod Mod bits
 * @param  {Number} reg Reg bits (or addition OpCode bits)
 * @param  {Number} rm  R/M bits
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

/**
 * [ModRM description]
 */
class ModRM {
  constructor(arrOperands) {

  }
}
