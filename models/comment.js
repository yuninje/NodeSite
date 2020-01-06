module.exports = (sequelize, DataTypes) => 
	sequelize.define('comment', {
		content : {
			type : DataTypes.STRING(100),
			allowNull : false,
		}
	},{
		timestamps : true,
		paranoid : true,
	});