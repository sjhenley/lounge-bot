import { LoungeRole } from '../../misc/const/lounge-role.enum';
import BaseDao from '../../dao/base.dao';
import logger from '../../logger/logger-init';
import LoungeUser from '../../misc/models/lounge-user.model';

export default class EconomyService {
  constructor(private dao: BaseDao) {}

  public async getBalanceForUserId(userId: string): Promise<number> {
    logger.debug(`getBalanceForUserId | Retrieving user with ID: ${userId}`);
    return this.dao.getUser(userId)
      .then((user) => {
        logger.debug(`getBalanceForUserId | Retrieved user from dao: ${JSON.stringify(user)}`);
        logger.debug(`getBalanceForUserId | Returning user balance: ${user.balance}`);
        return user.balance;
      });
  }

  public async removeFundsFromUser(userId: string, amount: number): Promise<boolean> {
    logger.debug(`removeFundsFromUser | Retrieving user with ID: ${userId}`);
    return this.dao.getUser(userId)
      .then((user) => {
        const userBalance = user.balance;
        if (userBalance >= amount) {
          logger.debug(`removeFundsFromUser | User has sufficient funds. Removing ${amount} from user balance`);
          const updatedUser: LoungeUser = {
            ...user,
            balance: user.balance - amount,
          };

          logger.debug(`removeFundsFromUser | Saving updated user to dao: ${JSON.stringify(user)}`);
          return this.dao.putUser(updatedUser);
        }

        logger.warn('User does not have sufficient funds to complete transaction');
        return false;
      })
      .catch((err) => {
        logger.error(`removeFundsFromUser | Error retrieving user: ${err}`);
        return false;
      });
  }

  public async addFundsToUser(userId: string, amount: number): Promise<boolean> {
    logger.debug(`addFundsToUser | Retrieving user with ID: ${userId}`);
    return this.dao.getUser(userId)
      .then((user) => {
        const updatedUser: LoungeUser = {
          ...user,
          balance: user.balance + amount,
        };

        logger.debug(`addFundsToUser | Saving updated user to dao: ${JSON.stringify(user)}`);
        return this.dao.putUser(updatedUser);
      }).catch((error) => {
        if (error.message === 'User not found') {
          // If user does not exist in database, create a new user with the specified balance
          logger.debug(`addFundsToUser | User does not exist in database. Creating new user with balance ${amount}`);
          const newUser: LoungeUser = {
            userId,
            role: LoungeRole.USER,
            balance: amount,
            joinedVoiceTimestamp: -1,
            activityScore: 0
          };

          logger.debug(`addFundsToUser | Saving new user to dao: ${JSON.stringify(newUser)}`);
          return this.dao.putUser(newUser);
        }
        logger.error(`addFundsToUser | getUser request error: ${error}`);
        throw new Error(error);
      });
  }

  public async getTopBalanceUsers(limit: number): Promise<LoungeUser[]> {
    logger.debug('getTopBalanceUsers | Retrieving all users');
    return this.dao.getAllUsers()
      .then((users) => {
        logger.debug(`getTopBalanceUsers | Retrieved ${users.length} users from dao`);
        logger.debug('getTopBalanceUsers | Sorting users by balance');
        users.sort((a, b) => b.balance - a.balance);

        logger.debug(`getTopBalanceUsers | Returning top ${limit} users`);
        return users.slice(0, limit);
      });
  }
}
