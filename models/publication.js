export default (sequelize, DataTypes) => {
  const Publication = sequelize.define(
    'Publication',
    {
      id: {
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID,
      },
      title: {
        type: DataTypes.STRING,
        required: true,
      },
      pubDocument: {
        type: DataTypes.STRING,
        required: true,
      },
      userId: {
        type: DataTypes.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: true,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'publications',
    }
  );
  Publication.associate = (models) => {
    Publication.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  };
  return Publication;
};
