const { make } = require('simple-body-validator');
const validator = require('validator');
const { body, validationResult } = require('express-validator');

function areAllValuesInArray(a, b) {
    return a.every(value => b.includes(value));
}
const createValidator = [
    //rechecker le contrôle sur le format des paramètres de requête.
    body('nom').isAlpha(),
    body('prenom').isAlpha(),
    body('email').isEmail(),
    body('username').isAlphanumeric(),
    body('date_naissance', 'Invalid date').isDate().isISO8601(),
    body('genre').isString().isLength({ min: 1, max: 1 }),
    body('telephone').isMobilePhone(),
    body('password', 'password does not Empty').not().isEmpty().custom((value) => {
        if (!validator.isStrongPassword(value, {
            minLength: 12,
            minLowercase: 3,
            minUppercase: 3,
            minNumbers: 3,
            minSymbols: 1,
            returnScore: false
        })){
            throw new Error('Le mot de passe doit être complexe et contenir au moins 12 caractères, dont au moins 3 lettres minuscules, 3 lettres majuscules, 3 chiffres et 1 symbole.');
        }
        return true;
    }),
];

//Fonction de validation de la requête de login
const loginBodyCheck = (req, res)=>{
    const valueRequire = ['email', 'password'];
    let keys = Object.keys(body);
    const validLogin  = areAllValuesInArray(keys, valueRequire);
    if (validLogin) {
        const validateRegistration = [
            body('email').isEmail().normalizeEmail(),
            body('password').isLength({ min: 5, max: 20 }),
            
            // Gérer les erreurs de validation
            /* async (req, res) => {
            await Promise.all(validateRegistration.map(validation => validation.run(req)))
              const errors = validationResult(req);
              if (!errors.isEmpty()) {
                return ('wrong request');
              }
              else
              {
                return true;
              } 
            }*/
          ];
          return true;
    }
    else {
        return false;
    }
}
    

module.exports = {
    createValidator,
    loginBodyCheck
}