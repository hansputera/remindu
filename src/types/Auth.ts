import { t } from 'elysia';
import { GeneralResponse } from './General';

export const LoginBodyRequest = t.Object({
  email: t.String({
    format: 'email',
  }),
  password: t.String({
    format: 'password',
    minLength: 8
  }),
});

const TokenResponse = t.Object({
  token: t.String()
});

export const LoginSuccessResponse = t.Object({
  ...GeneralResponse.properties,
  ...TokenResponse.properties
});

export const RegisterBodyRequest = t.Object({
  fullName: t.String(),
  phone: t.String({
    maxLength: 20
  }),
  ...LoginBodyRequest.properties
});