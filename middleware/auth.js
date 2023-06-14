const jwt = require("jsonwebtoken");
const { config } = require("../config/secret");

exports.auth = (req, res, next) => {
    let token = req.header("x-api-key");
    if (!token) {
        return res.status(401).json({ msg: "you must send token" });
    }
    try {
        let decodeToken = jwt.verify(token, config.tokenSecret);
        req.tokenData = decodeToken;
        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({ msg: "Token invalid" });
    }
}

exports.authAdmin = (req, res, next) => {
    let token = req.header("x-api-key");
    if (!token)
        return res.status(401).json({ msg: "you must send token" });
    try {
        let decodeToken = jwt.verify(token, config.tokenSecret);
        if (decodeToken.role != "admin") {
            return res.status(401).json({ msg: "token invalid or expired" })
        }
        req.tokenData = decodeToken;
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({ msg: "Token invalid or expired, log in again" })
    }
}