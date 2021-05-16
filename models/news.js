import SequelizeSlugify from 'sequelize-slugify';

export default (sequelize, DataTypes) => {
  const News = sequelize.define(
    'News',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        required: true,
      },
      slug: {
        type: DataTypes.STRING,
        unique: true,
        required: true,
      },
      newsBody: {
        type: DataTypes.TEXT,
        required: true,
      },
      authorId: {
        type: DataTypes.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isPublished: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: 'news',
      // paranoid: true,
    }
  );
  SequelizeSlugify.slugifyModel(News, {
    source: ['title'],
    slugOptions: {
      lower: true,
    },
    overwrite: true,
    column: 'slug',
  });
  News.associate = (models) => {
    News.belongsTo(models.User, {
      as: 'author',
      foreignKey: 'authorId',
    });
    News.hasMany(models.Comment, {
      as: 'comments',
      foreignKey: 'newsId',
      sourceKey: 'id',
    });
    News.hasOne(models.Read, {
      as: 'views',
      foreignKey: 'newsSlug',
      sourceKey: 'slug',
    });
  };
  return News;
};
