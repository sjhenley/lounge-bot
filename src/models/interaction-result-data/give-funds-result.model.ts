import { User } from 'discord.js';

interface GiveFundsResult {
  amount: number;
  sourceUser: User;
  targetUser: User;
}

export default GiveFundsResult;
