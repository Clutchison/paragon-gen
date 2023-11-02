export default class HttpException extends Error {
  public statusCode?: number;
  public error: Error | String;
  public details?: {};

  constructor(statusCode: number, error: Error | string, details?: any) {
    super(error instanceof Error ? error.message : error);

    this.statusCode = statusCode;
    this.error = error;
    this.details = details;
  }

  public toJson() {
    return {
      statusCode: this.statusCode,
      error: this.error instanceof Error ? this.error.name : this.error,
      message: this.error instanceof Error ? this.error.message : undefined,
      details: this.details,
    };
  }
}
