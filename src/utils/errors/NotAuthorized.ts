import { CustomError, ErrorResponse } from "./CustomError";

export class NotAuthorizedError extends CustomError {
  statusCode = 401;

  name = "NOT_AUTHORIZED";

  constructor(public message: string) {
    super(message);

    this.message = message;

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serialize(): ErrorResponse[] {
    return [
      {
        name: this.name,
        message: this.message,
      },
    ];
  }
}
