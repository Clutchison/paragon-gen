export const TYPE = {
  creature: 'Creature',
  spell: 'Spell',
  paragon: 'Paragon',
  appellation: 'Appellation',
} as const;
export type Type = keyof typeof TYPE;
