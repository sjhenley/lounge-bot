import {
  CacheType,
  CommandInteraction,
  CommandInteractionOption,
  User
} from 'discord.js';
import DynamoDbDao from '../../dao/dynamodb.dao';
import EconomyService from '../services/economy.service';
import logger from '../../logger/logger-init';
import COMMAND from '../const/economy-command.constants';
import AddFundsResult from '../models/add-funds-result.model';
import DiscordService from '../../misc/services/discord.service';
import common from '../../../config/common';
import BalanceResult from '../models/balance-result.model';
import GiveFundsResult from '../models/give-funds-result.model';

const config = common.config();
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
      .then((balance) => {
        const balanceResult: BalanceResult = {
          username: targetUser.username,
          balance,
        };
        logger.debug(`getBalanceForUser | received user balance from service: ${balance}`);
        return balanceResult;
      });
  }

  public async transferFunds(interaction: CommandInteraction): Promise<GiveFundsResult> {
    logger.debug('transferFunds | Begin processing transferFunds command...');

    const sourceUser = interaction.user;
    const targetUser = interaction.options.getUser(COMMAND.GIVE_FUNDS.OPTIONS.TARGET_USER.NAME) as User;
    const amount = interaction.options.get(COMMAND.GIVE_FUNDS.OPTIONS.AMOUNT.NAME) as CommandInteractionOption<CacheType>;

    if (!EconomyController.validateFundsRequest(targetUser, amount)) {
      logger.warn('transferFunds | Invalid funds request');
      throw new Error('Invalid funds request');
    } else {
      logger.debug(`transferFunds | sourceUser: ${sourceUser.username}, targetUser: ${targetUser.username}, amount: ${amount.value}`);
      const amountValue = amount.value as number;

      logger.debug('transferFunds | Removing amount from source user...');
      const removeFundsFromSourceResult = await this.economyService.removeFundsFromUser(sourceUser.id, amountValue);

      if (!removeFundsFromSourceResult) {
        logger.warn('transferFunds | Failed to remove funds from source user');
        throw new Error();
      } else {
        logger.debug('transferFunds | Successfully removed funds from source user');
        logger.debug('transferFunds | Adding amount to target user...');
        const addFundsToUserResult = await this.economyService.addFundsToUser(targetUser.id, amountValue);

        if (!addFundsToUserResult) {
          logger.warn('transferFunds | Failed to add funds to target user');
          logger.debug('transferFunds | Attempting to add funds back to source user');
          await this.economyService.addFundsToUser(sourceUser.id, amountValue);

          throw new Error();
        } else {
          logger.debug('transferFunds | Suceessfully transferred funds');
          return {
            sourceUser,
            targetUser,
            amount: amountValue
          };
        }
      }
    }
  }

  public async addFundsToUser(interaction: CommandInteraction): Promise<AddFundsResult> {
    logger.debug('addFundsToUser | Begin processing addFundsToUser command...');

    const targetUser = interaction.options.getUser(COMMAND.GIVE_FUNDS.OPTIONS.TARGET_USER.NAME) as User;
    const amount = interaction.options.get(COMMAND.GIVE_FUNDS.OPTIONS.AMOUNT.NAME) as CommandInteractionOption<CacheType>;

    if (!EconomyController.validateFundsRequest(targetUser, amount)) {
      logger.warn('addFundsToUser | Invalid funds request');
      throw new Error('Invalid funds request');
    } else {
      logger.debug(`addFundsToUser | targetUser: ${targetUser.username}, amount: ${amount.value}`);
      const amountValue = amount.value as number;

      return this.economyService.addFundsToUser(targetUser.id, amountValue)
        .then((result) => {
          if (result) {
            logger.debug('addFundsToUser | Successfully added funds to user');
            return {
              targetUser,
              amount: amountValue
            };
          }

          logger.warn('addFundsToUser | Failed to add funds to user');
          throw new Error();
        });
    }
  }

  public async getTopBalanceUsers(): Promise<BalanceResult[]> {
    logger.debug('getTopBalanceUsers | Begin processing getTopBalanceUsers command...');

    const limit = 5;

    return this.economyService.getTopBalanceUsers(limit)
      .then((results) => {
        logger.debug(`getTopBalanceUsers | Received top users: ${JSON.stringify(results)}`);
        logger.debug('getTopBalanceUsers | Mapping user IDs to usernames...');

        const balanceResults: BalanceResult[] = results.map((user) => {
          let username: string;
          try {
            logger.debug(`getTopBalanceUsers | Getting username for user ID: ${user.userId}`);
            username = DiscordService.getInstance().retrieveUsername(user.userId);
          } catch {
            logger.warn(`getTopBalanceUsers | Failed to get username for user ID: ${user.userId}`);
            username = `<id:${user.userId}>`;
          }

          return {
            username,
            balance: user.balance
          };
        });

        logger.debug(`getTopBalanceUsers | Returning top users: ${JSON.stringify(balanceResults)}`);
        return balanceResults;
      });
  }

  private static validateFundsRequest(targetUser: User | null, amount: CommandInteractionOption<CacheType> | null): boolean {
    logger.debug('validateFundsRequest | Begin validating funds request...');

    let isValid = true;
    if (targetUser == null) {
      logger.debug('validateFundsRequest | No target user specified');
      isValid = false;
    } else if (!amount || !amount.value) {
      logger.debug('validateFundsRequest | No amount specified');
      isValid = false;
    } else if (typeof amount.value !== 'number' || amount.value < 0) {
      logger.debug('validateFundsRequest | Invalid amount');
      isValid = false;
    }

    logger.debug(`validateFundsRequest | Funds request is valid: ${isValid}`);
    return isValid;
  }

  /**
   * Ensure the top balance user is on the correct member.
   */
  public async updateTopBalanceRole(interaction: CommandInteraction): Promise<boolean> {
    logger.info('Begin updating top balance role...');
    logger.debug('updateTopBalanceRole | Retrieving guild object...');
    const { guild } = interaction;
    if (!guild) {
      logger.warn('updateTopBalanceRole | No guild found');
      return false;
    }

    logger.debug('updateTopBalanceRole | Retrieving top balance role...');
    const topBalanceRole = guild.roles.resolve(config.guild.topBalanceRole.roleId);
    if (!topBalanceRole) {
      logger.error('updateTopBalanceRole | Could not find top balance role');
      return false;
    }

    // retreive the top balance user
    logger.debug('updateTopBalanceRole | Retrieving top balance user from database...');
    const topBalanceUser = (await this.economyService.getTopBalanceUsers(1))[0];

    logger.debug('updateTopBalanceRole | Attempting to resolve top balance user with a Discord GuildMember...');
    const topBalanceGuildMember = guild.members.resolve(topBalanceUser.userId);

    if (!topBalanceGuildMember) {
      logger.error(`updateTopBalanceRole | Could not find top balance guild member with ID: ${topBalanceUser.userId}`);
      return false;
    }

    // retrieve member(s) with the top balance role
    const currentTopBalanceMembers = topBalanceRole.members;

    // add role to top balance user
    logger.debug('updateTopBalanceRole | Adding top balance role to top balance user...');
    await topBalanceGuildMember.roles.add(topBalanceRole);

    // remove role from all other members
    logger.debug('updateTopBalanceRole | Removing top balance role from all other members...');
    currentTopBalanceMembers.forEach(async (member) => {
      if (member.id !== topBalanceGuildMember.id) {
        logger.debug(`updateTopBalanceRole | Removing top balance role from member ${member.user.username}...`);
        await member.roles.remove(topBalanceRole);
      }
    });

    logger.info('Updated top balance role members');
    return true;
  }
}
