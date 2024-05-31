import { type ComponentProps } from "react";

import { Flame, Potential, Star } from "~/shared/assets/images";

import { type NavLink } from "./NavLink";

export const linkData: Record<string, ComponentProps<typeof NavLink>[]> = {
  "기댓값 계산기": [
    { href: "/calc/bonus-stat", Icon: Flame, children: "추가옵션" },
    { href: "/calc/potential", Icon: Potential, children: "잠재능력" },
  ],
  시뮬레이터: [
    {
      href: "/sim/starforce",
      Icon: Star,
      children: "스타포스",
    },
  ],
};
