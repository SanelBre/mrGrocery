import { CustomError, ErrorResponse } from "./CustomError";

export class BadRequestError extends CustomError {
  statusCode = 400;

  name = "BAD_REQUEST";

  constructor(public message: string) {
    super(message);

    this.message = message;

    Object.setPrototypeOf(this, BadRequestError.prototype);
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
