import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import PrivateRoute from "./components/private-route";
import LoginPage from "./pages/login-page";
import NoteDetails from "./pages/note-details";
import SignupPage from "./pages/signup-page";

export const router = createBrowserRouter([
  {
    element: <PrivateRoute />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/note/:id",
        element: <NoteDetails />,
      },
    ],
  },

  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <SignupPage />,
  },
]);
