DEBUG = false;
let modalGallery = document.querySelector('.modal-gallery');

// Let portfolio = <section id="portfolio">
let portfolio = document.querySelector('.gallery');

// Paramètres d'appel à l'API
let server_url = "http://localhost:5678/api/";
let state = 0;
let request_options = {
    method: "GET",
    headers: {
        'content-type': 'application/json'
    }
};

// Fonction principale du projet (appelée en premier)
main();

// Déclaration de la fonction main
async function main() {
    await list_works();
    await list_category();
}

/* Cette fonction permet de créer un header avec la méthode (DELETE ou POST) et de passer 
le token en autorisation */
function request_token(method_) {
    let request = {
        method: method_,
        headers: {
            'content-type': 'application/json',
            'Authorization': 'Bearer ' + recupToken
        }
    };
    return request;
}

// Fonction qui permet de charger les travaux à partir du Backend
async function list_works(category_id) {

    await fetch(server_url + "works", request_options)
        .then(function (response) {
            state = response.status;
            return response.json();
        })
        .then(function (json) {
            //console.log(json)

            // On vérifie que le serveur a bien répondu
            if (state == 200) {

                // On efface tous les travaux pour avoir une page blanche
                dropElement(portfolio);

                dropElement(modalGallery);

                // On parcours le tableau de works renvoyé par l'API
                for (let i in json) {

                    // On filtre sur la catégorie, si category_id est vide, on affiche tout
                    if ((category_id == json[i].category.id) || (category_id == null)) {

                        // On crée la figure 
                        let figure = document.createElement('figure');

                        // On va supprimer la figure, on lui donne un id
                        figure.setAttribute('id', 'figure_' + json[i].id);

                        // On crée l'image pour cette figure
                        let img = document.createElement('img');
                        img.setAttribute('src', json[i].imageUrl);
                        img.setAttribute('alt', json[i].title);
                        figure.appendChild(img);

                        // On crée le caption pour cette figure
                        let figcaption = document.createElement('figcaption');
                        figcaption.textContent = json[i].title;
                        figure.appendChild(figcaption);

                        //console.log(portfolio)
                        portfolio.appendChild(figure)

                        // Cadre qui contient l'image, la poubelle et le texte "éditer"
                        let figurePicture = document.createElement('figure');
                        figurePicture.setAttribute('class', 'figure-picture');

                        // Pour supprimer la figure miniature
                        figurePicture.setAttribute('id', 'figure_picture_' + json[i].id);

                        let imgM = document.createElement('img');
                        imgM.setAttribute('src', json[i].imageUrl);
                        imgM.setAttribute('alt', json[i].title);
                        imgM.setAttribute('class', 'picture');
                        figurePicture.appendChild(imgM);

                        let a = document.createElement('a');
                        a.setAttribute('href', '#');

                        /* On ajoute un id pour faciliter la suppression dynamique, on met l'id 
                        sur le parent de i car i a déjà un id */
                        a.setAttribute('id', json[i].id);
                        i = document.createElement('i');
                        i.setAttribute('class', 'fa-solid fa-trash-can');

                        // On utilise un id car on ne peut pas rechercher par class
                        i.setAttribute('id', 'trash-can');

                        // On intercepte le click sur la poubelle pour appeler la fonction delete_work
                        i.addEventListener('click', delete_work);
                        a.appendChild(i);
                        figurePicture.appendChild(a);

                        // Pour que le texte "éditer" soit sous l'image
                        let br = document.createElement('br');
                        figurePicture.appendChild(br);

                        let textEdit = document.createElement('text');
                        textEdit.setAttribute('class', 'text-edit');
                        textEdit.innerText = "éditer";
                        figurePicture.appendChild(textEdit);

                        modalGallery.appendChild(figurePicture);

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
            //console.log(json)
            if (state == 200) {

                // On traite les boutons catégories
                let filters = document.querySelector('.filters');
                let filters_tous = filters.querySelector('li');

                // Si on est logué, les boutons filtres n'existent pas
                if (filters_tous) {

                    /* Ajout d'un évenement "click" sur le bouton "tous" 
                    avec appel de la fonction "click_tous" */
                    filters_tous.addEventListener('click', click_tous);

                    for (let i in json) {

                        let elementFilters = document.createElement('li');
                        elementFilters.textContent = json[i].name;
                        elementFilters.setAttribute('data.id', json[i].id);

                        /* Ajout d'un évenement "click" sur les boutons "catégories" 
                        avec appel de la fonction "click_filters" */
                        elementFilters.addEventListener('click', click_filters);

                        filters.appendChild(elementFilters);
                    }
                }

                // On traite la combobox catégories dans la fenêtre modale de saisie d'un travail
                // On rempli la combobox avec les données du json list des catégories
                let combo_cat = document.querySelector('#category-project');

                // On efface ce qui est en dur dans la liste combobox
                dropElement(combo_cat);

                if (combo_cat) {

                    for (let i in json) {
                        option = document.createElement('option');
                        option.setAttribute('value', json[i].id);
                        option.textContent = json[i].name;
                        combo_cat.appendChild(option);
                    }
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
    e.preventDefault();

    // Vider le localStorage
    localStorage.clear();

    // Retourner à la page d'accueil
    document.location.href = "index.html";
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
let modal2 = null;

// Cette fonction permet de réinitialiser l'écran modale de saisie d'un travail
function FillModalWorks() {

    // On vide l'écran en mode nouveau travail
    const picture = document.getElementById('picture');
    const pict_file = document.getElementById('picture-file');
    const title = document.getElementById('title-project');
    const category = document.getElementById('category-project');
    const button_add = document.querySelector('.add-picture-button');
    const p_info = document.getElementById('picture-info');

    if (picture) {
        picture.files.clear;
        pict_file.src = "assets/icons/image.png";

        // On remet les dimensions de départ 
        pict_file.style['width'] = '58px';
        pict_file.style['height'] = '46px';
        pict_file.style['margin-top'] = '20px';

        button_add.hidden = false;
        p_info.hidden = false;
    }

    title.value = '';
    category.value = '';

    // Pour remettre le bouton en gris
    control_saisie();
    // Fin vidage écran nouveau travail
}

// Ouvrir la modale editwork
const openModal2 = function (e) {
    e.preventDefault();

    FillModalWorks();

    // On a mit la target dans l'id du bouton
    const target = document.querySelector(e.target.getAttribute('id'));
    target.style.display = null;
    target.removeAttribute('aria-hidden');
    target.setAttribute('aria-modal', 'true');
    modal2 = target;

    // Fermer la modale grâce à la croix
    const close = document.getElementById('close-modal2');
    close.addEventListener('click', closeModal2);

    // Empêcher de fermer quand on clique sur le formulaire
    form = document.getElementById('div-modal');
    form.addEventListener('click', propagation);

    // Flèche de retour arrière
    backtrack = document.querySelector('.backtrack');
    backtrack.addEventListener('click', goBack);

    // Fermer la modale au clic à l'extérieur
    const closeOuterModal = document.querySelector('.modal-wrapper');
    closeOuterModal.addEventListener('click', propagation);
    document.querySelector('#editworkmodal').addEventListener('click', closeModal2);
    const pictureButton = document.querySelector('.add-picture-button');
    pictureButton.addEventListener('click', addWorks);
    const pictureImg = document.getElementById('picture-file');
    pictureImg.addEventListener('click', addWorks);
    const buttonValidate = document.getElementById('style-input-modal');
    buttonValidate.addEventListener('click', sendWorks);
}

/* Cette fonction permet de vérifier que tous les champs saisis dans la modale saisie d'un travail 
sont ok */
function control_saisie() {
    const picture = document.getElementById('picture');
    const title = document.getElementById('title-project').value;
    const category = document.getElementById('category-project').value;

    button_valid = document.getElementById('style-input-modal');

    if ((title != "") && (category != "") && picture) {
        button_valid.style['background'] = '#1D6154';
    }
    else {
        button_valid.style['background'] = '#A7A7A7';
    }

}

async function sendWorks(event) {
    event.preventDefault();
    const formAddWorks = document.querySelector('#form-add-work');

    // Création FormData
    let formData = new FormData(formAddWorks);

    // Récupération des données saisies
    const addPicture = document.getElementById('picture').files[0];
    const addTitle = document.getElementById('title-project').value;
    const addCategory = document.getElementById('category-project').value;

    // Ajout de ces données dans le formData qui sera transmis au serveur par la requête works POST
    formData.append('image', addPicture);
    formData.append('title', addTitle);
    formData.append('category', addCategory);

    // Création du header
    const headers = new Headers();
    headers.append('Authorization', 'Bearer ' + recupToken);

    // Accepte tout type de format
    headers.append('Accept', '*/*');

    // Création de la requête
    const request = new Request(server_url + "works", {
        method: 'POST',    // Méthode post
        headers: headers,  // Remplissage du header défini plus haut
        body: formData     // Affectation du formData à body
    });

    // Appel de la requête
    await fetch(request)
        .then(function (response) {
            state = response.status;
            return response;
        })
        .then(function (json) {

            switch (state) {
                case 201: alert("Le travail a été ajouté"); // Si ok on affiche un message 
                    FillModalWorks(); // On vide la modale works pour une prochaine nouvelle saisie
                    main(); // On rappel main qui va tout rafraîchir
                    break;

                case 400: alert("Mauvaise requête");
                    break;

                case 401: alert("Vous n'êtes pas autorisé à éxecuter cette fonction");
                    break;

                case 500: alert("Erreur serveur");
            }
        })
}

// Fermer la modale editwork et ferme également la modale photogallery
const closeModal2 = function (e) {

    if (modal != null) {
        closeModal(e)
    }
    goBack(e);
}

// Fermer la modale editwork (retour arrière au click de la flèche)
const goBack = function (e) {
    if (modal2 === null) return
    e.preventDefault();
    const bottom = document.querySelector('html');
    bottom.style.background = "white";
    modal2.style.display = "none";
    modal2.setAttribute('aria-hidden', 'true');
    modal2.removeAttribute('aria-modal');
    modal2.removeEventListener('click', closeModal2);
    modal2 = null;
}

// Ouvrir la modale photogallery
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
    const closeOuterModal = document.querySelector('.modal-wrapper');
    closeOuterModal.addEventListener('click', propagation);
    document.querySelector('#photogallerymodal').addEventListener('click', closeModal);
    document.querySelector('.add-modal-button').addEventListener('click', openModal2);

    list_works();
}

// Fermer la modale photogallery
const closeModal = function (e) {
    if (modal === null) return
    e.preventDefault();
    const bottom = document.querySelector('html');
    bottom.style.background = "white";
    modal.style.display = "none";
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.add-modal-button').removeEventListener('click', openModal2);
    modal = null;
}

// Fonction pour ouvrir la modale avec un addEventListener
document.querySelectorAll('.open-modal').forEach(a => {
    a.addEventListener('click', openModal)
});

// Arrêter la propagation de la modale
function propagation(e) {
    e.stopPropagation();

    picture = document.getElementById('picture');
    title = document.getElementById('title-project');
    category = document.getElementById('category-project');
    if ((e.target == picture) || (e.target == title) || (e.target == category)) {
        control_saisie()
    }

};

// Suppression d'un travail
async function delete_work(e) {

    idWork = e.target.parentNode.getAttribute('id');

    await fetch(server_url + "works/" + idWork, request_token("DELETE"))
        .then(function (response) {
            state = response.status;
            return response; // Si l'état de la réponse est 200, on ne reçoit pas de json en réponse
        })
        .then(function (json) {
            //console.log(json)

            switch (state) {

                case 200, 204:

                    // On efface la figure miniature
                    let figure_miniature = document.getElementById('figure_picture_' + idWork);
                    figure_miniature.parentNode.removeChild(figure_miniature);

                    // On efface la figure de la page html
                    let figure = document.getElementById('figure_' + idWork);
                    figure.parentNode.removeChild(figure);
                    break;

                case 401:

                    // Non autorisé
                    alert("Vous n'êtes pas autorisé à supprimer ce travail");
                    break;

                case 500:

                    // Erreur serveur
                    alert("Une erreur serveur vient de se produire, vérifier la connexion");
                    break;
            }
        })
}

// Permet de selectionner une image sur l'ordinateur
function selectPicture() {
    let inputFile = document.getElementById('picture');
    //console.log(inputFile.value);
    let fileName = inputFile.files.item(0).name;

    // On affiche l'image 
    let pictureFile = document.getElementById('picture-file');
    pictureFile.setAttribute('src', 'assets/images/' + fileName);
    pictureFile.style['width'] = '129px';
    pictureFile.style['height'] = '100%';
    pictureFile.style['marginTop'] = '0';
    let pictureButton = document.querySelector('.add-picture-button');
    let pInfo = document.getElementById('picture-info');
    pInfo.hidden = true;
    pictureButton.hidden = true;
}

// Ajout d'un projet
function addWorks(e) {
    e.preventDefault();

    // Récupération du formulaire que l'on stocke dans une variable
    const formAddWorks = document.querySelector('#form-add-work');

    const inputFile = document.querySelector('#picture');

    inputFile.addEventListener('change', selectPicture)

    inputFile.click();

}