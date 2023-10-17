function decode(expr) {
  let result = '';
  let symbolsArr = [];
  for (let i = 0; i < expr.length; i += 10) {
    let letter = expr.slice(i, i + 10);
    symbolsArr.push(letter);
  }
  symbolsArr.forEach(symbol => symbol === '*'.repeat(10) ? result += ' ' : result += decodeLetter(symbol));
  return result;
}

function decodeLetter(letter) {
  let letterKey = '';
  for (let i = 0; i < letter.length; i += 2) {
    let symbol = letter.slice(i, i + 2);
    if (symbol === '00') continue;
    if (symbol === '10') letterKey += '.';
    if (symbol === '11') letterKey += '-';
  }
 return MORSE_TABLE[letterKey];
}