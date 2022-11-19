import BaseDao from '../dao/base.dao';
import logger from '../logger/logger-init';
import LoungeUser from '../models/lounge-user.model';

export default class EconomyService {

  constructor(private dao: BaseDao) {}

  public async getBalanceForUserId(userId: string): Promise<number> {
    logger.debug(`getBalanceForUserId | Retrieving user with ID: ${userId}`);
    return this.dao.getUser(userId)
      .then((user) => {
        logger.debug(`getBalanceForUserId | Retrieved user from dao: ${JSON.stringify(user)}`);
        logger.debug(`getBalanceForUserId | Returning user balance: ${user.balance}`);
        return user.balance;
      })
  }

  public async removeFundsFromUser(userId: string, amount: number): Promise<boolean> {
    logger.debug(`removeFundsFromUser | Retrieving user with ID: ${userId}`);
    return this.dao.getUser(userId)
      .then((user) => {
        const userBalance = user.balance;
        if (userBalance >= amount) {
          logger.debug(`removeFundsFromUser | User has sufficient funds. Removing ${amount} from user balance`);
          user.balance = userBalance - amount;

          logger.debug(`removeFundsFromUser | Saving updated user to dao: ${JSON.stringify(user)}`);
          return this.dao.putUser(user);
        } else {
          logger.warn('User does not have sufficient funds to complete transaction');
          return false;
        }
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
        user.balance += amount;

        logger.debug(`addFundsToUser | Saving updated user to dao: ${JSON.stringify(user)}`);
        return this.dao.putUser(user);
      });
  }

  public async getTopBalanceUsers(limit: number): Promise<LoungeUser[]> {
    logger.debug(`getTopBalanceUsers | Retrieving all users`);
    return this.dao.getAllUsers()
      .then((users) =>{
        logger.debug(`getTopBalanceUsers | Retrieved ${users.length} users from dao`);
        logger.debug(`getTopBalanceUsers | Sorting users by balance`);
        users.sort((a, b) => b.balance - a.balance);

        logger.debug(`getTopBalanceUsers | Returning top ${limit} users`);
        return users.slice(0, limit);
      });
  }
}
