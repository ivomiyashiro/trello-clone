import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider, ThemeProvider } from "./context";
import { Hero, Login, Signup } from "./pages";

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="system" storageKey="ui-theme">
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Hero />} />,
            <Route path="/auth/login" element={<Login />} />,
            <Route path="/auth/signup" element={<Signup />} />,
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
