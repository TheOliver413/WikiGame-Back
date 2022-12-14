const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  // defino el modelo para VIDEOGAME
  // modelName / attributes / options
  sequelize.define('videogame', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    platforms: {
      type: DataTypes.STRING,
      allowNull: false
    }, 
    releaseDate: {
      type: DataTypes.STRING
    },
    rating: {
      type: DataTypes.INTEGER
    },
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
  }, {timestamps: true,
      createdAt: 'creado',
      updatedAt: false
  });
};