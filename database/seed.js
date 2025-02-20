const Users = require('../models/admin/usuarios');
const bcrypt = require('bcrypt');

/**
 * @description Crea un usuario admin si no existe
 */
async function seedAdminUser() {
    try {
        const adminExists = await Users.findOne({ where: { user: 'admin' } });

        if (!adminExists) {
            //const hashedPassword = await bcrypt.hash('root', 12); //$2a$12$5HYdH./KgroJDrw6ZmPx2O.sZQhxsldKHE57s/l8a42QVqXSI/fhS -> for 10 rounds $2a$10$n.UHb.bN.ktM8pCeJaqbKOu8lPck/HjQ/CAFpogitCsh2S//Tz7we
            const hashedPassword = await bcrypt.hash('root', 10); //$2a$10$n.UHb.bN.ktM8pCeJaqbKOu8lPck/HjQ/CAFpogitCsh2S//Tz7we
            await Users.create({
                user: 'admin',
                email: 'admin@example.com',
                pass: hashedPassword,
                role: 'admin'
            });

            console.log('✅ Usuario admin creado correctamente.');
        } else {
            console.log('ℹ️ Usuario admin ya existe.');
        }
    } catch (error) {
        console.error('❌ Error al crear usuario admin:', error.message);
    }
}

module.exports = {
    seedAdminUser
}