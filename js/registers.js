/**
 * Register class.
 *
 * Checked.
 */
class Register {
  #name = "";

  /**
   * Enum of types of registers
   * GPR - general-purpose registers
   * SR - segment registers
   * EFLAGS - flag registers
   * EIP - Instruction Pointer
   * @type {Object}
   */
  static regTypes = {
    GPR:    0x00,
    SR:     0x01,
    EFLAGS: 0x02,
    EIP:    0x03
  };

  static supportedRegs = [
/*d: 8L    8H    16    32   bits*/
    "AL", "AH", "AX", "EAX",
    "BL", "BH", "BX", "EBX",
    "CL", "CH", "CX", "ECX",
    "DL", "DH", "DX", "EDX",
                "SI", "ESI",
                "DI", "EDI",
                "BP", "EBP",
                "SP", "ESP",
                "FLAGS", "EFLAGS", // Please, encode into [ds:0x00]
                "CS", //------------------------------
                "FS", //                             |
                "DS", //   S E G M E N T             |
                "GS", //   R E G I S T E R S         |
                "ES", //                             |
                "SS", //------------------------------
                "IP", "EIP" // Please, encode into [ds:0x00]
  ];

  /**
   * Register's constructor
   * @param {[type]} strName name of register (AX, BL, SI, EAX, etc.)
   */
  constructor(strName) {
    if (!Register.isValidRegister(strName)) {
      console.warn(strName+" is unknown register!");
    }
    this.#name = strName.toUpperCase();
  }

  get name() {
    return this.#name;
  }

  setName(strVal) {
    this.#name = strVal.toUpperCase();
  }

  /**
   * Returns size. Usage: define d-bit in opcode and define prefix byte
   * 0x66 and/or 0x67
   * @return {number} size (8,16 or 32). undefined - error
   */
  get size() {
    if (typeof(this.name)==="string") {
      if (this.name.slice(-1)==='S'&&
          this.name!=="EFLAGS") {
        return 0x10;
      }
      else if (this.name[0]==='E') {
        return 0x20;
      }
      else if (this.name.slice(-1)==='X'||
               this.name.slice(-1)==='I'||
               this.name.slice(-1)==='P') {
        return 0x10;
      }
      else if (this.name.slice(-1)==='L'||
               this.name.slice(-1)==='H') {
        return 0x08;
      }
    }
    return undefined;
  }

  /**
   * Returns type of this register.
   * Usage: define Reg and R/M bits of ModR/M. Define opcode
   * Notice: in R/M field can be Effective Address and GPR only.
   * @return {Number} regTypes val
   */
  get type() {
    if (this.name.slice(-1)==="S" &&
      this.name.length===2) {
      return Register.regTypes.SR;
    }
    else if (this.name==="EFLAGS" ||
              this.name==="FLAGS") {
      return Register.regTypes.EFLAGS;
    }
    else if (this.name=="EIP" ||
            this.name=="IP") {
      return Register.regTypes.EIP;
    }
    return Register.regTypes.GPR;
  }

  static #regNum = {
    "A":  0,
    "C":  1,
    "D":  2,
    "B":  3,
    "SP": 4,
    "BP": 5,
    "SI": 6,
    "DI": 7,
    //SR_reg
    "ES": 0,
    "CS": 1,
    "SS": 2,
    "DS": 3,
    "FS": 4,
    "GS": 5
  };

  get GPR_order() {
    if (this.type === Register.regTypes.GPR) {
      if (this.name.slice(-1)==="L" ||
          this.name.slice(-1)==="X") {
          return 0;
      }
      return 1;
    }
    return undefined;
  }

  /**
   * Returns Reg bits of this register (Part of ModRM byte).
   * Notice: EFLAGS and EPI must be converted into [ds:0x0] reference.
   * @return {Number} Register's bits. (000b-111b)
   */
  get regBits() {
    let rnum, rorder;
    let register = this.name;
    if (register[0]==="E" && register.length===3) { // 32bit regs
      register = register.substring(1);
    }
    if (register.length===2) {
      if (register in Register.#regNum) {
        return Register.#regNum[register]&0x07;
      }
      else if (register[0] in Register.#regNum &&
               this.GPR_order!==undefined) {
        rnum = Register.#regNum[register[0]];
        rorder = this.GPR_order;
        return ((rorder << 0x02)|rnum)&0x07;
      }
    }
    return undefined;
  }

  /**
   * isValidRegister Register validation. For avoid mistakes in future call
   * this method before define Register object.
   * @return {Boolean} true - valid; false - invalid.
   */
  static isValidRegister (strReg) {
    if (typeof(strReg)==="string") {
      strReg = strReg.toUpperCase();
      if (Register.supportedRegs.includes(strReg)) {
        return true;
      }
    }
    return false;
  }
}

// Test

function Unit0() {
  for (var i = 0; i < Register.supportedRegs.length; i++) {
    let reg = new Register(Register.supportedRegs[i]);
    console.log("TEST "+i);
    console.log("Register name: "+reg.name);
    console.log("Size:          "+reg.size);
    console.log("Type:          "+reg.type);
    console.log("GPR Order:     "+reg.GPR_order);
    console.log("Reg R/M bits:  "+reg.regBits);
  }
}
