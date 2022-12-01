import ReadyEvent from './ready.event';
import InteractionCreateEvent from './interaction-create.event';
import voiceStateUpdateEvent from './voice-state-update.event';
import messageCreateEvent from './message-create.event';

export default [
  // Client-Level events
  ReadyEvent,

  // Interaction-Level events
  InteractionCreateEvent,

  // Voice State events
  voiceStateUpdateEvent,

  // Message events
  messageCreateEvent
];
