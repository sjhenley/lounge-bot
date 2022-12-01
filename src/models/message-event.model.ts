import { Message } from 'discord.js';
import { BaseEvent } from './base-event.model';

export interface MessageEvent extends BaseEvent {
  execute: (oldState: Message<boolean>) => Promise<void>
}
