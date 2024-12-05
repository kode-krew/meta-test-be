export class CreateUserInfoBadRequestError {
  message: string;
  error: string;

  constructor() {
    this.message = 'Invalid request body';
    this.error = 'Bad Request';
  }
}

export class CreateUserInfoConflictError {
  message: string;
  error: string;

  constructor() {
    this.message = 'User exists';
    this.error = 'Conflict';
  }
}
