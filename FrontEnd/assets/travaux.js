// Paramètres d'appel à l'API
let server_url="http://localhost:5678/api/";
let state=0;
let request_options={
        method:"GET",
        headers:{
            'content-type':'application/json'
        }
    };

// Fonction qui permet de charger les travaux à partir du Backend
function list_works(){

    fetch(server_url+"works",request_options)
    .then(function(response){
        state=response.status;
        return response.json();
    })
    .then(function(json){
        console.log(json)
        if(state==200){ // On vérifie que le serveur a bien répondu
            let portfolio=document.getElementById('portfolio'); //Let portfolio = <section id="portfolio">
            for(let i in json){ // On parcours le tableau de works renvoyé par l'API

                // Création du titre de la catégorie si il n'a pas déjà été crée
            let h2=document.getElementById('h2_'+json[i].category.id);
            if(!h2){
                 h2=document.createElement('h2');
                 h2.setAttribute('id','h2_'+json[i].category.id);
                 h2.textContent=json[i].category.name;
                 portfolio.appendChild(h2);
                }   

                // Création du div gallery si il n'a pas déjà été crée
            let div_gallery=document.getElementById('gallery_'+json[i].category.id);
            if(!div_gallery){
                div_gallery=document.createElement("div");
                div_gallery.setAttribute('id','gallery_'+json[i].category.id);
                div_gallery.setAttribute('class','gallery');             
                portfolio.appendChild(div_gallery);
            }

            // On crée la figure pour le travail concerné
            let figure=document.createElement('figure');
            div_gallery.appendChild(figure);

            // On crée l'image pour cette figure
            let img=document.createElement('img');
            img.setAttribute('src', json[i].imageUrl);
            img.setAttribute('alt', json[i].title);
            figure.appendChild(img);

            // On crée le caption pour cette figure
            let figcaption=document.createElement('figcaption');
            figcaption.textContent=json[i].title;
            figure.appendChild(figcaption);
            }
        }              
    })
}


