# Microservice d'authentification (connexion)
Le rôle de ce microservice est de permettre l'authentification sécurisée des utilisateurs lors de la connexion à leur compte utilisateur. 

Il utilise les technologies suivantes :

- Node.js
- Express.js
- Sequelize pour l'ORM (avec une base de données SQL)
- bcrypt pour le hachage des mots de passe
- axios pour la communocation inter-microservice
- JWT pour la gestion des tokens de session

# Fonctions Principales

## Connexion au compte utilisateur

La connexion des utlisateurs se fait au moyen d'une requête POST qui est envoyé à  l'API via la route /login. L'utilisateur tente de se connecter en entrant en email et son mot de passe de connexion.  Une fois qu'il entame la procédure de connexion, les idetntifiantns qu'il a entré sont comparés avec ceux qui sont enregistrés dans la base de données des inscriptions, en utilisant la fonction getuser et le protocole axios.
Si les identifiants de connexion sont valides on enregistre alors immédiatement la  nouvelle connexion de l'utisateur et on crée une nouvelle session de connexion ainsi que token de session pour assurer l'intégrité de la session utilisateur.


## Gestion des sessions

Pour améliorer la sécurité, la politique de gestion des sessions que nous avons utilisé, fixe des délais d'expiration pour les tokens de session
ainsi que pour les tokens de session. Une limite de trois différentes sessions est la limite autorisée pour un même utilisateur.  Au delà les an-
ciennes sessions sont supprimées. En cas d'expiration d'une session,  l'utilisateur est automatiquement déconnecté et il lui est demandé de se re-
connecter. Une fois reconnecté, on lui attribue la nouvelle session ainsi qu'un token pour sa session.

La vérification de la validité de session se fait sur la route POST /validation/sessions
## Mise à jour du  mot de passe 

Deux cas sont  à  prendre en compte ici: La mise à  jour volontaire et la réinitialisation du mot de passe en cas d'oubli.
Le premier cas n'est pas encore géré. Mais c'est en perspective, 
Le deuxième parcontre a été géré et se passe en quatre étapes: 
    1- resetPasswd 0--->1
    2- envoi du mail contenant un token de réinitialisation du mot de passe ( exp_date: 30 minutes)
    3- Définition du nouveau de passe
    4- Clear and set of new passwd. (Table d'inscription)

    Le token peut être réinitialisé en cas d'expiration lors de la procédure de réinitialisation. 

La procédure se fait sur la route POST /validation/passwordreset.

## Déconnexion de l'utilisateur
 
La déconnexion de l'utilisateur est assuré au moyen d'une variable user_login initialisé à  1 et qui passe à  0 lorsque l'utilisateur décide de se déconnecter.
Une fois que c'est fais on supprime de la base de données des connections actives, ses identifiants ainsi que sa session utilisateur.

Ceci se fait via la route POST /login/deconuser/:user_id/:user_login


# Configuration
Assurez-vous de configurer les variables d'environnement nécessaires telles que les clés secrètes pour le chiffrement et la validation des jetons.

DB_HOST=$HOSt_DB
DB_USER=$USER
DB_PASS=$DB_PASSWORD
DB_NAME=$DB_NAME
JWT_SECRET=$JWT_TOKEN
ENCRYPTION_KEY=$KEY


# Modèles
Trois modèles sont utilisés dans ce microservice: 
users: contient les informations des utilisateurs (email, mot de passe)
Session : contient les informations de session des utilisateurs (user_id, access_token, etc.)
ValidToken:  contient les informations sur les tokens de validité de session.



