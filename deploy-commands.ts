import { REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes } from 'discord.js';
import * as dotenv from 'dotenv';
import botCommands from './src/commands';

dotenv.config();

console.log('Begin command definition deployment');

// Collect command definitions
const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
console.log('Collecting command data...');
botCommands.forEach((cmd) => {
  console.log(`Retrieving command: ${cmd.data.name}`);
  commands.push(cmd.data.toJSON());
});
console.log('Finished collecting command data');

// retrieve secrets from the environment
const token = process.env.DISCORD_BOT_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
if (!token) {
  console.error('No bot token found in environment');
  process.exit(1);
}

if (!clientId) {
  console.error('No client ID found in environment');
  process.exit(1);
}

// Establish connection to Discord API
const rest = new REST({ version: '10' }).setToken(token);

// Deploy commands to Discord
(async (): Promise<void> => {
  try {
    console.log(`Deploying ${commands.length} application slash commands...`);

    const data = await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands }
    ) as unknown[];

    console.log(`Successfully deployed ${data.length} application commands`);
  } catch (error) {
    console.error(`Failed to deploy application commands: ${error}`);
  }
})();
