const database = require("./storagehandler");
const User = require("./user")

const authenticator = (req, res, next) => {
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.append("WWW-Authenticate", 'Basic realm="User Visible Realm", charset="UTF-8"').status(401).end()
    }

    const credentials = req.headers.authorization.split(' ')[1];
    const [username, password] = Buffer.from(credentials, 'base64').toString('UTF-8').split(":");

    let user = new User(username, password);
    let isValid = validate(user.username, user.password); // denne funksjonen finnes ikke enda så den må lages. 
    if (!isValid) {
        return res.status(403).end()
    }
    req.user = user; 
    next();
}   

  async function validate(username, password) {
        try {
            let respons = await database.retrieveUser(username, password);  
            console.log(respons);
            if(respons.username === username && respons.password === password) {
                return {username, password} ;
            }
            return null;

        } catch (error) {
            console.error(error)
        }
    }

module.exports = authenticator;