//#region CONSTANTES ET VARIABLES
// memo : faire commencer par "$" les elt HTML
const $recipeCtr = document.querySelector(".TheRecipes"); //Ctr des recettes
let currentTags = []; //Tags actifs
let currentIngTags = []; //Tags actifs Ing
let currentUstTags = []; //Tags actifs Use
let currentAplTags = []; //Tags actifs Apl
let mainTextInput = ""; //Texte dans la barre de recherche
let tagSectionToDisplay = "";
const $searchField = document.querySelector(".searchbox input"); //Barre de recherche
let filteredRecipes; //recettes filtrées
const blockIds = ["ingredientsBlock", "appareilBlock", "ustensilesBlock"]; //tableau avec l'ID de chaque liste
const $allChevrons = document.querySelectorAll(".chevron"); //tous les chevrons
const $allBlocks = document.querySelectorAll(".Block"); //tous les blocks
//#endregion

//#region EVENT - BARRE DE RECHERCHE
// On écoute la valeur entrée dans la barre de recherche :
$searchField.addEventListener("input", function (e) {
  //console.log("New input");
  mainTextInput = e.target.value;

  // 1 - Mettre a jour les recettes selon l'input (+ les tags)
  updateSearchResult(mainTextInput);
  // 2 - Mettre a jour les Asf selon la liste de recettes affichée
  updateAllAdvancedSearchFields();
  //console.log("Event flag");
});
//#endregion

//#region EVENT - CHEVRONS
$allChevrons.forEach((ch) =>
  ch.addEventListener("click", function (e) {
    // console.log("Chevron clicked");
    let parentBlockId = e.target.closest(".Block").id;

    if (tagSectionToDisplay === parentBlockId) {
      tagSectionToDisplay = "";
      document.querySelector(`#${parentBlockId} .asfList`).style.visibility =
        "hidden";
    } else {
      if (tagSectionToDisplay) {
        document.querySelector(
          `#${tagSectionToDisplay} .asfList`
        ).style.visibility = "hidden";
      }
      tagSectionToDisplay = parentBlockId;
      document.querySelector(`#${parentBlockId} .asfList`).style.visibility =
        "visible";
    }
    // updateAdvancedSearchField(parentBlockId);
  })
);

//#endregion

//#region FONCTION - Met a jour les recettes selon l'input et les tags
// Mets a jour les recettes selon l'input
function updateSearchResult(inputTxt = "") {
  // filteredRecipes = recipes.filter(recipe => {
  //   if(recipeMatchingWithTagsAndSearch(recipe, inputTxt)) {
  //    addElt(recipe);
  //    return true;
  //   }
  // });

  // console.log("Refresh UI");
  if (currentTags.length > 0 || inputTxt.length >= 3 || inputTxt == "") {
    $recipeCtr.innerHTML = "";
    filteredRecipes = [];
    document.getElementById("msgaide").style.display = "none";
    for (let i = 0; i < recipes.length; i++) {
      let matching = false;
      // 2 - Verification match avec tags -----------------------------------
      if (recipeMatchingWithTagsAndSearch(recipes[i], inputTxt)) {
        //console.log(`Tags matchings with`, recipes[i]);
        matching = true;
      }
      // 3 - Si match avec searchBar ou tags --> Afficher la recette
      if (matching) {
        // console.log("Ok");
        addElt(recipes[i]);
        filteredRecipes.push(recipes[i]);
      }
    } // console.log("Filtered Recipes ", filteredRecipes);
  }
  if (filteredRecipes.length == 0) {
    document.getElementById("msgaide").style.display = "block";
  }
}
// Premier lancement de la fonction :
// c'est la fonction par défaut,
updateSearchResult();
// console.log("Start flag");
//#endregion

//#region FONCTIONS - MATCHING
// Fonctions de vérifs (nom et description) ---------------------
// avec 2 paramètres, le 2nd est mis en minuscule, puis comparé au 1er
// Retourne true si l'input searchTxt correspond a la recette courante
function recipeTextMatchWithSearchText(recipeText, searchText) {
  let match = recipeText.toLowerCase().match(searchText);
  //if (match) console.log(`${recipeText} matching with "${searchText}"`);
  return match;
}
function recipeIngredientsMatchWithSearchText(recipeIngredients, searchText) {
  let match = false;
  recipeIngredients.forEach((ing) => {
    if (ing.ingredient.toLowerCase().match(searchText)) {
      //console.log(`"${searchText}" matching with `, recipeIngredients);
      match = true;
    }
  });
  return match;
}

// Retourne le nombre de tags affichées --------------------
function currentTagsCount() {
  let count = 0;
  count +=
    currentIngTags.length + currentAplTags.length + currentUstTags.length;
  return count;
}

// Fonction globale --------------------------------------------------
// Retourne vrai si la recette match avec tous les tags courant + la barre de recherche
function recipeMatchingWithTagsAndSearch(recipe, inputText = "") {
  let match = false;
  let score = 0;
  // 1 - Calcul du score attendu
  let targetScore =
    currentTagsCount() +
    //(inputTxt.length >= 3 ? 1 : 0) // Version opération ternaire
    (inputText.length >= 3 && 1); // Si input search bar est >= a 3, on ajout 1 au calcul

  // Verif pour les 3 types de tags
  // 1 - Verif des ingredients
  // 1a - Parcours des ingredients de la recette courante
  recipe.ingredients.forEach((ing) => {
    // 1b - Si la liste des tags d'ings courants (currentIngTags) contient un des ingredients de la recette courante (recipe) --> match
    if (currentIngTags.includes(ing.ingredient)) {
      //console.log(`Match with ingredient tag --> ${ing.ingredient}`);
      score++;
    }
  });
  // 2 - Verif des Appareils
  // 2b - Si la liste des tags d'apl courants contient un des appareil de la recette courante (recipe) --> match
  if (currentAplTags.includes(recipe.appliance)) {
    //console.log(`Match with appareil tag --> ${recipe.appliance}`);
    score++;
  }
  // 3 - Verif des Ustencils
  // 3b - Si la liste des tags d'ust courants contient un des ustencils de la recette courante (recipe) --> match
  recipe.ustensils.forEach((ust) => {
    if (currentUstTags.includes(ust)) {
      //console.log(`Match with ustencil tag --> ${ust}`);
      score++;
    }
  });

  // 4 - Verif avec le text search bar
  if (
    inputText.length >= 3 &&
    recipeTextMatchWithSearchText(recipe.description + recipe.name, inputText)
  ) {
    if (score == targetScore - 1) {
      //console.log(`Match search bar input --> ${recipe.name}`);
      score++;
    }
  }
  if (targetScore == score) match = true;
  // if (match) console.log(`Matching with ${recipe.name}`);
  return match;
}
//#endregion

//#region FONCTION - To add HTML (in TheRecipes)
function addElt(recipe) {
  let innerHTML = `<article class="recipe">
  <div class="recipePic"></div>
  <div class="recipePrev">
    <div class="recipe-prez">
      <h2>${recipe.name}</h2>
      <div class="recipe-prez__timing">
        <img
          class="recipe-prez__timing--icon"
          src="./img/time.svg"
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
  $recipeCtr.innerHTML += innerHTML;
}
//#endregion

//#region FONCTION - Met a jour les ASF selon la liste de recettes

function updateAllAdvancedSearchFields() {
  blockIds.forEach((id) => {
    updateAdvancedSearchField(id);
  });
}

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
//#endregion

//#region VISUALISATION DES LISTES / FILTRES

// Peupler un block ASF (selon blockID)
// blockID : string servant à identifier le block à màj
// asfData : liste de données selon le block à màj = set(rawData)
function populateAsf(blockId, asfData) {
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
  let $asfTags = document.querySelectorAll(`.${blockId} .asfList a`);
  const $tagsCtr = document.querySelector(".tags");
  // 2 - Ajouter un evenement sur chaque lien
  $asfTags.forEach((tagLink) =>
    tagLink.addEventListener("click", function (e) {
      switch (blockId) {
        case "ingredientsBlock":
          currentIngTags.push(tagLink.innerText);
          // console.log("Ing tags = ", currentIngTags);
          break;
        case "appareilBlock":
          currentAplTags.push(tagLink.innerText);
          // console.log("Aps tags = ", currentAplTags);
          break;
        case "ustensilesBlock":
          currentUstTags.push(tagLink.innerText);
          // console.log("Ust tags = ", currentUstTags);
          break;
      }
      //console.log("Aps tags = ");
      //console.log("Click on asf element", link);

      // 1 - Recuperer le text du lien
      let tagName = tagLink.textContent;

      // 1b - Verifier si le tag est deja actif, si oui arreter l'execution ici (return)
      // find => Cherche un element dans une liste donnée qui correspond aux criteres
      if (currentTags.find((t) => t.innerText === tagName)) return;

      // 2 - Créer un nouveau tag
      let $tag = document.createElement("div");
      const color = "color-" + blockId;
      $tag.className = "tag " + color;
      $tag.innerHTML = `
      <div class="tag-txt">${tagName}</div>
      `;

      // 3 - Creer le button close du tag
      let $tagCloseBtn = document.createElement("img");
      $tagCloseBtn.className = "tag-img";
      $tagCloseBtn.src = "./img/cross.svg";
      $tagCloseBtn.alt = "closetag";

      // 4 - Ajouter le bt close au tag precedemment crée
      $tag.appendChild($tagCloseBtn);

      // 5 - Ajouter un event pour le tag créé (Close btn)
      $tagCloseBtn.addEventListener("click", function (e) {
        // 5a - Identifier la liste a modifier
        switch (blockId) {
          case "ingredientsBlock":
            currentIngTags = currentIngTags.filter((ing) => ing != tagName);
            // console.log("Ing tags = ", currentIngTags);
            break;
          case "appareilBlock":
            currentAplTags = currentAplTags.filter((apl) => apl != tagName);
            // console.log("Apl tags = ", currentAplTags);
            break;
          case "ustensilesBlock":
            currentUstTags = currentUstTags.filter((ust) => ust != tagName);
            // console.log("Ust tags = ", currentUstTags);
            break;
        }
        $tag.remove();
        updateSearchResult(mainTextInput, true);
        updateAdvancedSearchField(blockId);
        // filter : supprime dans une liste les elements ne correspondants pas aux criteres
        //currentTags = currentTags.filter((ct) => ct != $tag);
      });

      // 6 - Ajouter le tag a son conteneur (div)
      $tagsCtr.appendChild($tag);
      // 7 - Ajouter la reference du tag a la liste globale ()
      currentTags.push($tag);
      updateSearchResult(mainTextInput);
      updateAllAdvancedSearchFields();
    })
  );
}
//#endregion

//#region CHANGE THE PLACEHOLDER
function changeTagPlaceholder([blockId, placeholder]) {
  // Soucis ici avec le QuerySelector :
  let $rechercherDsList = document.querySelector(`#${blockId}`);
  const placeholderText = document.querySelector(`[name="${blockId}"]`);
  function ph() {
    placeholderText.setAttribute("placeholder", placeholder);
  }
  function phr() {
    placeholderText.setAttribute("placeholder", "Recherche un " + placeholder);
  }
  $rechercherDsList.addEventListener("mouseover", phr);
  $rechercherDsList.addEventListener("mouseout", ph);
}

let tagSections = [
  ["ingredientsBlock", "Ingrédients"],
  ["appareilBlock", "Appareil"],
  ["ustensilesBlock", "Ustensiles"],
];

tagSections.forEach((tagsec) => {
  changeTagPlaceholder(tagsec);
  changeTagDisplayWithAsfSearch(tagsec[0]);
});

function changeTagDisplayWithAsfSearch(blockId) {
  let $block = document.querySelector(`#${blockId}`);
  let $input = $block.querySelector("input");
  $input.addEventListener("input", function (e) {
    let $asflistItems = $block.querySelectorAll(".asfList a");
    const textValue = e.target.value;
    for (let i = 0, l = $asflistItems.length; i < l; i++) {
      if ($asflistItems[i].innerText.toLowerCase().match(textValue)) {
        $asflistItems[i].style.display = "block";
      } else {
        $asflistItems[i].style.display = "none";
      }
    }
  });
}

//#endregion

//#region vdfvdv

//#endregion

updateAllAdvancedSearchFields();
document.querySelectorAll(`.asfList`).forEach((element) => {
  element.style.visibility = "hidden";
});
