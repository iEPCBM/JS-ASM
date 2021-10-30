operandASMTypes = {
  reg:       0x00, //reg and rm fields
  ea:        0x01, //moffset/displacement/rm
  imm:       0x02, //immX
  named_imm: 0x03  //immX - replace to abs address (ORG_ADDR + MC_ADDR)
};

operandMCTypes = {
  imm:     0x00,
  moffset: 0x01, //dispX (with ModRM only)
  reg:     0x02,
  rm:      0x03
};
