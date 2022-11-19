import { LoungeRole } from '../const/lounge-role.enum';

interface LoungeUser {
  userId: string;
  role: LoungeRole;
  balance: number;
}

export default LoungeUser;
