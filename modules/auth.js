const database = require("./storagehandler");
const User = require("./user")

const authenticator = async (req, res, next) => {
    try {
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.append("WWW-Authenticate", 'Basic realm="User Visible Realm", charset="UTF-8"').status(401).end()
    }

    const credentials = req.headers.authorization.split(' ')[1];
    const [username, password] = Buffer.from(credentials, 'base64').toString('UTF-8').split(":");

    let user = new User(username, password);
    let isValid = await validate(user.username, user.password)
    if (!isValid) {
        return res.status(403).end()
    }
    user.valid = true;
    user.userid = isValid.userid;
    req.user = user; 
    next();
    } catch (error) {
            console.error(error)
        }
}   

  async function validate(username, password) {
        try {
            let respons = await database.retrieveUser(username, password);
            if(username === respons.username && password === respons.password) {
                return respons;
            }
            return null;

        } catch (error) {
            console.error(error)
        }
    }

module.exports = authenticator;