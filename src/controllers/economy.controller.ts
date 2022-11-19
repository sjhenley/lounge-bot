import { CommandInteraction, User } from 'discord.js';
import DynamoDbDao from '../dao/dynamodb.dao';
import EconomyService from '../services/economy.service';
import logger from '../logger/logger-init';
import COMMAND from '../const/command.constants';
import BalanceResult from '../models/interaction-result-data/balance-result.model';

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

  public getBalanceForUser(interaction: CommandInteraction): Promise<BalanceResult> {
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
}

