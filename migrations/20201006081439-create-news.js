const newsMigration = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('news', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: Sequelize.STRING,
      required: true,
    },
    slug: {
      type: Sequelize.STRING,
      unique: true,
      required: true,
    },
    newsBody: {
      type: Sequelize.TEXT,
      required: true,
    },
    authorId: {
      type: Sequelize.UUID,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    image: {
      type: Sequelize.STRING,
      allowNull: true
    },
    isPublished: {
      allowNull: false,
      type: Sequelize.BOOLEAN,
      defaultValue: false,
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
  down: (queryInterface) => queryInterface.dropTable('news'),
};

export default newsMigration;
