const utils = require('../utils');

let mutedMembers = [];
let possibleArgs = ['add', 'del', 'list'];

exports.info = {
    name: 'mute',
    usage: 'mute add [user] | mute del [user] | mute list',
    description: 'Manages the list of muted users on discord! [Not saved to disk]'
};

exports.run = function (bot, msg, args) {
    if (!args.length > 0){
        showHelp(bot, msg, args);
        return;
    }

    let option = args[0];
    if (possibleArgs.indexOf(option) < 0){
        showHelp(bot, msg, args);
        return;
    }

    if (option === possibleArgs[0]){
        // Add
        if (msg.mentions.users.array().length > 0){
            let embed = utils.getSimpleEmbed('Muted Users', 'The following users have been added to the muted list:', utils.randomColor(), utils.randomFooter());

            msg.mentions.users.array().forEach(member => {
                mutedMembers.push(member);
                embed.addField(member.username, member.id, true);
            });

            msg.editEmbed(embed);

        }else {
            msg.edit(':no_entry_sign: You need to mention someone to add them to the muted list!').then(msg => {msg.delete(2000)});
        }

    }else if (option === possibleArgs[1]){
        // Del
        if (msg.mentions.users.array().length > 0){
            let embed = utils.getSimpleEmbed('Muted Users', 'The following users have been removed from the muted list:', utils.randomColor(), utils.randomFooter());

            msg.mentions.users.array().forEach(member => {
                let index = mutedMembers.indexOf(member);
                if (index > -1){
                    mutedMembers.splice(index, 1);
                }

                embed.addField(member.username, member.id, true);
            });

            msg.editEmbed(embed);

        }else {
            msg.edit(':no_entry_sign: You need to mention someone to remove them to the muted list!').then(msg => {msg.delete(2000)});
        }

    }else if (option === possibleArgs[2]){
        // List

        if (mutedMembers.length > 0) {

            let embed = utils.getSimpleEmbed("Muted Users", 'These users get their messages deleted when they talk! Be warned!', utils.randomColor(), utils.randomFooter());
            mutedMembers.forEach(member => {
                embed.addField(member.username, member.id, true);
            });
            msg.editEmbed(embed);

        }else {
            msg.edit(':no_entry_sign: No users are currently muted!').then(msg => {msg.delete(2000)});
        }
    }
};

exports.onMessage = function (msg) {

  mutedMembers.forEach(member => {
      if (msg.author.id === member.id){

          msg.delete();
          console.log('Deleting message from ' + msg.author.username);
      }
  })
};

function showHelp(bot, msg, args) {

    let embed = utils.getSimpleEmbed('Muted List Help', 'Here is some documentation for the help commands!', utils.randomColor(), utils.randomFooter());
    embed.addField(possibleArgs[0], 'This command allows you to add a user to the list, deleting all their messages from chat!');
    embed.addField(possibleArgs[1], 'This command allows you to remove a user to the list, stopping their messages from being deleted!');
    embed.addField(possibleArgs[2], 'This command allows you to list out the current muted list!');

    msg.editEmbed(embed)
}