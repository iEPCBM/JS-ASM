function unit_instr() {
  instrs = getTokens(
/*
    "mov ax, bx\n"+
    "mov bx, ax\n"+
    "mov al, bl\n"+
    "mov ah, bh\n"+
    "mov cx, dx\n"+
    "mov eax, ebx\n"+
    "mov ecx, ebx\n"+
    "mov dl, [bx+si+56h]\n"+
    "mov [bp+si+56h], dl\n"+
    "mov [bp+si+56BEh], bx\n"+
    "mov ax, [bp+si+56h]\n"+
    "mov [bx+si+56h], bx\n"+
    "mov ax, [bx+si+56BEh]\n"+
    "mov [bx+di+56h], bx\n"+
    "mov ax, [bp+si+56BEh]\n"+
*/
    "mov ax, 56h\n"+
    "mov ax, 0FE56h\n"+
    "mov al, 56h\n"+
    "mov ch, 56h\n"+
    "mov edx, 356h\n"+
    "mov ebx, 12345678h\n"+
    "mov [bx+si+05dh], 12345678h\n"+
    "AAA"
  );
  instrs.forEach((item, i) => {
    console.log("Line: "+i.toString());
    let t = new Instruction(item.objLine, true);
    t.machineCode;
  });
}
