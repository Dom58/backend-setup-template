import bcrypt from 'bcryptjs';
import {
  SALT_ROUNDS
} from '../constants/general';

export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Email is required',
        },
        isEmail: {
          args: true,
          msg: 'Invalid email',
        },
      },
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    organization: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.STRING,
    },
    accountStatus: {
      type: DataTypes.STRING,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'users',
    paranoid: true,
  },);

  User.associate = (models) => {
    User.hasMany(models.Event, {
      as: 'event',
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    User.hasOne(models.MemberDetails, {
      as: 'memberDetail',
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    User.hasMany(models.Conversation, {
      as: 'conversations',
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    User.hasMany(models.Message, {
      as: 'messages',
      foreignKey: 'senderId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    User.hasMany(models.Reply, {
      as: 'replies',
      foreignKey: 'senderId',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    User.hasMany(models.News, {
      as: 'news',
      foreignKey: 'authorId',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  };

  User.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
  });

  User.prototype.comparePassword = async function comparePassword(password) {
    return bcrypt.compare(password, this.get().password);
  };

  return User;
};
