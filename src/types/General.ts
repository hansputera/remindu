import { t } from 'elysia';

export const GeneralResponse = t.Object({
  status: t.String(),
  message: t.String(),
});

export const ParamId = t.Object({
  id: t.String({
    required: true,
  })
});