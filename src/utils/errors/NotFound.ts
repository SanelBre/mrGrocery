import { CustomError, ErrorResponse } from "./CustomError";

export class NotFoundError extends CustomError {
  statusCode = 404;

  name = "NOT_FOUND";

  constructor(public message: string = "") {
    super(message);

    Object.setPrototypeOf(this, NotFoundError.prototype);
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
