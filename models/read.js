const readNews = (sequelize, DataTypes) => {
  const Read = sequelize.define(
    'Read',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      newsSlug: {
        type: DataTypes.STRING,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
          model: 'news',
          key: 'slug',
        },
      },
      numberOfReading: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: 'reads',
      // paranoid: true,
    }
  );
  Read.associate = (models) => {
    Read.belongsTo(models.News, {
      as: 'views',
      foreignKey: 'newsSlug',
      onDelete: 'CASCADE',
      targetKey: 'slug',
    });
  };
  return Read;
};

export default readNews;
