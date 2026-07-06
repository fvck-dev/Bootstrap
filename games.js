"use strict";

const gameValidator = {

    validateRegister: function (formData) {
        let errors = [];

        let title= formData.get("title");
        let developer = formData.get("developer");
        let reviewScore = Number(formData.get("reviewScore"));
        let imageUrl = formData.get("imageUrl");
        let releaseDate = formData.get("releaseDate");

        if (title.length === 0 || developer.length === 0 || reviewScore.length === 0 || imageUrl.length === 0 || releaseDate.length === 0) {
            errors.push("The fields must not be empty");
        }

        if (title.length === developer.length){
            errors.push("The fields titile and developer must not be the same length");
        }

        return errors;
    }

};

export { gameValidator };
