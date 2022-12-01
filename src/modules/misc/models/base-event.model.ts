import { ClientEvents } from 'discord.js';

export interface BaseEvent {
  name: keyof ClientEvents;
  once: boolean;
  execute: Function;
}
