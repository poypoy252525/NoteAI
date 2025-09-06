import { Outlet } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";

const RootLayout = () => {
  return (
    <>
      <Toaster />
      <Outlet />
    </>
  );
};

export default RootLayout;
