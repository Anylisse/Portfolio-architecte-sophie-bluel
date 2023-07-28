let server_url = "https://portfolio-sophie-bluel-backend.onrender.com/api/";

// Récupération des informations de connexion
async function logIn() {
    const userEmail = document.querySelector("#email").value;
    const userPassword = document.querySelector("#password").value;

    const user = {
        email: userEmail,
        password: userPassword
    };

    const userJSON = JSON.stringify(user);

    const response = await fetch(server_url + 'users/login', {
        method: "POST",
        headers: {
            'content-type': 'application/json'
        },
        body: userJSON
    });

    const result = await response.json();

    /** Générer un message d'erreur si la connexion échoue **/
    if (result.message === "user not found" || result.error) {
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