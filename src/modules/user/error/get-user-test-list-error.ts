export class GetUserTestListBadRequestError {
  message: string;
  error: string;

  constructor() {
    this.message = 'Invalid request parameters';
    this.error = 'Bad Request';
  }
}
