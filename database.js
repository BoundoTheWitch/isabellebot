// TODO For /starstreaks SELECT * FROM stars and jsonify it with .toJSON()
// TODO Find way to send ping to every user everyday (who is participating)
// TODO Account for month change (see if there's some sort of way to calculate days)
const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

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
        type: DataTypes.INTEGER,
        unique: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    stars_count: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false
    },
    highest_streak: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false
    },
    last_star: DataTypes.STRING
});
Stars.sync();

/**
 * Adds a star for the user.
 * It will also update the database if the user changed their nickname
 * @param {Integer} userID
 * @param {String} name Just in case the user changes their name
 */
const addStar = async (userID, name) => {
    Stars.sync()
    .then(() => {
        const user = Stars.findOne({ where: { user_id: userID }, raw: true });
        return user;
    })
    .then(data => {
        let currDate = new Date();
        let date = new Date(data.last_star);
        let currStars = data.stars_count;
        let currStreak = data.highest_streak;
        if ((currDate.getDate() - 2) < date.getDate()) {
            currStars = currStars + 1;
        }
        else
            currStars = 1;
        if (currStars > currStreak)
            currStreak = currStars;
        
        Stars.update({ username: name, stars_count: currStars, last_star: currDate.toString(), highest_streak: currStreak }, { where: { user_id: userID } });
    })
    .catch(err => console.error("Error", err));
};

/**
 * Returns true or false
 * @param {String} userID
 * @returns Boolean
 */
const checkUser = async (userID) => {
    let res = Stars.sync()
    .then(() => {
        const user = Stars.findOne({ where: { user_id: userID }, raw: true });
        return user;
    })
    .then(data => {
        if (data) return true;
        else return false;
    });
    return res;
}

/**
 * Adds new user
 * @param {Integer} userID
 * @param {String} name 
 */
const newUser = async (userID, name) => {
    let currDate = new Date();
    Stars.sync()
    .then(() => Stars.create({ user_id: userID, username: name.toString(), last_star: currDate.toString() }) )
    .catch(err => console.error(err));
}

/**
 * Checks to see if user already left star on the same day.
 * @param {String} userID
 * @returns Boolean
 */
const checkStar = async (userID) => {
    let res = Stars.sync()
    .then(() => {
        const user = Stars.findOne({ where: { user_id: userID }, raw: true });
        return user;
    })
    .then(data => {
        let currDate = new Date();
        let date = new Date(data.last_star);
        if (date.getDate() === currDate.getDate()) {
            return true;
        } else {
            return false;
        }
    })
    .catch(err => console.error("Error", err));
    return res;
}

/**
 * Get every user and their stars and return it as an array
 * Similar to SELECT * FROM stars
 */
const getStars = async () => {
    // TODO Get username, stars_count, highest_streak
}

/**
 * FOR INTERNAL USE ONLY. Clears out database.
 * @param {String} pass The password
 */
const clearDB = (pass) => {
    if (pass === process.env.DBPASS) {
        sequelize.drop();
    } else {
        console.error("That's not the password, dummy!");
    }
}
module.exports = { newUser, addStar, checkUser, checkStar, getStars, clearDB };