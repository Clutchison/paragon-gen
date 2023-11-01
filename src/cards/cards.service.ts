import { BaseCard, Card } from "./card.interface";
import { Cards } from "./cards.interface";
import { MongoClient } from "mongodb";

let cards: Cards = {

};

export const findAll = async (): Promise<Card[]> => Object.values(cards);

export const find = async (id: number): Promise<Card> => cards[id];

export const create = async (newCard: BaseCard): Promise<Card> => {
  const id = new Date().valueOf();

  cards[id] = {
    id,
    ...newCard,
  };

  return cards[id];
}


