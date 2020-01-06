module.exports = (sequelize, DataTypes) => (
	sequelize.define('post', {
		title : {
			type : DataTypes.STRING(100),
			allowNull : false,
		},
		content : {
			type : DataTypes.STRING(140),
			allowNull : false,
		}
	}, {
		timestamps : true,  // createdAt, updatedAt column 생성
		paranoid : true, 	// deletedAt column 생성
	})
);