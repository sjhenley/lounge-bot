import {
  CommandInteraction,
  User
} from 'discord.js';
import DynamoDbDao from '../dao/dynamodb.dao';
import logger from '../logger/logger-init';
import COMMAND from '../const/command.constants';
import common from '../config/common';
import ActivityService from '../services/activity.service';
import ActivityScoreResult from '../models/interaction-result-data/get-activity-result.model';

const config = common.config();

/**
 * Controller for handling activity business logic
 * @Author Sam Henley
 */
export default class ActivityController {
  private static instance: ActivityController;

  private activityService: ActivityService;

  private constructor() {
    this.activityService = new ActivityService(new DynamoDbDao());
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
    const activityValue = config.activityScore.reward.message;

    logger.debug(`rewardActivityScoreForMessage | Atteping to add score ${activityValue} to user ${userId}`);
    return this.activityService.addUserActivityScore(userId, activityValue)
      .then(() => {
        logger.debug(`rewardActivityScoreForMessage | Successfully added score ${activityValue} to user ${userId}`);
      })
      .catch((error) => {
        logger.error(`rewardActivityScoreForMessage | Error adding activity score to user ${userId}: ${error}`);
      });
  }

  // public async rewardActivityScoreForVoice(userId: string): Promise<void> {}
}
