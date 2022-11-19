import * as dotenv from 'dotenv';
import { GatewayIntentBits } from 'discord.js';
import BotClient from './models/bot-client.model';
import botCommands from './commands';
import botEvents from './events';
import { BaseEvent } from './models/base-event.model';
import logger from './logger/logger-init';
import DiscordService from './services/discord.service';

dotenv.config();

logger.info(`Starting app in mode ${process.env.NODE_ENV}`);

// Create a new client instance
const client = new BotClient({ intents: [GatewayIntentBits.Guilds] });

// Register commands to the client
logger.debug('Registering commands...');
botCommands.forEach((cmd) => {
  logger.debug(`Registering command: ${cmd.data.name}`);
  client.commands.set(cmd.data.name, cmd);
});
logger.info('All commands registered');

// Start the Discord Service
DiscordService.getInstance(client);

botEvents.forEach((event: BaseEvent) => {
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
});

// Log in to Discord with the client token
const token = process.env.DISCORD_BOT_TOKEN;
client.login(token);
