const jwt = require("jsonwebtoken");

module.exports = function(req,res,next){

    const token = req.cookies.jwt;

    //if(token == null) next(); //do not do anything if token is not valid, because the site can be used even though the user is not logged in
    console.log("token found");
    jwt.verify(token, process.env.SECRET, function(err,user){
        if(err){
            //console.log(err)
            return next() 
        }
        req.user = user;
        next();
    });
}
