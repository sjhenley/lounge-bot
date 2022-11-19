import BaseDao from '../dao/base.dao';
import logger from '../logger/logger-init';

export default class EconomyService {

  constructor(private dao: BaseDao) {}

  public getBalanceForUserId(userId: string): Promise<number> {
    logger.debug(`getBalanceForUserId | Retrieving user with ID: ${userId}`);
    return this.dao.getUser(userId)
      .then( (user) => {
        logger.debug(`getBalanceForUserId | Retrieved user from dao: ${JSON.stringify(user)}`);
        logger.debug(`getBalanceForUserId | Returning user balance: ${user.balance}`);
        return user.balance;
      })
  }
}
