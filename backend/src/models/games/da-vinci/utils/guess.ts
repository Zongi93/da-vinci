export class Guess {
  readonly userId: number;
  readonly position: number;
  readonly value: number;

  constructor(userId: number, position: number, value: number) {
    this.userId = userId;
    this.position = position;
    this.value = value;
  }

  static fromDto(guess: Guess): Guess {
    return new Guess(guess.userId, guess.position, guess.value);
  }
}
