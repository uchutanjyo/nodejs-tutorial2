const Sequelize = require('sequelize')

const sequelize = new Sequelize('node-tutorial', 'matt', 'mastew', {dialect: 'mysql', host: 'localhost'});

module.exports = sequelize;