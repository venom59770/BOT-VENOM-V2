const utils = require('../utils');

exports.run = function (bot, msg, args) {
    if (args.length < 1) {
        msg.edit(':no_entry_sign: You must specify a message id!').then(m => m.delete(2000));
        return;
    }

    let messageId = args[0];
    let message = msg.channel.fetchMessages().then(function (messages) {
        let message = messages.get(messageId);
        if (message){
            msg.editEmbed(
                utils.embed(message.author.username, message.content, [], {
                    url: "https://www.shaunoneill.me/",
                    thumbnail: message.author.avatarURL
                }).setFooter("Date: " + message.createdAt.toDateString())
            );
        }else {
            msg.edit(':no_entry_sign: No message found!').then(m => m.delete(2000));
        }
    }).catch(function (err) {
        console.error(err)
    });
};

exports.info = {
    name: 'quote',
    usage: 'quote [message id]',
    description: 'Quotes a users message'
};