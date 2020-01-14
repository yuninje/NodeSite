const FOLLOW = 'follows'
const POST_HASH_TAG = 'PostHashtag'
const LIKE = 'likes'

const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

const sequelize = new Sequelize(
  config.database, config.username, config.password, config
);

db.sequelize = sequelize;
db.Sequelize = Sequelize; // DataTypes

db.User = require('./user')(sequelize, Sequelize);
db.Post = require('./post')(sequelize, Sequelize);
db.Hashtag = require('./hashtag')(sequelize, Sequelize);
db.Comment = require('./comment')(sequelize,Sequelize);


// User : Post = 1 : N
db.User.hasMany(db.Post, {onDelete: 'cascade'});
db.Post.belongsTo(db.User);

// User : Comment = 1 : N
db.User.hasMany(db.Comment, {onDelete: 'cascade'});
db.Comment.belongsTo(db.User);

// Post : Comment = 1 : N
db.Post.hasMany(db.Comment, {onDelete: 'cascade'});
db.Comment.belongsTo(db.Post);

// User : User = N : M      :: Subscribe
db.User.belongsToMany(db.User, {
    foreignKey : 'followingId',
    as : 'Followers',   //  해당 데이터를 요청했을 때 사용할 key 값 ( user.Followers )
    through : FOLLOW, //  만들 테이블
    timestamps : false,  // createdAt, updatedAt column 생성
    paranoid : false,    // deletedAt column 생성
});
db.User.belongsToMany(db.User, {
    foreignKey : 'followerId',
    as : 'Followings',   //  해당 데이터를 요청했을 때 사용할 key 값 ( user.Followers )
    through : FOLLOW, //  만들 테이블
    timestamps : false,  // createdAt, updatedAt column 생성
    paranoid : false,    // deletedAt column 생성
});

// User : Post = N : M      :: Like
db.User.belongsToMany(db.Post,{
  through : LIKE,
  as : 'Likes',
  timestamps : false,  // createdAt, updatedAt column 생성
  paranoid : false,    // deletedAt column 생성
});
db.Post.belongsToMany(db.User, {
  through : LIKE,
  as : 'Likers',
  timestamps : false,  // createdAt, updatedAt column 생성
  paranoid : false,    // deletedAt column 생성
});

// Post : Hashtag = N : M   :: PostHashtag
db.Post.belongsToMany(db.Hashtag, {
  through : POST_HASH_TAG,
 timestamps : false,  // createdAt, updatedAt column 생성
 paranoid : false,    // deletedAt column 생성
});
db.Hashtag.belongsToMany(db.Post, {
  through : POST_HASH_TAG,
  timestamps : true,  // createdAt, updatedAt column 생성
  paranoid : true,    // deletedAt column 생성
});

module.exports = db;