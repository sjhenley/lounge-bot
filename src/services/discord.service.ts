import logger from '../logger/logger-init';
import BotClient from '../models/bot-client.model';

/**
 * Utility service for interacting with Discord
 */
export default class DiscordService {
  private static instance: DiscordService;

  private constructor(private client?: BotClient) {}

  public static getInstance(client?: BotClient): DiscordService {
    if (!DiscordService.instance) {
      DiscordService.instance = new DiscordService(client);
    }
    return DiscordService.instance;
  }

  public async sendDirectMessageToUser(userId: string, message: string): Promise<void> {
    logger.debug(`sendDirectMessageToUser | Attempting to send message to user ${userId}`);

    if (!this.client) {
      logger.error('sendDirectMessageToUser | Client not defined');
      throw new Error();
    } else {
      const user = this.client.users.cache.get(userId);
      if (!user) {
        logger.error(`sendDirectMessageToUser | User ${userId} not found`);
        throw new Error('');
      } else {
        logger.debug('sendDirectMessageToUser | Sending message');
        await user.send(message);
      }
    }
  }
}
