import { t } from 'elysia';
import { GeneralResponse } from './General';
import { createSelectSchema, createUpdateSchema } from 'drizzle-typebox';
import { mylists } from '../databases/schema';

const Table = { mylists } as const;
export type MyListTable = typeof Table

const _selectReminder = createSelectSchema(Table.mylists);
const _updateReminder = createUpdateSchema(Table.mylists, {
  reminder: t.UnionEnum(["on", "off"]),
  waitingType: t.UnionEnum(["episode", "date"]),
  onDate: t.Optional(t.String({ format: 'date' }))
});

export const MyListStatusRequest = t.Object({
  status: t.UnionEnum(["active", "inactive"])
});

export const MyListReminderBodyRequest = t.Pick(
  _updateReminder, ["waitingType", "onEpisode", "onDate", "reminder"]
);

export const MyListResponse = t.Object({
  ...GeneralResponse.properties,
  data: t.Optional(t.Omit(_selectReminder, ["userId"]))
});

export const MyListAllResponse = t.Object({
  ...GeneralResponse.properties,
  data: t.Array(
    t.Optional(t.Omit(_selectReminder, ["userId"]))
  )
})

export type ReminderBody = {
  reminder: "on" | "off";
  waitingType: "episode" | "date";
  onEpisode: number | null;
  onDate: Date | null;
}

export type UpdateStatusBody = {
  status: "active" | "inactive";
  reminder?: "on" | "off";
}