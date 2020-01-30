module.exports = (sequelize, DataTypes) => {
	const comment = sequelize.define('comment', {
        comment_id : {
            field : 'comment_id',
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true
        },
        user_id : {
            field : 'user_id',
            type : DataTypes.INTEGER,
            allowNull : false
        },
        post_id : {
            field : 'post_id',
            type : DataTypes.INTEGER,
            allowNull : false
        },
		content : {
			type : DataTypes.STRING(100),
			allowNull : false,
		}
	},{
		timestamps : true,
		paranoid : true,
        underscored: true,
        tableName: 'comment',
        freezeTableName: true
    });

    comment.association = (db) => {
        // USER & COMMENT
        db.comment.belongsTo(db.user, {
            foreignKey : 'user_id'
        });
        // POST & COMMENT
        db.comment.belongsTo(db.post, {
            foreignKey : 'post_id'
        });
    }
    return comment
}