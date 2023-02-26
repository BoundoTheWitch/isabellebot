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
    // Reading stars
    reading_count: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false
    },
    reading_streak: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false
    },
    reading_highest: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false
    },
    last_reading: DataTypes.STRING,
    reading_placed: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    // Workout stars
    workout_count: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false
    },
    workout_streak: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false
    },
    workout_higest: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false
    },
    last_workout: DataTypes.STRING,
    workout_placed: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    }
});
Stars.sync({ alter: true });


/**
 * Check if user exists already
 * @param {string} userID 
 * @returns 
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
};

const newUser = async (userID, name) => {
    Stars.sync()
        .then(() => Stars.create({ user_id: userID, username: name }))
        .catch(err => console.error(err));
}

/**
 * Adds a reading star
 * Updates database with current display name of user as well
 * @param {string} userID Discord ID of the user
 * @param {string} name Display name
 * @param {string} status "GOOD", "LATE"
 */
const addReadingStar = async (userID, name, status) => {
    Stars.sync()
        .then(() => {
            const user = Stars.findOne({ where: { user_id: userID }, raw: true })
            return user;
        })
        .then(data => {
            let currStars = data.reading_count + 1;
            let currStreak = data.reading_streak;
            let highestStreak = data.reading_highest;
            let currDate = new Date();
            if (status === "GOOD")
                currStreak = currStreak + 1;
            else if (status === "LATE")
                currStreak = 1;
            
            if (currStreak > highestStreak)
                currStreak = highestStreak;

            Stars.update({ username: name, reading_count: currStars, reading_streak: currStreak, reading_highest: highestStreak, last_reading: currDate.toString() }, { where: { user_id: userID }});
        })
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
 * @param {String} userID Discord ID
 * @param {String} username Their display name (will get updated next time they leave a star)
 * @param {Integer} readingStars Current stars in reading
 * @param {Integer} readingStreak Current streak in reading
 * @param {Integer} readingHighest Highest streak in reading
 * @param {String} readingDate Date when they last left a reading star
 * @param {Integer} workoutStars Current stars in workout
 * @param {Integer} workoutStreak Current streak in workout
 * @param {Integer} workoutHighest Highest streak in workout
 * @param {String} workoutDate Date when they last left a workout star
 */
const manualEntry = async (userID, username, readingStars, readingStreak, readingHighest, readingDate, workoutStars, workoutStreak, workoutHighest, workoutDate) => {
    Stars.sync()
        .then(() => {
            Stars.create({
                user_id: userID,
                username: username,
                reading_count: readingStars,
                reading_streak: readingStreak,
                reading_highest: readingHighest,
                last_reading: readingDate,
                workout_count: workoutStars,
                workout_streak: workoutStreak,
                workout_higest: workoutHighest,
                last_workout: workoutDate
            });
        })
        .catch(err => console.error("Error", err));
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
            console.log(`'${e.user_id}', '${e.username}', ${e.reading_count}, ${e.reading_streak}, ${e.reading_highest}, '${e.last_reading}', ${e.workout_count}, ${e.workout_streak}, ${e.workout_higest}, '${e.last_workout}'`);
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

module.exports = { newUser, addReadingStar, checkUser, checkStar, getStars, newDay, manualEntry, getAll, changeStar };