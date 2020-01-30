module.exports = (sequelize, DataTypes) =>{
    const hashtag = sequelize.define('hashtag', {
        hashtag_id : {
            field : 'hashtag_id',
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true
        },
        tag : {
            type : DataTypes.STRING(30),
            allowNull : false,
            unique : true
        },
    },{
        timestamps : false,
        paranoid : false,
        underscored: true,
        tableName: 'hashtag',
        freezeTableName: true
    })

    hashtag.association = (db) => {
        // POST_HASHTAG : POST & HASHTAG
        db.hashtag.belongsToMany(db.post, {
            foreignKey : 'hashtag_id',
            through : 'post_hashtag',
            timestamps : false,
            paranoid : false
        });
    }

    return hashtag
}