import { t } from 'elysia';

export enum WaitingTypeEnum {
  DISABLED = "disabled",
  EPISODE = "episode",
  DATE = "date"
}

export const GeneralResponse = t.Object({
  status: t.String(),
  message: t.String(),
});

export const ParamId = t.Object({
  id: t.Number({
    required: true,
  })
});