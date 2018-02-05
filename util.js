const bot = require('./index');
const RichEmbed = require('discord.js').RichEmbed;

exports.randomSelection = function () {
    return String(arguments[Math.floor(Math.random() * arguments.length)]);
};

exports.randomColor = function () {
    return [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)];
};

const randomFooter = function () {
    return exports.randomSelection(
        'I fix memory leaks by restarting!',
        'Kai: Im a grumpy old man',
        'I do all my bots in piethawn',
        'CSS and vb are the best, not this Jshit crap'
    );
};

exports.embed = (title, description = '', fields = [], options = {}) => {
    let url = options.url || '';
    let color = options.color || this.randomColor();
    let footer = options.footer === undefined ? true : options.footer;

    if (options.inline) fields = fields.map(obj => { obj.inline = true; return obj; });
    if (fields.length > 0) fields.push({ name: '\u200b', value: '\u200b' });
    if (url !== '') description += '\n';

    return new RichEmbed({ fields, video: options.video || url })
        .setTitle(title, options.thumbnail) //TODO GOTA FIX
        .setColor(color)
        .setDescription(description)
        .setImage(options.image || url)
        .setTimestamp(options.timestamp ? new Date() : null)
        .setFooter(footer ? randomFooter() : '', footer ? bot.client.user.avatarURL : undefined);
};

exports.multiSend = function (channel, messages, delay) {
    delay = delay || 100;
    messages.forEach((m, i) => {
        setTimeout(() => {
            channel.sendMessage(m);
        }, delay * i);
    });
};

exports.sendLarge = function (channel, largeMessage, options = {}) {
    var message = largeMessage;
    var messages = [];
    var prefix = options.prefix || '';
    var suffix = options.suffix || '';

    var max = 2000 - prefix.length - suffix.length;

    while (message.length >= max) {
        var part = message.substr(0, max);
        var cutTo = max;
        if (options.cutOn) {
            cutTo = part.lastIndexOf(options.cutOn);
            part = part.substr(0, cutTo);
        }
        messages.push(prefix + part + suffix);
        message = message.substr(cutTo);
    }

    if (message.length > 1) {
        messages.push(prefix + message + suffix);
    }

    this.multiSend(channel, messages, options.delay);
};

