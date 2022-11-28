import ReadyEvent from './ready.event';
import InteractionCreateEvent from './interaction-create.event';
import voiceStateUpdateEvent from './voice-state-update.event';

export default [
  // Client-Level events
  ReadyEvent,

  // Interaction-Level events
  InteractionCreateEvent,

  // Voice State events
  voiceStateUpdateEvent
];
