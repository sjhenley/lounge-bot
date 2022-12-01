import { LoungeRole } from '../const/lounge-role.enum';
import BaseDao from '../dao/base.dao';
import logger from '../logger/logger-init';
import LoungeUser from '../models/lounge-user.model';

/**
 * Service for managing user activity scores
 * @Author Sam Henley
 */
export default class ActivityService {
  constructor(private dao: BaseDao) {}

  /**
   * Fetches a user from the DAO and returns the user's activity score
   * @param userId ID of the user to fetch
   * @returns user's activity score
   */
  public async getActivityScoreForUser(userId: string): Promise<number> {
    logger.debug(`getActivityScoreForUser | Retrieving user with ID: ${userId}`);
    return this.dao.getUser(userId)
      .then((user) => {
        logger.debug(`getActivityScoreForUser | Retrieved user from dao: ${JSON.stringify(user)}`);
        logger.debug(`getActivityScoreForUser | Returning user activity score: ${user.balance}`);
        return user.balance;
      });
  }

  /**
   * Update's a users activity score in the DAO
   * @param userId ID of user to update
   * @param activityScore new activity score
   * @returns true if operation was successful, false otherwise
   */
  public async setUserActivityScore(userId: string, activityScore: number): Promise<boolean> {
    logger.debug(`setUserActivityScore | Retrieving user with ID: ${userId}`);
    return this.dao.getUser(userId)
      .then((user) => {
        const updatedUser: LoungeUser = {
          ...user,
          activityScore,
        };

        logger.debug(`setUserActivityScore | Saving updated user to dao: ${JSON.stringify(user)}`);
        return this.dao.putUser(updatedUser);
      }).catch((error) => {
        if (error.message === 'User not found') {
          // If user does not exist in database, create a new user with the specified balance
          logger.debug(`setUserActivityScore | User does not exist in database. Creating new user with score ${activityScore}`);
          const newUser: LoungeUser = {
            userId,
            role: LoungeRole.USER,
            balance: 0,
            joinedVoiceTimestamp: -1,
            activityScore,
          };

          logger.debug(`setUserActivityScore | Saving new user to dao: ${JSON.stringify(newUser)}`);
          return this.dao.putUser(newUser);
        }
        logger.error(`setUserActivityScore | getUser request error: ${error}`);
        throw new Error(error);
      });
  }

  /**
   * Adds activity score to user
   * @param userId ID of user to update
   * @param activityScore activity score to add
   * @returns result of DAO operation
   */
  public async addUserActivityScore(userId: string, addedScore: number): Promise<boolean> {
    logger.debug(`addUserActivityScore | Retrieving user with ID: ${userId}`);
    return this.dao.getUser(userId)
      .then((user) => {
        const updatedUser: LoungeUser = {
          ...user,
          activityScore: user.activityScore + addedScore,
        };

        logger.debug(`addUserActivityScore | Saving updated user to dao: ${JSON.stringify(user)}`);
        return this.dao.putUser(updatedUser);
      }).catch((error) => {
        if (error.message === 'User not found') {
          // If user does not exist in database, create a new user with the specified balance
          logger.debug(`addUserActivityScore | User does not exist in database. Creating new user with score ${addedScore}`);
          const newUser: LoungeUser = {
            userId,
            role: LoungeRole.USER,
            balance: 0,
            joinedVoiceTimestamp: -1,
            activityScore: 0,
          };

          logger.debug(`addUserActivityScore | Saving new user to dao: ${JSON.stringify(newUser)}`);
          return this.dao.putUser(newUser);
        }
        logger.error(`addUserActivityScore | getUser request error: ${error}`);
        throw new Error(error);
      });
  }
}
