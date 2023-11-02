import { String, Record } from 'runtypes';


export const CardRecord = Record({
  name: String,
  // hpMax: Number.withConstraint(n => n >= HPProps.min && n <= HPProps.max),
  // hpCurrent: Number.withConstraint(n => n >= 0 && n <= HPProps.max),
  // stats: StatsRecord,
  // senses: SenseRecord.optional(),
});

