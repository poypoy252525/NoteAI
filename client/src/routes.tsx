import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import NoteDetails from "./pages/note-details";
import LoginPage from "./pages/login-page";
import SignupPage from "./pages/signup-page";
import RootLayout from "./root-layout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <App />,
      },
    ],
  },
  {
    path: "/note/:id",
    element: <NoteDetails />,
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
