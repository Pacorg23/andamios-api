const Users = require('../models/admin/usuarios');
const Activity = require('../models/admin/user_activity');
const bcrypt = require('bcrypt');
const jwt = require('../auth/jwt.auth');
const generator = require('../auth/jwtGenerator-new');
const _ = require('lodash');

const ADMIN_ROLE = 'admin';
const SESSION_LOGGED = 'logged';

async function login(req, res) {
    const { usuario, password } = req.body;

    await Users.findOne({ where: { user: usuario } }).then(result => {
        //res.status(200).send(result)
        let obj = result
        bcrypt.compare(password, result.pass, (err, result) => {
            if (err) {
                res.status(502).json({ message: "error" })
            } else if (result) {
                // Contraseña correcta
                //regresa token jwt
                const token = generator.generateToken(obj.id, obj.user, obj.email, obj.role);
                if (token) {
                    checkSession(obj.id).then((isLogged) => {
                        if (isLogged) {
                            return res.status(403).json({
                                message: "No puedes iniciar sesión en 2 dispositivos a la vez",
                                type: "session"
                            })
                        } else {
                            Activity.create({
                                user_id: obj.id,
                                action: 'logged',
                                token: token,
                                date: new Date()
                            }).then(() => {
                                res.status(200).json({ token: token })
                            })
                        }
                    })
                } else {
                    res.status(500).json({ message: "Error al generar token" })
                }
            } else {
                // Contraseña incorrecta
                res.status(401).json({ message: "Contraseña incorrecta" })
            }
        })

    }).catch(error => {
        res.status(500).json({ message: "Usuario no encontrado " })
    })
}

async function obtenerUsuarios(req, res) {
    try {
        await Users.findAll({ attributes: ['id', 'user', 'email'] }).then(result => {
            res.status(200).json(result)
        }).catch(err => {
            res.status(500).json({ message: err })
        })
    } catch (err) {
        res.status(500).json({ message: err })
    }
}

async function crearUsuario(req, res) {
    const { user, email, pass } = req.body;
    await Users.create({
        user: user,
        email: email,
        pass: pass
    }).then(result => {
        res.status(200).json({ message: "Usuario creado" })
    }).catch(err => {
        res.status(500).json({ message: err })
    })
}

async function verificarPassword(req, res) {
    const { id, pass } = req.body;
    await Users.findOne({ where: { id: id } }).then(result => {
        bcrypt.compare(pass, result.pass, (err, result) => {
            if (err) {
                res.status(502).json({ message: "error" })
            } else if (result) {
                res.status(200).json({ message: "Contraseña correcta" })
            } else {
                res.status(401).json({ message: "Contraseña incorrecta" })
            }
        })
    })
}

async function eliminarUsuario(req, res) {
    try {
        const { id } = req.params;
        await Users.destroy({ where: { id: id } }).then(result => {
            res.status(200).json({ message: "Usuario eliminado" })
        })
    } catch (err) {
        res.status(500).json({ message: err })
    }
}

async function modificarUsuario(req, res) {
    try {
        const { id, user, email, pass } = req.body

        if (pass == "") {
            Users.update({ user: user, email: email }, { where: { id: id } }).then(result => {
                res.status(200).json({ message: "Usuario actualizado" })
            }, err => {
                res.status(500).json({ message: err })
            })
        } else {
            const newPass = await bcrypt.hash(pass, 10)
            Users.update({ user: user, email: email, pass: newPass }, { where: { id: id } }).then(result => {
                res.status(200).json({ message: "Usuario actualizado" })
            }, err => {
                res.status(500).json({ message: err })
            })
        }

    } catch (err) {
        res.status(500).json({ message: err })
    }
}

async function startSession(req, res) {
    const { userId, token } = req.body;

    try {
        const userFound = await Users.findOne({ where: { id: userId } })
        await Activity.create({
            user_id: userFound.id,
            action: 'logged',
            token: token,
            date: new Date()
        })

        res.status(200).json({ message: "Sesión iniciada" })
    } catch (err) {
        res.status(500).json({ message: err })
    }
}

async function endSession(req, res) {
    const { id } = req.body;
    const { userId } = req.params;

    console.log(userId)

    try {

        const foundAdmin = await Users.findOne({ where: { id: id } })

        if (!_.isEqual(foundAdmin.role, ADMIN_ROLE)) {
            return res.status(401).json({ message: "No puedes cerrar session, no eres administrador" })
        }

        const sesionFound = await Activity.findOne({ where: { user_id: userId } })

        await Activity.destroy({ where: { id: sesionFound.id } })

        res.status(200).json({ message: "Sesión cerrada" })
    } catch (err) {
        res.status(500).json({ message: err })
    }
}

async function endModeratorSession(req, res) {
    const { id } = req.params;

    try {
        const sesionFound = await Activity.findOne({ where: { user_id: id } })

        if (_.isNil(sesionFound)) {
            return res.status(401).json({ message: "No hay sesión activa" })
        }

        await Activity.destroy({ where: { id: sesionFound.id } })

        res.status(200).json({ message: "Sesión cerrada" })
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

async function checkSession(userId) {
    try {
        const sesionFound = await Activity.findOne({ where: { user_id: userId } });

        if (!_.isNil(sesionFound) && _.isEqual(sesionFound.action, SESSION_LOGGED)) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.log(err)
    }
}

async function checkUserSessionStatus(req, res) {
    const { userId } = req.body;

    try {
        const sesionFound = await Activity.findOne({ where: { user_id: userId } });

        res.status(200).json({ message: sesionFound.action })
    } catch (err) {
        res.status(500).json({ message: err })
    }
}

module.exports = {
    login,
    obtenerUsuarios,
    crearUsuario,
    verificarPassword,
    eliminarUsuario,
    modificarUsuario,
    startSession,
    endSession,
    checkSession,
    endModeratorSession
}
