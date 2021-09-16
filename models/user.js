'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING,
    account: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    avatar: DataTypes.STRING,
    cover: DataTypes.STRING,
    introduction: DataTypes.TEXT,
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user'
    }
  }, {});
  User.associate = function (models) {

    User.hasMany(models.Tweet)
    User.hasMany(models.Reply)

    // 造成Like.spce.js測試失敗
    // User.belongsToMany(models.Tweet, {
    //   through: models.Like,
    //   foreignKey: 'UserId',
    //   as: 'LikedTweets'
    // })

    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: 'followingId',
      as: 'Followers'
    })
    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: 'followerId',
      as: 'Followings'
    })

    User.hasMany(models.Like)
  };
  return User;
};