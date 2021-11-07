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
let filteredRecipes;
const blockIds = ["ingredientsBlock", "appareilBlock", "ustensilesBlock"];
// On écoute la valeur entrée dans la barre de recherche :
$seachField.addEventListener("input", function (e) {
  //console.log("New input");
  // 1 - Mettre a jour les recettes selon l'input (+ les tags)
  updateSearchResult(e.target.value);
  // 2 - Mettre a jour les Asf selon la liste de recettes affichée
  blockIds.forEach((id) => {
    updateAdvancedSearchField(id);
  });
  //console.log("Event flag");
});

// Mets a jour les recettes selon l'input
function updateSearchResult(inputTxt = "") {
  if (inputTxt.length >= 3 || inputTxt == "") {
    recipeCtr.innerHTML = "";
    filteredRecipes = [];
    for (let i = 0; i < recipes.length; i++) {
      // console.log(recipes[i]);
      if (
        // Si test = "Mot" & "" --> Match = true
        recipeTextMatchWithSearchText(recipes[i].name, inputTxt) ||
        recipeTextMatchWithSearchText(recipes[i].description, inputTxt) ||
        recipeIngredientsMatchWithSearchText(recipes[i].ingredients, inputTxt)
      ) {
        addElt(recipes[i]);
        filteredRecipes.push(recipes[i]);
      }
    }
    // console.log("Filtered Recipes ", filteredRecipes);
  }
}
// Fonctions de vérifs (nom et description), avec 2 paramètres,
// le 2nd est mis en minuscule, puis comparé au 1er :
function recipeTextMatchWithSearchText(recipeText, searchText) {
  return recipeText.toLowerCase().match(searchText); // -> boolean
}
// Pour la vérif. des ingrédients, on crée un boucle :
function recipeIngredientsMatchWithSearchText(recipeIngredients, searchText) {
  //console.log("Recipe ingredients", recipeIngredients);
  for (let i = 0; i < recipeIngredients.length; i++) {
    if (recipeIngredients[i].ingredient.toLowerCase().match(searchText)) {
      return true;
    }
  }
  return false;
}

// Premier lancement de la fonction :
// c'est la fonction par défaut,
updateSearchResult();
console.log("Start flag");

//#endregion

//#region VISUALISATION DES LISTES / FILTRES

const $listCtr = document.querySelector("#ingredientsList");
const $allChevrons = document.querySelectorAll(".chevron");
$allChevrons.forEach((ch) =>
  ch.addEventListener("click", function (e) {
    console.log("Chevron clicked");
    let parentBlockId = e.target.closest(".Block").id;
    console.log(parentBlockId);
    updateAdvancedSearchField(parentBlockId);
  })
);

// Mets a jour les asf selon la liste de recettes ("filteredRecipes")
function updateAdvancedSearchField(blockId) {
  // 1 - Récuperer une liste de données en fonction du type d'input ( ingredients, appareils, ustensils )
  let rawData = [];
  switch (blockId) {
    case "ingredientsBlock":
      filteredRecipes.forEach((r) => {
        rawData.push(...r.ingredients.map((i) => i.ingredient));
        // "..." permet de recuperer le contenu du tableau plutot que le tableau lui meme
      });
      break;
    case "appareilBlock":
      filteredRecipes.forEach((r) => {
        rawData.push(r.appliance);
      });
      break;
    case "ustensilesBlock":
      filteredRecipes.forEach((r) => {
        rawData.push(...r.ustensils);
      });
      break;
  }
  // 2 - Nettoyer la liste ( pas de doublons )
  let data = new Set(rawData);
  //console.log(`Updating ${blockId}`, data);

  // 3 - Peupler le champs de recherche avancée correspondant
  populateAsf(blockId, data);
}

// Peupler un block ASF (selon blockID)
// blockID : string servant à identifier le block à màj
// asfData : liste de données selon le block à màj = set(rawData)
function populateAsf(blockId, asfData) {
  //--------- si besoin de conversion : -------------
  // const dataList = [...asfData];
  // console.log("DataList ", dataList);
  // console.log("DataList with ... --> ", [...asfData]);
  //const dL = [asfData[0],asfData[1],asfData[2]] soit un tableau de 30 elt
  //Versus :
  // const dl2 = [asfData];
  // console.log("DataList without ... --> ", [asfData]);
  //const dl2 = soit un tableau avec 1 seul elt (1tableau), contenant lui-même 30 elt
  //--------- fin de conversion -------------------

  // 1 - Recuperer l'element HTML (div) qui va contenir les données (ingredients, appareils, ustensils)
  let $asfRoot;
  if (blockIds.includes(blockId)) {
    $asfRoot = document.querySelector(`.${blockId} .asfList`);
  }
  // 2 - Vider l'element div (.asfList)
  $asfRoot.innerHTML = "";

  // 3 - Ajouter des elements a notre div (.asfList)
  let htmlToInject = "";
  asfData.forEach((data) => {
    // console.log("DL = ", data);
    htmlToInject += `<a href="#">${data}</a>`;
  });

  $asfRoot.innerHTML += htmlToInject;

  // Ajouter un event sur chaque lien contenu dans un asfList
  // 1 - Recuperer tous les liens de l'ASF list courant
  let $asfLinks = document.querySelectorAll(`.${blockId} .asfList a`);
  // 2 - Ajouter un evenement sur chaque lien
  $asfLinks.forEach((link) =>
    link.addEventListener("click", function (e) {
      console.log("Click on asf element", link);
    })
  );
}

//#endregion

//#region CHANGE THE PLACEHOLDER
let $rechercherDsList = document.querySelector(".Block");
placeholderText = document.querySelector('[placeholder="Ingrédients"]');
function ph() {
  placeholderText.setAttribute("placeholder", "Ingrédients");
}
function phr() {
  placeholderText.setAttribute("placeholder", "Recherche un ingrédient");
}
$rechercherDsList.addEventListener("mouseover", phr);
$rechercherDsList.addEventListener("mouseout", ph);
//#endregion

//#region

//#endregion
