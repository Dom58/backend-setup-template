const commentsMigration = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('comments', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    names: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    commentBody: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    newsId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'news',
        key: 'id',
      },
    },
    isActive: {
      allowNull: false,
      type: Sequelize.BOOLEAN,
      defaultValue: true,
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
  down: (queryInterface) => queryInterface.dropTable('comments'),
};

export default commentsMigration;
