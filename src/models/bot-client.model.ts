import { Client, ClientOptions, Collection } from 'discord.js';
import { CommandModel } from './command.model';

class BotClient extends Client {
  public commands: Collection<string, CommandModel>;

  constructor(options: ClientOptions) {
    super(options);
    this.commands = new Collection();
  }
}

export default BotClient;
