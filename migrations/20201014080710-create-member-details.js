export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('member_details', {
    id: {
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      type: Sequelize.UUID,
    },
    userId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    backgroundCover: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    documentsURL: {
      type: Sequelize.ARRAY(Sequelize.TEXT),
    },
    websiteLink: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    description: {
      type: Sequelize.TEXT,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: (queryInterface) => queryInterface.dropTable('member_details'),
};
