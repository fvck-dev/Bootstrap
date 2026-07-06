"use strict";

import { artistsAPI_auto} from "../api/_artists.js";
import { usersAPI_auto } from "../api/_users.js"; 


//aqui se modifica toda la carta
//Para saber que es md-4 se hace 12/ entre el numero de columnas que en este caso es 3 por lo que 12 /3 = 4 

const artistRenderer = {
    
    asCard: function (artist , users) {
        let html = `
        <div class="row bg-light m-3 border border-dark rounded">
        
          <div class="col-4 ">
            <img src="${artist.imageUrl}" 
            class="mt-3 mb-3 img-fluid embed-responsive-item">
          </div>
          
          <div class="col-8 align-self-center overflow-auto">
            <h3> ${artist.name} </h3>
            <p class="w-100"> ${artist.bio} </p>
            <ul class="list-inline">
                <li class="list-inline-item align-ittems-bottom"><img src="${users.avatarUrl}" 
                    class="rounded-circle"
                    height="50 "></li>
                <li class="list-inline-item ">${users.username} - ${users.age}</li>
                <li class="list-inline-item "><a class="btn btn-success" href="/createArtist.html?artistId=${artist.artistId}">
                                ✏️</a></li>                
              </ul>
          </div>
        
        </div>` ;

        return html;
    },
    
    asCardGallery: async function () { 
        let artists = await artistsAPI_auto.getAll(); 

        let html = '';
        
        for(let artist of artists){ 

            let user = await usersAPI_auto.getById(artist.userId);
            html += this.asCard(artist , user);
        }

        return html;

    }
};


export { artistRenderer};