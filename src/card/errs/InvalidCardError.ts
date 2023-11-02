export class InvalidCardError extends Error {

  public readonly details: string[];

  constructor(...details: string[]) {
    super('Error saving malformed Monster');
    this.details = details;
  }
}
