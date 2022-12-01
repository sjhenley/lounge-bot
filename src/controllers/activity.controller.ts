import {
  CommandInteraction,
  User,
  VoiceState
} from 'discord.js';
import DynamoDbDao from '../dao/dynamodb.dao';
import logger from '../logger/logger-init';
import COMMAND from '../const/command.constants';
import common from '../config/common';
import ActivityService from '../services/activity.service';
import ActivityScoreResult from '../models/interaction-result-data/get-activity-result.model';
import LoungeUserService from '../services/lounge-user.service';
import LoungeUser from '../models/lounge-user.model';

const config = common.config();

/**
 * Controller for handling activity business logic
 * @Author Sam Henley
 */
export default class ActivityController {
  private static instance: ActivityController;

  private activityService: ActivityService;

  private loungeUserService: LoungeUserService;

  private constructor() {
    this.activityService = new ActivityService(new DynamoDbDao());
    this.loungeUserService = new LoungeUserService(new DynamoDbDao());
  }

  /**
   * Singleton method
   * @returns singleton instance of the class
   */
  public static getInstance(): ActivityController {
    if (!ActivityController.instance) {
      ActivityController.instance = new ActivityController();
    }
    return ActivityController.instance;
  }

  /**
   * Handle slash command for getting a user's activity score
   * @param interaction command interaction
   * @returns activity score result object
   */
  public async getActivityScoreForUser(interaction: CommandInteraction): Promise<ActivityScoreResult> {
    logger.debug('getActivityScoreForUser | Begin processing getActivityScoreForUser command...');

    // if no user is specified, get the balance for the user who invoked the command
    const userOption = interaction.options.getUser(COMMAND.BALANCE.OPTIONS.TARGET_USER.NAME);
    let targetUser: User;

    if (userOption) {
      targetUser = userOption;
    } else {
      targetUser = interaction.user;
    }

    return this.activityService.getActivityScoreForUser(targetUser.id)
      .then((activityScore) => {
        const scoreResult: ActivityScoreResult = {
          username: targetUser.username,
          score: activityScore,
        };
        logger.debug(`getActivityScoreForUser | received user activity score from service: ${activityScore}`);
        return scoreResult;
      });
  }

  /**
   * Handles adding activity score to a user for sending a message
   * @param userId user ID to reward
   */
  public async rewardActivityScoreForMessage(userId: string): Promise<void> {
    logger.debug(`rewardActivityScoreForMessage | Rewarding activity score to ${userId} for sending a message`);
    const activityValue = config.activityScore.activityScoreReward.message;

    logger.debug(`rewardActivityScoreForMessage | Atteping to add score ${activityValue} to user ${userId}`);
    return this.activityService.addUserActivityScore(userId, activityValue)
      .then(() => {
        logger.debug(`rewardActivityScoreForMessage | Successfully added score ${activityValue} to user ${userId}`);
      })
      .catch((error) => {
        logger.error(`rewardActivityScoreForMessage | Error adding activity score to user ${userId}: ${error}`);
      });
  }

  /**
   * Handles adding activity score to a user for joining a voice channel
   * @param voiceState state of the voice event
   */
  public async rewardActivityScoreForVoice(voiceState: VoiceState): Promise<boolean> {
    logger.debug('rewardActivityScoreForVoice | Attempting to reward activity score for joining voice channel');

    // get member associated with this voice state
    const { member } = voiceState;

    if (!member) {
      logger.error('rewardActivityScoreForVoice | Unable to determine member associated with voice state');
      return false;
    }

    // TODO: joinedTimestamp is the time the member joind the Discord server, NOT the voice channel
    // Need to retreive the time the member joined the voice channel via database

    const { id } = member;

    return this.loungeUserService.getUserById(id)
      .then((userRecord) => {
        const joinedTimestamp = userRecord.joinedVoiceTimestamp;

        if (Number.isNaN(joinedTimestamp) || joinedTimestamp <= 0) {
          logger.error(`rewardActivityScoreForVoice | Unable to determine when member ${id} joined voice channel`);
          return false;
        }

        const leftTimestamp = Date.now();
        logger.debug(`rewardActivityScoreForVoice | Member ${id} joined voice channel at ${joinedTimestamp}`);
        logger.debug(`rewardActivityScoreForVoice | Member ${id} left voice channel at ${leftTimestamp}`);

        const timeInVoice = leftTimestamp - joinedTimestamp;

        // calculate minues in voice channel
        const minutesInVoice = Math.floor(timeInVoice / 1000 / 60);
        const activityScorePerMinute = config.activityScore.activityScoreReward.voice;

        logger.debug(`rewardActivityScoreForVoice | Determined member ${id} was in voice channel for ${minutesInVoice} minute(s)`);

        // calculate activity score to reward
        const activityScore = minutesInVoice * activityScorePerMinute;
        logger.debug(`rewardActivityScoreForVoice | Eligible activity score for member ${id} is ${activityScore}`);

        // reward activity score to user
        logger.debug(`rewardActivityScoreForVoice | Atteping to add score ${activityScore} to user ${id}`);
        const updatedUser: LoungeUser = {
          ...userRecord,
          joinedVoiceTimestamp: -1,
          activityScore: userRecord.activityScore + activityScore,
        };

        logger.debug(`addUserActivityScore | Saving updated user to dao: ${JSON.stringify(updatedUser)}`);
        return this.loungeUserService.putUser(updatedUser)
          .then(() => {
            logger.debug(`rewardActivityScoreForVoice | Successfully added score ${activityScore} to user ${id}`);
            return true;
          })
          .catch((error) => {
            logger.error(`rewardActivityScoreForVoice | Error adding activity score to user ${id}: ${error}`);
            return false;
          });
      })
      .catch((error) => {
        logger.error(`rewardActivityScoreForVoice | Error retrieving user record for user ${id}: ${error}`);
        return false;
      });
  }

  public async setUserJoinedVoiceTimestamp(userId: string, timestamp: number): Promise<boolean> {
    logger.debug(`setUserJoinedVoiceTimestamp | Setting user ${userId} joined voice timestamp to ${timestamp}`);

    logger.debug(`setUserJoinedVoiceTimestamp | retrieving user record with ID ${userId}`);
    return this.loungeUserService.getUserById(userId)
      .then((userRecord) => {
        const updatedUser = {
          ...userRecord,
          joinedVoiceTimestamp: timestamp,
        };

        logger.debug(`setUserJoinedVoiceTimestamp | updating user record with ID ${userId}`);
        return this.loungeUserService.putUser(updatedUser)
          .then(() => {
            logger.debug(`setUserJoinedVoiceTimestamp | Successfully set user ${userId} joined voice timestamp to ${timestamp}`);
            return true;
          })
          .catch((error) => {
            logger.error(`setUserJoinedVoiceTimestamp | Error setting user ${userId} joined voice timestamp: ${error}`);
            return false;
          });
      })
      .catch((error) => {
        logger.error(`rewardActivityScoreForVoice | Error retrieving user record for user ${userId}: ${error}`);
        return false;
      });
  }

  /**
   * Check the activity score for all members. If any score is above the threshold, remove that much activity score and reward a balance
   */
  public async auditUserActivityScore(): Promise<boolean> {
    logger.debug('auditUserActivityScore | Attempting to audit user activity score');

    const activityScoreThreshold = config.activityScore.balanceReward.scoreThreshold;
    const activityScoreReward = config.activityScore.balanceReward.rewardAmount;

    logger.debug(`auditUserActivityScore | required activity score for reward is: ${activityScoreThreshold}`);
    logger.debug(`auditUserActivityScore | balance reward for activity is: ${activityScoreReward}`);

    logger.debug('auditUserActivityScore | Retrieving all users');
    return this.loungeUserService.getAllUsers()
      .then((users) => {
        logger.debug('auditUserActivityScore | Successfully retrieved all users');
        const usersToUpdate: LoungeUser[] = [];
        for (const user of users) {
          logger.debug(`auditUserActivityScore | Auditing user ${user.userId}`);
          let updatedActivityScore = user.activityScore;
          let updatedBalance = user.balance;

          if (user.activityScore >= activityScoreThreshold) {
            logger.debug(`auditUserActivityScore | User ${user.userId} has activity score above threshold`);
            while (updatedActivityScore >= activityScoreThreshold) {
              updatedActivityScore -= activityScoreThreshold;
              updatedBalance += activityScoreReward;
            }

            const updatedUser: LoungeUser = {
              ...user,
              activityScore: updatedActivityScore,
              balance: updatedBalance,
            };

            logger.debug(`auditUserActivityScore | Saving updated user: ${JSON.stringify(updatedUser)}`);
            usersToUpdate.push(updatedUser);
          } else {
            logger.debug(`auditUserActivityScore | User ${user.userId} has activity score below threshold`);
          }
        }
        logger.debug('auditUserActivityScore | Successfully audited all users');
        logger.debug('auditUserActivityScore | Sending updated users to dao');
        return this.loungeUserService.putUsers(usersToUpdate);
      })
      .catch((error) => {
        logger.error(`auditUserActivityScore | Error retrieving all users: ${JSON.stringify(error)}`);
        return false;
      });
  }
}
