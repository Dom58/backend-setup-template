export default (Sequelize, DataTypes) => {
  const Comment = Sequelize.define(
    'Comment',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      names: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      commentBody: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      newsId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'news',
          key: 'id',
        },
      },
      isActive: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: 'comments',
      // paranoid: true,
    }
  );

  Comment.associate = (models) => {
    Comment.belongsTo(models.News, {
      as: 'news',
      foreignKey: 'newsId',
      onDelete: 'CASCADE',
    });
  };
  return Comment;
};
