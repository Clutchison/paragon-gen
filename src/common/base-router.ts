import { Response } from 'express';
import HttpException from './http-exception';
import { CardRouter } from '../cards/card.router';

export abstract class BaseRouter {

  protected static readonly sendDetails = (): boolean => process.env.ENV === 'dev';

  constructor(resourceName: string) {
    this.send404 = (res: Response, id: string | undefined) =>
      BaseRouter.sendException(
        res,
        404,
        resourceName + ' not found with id: ' + id,
      );
  }

  protected send404: (res: Response, id: string | undefined) => Response;

  protected static send500 = (res: Response, message?: string) =>
    BaseRouter.sendException(
      res,
      500,
      'Internal server error',
      BaseRouter.sendDetails() ? message : undefined);

  protected static sendException = (res: Response, code: number, e: Error | string, details?: any): Response => {
    const ex = new HttpException(
      code,
      e,
      details);
    return res.status(code).send(ex.toJson());
  };
}
