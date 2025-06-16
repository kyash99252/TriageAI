import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, ShieldCheck, Ticket as TicketIcon } from "lucide-react";

interface StoredUser {
  email: string;
  role: string;
}

export default function Navbar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  let user: StoredUser | null = null;
  const userString = localStorage.getItem("user");

  if (userString) {
    try {
      user = JSON.parse(userString) as StoredUser;
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem("user");
    }
  }

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const userInitial = user?.email ? user.email[0].toUpperCase() : "?";

  return (
    <nav className="bg-white/30 backdrop-blur-md border-b sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold text-primary subtle-shine-hover"
        >
          <TicketIcon className="h-7 w-7 text-primary" />
          TriageAI
        </Link>

        <div className="flex items-center gap-3">
          {!token ? (
            <>
              <Button
                variant="outline"
                onClick={() => navigate("/signup")}
                className="subtle-shine-hover"
              >
                Sign Up
              </Button>
              <Button onClick={() => navigate("/login")} className="metallic-shine-hover">
                Login
              </Button>
            </>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border border-primary/50">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white/30 backdrop-blur-md border shadow-lg rounded-xl" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Hi, {user.email.split('@')[0]}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user.role === "admin" && (
                  <DropdownMenuItem onClick={() => navigate("/admin")} className="cursor-pointer">
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Admin Panel
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={logout} className="text-red-500 hover:!text-red-500 hover:!bg-red-500/10 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </div>
    </nav>
  );
}