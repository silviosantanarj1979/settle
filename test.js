const arr = [
  {
    value: "Charlie",
    interest_id: 1
  },
  {
    value: "Nicole",
    interest_id: 2
  },
  {
    value: "Swimming",
    interest_id: 3
  },
  {
    value: "Skiing",
    interest_id: 4
  }
];
const z = "I'm sure friendName would agree! Close friends and petName support you and like you for who you are, the outcome of this test does not affect that."

// const interestValues = arr.map(obj => {
//   return [obj.interest_id, obj.value];
// });

const personalizeText = function(arr, text) {
  let newText = text
  
  for (const interest of arr) {
    let userValue = interest.value;
    
    switch (interest.interest_id) {
      case 1:
        const regex = /petName/;
        newText = newText.replace(regex, userValue);
        break;
      case 2:
        const regex1 = /friendName/;
        newText = newText.replace(regex1, userValue);
        break;
      case 3:
        const regex2 = /hobbyName/;
        newText = newText.replace(regex2, userValue);
        break;
      case 4:
        const regex3 = /sportName/;
        newText = newText.replace(regex3, userValue);
        break;
    }
  }
  return newText
};

console.log(personalizeText(arr, z))
// const regex = /friendName/
// const val = 'wow'
// console.log(z)
// console.log(z.replace(regex, val))