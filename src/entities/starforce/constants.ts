import { z } from "zod";

export const eventSchema = z.enum([
  "10성 이하 1+1",
  "30% 할인",
  "5/10/15성 100%",
  "샤타포스",
]);
export type Event = z.infer<typeof eventSchema>;
export const eventLabelRecord: Record<Event, string> = {
  "10성 이하 1+1": "10성 이하에서 강화 시 1+1",
  "30% 할인": "비용 30% 할인",
  "5/10/15성 100%": "5, 10, 15성에서 강화 시 성공확률 100%",
  샤타포스: "샤이닝 스타포스",
};

export const discountSchema = z.enum([
  "MVP Silver",
  "MVP Gold",
  "MVP Diamond",
  "PC Room",
]);
export type Discount = z.infer<typeof discountSchema>;
export const discountLabelRecord: Record<Discount, string> = {
  "MVP Silver": "MVP 실버",
  "MVP Gold": "MVP 골드",
  "MVP Diamond": "MVP 다이아",
  "PC Room": "PC방",
};
