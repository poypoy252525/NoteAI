import { createBrowserRouter } from "react-router-dom";
import HomePage from "./home-page";
import PrivateRoute from "./components/private-route";
import GuestRoute from "./components/guest-route";
import LoginPage from "./pages/login-page";
import NoteDetailsPage from "./pages/note-details-page";
import SignupPage from "./pages/signup-page";
import CreateNotePage from "./pages/create-note-page";
import SearchPage from "./pages/search-page";

export const router = createBrowserRouter([
  {
    element: <PrivateRoute />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/notes/:id",
        element: <NoteDetailsPage />,
      },
      {
        path: "/notes/new",
        element: <CreateNotePage />,
      },
      {
        path: "/search",
        element: <SearchPage />,
      },
    ],
  },
  {
    element: <GuestRoute />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <SignupPage />,
      },
    ],
  },
]);
