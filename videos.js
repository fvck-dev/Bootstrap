"use strict";

import {moviesAPI_auto} from "/js/api/_movies.js";
import {usersAPI_auto} from "/js/api/_users.js";
import {movieRenderer} from "/js/renderers/movies.js";
import {messageRenderer} from "/js/renderers/messages.js";
import {movieValidator} from "/js/validators/movies.js";
import {sessionManager} from "./utils/session.js";

let urlParams=new URLSearchParams(window.location.search);
let movieId=urlParams.get("movieId");

let container=document.getElementById("body");

async function main() {
    if (movieId===null) {
        messageRenderer.showErrorMessage("El movieId es nulo");
        return;
    }
    
    loadMovieDetails();

    document.getElementById("movie-form").onsubmit = loadForm;
}

async function loadMovieDetails() {
    let movie=await moviesAPI_auto.getById(movieId);
    let user=await usersAPI_auto.getById(movie.userId);
    let card=movieRenderer.asCard(movie, user);
    container.innerHTML+=card;
}

async function loadForm(event) {
    event.preventDefault();

    let form = event.target;
    let formData = new FormData(form);
    let errors = movieValidator.validateRegister(formData);

    if (errors.length > 0) {
        let errorsDiv = document.getElementById("errors");
        errorsDiv.innerHTML = "";

        for (let error of errors) {
            messageRenderer.showErrorMessage(error);
        }
    
    }else{

        let movie = await moviesAPI_auto.getById(movieId);

        if (!sessionManager.isLogged()) {
            messageRenderer.showErrorMessage("No puedes actualizar movie si no estás conectado");
            return;
        }

        if (movie.userId !== sessionManager.getLoggedId()){
            messageRenderer.showErrorMessage("Tu usuario no es el que publicó esta movie");
            return;
        }

        formData.append("director", `${movie.director}`);
        formData.append("durationMinutes", document.getElementById("durationMinutes-input").value);
        formData.append("imageUrl", `${movie.imageUrl}`);
        formData.append("releaseDate", `${movie.releaseDate}`);
        formData.append("title", `${movie.title}`);
        formData.append("userId", `${movie.userId}`);

        try {
            await moviesAPI_auto.update(formData, movieId);
            window.location.href = `movie_details.html?movieId=${movieId}`;
        } catch (err) {
            messageRenderer.showErrorMessage(err)


        }
    }
}

document.addEventListener("DOMContentLoaded", main);
