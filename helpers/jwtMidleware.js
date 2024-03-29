const jwt = require('jsonwebtoken');

module.exports.verfyJWT = (req, res, next) => {

    const authHeader = req.headers.authorization;

    // console.log(authHeader);

    if (!authHeader) {
        return res.status(401).send({ message: "anathorizrd access" });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: "anathorizrd access" });
        }

        req.decoded = decoded;
        next();
    });

};