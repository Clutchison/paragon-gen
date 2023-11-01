import mongoose from "mongoose";
import { String, Record, Number } from 'runtypes';
import { Type } from "./type.interface";
import { Version } from "./version.interface";

export const CardRecord = Record({
  name: String,
  // hpMax: Number.withConstraint(n => n >= HPProps.min && n <= HPProps.max),
  // hpCurrent: Number.withConstraint(n => n >= 0 && n <= HPProps.max),
  // stats: StatsRecord,
  // senses: SenseRecord.optional(),
});

export type Card = {
  name: string;
  cost?: number;
  type: Type;
  subtype?: string;
  text: string;
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
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: false,
  },
  // size: {
  //   type: String,
  //   enum: Object.values(SIZE),
  //   required: false,
  // },
  type: {
    type: String,
    required: false,
  },
  // alignment: {
  //   type: String,
  //   enum: Object.values(ALIGNMENT),
  //   required: false,
  // },
  // ac: {
  //   type: Number,
  //   min: ACProps.min,
  //   max: ACProps.max,
  //   required: false,
  // },
  // hpMax: {
  //   type: Number,
  //   min: 0,
  //   max: HPProps.max,
  //   required: true,
  // },
  // hpCurrent: {
  //   type: Number,
  //   min: HPProps.min,
  //   max: HPProps.max,
  //   required: true,
  // },
  // hpTemp: {
  //   type: Number,
  //   min: 0,
  //   max: HPProps.max,
  //   required: false,
  // },
  // speed: {
  //   type: Number,
  //   min: SpeedConfig.min,
  //   max: SpeedConfig.max,
  //   required: false,
  // },
  // stats: {
  //   type: statsSchema,
  //   required: true
  // },
  // skills: {
  //   type: [String],
  //   enum: Object.values(SKILL),
  //   required: false,
  // },
  // vulnerabilities: {
  //   type: String,
  //   required: false,
  // },
  // resistances: {
  //   type: String,
  //   required: false,
  // },
  // immunities: {
  //   type: String,
  //   required: false,
  // },
  // senses: {
  //   type: senseRangesSchema,
  //   required: false,
  // },
  // languages: {
  //   type: [String],
  //   required: false,
  // },
  // cr: {
  //   type: String,
  //   enum: Object.values(CHALLENGE_RATING),
  //   required: false,
  // },
}, { optimisticConcurrency: true });

cardSchema.pre('save', function(next) {
  this.increment();
  // this.languages = [...new Set(this.languages)];
  // this.skills = [...new Set(this.skills)];
  return next();
});

cardSchema.pre('validate', function(next) {
  // if (this.hpCurrent > this.hpMax) {
  //   next(new InvalidCardError(
  //     'Current HP (' + this.hpCurrent + ')' +
  //     ' cannot be higher than Max HP (' + this.hpMax + ')'));
  // } else {
  //   next();
  // }
  next();
});

cardSchema.statics.build = (attr: Card) => { return new CardModel(attr) };
export const CardModel = mongoose.model<CardDoc, CardModelInterface>('monster', cardSchema);
CardModel.record = CardRecord;

