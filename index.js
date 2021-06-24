/**
 * Bird bot!
*/
const Discord = require('discord.js');

const { token } = require('./token.json');

// process args
const DEBUG = process.argv.includes('--debug');       // prints debug logs if true
// end of process args

const client = new Discord.Client();

function random_timeout(func, offset, mixin) {
    let rand = Math.round(Math.random() * (mixin)) + offset;
    setTimeout(func, rand);
}

function bird_out() {
    // join random voice channel
    let channel = client.channels.cache.filter(c => c.type === 'voice' && c.members.size > 0).random();
    if(channel) {
        channel.join().then(conn => {
            if(channel.guild)
                console.log(`bird_out at '${channel.guild}' on '${channel.name}'!`)

            random_timeout(() => {
                let dispatcher = conn.play('./bird.mp3');
                dispatcher.on('finish', () => conn.disconnect());
            }, 3000, 2000);
        });
    }
}

client.on('ready', () => {
    console.log('ready');
    
    (function loop() {
        random_timeout(() => {
            bird_out();
            loop();
        }, 100000, 50000);
    }());
});

client.login(token);