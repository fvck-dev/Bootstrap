//renderizador de peliculas


"use strict";


import { moviesAPI_auto} from "../api/_movies.js";
import { usersAPI_auto} from "../api/_users.js";

//objeto photorenderer que contendrá funciones de renderizado de fotos y luego lo exportamos
//para que pueda ser importado en otros lugares del codigo

const moviesRenderer = {

    //los atributos actuan como funciones
    //renderizador de fotos
    //cambiamos por los atributos que sea, en api/v1 se pueden ver
    asCard : function(movie, users) {

        let html = `
        <div class="row bg-light m-3 border border-dark rounded">
        
          <div class="col-4 ">
            <img src="${movie.imageUrl}" 
            class="mt-3 mb-3 img-fluid embed-responsive-item">
          </div>
          
          <div class="col-4 align-self-center overflow-auto">
            <h3> ${movie.title} </h3>
            <p class="w-100"> ${movie.director} </p>
            <p class="w-100"> ${movie.releaseDate} </p>
            <p class="w-100"> ${movie.durationMinutes} </p>
            </div>

            <div class="col-4 d-flex flex-column justify-content-end overflow-auto">
            <ul class="list-inline mb-3">
                <li class="list-inline-item align-items-bottom">
                <img src="${users.avatarUrl}" class="rounded-circle" height="50">
                </li>
                <li class="list-inline-item">${users.username} - ${users.age}</li>
                <li class="list-inline-item">
                <a class="btn btn-success" href="/create_movie.html?movieId=${movie.movieId}">✏️</a>
                </li>
            </ul>
            </div>
        </div>`;

        return html;

        },

        asCardGallery: async function () { 
            let movies = await moviesAPI_auto.getAll(); 
    
            let html = '';
            
            for(let movie of movies){ 
    
                let user = await usersAPI_auto.getById(movie.userId);
                html += this.asCard(movie , user);
            }
    
            return html;
    
        }


};
export { moviesRenderer };