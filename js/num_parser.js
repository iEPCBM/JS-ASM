/**
 * Checked.
 */

/**
 * Radix dictionary
 * @type {Object}
 */
radixes = {
  "b": 2,
  "o": 8,
  "h": 16,
  "d": 10,
  "x": 32
};

/**
 * Is numeric the value in the following radix.
 * @param  {String}  value number as string
 * @param  {Number}  radix radix (from 2 to 36)
 * @return {Boolean}       true - value is numeric, false - value is not numeric
 */
function isNumeric(value, radix) {
  let regexp;
  if (radix<=1||radix>36) return false;
  if (radix<=10) {
    regexp = RegExp("[0-"+(radix-1).toString()+"]+", "i");
  }
  else {
    regexp = RegExp("[0-9a-"+String.fromCharCode(radix-11+"a".charCodeAt(0))+"]+", "i");
  }
  return value.match(regexp)!==null?value.match(regexp)[0]===value:false;
}

function str2number(str) {
  str = str.trim();
  str = str.toLowerCase();
  let rval;
  let base = str.slice(-1);
  if (base in radixes&&isNumeric(str.slice(0, -1), radixes[base])) {
    strNum = str.slice(0, -1);
    rval = parseInt(strNum, radixes[base]);
  }
  else if (isNumeric(str, 10)) {
    rval = parseInt(str, 10);
  }
  else {
    rval = NaN;
  }
  return rval;
}
