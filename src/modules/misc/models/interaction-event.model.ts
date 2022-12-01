import { BaseEvent } from './base-event.model';
import BotInteraction from './bot-interaction.model';

export interface InteractionEvent extends BaseEvent {
  execute: (client: BotInteraction) => Promise<void>
}
