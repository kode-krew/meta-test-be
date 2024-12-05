export class GetUserTestNotFoundError {
  message: string;
  error: 'Not Found';
}

export class GetUserTestRequestQueryBadRequestError {
  message: string[];

  error: 'Bad Request';
}
