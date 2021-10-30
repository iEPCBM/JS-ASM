class Prefix {
  static prefixes = {
    operandOverride:  0x66,
    addressOverride:  0x67, // USES ALWAYS WITH MOD [0,2]
// SEGMENT OVERRIDE (so)
    so_cs:            0x2E,
    so_ds:            0x3E,
    so_es:            0x26,
    so_ss:            0x36,
    so_fs:            0x64,
    so_gs:            0x65,
// MISC
    lock:             0xF0,
    repne:            0xF2,
    repe:             0xF3
  };
  static menmonics = {
    "CS":     Prefix.prefixes.so_cs,
    "DS":     Prefix.prefixes.so_ds,
    "ES":     Prefix.prefixes.so_es,
    "SS":     Prefix.prefixes.so_ss,
    "FS":     Prefix.prefixes.so_fs,
    "GS":     Prefix.prefixes.so_gs,
    "LOCK":   Prefix.prefixes.lock,
    "REPNE":  Prefix.prefixes.repne,
    "REPE":   Prefix.prefixes.repe,
    "REP":    Prefix.prefixes.repe
  };
};
