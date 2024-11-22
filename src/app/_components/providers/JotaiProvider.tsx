"use client";

import { Provider, createStore } from "jotai";
import { DevTools } from "jotai-devtools";
import { type PropsWithChildren } from "react";
if (process.env.NODE_ENV === "development") {
  require("jotai-devtools/styles.css");
}

const globalStore = createStore();

export const JotaiProvider = ({ children }: PropsWithChildren) => {
  return (
    <Provider store={globalStore}>
      {children}
      <DevTools store={globalStore} />
    </Provider>
  );
};
