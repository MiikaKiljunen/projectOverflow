const jwt = require("jsonwebtoken");

module.exports = function(req,res,next){
    const authHeader = req.headers["authorization"];
    let token;
    if(authHeader){
        token = authHeader.split(" ")[1];
    }
    else{
        token = null;
    }
    if(token == null) return res.sendStatus(401);
    console.log("token found");
    jwt.verify(token, process.env.SECRET, function(err,user){
        if(err)return res.sendStatus(401);  
        req.user = user;
        next();
    });
}
