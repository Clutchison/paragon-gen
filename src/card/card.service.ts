import { Card, CardDoc, CardModel } from "./card.interface";
import mongoose, { Types } from 'mongoose';
import InvalidIdError from "../common/errs/InvalidIdError";
import { Version } from "./version.interface";

type CardDocWithId = (CardDoc & {
  _id: Types.ObjectId;
});

const create = async (newCard: Card): Promise<CardDoc> => {
  const built = CardModel.build(newCard);
  const saved = built.save();
  return saved;
}

const getAll = async (): Promise<CardDocWithId[]> => CardModel.find();

const getById = async (id: string | undefined): Promise<CardDocWithId | null> => {
  if (!idIsValid(id || '')) throw new InvalidIdError(id);
  return CardModel.findById(id);
}

const update = async (updatedCard: Card, id: string | undefined):
  Promise<CardDocWithId | null> => {
  const existingCard = await getById(id);
  if (!existingCard) return null;

  Object.keys(existingCard._doc).forEach(k => {
    if (!k.match(`^_.*`)) {
      const newValue = (updatedCard as any)[k];
      if (newValue !== undefined) (existingCard as any)[k] = newValue;
    }
  });

  return existingCard.save();
}

const deleteById = async (id: string | undefined): Promise<CardDocWithId | null> => {
  const card = await getById(id);
  return card ? card.deleteOne() : null;
}

const idIsValid = mongoose.Types.ObjectId.isValid;

const test = async () => {
  const cards = await getAll();
  log(cards, 'Existing Cards');

  const ids = cards.length > 0 ? cards.map(c => c.cardId) : [-1];
  const newCardId = Math.max(...ids) + 1;
  const newCard = dummyCard(newCardId);
  log(newCard, 'New Card');

  const savedCard = await create(newCard);
  log(savedCard, 'Saved Card');

  const gotCard = await getById(savedCard.id);
  log(gotCard, 'Got Card');

  const cardToUpdate = {
    ...dummyCard(newCardId),
    name: 'Updated Name',
  };
  log(cardToUpdate, 'Card to Update');

  const updatedCard = await update(cardToUpdate, gotCard?.id || -1);
  log(updatedCard, 'Updated Card');

  const deletedCard = await deleteById(updatedCard?.id || -1);
  log(deletedCard, 'Deleted Card');

  const newCards = await getAll();
  log(newCards, 'New Cards');
}

const log = (obj: any, title: any) => {
  console.log('-----' + title + '-----');
  console.log(JSON.stringify(obj));
}

const dummyCard = (id: number): Card => {
  return {
    cardId: id,
    name: 'testName',
    type: 'creature',
    art: 'testArt',
    version: new Version(),
  }
}


const card: Card = {
  cardId: 0,
  name: 'testName',
  type: 'creature',
  art: 'testArt',
  version: new Version(),
};

export default {
  create,
  getAll,
  getById,
  update,
  deleteById,
  test,
}
