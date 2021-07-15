/**
 * encodeInstruction concatenates elements of instruction to one instruction
 * @autor  Rishat Kagirov
 * @param  {Array.number} prefix Prefix bytes (0-4 bytes)
 * @param  {Array.number} opcode Opcode bytes (1-2 bytes)
 * @param  {number}       modrm  ModR/M byte
 * @param  {number}       sib    SIB byte
 * @param  {Array.number} disp   Displacment bytes (disp0-disp16; 0-4 bytes)
 * @param  {Array.number} imm    Immediate bytes (imm0-imm16; 0-4 bytes)
 * @return {Array.number}        Concatenated instruction
 */
function encodeInstruction(prefix, opcode, modrm, sib, disp, imm) {
  let retVal = [];
  retVal = prefix.concat(opcode);
  retVal = retVal.concat(modrm);
  retVal = retVal.concat(sib);
  retVal = retVal.concat(disp);
  retVal = retVal.concat(imm);
  return retVal;
}

/**
 * checkInstruction checks instruction
 * @param  {Array.number} inst Concatenated instruction
 * @return {boolean}           true - valid instruction; false - invalid
 *                             instruction
 */
function checkInstruction(inst) {
  //TEST 1
  //Instruction must be not longer than 15 bytes
  if (inst.length>15 && inst.length<1) {
    return false;
  }
  //TEST 2
  inst.forEach((item, i) => {
    if (typeof(item)!=="number"||item<0||item>255) {
      return false;
    }
  });
  return true;
}
