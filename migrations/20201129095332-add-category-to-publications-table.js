export default {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('publications', 'category', {
    type: Sequelize.STRING,
    allowNull: true,
  }),
  down: (queryInterface) => queryInterface.removeColumn('publications', 'category'),
};
