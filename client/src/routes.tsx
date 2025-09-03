import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import NoteDetails from "./pages/note-details";
import LoginPage from "./pages/login-page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/note/:id",
    element: <NoteDetails />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);
