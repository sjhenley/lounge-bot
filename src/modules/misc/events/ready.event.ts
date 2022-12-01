import { Events } from 'discord.js';
import logger from '../../logger/logger-init';
import BotClient from '../models/bot-client.model';
import { ClientEvent } from '../models/client-event.model';

const ReadyEvent: ClientEvent = {
  name: Events.ClientReady,
  once: true,
  execute: async (client: BotClient) => {
    if (client.isReady()) {
      logger.info(`Ready! Logged in as ${client.user.tag}`);
    }
  }
};

export default ReadyEvent;
