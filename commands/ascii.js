const utils = require('../utils');
const asciify = require('asciify');

exports.run = function (bot, msg, args) {
    if (args.length < 1) {
        msg.edit(':no_entry_sign: You must specify some text!').then(m => m.delete(2000));
        return;
    }

    asciify(args.join(' '), function (err, res) {

        if (err){
            console.error("An error occurred while trying to convert text to ASCII, Error: " + err.stack);
            return;
        }

        msg.edit("```" + res + "```");
    })
};

exports.info = {
    name: 'ascii',
    usage: 'ascii [text]',
    description: 'Converts text to ASCII and sends it in chat!'
};