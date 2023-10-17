module.exports = function toReadable(number) {
  if (!Number.isFinite(number)) return 'Enter a number!';
  if (number < 0 || number > 999) return 'Enter a number from 0 to 999';
  switch ((number + '').length) {
    case 1: return _handleDigits(number);
    case 2: return _handleDozens(number);
    case 3: return _handleHundreds(number);
  }
}

function _handleDigits(number) {
  switch (number) {
    case 0: return 'zero';
    case 1: return 'one';
    case 2: return 'two';
    case 3: return 'three';
    case 4: return 'four';
    case 5: return 'five';
    case 6: return 'six';
    case 7: return 'seven';
    case 8: return 'eight';
    case 9: return 'nine';
  }
}

function _handleDozens(number) {
  if (number === 0) return '';
  if (number < 10) return _handleDigits(number);
  let [dozen, unit] = Number(number).toString();
  if (number < 20) {
    switch (number) {
      case 10: return 'ten';
      case 11: return 'eleven';
      case 12: return 'twelve';
      case 13: return 'thirteen';
      case 15: return 'fifteen';
      case 18: return 'eighteen';
      case 14:
      case 16:
      case 17:
      case 19:
        return _handleDigits(+unit) + 'teen';
    }
  }
  if (number >= 20 && unit === '0') {
    switch (number) {
      case 20: return 'twenty';
      case 30: return 'thirty';
      case 40: return 'forty';
      case 50: return 'fifty';
      case 80: return 'eighty';
      case 60:
      case 70:
      case 90: return _handleDigits(+dozen) + 'ty';
    }
  } else {
    return _handleDozens(Number(dozen + 0)) + ' ' + _handleDigits(+unit);
  }
}

function _handleHundreds(number) {
  const stringNumber = Number(number).toString();
  const result = _handleDigits(+stringNumber[0]) + ' hundred ' + _handleDozens(+(stringNumber[1] + stringNumber[2]));
  return result.trimEnd();
}