const recipeCtr = document.querySelector(".TheRecipes");

//#region CONSOLE.LOG

// recipes[0].ingredients[3].unit;
// console.log(recipes[0].ingredients[3].unit);

//#endregion

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

// memo : faire commencer par "$" les elt HTML
const $seachField = document.querySelector(".searchbox input");

// On écoute la valeur entrée dans la barre de recherche :
$seachField.addEventListener("input", function (e) {
  getSearchResult(e.target.value);
  console.log("Event flag");
});

function getSearchResult(inputTxt = "") {
  if (inputTxt.length >= 3 || inputTxt == "") {
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
// Fonctions de vérifs (nom et description), avec 2 paramètres,
// le 2nd est mis en minuscule, puis comparé au 1er :
function recipeTextMatchWithSearchText(recipeText, searchText) {
  return recipeText.toLowerCase().match(searchText); // -> boolean
}
// Pour la vérif. des ingrédients, on crée un boucle :
function recipeIngredientsMatchWithSearchText(recipeIngredients, searchText) {
  console.log("Recipe ingredients", recipeIngredients);
  for (let i = 0; i < recipeIngredients.length; i++) {
    if (recipeIngredients[i].ingredient.toLowerCase().match(searchText)) {
      return true;
    }
  }
  return false;
}

// Premier lancement de la fonction :
// c'est la fonction par défaut,
getSearchResult();
console.log("Start flag");

//#endregion

//#region VISUALISATION DES LISTES / FILTRES
// ---------------------------- 1er essai
// function showLists() {
//   document.getElementById("ingredientsList").classList.add("show");
// }

let $rechercherDsList = document.querySelector(".Block");

// if ($rechercherDsList) {
// $rechercherDsList.addEventListener("click", showLists());
// }
// ---------------------------- 1er essai </

// ---------------------------- 2e essai
$rechercherDsList.addEventListener("mouseover", show_hide);
function show_hide() {
  var showElt = document.getElementById("ingredientsList");
  if (showElt.style.display === "none") {
    showElt.style.display = "flex";
  } else {
    showElt.style.display = "none";
  }
}
// ---------------------------- 2e essai </

// $rechercherDsList.addEventListener("mouseover", show);

// function show() {
//   var showElt = document.getElementById("ingredientsList");
//   {
//     showElt.style.display = "block";
//   }
// }

//#endregion

//#region CHANGE THE PLACEHOLDER
placeholderText = document.querySelector('[placeholder="Ingrédients"]');
function ph() {
  placeholderText.setAttribute("placeholder", "Recherche un ingédient");
}
function phr() {
  placeholderText.setAttribute("placeholder", "Ingrédients");
}
$rechercherDsList.addEventListener("mouseover", ph);
$rechercherDsList.addEventListener("mouseout", phr);
//#endregion

//#region

//#endregion
