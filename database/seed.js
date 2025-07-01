const Users = require('../models/admin/usuarios');
const Categories = require('../models/general/categorias_conten');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const initialCategories = [
    {
        title: 'NOSOTROS',
        tipo: 'INITIAL',
        is_active: true,
        has_sections: true,
        url: 'conten',
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
        is_default: true,
        description: '<p>En nuestra división de Manufactura, actualmente contamos con maquinaria especializada y perfectas instalaciones que nos permiten cortar, doblar, troquelar, soldar materiales de acero en gran volumen. </p>',
        img: null,
        pdf: null
    },
    {
        title: 'DISEÑO E INGENIERÍA',
        tipo: 'A',
        is_active: true,
        has_sections: true,
        url: 'diseno-e-ingenieria',
        is_default: true,
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
        is_default: true,
        description: 'Descripción de la categoría D',
        img: null,
        pdf: null
    },
    {
        title: 'NUESTRAS CERTIFICACIONES',
        tipo: 'D',
        is_active: true,
        has_sections: true,
        url: 'nuestras-certificaciones',
        is_default: true,
        description: 'Descripción de la categoría E',
        img: null,
        pdf: null
    }
];

initialCategories.forEach((category) => {
    // Usamos la URL como nombre de archivo con extensión .jpg
    const fileName = `${category.url}.png`;
    const base = './media/conten/';
    const filePath = path.join(base, fileName);

    if (fs.existsSync(filePath)) {
        const fileBuffer = fs.readFileSync(filePath);
        const base64String = fileBuffer.toString('base64');
        category.img = `data:image/*;base64,${base64String}`;
    } else {
        console.warn(`⚠️ Archivo no encontrado: ${filePath}`);
    }
});

/**
 * @description Crea un usuario admin si no existe
 */
async function seedAdminUser() {
    try {
        const adminExists = await Users.findOne({ where: { user: 'admin' } });

        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('root', 10); //$2a$10$n.UHb.bN.ktM8pCeJaqbKOu8lPck/HjQ/CAFpogitCsh2S//Tz7we
            const hashedPasswordUser = await bcrypt.hash('12345', 10);
            await Users.create({
                user: 'admin',
                email: 'admin@example.com',
                pass: hashedPassword,
                role: 'admin'
            });

            await Users.create({
                user: 'user',
                email: 'user@example.com',
                pass: hashedPasswordUser,
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
                // Un comment to update the category if needed
                //await Categories.update(cat, { where: { url: cat.url } });
                console.log(`ℹ️ Categoría "${cat.title}" setted.`);
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