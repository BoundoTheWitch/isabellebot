// TODO Make special greetings if user is checking in for the first time (maybe add method to check first then return true or false)
// TODO Find way to send ping to every user everyday (who is participating)
// TODO Stop with TODOs
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

const addStar = async (userID) => {
    Stars.sync()
    .then(() => {
        const user = Stars.findOne({ where: { user_id: userID }, raw: true });
        return user;
    })
    .then(data => {
        let currDate = new Date();
        if (data) {
            let date = new Date(data.last_star);
            let currStars = data.stars_count;
            let currStreak = data.highest_streak;
            if (date.getDate() === currDate.getDate()) {
                currStars = currStars + 1;
                if (currStars > currStreak)
                    currStreak = currStars;
                Stars.update({ stars_count: currStars, last_star: currDate.toString(), highest_streak: currStreak }, { where: { user_id: userID } });
            } else {
                Stars.update({ stars_count: 1, last_star: currDate.toString() }, { where: { user_id: userID }})
            }
        } else {
            Stars.create({ user_id: userID.toString(), last_star: currDate.toString() });
            console.log(`New user added: ${userID}`);
        }
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

const newUser = async (userID) => {
    Stars.sync()
    .then(() => {
        const user = Stars.create({ user_id: userID.toString(), last_star: currDate.toString() });
    })
    .catch(err => console.error(err));
}
module.exports = { newUser, addStar, checkUser };