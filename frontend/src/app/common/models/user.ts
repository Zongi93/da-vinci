export class User {
  readonly userName: string;

  constructor(userName: string) {
    this.userName = userName;
  }

  static fromDto(dto: User): User {
    return new User(dto.userName);
  }
}
