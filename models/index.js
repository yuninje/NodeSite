const fs = require('fs');
const path = require('path')
const basename = path.basename(__filename)
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

const sequelize = new Sequelize(
  config.database, config.username, config.password, config
);

/* sequelize model define */
fs.readdirSync(__dirname).filter((file) => {
    console.log(file)
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
}).forEach((file) => {
    var model = sequelize['import'](path.join(__dirname, file))
    db[model.name] = model
    console.log(model)
})
console.log(db);
Object.values(db).filter(model => model.hasOwnProperty('association'))
    .forEach(model => model['association'](db))

module.exports = {
    sequelize,
    db
}