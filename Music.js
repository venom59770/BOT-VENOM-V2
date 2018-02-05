
'use strict';
const config = require('./config.json');
const tool = require('./tool.js');
const ytdl = require('ytdl-core');
const ySearch = require("youtube-search");
const Song = require('./obj/Song.js');
const MusicPlayer = require('./obj/MusicPlayer.js');
const rp = require('request-promise');

module.exports.processCommand = processCommand;

let guilds = {};

function processCommand(msg) {
    if (!msg.guild.available) return;

    //Add guild to the guild list.
    if (!guilds[msg.guild.id])
        guilds[msg.guild.id] = new MusicPlayer();
    let guild = guilds[msg.guild.id];

    let musicCmd = msg.content.split(/\s+/)[1];
    if (musicCmd)
        musicCmd.toLowerCase();
    switch (musicCmd) {
        case 'play':
            return processInput(msg, guild);
        case 'next':
            return guild.skipSong(msg);
        case 'pause':
            return guild.pauseSong();
        case 'reprendre':
            return guild.resumeSong();
        case 'queue':
            return guild.printQueue(msg);
        case 'np':
            return guild.nowPlaying(msg);
        case 'vol':
            return guild.setVolume(msg);
        case 'purge':
            return guild.purgeQueue(msg);

        case 'start':
            return guild.joinVc(msg);
        case 'quitte':
            return guild.leaveVc(msg);
        default:
            msg.channel.send(`SVP référez vous à ${tool.wrap('!aide music')}.`);
    }
}


function processInput(msg, guild) {
    let url = msg.content.split(/\s+/).slice(2).join(' ');
    if (url) {
        if (!url.startsWith('http')) { //Assume its a search.
            processSearch(msg, guild, url);
        } else if (url.search('youtube.com')) { //Youtube.
            let playlist = url.match(/list=(\S+?)(&|\s|$|#)/); //Match playlist id.
            if (playlist) { //Playlist.
                processYoutube.playlist(msg, guild, playlist[1]);
            } else if (url.search(/v=(\S+?)(&|\s|$|#)/)) { //Video.
                processYoutube.song(msg, guild, url);
            } else {
                msg.channel.send(`Lien Youtube non valide !!`);
            }
        } else if (url.search('soundcloud.com')) { //Soundcloud.
            msg.channel.send('Désolé, la musique de Soundcloud n\'est pas fonctionnelle pour le moment.');
        } else {
            msg.channel.send('Désolé, je ne supporte que Youtube maintenant.');
        }
    }
}

function processSearch(msg, guild, searchQuery) {
const opts = {
    maxResults: 3,
    key: config.youtube_api_key
};
    ySearch(searchQuery, opts, function (err, results) {
        if (err) {
            msg.channel.send(`Désolé, je n'ai pas trouvé de musique correspondante.`);
            return console.log(err);
        }
        for (var y = 0; results[y].kind === 'youtube#channel'; y++);
        ytdl.getInfo(results[y].link, function (err, song) {
            if (err) {
                msg.channel.send(`Désolé, je n'ai pas trouvé de musique correspondante.`);
                return console.log(err);
            }
            const author  = msg.author.username + '#' + msg.author.discriminator;
            guild.queueSong(new Song(song.title, song.video_url, 'youtube',  author, time(song.length_seconds), song.iurlmq));
                    msg.channel.send(
            `Mise en file d'attente ${tool.wrap(song.title.trim())} (\`${time(song.length_seconds)}\`) lancer par ${tool.wrap(author)}`
              
        );

        if (guild.status != 'playing')
            guild.playSong(msg, guild);
    
        });
    });
}

/*
Processing functions for Youtube links.
*/
const processYoutube = {
    /*
    Processes a Youtube song, pushing it to the queue.
    @param {String} url The URL of the new song.
    */
    song(msg, guild, url) {
        ytdl.getInfo(url, (err, song) => {
            if (err) {
                console.log(err);
                msg.channel.send(`Désolé, je ne peux mettre votre musique dans la queue.`);
                return;
            }
            const author  = msg.author.username + '#' + msg.author.discriminator;
            console.log(song);
            guild.queueSong(new Song(song.title, url, 'youtube', author,time(song.length_seconds), song.iurlmq));
            msg.channel.send(
                `Mise en file d'attente ${tool.wrap(song.title.trim())} (\`${time(song.length_seconds)}\`) lancer par ${tool.wrap(author)}`
            );
            if (guild.status != 'playing') {
                guild.playSong(msg);
            }
        });
    },

    /*
    Processes a Youtube playlist.
    @param {String} playlistId The ID of the Youtube playlist.
    */
    playlist(msg, guild, playlistId) {
        const youtubeApiUrl = 'https://www.googleapis.com/youtube/v3/';

        Promise.all([getPlaylistName(), getPlaylistSongs([], null)])
            .then(results => addToQueue(results[0], results[1]))
            .catch(err => {
                console.log(err);
                msg.channel.send(
                    `Désolé, je n'ai pas pu ajouter votre playlist à la file d'attente. Réessayez plus tard.`
                )
            });

        async function getPlaylistName() {  
            let options = {
                url: `${youtubeApiUrl}playlists?id=${playlistId}&part=snippet&key=${config.youtube_api_key}`
            }
            let body = await rp(options);
            let playlistTitle = JSON.parse(body).items[0].snippet.title;
            return playlistTitle;
        }



        async function getPlaylistSongs(playlistItems, pageToken) {
            pageToken = pageToken ?
                `&pageToken=${pageToken}` :
                '';

            let options = {
                url: `${youtubeApiUrl}playlistItems?playlistId=${playlistId}${pageToken}&part=snippet,contentDetails&fields=nextPageToken,items(snippet(title,resourceId/videoId,thumbnails),contentDetails)&maxResults=50&key=${config.youtube_api_key}`
            }

            let body = await rp(options);
            let playlist = JSON.parse(body);
            playlistItems = playlistItems.concat(playlist.items.filter( //Concat all non-deleted videos.
                item => item.snippet.title != 'Deleted video'));

            if (playlist.hasOwnProperty('nextPageToken')) { //More videos in playlist.
                playlistItems = await getPlaylistSongs(playlistItems, playlist.nextPageToken);
            }

            return playlistItems;
        }


        async function addToQueue(playlistTitle, playlistItems) {
            let queueLength = guild.queue.length;
            const author  = msg.author.username + '#' + msg.author.discriminator;
            for (let i = 0; i < playlistItems.length; i++) {
                let song = new Song(
                    playlistItems[i].snippet.title,
                    `https://www.youtube.com/watch?v=${playlistItems[i].snippet.resourceId.videoId}`,
                    'youtube', author, "0:00", (playlistItems[i].snippet.thumbnails.medium.url || playlistItems[i].snippet.thumbnails.default.url));
                guild.queueSong(song, i + queueLength);
            }

            msg.channel.send(
                `Enqueued ${tool.wrap(playlistItems.length)} songs from ${tool.wrap(playlistTitle)} requested by ${tool.wrap(msg.author.username + '#' + msg.author.discriminator)}`
            );

            if (guild.status != 'playing') {
                guild.playSong(msg);
            }
        }
    },
}
/*
Parser time for video.
 */

function time(timesec){
        let upTimeOutput = "";
        if (timesec<60) {
            upTimeOutput = `${timesec}s`;
        } else if (timesec<3600) {
            upTimeOutput = `${Math.floor(timesec/60)}:${timesec%60}`;
        } else if (timesec<86400) {
            upTimeOutput = `${Math.floor(timesec/3600)}:${Math.floor(timesec%3600/60)}:${timesec%3600%60}`;
        } else if (timesec<604800) {
            upTimeOutput = `${Math.floor(timesec/86400)}:${Math.floor(timesec%86400/3600)}:${Math.floor(timesec%86400%3600/60)}:${timesec%86400%3600%60}`;
        }
        return upTimeOutput;
}


/*
Timer for inactivity. Leave voice channel after inactivity timer expires.
*/
function timer() {
    for (let guildId in guilds) {
        let guild = guilds[guildId];
        if (guild.status == 'stopped' || guild.status == 'paused')
            guild.inactivityTimer -= 10;
        if (guild.inactivityTimer <= 0) {
            guild.voiceConnection.disconnect();
            guild.voiceConnection = null;
            guild.musicChannel.send(
                ':no_entry_sign: RAPTOR-BOT a quitter le canal vocal pour inactivité.');

            guild.changeStatus('offline');
        }
    }
}
setInterval(timer, 10000);



