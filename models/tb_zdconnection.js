module.exports = function(sequelize, DataTypes) {
    return sequelize.define('tb_zdconnection', {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      zdPushId: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'zd_pushid'
      },
      zdPushToken: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'zd_pushtoken'
      },
      zdInstance: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'zd_instance'
      },
      channel: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'channel'
      }
    }, {
      sequelize,
      tableName: 'tb_zdconnection',
      schema: 'public',
      timestamps: true
    });
  };
  