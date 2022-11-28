import { LoungeRole } from '../const/lounge-role.enum';

interface LoungeUser {
  userId: string;
  role: LoungeRole;
  balance: number;
  activityScore: number;
}

export default LoungeUser;
