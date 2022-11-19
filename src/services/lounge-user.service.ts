import { LoungeRole } from '../const/lounge-role.enum';
import BaseDao from '../dao/base.dao';
import logger from '../logger/logger-init';

/**
 * Service for managing Server users
 * @Author Sam Henley
 */
export default class LoungeUserService {
  constructor(private dao: BaseDao) {}

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
}
