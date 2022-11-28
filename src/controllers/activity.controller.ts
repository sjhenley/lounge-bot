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
    const { id, joinedTimestamp } = member;
    logger.debug(`rewardActivityScoreForVoice | Member ${id} joined voice channel at ${joinedTimestamp}`);

    if (!joinedTimestamp) {
      logger.error(`rewardActivityScoreForVoice | Unable to determine when member ${id} joined voice channel`);
      return false;
    }

    const leftTimestamp = Date.now();
    const timeInVoice = leftTimestamp - joinedTimestamp;

    // calculate minues in voice channel
    const minutesInVoice = Math.floor(timeInVoice / 1000 / 60);
    const activityScorePerMinute = config.activityScore.reward.voice;

    logger.debug(`rewardActivityScoreForVoice | Determined member ${id} was in voice channel for ${minutesInVoice} minute(s)`);

    // calculate activity score to reward
    const activityScore = minutesInVoice * activityScorePerMinute;
    logger.debug(`rewardActivityScoreForVoice | Eligible activity score for member ${id} is ${activityScore}`);

    if (activityScore <= 0) {
      logger.debug(`rewardActivityScoreForVoice | No activity score to reward to user ${id}`);
      return false;
    }

    // reward activity score to user
    logger.debug(`rewardActivityScoreForVoice | Atteping to add score ${activityScore} to user ${id}`);
    return this.activityService.addUserActivityScore(id, activityScore)
      .then(() => {
        logger.debug(`rewardActivityScoreForVoice | Successfully added score ${activityScore} to user ${id}`);
        return true;
      })
      .catch((error) => {
        logger.error(`rewardActivityScoreForVoice | Error adding activity score to user ${id}: ${error}`);
        return false;
      });
  }
}
