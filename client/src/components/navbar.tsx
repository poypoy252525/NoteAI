import LogoutDialog from "@/components/logout-dialog";
import { useAuth } from "@/stores/auth";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
//   `px-3 py-2 rounded-md text-sm font-medium ${
//     isActive
//       ? "bg-accent text-accent-foreground"
//       : "text-foreground/80 hover:text-foreground hover:bg-accent/50"
//   }`;

const Navbar = () => {
  const { user, accessToken } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container mx-auto flex h-14 items-center gap-3 px-4 justify-between">
        <div className="mr-2 flex items-center gap-6">
          <Link to={accessToken ? "/" : "/login"} className="font-semibold">
            NoteAI
          </Link>
          {/* {accessToken ? (
            <nav className="hidden gap-1 md:flex">
              <NavLink to="/" className={navLinkClassName} end>
                Home
              </NavLink>
              <NavLink to="/notes/new" className={navLinkClassName}>
                New Note
              </NavLink>
              <NavLink to="/search" className={navLinkClassName}>
                Search
              </NavLink>
            </nav>
          ) : null} */}
        </div>

        <div className="ml-auto flex items-center gap-3 md:ml-4">
          <div className="flex items-center gap-2">
            <Avatar>
              {/* Replace with user profile image when available */}
              <AvatarImage src={undefined} alt={user?.email || "User"} />
              <AvatarFallback>
                {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
            <span className="hidden text-sm text-muted-foreground md:inline">
              {user?.email}
            </span>
          </div>
          <LogoutDialog />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
