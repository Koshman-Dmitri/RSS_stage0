function check(str, bracketsConfig) {
  if (str.length % 2 !== 0) return false;
  
  let myStr = '';
  let curOpen = '';
  let expectClose = '';
  let mask = {
    open: [],
    close: [],
    equal: [],
  }
  
  for (let el of bracketsConfig) {
    mask.open.push(el[0]);
    mask.close.push(el[1]);
    if ( el[0] === el[1] ) mask.equal.push(el[0]);
  }
  
  function init() {
    curOpen = myStr.at(-1);
    expectClose = mask.close[mask.open.indexOf(curOpen)];
  }

  for (let el of str) {
    if ( mask.open.includes(el) && (curOpen !== el || !mask.equal.includes(el)) ) {
      myStr += el;
      init();
      continue;
    }

    if ( mask.close.includes(el) ) {
      if ( el === expectClose ) {
        myStr = myStr.slice(0, -1);
        init();
      } else {
        return false;
      }
    }

  }
  return myStr === '' ? true : false;
}