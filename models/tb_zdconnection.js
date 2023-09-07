module.exports = function(sequelize, DataTypes) {
    return sequelize.define('omrcn_zdconnection', {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      zd_pushid: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'zd_pushid'
      },
      zd_pushtoken: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'zd_pushtoken'
      },
      zd_instance: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'zd_instance'
      },
      channel: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'channel'
      },
      shop_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'shop_id'
      },
      shop_url: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'shop_url'
      },
      integration_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'integration_name'
      },
      status: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'status'
      }
    }, {
      sequelize,
      tableName: 'omrcn_zdconnection',
      schema: 'public',
      timestamps: true
    });
  };
  