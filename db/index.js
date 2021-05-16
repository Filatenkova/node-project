const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-project', 'a209105_node', '', {
    dialect: "mysql",
    host: "localhost",
});

const Image = require('./Image')(sequelize);

module.exports = {
    sequelize: sequelize,
    image: Image
}
