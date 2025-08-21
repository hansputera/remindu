import { t } from 'elysia';

export enum WaitingTypeEnum {
  DISABLED = "disabled",
  EPISODE = "episode",
  DATE = "date"
}

export enum StatusEnum {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export enum ReminderEnum {
  ON = "on",
  OFF = "off",
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