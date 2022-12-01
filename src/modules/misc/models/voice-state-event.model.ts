import { VoiceState } from 'discord.js';
import { BaseEvent } from './base-event.model';

export interface VoiceStateEvent extends BaseEvent {
  execute: (oldState: VoiceState, newState: VoiceState) => Promise<void>
}
