import logger from '../../logger/logger-init';
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

  /**
   * Sends a Discord Direct Message to a user
   * @param userId ID of user to receive message
   * @param message message content
   */
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
        try {
          await user.send(message);
          logger.info(`Sent direct message to user ${userId}`);
        } catch (error) {
          logger.error(`Error sending direct message to user ${userId}: ${error}`);
        }
      }
    }
  }

  /**
   * Resolves a user ID to a username
   * @param userId ID of user to resolve
   */
  public retrieveUsername(userId: string): string {
    logger.debug(`retrieveUsername | Attempting to retrieve username for user ${userId}`);

    if (!this.client) {
      logger.error('retrieveUsername | Client not defined');
      throw new Error();
    } else {
      const user = this.client.users.cache.get(userId);
      if (!user) {
        logger.error(`retrieveUsername | User ${userId} not found`);
        throw new Error('');
      } else {
        logger.debug(`retrieveUsername | Returning username: ${user.username}`);
        return user.username;
      }
    }
  }
}
