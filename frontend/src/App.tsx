import { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";

import { AuthProvider, ThemeProvider } from "@/context";

import { Toaster } from "@/components/ui";
import { AppRouter } from "@/components";

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="system" storageKey="ui-theme">
        <AuthProvider>
          <Suspense fallback={"Cargando..."}>
            <AppRouter />
          </Suspense>
        </AuthProvider>
      </ThemeProvider>
      <Toaster />
    </BrowserRouter>
  );
};

export default App;
