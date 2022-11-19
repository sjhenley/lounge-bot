export enum LoungeRole {
  ADMIN = 'admin',
  USER = 'user'
}

/**
 * Helper function for mapping a string to LoungeRole enum
 */
export const mapStringToLoungeRole = (roleString: string): LoungeRole => {
  switch (roleString) {
    case 'admin':
      return LoungeRole.ADMIN;
    case 'user':
      return LoungeRole.USER;
    default:
      throw new Error('Invalid role string');
  }
}
