//#region CONSTANTES ET VARIABLES
// memo : faire commencer par "$" les elt HTML
const $recipeCtr = document.querySelector(".TheRecipes"); //Ctr des recettes
let currentTags = []; //Tags actifs
let currentIngTags = []; //Tags actifs Ing
let currentUstTags = []; //Tags actifs Use
let currentAplTags = []; //Tags actifs Apl
let mainTextInput = ""; //Texte dans la barre de recherche
const $seachField = document.querySelector(".searchbox input"); //Barre de recherche
let filteredRecipes = []; //recettes filtrées
const blockIds = ["ingredientsBlock", "appareilBlock", "ustensilesBlock"]; //tableau avec l'ID de chaque liste
const $allChevrons = document.querySelectorAll(".chevron"); //tous les chevrons
const $allBlocks = document.querySelectorAll(".Block"); //tous les blocks
//#endregion

//#region EVENT - BARRE DE RECHERCHE
// On écoute la valeur entrée dans la barre de recherche :
$seachField.addEventListener("input", function (e) {
  //console.log("New input");
  mainTextInput = e.target.value;
  // 1 - Mettre a jour les recettes selon l'input (+ les tags)
  updateSearchResult(mainTextInput);
  // 2 - Mettre a jour les Asf selon la liste de recettes affichée
  blockIds.forEach((id) => {
    updateAdvancedSearchField(id);
  });
  //console.log("Event flag");
});
//#endregion

//#region EVENT - CHEVRONS ET AUTRES ( !!!! A FAIRE !!!!! )
$allChevrons.forEach((ch) =>
  ch.addEventListener("click", function (e) {
    // console.log("Chevron clicked");
    let parentBlockId = e.target.closest(".Block").id;
    // console.log(parentBlockId);
    updateAdvancedSearchField(parentBlockId);
  })
);
// $allBlocks.forEach((bl) =>
//   bl.addEventListener("mouseover", function (e) {
//     let parentBlockId = e.target.closest(".Block").id;
//     updateAdvancedSearchField(parentBlockId);
//   })
// );
// Si on essaie de factoriser ces 2 events :
// let events = [$allChevrons, $allBlocks];

// events.forEach((ev) =>
//   ev.addEventListener("click", function (e) {
//     let parentBlockId = e.target.closest(".Block").id;
//     updateAdvancedSearchField(parentBlockId);
//   })
// );

//#endregion

//#region FONCTION - Mets a jour les recettes selon l'input
// Mets a jour les recettes selon l'input
function updateSearchResult(inputTxt = "") {
  console.log("Refresh UI");
  if (currentTags.length > 0 || inputTxt.length >= 3) {
    $recipeCtr.innerHTML = "";
    filteredRecipes = [];
    document.getElementById("msgaide").style.display = "block";
    for (let i = 0; i < recipes.length; i++) {
      let matching = false;
      // console.log(recipes[i]);
      // 1 - Verification match avec searchBar -----------------------------
      if (
        // Si test = "Mot" & "" --> Match = true
        recipeTextMatchWithSearchText(recipes[i].name, inputTxt) ||
        recipeTextMatchWithSearchText(recipes[i].description, inputTxt) ||
        recipeIngredientsMatchWithSearchText(recipes[i].ingredients, inputTxt)
      ) {
        matching = true;
        // if (inputTxt.length == 0) {
        //   // 1a - Si aucun tags + aucun text ("") --> Affiche la recette en cours (match = true)
        //   console.log("tags count = ", currentTagsCount());
        //   if (currentTagsCount() == 0) {
        //     matching = true;
        //   }
        //   // 1b - Si tags existants + aucun text ("") --> N'affiche que les recette via tags
        //   else {
        //     matching = false;
        //   }
        // }
      }
      // 2 - Verification match avec tags -----------------------------------
      if (recipeMatchingWithTags(recipes[i])) {
        //console.log(`Tags matchings with`, recipes[i]);
        matching = true;
      }

      // 3 - Si match avec searchBar ou tags --> Afficher la recette
      if (matching) {
        addElt(recipes[i]);
        filteredRecipes.push(recipes[i]);
      }
    }
    console.log("Filtered Recipes ", filteredRecipes);
  }
}
// Premier lancement de la fonction :
// c'est la fonction par défaut,
updateSearchResult();
console.log("Start flag");
//#endregion

//#region FONCTION -
// Retourne le nombre de tags affichées
function currentTagsCount() {
  let count = 0;
  count +=
    currentIngTags.length + currentAplTags.length + currentUstTags.length;
  return count;
}

//#endregion

//#region FONCTIONS - Chercher correspondance txt tapé VS autres
// Fonctions de vérifs (nom et description), avec 2 paramètres,
// le 2nd est mis en minuscule, puis comparé au 1er
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
// Ou
// function recipeIngredientsMatchWithSearchText(recipeIngredients, searchText) {
//   recipeIngredients.forEach((ing) => {
//     if (recipeTextMatchWithSearchText(ing.ingredient, searchText)) {
//       return true;
//     }
//   });
//   return false;
// }

// Retourne vrai si la recette match avec un des tags courant
function recipeMatchingWithTags(recipe) {
  let match = false;
  // Verif pour les 3 types de tags

  // 1 - Verif des ingredients
  // 1a - Parcours des ingredients de la recette courante
  recipe.ingredients.forEach((ing) => {
    // 1b - Si la liste des tags d'ings courants (currentIngTags) contient un des ingredients de la recette courante (recipe) --> match
    if (currentIngTags.includes(ing.ingredient)) match = true;
  });

  // 2 - Verif des Appareils
  // 2b - Si la liste des tags d'apl courants contient un des appareil de la recette courante (recipe) --> match
  if (currentAplTags.includes(recipe.appliance)) match = true;

  // 3 - Verif des Ustencils
  // 3b - Si la liste des tags d'ust courants contient un des ustencils de la recette courante (recipe) --> match
  recipe.ustensils.forEach((ust) => {
    if (currentUstTags.includes(ust)) match = true;
  });

  if (match) console.log(`Tags matching with ${recipe.name}`);

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
  $recipeCtr.innerHTML += innerHTML;
}
//#endregion

//#region FONCTION - Mets a jour les ASF selon la liste de recettes
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

//#region !!!!! A REORDONNER !!!!!! VISUALISATION DES LISTES / FILTRES

function filteredbyIngTags() {
  const filteredRecipes_ = [...filteredRecipes];
  filteredRecipes.forEach((rec) => {
    currentIngTags.forEach((tag) => {
      if (rec.ingredient.toLowerCase().match(tag)) {
      }
    });
  });
}
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
    htmlToInject += `<a href="#">${data}</a><br>`;
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
          console.log("Ing tags = ", currentIngTags);
          break;
        case "appareilBlock":
          currentAplTags.push(tagLink.innerText);
          console.log("Aps tags = ", currentAplTags);
          break;
        case "ustensilesBlock":
          currentUstTags.push(tagLink.innerText);
          console.log("Ust tags = ", currentUstTags);
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
      $tag.className = "tag";
      $tag.innerHTML = `
      <div class="tag-txt">${tagName}</div>
      `;

      // 3 - Creer le button close du tag
      let $tagCloseBtn = document.createElement("img");
      $tagCloseBtn.className = "tag-img";
      $tagCloseBtn.src = "../projet/img/cross.svg";
      $tagCloseBtn.alt = "closetag";

      // 4 - Ajouter le bt close au tag precedemment crée
      $tag.appendChild($tagCloseBtn);

      // 5 - Ajouter un event pour le tag créé (Close btn)
      $tagCloseBtn.addEventListener("click", function (e) {
        // 5a - Identifier la liste a modifier
        switch (blockId) {
          case "ingredientsBlock":
            currentIngTags = currentIngTags.filter((ing) => ing != tagName);
            console.log("Ing tags = ", currentIngTags);
            break;
          case "appareilBlock":
            currentAplTags = currentAplTags.filter((apl) => apl != tagName);
            console.log("Apl tags = ", currentAplTags);
            break;
          case "ustensilesBlock":
            currentUstTags = currentUstTags.filter((ust) => ust != tagName);
            console.log("Ust tags = ", currentUstTags);
            break;
        }

        $tag.remove();
        updateSearchResult(mainTextInput, true);
        // filter : supprime dans une liste les elements ne correspondants pas aux criteres
        //currentTags = currentTags.filter((ct) => ct != $tag);
      });

      // 6 - Ajouter le tag a son conteneur (div)
      $tagsCtr.appendChild($tag);
      // 7 - Ajouter la reference du tag a la liste globale ()
      currentTags.push($tag);
      updateSearchResult(mainTextInput, true);
    })
  );

  // Ajouter un event sur chaque bouton close de chaque tag
}

function filterByIng(filteredIng, currentIngTags) {}

//#endregion

//#region CHANGE THE PLACEHOLDER ( !!!! code à revoir pr optimiser !!! )
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

//#region XXX

//#endregion

//#region CONSOLE.LOG
// recipes[0].ingredients[3].unit;
// console.log(recipes[0].ingredients[3].unit);
//#endregion

//#region fonction populateAsf - étape par étape
// // Peupler un block ASF (selon blockID)
// // blockID : string servant à identifier le block à màj
// // asfData : liste de données selon le block à màj = set(rawData)
// function populateAsf(blockId, asfData) {
//   // 1 - Recuperer l'element HTML (div) qui va contenir les données (ingredients, appareils, ustensils)
//   let $asfRoot;
//   if (blockIds.includes(blockId)) {
//     $asfRoot = document.querySelector(`.${blockId} .asfList`);
//   }
//   // 2 - Vider l'element div (.asfList)
//   $asfRoot.innerHTML = "";

//   // 3 - Ajouter des elements a notre div (.asfList)
//   let htmlToInject = "";
//   asfData.forEach((data) => {
//     // console.log("DL = ", data);
//     htmlToInject += `<a href="#">${data}</a><br>`;
//   });

//   $asfRoot.innerHTML += htmlToInject;

//   // Ajouter un event sur chaque lien contenu dans un asfList

//   // 1 - Recuperer tous les liens de l'ASF list courant
//   let $asfLinks = document.querySelectorAll(`.${blockId} .asfList a`);
//   const $tagsCtr = document.querySelector(".tags");
//   // 2 - Ajouter un evenement sur chaque lien
//   $asfLinks.forEach((link) =>
//     link.addEventListener("click", function (e) {
//       //console.log("Click on asf element", link);
//       updateSearchResult(mainTextInput, true);

//       // 1 - Recuperer le text du lien
//       let tagName = link.textContent;

//       // 1b - Verifier si le tag est deja actif, si oui arreter l'execution ici (return)
//       // find => Cherche un element dans une liste donnée qui correspond aux criteres
//       if (currentTags.find((t) => t.innerText === tagName)) return;

//       // 2 - Créer un nouveau tag
//       let $tag = document.createElement("div");
//       $tag.className = "tag";
//       $tag.innerHTML = `
//       <div class="tag-txt">${tagName}</div>
//       `;

//       // 3 - Creer le button close du tag
//       let $tagCloseBtn = document.createElement("img");
//       $tagCloseBtn.className = "tag-img";
//       $tagCloseBtn.src = "../projet/img/cross.svg";
//       $tagCloseBtn.alt = "closetag";

//       // 4 - Ajouter le bt close au tag precedemment crée
//       $tag.appendChild($tagCloseBtn);

//       // 5 - Ajouter un event pour le tag créé (Close btn)
//       $tagCloseBtn.addEventListener("click", function (e) {
//         $tag.remove();
//         // filter : supprime dans une liste les elements ne correspondants pas aux criteres
//         currentTags = currentTags.filter((ct) => ct != $tag);
//         console.log("Current tags = ", currentTags);
//       });

//       // 6 - Ajouter le tag a son conteneur (div)
//       $tagsCtr.appendChild($tag);
//       // 7 - Ajouter la reference du tag a la liste globale ()
//       currentTags.push($tag);
//       console.log("Current tags = ", currentTags);
//     })
//   );

//   // Ajouter un event sur chaque bouton close de chaque tag
// }
//#endregion

//#region Commentaires brouillon

//--------- si besoin de conversion : -------------
// const dataList = [...asfData];
// console.log("DataList ", dataList);
// console.log("DataList with ... --> ", [...asfData]);
//const dL = [asfData[0],asfData[1],asfData[2]] soit un tableau de 30 elt
//Versus :
// const dl2 = [asfData];
// console.log("DataList without ... --> ", [asfData]);
//const dl2 = soit un tableau avec 1 seul elt (1tableau), contenant lui-même 30 elt
//--------- fin de conversion -------------------//

//#endregion
