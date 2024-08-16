const express = require('express');
const db = require('../models');
const bodyCheck = require('../helpers/bodyCheck');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');
const config = require('dotenv').config();
const axios = require('axios');
const utils = require('../helpers/utils');
const session = require('express-session');
const moment = require('moment'); 
const password = require('password');
const { where } = require('sequelize');
const validtoken = require('../models/validtoken');


const login = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: 'Le corps de la requête est vide ou non défini.' });
    }

    if (!req.session) {
        req.session = {};
    }

    if (!req.session.cookie) {
        req.session.cookie = {
            _expires: new Date(Date.now() + 60 * 60 * 1000),
            originalMaxAge: 60 * 60 * 1000,
            secure: true
        };
    }

    const { email, password } = req.body;
    const bodyIsOk = bodyCheck.loginBodyCheck(req.body);
    if (!bodyIsOk) {
        return res.status(400).json({ error: "Mauvaise Requête" });
    }

    const id = await axios.get(`http://localhost:5000/register/getid/${email}`);

    // Compter le nombre de sessions actives pour l'utilisateur
    const nb_con = await db.Session.count({
        where: {
            user_id: id.data.user_id
        }
    });

    // Vérifier si le nombre de sessions dépasse la limite
    if (nb_con >= 3) {
        return res.status(401).json({ error: "Utilisateur déjà actif" });
    }

    const user = await axios.get(`http://localhost:5000/register/getuser/${email}`);
    const isMatch = await bcrypt.compare(password, user.data.password);

    function timer() {
        const session_start_time = req.session.cookie._expires;
        const session_duration_ms = new Date() - session_start_time;
        let session_timeout = "";

        if (session_duration_ms < 1000 * 60) {
            session_timeout = `${Math.round(session_duration_ms / 1000)}s`;
        } else if (session_duration_ms < 1000 * 60 * 60) {
            session_timeout = `${Math.round(session_duration_ms / (1000 * 60))}m`;
        } else if (session_duration_ms < 1000 * 60 * 60 * 24) {
            session_timeout = `${Math.round(session_duration_ms / (1000 * 60 * 60))}h`;
        } else if (session_duration_ms < 1000 * 60 * 60 * 24 * 30) {
            session_timeout = `${Math.round(session_duration_ms / (1000 * 60 * 60 * 24))}d`;
        } else if (session_duration_ms < 1000 * 60 * 60 * 24 * 365) {
            session_timeout = `${Math.round(session_duration_ms / (1000 * 60 * 60 * 24 * 30))}m`;
        } else {
            session_timeout = `${Math.round(session_duration_ms / (1000 * 60 * 60 * 24 * 365))}y`;
        }
        return session_timeout;
    }

    if (!isMatch) {
        return res.status(400).json({ error: "Invalid Credentials" });
    }

    // Création du token avec l’id de session
    const jwtToken = utils.signToken(id.data.user_id);
    if (jwtToken != 0) {
        // Création d'une nouvelle session utilisateur
        try {
            const user_session = await db.Session.create({
                access_token: jwtToken,
                ip_addr: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                user_agent: req.headers['user-agent'],
                last_connexion_hour: new Date(),
                session_timeout: timer()
            });

            const ValidToken = await db.ValidToken.create({
                token: jwtToken,
                exp_date: new Date(Date.now() + 0.03 * 60 * 60 * 1000)
                //Valeur d'expiration provisoire pour les tests de fonctionnement.
            });

            if (!ValidToken) {
                return res.status(500).json({ error: "User not login" });
            } else {
                await user_session.setValidtoken(ValidToken);
                await user_session.save();
            }
            const saltPass = await bcrypt.genSalt(12);

            //Vérification que l'utilisateur n'existe pas déjà avant son rajout.
            const user_exist = await db.users.findOne({ where: { email: email } });
            
            if (!user_exist) {
                try {
                    // Créer un nouvel utilisateur s'il n'existe pas déjà
                    const auth_user = await db.users.create({
                        username: user.data.username,
                        email: email,
                        password: await bcrypt.hash(password, saltPass)
                    });
        
                    await auth_user.set__session(user_session);
                    await auth_user.save();
        
                    res.status(200).json({
                        message: 'User login is successful and user saved.'
                    });
                } catch (error) {
                    //console.log(error);
                    res.status(400).json({
                        error: 'Échec de la création de l\'utilisateur'
                    });
                }
            } else {
                try {
                    const auth_user = await db.users.findOne({ where: { email: email } });
                    console.log(auth_user);
                    await auth_user.set__session(user_session);
                    await auth_user.save();
        
                    res.status(200).json({ msg: 'User login is successful  and session linked to user' });
                } catch (error) {
                    res.status(400).json({
                        error: 'Échec de la liaison de la session à l\'utilisateur existant'
                    });
                }
            }      
        } catch (error) {
            console.log(error);
            res.status(400).json({
                error: 'Something is wrong'
            });
        }
    }
}

const resetEmail = async (req, res) =>{
    const { email, resetPasswd} = req.body;
    //Identifier l'utilisateur concerné.
    const user = await db.users.findOne({ where: { email: email}})
    const resetToken = utils.identifiant(user.id);
    if(resetPasswd ==1){
        try{
            if(email != null){
                if (!user){
                    return res.status(404).json({error: "Cet utilisateur n'existe pas."});
                }
                const mailData = res.status(200).json({ 
                type: 1,
                to: email, 
                token: resetToken, 
                useCase: "Password_reset",
                addrUrl: process.env.ADDR_URL
                });
                await axios.post('http://127.0.0.1:5000/mail/sendMsgByMail', mailData);   
        }
        else{
            return res.status(404).json({error: "Requête invalide"});
        }
        }catch{
            return res.status(500).json({error: 'Unsuccessfull operation.'});
        }
    }
}

const resetPassword = async (req, res) =>{
    const { email, newPasswd} = req.body;
    const user = await db.users.findOne({ where: { email: email}})
    const saltPass = await bcrypt.genSalt(12);

    let data = {
        email:email,
        password : await bcrypt.hash(newPasswd, saltPass)
    }
    const resetToken = utils.signToken(user.id);
    let validToken = utils.expired(resetToken);
    if(validToken){
        //Write the passwordrst controller in register.js
        const response = await axios.post('http://127.0.0.1:5000/validation/passwordreset', data );

        if (response.data.msg){
            return res.status(200).json({msg:'Mot de passe changé avec succès.'});
        }
        else{
            return res.status(404).json({error:'Opération avortée.'});
        }
    }
    else{
        console.log('Le token de réinitialisation a expiré.');
        if (!validToken){
            resetToken = utils.identifiant(user.id);
        }
        await axios.post('http://127.0.0.1/mail/sendMsgByMail', mailData);   
    }
}

//Fonction de déconnexion
const deconnection = async(req, res) =>{
    const {user_id, user_login} = req.params;
    
    console.log(user_id);
    const user_session = await db.Session.findOne({where: {user_id:user_id}});
    if(user_login == 0){
       try{
        await db.ValidToken.destroy({where:{session_id : user_session.id}});
        await db.Session.destroy({where:{id:user_session.id}});
        await db.users.destroy({where:{id:user_id}})
        res.status(200).json({msg:'Deconnection successful'});
       }catch{
        res.status(400).json({error:'Session error'});
       }
    
    }
    else
    {
        res.status(401).json({error:'You are not authorized to do so.'})
    }
}

//gestion des sessions
const expiredSession = async (req, res) => {
    const {email, password} = req.body;
    try {
        // Récupérer tous les utilisateurs
        const users = await db.users.findAll({
            order: [['createdAt', 'DESC']]  
        });

        for (const user of users) {
            const user_id = user.id;

            // Récupérer toutes les sessions de l'utilisateur
            const user_sessions = await db.Session.findAll({
                where: { user_id: user_id },
                order: [['createdAt', 'DESC']] // Trier par date de création décroissante
            });

            const validSessions = [];

            // Vérifier la validité de chaque session
            for (const user_session of user_sessions) {
                const sessionToken = await db.ValidToken.findOne({ where: { session_id: user_session.id } });
                const validtoken = utils.expired(sessionToken.token);
                if (validtoken) {
                    validSessions.push({ session: user_session, token: sessionToken });
                }
            }

            // Si l'utilisateur a plus de trois sessions valides, supprimer les plus anciennes
            if (validSessions.length > 1) {
                const sessionsToDelete = validSessions.slice(1); 
                for (const { session, token } of sessionsToDelete) {
                    await db.ValidToken.destroy({ where: { id: token.id } });
                    await db.Session.destroy({ where: { id: session.id } });
                }
            } 
            else if (validSessions ==0){
                try{
                    const user = await axios.get(`http://localhost:5000/register/getuser/${email}`);
                    const isMatch = await bcrypt.compare(password, user.data.password);

                    if (isMatch){
                        // Création d'un nouveau token avec l’id de session
                        let session = user_sessions[0];
                        const newToken = utils.signToken(utils.identifiant(session.id));
                        if (jwtToken != 0) {
                            //Mise à jour de la session utilisateur
                            try {
                                const ValidToken = await db.ValidToken.create({
                                    token: newToken,
                                    exp_date: new Date(Date.now() + 0.05 * 60 * 60 * 1000)
                                    //valeur fixée pour les tests
                                });
                
                                if (!ValidToken) {
                                    return res.status(500).json({ error: "Session not restored" });
                                } else {
                                    await session.setValidtoken(ValidToken);
                                    await session.save();
                                }
                            }catch{
                                res.status(500).json({error: "Error when authenticating. Try signin again."})
                            }
                        }
                    }
                }catch{
                    res.status(500).json({error:"Invalid session detected"})
                }
                
            }   
        }
        res.status(200).json({ message: 'Restauration de session en cours.' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la gestion des sessions' });
    }
};

module.exports = {
    login, 
    resetEmail, 
    resetPassword,
    deconnection,
    expiredSession
}