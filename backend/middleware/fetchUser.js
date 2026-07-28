const jwt = require("jsonwebtoken");
const JWT_SECRETKEY = 'Kashaf';
const fetchUser = (req , res , next)=> {
    //get user from jwt token
    const token = req.header ('jwttoken');
    if(!token){
        res.status(401).send({error : "please authenticate using a valid token"})
    }
    try {
        const data = jwt.verify(token , JWT_SECRETKEY);
        req.user = data.user;;
        next()

    } catch (error) {
        res.status(401).send({error : "please authenticate using a valid token"})
    }
}

module.exports = fetchUser;