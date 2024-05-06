import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import { Hero, Login, Signup } from "./pages";

const router = createBrowserRouter(
  createRoutesFromElements([
    <Route path="/" element={<Hero />} />,
    <Route path="/auth/login" element={<Login />} />,
    <Route path="/auth/signup" element={<Signup />} />,
  ]),
);

export default router;
