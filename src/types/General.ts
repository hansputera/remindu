import { t } from 'elysia';

export const GeneralResponse = t.Object({
  status: t.String(),
  message: t.String(),
});