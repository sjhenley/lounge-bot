import { LoungeRole } from '../misc/const/lounge-role.enum';
import LoungeUser from '../misc/models/lounge-user.model';

export default abstract class BaseDao {
  /**
   * Creates a record in the database with the given data, or updates the record if it already exists
   * @param user The user that will be updated
   */
  public abstract putUser(user: LoungeUser): Promise<boolean>;

  /**
   * Retrieves the user from the database with the provided userId
   * @param userId primary key of record to retrieve
   */
  public abstract getUser(userId: string): Promise<LoungeUser>;

  /**
   * Retrieve all users from the database
   */
  public abstract getAllUsers(): Promise<LoungeUser[]>;

  /**
   * Retrieves all users from the database with the provided role
   * @param role user role
   */
  public abstract getUsersWithRole(role: LoungeRole): Promise<LoungeUser[]>;

  /**
   * Remove a record from the database
   * @param userId primary key of record to delete
   */
  public abstract deleteUser(userId: string): Promise<boolean>;

  // TODO: move to activity dao?
  /**
   * Update the activityScore value for a user record
   * @param userId ID of user to be updated
   * @param activityScore activityScore value to set
   */
  public abstract updateUserActivityScore(userId: string, activityScore: number): Promise<boolean>;
}
