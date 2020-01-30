module.exports = (sequelize, DataTypes) => {
	const post = sequelize.define('post', {
        post_id : {
            field : 'post_id',
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true
        },
        user_id : {
            field : 'user_id',
            type : DataTypes.INTEGER,
            allowNull : false
        },
		title : {
			type : DataTypes.STRING(100),
			allowNull : false,
		},
		content : {
			type : DataTypes.STRING(140),
			allowNull : false,
        },
        views : {
            type : DataTypes.INTEGER,
            defaultValue : 0
        }
	}, {
		timestamps : true,  // createdAt, updatedAt column 생성
		paranoid : true, 	// deletedAt column 생성
        underscored: true,
        tableName: 'post',
        freezeTableName: true
    })
    
    post.association = (db) => {
        // USER & POST
        db.post.belongsTo(db.user, {
            foreignKey : 'user_id'
        });
        // POST & COMMENT
        db.post.hasMany(db.comment, {
            foreignKey : 'post_id'
        });
        // POST_HASHTAG : POST & HASHTAG
        db.post.belongsToMany(db.hashtag, {
            foreignKey : 'post_id',
            through : 'post_hashtag',
            timestamps : false,
            paranoid : false,
        });
        // LIKE : USER & POST
        db.post.belongsToMany(db.user, {
            through : 'like',
            foreignKey : 'post_id',
            timestamps : false,  // createdAt, updatedAt column 생성
            paranoid : false,    // deletedAt column 생성
        });

    }

    return post
};