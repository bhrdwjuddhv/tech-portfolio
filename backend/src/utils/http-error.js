// Throw from anywhere; the error handler in app.js turns it into { error } with this status.
export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
