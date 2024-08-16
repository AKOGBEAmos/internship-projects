const express = require("express");
const router = express.Router();

let routes = (app) => {
    /**
     * 
     */
    router.get('/', (req,res)=> {
        res.status(200).json({msg: 'Welcome to login page '})
    });

    
    // Register
    app.use('/login', require('./login'));
   
    //Reset
    app.use('/update', require('./session'));
    /*  404 */
    //The 404 Route (ALWAYS Keep this as the last route)
    router.get('*', function(req, res){
        res.status(404).send("Page not Found");
    });

    router.post('*', function(req, res){
        res.status(404).send("Wrong page");
    });

    router.put('*', function(req, res){
        res.status(404).send("Page not Found");
    });

    router.delete('*', function(req, res){
        res.status(404).send("Page not Found");
    });
    /* ROUTES TO APP */
    return app.use("/", router);
};

module.exports = routes;