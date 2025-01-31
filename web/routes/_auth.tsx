import { useSignOut } from "@gadgetinc/react";
import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useLocation, useOutletContext } from "@remix-run/react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Toaster } from "@/components/ui/toaster";
import { User, Users, Mail, LogOut, Home, ShoppingCart, Utensils, Sprout } from "lucide-react";
import type { RootOutletContext } from "../root";

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const { session, gadgetConfig } = context;

  const userId = session?.get("user");
  const user = userId ? await context.api.user.findOne(userId) : undefined;

  if (!user) {
    return redirect(gadgetConfig.authentication!.signInPath);
  }

  return json({
    user,
  });
};

export type AuthOutletContext = RootOutletContext & {
  user: any;
};

const UserMenu = () => {
  const { user } = useLoaderData<typeof loader>();
  const [userMenuActive, setUserMenuActive] = useState(false);
  const signOut = useSignOut();

  const getInitials = () => {
    return (
      (user.firstName?.slice(0, 1) ?? "") +
      (user.lastName?.slice(0, 1) ?? "")
    ).toUpperCase();
  };

  return (
    <DropdownMenu
      open={userMenuActive}
     onOpenChange={setUserMenuActive}
    >
      <DropdownMenuTrigger asChild>
        <button className="group flex items-center gap-2 rounded-full p-1 tracking-wider transition-all duration-300 hover:bg-accent/5">
          <Avatar className="transition-all duration-300 group-hover:opacity-80">
            {user.profilePicture?.url ? (
              <AvatarImage src={user.profilePicture.url} alt={user.firstName ?? user.email} />
            ) : (
              <AvatarFallback>{getInitials()}</AvatarFallback>
            )}
          </Avatar>
          <span className="text-sm font-medium transition-all duration-300 group-hover:opacity-80">
            {user.firstName ?? user.email}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem asChild>
          <Link
            to="/profile" 
            className="flex items-center"
          >
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            to="/team" 
            className="flex items-center tracking-wider transition-all duration-300 hover:text-accent hover:opacity-80"
          >
            <Users className="mr-2 h-4 w-4" />
            Team
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            to="/invite" 
            className="flex items-center tracking-wider transition-all duration-300 hover:text-accent hover:opacity-80"
          >
            <Mail className="mr-2 h-4 w-4" />
            Invite
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={signOut}
          className="flex items-center tracking-wider transition-all duration-300 hover:text-red-400 hover:opacity-80 text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default function () {
  const { user } = useLoaderData<typeof loader>();
  const location = useLocation();
  const rootOutletContext = useOutletContext<RootOutletContext>();

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex w-64 flex-col fixed inset-y-0">
        <div className="flex flex-col flex-grow bg-background border-r">
          <div className="h-16 flex items-center px-6 border-b">
            <Link to="/" className="flex items-center">
              <img src="../../camera.png" alt="Logo" className="h-9 w-auto translate-y-1 mr-2" />
              <h1 className="text-3xl font-bold font-sans tracking-wider transition-all duration-300 hover:text-accent hover:opacity-80">
                S2R
              </h1>
            </Link>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-3.5">
            <Link
              to="/signed-in"
              className={`flex items-center px-4 py-2 text-sm rounded-md racking-wider transition-colors duration-300 hover:bg-accent/50 hover:text-accent
                ${location.pathname === "/signed-in"
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
                }`}
            >
              <Home className="mr-3 h-4 w-4" />
              Auto
            </Link>
            <Link
              to="/signed-in"
              className={`flex items-center px-4 py-2 text-sm rounded-md racking-wider transition-colors duration-300 hover:bg-accent/50 hover:text-accent
                ${location.pathname === "/signed-in"
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
                }`}
            >
              <Utensils className="mr-3 h-4 w-4" />
              Recipe Generator
            </Link>
            <Link
              to="/signed-in"
              className={`flex items-center px-4 py-2 text-sm rounded-md racking-wider transition-colors duration-300 hover:bg-accent/50 hover:text-accent
                ${location.pathname === "/signed-in"
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
                }`}
            >
              <ShoppingCart className="mr-3 h-4 w-4" />
              Shopping Assistant
            </Link>
            <Link
              to="/signed-in"
              className={`flex items-center px-4 py-2 text-sm rounded-md racking-wider transition-colors duration-300 hover:bg-accent/50 hover:text-accent
                ${location.pathname === "/signed-in"
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
                }`}
            >
              <Sprout className="mr-3 h-4 w-4" />
              Sustainable Agriculture Tracker
            </Link>
          </nav>
        </div>
      </div>
      <div className="flex-1 flex flex-col md:pl-64">
        <header className="h-16 flex items-center justify-between px-6 border-b bg-background">
          <div className="ml-auto">
            <UserMenu />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-6 py-8">
            <Outlet context={{ ...rootOutletContext, user } as AuthOutletContext} />
            <Toaster />
          </div>
        </main>
      </div>
    </div>
  );
}
