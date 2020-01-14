const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

const sequelize = new Sequelize(
  config.database, config.username, config.password, config
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize, Sequelize);
db.Post = require('./post')(sequelize, Sequelize);
db.Comment = require('./comment')(sequelize,Sequelize);

db.User.hasMany(db.Post, {onDelete: 'cascade'});
db.User.hasMany(db.Comment, {onDelete: 'cascade'});
db.User.hasMany(db.Post, { through : 'Like'} );

db.User.belongsToMany(db.User, {
  foriegnKey : followgingId,
  as : Followers,
  through : 'Follow',
});
db.User.belongsToMany(db.User, {
  foriegnKey : followwerId,
  as : Followings,
  through : 'Follow',
})


db.Post.belongsTo(db.User);
db.Post.belongsTo(db.User, { through : 'Like'});
db.Post.hasMany(db.Comment, {onDelete: 'cascade'});

db.Comment.belongsTo(db.User);
db.Comment.belongsTo(db.Post);




module.exports = db;