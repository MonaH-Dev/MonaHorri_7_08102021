console.log(recipes[0]);

const $seachField = document.querySelector(".searchbox input");
// memo : faire commencer par "$" les elt HTML
$seachField.addEventListener('input', getSearchResult)

function getSearchResult (e) {
  const searchText = e.target.value;
  if (searchText.length > 3) {
    const filterArray = [];
    for (let i = 0; i < recipes.length; i ++) {
      // console.log(recipes[i]);
      if (recipeTextMatchWithSearchText(recipes[i].name, searchText) ||
      recipeTextMatchWithSearchText(recipes[i].description, searchText) ||
      recipeIngredientsMatchWithSearchText(recipes[i].ingredients, searchText) ) {
        filterArray.push(recipes[i])
      }
    }
    console.log(filterArray)
  }
}


function recipeTextMatchWithSearchText (recipeText, searchText) {
  return recipeText.toLowerCase().match(searchText)
}

function recipeIngredientsMatchWithSearchText (recipeIngredients, searchText) {
  for (let i = 0; i < recipeIngredients.length; i ++) {
    if (recipeIngredients[i].ingredient.toLowerCase().match(searchText)) {
      return true;
    }
  }  
  return false;
}