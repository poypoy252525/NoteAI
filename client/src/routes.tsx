import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import NoteDetails from "./pages/note-details";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/note/:id",
    element: <NoteDetails />,
  },
]);
