"use strict";


import { artistsAPI_auto} from "./api/_artists.js"; //importar la base de datos
import { messageRenderer } from "./renderers/messages.js"; //importar para que se muestren los mensajes de error
import{sessionManager} from "./utils/session.js";
 

// Main function that will run when the page is ready
let URLparams = new URLSearchParams(window.location.search);
let artistId = URLparams.get("artistId"); //aqui cambiar el "bookId" por el id que te de en la base de datos en tables
                                      //eso se mira en visual
let userId = URLparams.get("userId");


function main() {
    //book-form es el id que le he puesto al formulario
    document.getElementById("artist-form").onsubmit = sendForm;
    //esto es que cuando detecte el book-form y le das a submit se envie el formulario (que es la formula de abajo)
    if(artistId){
        /*lo que hace esque si detecta un bookId cambia el titulo a edit book para que cuando le des al boton 
        de editar aparezca editar libro en lugar de crear libro y luego lo del boton es lo mismo para que aparezca 
        actualizar en lugar de crear */
         
        document.getElementById("title").innerHTML = "Edit Artist";
        document.getElementById("btn").innerHTML = "Update";
        loadForm(); //esto es para cargar el formulario
    }
}


async function sendForm(event){
    let form = event.target;
    event.preventDefault();

    
    

    

    try{
        let formData = new FormData(form);

        
        if(artistId == null){
            formData.append("userId", sessionManager.getLoggedId());

        } 
        if(artistId != null) {
            let currentArtist = await artistsAPI_auto.getById(artistId); 
            if(currentArtist.userId != sessionManager.getLoggedId()){
                messageRenderer.showErrorMessage("Los usuarios tienen que coincidir");
                return;
            }
            formData.append("userId", sessionManager.getLoggedId());

        }

        
        if (formData.get("name").length < 3 && formData.get("name").length % 5 != 0) {
            messageRenderer.showErrorMessage("La longitud de name debe ser de al menos 3 caracteres y múltiplo de 5");
            return;
        }

        if(formData.get("numAlbums") > 20 || formData.get("numAlbums") < 0){
            messageRenderer.showErrorMessage("Albums no puede ser menor que 0 ni mayor que 20");
            return;
        }


        if (!sessionManager.isLogged()) {
            messageRenderer.showErrorMessage("No puedes crear una foto si no estás conectado");
            return;
        }

        
        if(artistId){
            await artistsAPI_auto.update(formData, artistId);
        }
        else{
            await artistsAPI_auto.create(formData);
        }

        window.location.href = "/artist.html";

    }catch(err){
        messageRenderer.showErrorMessage(err);

    }

}
    
async function loadForm(){
    let currentArtist = await artistsAPI_auto.getById(artistId); //aqui cargas los books en funcion de la id
    //name, bio, startDate, imageUrl, numAlbums

    //Lo que hay entre parentesis es el id de los input en el create_book.html
    let inputName = document.getElementById("name-input"); 
    let inputBio = document.getElementById("bio-input");
    let inputStartDate = document.getElementById("startDate-input");
    let inputImageUrl = document.getElementById("imageUrl-input");
    let inputNumAlbums = document.getElementById("numAlbums-input");



    try{
        inputName.value = currentArtist.name;
        inputBio.value = currentArtist.bio;
        inputStartDate.value = currentArtist.startDate;
        inputImageUrl.value = currentArtist.imageUrl;
        inputNumAlbums.value = currentArtist.numAlbums;

        

    }catch(error){
        messageRenderer.showErrorMessage(error);
    }
}


document.addEventListener("DOMContentLoaded", main);
