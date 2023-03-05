const express = require('express');
const multer  = require('multer');
const mongoose = require("mongoose");
const Recipe = require("../models/Recipe.js")
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

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());



//some routes are recipes because of the roots of the program. recipes are posts basically.


router.get('/', validateToken, function(req, res, next) {
    res.locals.user = req.user;
    res.render('index')
});

router.get('/post/', validateToken, function(req, res, next) {
    res.locals.user = req.user;
    res.render('postComment', { title: 'Ask a question' });
});



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




router.post('/recipe/', function(req, res, next) {

    Recipe.findOne({ name: req.body.name}, (err, recipe) => {
        if(err) {
            return next(err);
        }
        if(!recipe) {
            new Recipe({
                name: req.body.name,
                question: req.body.question,
                code:req.body.code

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


router.get('/posts/:id', validateToken, function(req, res, next) {

    Recipe.find({"name":req.params.id}, (err, recipe) => {
        if (err){
            return next(err);
        }
        if (recipe.length > 0) {
            //console.log(recipe[0].name)
           // return res.send(recipe[0])

            let post = recipe[0]
            //console.log(post)

            const user = req.user;
            res.render('viewpost', {post,user}) //pass the post and user as variables to the template engine

        } else {
            return res.status(404).send(`Recipe with name ${req.params.id} not found!`)
        }
    })

});

router.post('/newcomment/:id',function(req,res,next){

    Recipe.find({"name":req.params.id}, (err, recipe) => {

        const post = recipe[0]
        post.comments.push(req.body.commentText)
        post.save();

        res.redirect('/posts/'+req.params.id);

    })
})


// ーーーーーーーーーーーーーーーーーーーーーーーー

// LOGIN

// ーーーーーーーーーーーーーーーーーーーーーーーー



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

//logging in and out

router.get('/user/login', function(req, res, next) {
    res.render('login');
});

router.get('/user/logout', function(req, res, next) {
    res.clearCookie('jwt');
    res.redirect('/')
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
                            expiresIn: 1200
                        },
                        function(err,token){
                            res.cookie('jwt', token, { httpOnly: true });
                            res.redirect('/')
                        }
                    )
                }
                else{
                    return res.status(401).json({message: "Email or password wrong"})
                }
            })
        }
    })
    
});

module.exports = router;