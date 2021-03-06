import { User } from '../models';

export class UserManagerService {
  private users: Array<User> = [];

  login(userName: string): User {
    // TODO: username requirements

    let user = this.findUserByUserName(userName);

    if (!!user && !!user.socket && user.socket.connected) {
      throw new Error('User already has an active session');
    }

    if (!user) {
      user = new User(userName);
      this.users.push(user);
    }

    return user;
  }

  logout(id: number) {
    const toLogout = this.findUserById(id);
    if (!!toLogout) {
      toLogout.releaseSocket();
      this.users = this.users.filter(user => user.id !== toLogout.id);
    }
  }

  pairSocketWithUser(user: User, socketId: string): void {
    user.setSocketId(socketId);
  }

  findUserById(id: number): User {
    return this.users.find(user => user.id === id);
  }

  findUserByUserName(userName: string): User {
    return this.users.find(user => user.userName === userName);
  }
}

export const userManagerService = new UserManagerService();
