mnemonicComands = [
  "ORG", // Always uses
  "USE16", // Always uses
  "AAA",
  "AAD",
  "AAM",
  "AAS",
  "ADC",
  "ADD",
  "AND",
  "CALL",
  "CBW",
  "CLC",
  "CLD",
  "CLI",
  "CMC",
  "CMP",
  "CMPSB",
  "CMPSW",
  "CWD",
  "DAA",
  "DAS",
  "DEC",
  "DIV",
  "ESC",
  "HLT",
  "IDIV",
  "IMUL",
  "IN",
  "INC",
  "INT",
  "INTO",
  "IRET",
  "JA",
  "JAE",
  "JB",
  "JBE",
  "JC",
  "JE",
  "JG",
  "JGE",
  "JL",
  "JLE",
  "JNA",
  "JNAE",
  "JNB",
  "JNBE",
  "JNC",
  "JNE",
  "JNG",
  "JNGE",
  "JNL",
  "JNLE",
  "JNO",
  "JNP",
  "JNS",
  "JNZ",
  "JO",
  "JP",
  "JPE",
  "JPO",
  "JS",
  "JZ",
  "JCXZ",
  "JMP",
  "LAHF",
  "LDS",
  "LEA",
  "LES",
  "LOCK",
  "LODSB",
  "LODSW",
  "LOOP",
  "LOOPE",
  "LOOPNE",
  "LOOPNZ",
  "LOOPZ",
  "MOV",
  "MOVSB",
  "MOVSW",
  "MUL",
  "NEG",
  "NOP",
  "NOT",
  "OR",
  "OUT",
  "POP",
  "POPF",
  "PUSH",
  "PUSHF",
  "RCL",
  "RCR",
  "REP",
  "REPE",
  "REPNE",
  "REPNZ",
  "REPZ",
  "RET",
  "RETN",
  "RETF",
  "ROL",
  "ROR",
  "SAHF",
  "SAL",
  "SAR",
  "SBB",
  "SCASB",
  "SCASW",
  "SHL",
  "SHR",
  "STC",
  "STD",
  "STI",
  "STOSB",
  "STOSW",
  "SUB",
  "TEST",
  "WAIT",
  "XCHG",
  "XLAT",
  "XOR"
]

registers16bit = [
  "AX",
  "BX",
  "CX",
  "DX",
  "AL",
  "AH",
  "BL",
  "BH",
  "CL",
  "CH",
  "DL",
  "DH"
];

tokenSpec = {

};

lineTypes = {
  command: "command",
  label: "label",
  data: "data"
};

dataSizes = [
  "db", // BYTE
  "dw", // WORD
  "du", // WORD 2
  "dd", // DWORD
  "dp", // 6 bytes
  "df", // 6 bytes
  "dq", // 8 bytes
  "dt", // 10 bytes

  "rb",
  "rw",
  "rd",
  "rp",
  "rf",
  "rq",
  "rt"
];

// Instruction schema:
// PREFIX + OPCODE + ModRM + !SIB + Disp + Imm (Max 15 bytes)

labels = [
  {name: "data", aaddr: 0x4}
];

dataList = [
  {name: "msg", type: "dd", val: [43,64,23,11]}
];

//Assembly line spec:
//  <mnemonic> [<op1>, <op2>, <op3> ;<comment>]
//-- OR --
//  <name> <size> <content> [;<comment>]
//-- OR --
//  <mark>: [;<comment>]
//-- OR --
//  [;<comment>]

function compile(strCode, logger) {
  // STEP 1: tokenizing
  tokens = getTokens(strCode);
  //STEP 2: Find code by schema
  var code = [];
  tokens.forEach((item, i) => {
    let instruction = new Instruction(item.objLine, 0, logger); // d=0, cos asm 16-bit addressing mode support only
    code = code.concat(instruction.machineCode);
  });
  var strCode = "";
  code.forEach((item, i) => {
    strCode+=('00'+item.toString(16)).slice(-2);
  });
  console.log(strCode);
  //STEP 3:
}

/*
* Returns array of tokens
*
* Arguments:
*   strCode - string of assembly code
*/
function getTokens (strCode) {
  strCode = strCode.replace(/;.*$/gm, ""); // Delete comments

  // Split by lines
  var codeLines = [];
  codeLines = strCode.split("\n");

  // Code formatting
  for (i=0; i<codeLines.length; i++) {
    codeLines[i] = codeLines[i].trim();
    if (codeLines[i] === "") {
      codeLines.splice(i, 1);
      i--;
    }
  }

  let retVal = [];
  let objLine = {};
  for (i=0; i<codeLines.length; i++) {
    let lineType = predictLineType(codeLines[i]);
    if (lineType === undefined) {
      callCompileError(i, 0);
      break;
    }
    switch (lineType) {
      case "command":
        objLine = unserializeCommand(codeLines[i]);
        objLine.operands = classificateOperands(objLine.operands);
        console.log("=== BEGIN COMAND SUMARRY ===");
        console.log("Command: "+codeLines[i]);
        console.log("objCommand");
        console.log(objLine);
        console.log("=== END COMMAND SUMARRY ===");
        break;
      case "label":
        console.log("LABEL");
        break;
      case "data":
        console.log("DATA");
        break;
      default:

    }
    retVal.push({type: lineType, objLine: objLine});
  }
  return retVal;
}

function unserializeCommand(strLine) {
  strLine.trim();
  let strMnemonic = strLine.match(/^(\w|\s)*\w(?=")|\w+/gm)[0];
  let strArgs = strLine.substring(strMnemonic.length).trim();
  argsList = strArgs.split(",");
  argsList.forEach((arg, i) => {
    argsList[i] = arg.trim();
  });
  objArgs = [];

  return {
    mnemonic: strMnemonic,
    operands: argsList
  };
}

function isRegister(strArg) {

}

function generateSchemaQuery(mnemonic, operandsList) {
  let opTypes = operandsList.map(a => a.type);
  return {
    mnemonic: mnemonic,
    operands: opTypes
  };
}

function classificateOperands(operands) {
  console.log(operands);
  let retData = [];
  let schema = [
    {val: "AX", type: operandASMTypes.reg}
  ];
  let numReg = /(?:\d+[a-f\d]+h)|(?:[0-7]+o)|(?:[01]+b)|(?:\d+d?)/i;
  operands.forEach((operand, i) => {
    if (!isNaN(NumParser.str2number(operand.trim()))) {
      //console.log(str2number(operand));
      console.log("Imm");
      obj = NumParser.str2number(operand.trim());
      retData.push({type: operandASMTypes.imm, objVal: obj})
    }
    else if (Register.isValidRegister(operand)) {
      console.log("Regiter");
      obj = new Register(operand.trim());
      retData.push({type: operandASMTypes.reg, objVal: obj})
    }
    else if (EffectiveAddress.isValidEA(operand)) {
      console.log("Effective Address / Displacement");
      obj = new EffectiveAddress(operand.trim());
      retData.push({type: operandASMTypes.ea, objVal: obj})
    }
    else if(/^[A-Za-z_][A-Za-z0-9_]*/i.test(operand)) {
      console.log("named_imm");
      retData.push({type: operandASMTypes.named_imm, objVal: operand})
    }
    else {
      console.log("error. Ignored.");
    }
  });
  console.log(retData);
  return retData;
}

function predictLineType(strLine) {
  strLine = strLine.trim();
  if (strLine.endsWith(":")) {
    return lineTypes.label;
  } else if (new RegExp("^[A-Za-z_][A-Za-z0-9_]*\s+("+dataSizes.join("|")+")").test(strLine)) {
    return lineTypes.data;
  } else if (strLine !== "") {
    return lineTypes.command;
  } else {
    return undefined;
  }
}
// example format
tokens = [
    {
      type: "command",
      mnemonic: 67,
      operands: [
        {
          type: "imm",
          value: 43
        },
        {
          type: "register",
          registerId: 3
        },
        {
          type: "address",
          registerId: 3,
          disp: {
            type: "value",
            value: 56
          }
        }
      ]
    },
    {
      type: "label",
      name: "start"
    },
    {
      type: "data",
      name: "msg",
      size: "db",
      value: [
        1,54,85,35,24
      ]
    }
  ]
