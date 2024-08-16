const { Op, and } = require("sequelize");
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const crypto = require("crypto");
const bcrypt = require('bcryptjs');
const moment = require('moment');
const users = require('../models/users');

async function deconUser(id) {
    //requête d'un utilisateur par son identifiant avec inclusion de la relation "Role"
    try {
        let user = await db.users.findByPk(id);
        if (user) {
            user.actif = false;
            user.currentToken = "";
            if(!user.save()) return 2
            return  0;
        }else{
            return 0;
        }   
    } catch (error) {
        console.log(error)
        return 2;
    }
}


module.exports = {
    signToken: (id) => {
        let payload = {
            user: {
                _id: id
            }
        }
        let options = {
            //revérifier la durée avant expiration du token
            expiresIn: '2h',
            algorithm: 'RS256'
        }
        try {
            let privateKey = fs.readFileSync(path.join(global.uploadFolder, 'keys', 'private_key.pem'), 'utf8');
            return jwt.sign(payload,privateKey,options)
        }catch (error) {
            console.log(error)
            return 0;
        }
    
    },
    verifyToken: (token) => {
        let options = {
            expiresIn: '2h',
            algorithm: 'RS256'
        }
        try {
            let publickey = fs.readFileSync(path.join(global.uploadFolder, 'keys', 'public_key.pem'), 'utf8');
            return jwt.verify(token,publickey,options)
        } catch (error) {
            console.log(error)
            return 0;
        }
        
    },
    replaceSpaceByUnderscore: (word) => {
        return word.replace(/\s+/g,'_')
    },
    replaceUnderscoreBySpace: (word) => {
        console.log(word)
        return word.replace(/_/g,' ')
    },
    afterTenMinutes: (id) => {
        User.findByPk(id).then(user => {
            if (user.validationToken != "" && user.validationToken != null) {
                user.destroy()
            }
        });
    },
    deleteNotValidetedUsers: () => {
        User.destroy({
            where: {
                validationToken: {
                    [Op.or]: [
                        {
                            [Op.ne]: ""
                        },
                        {
                            [Op.ne]: null
                        }
                    ]
                }
            }
        });
       
    },
    setActifs: () => {
        users.update({actif: false}, {where: {}});
    },
    expired: async (token) => {
        // Verify and decode the token
        const decodedToken = jwt.decode(token, { complete: true });
        // Check if the token has an 'exp' claim
        if (decodedToken && decodedToken.payload.exp) {
            // Get the current time in seconds (UNIX timestamp)
            const currentTime = Math.floor(Date.now() / 1000);

            // Compare the 'exp' claim with the current time
            if (decodedToken.payload.exp <= currentTime) {
                console.log('Token has expired');
                console.log('ID of User if exist: ',decodedToken.payload.user._id)
                const ret = await deconUser(decodedToken.payload.user._id)
                console.log(ret)
                if(ret == 2) return null;
                return true;
            } else {
                console.log('Token is still valid');
                return false;
            }
        } else {
            console.log('Token does not have an expiration claim (exp)');
            return null;
        }

    },
    identifiant: async (m) => {
        const n = crypto.randomInt(m, 9999999);
        console.log(n);
        const salt = await bcrypt.genSalt(12);
        const identifiant =  bcrypt.hash(n,salt)
        return identifiant;
    },
    isEven: (num) => {
        if ((num % 2) == 0) return true;
        return false;
    },
    generateUniqueId: async (id) => {
        //const buffer = crypto.randomBytes(32);
        console.log('In uniq idenifier generator')
        const formattedDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
        console.log('date',formattedDateTime)
        const identifier = id.toString() +  uuidv4() + formattedDateTime ;
        console.log(identifier);
        const salt = await bcrypt.genSalt(12);
        const hashed = await bcrypt.hash(identifier,salt)
        console.log('hashed',hashed);
        //return buffer.toString('hex');
        return {identifier, hashed}
    },
    getStatus: (user) => {
        let status = "";
        if(user.disabled){
            status = "Bloqué";
        }else{
            status = "Actif";
        }
        return status;
    },
    executeSQLFile: async (filePath) =>  {
        try {
            // Lire le contenu du fichier SQL
            const sqlContent = await fs.promises.readFile(filePath, 'utf-8');
    
            // Exécuter les instructions SQL
            await db.sequelize.query(sqlContent);
            console.log('Le script SQL a été exécuté avec succès.');
            return [true,1];
        } catch (error) {
            console.error('Erreur lors de l\'exécution du script SQL :', error);
            return [false, error];
        }
    }

}