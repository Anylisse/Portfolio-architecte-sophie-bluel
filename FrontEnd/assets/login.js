// Récupération des informations de connexion
async function logIn() {
    const userEmail = document.querySelector("#email").value;
    const userPassword = document.querySelector("#password").value;

    const user = {
        email: userEmail,
        password: userPassword
    };

    const userJSON = JSON.stringify(user);

    const response = await fetch('http://localhost:5678/api/users/login', {
        method: "POST",
        headers: {
            'content-type': 'application/json'
        },
        body: userJSON
    });

    const result = await response.json();

    if (result.message === "Utilisateur non trouvé") {
        alert(result.message);
        return;

    } else if (result.error) {

        alert("Erreur dans l’identifiant ou le mot de passe");
        return;

    } else {

        window.localStorage.setItem("userId", result.userId);
        window.localStorage.setItem("token", result.token);
        window.location.replace("index.html");
    }
};

const formLogIn = document.querySelector("#login form");
formLogIn.addEventListener("submit", function (event) {
    event.preventDefault();
    logIn();
});