import { CommandInteraction, User } from 'discord.js';
import DynamoDbDao from '../dao/dynamodb.dao';
import EconomyService from '../services/economy.service';
import logger from '../logger/logger-init';
import COMMAND from '../const/command.constants';
import BalanceResult from '../models/interaction-result-data/balance-result.model';
import GiveFundsResult from '../models/interaction-result-data/give-funds-result.model';

export default class EconomyController {
  private static instance: EconomyController;
  
  private economyService: EconomyService;

  private constructor() {
    this.economyService = new EconomyService(new DynamoDbDao());
  }

  /**
   * Singleton method
   * @returns singleton instance of the class
   */
  public static getInstance(): EconomyController {
    if (!EconomyController.instance) {
      EconomyController.instance = new EconomyController();
    }
    return EconomyController.instance;
  }

  public async getBalanceForUser(interaction: CommandInteraction): Promise<BalanceResult> {
    logger.debug('getBalanceForUser | Begin processing getBalanceForUser command...');

    // if no user is specified, get the balance for the user who invoked the command
    const userOption = interaction.options.getUser(COMMAND.BALANCE.OPTIONS.TARGET_USER.NAME); 
    let targetUser: User;

    if (userOption) {
      targetUser = userOption;
    } else {
      targetUser = interaction.user;
    }

    return this.economyService.getBalanceForUserId(targetUser.id)
      .then( (balance) => {
        const balanceResult: BalanceResult = {
          username: targetUser.username,
          balance,
        }
        logger.debug(`getBalanceForUser | received user balance from service: ${balance}`);
        return balanceResult;
      });
  }

  public async transferFunds(interaction: CommandInteraction): Promise<GiveFundsResult> {
    logger.debug('transferFunds | Begin processing transferFunds command...');

    const sourceUser = interaction.user;
    const targetUser = interaction.options.getUser(COMMAND.GIVE_FUNDS.OPTIONS.TARGET_USER.NAME);

    const amount = interaction.options.get(COMMAND.GIVE_FUNDS.OPTIONS.AMOUNT.NAME);

    
    if (!targetUser) {
      logger.warn('transferFunds | No target user specified');
      throw new Error();
    } else if (!amount || !amount.value) {
      logger.warn('transferFunds | No amount specified');
      throw new Error();
    } else if (typeof amount.value !== 'number' ||amount.value < 0) {
      logger.warn('transferFunds | Invalid amount');
      throw new Error();
    } else {
      logger.debug(`transferFunds | sourceUser: ${sourceUser.username}, targetUser: ${targetUser.username}, amount: ${amount.value}`);

      logger.debug('transferFunds | Removing amount from source user...');
      const removeFundsFromSourceResult = await this.economyService.removeFundsFromUser(sourceUser.id, amount.value);

      if (!removeFundsFromSourceResult) {
        logger.warn('transferFunds | Failed to remove funds from source user');
        throw new Error();
      } else {
        logger.debug('transferFunds | Successfully removed funds from source user');
        logger.debug('transferFunds | Adding amount to target user...');
        const addFundsToUserResult = await this.economyService.addFundsToUser(targetUser.id, amount.value);

        if (!addFundsToUserResult) {
          logger.warn('transferFunds | Failed to add funds to target user');
          logger.debug('transferFunds | Attempting to add funds back to source user');
          await this.economyService.addFundsToUser(sourceUser.id, amount.value);

          throw new Error();
        } else {
          logger.debug('transferFunds | Suceessfully transferred funds');
          return {
            sourceUser,
            targetUser,
            amount: amount.value
          };
        }
      }
    }
  }
}
