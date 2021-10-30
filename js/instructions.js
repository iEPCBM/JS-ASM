/**
 * Contains mnemonics and his codes.
 * Notice:
 * If defined field code8 or code16_32, then this code can working in 8, 16 and
 * 32 mode and has size bit (s):
 *  * if s==0: operation with 8 bit registers or memory
 *  * if s==1: operation with 16 or 32 bits registers or memory
 *
 * If hasDirBit=true, then this code has dir bit (d):
 *  * if d==0: R/M <= MOD
 *  * if d==1: MOD <= R/M
 *
 * OpCode schema:
 *  7 6 5 4 3 2 1 0
 * [c c c c c c d s]
 * where:
 * c - code
 * d - direction
 * s - size of operands (8 bits or 16/32 bits)
 *
 * OpCode with imm operand schema
 *  7 6 5 4 3 2 1 0
 * [c c c c c c x s]
 * where:
 * c - code
 * x - size of immediate (if s==0: ignored, if s==1: x==0 - imm8 x==1 imm16/32)
 * s - size of operands (8 bits or 16/32 bits)
 *
 * Some condition instructions (Jcc, for example) has CTF (TTTN) field:
 * Schema for OpCode with CTF field:
 *  7 6 5 4 3 2 1 0
 * [c c c c t t t n]
 * @type {Object}
 */

instructions = {
// EXAMPLE SECTION BEGIN
  "TEST_R1": [
    {
      ops: [
        operandMCTypes.reg
      ],
      code: 0x63,
      modrm_ext_code: 0b101 // xx101xxx b

    }
  ],
// EXAMPLE SECTION END
  "AAA": [
    {
      ops: [],
      code: 0x37,
      prefixes: []
    }
  ],
  "AAD": [
    {
      ops: [],
      code: 0xD5,
      sec_code: 0x0A,
      prefixes: []
    }
  ],
  "AAM": [
    {
      ops: [],
      code: 0xD4,
      sec_code: 0x0A,
      prefixes: []
    }
  ],
  "AAS": [
    {
      ops: [],
      code: 0x3F,
      prefixes: []
    }
  ],
  "ADC": [
    {
     ops: [
       operandMCTypes.reg,
       operandMCTypes.rm
     ],
    //        ccccccds
      code: 0b00010010,
      hasDirBit: true,
      hasSizeBit: true,
      hasImmSizeBit: false,
      allowedSizes: 0b111
    }
  ],
  "INT": {
    ops: [
      operandMCTypes.imm
    ]
  },
  "MOV": [
    // reg to rm
    // rm to reg
    {
      ops: [
        operandMCTypes.reg,
        operandMCTypes.rm
      ],
    //        ccccccds
      code: 0b10001010,
      hasDirBit: true,
      hasSizeBit: true,
      hasImmSizeBit: false,
      allowedSizes: 0b111
    },
    // imm to reg
    {
      ops: [
        operandMCTypes.rm,
        operandMCTypes.imm
      ],
    //        cccccccs
      code: 0b11000110,
      hasDirBit: false,
      hasSizeBit: true,
      hasImmSizeBit: false,
      allowedSizes: 0b111,
      opcodeExt: 0b000
    }
  ]
}

class Instruction {
  #strMnemonic;
  #objOperands;
  #flag_d;
  constructor(objAsmCommand, flag_d) {
    if (!Instruction.validateInstruction(objAsmCommand)) {
      console.error("Wrong command");
    }
    this.#flag_d = flag_d;
    this.#strMnemonic = objAsmCommand.mnemonic.toUpperCase();
    this.#objOperands = Instruction.asm2mc_conv(objAsmCommand.operands);
    console.log(this.#objOperands);
  }

  get machineCode() {
    var retCode = [];
    var prefixes = [];
    var opcode;
    var modrm = [];
    var disp = [];
    var chunckedImm = [];
    var imm;

    var arrSimilarInstructions = instructions[this.#strMnemonic];
    // STEP 1. Add defined prefixes

    // STEP 2. Find out instruction
    var objFeedback = Instruction.findInstruction(this.#strMnemonic, this.#objOperands);
    var objInstr = arrSimilarInstructions[objFeedback.index];
    var doDirOverride = objFeedback.dirOverride;
    opcode = objInstr.code;

    // STEP 3. Apply dirrection bit
    if (doDirOverride) {
      opcode ^= 0x02;
    }

    // STEP 4. Apply size bit
    // var sizes = [];
    var regSize = 0;
    var immSize = 0;
    var ops = this.#objOperands;
    var f_reg, f_rm;
    ops.forEach((item, i) => {
      if (item.type===operandMCTypes.imm) {
        //sizes.push(NumParser.getMinSize(item.objVal));
        let sz = NumParser.getMinSize(item.objVal);
        if (sz > 32 ||
            immSize !== 0) {
              console.warn("Immediate owerflowed.");
        }
        immSize = sz;
        imm = item.objVal;
      }
      else if (typeof(item.objVal)==="object") {
        if (item.objVal instanceof Register) {
          //sizes.push(item.objVal.size);
          if (regSize !== item.objVal.size &&
              regSize !== 0) {
                console.warn("Sizes of registers are different.");
          }
          regSize = item.objVal.size;
          if (item.type === operandMCTypes.reg) {
            f_reg = item.objVal;
          }
          else if (item.type === operandMCTypes.rm) {
            f_rm = item.objVal;
          }
        }
        else if (item.objVal instanceof EffectiveAddress &&
          (!(prefixes.length>0) ||
          prefixes[prefixes.length-1]!==Prefix.prefixes.addressOverride)) {
            this.#flag_d && prefixes.push(Prefix.prefixes.addressOverride);
            f_rm = item.objVal;
            disp = this.chunkVal(f_rm.displacement);
        }
      }
    });
    /*
    for (let i = 0; i < sizes.length; i++) {
      if (i>0 && sizes[i]!==sizes[i-1]) {
        console.warn("Sizes of operands are different.");
      }
    }
    */
    if (objInstr.allowedSizes & regSize>>3 === 0 && regSize !== 0) {
      console.warn("Unsupported operand size.");
    }

    if (regSize===8) {
      opcode&=0xFE;
    }
    else {
      opcode|=0x01;
      if ((regSize===16 && this.#flag_d) ||
      (regSize===32 && !this.#flag_d)) {
        prefixes.push(Prefix.prefixes.operandOverride);
      }
    }

    // STEP 5. Generate ModRM
    if (objInstr.opcodeExt !== undefined) {
      f_reg = objInstr.opcodeExt;
    }
    if (imm!==undefined) {
      if (f_rm instanceof Register) {
        chunckedImm = this.chunkVal(imm, f_rm.size);
      }
      else {
        chunckedImm = this.chunkVal(imm);
      }
    }

    var cmd = "";
    prefixes.forEach((item, i) => {
      cmd+=item.toString(16);
    });
    cmd+=opcode.toString(16);
    if (f_reg !== undefined &&
    f_rm !== undefined) {
      var modrm = new ModRM(f_reg, f_rm);
      cmd+=modrm.assembleModRM().toString(16);
    }
    disp.forEach((item, i) => {
      cmd+=item.toString(16);
    });
    chunckedImm.forEach((item, i) => {
      cmd+=item.toString(16);
    });
    console.log(disp);
    console.log(chunckedImm);
    console.log(cmd);
  }

  chunkVal(val, size = 0) {
    var retVal = [];
    if (size === 0) {
      while (val!=0) {
        retVal.push(val&0xFF);
        val >>= 0x08;
      }
    }
    else {
      for (var i = 0; i < size; i+=8) {
        if (val!==0) {
          retVal.push(val&0xFF);
          val >>= 0x08;
        }
        else {
          retVal.push(0x00);
        }
      }
      if (val!==0) {
        console.log("Size of val larger then defined size. Elder bytes are ignored.");
      }
    }
    return retVal;
  }

  /**
   * Finds out intruction
   * @param  {String} strMnemonic [description]
   * @param  {Object} objOperands operands in MC types
   * @return {Number}             index of the instruction
   */
  static findInstruction(strMnemonic, operands) {
    console.log(operands);
    var strMnemonic = strMnemonic.toUpperCase();
    var arrInstr = instructions[strMnemonic];
    for (var i = 0; i < arrInstr.length; i++) {
      if (arrInstr[i].ops.length === operands.length) {
        if (arrInstr[i].ops.length === 2 &&
          arrInstr[i].ops[0] === operands[1].type &&
          arrInstr[i].ops[1] === operands[0].type &&
          (arrInstr[i].ops[0] === operandMCTypes.reg ||
           arrInstr[i].ops[0] === operandMCTypes.rm) &&
          (arrInstr[i].ops[1] === operandMCTypes.reg ||
           arrInstr[i].ops[1] === operandMCTypes.rm) &&
          arrInstr[i].hasDirBit) {
            return {index: i, dirOverride: true};
        }
        else {
          force: {
            for (var j = 0; j < arrInstr[i].ops.length; j++) {
              if (arrInstr[i].ops[j] !== operands[j].type) {
                break force;
              }
            }
            return {index: i, dirOverride: false};
          }
        }
      }
    }
  }

/*
  get serialized() {
    var ret = this.#objAsmCommand.mnemonic;
    ret+=" ";
    for (let i = 0; i < this.#objAsmCommand.operands.length; i++) {
      ret+=this.#objAsmCommand.operands[i].val;
      if (i !== this.#objAsmCommand.operands.length-1) {
        ret+=", ";
      }
    }
    return ret;
  }
*/
  /**
   * Check the instruction and his operands with the dict "instructions"
   *
   * @param  {[type]} objCommand [description]
   * @return {[type]}            [description]
   */
  static validateInstruction(objCommand) {
    let strMnemonic = objCommand.mnemonic.toUpperCase();
    if (!instructions.hasOwnProperty(strMnemonic)) return false;
    if (instructions[strMnemonic] instanceof Array) {
      let hasSimilarOperands = true;
      let operands = [];
      let arrInstr = instructions[strMnemonic];
      operands = Instruction.asm2mc_conv(objCommand.operands);
      /*
      for (var i = 0; i < arrInstr.length; i++) {
        if (arrInstr[i].ops.length !== objCommand.operands.length) {
          console.warn("Wrong operand list!");
          hasSimilarOperands = false;
        }
        else {
          operands = Instruction.asm2mc_conv(objCommand.operands);
          if (!(arrInstr[i].ops[0] === operands[1].type &&
            arrInstr[i].ops[1] === operands[0].type &&
            arrInstr[i].hasDirBit)) {
              for (var j = 0; j < arrInstr[i].ops.length; j++) {
                if (arrInstr[i].ops[j] !== operands[j].type) {
                  hasSimilarOperands = false;
                  break;
                }
              }
          }
        }
      }
      */
      if (Instruction.findInstruction(strMnemonic, operands) === undefined) {
        return false;
      }
    }
    else {
      // TODO: Error message. Exception
      return false;
    }
    return true;
  }

  /**
   * Convert asm type to mc type
   * Convertation schema:
   * +-----+---------+----------+-----------+
   * | ASM | reg     | ea | imm | named_imm |
   * +-----+---------+----+-----+-----------+
   * | MC  | reg, rm | rm | imm | imm       |
   * +-----+---------+----+-----+-----------+
   *
   * @param  {[Array]} arrAsm_t array with asm operand objects.
   * @return {[Array]} array with mc operand objects.
   */
  static asm2mc_conv(arrAsm_t) {
    let ret = [];
    let hasReg = false;
    let hasRm = false;
    let reg_i;
    for (var i = 0; i < arrAsm_t.length; i++) {
      if (arrAsm_t[i].type === operandASMTypes.ea &&!hasRm) {
        ret.push({
          type: operandMCTypes.rm,
          objVal: arrAsm_t[i].objVal
        });
        hasRm = true;
      }
      else if (arrAsm_t[i].type === operandASMTypes.reg) {
        if (!hasReg) {
          ret.push({
            type: operandMCTypes.reg,
            objVal: arrAsm_t[i].objVal
          });
          hasReg = true;
          reg_i=ret.length-1;
        }
        else if (!hasRm) {
          ret.push({
            type: operandMCTypes.rm,
            objVal: arrAsm_t[i].objVal
          });
          hasRm = true;
        }
        else {
          console.warn("Error: ModRM owerflowed.");
          return undefined;
        }
      }
      else if (arrAsm_t[i].type === operandASMTypes.imm) {
        ret.push({
          type: operandMCTypes.imm,
          objVal: arrAsm_t[i].objVal
        });
      }
      else {
        console.warn("Unsupported field.");
        return undefined;
      }
    }
    if (!hasRm && hasReg && reg_i !== undefined) {
      ret[reg_i].type = operandMCTypes.rm;
      hasRm=!hasRm;
      hasReg=!hasReg;
    }
    return ret;
  }
}
