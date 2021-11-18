//#region CONSTANTES ET VARIABLES
// memo : faire commencer par "$" les elt HTML
const $recipeCtr = document.querySelector(".TheRecipes"); //Ctr des recettes
let currentTags = []; //Tags actifs
let currentIngTags = []; //Tags actifs Ing
let currentUstTags = []; //Tags actifs Use
let currentAplTags = []; //Tags actifs Apl
let mainTextInput = ""; //Texte dans la barre de recherche
const $seachField = document.querySelector(".searchbox input"); //Barre de recherche
let filteredRecipes; //recettes filtrées
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
function updateSearchResult(inputTxt = "", tagMode = false) {
  //console.log("Refresh UI");
  if (
    tagMode || // par défaut -> si tagMode == true
    currentTags.length > 0 ||
    inputTxt.length >= 3 ||
    inputTxt == ""
  ) {
    // console.log("Update UI");
    $recipeCtr.innerHTML = "";
    filteredRecipes = [];
    document.getElementById("msgaide").style.display = "block";
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
// Premier lancement de la fonction :
// c'est la fonction par défaut,
updateSearchResult();
console.log("Start flag");
//#endregion

//#region FONCTIONS - Chercher correspondance txt tapé VS autres
// Fonctions de vérifs (nom et description), avec 2 paramètres,
// le 2nd est mis en minuscule, puis comparé au 1er
// Retourne true si les inputs (searchTxt && currentTags) correspondent a la recette courante
function recipeTextMatchWithSearchText(recipeText, searchText) {
  // let wordsToCompare = currentTags.map((tag) => tag.innerText);
  // console.log("WTC= ", wordsToCompare);
  // let result = false; // Resultat du test entre la recette et les mots a comparer (match = true, pas match = false)
  // 1 - Ajoute des tags au tableau des mots a comparer (si tags courant existants)
  // 2- Ajout du text de la barre de recherche au tableau des mots a comparer
  // wordsToCompare.push(searchText);
  // 3 - On compare la recette courante avec chq mot du tableau des mots a comparer
  // wordsToCompare.forEach((wtc) => {
  // 3b - Si la recette match avec un de mot du tableau --> Renvoie true
  return recipeText.toLowerCase().match(searchText);
  // });
  // console.log("Matching = ", result);
  // return result; // -> boolean
}

function recipeIngredientsMatchWithSearchText(recipeIngredients, searchText) {
  recipeIngredients.forEach((ing) => {
    if (ing.ingredient.toLowerCase().match(searchText)) {
      return true;
    }
  });
  return false;
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

// Pour la vérif. des ingrédients, on crée un boucle :
// Retourne true si les inputs (searchTxt && currentTags) correspondent aux ings de la recette courante
// function recipeIngredientsMatchWithSearchText(recipeIngredients, searchText) {
//   let wordsToCompare = [];
//   let result = false; // Resultat du test entre la recette et les mots a comparer (match = true, pas match = false)
//   // 1 - Ajoute des tags au tableau des mots a comparer (si tags courant existants)
//   if (currentTags.length > 0) wordsToCompare.push(...currentTags);
//   // 2- Ajout du text de la barre de recherche au tableau des mots a comparer
//   wordsToCompare.push(searchText);
//   // 3 - On compare la liste d'ingredients courant avec chq mot du tableau des mots a comparer
//   wordsToCompare.forEach((wtc) => {
//     // 3b - On parcours tous les ingredients
//     for (let i = 0; i < recipeIngredients.length; i++) {
//       // 3b - Si la recette match avec un de mot du tableau --> Renvoie true
//       if (recipeIngredients[i].ingredient.toLowerCase().match(wtc)) {
//         return true;
//       }
//     }
//   });
//   console.log("Matching = ", result);
//   return result;
// }
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
        $tag.remove();
        // filter : supprime dans une liste les elements ne correspondants pas aux criteres
        currentTags = currentTags.filter((ct) => ct != $tag);

        console.log(
          "Currenttts tags = ",
          currentTags.map(($tag) => $tag.innerText)
        );
      });

      // 6 - Ajouter le tag a son conteneur (div)
      $tagsCtr.appendChild($tag);
      // 7 - Ajouter la reference du tag a la liste globale ()
      currentTags.push($tag);
      console.log(
        "Current tags = ",
        currentTags.map(($tag) => $tag.innerText)
      );
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
