export class InvalidPlayError extends Error {
  readonly message: string;

  constructor(message: string) {
    super(message);
    this.message = message;
    Object.setPrototypeOf(this, InvalidPlayError.prototype);
  }
}
