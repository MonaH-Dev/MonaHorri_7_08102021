console.log(recipes[0]);

const test = "chocolat";

const filterArray = [];
for (let i = 0; i < recipes.length; i ++) {
  // console.log(recipes[i]);
 if (recipes[i].name.toLowerCase().match(test)) {
  filterArray.push(recipes[i])
 }
}
console.log(filterArray)
