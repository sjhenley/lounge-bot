import { Events, VoiceState } from 'discord.js';
import logger from '../../logger/logger-init';
import VoiceStateController from '../../voice/controllers/voice-state.controller';
import { VoiceStateEvent } from '../models/voice-state-event.model';

const VoiceStateUpdateEvent: VoiceStateEvent = {
  name: Events.VoiceStateUpdate,
  once: false,
  execute: async (oldState: VoiceState, newState: VoiceState) => {
    logger.info('Received voice state update event');

    let eventHandlingResult: boolean = false;

    if (!oldState.channel) {
      logger.debug('Event is a member joining a voice channel');
      eventHandlingResult = await VoiceStateController.handleMemberJoinedVoiceChannel(oldState, newState);
    } else if (!newState.channel) {
      logger.debug('Event is a member leaving all voice channels');
      eventHandlingResult = await VoiceStateController.handleMemberLeftVoiceChannel(oldState, newState);
    } else {
      logger.debug('Event is a member switching voice channels');
      eventHandlingResult = await VoiceStateController.handleMemberSwitchedVoiceChannel(oldState, newState);
    }

    logger.debug(`Voice state update event was handled successfully: ${eventHandlingResult}`);
    logger.info('Finished handling voice state update event');
  }
};

export default VoiceStateUpdateEvent;
