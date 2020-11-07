const authenticator = (req, res, next) => {
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.append("WWW-Authenticate", 'Basic realm="User Visible Realm", charset="UTF-8"').status(401).end()
    }

    const credentials = req.headers.authorization.split(' ')[1];
    const [email, password] = Buffer.from(credentials, 'base64').toString('UTF-8').split(":");

    const user = authenticate(email, password)
    if (user) {
        return res.status(403).end()
    }
    next();
}

function authenticate(email, password) {
    return email && password;
}


module.exports = authenticator;