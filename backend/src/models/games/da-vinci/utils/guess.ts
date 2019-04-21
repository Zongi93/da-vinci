export class Guess {
  readonly userName: string;
  readonly position: number;
  readonly value: number;

  constructor(userName: string, position: number, value: number) {
    this.userName = userName;
    this.position = position;
    this.value = value;
  }

  static fromDto(guess: Guess): Guess {
    return new Guess(guess.userName, guess.position, guess.value);
  }
}
