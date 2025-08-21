import { t } from 'elysia';
import { GeneralResponse } from './General';
import { users } from '../databases/schema';
import { createSelectSchema } from 'drizzle-typebox';

const Table = { users } as const;
export type UserTable = typeof Table

const _selectUser = createSelectSchema(Table.users, {
  email: t.String({ format: 'email' })
});

const UserDataObject = t.Pick(
  _selectUser, ["fullName", "email", "phone"]
);

export const UserSuccessResponse = t.Object({
  ...GeneralResponse.properties,
  data: UserDataObject
});

export const UserInfoRequest = t.Object({
  fullName: t.String(),
  phone: t.String({
    maxLength: 20
  })
})