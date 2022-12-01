import { Client, ClientOptions, Collection } from 'discord.js';
import { Command } from './command.model';

class BotClient extends Client<true> {
  public commands: Collection<string, Command>;

  constructor(options: ClientOptions) {
    super(options);
    this.commands = new Collection();
  }
}

export default BotClient;
