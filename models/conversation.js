export default (sequelize, DataTypes) => {
  const Conversation = sequelize.define(
    'Conversation',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      memberId: {
        type: DataTypes.UUID,
        references: {
          model: 'member_details',
          key: 'id',
        },
      },
      senderId: {
        type: DataTypes.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      message: {
        type: DataTypes.STRING,
        required: true,
      },
      seen: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: 'conversations',
      // paranoid: true,
    }
  );
  Conversation.associate = (models) => {
    Conversation.belongsTo(models.User, {
      as: 'sender',
      foreignKey: 'senderId',
    });
    Conversation.belongsTo(models.MemberDetails, {
      as: 'conversations',
      foreignKey: 'memberId',
    });
  };
  return Conversation;
};
