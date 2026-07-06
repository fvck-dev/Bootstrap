"use strict";

import { gamesAPI_auto } from "./api/_games.js";
import { gameValidator } from "./validators/games.js";
import { messageRenderer } from "./renderers/messages.js";
import { sessionManager } from "./utils/session.js";


let urlParams = new URLSearchParams(window.location.search);
let gameId = urlParams.get("gameId");
let usuarioId = sessionManager.getLoggedId();


async function main() {

    if (usuarioId === null) {

        messageRenderer.showErrorMessage("No puedes subir ni editar libros sin registrarte");
        return;
    }

    else {

        if (gameId != null) {

            loadGameDetails();
        }

        let formulario = document.getElementById("register-form");
        formulario.onsubmit = handleSubmitFormulario;
    }
}

async function handleSubmitFormulario(event) {


    event.preventDefault();

    let form = event.target;
    let formData = new FormData(form);
    formData.append("userId", usuarioId);
    let errors = gameValidator.validateRegister(formData);

    if (errors.length > 0) {

        let errorsDiv = document.getElementById("errors");
        errorsDiv.innerHTML = " ";

        for (let error of errors) {

            messageRenderer.showErrorMessage(error);

        }
    }

    else {
        createGame(formData);
    }
}

async function createGame(formData) {

    try {
    
        let resp = await gamesAPI_auto.create(formData);
        window.location.href = `games.html`;
    }

    catch (err) {

        messageRenderer.showErrorMessage(err.response.data.message);
    }

}

document.addEventListener("DOMContentLoaded", main);