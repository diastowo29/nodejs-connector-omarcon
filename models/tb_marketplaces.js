module.exports = function(sequelize, DataTypes) {
    return sequelize.define('omrcn_marketplaces', {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'name'
      },
      status: {
        type: DataTypes.STRING(10),
        allowNull: false,
        field: 'status'
      }
    }, {
      sequelize,
      tableName: 'omrcn_marketplaces',
      schema: 'public',
      timestamps: true
    });
  };
  