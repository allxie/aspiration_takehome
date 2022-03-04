/*
1 . Write a function that capitalizes *only* the nth alphanumeric character of a string, so that if I hand you

  Aspiration.com

and I ask you to capitalize every 3rd character, you hand me back

  asPirAtiOn.cOm

If I ask you to capitalize every 4th character, you hand me back

  aspIratIon.cOm

Please note: 
- Characters other than each third should be downcased
- For the purposes of counting and capitalizing every three characters, consider only alphanumeric characters, ie [a-z][A-Z][0-9].
*/

const isAlphaNeumeric = (str) => /^[a-z0-9]+$/i.test(str)

const capitalizeNthLetter = (str, n) => {
  const lowerCased = str.toLowerCase();
  const casedArray = []
  let charCount = 0
  for(let i = 0; i < lowerCased.length; i++) {
    const char = lowerCased[i]
    if(isAlphaNeumeric(char)) {
      charCount ++;
      if(charCount % n === 0) {
        casedArray.push(lowerCased[i].toUpperCase())
        continue;
      }
    } 
    
    casedArray.push(lowerCased[i])
  }

  return casedArray.join('')
}

console.log(capitalizeNthLetter('hello, Dave', 3)) // 'heLlo, DavE'
console.log(capitalizeNthLetter('hello, Dave', 2)) // 'hElLo, DaVe'
console.log(capitalizeNthLetter(',,,,,', 2)) // ',,,,,'
console.log(capitalizeNthLetter('NOT BIG', 0)) // 'not big'
console.log(capitalizeNthLetter('not small', 1)) // 'NOT SMALL'
