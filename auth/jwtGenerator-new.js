const jwt = require("jsonwebtoken")
require('dotenv').config()

function generateToken(id, user, email, role) {
    try {

        const claims = {
            id: id,
            user: user,
            email: email,
            role: role
        };

        const token = jwt.sign({ claims }, process.env.SECRET_KEY)
        return token
    } catch (error) {
        console.log(error)
    }
}

module.exports = {generateToken}