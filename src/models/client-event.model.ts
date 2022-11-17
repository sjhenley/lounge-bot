import { BaseEvent } from './base-event.model';
import BotClient from './bot-client.model';

export interface ClientEvent extends BaseEvent {
  execute: (client: BotClient) => Promise<void>
}
