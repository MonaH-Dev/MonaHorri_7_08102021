const recipeCtr = document.querySelector(".TheRecipes");

//#region FONCTION TO ADD HTML (in TheRecipes)
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
//#endregion

//#region CARACTÈRES TAPÉS DANS LA BARRE DE RECHERCHE
console.log(recipes[0]);

// memo : faire commencer par "$" les elt HTML
const $seachField = document.querySelector(".searchbox input");

$seachField.addEventListener("input", function (e) {
  getSearchResult(e.target.value);
  console.log("Event flag");
});

getSearchResult();

function getSearchResult(inputTxt = "") {
  if (inputTxt.length > 3 || inputTxt == "") {
    recipeCtr.innerHTML = "";
    for (let i = 0; i < recipes.length; i++) {
      // console.log(recipes[i]);
      if (
        // Si test = "Mot" & "" --> Match = true
        recipeTextMatchWithSearchText(recipes[i].name, inputTxt) ||
        recipeTextMatchWithSearchText(recipes[i].description, inputTxt) ||
        recipeIngredientsMatchWithSearchText(recipes[i].ingredients, inputTxt)
      ) {
        addElt(recipes[i]);
      }
    }
  }
}

function recipeTextMatchWithSearchText(recipeText, searchText) {
  return recipeText.toLowerCase().match(searchText); // -> boolean
}

function recipeIngredientsMatchWithSearchText(recipeIngredients, searchText) {
  for (let i = 0; i < recipeIngredients.length; i++) {
    if (recipeIngredients[i].ingredient.toLowerCase().match(searchText)) {
      return true;
    }
  }
  return false;
}
// Premier lancement
getSearchResult();
//console.log("Start flag");

//#endregion VISUALISATION DES LISTES / FILTRES
// ---------------------------- 1er essai
// function showLists() {
//   document.getElementById("ingredientsList").classList.add("show");
// }

let $rechercherDsList = document.querySelector("#Block");

// if ($rechercherDsList) {
// $rechercherDsList.addEventListener("click", showLists());
// }
// ---------------------------- 1er essai </
$rechercherDsList.addEventListener("click", show_hide);
function show_hide() {
  var click = document.getElementById("ingredientsList");
  if (click.style.display === "none") {
    click.style.display = "block";
  } else {
    click.style.display = "none";
  }
}

//#region

//#endregion

//#region

//#endregion

//#region

//#endregion
