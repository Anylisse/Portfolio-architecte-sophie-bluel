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

                //Let portfolio = <section id="portfolio">
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