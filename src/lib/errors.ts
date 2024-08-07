export class NoPuzzleError extends Error {
  date: Date;

  constructor(message: string) {
    super(message);
    this.name = 'NoPuzzleError';
    this.date = new Date();
  }
}
