const express = require('express');
const multer  = require('multer');
const upload = multer();
const mongoose = require("mongoose");
const Recipe = require("../models/Recipe.js")
const Category = require("../models/Category.js")
const Image = require("../models/Image.js")
const User = require("../models/User.js")
const router = express.Router();

const mongoDB = "mongodb://localhost:27017/projectdb";
mongoose.connect(mongoDB);
mongoose.Promise = Promise;
const db = mongoose.connection;
db.on("error",console.error.bind(console, "MongoDB connection error"));

const jwt = require("jsonwebtoken");
const validateToken = require("../auth/validateToken.js")
const bcrypt = require("bcryptjs");
const {body, validationResult} = require("express-validator");

let loginToken;





router.get('/post/', function(req, res, next) {
    res.render('postComment', { title: 'Ask a question' });
});


/* GET recipes page. */

router.get('/recipe/', function(req, res, next) {

    Recipe.find({}, (err, recipes) => {
        if (err){
            return next(err)
        }
        if(recipes){
            //console.log(recipes)
            return res.json(recipes);
        } else{
            return res.status(404).send("Recipes not found")
        }
    })
});


router.get('/recipe/:id', function(req, res, next) {

    Recipe.find({"name":req.params.id}, (err, recipe) => {
        if (err){
            return next(err);
        }
        if (recipe.length > 0) {
            console.log(recipe[0].name)
            return res.send(recipe[0])
        } else {
            return res.status(404).send(`Recipe with name ${req.params.id} not found!`)
        }
    })

});

router.post('/recipe/', function(req, res, next) {

    Recipe.findOne({ name: req.body.name}, (err, recipe) => {
        if(err) {
            return next(err);
        }
        if(!recipe) {
            new Recipe({
                name: req.body.name,
                question: req.body.question,
                comments: req.body.comments,
                categories: req.body.categories,
                images: req.body.images

            }).save((err) => {
                if(err) {
                    return next(err);
                }
                return res.send(req.body)
            });
        }
        else{
            return res.status(403).send("Already has that recipe!")
        }
    })
});

router.post('/cat', function(req, res, next) {

    Category.findOne({ name: req.body.name}, (err, category) => {
        if(err) {
            return next(err);
        }
        if(!category) {
            new Category({
                name: req.body.name,
            }).save((err) => {
                if(err) {
                    return next(err);
                }
                return res.send(req.body)
            });
        }
        else{
            return res.status(403).send("Already has that category!")
        }
    })
});

/* GET special diet categories */


router.get('/cat', function(req, res, next) {
    Category.find({}, (err, categories) => {
        if (err){
            return next(err)
        }
        if(categories){
            let catObject = []
            for (let i=0;i<categories.length;i++){
                catObject.push({"name": categories[i].name, "id": categories[i]._id})
            }
            console.log(catObject)

            return res.json(catObject);
        } else{
            return res.status(404).send("Categories not found")
        }
    })
});

router.get('/imagenames/:id', function(req, res, next){
    Image.find({name: req.params.id}, (err, images) => {
        if (err){
            return next(err)
        }
        if(images){
            let imgObject = []
            for (let i=0;i<images.length;i++){
                imgObject.push({"id": images[i]._id})
            }
            console.log(imgObject)

            return res.json(imgObject);
        } else{
            return res.status(404).send("Image names not found")
        }
    })
});

router.get('/images/:id', function(req, res, next){
    Image.findOne({_id: req.params.id}, (err, images) => {
        if (err){
            return next(err)
        }
        if(images){
            let mimetype = images.mimetype
            let buffer = images.buffer.toString('base64')

            res.setHeader('content-type', mimetype);
            res.setHeader('content-disposition', 'inline');

            let resObj = {

                "mimetype": mimetype,
                "buffer": buffer

            }

            return res.send(resObj);
        } else{
            return res.status(404).send("Images not found")
        }
    })
});

router.post('/images/', upload.array('images', 12), function(req, res, next) {

    resBody = []

    for(let i=0;i<req.files.length;i++){
        console.log(req.files[i].originalname)

        Image.findOne({ name: req.files[i].originalname}, (err, image) => {
            if(err) {
                return next(err);
            }
            if(!image) {
                new Image({
                    name: req.files[i].originalname,
                    encoding: req.files[i].encoding,
                    mimetype: req.files[i].mimetype,
                    buffer: req.files[i].buffer

                }).save((err) => {
                    if(err) {
                        return next(err);
                    }
                    //resBody.push(req.files[i])
                });
            }
            // else{
            //     return res.status(403).send("Already has that image!")
            // }
        })
    }
    //console.log(resBody)
    res.send(req.files)
});


// ーーーーーーーーーーーーーーーーーーーーーーーー

// LOGIN

// ーーーーーーーーーーーーーーーーーーーーーーーー





router.get('/private', validateToken, function(req, res, next) {
    req.headers.authorization = "Bearer "+loginToken;
    console.log(req.headers)

    User.find({}, function(err,users){
        if(err) return next(err);
        res.render('postComment', { title: 'Ask a question' });
    })
    res.send({"email": req.body.email})
});

//registering

router.get('/user/register', function(req, res, next) {
    res.render('register');
});

router.post('/user/register',
body("email").isLength({min: 3}).trim().escape(),
body("password").isLength({min: 5}),
function(req, res, next) {

    console.log(req.body)
    
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    User.findOne({email: req.body.email}, function(err,user) {
        if(err) throw err;
        if(user){
            return res.status(403).json({email: "Email already in use"});
        }
        else{
            console.log("Adding new user lolz: ")
            console.log(req.body.email)
            bcrypt.genSalt(10, function(err,salt) {
                bcrypt.hash(req.body.password, salt, function(err,hash){
                    if(err) throw err;
                    User.create({
                        email: req.body.email,
                        password: hash
                    },function(err,ok){
                        if(err) throw err;
                        return res.redirect("/user/login")
                    })
                })
            })
        }
    });
});

router.get('/user/login', function(req, res, next) {
    res.render('login');
});

router.post('/user/login', 
body("email").isLength({min: 3}).trim().escape(),
body("password").isLength({min: 5}),
function(req, res, next) {

    console.log("logging in with:")
    console.log(req.body)

    const user = User.findOne({email: req.body.email}, function(err,user){
        if(err) throw err;
        if(!user){
            return res.status(403).json({message: "Email or password wrong"})
        }
        else{
            console.log("checking password...")
            bcrypt.compare(req.body.password, user.password, function(err, isMatch){
                if(err) throw err;
                if(isMatch){
                    const jwtPayload = {
                        id: user._id,
                        email: user.email
                    }
                    jwt.sign(
                        jwtPayload,
                        process.env.SECRET,
                        {
                            expiresIn: 120
                        },
                        function(err,token){
                            loginToken = token;
                            res.json({success: true, token, user})
                        }
                    )
                }
                else{
                    return res.status(403).json({message: "Email or password wrong"})
                }
            })
        }
    })
    
});

module.exports = router;