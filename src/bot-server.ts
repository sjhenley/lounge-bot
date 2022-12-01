import * as dotenv from 'dotenv';
import { GatewayIntentBits } from 'discord.js';
import BotClient from './models/bot-client.model';
import botCommands from './commands';
import botEvents from './events';
import { BaseEvent } from './models/base-event.model';
import logger from './logger/logger-init';
import DiscordService from './services/discord.service';
import common from './config/common';
import ActivityController from './controllers/activity.controller';

dotenv.config();
const config = common.config();

logger.info(`Starting app in mode ${process.env.NODE_ENV}`);

// Create a new client instance
const client = new BotClient(
  {
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildMessages,
    ]
  }
);

// Register commands to the client
logger.debug('Registering commands...');
botCommands.forEach((cmd) => {
  logger.debug(`Registering command: ${cmd.data.name}`);
  client.commands.set(cmd.data.name, cmd);
});
logger.info('All commands registered');

// Start the Discord Service
DiscordService.getInstance(client);

// Registering events to the client
logger.debug('Registering events...');
botEvents.forEach((event: BaseEvent) => {
  logger.debug(`Registering event: ${event.name}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
});
logger.info('All events registered');

// TODO: incorporate custom events into the client event handler
logger.debug('Creating activity score audit interval...');
setInterval(async () => {
  logger.info('Activity score audit starting');
  return ActivityController.getInstance().auditUserActivityScore()
    .then((auditResult) => {
      logger.debug(`Activity score audit exited cleanly with result: ${auditResult}`);
    })
    .catch((error) => {
      logger.error(`Activity score audit exited with error: ${JSON.stringify(error)}`);
    })
    .finally(() => {
      logger.info('Activity score audit finished');
    });
}, config.activityScore.balanceReward.scoreAuditInterval);

// Log in to Discord with the client token
const token = process.env.DISCORD_BOT_TOKEN;
client.login(token);
