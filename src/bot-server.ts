import * as dotenv from 'dotenv';
import { Events, GatewayIntentBits } from 'discord.js';
import BotClient from './models/bot-client.model';
import botCommands from './commands';

dotenv.config();

// Create a new client instance
const client = new BotClient({ intents: [GatewayIntentBits.Guilds] });

// Register commands to the client
console.log('Registering commands...');
botCommands.forEach((cmd) => {
  console.log(`Registering command: ${cmd.data.name}`);
  client.commands.set(cmd.data.name, cmd);
});
console.log('All commands registered');

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Handle interactions
client.on(Events.InteractionCreate, async (interaction) => {
  console.log(interaction);
  if (interaction.isChatInputCommand()) {
    // handle slash commands
    const command = client.commands.get(interaction.commandName);
    if (!command) {
      console.error(`Command not found matching name ${interaction.commandName}`);
    } else {
      try {
        await command.execute(interaction);
      } catch {
        console.error(`Command execution failed for command ${interaction.commandName}`);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
      }
    }
  }
});

// Log in to Discord with the client token
const token = process.env.DISCORD_BOT_TOKEN;
client.login(token);
