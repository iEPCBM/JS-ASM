radixes = {
  "b": 2,
  "o": 8,
  "h": 16,
  "d": 10
};

function isNumeric(value, radix) {
  let regexp;
  if (radix<=0||radix>36) return false;
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
