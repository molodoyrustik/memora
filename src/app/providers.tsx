"use client";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import type { ReactNode } from "react";
import { AppStoreProvider } from "@/shared/model/app-store";
import { CharacteristicsStoreProvider } from "@/shared/model/characteristics-store";
import { AppTopNav } from "@/shared/ui/AppTopNav";
import { theme } from "@/theme/theme";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppStoreProvider>
          <CharacteristicsStoreProvider>
            <AppTopNav />
            {children}
          </CharacteristicsStoreProvider>
        </AppStoreProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
