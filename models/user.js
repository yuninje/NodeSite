module.exports = (sequelize, DataTypes) => (
	sequelize.define('user', {
		email : {
			type : DataTypes.STRING(30),
            allowNull : false,
            unique : true,
		},
		name : {
			type : DataTypes.STRING(30),
			allowNull : false,
		},
		password : {
			type : DataTypes.STRING(100),
			allowNull : false,
		}
	},{
		timestamps : true,  // createdAt, updatedAt column 생성
		paranoid : true, 	// deletedAt column 생성
	})
);