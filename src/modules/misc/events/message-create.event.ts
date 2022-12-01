import { Events, Message } from 'discord.js';
import ActivityController from '../../activity/controllers/activity.controller';
import logger from '../../logger/logger-init';
import { MessageEvent } from '../models/message-event.model';

const MessageCreateEvent: MessageEvent = {
  name: Events.MessageCreate,
  once: false,
  execute: async (message: Message<boolean>) => {
    logger.info('Received Message Create event');
    if (message.inGuild()) {
      await ActivityController.getInstance().rewardActivityScoreForMessage(message.author.id);
    }
    logger.info('Finished handling Message Create event');
  }
};

export default MessageCreateEvent;
