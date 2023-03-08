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
    // Reading stars.
    reading_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    reading_streak: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    reading_highest: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    last_reading: DataTypes.STRING,
    reading_placed: DataTypes.INTEGER,
    // Workout stars.
    workout_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    workout_streak: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    workout_highest: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    last_workout: DataTypes.STRING,
    workout_placed: DataTypes.INTEGER
});
Stars.sync();

const StarPosts = sequelize.define('starposts', {
    post_type: DataTypes.STRING,
    post_id: DataTypes.STRING
});
StarPosts.sync();

/**
 * Check if user exists already.
 * @param {String} userID 
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

/**
 * Adds new user to database.
 * @param {String} userID 
 * @param {String} name 
 */
const newUser = async (userID, name) => {
    Stars.sync()
        .then(() => Stars.create({ user_id: userID, username: name }))
        .catch(err => console.error(err));
}

/**
 * Checks to see if user already left star on the same day.
 * @param {String} userID
 * @param {String} type For which type of star to check for ("READING", "WORKOUT")
 * @returns "SAMEDAY" | "GOOD" | "LATE"
 */
const checkStar = async (userID, type) => {
    let res = Stars.sync()
    .then(() => {
        const user = Stars.findOne({ where: { user_id: userID }, raw: true });
        return user;
    })
    .then(data => {
        const status = type === "READING" ? data.reading_placed : data.workout_placed;

        if (status === 0)
            return "SAMEDAY";
        else if (status === 1 || status === null)
            return "GOOD";
        else {
            if (type === "READING")
                return "LATE";
            else
                return "GOOD";
        }
    })
    .catch(err => console.error("Error", err));
    return res;
}

/**
 * Checks to see if a super star is earned.
 * Returns true if so.
 * @param {String} userID 
 * @returns Boolean
 */
const checkSuperStar = async userID => {
    let res = Stars.sync()
        .then(() => {
            const user = Stars.findOne({ where: { user_id: userID }, raw: true });
            return user;
        })
        .then(data => {
            const currStreak = data.workout_streak;
            if (currStreak === 4) return true;
            else return false;
        })
        .catch(err => console.error("Error", err));
    return res;
}

/**
 * Adds a star.
 * Updates database with current display name of user as well.
 * @param {String} userID Discord ID of the user.
 * @param {String} name Display name.
 * @param {String} type Type of star ("READING", "WORKOUT")
 * @param {String} status "GOOD" | "LATE"
 */
const addStar = async (userID, name, type, status) => {
    Stars.sync()
        .then(() => {
            const user = Stars.findOne({ where: { user_id: userID }, raw: true })
            return user;
        })
        .then(data => {
            if (type === "READING") {
                let currStars = data.reading_count + 1;
                let currStreak = data.reading_streak;
                let highestStreak = data.reading_highest;
                let currDate = new Date();
                
                if (status === "GOOD")
                    currStreak = currStreak + 1;
                else if (status === "LATE")
                    currStreak = 1;
                
                if (currStreak > highestStreak || highestStreak === null)
                    highestStreak = currStreak;
                
                Stars.update({ username: name, reading_count: currStars, reading_streak: currStreak, reading_highest: highestStreak, last_reading: currDate.toString(), reading_placed: 0 }, { where: { user_id: userID }});
            } else if (type === "WORKOUT") {
                let currStars = data.workout_count;
                let currStreak = data.workout_streak;
                let highestStreak = data.workout_highest;
                let currDate = new Date();

                currStars++;
                currStreak++;

                // Getting 4 stars in a week earns a super star.
                if (currStreak === 4)
                    highestStreak = highestStreak + 1;
                    
                Stars.update({ username: name, workout_count: currStars + 1, workout_streak: currStreak, workout_highest: highestStreak, last_workout: currDate.toString(), workout_placed: 0 }, { where: { user_id: userID }});
            } else {
                console.error("No star type included");
            }
        })
}



/**
 * Get reading stars.
 */
const getReadingStars = async () => {
    let dbStars = await Stars.findAll({ attributes: ['username', 'reading_count', 'reading_streak', 'reading_highest', 'last_reading'], order: [['updatedAt', 'DESC']] });
    let starsUsers = dbStars.map(e => {
        let str;
        let dbDate = new Date(e.last_reading);
        let dbDateFormat = dbDate.toLocaleString('en-US', { hour12: true });
        str = `**${e.username}**\n${e.reading_count} total stars | ⭐ ${e.reading_streak}/${e.reading_highest}\n**Last Star:** ${dbDateFormat}\n\n`;
        return str;
    }).join('');
    return starsUsers;
}

/**
 * Get workout stars.
 */
const getWorkoutStars = async() => {
    const Op = Sequelize.Op;
    let dbStars = await Stars.findAll({ attributes: ['username', 'workout_count', 'workout_streak', 'workout_highest', 'last_workout'], order: [['updatedAt', 'DESC']], where: { workout_count: { [Op.gt]: 0 } } });
    let starsUsers = dbStars.map(e => {
        let str;
        let dbDate = new Date(e.last_workout);
        let dbDateFormat = dbDate.toLocaleString('en-US', { hour12: true });
        str = `**${e.username}**\n${e.workout_count} total stars | ⭐ ${e.workout_streak} ✨ ${e.workout_highest}\nLast workout: ${dbDateFormat}\n\n`;
        return str;
    }).join('');
    return starsUsers;
}


/**
 * On start of a new day, increment (reading/workout)_placed value
 * @param {String} postID ID of the last reminder post
 */
const newDay = async (postID) => {
    const statements = [];
    const stars = await Stars.findAll({ attributes: ['user_id', 'reading_placed', 'workout_placed'], raw: true });

    for (let i = 0; i < stars.length; i++) {
        let readingStarPlaced = stars[i].reading_placed < 2 ? stars[i].reading_placed += 1 : 2;
        let workoutStarPlaced = stars[i].workout_placed;
        
        if (workoutStarPlaced === 0)
            workoutStarPlaced = 1;

        statements.push(
            sequelize.query(
                `UPDATE Stars
                SET reading_placed=${readingStarPlaced}, workout_placed=${workoutStarPlaced}
                WHERE user_id=${stars[i].user_id};`
            )
        );
        statements.push(
            sequelize.query(
                `UPDATE starposts
                SET post_id=${postID}
                WHERE post_type="READING"`
            )
        );
    }

    const res = await Promise.all(statements);
}

/**
 * On start of a new week, update workout_highest and workout_streak
 * @param {*} postID ID of the last reminder post
 */
const newWeek = async (postID) => {
    const statements = [];
    const stars = await Stars.findAll({attributes: ['user_id', 'workout_streak', 'workout_highest'], raw: true});

    for (let i = 0; i < stars.length; i++) {
        
        statements.push(sequelize.query(
            `UPDATE Stars
            SET workout_streak=0, workout_highest=0
            WHERE user_id=${stars[i].user_id};`
        ));

        statements.push(sequelize.query(
            `UPDATE starposts
            SET post_id=${postID}
            WHERE post_type="WORKOUT";`
        ));

    }

    const res = await Promise.all(statements);
}

/**
 * Gets the ID of the last post.
 * @param {String} type 
 * @returns 
 */
const getLastPost = async (type) => {
    const res = StarPosts.sync()
        .then(() => {
            const post = StarPosts.findOne({ where: { post_type: type }, raw: true });
            return post;
        })
        .then(data => {
            return data.post_id;
        });

    return res;
}

/**
 * FOR INTERNAL USE ONLY. Manually enter data just in case
 * @param {String} userID Discord ID
 * @param {String} username Their display name
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
                workout_highest: workoutHighest,
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
            console.log(`'${e.user_id}', '${e.username}', ${e.reading_count}, ${e.reading_streak}, ${e.reading_highest}, '${e.last_reading}', ${e.workout_count}, ${e.workout_streak}, ${e.workout_highest}, '${e.last_workout}'`);
        })
    })
    .catch(err => console.error(err));
}

module.exports = { checkUser, newUser, checkStar, checkSuperStar, addStar, getReadingStars, getWorkoutStars, newDay, newWeek, getAll, getLastPost, manualEntry }