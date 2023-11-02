import express, { Request, Response, Router } from 'express';
import { Error as MongooseError } from 'mongoose';
import { MongoError } from 'mongodb';
import cardService from './card.service';
import { ValidationError as RunTypesError } from 'runtypes';
import 'express-async-errors';
import { BaseRouter } from '../common/base-router';
import InvalIdIdError from '../common/errs/InvalidIdError';
import { InvalidCardError } from './errs/InvalidCardError';

export class CardRouter extends BaseRouter {

  public router: Router;
  private static _instance?: CardRouter;

  public static instance(): CardRouter {
    if (!CardRouter._instance) {
      CardRouter._instance = new CardRouter();
      return CardRouter._instance;
    }
    return CardRouter._instance as CardRouter;
  }

  private constructor() {
    super('Card');
    this.router = this.initRouter();
  }

  private initRouter = (): Router => {
    const router = express.Router();
    // GET items
    router.get("/", async (_, res: Response) => {
      cardService.getAll()
        .then(cards => res.status(200).send(cards))
        .catch((e: unknown) => CardRouter.send500(res, e instanceof Error ? e.message : undefined));
    });

    // GET items/:id
    router.get("/:id", async (req: Request, res: Response) => {
      const id = req.params.id;
      cardService.getById(id)
        .then((card: any | null) => card ?
          res.status(200).send(card) :
          this.send404(res, id))
        .catch((e: unknown) => {
          if (e instanceof InvalIdIdError) {
            this.send404(res, id);
          } else {
            CardRouter.send500(res, e instanceof Error ? e.message : undefined)
          }
        });
    });

    // POST Card
    router.post("/", async (req: Request, res: Response) => {
      cardService.create(req.body)
        .then(card => res.status(201).json(card))
        .catch((e: unknown) => {
          if (e instanceof RunTypesError) {
            CardRouter.sendException(res, 400,
              'Error parsing request body', e.details);
          } else if (e instanceof MongooseError.ValidationError) {
            CardRouter.sendException(res, 400,
              'Error saving new Card', Object.values(e.errors).map((err) => err.message));
          } else if (e instanceof InvalidCardError) {
            CardRouter.sendException(res, 400,
              'Error saving new Card', e.details);
          } else if ((e as MongoError).code === 11000) {
            CardRouter.sendException(res, 400,
              'A Card with this unique key already exists');
          } else {
            CardRouter.send500(res, e instanceof Error ? e.message : undefined);
          }
        });
    });

    // PUT items/:id
    router.put("/:id", async (req: Request, res: Response) => {
      const id: string | undefined = req.params.id;
      cardService.update(req.body, id)
        .then(card => card ?
          res.status(200).send(card) :
          this.send404(res, id))
        .catch((e: unknown) => {
          if (e instanceof InvalIdIdError) {
            this.send404(res, id);
          } else {
            CardRouter.send500(res, e instanceof Error ? e.message : undefined);
          }
        });
    });

    // DELETE items/:id
    router.delete("/:id", async (req: Request, res: Response) => {
      const id: string | undefined = req.params.id;
      cardService.deleteById(id)
        .then(card => card ?
          res.status(204).send() :
          this.send404(res, id))
        .catch((e: unknown) => {
          if (e instanceof InvalIdIdError) {
            this.send404(res, id);
          } else {
            CardRouter.send500(res, e instanceof Error ? e.message : undefined)
          }
        })
    });

    return router;
  }
}
