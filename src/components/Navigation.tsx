
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

export const Navigation: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-primary">
              TV Tracker
            </Link>
            <NavigationMenu>
              <NavigationMenuList>
                {user && (
                  <NavigationMenuItem>
                    <Link
                      to="/dashboard"
                      className="inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                    >
                      Dashboard
                    </Link>
                  </NavigationMenuItem>
                )}
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Shows</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-4 w-[200px]">
                      <Link
                        to="/shows/public"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">Public Shows</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Browse all public shows
                        </p>
                      </Link>
                      {user && (
                        <Link
                          to="/shows/my"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">My Shows</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Your private shows
                          </p>
                        </Link>
                      )}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Universes</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-4 w-[200px]">
                      <Link
                        to="/universes/public"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">Public Universes</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Explore public universes
                        </p>
                      </Link>
                      {user && (
                        <Link
                          to="/universes/my"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">My Universes</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Your private universes
                          </p>
                        </Link>
                      )}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {user && (
                  <NavigationMenuItem>
                    <Link
                      to="/admin"
                      className="inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                    >
                      Admin Portal
                    </Link>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-600">
                  {user.email}
                </span>
                <Button variant="outline" size="sm" onClick={signOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/sign-in">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/sign-up">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
