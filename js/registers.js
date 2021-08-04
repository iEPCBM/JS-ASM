/**
 * Register class
 */
class Register {
  #name;
  /**
   * Register's constructor
   * @param {[type]} strName name of register (AX, BL, SI, EAX, etc.)
   */
  constructor(strName) {
    this.name = strName.toUpperCase();
  }
  /**
   * Returns size
   * @return {number} size (8,16 or 32). undefined - error
   */
  get size() {
    if (typeof(this.name)==="string") {
      if (this.name[0]==='E') {
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

  get name() {
    return this.name;
  }

  get registerOrder() {

  }

  /**
   * isValidRegister Register validation. For avoid mistakes in future call
   * this method before define Register object.
   * @return {Boolean} true - valid; false - invalid.
   */
  static isValidRegister () {

  }
}
