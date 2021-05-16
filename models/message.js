module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    messageBody: {
      type: DataTypes.TEXT,
      required: true,
      allowNull: false,
    },
    senderId: {
      type: DataTypes.UUID,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    receiverId: {
      type: DataTypes.UUID,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    isSeen: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  }, {
    tableName: 'messages',
  });
  Message.associate = (models) => {
    Message.belongsTo(models.User, {
      as: 'createdBy',
      foreignKey: 'senderId',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    Message.belongsTo(models.User, {
      as: 'receivedBy',
      foreignKey: 'receiverId',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    Message.hasMany(models.Reply, {
      as: 'replies',
      foreignKey: 'messageId',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  };
  return Message;
};
