const { Sequelize, DataTypes } = require('sequelize');
const prompt = require('prompt-sync')({ sigint: true });
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
        type: DataTypes.STRING,
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
    last_star: DataTypes.STRING,
    star_placed: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
});
Stars.sync({ alter: true });

/**
 * Adds a star for the user.
 * It will also update the database if the user changed their nickname
 * @param {String} userID
 * @param {String} name Just in case the user changes their name
 */
const addStar = async (userID, name, status) => {
    Stars.sync()
        .then(() => {
            const user = Stars.findOne({ where: { user_id: userID }, raw: true });
            return user;
        })
        .then(data => {
            let currStars = data.stars_count;
            let currStreak = data.highest_streak;
            let currDate = new Date();
            if (status === "GOOD")
                currStars = currStars + 1;
            else if (status === "LATE")
                currStars = 1;

            if (currStars > currStreak)
                currStreak = currStars;

            
            Stars.update({ username: name, stars_count: currStars, last_star: currDate.toString(), highest_streak: currStreak, star_placed: 0 }, { where: { user_id: userID } });
        })
        .catch(err => console.error("Error", err));
};

/**
 * Returns true or false if a user exists
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
 * @param {String} userID
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
 * @returns "SAMEDAY" | "GOOD" | "LATE"
 */
const checkStar = async (userID) => {
    let res = Stars.sync()
    .then(() => {
        const user = Stars.findOne({ where: { user_id: userID }, raw: true });
        return user;
    })
    .then(data => {
        const status = data.star_placed;
        if (status === 0)
            return "SAMEDAY";
        else if (status === 1)
            return "GOOD";
        else
            return "LATE";
    })
    .catch(err => console.error("Error", err));
    return res;
}

/**
 * Get every user and their stars
 * Similar to SELECT * FROM stars WHERE (attributes here)
 */
const getStars = async () => {
    let dbStars = await Stars.findAll({ attributes: ['username', 'stars_count', 'highest_streak', 'last_star'], order: [['updatedAt', 'DESC']] });
    let starsUsers = dbStars.map(e => {
        let str;
        let dbDate = new Date(e.last_star);
        let dbDateFormat = dbDate.toLocaleString('en-US', { hour12: true });
        str = `**${e.username}** | ${e.stars_count}/${e.highest_streak}\n**Last Star:** ${dbDateFormat}\n\n`;
        return str;
    }).join('');
    return starsUsers;
}

/**
 * For cronjob. On start of a new day, increment star_placed value
 */
const newDay = async () => {
    const statements = [];
    const stars = await Stars.findAll({ attributes: ['user_id', 'star_placed'], raw: true });

    for (let i = 0; i < stars.length; i++) {
        let newStarPlaced = (stars[i].star_placed < 2) ? stars[i].star_placed += 1 : 2;
        statements.push(
            sequelize.query(
                `UPDATE Stars
                SET star_placed=${newStarPlaced}
                WHERE user_id=${stars[i].user_id};`
            )
        );
    }

    const res = await Promise.all(statements);
}


/**
 * FOR INTERNAL USE ONLY. Manually enter data just in case
 * @param {String} userID
 * @param {String} username
 * @param {Integer} stars 
 * @param {Integer} streak 
 * @param {String} date
 * @param {String} pass
 */
const manualEntry = async (userID, username, stars, streak, date, pass) => {
    if (pass === process.env.DBPASS) {
        Stars.sync()
        .then(() => {
            Stars.create({ user_id: userID, username: username, stars_count: stars, highest_streak: streak, last_star: date });
        })
        .catch(err => console.error("Error", err));
    } else console.log("Wrong password.");
}

/**
 * Console log everything from the database
 */
const getAll = async () => {
    Stars.sync()
    .then(() => {
        return Stars.findAll({ raw: true });
    })
    .then(data => {
        data.map((e) => {
            console.log(`'${e.user_id}', '${e.username}', ${e.stars_count}, ${e.highest_streak}, '${e.last_star}'`);
        })
    })
    .catch(err => console.error(err));
}

/**
 * FOR INTERNAL USE Manually update star count
 * @param {String} id ID of the user
 * @param {Integer} currStars Current number of stars
 * @param {Integer} currStreak Highest streak
 */
const changeStar = async(id, currStars, currStreak) => {
    Stars.sync()
    .then(() => {
        Stars.update({ stars_count: currStars, highest_streak: currStreak }, { where: { user_id: id } });
    })
    .catch(err => console.error(err));
}

module.exports = { newUser, addStar, checkUser, checkStar, getStars, newDay, manualEntry, getAll, changeStar };