const jwt = require("jsonwebtoken")
require('dotenv').config()
const adminController = require("../controllers/admin.controller")

function createJWT(id, user, email, role) {
    return new Promise((resolve, reject) => {
        // Declaramos en un objeto los claims o info del token
        const claims = {
            id: id,
            user: user,
            email: email,
            role: role
        };

        // Se firma el token y lo resolvemos o rechazamos la promesa
        jwt.sign({ claims }, process.env.SECRET_KEY, (err, token) => {
            if (err) {
                reject(err); // Rechazamos la promesa con el error
            } else {
                resolve(token); // Resolvemos la promesa con el token
            }
        });
    });
}

function decodeJWT(token) { //decodifica token
    var decoded = jwtDecode(token)
    return decoded
}

//Recibe el token JWT por header, revisa que este bien y lo regresa en el req
function tokenMiddleware(req, res, next) {
    //obtiene el token por header
    const bearerHeader = req.headers['authorization']
    //mientras no este vacio
    if (typeof bearerHeader !== 'undefined') {
        //dividimos el token en 2 partes ya que viene como 'Bearer asasjkjndjand' y se le quita 'Bearer '
        const bearerToken = bearerHeader.split(" ")[1];
        //Verificamos la forma del token y si es correcta permite el paso al controlador, si no envia mensaje de error
        jwt.verify(bearerToken, process.env.SECRET_KEY, (error, auth) => {
            if (error) {
                res.status(403).json({ message: error.message })
            } else {
                const tokenInfo = jwt.decode(bearerToken)
                adminController.checkSession(tokenInfo.claims.id).then((isLogged) => {
                    if(isLogged){
                        req.token = bearerToken
                        next()
                    } else {
                        res.status(403).json({
                            message: "El token expiro o tienes session en otro dispositivo",
                            type: "session"
                        })
                    }
                });
            }
        })
    } else {
        res.status(403).json({ message: "You don't have access, please login." })
    }
}

function verificarToken(req, res) {
    // Obtiene el token del encabezado
    const bearerHeader = req.headers['authorization'];

    // Si el token está presente
    if (typeof bearerHeader !== 'undefined') {
        // Divide el token en 2 partes ('Bearer asasjkjndjand' -> ['Bearer', 'asasjkjndjand'])
        const tokenParts = bearerHeader.split(" ");
        
        // Verifica que el token tenga dos partes y comienza con 'Bearer'
        if (tokenParts.length === 2 && tokenParts[0] === 'Bearer') {
            const bearerToken = tokenParts[1];

            // Verifica la validez del token
            jwt.verify(bearerToken, process.env.SECRET_KEY, (error, auth) => {
                if (error) {
                    // Token inválido
                    res.status(403).json({ message: "false" });
                } else {
                    // Token válido
                    req.token = bearerToken;
                    res.status(200).json({ message: "true" });
                }
            });
        } else {
            // Token no tiene el formato correcto
            res.status(403).json({ message: "sin formato" });
        }
    } else {
        // Token no presente en el encabezado
        res.status(403).json({ message: "no hay token" });
    }
}

module.exports = {
    createJWT,
    decodeJWT,
    tokenMiddleware,
    verificarToken
}