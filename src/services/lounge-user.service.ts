import { LoungeRole } from '../const/lounge-role.enum';
import BaseDao from '../dao/base.dao';
import logger from '../logger/logger-init';
import LoungeUser from '../models/lounge-user.model';

/**
 * Service for managing Server users
 * @Author Sam Henley
 */
export default class LoungeUserService {
  constructor(private dao: BaseDao) {}

  /**
   * Determine if user has admin privileges by checking role in the database
   * @param userId ID of user to verify
   * @returns true if user is an admin, false otherwise
   */
  public async isPriviledgedUser(userId: string): Promise<boolean> {
    logger.debug(`isPriviledgedUser | Verifying user with id ${userId} has admin priviledges`);
    return this.dao.getUser(userId)
      .then((user) => {
        logger.debug(`isPriviledgedUser | Retrieved user from dao: ${JSON.stringify(user)}`);

        const isAdmin = user.role === LoungeRole.ADMIN;
        logger.debug(`isPriviledgedUser | User is admin: ${isAdmin}`);
        return isAdmin;
      })
      .catch(() => {
        logger.error('isPriviledgedUser | Error retrieving user');
        return false;
      });
  }

  /**
   * Retrieve all data for a user record with the given ID
   * @param userId ID of user to retrieve
   * @returns user data
   */
  public async getUserById(userId: string): Promise<LoungeUser> {
    logger.debug(`getBalanceForUserId | Retrieving user with ID: ${userId}`);
    return this.dao.getUser(userId);
  }

  /**
   * Sends user data to the DAO to be saved
   * @param user user data to save
   * @returns result of transaction
   */
  public async putUser(user: LoungeUser): Promise<boolean> {
    logger.debug(`putUser | Saving user to dao: ${JSON.stringify(user)}`);
    return this.dao.putUser(user);
  }

  public async putUsers(users: LoungeUser[]): Promise<boolean> {
    const putUserPromises = users.map((user) => this.putUser(user));
    return Promise.allSettled(putUserPromises)
      .then((results) => {
        results.forEach((promiseResult) => {
          if (promiseResult.status === 'rejected') {
            logger.error(`putUsers | Error saving user: ${promiseResult.reason}`);
          } else if (promiseResult.status === 'fulfilled') {
            logger.debug(`putUsers | Successfully saved user: ${promiseResult.value}`);
          }
        });
        return true;
      });
  }

  /**
   * Returns all users in the database
   * @returns array of user records
   */
  public async getAllUsers(): Promise<LoungeUser[]> {
    logger.debug('getAllUsers | Retrieving all users');
    return this.dao.getAllUsers();
  }
}
