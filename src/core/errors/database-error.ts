export class DatabaseError extends Error {
  constructor(public readonly cause?: Error) {
    super('A database error has occurred');
    this.name = 'DatabaseError';
    this.cause = cause;
  }
}
