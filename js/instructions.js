instructions = {
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
  "AAS": {
      ops: [],
      code: 0x3F,
      prefixes: []
  },
  "ADC": {

  },
  "INT": {
    ops: []
  }
}

class Instruction {
  constructor() {

  }
  static validateInstruction(strMnemonic, arrOperands) {
    if (!instructions.hasOwnProperty(strMnemonic)) return false;
    if (instructions[strMnemonic] instanceof Array) {
      instructions[strMnemonic].forEach((item, i) => {

      });
    }
    else if (instructions[strMnemonic] instanceof Object) {

    }
    else {
      // TODO: Error message. Exception
    }
  }
}
