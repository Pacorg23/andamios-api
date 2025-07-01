'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      alter table Contactos add division nvarchar(255) null;`    
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      alter table Contactos drop column division;`
    );
  }
};
