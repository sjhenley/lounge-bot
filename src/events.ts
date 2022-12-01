import InteractionCreateEvent from './modules/misc/events/interaction-create.event';
import MessageCreateEvent from './modules/misc/events/message-create.event';
import ReadyEvent from './modules/misc/events/ready.event';
import VoiceStateUpdateEvent from './modules/misc/events/voice-state-update.event';

export default [
  // Client-Level events
  ReadyEvent,

  // Interaction-Level events
  InteractionCreateEvent,

  // Voice State events
  VoiceStateUpdateEvent,

  // Message events
  MessageCreateEvent
];
