export default (sequelize, DataTypes) => {
  const MemberDetails = sequelize.define('MemberDetails', {
    id: {
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    backgroundCover: {
      type: DataTypes.STRING,
      allowNull: true
    },
    documentsURL: {
      type: DataTypes.ARRAY(DataTypes.TEXT)
    },
    websiteLink: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: 'member_details',
    // paranoid: true,
  });
  MemberDetails.associate = (models) => {
    MemberDetails.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    MemberDetails.hasMany(models.Conversation, {
      as: 'conversations',
      foreignKey: 'memberId',
    });
  };
  return MemberDetails;
};
