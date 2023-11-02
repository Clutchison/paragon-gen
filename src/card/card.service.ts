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

export default {
  create,
  getAll,
  getById,
  update,
  deleteById,
}
