export class CreateTestBadRequestError {
  message: string;
  error: string;

  constructor() {
    this.message = 'At least one of nickname, gender, age is required.';
    this.error = 'Bad Request';
  }
}

export class CreateTestConflictError {
  message: string;
  error: string;

  constructor() {
    this.message = 'User exists';
    this.error = 'Conflict';
  }
}
