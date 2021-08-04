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
  "db",
  "dw",
  "du",
  "dd",
  "dp",
  "df",
  "dq",
  "dt",

  "rb",
  "rw",
  "rd",
  "rp",
  "rf",
  "rq",
  "rt"
];

//Assembly line spec:
//  <mnemonic> [<op1>, <op2>, <op3> ;<comment>]
//-- OR --
//  <name> <size> <content> [;<comment>]
//-- OR --
//  <mark>: [;<comment>]
//-- OR --
//  [;<comment>]

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

  for (i=0; i<codeLines.length; i++) {
    let lineType = predictLineType(codeLines[i]);
    if (lineType === undefined) {
      callCompileError(i, 0);
      break;
    }
    switch (lineType) {
      case "command":
        let objCommand = unserializeCommand(codeLines[i]);
        classificateOperands(objCommand.operands);
        break;
      default:

    }
  }
  return codeLines;
}

function unserializeCommand(strLine) {
  strLine.trim();
  let strMnemonic = strLine.match(/^(\w|\s)*\w(?=")|\w+/gm)[0];
  let strArgs = strLine.substring(strMnemonic.length).trim();
  argsList = strArgs.split(",");
  argsList.forEach((arg, i) => {
    argsList[i] = arg.trim();
  });
  return {
    mnemonic: strMnemonic,
    operands: argsList
  };
}

function isRegister(strArg) {

}

function classificateOperands(operands) {
  console.log(operands);

  let numReg = /(?:\d+[a-f\d]+h)|(?:[0-7]+o)|(?:[01]+b)|(?:\d+d?)/i;
  operands.forEach((operand, i) => {
    if (operand.match(numReg)!==null&&
    operand.match(numReg)[0]===operand) {
      console.log(str2number(operand));
    }
    else if (true) {

    }
  });
}

function predictLineType(strLine) {
  strLine = strLine.trim();
  if (strLine.endsWith(":")) {
    return lineTypes.label;
  } else if (new RegExp(dataSizes.join("|")).test(strLine)) {
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
