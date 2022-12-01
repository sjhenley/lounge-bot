import { BaseInteraction } from 'discord.js';
import { RawInteractionData } from 'discord.js/typings/rawDataTypes';
import BotClient from './bot-client.model';

export default class BotInteraction extends BaseInteraction {
  constructor(public client: BotClient, data: RawInteractionData) {
    super(client, data);
  }
}
