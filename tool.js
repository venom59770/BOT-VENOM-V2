module.exports = {
    /*
    Generates a random integer from 0 to upper exclusive.
    @param {Number} upper The upper bound of the random integer.
    @return {Number} A random integer from 0 to upper exclusive.
    */
    randint(upper) {
        return Math.floor(Math.random() * (upper));
    },

    /*
    Checks if value is an integer.
    @param value Value to check.
    @return true if integer, false otherwise
    */
    isInt(value) { 
        let x = parseFloat(value);
        return !isNaN(value) && (x | 0) === x;
    },

    /*
    Wraps the content in an unformatted text box.
    @param {String} content The content to wrap.
    @return The wrapped content.
    */
    wrap(content) {
        return '``' + content + '``';
    },

    parseOptions(commandString) {
        let matches;
        let shortRegex = / -(\w+)/g;
        let longRegex = / --(\w+)/g;
        let shortOpts = [];
        let longOpts = [];
        while (matches = shortRegex.exec(commandString)) {
            if (matches[1].indexOf('--') == -1) {
                //Parse combined short args. ex: '-abc' where a, b, c are options.
                for (let i = 0; i < matches[1].length; i++) {
                    shortOpts.push(matches[1][i]);
                }
            }
        }
        while (matches = longRegex.exec(commandString)) {
            longOpts.push(matches[1]);
        }
        return {
            short: shortOpts,
            long: longOpts
        };
    },

    /*
    Parse the argument for the specified option from commandString.
    @param {String} option The option to parse the argument for.
    @param {String} commandString The command to search.
    @return The argument for the specified option, or null if the arg couldn't be found.
    */
    parseOptionArg(option, commandString) {
        let regex = new RegExp(`--${option} (.+)`);

        let matchArg = commandString.match(regex);
        if (matchArg) {
            return matchArg[1].slice(0, this.getNextArgIndex(matchArg[1])).trim().toLowerCase();
        } else {
            return null;
        }
    },

    /*
    Gets the index of the next argument/option. Usually used to chop off that argument.
    If next argument does not exist, index = argString.length.
    @param {String} argString The string to check.
    @return {Number} The index of the next argument, or as above if the arg does not exist.
    */
    getNextArgIndex(argString) {
        let nextArgIndex = argString.indexOf('-');
        return nextArgIndex == -1 ? argString.length : nextArgIndex;
    },

    /*
    Returns the current unix time in seconds.
    @return {Number} the unix time in seconds.
    */
    getUnixTime(){
        return Math.round((new Date()).getTime() / 1000);
    },

    /*
    Disord emojis.
    */
    inaAngry: '<:inaAngry:302886932164116480>',
    inaBaka: '<:inaBaka:301529550783774721>',
    inaError: '<:inaError:338904821299937282>',
    inaHappy: '<:inaHappy:301529610754195456>'
}

