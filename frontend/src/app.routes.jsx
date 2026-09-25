import { createBrowserRouter } from "react-router-dom";
import Register from "./features/pages/Register";
import Login from "./features/pages/Login";
import Home from "./features/pages/Home";
import Interview from "./features/pages/interview";
import Protected from "./features/components/Protected";

export const router = createBrowserRouter([
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element:<Protected> <Home /></Protected>,
  },
  {
    path: "/interview/:interviewId",
    element:<Protected> <Interview /></Protected>,
  }
]);