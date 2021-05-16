import SequelizeSlugify from 'sequelize-slugify';

export default (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    image: {
      type: DataTypes.TEXT
    },
    title: {
      type: DataTypes.STRING
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
      required: true
    },
    startDate: {
      type: DataTypes.DATE
    },
    endDate: {
      type: DataTypes.DATE
    },
    place: {
      type: DataTypes.STRING
    },
    price: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    description: {
      type: DataTypes.TEXT,
      required: true
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: 'events',
    // paranoid: true,
  });

  SequelizeSlugify.slugifyModel(Event, {
    source: ['title'],
    slugOptions: {
      lower: true,
    },
    overwrite: true,
    column: 'slug',
  });

  Event.associate = (models) => {
    Event.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  };
  return Event;
};
