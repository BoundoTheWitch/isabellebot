// TODO Finish so it can update and add users appropriately

const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite'
});

sequelize.authenticate()
    .then(() => console.log("Connected to database."))
    .catch(err => console.log("Error connecting to database.", err));

const Stars = sequelize.define('stars', {
    user_id: {
        type: DataTypes.STRING,
        unique: true,
    },
    stars_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    highest_streak: DataTypes.INTEGER,
    last_star: DataTypes.STRING
});


Stars.sync()
    .then(() => {
        // const build = Stars.build({ user_id: USER, current_stars: INT, highest_streak: INT, last_star: new Date().toString() });
        return build.save();
    })
    .catch(err => console.log("Error syncing model", err));
