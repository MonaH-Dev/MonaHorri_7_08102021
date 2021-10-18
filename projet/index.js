const recipeCtr = document.querySelector(".TheRecipes");

function addElt(recipe) {
  let innerHTML = `<article class="recipe">
  <div class="recipePic"></div>
  <div class="recipePrev">
    <div class="recipe-prez">
      <h2>${recipe.name}</h2>
      <div class="recipe-prez__timing">
        <img
          class="recipe-prez__timing--icon"
          src="../projet/img/time.svg"
          alt="timer icon"
        />
        <p class="recipe-prez__timing--duration">${recipe.time} min</p>
      </div>
    </div>
    <div class="recipe-details">
      <div class="recipe-details__ingredient">
        <ul>`;
  for (let i = 0; i < recipe.ingredients.length; i++) {
    innerHTML += `<li>
          <strong class="OneIgdt">${recipe.ingredients[i].ingredient}</strong>: 
          ${recipe.ingredients[i].quantity || ""}${
      recipe.ingredients[i].unit || ""
    }
        </li>`;
  }
  innerHTML += `</ul>
      </div>
      <div class="recipe-details__preparation">
      ${recipe.description}
      </div>
    </div>
  </div>
  </article>
  `;
  recipeCtr.innerHTML += innerHTML;
}

//#region CARACTÈRES TAPÉS DANS LA BARRE DE RECHERCHE
console.log(recipes[0]);

const $seachField = document.querySelector(".searchbox input");
// memo : faire commencer par "$" les elt HTML
$seachField.addEventListener("input", getSearchResult);

function getSearchResult(e) {
  const searchText = e.target.value;
  if (searchText.length > 3) {
    const filterArray = [];
    for (let i = 0; i < recipes.length; i++) {
      // console.log(recipes[i]);
      if (
        recipeTextMatchWithSearchText(recipes[i].name, searchText) ||
        recipeTextMatchWithSearchText(recipes[i].description, searchText) ||
        recipeIngredientsMatchWithSearchText(recipes[i].ingredients, searchText)
      ) {
        filterArray.push(recipes[i]);
        addElt(recipes[i]);
      }
    }
  }
}

function recipeTextMatchWithSearchText(recipeText, searchText) {
  return recipeText.toLowerCase().match(searchText);
}

function recipeIngredientsMatchWithSearchText(recipeIngredients, searchText) {
  for (let i = 0; i < recipeIngredients.length; i++) {
    if (recipeIngredients[i].ingredient.toLowerCase().match(searchText)) {
      return true;
    }
  }
  return false;
}
//#endregion
