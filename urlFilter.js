/**
 * Takes all of the URLs in the string and
 * adds a backtick(`) symbol around the URL
 * @param {String} str String to parse
 */
module.exports = (str) => {
    if (str.length < 1)
        return '(may just be an image or empty...somehow)';
    else {
        let newStr = str;
        const regexURL = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/ig;
        let matched = newStr.match(regexURL);
        for (let i in matched)
            newStr = newStr.replace(matched[i], '`' + matched[i] + '`');
        return newStr;
    }
}