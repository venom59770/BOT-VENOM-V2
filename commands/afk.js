exports.run = function (bot, msg) {
    if (bot.afk == false) {
        bot.afk = true;
        msg.edit(':white_check_mark: You are now AFK!').then(m => m.delete(2000));
    }else {
        bot.afk = false;
        msg.edit(':white_check_mark: You are no longer AFK!').then(m => m.delete(2000));
    }
};

exports.info = {
    name: 'afk',
    usage: 'afk',
    description: 'Marks you as AFK'
};