/*
Implement the DoubleSet data structure described below.

A DoubleSet is a collection whose members are integers, and who can have one or two of each member. We express them below in maplike notation, ie the DoubleSet that has two 1s, one -3, and one 0 is represented as

  {{1: 2}, {-3: 1}, {0: 1}}

If a DoubleSet has two of member 1, adding a third would result in an identical DoubleSet. If a DoubleSet has zero of member 3, subtracting a 3 would likewise result in an identical DoubleSet.

We add two DoubleSets by adding each of their members, each of whose count can be no greater than two:

doubleSetOne has members

  {{1: 2}, {2: 1}}

and doubleSetTwo has members

  {{1: 1}, {2: 1}, {-3: 1}}

their sum is

  {{1: 2}, {2: 2}, {-3: 1}}

We subtract two DoubleSets by subtracting each of their counts, where elements whose counts fall below one are omitted from the difference entirely:

doubleSetOne has members

   {{1: 2}, {2: 1}, {4: 1}}

and doubleSetTwo has members

  {{1: 1}, {2: 2}, {-3: 1}}

their difference is

  {{1: 1}, {4: 1}}

*/

class DoubleSet {
  constructor(doubleSetString) {
    if(!doubleSetString) return;
    DoubleSet.#validateDoubleSetsString(doubleSetString);
    const sets = DoubleSet.#getSetArraysFromString(doubleSetString);
    sets.forEach((set) => this.setMember(...set))
  }

  get() {
    return this.#stringify()
  }

  getCount(member) {
    return this[DoubleSet.#getMemberKey(member)] || 0
  }

  getMembers() {
    return Object.keys(this).map((key) => key.slice(1))
  }

  setMember(member, count) {
    // Validation for using this as a public setter
    DoubleSet.#validateMember(member);
    DoubleSet.#validateCount(count);
    
    this[DoubleSet.#getMemberKey(member)] = count;
    return this
  }

  deleteMember(member) {
    delete this[DoubleSet.#getMemberKey(member)]
  }

  #stringify() {
    const sets = Object.entries(this);
    const setStrings = sets.map((set) => {
      const member = DoubleSet.#serializeMemberKey(set[0])
      const count = set[1]
      return `{${member}: ${count}}`
    })
    return `{${setStrings.join(', ')}}`;
  }

  /* Static Methods */

  // Math Methods
  static add(setOne, setTwo) {
    DoubleSet.#validateInstance(setOne)
    DoubleSet.#validateInstance(setTwo)

    const addedSet = new DoubleSet();
    for (const member of setOne.getMembers()) {
      const countOne = setOne.getCount(member);
      const countTwo = setTwo.getCount(member) || 0;
      const addedCounts = Math.min(countOne + countTwo, 2)
      addedSet.setMember(member, addedCounts)
    }

    for (const member of setTwo.getMembers()) {
      if(!setOne.getCount(member)) {
        addedSet.setMember(member, setTwo.getCount(member))
      }
    }
  
    return addedSet
  }

  static subtract (setOne, setTwo) {
    if(![setOne, setTwo].every((set) => set instanceof DoubleSet)) {
      throw new Error("Can only operate on two DoubleSet datatypes");
    }  
    
    const subtractedSet = new DoubleSet();
    for (const member of setOne.getMembers()) {
      const countOne = setOne.getCount(member);
      const countTwo = setTwo.getCount(member) || 0;
      const subtracted = countOne - countTwo
      if(subtracted > 0) {
        subtractedSet.setMember(member, subtracted)
      }
    }

    return subtractedSet
  }

  // String Parsing
  static #getSetArraysFromString (doubleSetString) {
    const setsArray = doubleSetString
      .replace(/\s/g, '') // remove whitespace
      .slice(1, -1) // remove '{}' wrapper 
      .split(',') // create array of separate sets

    return setsArray.map((setString) => {
      const colonIndex = setString.indexOf(':')
      const member = setString.slice(1, colonIndex);
      const count = Number(setString.slice(colonIndex + 1, -1));
      return [member, count]
    })
  }

  static #getMemberKey(member) {
    return `#${member}`
  }

  static #serializeMemberKey(memberKey) {
    return memberKey.slice(1)
  }

  // Validation Methods
  static #validateDoubleSetsString(doubleSetString) {
    const noWhitespaceStringCopy = doubleSetString.replace(/\s/g, '')

    // This Regexp tests for format: "{{1,1},{-10,2}}"
    // Members can be any integer.
    // Any number of sets can be supplied.
    // -0 is not valid
    // @TODO: are there product requirements around max size?
    const doubleSetInputRegexp = /^{({(0|-?[1-9][0-9]*?):[1-2]},)*({(0|-?[1-9][0-9]*?):[1-2]})*}$/gm
    if(!doubleSetInputRegexp.test(noWhitespaceStringCopy)) {
      throw new Error('Please supply DoubleSet as a string in the format of "{{-1, 1}, {0, 2}}"')
    }
  }
  
  static #validateMember(member) {
    if(isNaN(member) || !Number.isInteger(Number(member))) {
      throw new Error('Please make sure all members are integers');
    }
  }

  static #validateCount(count) {
    if(count !== 1 && count !== 2) throw new Error('Count must be 1 or 2.')
  }

  static #validateInstance(set) {
    if(!set instanceof DoubleSet) throw new Error('Can only operate on DoubleSet datatypes')
  }
}

/*  ~~~  Testing  ~~~  */

const myNewSet = new DoubleSet('{{5: 2}, {3: 1}, {-3: 1}}');
const myNewSet2 = new DoubleSet('{{5: 1}, {3: 1}, {-1: 1}}');

console.log(myNewSet.get())
const addedSet = DoubleSet.add(myNewSet, myNewSet2);
console.log("Added: ", addedSet.get()); // {{3: 2}, {5: 2}, {-3: 1}, {-1: 1}}

const subtractedSet = DoubleSet.subtract(myNewSet, myNewSet2);
console.log("Subtracted: ", subtractedSet.get()); // {{5: 1}, {-3: 1}}

const setInitializedEmpty = new DoubleSet();
console.log(setInitializedEmpty.get()); // {}
setInitializedEmpty
  .setMember(4, 2)
  .setMember(-5, 2) // chaining

console.log(setInitializedEmpty.get()); // {{4: 2}, {-5, 2}}


// setInitializedEmpty.setMember('a', 2); // error
// setInitializedEmpty.setMember(1, 3);   // error
// setInitializedEmpty.setMember(1, 'a'); // error

delete setInitializedEmpty['-5'] // doesn't work-- members are private (set with #)
console.log(setInitializedEmpty.get()); // {{4: 2}, {-5, 2}}

setInitializedEmpty.deleteMember(-5) // does work
console.log(setInitializedEmpty.get());//{{4: 2}}
console.log(setInitializedEmpty.getCount(4)); // 2
console.log(setInitializedEmpty.getCount(11)); // 0
