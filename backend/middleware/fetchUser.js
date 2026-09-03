const jwt = require("jsonwebtoken");
const config = require("../config");

const fetchUser = (req, res, next) => {
    const token = req.header('jwttoken');

    if (!token) {
        return res.status(401).send({ error: "please authenticate using a valid token" });
    }

    try {
        const data = jwt.verify(token, config.jwtSecret);
        req.user = data.user;
        next();
    } catch (error) {
        return res.status(401).send({ error: "please authenticate using a valid token" });
    }
};

module.exports = fetchUser;