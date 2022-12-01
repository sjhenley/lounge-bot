import {
  AttributeValue,
  DeleteItemCommand,
  DeleteItemCommandInput,
  DynamoDB,
  PutItemCommand,
  PutItemCommandInput,
  QueryCommand,
  QueryCommandInput,
  ScanCommand,
  ScanCommandInput,
  UpdateItemCommand,
  UpdateItemCommandInput
} from '@aws-sdk/client-dynamodb';
import common from '../config/common';
import DATABASE from '../const/table.constants';
import { LoungeRole, mapStringToLoungeRole } from '../const/lounge-role.enum';
import logger from '../logger/logger-init';
import BaseDao from './base.dao';
import LoungeUser from '../models/lounge-user.model';

const config = common.config();

/**
 * Interacts with the DynamoDB table specified in the config file
 * @Author Sam Henley
 */
export default class DynamoDbDao extends BaseDao {
  private dbClient: DynamoDB;

  constructor() {
    super();
    this.dbClient = new DynamoDB({ region: process.env.AWS_DEFAULT_REGION });
  }

  public async putUser(user: LoungeUser): Promise<boolean> {
    logger.debug('Building putUser command input...');

    const commandInput: PutItemCommandInput = {
      TableName: config.dynamoDb.tableName,
      Item: {
        [DATABASE.COLUMNS.USER_ID]: { S: user.userId },
        [DATABASE.COLUMNS.ROLE]: { S: user.role },
        [DATABASE.COLUMNS.BALANCE]: { N: user.balance.toString() },
        [DATABASE.COLUMNS.ACTIVITY_SCORE]: { N: user.activityScore.toString() },
        [DATABASE.COLUMNS.JOINED_VOICE_TIMESTAMP]: { N: user.joinedVoiceTimestamp.toString() },
      }
    };

    const command = new PutItemCommand(commandInput);

    logger.debug(`Sending putUser request with options: ${JSON.stringify(commandInput)}`);
    return this.dbClient.send(command)
      .then((data) => {
        logger.debug(`putUser request returned successfully: ${JSON.stringify(data)}`);
        return true;
      })
      .catch((error) => {
        logger.error(`putUser request error ${error}`);
        return false;
      });
  }

  public async getUser(userId: string): Promise<LoungeUser> {
    logger.debug('Building getUser command input...');

    const commandInput: QueryCommandInput = {
      TableName: config.dynamoDb.tableName,
      KeyConditionExpression: '#id = :u',
      ExpressionAttributeNames: {
        '#id': DATABASE.COLUMNS.USER_ID,
      },
      ExpressionAttributeValues: {
        ':u': { S: userId },
      }
    };

    const command = new QueryCommand(commandInput);

    logger.debug(`Sending getUser request with options: ${JSON.stringify(commandInput)}`);
    return this.dbClient.send(command)
      .then((data) => {
        logger.debug(`getUser request returned successfully: ${JSON.stringify(data)}`);
        if (data.Items && data.Items[0]) {
          const userObject: LoungeUser = DynamoDbDao.mapUserResultToLoungeUser(data.Items[0]);
          logger.debug(`getUser | returning user object: ${JSON.stringify(userObject)}`);
          return userObject;
        }

        logger.warn('getUser request returned no data');
        throw new Error('User not found');
      });
  }

  public getAllUsers(): Promise<LoungeUser[]> {
    logger.debug('Building getAllUsers command input...');
    const commandInput: ScanCommandInput = {
      TableName: config.dynamoDb.tableName,
    };

    const command = new ScanCommand(commandInput);

    logger.debug(`Sending getAllUsers request with options: ${JSON.stringify(commandInput)}`);
    return this.dbClient.send(command)
      .then((data) => {
        logger.debug(`getAllUsers request returned successfully: ${JSON.stringify(data)}`);
        if (data.Items) {
          return data.Items.map((item) => DynamoDbDao.mapUserResultToLoungeUser(item));
        }

        logger.warn('getAllUsers request returned no data');
        throw new Error();
      })
      .catch((error) => {
        logger.error(`getAllUsers request error: ${error}`);
        throw new Error(error);
      });
  }

  public async getUsersWithRole(role: LoungeRole): Promise<LoungeUser[]> {
    logger.debug('Building getUsersWithRole command input...');
    const commandInput: ScanCommandInput = {
      TableName: config.dynamoDb.tableName,
      FilterExpression: '#role = :r',
      ExpressionAttributeNames: {
        '#role': DATABASE.COLUMNS.ROLE,
      },
      ExpressionAttributeValues: {
        ':r': { S: role.toString() },
      }
    };

    const command = new ScanCommand(commandInput);

    logger.debug(`Sending getUsersWithRole request with options: ${JSON.stringify(commandInput)}`);
    return this.dbClient.send(command)
      .then((data) => {
        logger.debug(`getUsersWithRole request returned successfully: ${JSON.stringify(data)}`);
        if (data.Items) {
          return data.Items.map((item) => DynamoDbDao.mapUserResultToLoungeUser(item));
        }

        logger.warn('getUsersWithRole request returned no data');
        throw new Error();
      })
      .catch((error) => {
        logger.error(`getUsersWithRole request error: ${error}`);
        throw new Error(error);
      });
  }

  public async deleteUser(userId: string): Promise<boolean> {
    logger.debug('Building deleteUser command input...');

    const commandInput: DeleteItemCommandInput = {
      TableName: config.dynamoDb.tableName,
      Key: {
        [DATABASE.COLUMNS.USER_ID]: { S: userId }
      }
    };

    const command = new DeleteItemCommand(commandInput);

    logger.debug(`Sending deleteUser request with options: ${JSON.stringify(commandInput)}`);
    return this.dbClient.send(command)
      .then((data) => {
        logger.debug(`deleteUser request returned successfully: ${JSON.stringify(data)}`);
        return true;
      })
      .catch((error) => {
        logger.error(`deleteUser request error: ${error}`);
        return false;
      });
  }

  // TODO: move to activity dao?
  public async updateUserActivityScore(userId: string, activityScore: number): Promise<boolean> {
    logger.debug('Building updateUserActivityScore command input...');

    const commandInput: UpdateItemCommandInput = {
      TableName: config.dynamoDb.tableName,
      Key: {
        [DATABASE.COLUMNS.USER_ID]: { S: userId }
      },
      UpdateExpression: 'set #activityScore = :a',
      ExpressionAttributeNames: {
        '#activityScore': DATABASE.COLUMNS.ACTIVITY_SCORE,
      },
      ExpressionAttributeValues: {
        ':a': { N: activityScore.toString() },
      }
    };

    const command = new UpdateItemCommand(commandInput);

    logger.debug(`Sending updateUserActivityScore request with options: ${JSON.stringify(commandInput)}`);
    return this.dbClient.send(command)
      .then((data) => {
        logger.debug(`updateUserActivityScore request returned successfully: ${JSON.stringify(data)}`);
        return true;
      })
      .catch((error) => {
        logger.error(`updateUserActivityScore request error: ${error}`);
        return false;
      });
  }

  /**
   * Helper method to validate record data and transform into a LoungeUser object
   * @param userResult Record data from the database
   */
  private static mapUserResultToLoungeUser(userResult: Record<string, AttributeValue>): LoungeUser {
    logger.debug('Mapping user result to LoungeUser object...');

    // validate userId parameter
    logger.debug('Validating userId parameter...');
    const userIdColumn = userResult[DATABASE.COLUMNS.USER_ID];
    let userId: string;
    if (!userIdColumn || !userIdColumn.S) {
      throw new Error('Invalid user ID');
    } else {
      userId = userIdColumn.S;
    }

    // validate and transform role parameter
    logger.debug('Validating role parameter...');
    const userRoleColumn = userResult[DATABASE.COLUMNS.ROLE];
    let role: LoungeRole;
    if (!userRoleColumn || !userRoleColumn.S) {
      throw new Error('Invalid user role');
    } else {
      role = mapStringToLoungeRole(userRoleColumn.S);
    }

    // validate and transform balance parameter
    logger.debug('Validating balance parameter...');
    const userBalanceColumn = userResult[DATABASE.COLUMNS.BALANCE];
    let balance = 0;
    if (userBalanceColumn && userBalanceColumn.N) {
      balance = parseInt(userBalanceColumn.N, 10);
      if (Number.isNaN(balance)) {
        throw new Error('Invalid user balance');
      }
    }

    // validate and transform activity score parameter
    logger.debug('Validating activity score parameter...');
    const activityScoreColumn = userResult[DATABASE.COLUMNS.ACTIVITY_SCORE];
    let activityScore = 0;
    if (activityScoreColumn && activityScoreColumn.N) {
      activityScore = parseInt(activityScoreColumn.N, 10);
      if (Number.isNaN(activityScore)) {
        throw new Error('Invalid activity score');
      }
    }

    // validate and transform joinedVoiceTimestamp parameter
    logger.debug('Validating joinedVoiceTimestamp parameter...');
    const joinedVoiceTimestampColumn = userResult[DATABASE.COLUMNS.JOINED_VOICE_TIMESTAMP];
    let joinedVoiceTimestamp = -1;
    if (joinedVoiceTimestampColumn && joinedVoiceTimestampColumn.N) {
      joinedVoiceTimestamp = parseInt(joinedVoiceTimestampColumn.N, 10);
      if (Number.isNaN(activityScore)) {
        joinedVoiceTimestamp = -1;
      }
    }

    // build and return LoungeUser object
    const user: LoungeUser = {
      userId,
      role,
      balance,
      activityScore,
      joinedVoiceTimestamp,
    };

    logger.debug(`LoungeUser object built successfully: ${JSON.stringify(user)}`);
    return user;
  }
}
