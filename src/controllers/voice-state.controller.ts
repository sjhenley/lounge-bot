import { VoiceState } from 'discord.js';
import logger from '../logger/logger-init';
import ActivityController from './activity.controller';

/**
 * Controller for handling voice state events
 * @Author Sam Henley
 */
export default class VoiceStateController {
  /**
   * Handles when a member was not in a voice channel and has now joined a voice channel
   * @param oldState guild member's old voice state
   * @param newState guild members's new voice state
   * @param member guild member object
   * @returns result of handling the event
   */
  public static async handleMemberJoinedVoiceChannel(oldState: VoiceState, newState: VoiceState): Promise<boolean> {
    // TODO: log time uesr entered voice channel and save to db
    logger.warn('handleMemberJoinedVoiceChannel | Event handler not implemented');
    return false;
  }

  /**
   * Handles when a member was in a voice channel and has now left all voice channels
   * @param oldState guild member's old voice state
   * @param newState guild members's new voice state
   * @param member guild member object
   * @returns result of handling the event
   */
  public static async handleMemberLeftVoiceChannel(oldState: VoiceState, newState: VoiceState): Promise<boolean> {
    logger.debug('handleMemberLeftVoiceChannel | Handling member left voice channel event...');
    return ActivityController.getInstance().rewardActivityScoreForVoice(oldState);
  }

  /**
   * Handles when a member was in a voice channel and has now switched to a different voice channel
   * @param oldState guild member's old voice state
   * @param newState guild members's new voice state
   * @param member guild member object
   * @returns result of handling the event
   */
  public static async handleMemberSwitchedVoiceChannel(oldState: VoiceState, newState: VoiceState): Promise<boolean> {
    logger.debug('handleMemberLeftVoiceChannel | Handling member switched voice channel event...');
    return ActivityController.getInstance().rewardActivityScoreForVoice(oldState);
  }
}
