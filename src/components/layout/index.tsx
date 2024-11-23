"use client";

import type { PropsWithChildren } from "react";
import { Breadcrumb } from "../breadcrumb";
import { Menu } from "../menu";

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="layout w-screen h-screen">
      <Menu />
      <div className="content">
        <Breadcrumb />
        <div className="h-full w-full">{children}</div>
      </div>
    </div>
  );
};
