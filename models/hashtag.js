module.exports = (sequelize, DataTypes) =>(
    sequelize.define('hashtag', {
        tag : {
            type : DataTypes.STRING(30),
            allowNull : false,
            unique : true
        },
    },{
        timestamps : true,
        paranoid : true,
    })
);