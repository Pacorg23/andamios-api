const Users = require('../models/admin/usuarios');
const Categories = require('../models/general/categorias_conten');
const bcrypt = require('bcrypt');

const initialCategories = [
    {
        title: 'NOSOTROS',
        tipo: 'INITAL',
        is_active: true,
        has_sections: true,
        url: '/conten',
        is_default: true,
        is_active: true,
        description: '',
        img: null,
        pdf: null
    },
    {
        title: 'MANUFACTURA',
        tipo: 'B',
        is_active: true,
        has_sections: true,
        url: 'manufactura',
        is_default: false,
        description: '<p>En nuestra división de Manufactura, actualmente contamos con maquinaria especializada y perfectas instalaciones que nos permiten cortar, doblar, troquelar, soldar materiales de acero en gran volumen. </p>',
        img: null,
        pdf: null
    },
    {
        title: 'DISEÑO E INGENIERÍA',
        tipo: 'A',
        is_active: true,
        has_sections: true,
        url: 'ingenieria',
        is_default: false,
        description: 'Descripción de la categoría C',
        img: null,
        pdf: null
    },
    {
        title: 'PRODUCTOS',
        tipo: 'C',
        is_active: true,
        has_sections: true,
        url: 'productos',
        is_default: false,
        description: 'Descripción de la categoría D',
        img: null,
        pdf: null
    },
    {
        title: 'NUESTRAS CERTIFICACIONES',
        tipo: 'D',
        is_active: true,
        has_sections: true,
        url: 'certificaciones',
        is_default: false,
        description: 'Descripción de la categoría E',
        img: null,
        pdf: null
    }
];

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

/**
 * @description Crea categorías por defecto si no existen
 */
async function seedDefaultCategories() {
    for (const cat of initialCategories) {
        try {
            const exists = await Categories.findOne({ where: { url: cat.url } });

            if (!exists) {
                await Categories.create(cat);
                console.log(`✅ Categoría "${cat.title}" creada.`);
            } else {
                console.log(`ℹ️ Categoría "${cat.title}" ya existe.`);
            }
        } catch (error) {
            console.error(`❌ Error al crear categoría "${cat.title}":`, error.message);
        }
    }
}

module.exports = {
    seedAdminUser,
    seedDefaultCategories
}