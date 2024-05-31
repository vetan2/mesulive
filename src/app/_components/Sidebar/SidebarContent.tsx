import { entries } from "lodash-es";

import { linkData } from "./constants";
import { NavLink } from "./NavLink";

export const SidebarContent = () => {
  return (
    <div className="flex h-full flex-col gap-8 px-4 py-8">
      {entries(linkData).map(([category, linkPropsArray]) => (
        <div key={category}>
          <h3 className="text-sm font-semibold text-default-900">{category}</h3>
          {linkPropsArray.map((linkProps) => (
            <NavLink key={linkProps.href} {...linkProps} className="mt-4" />
          ))}
        </div>
      ))}
    </div>
  );
};
