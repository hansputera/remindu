import { t } from 'elysia';
import { GeneralResponse } from './General';


const UserDataObject = t.Object({
  id: t.Number(),
  fullName: t.String(),
  email: t.String(),
  phone: t.String()
});

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