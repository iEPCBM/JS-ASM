regNumeric = {
  "a": 0,
  "c": 1,
  "d": 2,
  "b": 3,
  "sp": 4,
  "bp": 5,
  "si": 6,
  "di": 7,
};

function concatModRM(mod, reg, rm) {
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
