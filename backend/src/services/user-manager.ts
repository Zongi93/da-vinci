import { User } from '../models';
import { tableManagerService } from './table-manager';

export class UserManagerService {
  private users: Array<User> = [];

  login(userName: string): User {
    let user = this.findUserByUserName(userName);

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
    console.log('waiting for package');
    user.socket.on('start-game', gameTitle => {
      console.log('package arrived: ' + gameTitle);
      tableManagerService.startTable(user, gameTitle);
    });
  }

  findUserById(id: number): User {
    return this.users.find(user => user.id === id);
  }

  findUserByUserName(userName: string): User {
    return this.users.find(user => user.userName === userName);
  }
}

export const userManagerService = new UserManagerService();
