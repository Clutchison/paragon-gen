import mongoose from "mongoose";
import { Type, TYPE } from "./type.interface";
import { Version } from "./version.interface";
import { CardRecord } from "./card.record";

export type Card = {
  cardId: number;
  name: string;
  cost?: number;
  type: Type;
  subtype?: string;
  text?: string;
  zd?: number;
  bp?: number;
  con?: number;
  art: string;
  token?: boolean;
  version: Version;
}

export interface CardDoc extends mongoose.Document, Card {
  _doc: CardDoc;
}

interface CardModelInterface extends mongoose.Model<CardDoc> {
  record: typeof CardRecord;
  build(card: Card): CardDoc;
}

const cardSchema = new mongoose.Schema({
  cardId: {
    type: Number,
    required: true,
    unique: false,
  },
  name: {
    type: String,
    required: true,
    unique: false,
  },
  cost: {
    type: Number,
    required: false,
    unique: false,
  },
  type: {
    type: String,
    enum: Object.keys(TYPE),
    required: true,
    unique: false,
  },
  subtype: {
    type: String,
    required: false,
    unique: false,
  },
  text: {
    type: String,
    required: false,
    unique: false,
  },
  zd: {
    type: Number,
    required: false,
    unique: false,
  },
  bp: {
    type: Number,
    required: false,
    unique: false,
  },
  con: {
    type: Number,
    required: false,
    unique: false,
  },
  art: {
    type: String,
    required: true,
    unique: false,
  },
  token: {
    type: Boolean,
    required: false,
    unique: false,
  },
  version: {
    type: String,
    required: true,
    unique: false,
  },
}, { optimisticConcurrency: true });

cardSchema.index({ cardId: 1, version: 1 }, { unique: true });

cardSchema.pre('save', function(next) {
  this.increment();
  return next();
});

cardSchema.pre('validate', function(next) {
  next();
});

cardSchema.statics.build = (attr: Card) => { return new CardModel(attr) };
export const CardModel = mongoose.model<CardDoc, CardModelInterface>('card', cardSchema);
CardModel.record = CardRecord;
