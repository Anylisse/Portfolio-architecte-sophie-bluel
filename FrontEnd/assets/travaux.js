// Paramètres d'appel à l'API
let server_url = "http://localhost:5678/api/";
let state = 0;
let request_options = {
    method: "GET",
    headers: {
        'content-type': 'application/json'
    }
};

main();

async function main() {
    await list_works();
    await list_category();
}

// Fonction qui permet de charger les travaux à partir du Backend
async function list_works(category_id) {

    await fetch(server_url + "works", request_options)
        .then(function (response) {
            state = response.status;
            return response.json();
        })
        .then(function (json) {
            console.log(json)

            // On vérifie que le serveur a bien répondu
            if (state == 200) {

                // Let portfolio = <section id="portfolio">
                let portfolio = document.querySelector('.gallery');

                // On efface tous les travaux pour avoir une page blanche
                dropElement(portfolio);

                // On parcours le tableau de works renvoyé par l'API
                for (let i in json) {

                    // On filtre sur la catégorie, si category_id est vide, on affiche tout
                    if ((category_id == json[i].category.id) || (category_id == null)) {

                        // On crée la figure 
                        let figure = document.createElement('figure');

                        // On crée l'image pour cette figure
                        let img = document.createElement('img');
                        img.setAttribute('src', json[i].imageUrl);
                        img.setAttribute('alt', json[i].title);
                        figure.appendChild(img);

                        // On crée le caption pour cette figure
                        let figcaption = document.createElement('figcaption');
                        figcaption.textContent = json[i].title;
                        figure.appendChild(figcaption);

                        console.log(portfolio)
                        portfolio.appendChild(figure)

                    }
                }
            }
        })
}

// Fonction qui permet de charger les catégories à partir du Backend
async function list_category() {

    await fetch(server_url + "categories", request_options)
        .then(function (response) {
            state = response.status;
            return response.json();
        })
        .then(function (json) {
            console.log(json)
            if (state == 200) {
                let filters = document.querySelector('.filters');
                let filters_tous = filters.querySelector('li');

                // Ajout d'un évenement "click" sur le bouton "tous" avec appel de la fonction "click_tous"
                filters_tous.addEventListener('click', click_tous);

                for (let i in json) {

                    let elementFilters = document.createElement('li');
                    elementFilters.textContent = json[i].name;
                    elementFilters.setAttribute('data.id', json[i].id);

                    // Ajout d'un évenement "click" sur les boutons "catégories" avec appel de la fonction "click_filters"
                    elementFilters.addEventListener('click', click_filters);

                    filters.appendChild(elementFilters);
                }
            }
        })
}

// Cette fonction met en blanc tous les boutons sauf le bouton sur lequel on a cliqué
async function init_filters(e) {
    let filters = document.querySelector('.filters');

    let children = filters.childNodes;

    for (const node of children) {
        node.className = 'li';
    }

    // Le bouton sur lequel on a cliqué aura le style de la classe 'li2'
    e.target.className = 'li2';
}

// Traitement du "click" pour les boutons "catégories"
async function click_filters(e) {
    category_id = e.target.getAttribute('data.id');
    init_filters(e);
    await list_works(category_id);
}
// Traitement du "click" pour le bouton "tous"
async function click_tous(e) {
    init_filters(e);

    await list_works();
}

// Cette fonction permet d'effacer tous les éléments enfant d'un élément parent
function dropElement(parent_element) {

    // Tant qu'il y a au moins un enfant
    while (parent_element.childNodes.length > 0) {

        // On efface le dernier élément, le précédent devient le dernier, jusqu'à 0 enfants
        parent_element.removeChild(parent_element.lastChild);
    }
}

// Récupération du token
const recupToken = window.localStorage.getItem("token");

// Pouvoir se déconnecter 
function seDeconnecter(e) {

    // Vider le localStorage
    localStorage.clear();

    // Retourner à la page d'accueil
    window.location.replace = "index.html";
}

// Afficher les éléments du mode édition si administrateur
if (recupToken !== null) {

    // Remplacement de "login" par "logout"
    let loginAdmin = document.querySelector(".login-logout");
    loginAdmin.innerHTML = " "
    loginAdmin.innerText = "logout";

    // Pour pouvoir revenir à la page d'accueil
    loginAdmin.addEventListener('click', seDeconnecter);

    // Afficher la barre mode édition et publication des changements 
    const editmodebar = document.querySelector(".edit-mode-bar");
    editmodebar.style.display = null;

    // Afficher les boutons modifier
    const photoediting = document.querySelector(".photo-editing");
    photoediting.style.display = null;
    const textcontent = document.querySelector(".text-content");
    textcontent.style.display = null;
    const projectmodification = document.querySelector(".project-modification");
    projectmodification.style.display = null;

    // Faire disparaître les boutons filtre 
    const filters = document.querySelector(".filters");
    filters.innerHTML = "";
}

let modal = null;

// Fonction pour faire apparaître les projets dans la modale


// Ouvrir la modale
const openModal = function (e) {
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute('href'));
    target.style.display = null;
    target.removeAttribute('aria-hidden');
    target.setAttribute('aria-modal', 'true');
    modal = target;

    // Fermer la modale grâce à la croix
    const close = document.querySelector(".icon");
    close.addEventListener('click', closeModal);

    // Fermer la modale au clic à l'extérieur
    const fermerModaleExterieur = document.querySelector('.modal-wrapper');
    fermerModaleExterieur.addEventListener('click', Propagation);
    document.querySelector('#photogallerymodal').addEventListener('click', closeModal);
}

//Vérifier le clic à l'extérieur
// window.addEventListener('click', e => {
//     console.log(e.target)
// });

// Fermer la modale
const closeModal = function (e) {
    if (modal === null) return
    e.preventDefault();
    const bottom = document.querySelector('html');
    bottom.style.background = "white";
    modal.style.display = "none";
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.delete-button-modal').removeEventListener('click', closeModal);
    modal = null;
}

// Fonction pour ouvrir la modale avec un addEventListener
document.querySelectorAll('.open-modal').forEach(a => {
    a.addEventListener('click', openModal)
});

// Arrêter la propagation de la modale
function Propagation(e) {
    e.stopPropagation()
};
