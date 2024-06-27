export class User {
  id: number;
  username: string;
  userRole: string;
  displayName?: string;

  constructor() {
    this.id = NaN;
    this.username = '';
    this.userRole = '';
    this.displayName = '';
  }
}
