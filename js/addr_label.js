class AddrLabel {
  #name = "";
  #addr = 0x00;
  constructor (name) {
    this.#name = name;
  }
  setAddress(addr) {
    this.#addr = addr;
  }
  getRelativeAddress(startPoint) {
    return startPoint+this.#addr;
  }
  get address() {
    return this.#addr;
  }
  get name() {
    return this.#name;
  }
}
