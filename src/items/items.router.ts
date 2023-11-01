import express, { Request, Response } from 'express';
import * as ItemService from './items.service';
import { Item } from './item.interface';

export const itemsRouter = express.Router();

// Get all
itemsRouter.get('/', async (_, res: Response) => {
  try {
    const items = await ItemService.findAll();
    res.status(200).json(items);
  } catch (e: unknown) {
    res.status(500).send(e instanceof Error ? e.message : 'Internal Server Error');
  }
});

// Get by id
itemsRouter.get('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  try {
    const item: Item = await ItemService.find(id);
    if (!!item) return res.status(200).json(item);
    res.status(400).send('Item not found.');
  } catch (e: unknown) {
    res.status(500).send(e instanceof Error ? e.message : 'Internal Server Error');
  }
});

// Create
itemsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const newItem = await ItemService.create(req.body);
    res.status(201).json(newItem);
  } catch (e: unknown) {
    res.status(500).send(e instanceof Error ? e.message : 'Internal Server Error');
  }
});

// Update
itemsRouter.put('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  try {
    const itemUpdate: Item = req.body;
    const existingItem: Item = await ItemService.find(id);

    if (!!existingItem) {
      const updatedItem = await ItemService.update(id, itemUpdate);
      return res.status(200).json(updatedItem);
    }
  } catch (e: unknown) {
    res.status(500).send(e instanceof Error ? e.message : 'Internal Server Error');
  }
});

// Update
itemsRouter.put('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  try {
    const itemUpdate: Item = req.body;
    const existingItem: Item = await ItemService.find(id);

    if (!!existingItem) {
      const updatedItem = await ItemService.update(id, itemUpdate);
      return res.status(200).json(updatedItem);
    }

    const newItem = await ItemService.create(itemUpdate);
    res.status(201).json(newItem);
  } catch (e: unknown) {
    res.status(500).send(e instanceof Error ? e.message : 'Internal Server Error');
  }
});

// Delete
itemsRouter.delete('/:id', async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  try {
    await ItemService.remove(id);
    res.sendStatus(204);
  } catch (e: unknown) {
    res.status(500).send(e instanceof Error ? e.message : 'Internal Server Error');
  }
});
