import { Events } from 'discord.js';
import BotClient from '../models/bot-client.model';
import { ClientEvent } from '../models/client-event.model';

const readyEvent: ClientEvent = {
  name: Events.ClientReady,
  once: true,
  execute: async (client: BotClient) => {
    if (client.isReady()) {
      console.log(`Ready! Logged in as ${client.user.tag}`);
    }
  }
};

export default readyEvent;
