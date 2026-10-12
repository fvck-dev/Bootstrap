"use strict";

import { moviesAPI_auto } from "./api/_movies.js";
import { movieValidator } from "./validators/create_movie.js";
import { messageRenderer } from "./renderers/messages.js";
import { sessionManager } from "./utils/session.js";


let urlParams = new URLSearchParams(window.location.search);
let movieId = urlParams.get("movieId");
let usuarioId = sessionManager.getLoggedId();


async function main() {

    if (usuarioId === null) {

        messageRenderer.showErrorMessage("No puedes subir ni editar libros sin registrarte");
        return;
    }

    else {

        if (movieId != null) {

            loadMovieDetails();
        }

        let formulario = document.getElementById("form");
        formulario.onsubmit = handleSubmitFormulario;
    }
}

async function handleSubmitFormulario(event) {


    event.preventDefault();

    let form = event.target;
    let formData = new FormData(form);
    formData.append("userId", usuarioId);
    let errors = movieValidator.validateRegister(formData);

    if (errors.length > 0) {

        let errorsDiv = document.getElementById("errors");
        errorsDiv.innerHTML = " ";

        for (let error of errors) {

            messageRenderer.showErrorMessage(error);

        }
    }

    else {
        createMovie(formData);
    }
}

async function createMovie(formData) {

    try {

        let resp = await moviesAPI_auto.create(formData);
        window.location.href = `index.html`;
    }

    catch (err) {

        messageRenderer.showErrorMessage(err.response.data.message);
    }

}

async function loadMovieDetails() {
    let currentMovie = await moviesAPI_auto.getById(movieId);

    let inputDirector = document.getElementById("input_director");
    let inputTitle = document.getElementById("input_title");
    let inputReleaseDate = document.getElementById("input_releaseDate");
    let inputImageUrl = document.getElementById("input_imageUrl");
    let inputDurationMinutes = document.getElementById("input_durationMinutes");



    try {
        inputDirector.value = currentMovie.director;
        inputTitle.value = currentMovie.title;
        inputReleaseDate.value = currentMovie.releaseDate;
        inputImageUrl.value = currentMovie.imageUrl;
        inputDurationMinutes.value = currentMovie.durationMinutes;


    } catch (error) {
        messageRenderer.showErrorMessage(error);
    }
}

document.addEventListener("DOMContentLoaded", main);
