/**
 * Takes all of the URLs in the string and
 * adds a backtick(`) symbol around the URL
 * @param {String} str String to parse
 */
const urlFilter = (str) => {
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

/**
 * Returns time in 12-hour format (ex: 01:15am, 11:22pm)
 * @returns String (hh:mm am|pm)
 */
const currentTime = () => {
    let date = new Date();
    let hour = ((date.getHours() > 12) ? date.getHours() - 12 : date.getHours()).toString().padStart(2, '0');
    let mins = (date.getMinutes().toString().padStart(2, '0')).toString().padStart(2, '0');
    let ampm = (date.getHours() < 11) ? 'am' : 'pm';

    return `${hour}:${mins}${ampm}`;
}


/// TODO
///     Make it return all the channel names and IDs.
///     Then allow the use of String.includes() to get the ID of the channel.
///     Reason: Channels may suddenly get named to something like "⁺the-library" instead of "the-library"
/**
 * Get the cached list of channels in the server and
 * keeps the ID
 * @param {*} client
 * @param {*} arr Array to store values in
 */
const channelCache = (client, arr, names) => {
    let channelCache = client.channels.cache;
    channelCache.forEach((ch) => {
        let name = ch.name;
        if (name.includes('event-logs')) {
            if (!eventsChannel)
                eventsChannel = ch.id;
        }
    });

}

module.exports = { urlFilter, currentTime }