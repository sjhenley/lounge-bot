import { User } from 'discord.js';

interface AddFundsResult {
  amount: number;
  targetUser: User;
}

export default AddFundsResult;
