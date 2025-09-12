import { Outlet } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";

const RootLayout = () => {
  return (
    <>
      <Toaster />
      {/* <Navbar /> */}
      <Outlet />
    </>
  );
};

export default RootLayout;
