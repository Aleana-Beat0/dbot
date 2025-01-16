// https://discord.js.org/docs/packages/discord.js/14.17.3

import discordjs, { Client, GatewayIntentBits, Partials, Events } from 'discord.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel],
});

client.once('ready', (event) => {
  if (client.user === null) return;

  console.log("I'm ready, and my name is %s", client.user.tag);
});

client.on(Events.MessageCreate, (message) => {
  if (!message.inGuild()) return;
  console.log('I found a new message:', message.content);

  if (message.content.startsWith('!remind')) {
    const [seconds, ...reminder] = message.content.slice('!remind '.length).split(' ');

    if (Number.isNaN(parseInt(seconds))) {
      message.reply('First argument must be number of seconds!');
      return;
    }

    setTimeout(() => {
      const channel = message.channel;
      const user = message.author;

      channel.send(`${user}, reminder to ${reminder.join(' ')} ${seconds}s ago`);
    }, parseInt(seconds) * 1e3);

    console.log('someone said !remind');
  }
});

const TOKEN = process.env.BOT_TOKEN;
if (!TOKEN) throw new Error("We don't have a token mayday mayday mayday");

client.login(TOKEN).catch((reason) => console.log('we got rejected because', reason));
