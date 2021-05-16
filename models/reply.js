module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define('Reply', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    messageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'messages',
        key: 'id'
      }
    },
    replyBody: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    tableName: 'replies',
  });
  Reply.associate = (models) => {
    Reply.belongsTo(models.Message, {
      as: 'reply',
      foreignKey: 'messageId',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    Reply.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'senderId',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  };
  return Reply;
};
