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
    // reg to rm
    // rm to reg
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
    },
    {
      ops: [
        operandMCTypes.rm,
        operandMCTypes.imm
      ],
    //        ccccccxs
      code: 0b10000000,
      hasDirBit: false,
      hasSizeBit: true,
      hasImmSizeBit: true,
      allowedSizes: 0b111,
      opcodeExt: 0b010
    }
  ],
  "ADD": [
    // reg to rm
    // rm to reg
    {
      ops: [
        operandMCTypes.reg,
        operandMCTypes.rm
      ],
    //        ccccccds
      code: 0b00000010,
      hasDirBit: true,
      hasSizeBit: true,
      hasImmSizeBit: false,
      allowedSizes: 0b111
    },
    {
      ops: [
        operandMCTypes.rm,
        operandMCTypes.imm
      ],
    //        ccccccxs
      code: 0b10000000,
      hasDirBit: false,
      hasSizeBit: true,
      hasImmSizeBit: true,
      allowedSizes: 0b111,
      opcodeExt: 0b000
    }
  ],
  "AND": [
    // reg to rm
    // rm to reg
    {
      ops: [
        operandMCTypes.reg,
        operandMCTypes.rm
      ],
    //        ccccccds
      code: 0b00100010,
      hasDirBit: true,
      hasSizeBit: true,
      hasImmSizeBit: false,
      allowedSizes: 0b111
    },
    {
      ops: [
        operandMCTypes.rm,
        operandMCTypes.imm
      ],
    //        ccccccxs
      code: 0b10000000,
      hasDirBit: false,
      hasSizeBit: true,
      hasImmSizeBit: true,
      allowedSizes: 0b111,
      opcodeExt: 0b100
    }
  ],
/*
  "ARPL": [
    // reg to rm
    // rm to reg
    {
      ops: [
        operandMCTypes.reg,
        operandMCTypes.rm
      ],
    //        cccccccc
      code: 0b01100011,
      hasDirBit: false,
      hasSizeBit: false,
      hasImmSizeBit: false,
    //              8 16 32
      allowedSizes: 0b010
    }
  ],*/
  /*
  "CPUID": [
    {
      ops: [],
      code: 0b10100010,
      prefixes: [0x0F]
    }
  ],
  */
  "CALL": [
    {
      ops: [
        operandMCTypes.imm
      ],
    //        cccccccc
      code: 0b11101000,
      hasDirBit: false,
      hasSizeBit: false,
      hasImmSizeBit: false,
      allowedSizes: 0b011
    },
    {
      ops: [
        operandMCTypes.rm
      ],
    //        ccccccxs
      code: 0b11111111,
      hasDirBit: false,
      hasSizeBit: true,
      hasImmSizeBit: true,
      allowedSizes: 0b111,
      opcodeExt: 0b100
    }
  ],
  "CBW": [
    {
      ops: [],
      code: 0b10011000,
      prefixes: []
    }
  ],
  "CLC": [
    {
      ops: [],
      code: 0b11111000,
      prefixes: []
    }
  ],
  "CLD": [
    {
      ops: [],
      code: 0b11111100,
      prefixes: []
    }
  ],
  "CLI": [
    {
      ops: [],
      code: 0b11111010,
      prefixes: []
    }
  ],
  "CMC": [
    {
      ops: [],
      code: 0b11110101,
      prefixes: []
    }
  ],
  "INT": [
    {
      ops: [
        operandMCTypes.imm
      ],
    //        ccccccds
      code: 0b11001101,
      hasDirBit: false,
      hasSizeBit: false,
      hasImmSizeBit: false,
      allowedSizes: 0b100,
    }
  ],
  "CMP": [
    // reg to rm
    // rm to reg
    {
      ops: [
        operandMCTypes.reg,
        operandMCTypes.rm
      ],
    //        ccccccds
      code: 0b00111010,
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
      code: 0b10000000,
      hasDirBit: false,
      hasSizeBit: true,
      hasImmSizeBit: false,
      allowedSizes: 0b111,
      opcodeExt: 0b111
    }
  ],
  "CWD": [
    {
      ops: [],
      code: 0b10011001,
      prefixes: []
    }
  ],
  "DAA": [
    {
      ops: [],
      code: 0b00100111,
      prefixes: []
    }
  ],
  "DAS": [
    {
      ops: [],
      code: 0b00101111,
      prefixes: []
    }
  ],
  "DEC": [
    {
      ops: [
        operandMCTypes.rm
      ],
    //        ccccccds
      code: 0b11111110,
      hasDirBit: false,
      hasSizeBit: true,
      hasImmSizeBit: false,
      allowedSizes: 0b111,
      opcodeExt: 0b001
    }
  ],
  "DIV": [
    {
      ops: [
        operandMCTypes.rm
      ],
    //        ccccccds
      code: 0b11110110,
      hasDirBit: false,
      hasSizeBit: true,
      hasImmSizeBit: false,
      allowedSizes: 0b111,
      opcodeExt: 0b110
    }
  ],
  "HLT": [
    {
      ops: [],
    //        ccccccds
      code: 0b11110100,
      hasDirBit: false,
      hasSizeBit: false,
      hasImmSizeBit: false,
      allowedSizes: 0b111
    }
  ],
  "IDIV": [
    {
      ops: [
        operandMCTypes.rm
      ],
    //        ccccccds
      code: 0b11110110,
      hasDirBit: false,
      hasSizeBit: true,
      hasImmSizeBit: false,
      allowedSizes: 0b111,
      opcodeExt: 0b111
    }
  ],
  "IMUL": [
    {
      ops: [
        operandMCTypes.rm
      ],
    //        ccccccds
      code: 0b11110110,
      hasDirBit: false,
      hasSizeBit: true,
      hasImmSizeBit: false,
      allowedSizes: 0b111,
      opcodeExt: 0b101
    },
    {
      ops: [
        operandMCTypes.reg,
        operandMCTypes.rm,
        operandMCTypes.imm
      ],
    //        ccccccds
      code: 0b01101001,
      hasDirBit: false,
      hasSizeBit: false,
      hasImmSizeBit: true,
      allowedSizes: 0b111,
    },
  ],
  "IN": [
    {
      ops: [],
    //        ccccccds
      code: 0b11101100,
      hasDirBit: false,
      hasSizeBit: true,
      hasImmSizeBit: false,
      allowedSizes: 0b111,
    },
    {
      ops: [
        operandMCTypes.imm
      ],
    //        ccccccds
      code: 0b11100100,
      hasDirBit: false,
      hasSizeBit: true,
      hasImmSizeBit: false,
      allowedSizes: 0b100,
    },
  ],
  "INC": [
    {
      ops: [
        operandMCTypes.rm
      ],
    //        ccccccds
      code: 0b11111111,
      hasDirBit: false,
      hasSizeBit: true,
      hasImmSizeBit: false,
      allowedSizes: 0b111,
      opcodeExt: 0b000
    }
  ],
  "INTO": [
    {
      ops: [],
    //        ccccccds
      code: 0b11001110,
      hasDirBit: false,
      hasSizeBit: false,
      hasImmSizeBit: false,
      allowedSizes: 0b111
    }
  ],
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
  ],
  "XOR": [
    // reg to rm
    // rm to reg
    {
      ops: [
        operandMCTypes.reg,
        operandMCTypes.rm
      ],
    //        ccccccds
      code: 0b00110010,
      hasDirBit: true,
      hasSizeBit: true,
      hasImmSizeBit: false,
      allowedSizes: 0b111
    },
    {
      ops: [
        operandMCTypes.rm,
        operandMCTypes.imm
      ],
    //        ccccccxs
      code: 0b10000000,
      hasDirBit: false,
      hasSizeBit: true,
      hasImmSizeBit: true,
      allowedSizes: 0b111,
      opcodeExt: 0b110
    }
  ]
}

class Instruction {
  #strMnemonic;
  #objOperands;
  #flag_d;
  #logger
  constructor(objAsmCommand, flag_d, logger) {
    this.#logger = logger;
    this.#flag_d = flag_d;
    this.#strMnemonic = objAsmCommand.mnemonic.toUpperCase();
    this.#objOperands = Instruction.asm2mc_conv(objAsmCommand.operands);
    if (!Instruction.validateInstruction(objAsmCommand)) {
      logger.sendLogMessage(LogProc.logLevels.error, "Wrong instruction: "+this.instrSchema);
    }
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
        immSize = sz;
        if (sz > 32) {
              console.warn("Immediate owerflowed.");
              immSize = 32;
        }
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
            disp = [];
            if(f_rm.hasDisp()) {
              if (!f_rm.hasBase()&&!f_rm.hasIndex()) {
                disp = this.chunkVal(f_rm.displacement, 0x10);
              }
              else {
                disp = this.chunkVal(f_rm.displacement);
              }
            }
        }
      }
    });

    if (objInstr.allowedSizes & regSize>>3 === 0 && regSize !== 0) {
      console.warn("Unsupported operand size.");
    }
    if (typeof(objInstr.ops)==="object" && objInstr.ops.length>0) {
      if (objInstr.hasSizeBit) {
        if (this.hasField(operandMCTypes.reg)||
          (this.hasField(operandMCTypes.rm)&&f_rm instanceof Register)) {
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
        }
        else if (this.hasField(operandMCTypes.imm)&&imm!==undefined) {
          if(immSize===8) {
            opcode&=0xFE;
          }
          else {
            opcode|=0x01;
            if ((immSize===16 && this.#flag_d) ||
            (immSize>=32 && !this.#flag_d)) {
              prefixes.push(Prefix.prefixes.operandOverride);
            }
          }
        }
      }
      if ((doDirOverride && objInstr.hasDirBit) ||
      (this.bitS && objInstr.hasImmSizeBit)) {
        opcode ^= 0x02;
      }
    }

    if (typeof(objInstr.sec_code)==="number") {
      opcode = [opcode, objInstr.sec_code];
    }

    // STEP 5. Generate ModRM
    if (objInstr.opcodeExt !== undefined) {
      f_reg = objInstr.opcodeExt;
    }
    if (imm!==undefined) {
      if (this.bitS && objInstr.hasImmSizeBit) {
        chunckedImm = this.chunkVal(imm, 8);
      }
      else if (f_rm instanceof Register) {
        chunckedImm = this.chunkVal(imm, f_rm.size);
      }
      else {
        chunckedImm = this.chunkVal(imm, immSize);
      }
    }

    retCode = retCode.concat(prefixes);
    if (typeof(opcode)==="number") {
      retCode.push(opcode);
    }
    else if (typeof(opcode)==="object") {
      retCode = retCode.concat(opcode);
    }
    if (f_reg !== undefined && f_rm !== undefined) {
      var modrm = new ModRM(f_reg, f_rm);
      retCode.push(modrm.assembleModRM());
    }
    retCode = retCode.concat(disp);
    retCode = retCode.concat(chunckedImm);
    return retCode;
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

  hasField(type) {
    for (var i = 0; i < this.#objOperands.length; i++) {
      if (this.#objOperands[i].type===type) return true;
    }
    return false;
  }

  get instrSchema() {
    var retVal = this.#strMnemonic+" ";
    this.#objOperands.forEach((item, i) => {
      retVal+=Object.keys(operandMCTypes).find(key => operandMCTypes[key] === item.type);
      if (i<this.#objOperands.length-1) {
        retVal+=", ";
      }
    });
    return retVal;
  }

  /**
   * [bitS description]
   * +-----+-------+-------+-------+-------+
   * |  w  |   0   |   0   |   1   |   1   |
   * +-----+-------+-------+-------+-------+
   * |  s  |   0   |   1   |   0   |   1   |
   * +-----+-------+-------+-------+-------+
   * | r/m |   8   |   8   | 16/32 | 16/32 |
   * +-----+-------+-------+-------+-------+
   * | imm |   8   |   8   | 16/32 |   8   |
   * +-----+-------+-------+-------+-------+
   * @return {[type]} [description]
   */
  get bitS() {
    var rmLen = 0;
    var immLen = 0;
    var isEA = false;
    for (var i = 0; i < this.#objOperands.length; i++) {
      if (this.#objOperands[i].type===operandMCTypes.rm &&
      this.#objOperands[i].objVal instanceof EffectiveAddress) isEA = true;
      else if ((this.#objOperands[i].type===operandMCTypes.rm ||
      this.#objOperands[i].type===operandMCTypes.reg) &&
      this.#objOperands[i].objVal instanceof Register) {
        rmLen = this.#objOperands[i].objVal.size;
      }
      else if (this.#objOperands[i].type===operandMCTypes.imm) {
        immLen = NumParser.getMinSize(this.#objOperands[i].objVal);
      }
    }
    if (isEA) {
      if (immLen===8) {
        return true;
      }
      else if (immLen === 16 || immLen === 32) {
        return false;
      }
    }
    else if (rmLen>0) {
      if (rmLen === 8) {
        return true;
      }
      else if (rmLen === 16 || rmLen === 32) {
        if (immLen === 8) {
          return true;
        }
        else if (immLen === 16 || immLen === 32) {
          return false;
        }
      }
    }
    return false;
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
