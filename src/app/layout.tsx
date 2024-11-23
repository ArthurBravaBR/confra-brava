import { Refine } from "@refinedev/core";
import routerProvider from "@refinedev/nextjs-router";
import { Metadata } from "next";
import React, { Suspense } from "react";

import { authProviderClient } from "@providers/auth-provider";
import { dataProvider } from "@providers/data-provider";
import "@styles/global.css";

export const metadata: Metadata = {
  title: "Confra Brava | 2024",
  description:
    "Plataforma para a confraternização da empresa brava, no ano de 2024",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body>
        <Suspense>
          <Refine
            routerProvider={routerProvider}
            authProvider={authProviderClient}
            dataProvider={dataProvider}
            resources={[
              {
                name: "Sorteador",
                list: "/sorteador",
              },
              {
                name: "Participantes",
                list: "/participantes",
              },
            ]}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              useNewQueryKeys: true,
              projectId: "GBVotK-IogLH4-mAHPhF",
            }}
          >
            {children}
          </Refine>
        </Suspense>
      </body>
    </html>
  );
}
