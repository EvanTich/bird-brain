/**
 * Bird bot! Has a bird brain too!
 */
const Discord = require('discord.js');

const { token } = require('./token.json');

function get_arg(long, short) {
    let i = process.argv.indexOf(long);
    if(short && i == -1) {
        i = process.argv.indexOf(short);
    }

    if(i == -1 || i + 1 >= process.argv.length) {
        return false;
    }

    return parseInt(process.argv[i + 1]);
}

// process args
const DEBUG = process.argv.includes('--debug');
const MIN_TIME = get_arg('--min') || 500000;
const MIX_TIME = get_arg('--mix') || 500000;
const MIN_WAIT_TIME = get_arg('--minwait') || 3000;
const MIX_WAIT_TIME = get_arg('--mixwait') || 2000;
// end of process args

const client = new Discord.Client();

function random_timeout(func, offset, mixin) {
    let rand = Math.round(Math.random() * (mixin)) + offset;
    setTimeout(func, rand);
}

function bird_out() {
    // join random voice channel in ONE random guild (lazy way of doing it but I think its funny)
    let channel = client.channels.cache.filter(c => c.type === 'voice' && c.members.size > 0).random();
    if(channel) {
        channel.join().then(conn => {
            if(channel.guild)
                console.log(`bird_out at '${channel.guild}' on '${channel.name}'!`);

            random_timeout(() => {
                // wuewuewuewue
                let dispatcher = conn.play('./bird.mp3'); // TODO: add more bird sounds
                dispatcher.on('finish', () => conn.disconnect());
            }, MIN_WAIT_TIME, MIX_WAIT_TIME);
        }).catch(console.error);
    }
}

function print_guilds() {
    let guilds = Array.from(client.channels.cache
            .filter(c => c.type === 'voice' && c.guild)
            .map(c => c.guild)
        ).filter((g, i, arr) => arr.indexOf(g) === i)
        .join(', ');
    console.log('guilds: ', guilds);
}

client.on('ready', () => {
    print_guilds(); // because I want to know
    console.log(`\nready: min=${MIN_TIME}, mix=${MIX_TIME}, minwait=${MIN_WAIT_TIME}, mixwait=${MIX_WAIT_TIME}`);
    
    (function loop() {
        random_timeout(() => {
            bird_out();
            loop();
        }, MIN_TIME, MIX_TIME);
    }());
});

client.login(token);