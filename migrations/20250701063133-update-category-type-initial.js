'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      UPDATE Categorias_Contens
      SET tipo = 'INITIAL'
      WHERE id = 1;`    
    );
  },

  async down(queryInterface, Sequelize) {
  }
};
