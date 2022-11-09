const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  // defino el modelo para GENRE
  sequelize.define('genre', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },{timestamps: true,
    createdAt: 'creado',
    updatedAt: false
});
};
