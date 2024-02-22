import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import NewsIcon from "@mui/icons-material/Newspaper";
import RestaurantIcon from "@mui/icons-material/RestaurantMenu";
import FoodIcon from "@mui/icons-material/LunchDining";
import LogoutIcon from "@mui/icons-material/Logout";
import ProfileIcon from "@mui/icons-material/Person";
import { cn } from "~/lib/utils";
import { Fira_Sans } from "next/font/google";
import { usePathname, useRouter } from "next/navigation";

const firaSans = Fira_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
});

function NavBar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  console.log(pathname);
  const router = useRouter();
  return (
    <div className="flex w-full max-w-none items-center justify-center">
      <NavigationMenu className="">
        <NavigationMenuList className="flex-grow">
          <NavigationMenuItem className="px-2 py-1">
            <Link
              href="/"
              className={
                "flex flex-row items-center transition-all hover:underline hover:opacity-50" +
                (pathname == "/" ? " underline" : "")
              }
            >
              <NewsIcon></NewsIcon>
              <span>Hírek</span>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem className="px-2 py-1">
            <Link
              href="/nyitasch"
              className={
                "flex flex-row items-center transition-all hover:underline hover:opacity-50" +
                (pathname == "/nyitasch" ? " underline" : "")
              }
            >
              <RestaurantIcon></RestaurantIcon>
              <span>Nyitások</span>
            </Link>
          </NavigationMenuItem>
          {session ? (
            <NavigationMenuItem className="px-2 py-1">
              <Link
                href="/konyha"
                className={
                  "flex flex-row items-center transition-all hover:underline hover:opacity-50" +
                  (pathname == "/konyha" ? " underline" : "")
                }
              >
                <FoodIcon></FoodIcon>
                <span>Konyha</span>
              </Link>
            </NavigationMenuItem>
          ) : null}
          {session ? (
            <NavigationMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex flex-row items-center">
                  <ProfileIcon></ProfileIcon>
                  <span>{session.user.name ?? session.user.email}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                      router.push("/profile");
                    }}
                  >
                    <ProfileIcon
                      onClick={() => {
                        router.push("/profile");
                      }}
                    ></ProfileIcon>
                    <Link
                      href={"/profile"}
                      className={
                        firaSans.className +
                        (pathname === "/profile" ? " underline" : "")
                      }
                    >
                      Profil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                      router.push("/api/auth/signout");
                    }}
                  >
                    <LogoutIcon
                      onClick={() => {
                        router.push("/profile");
                      }}
                    ></LogoutIcon>
                    <Link
                      href={"/api/auth/signout"}
                      className={firaSans.className}
                    >
                      Kijelentkezés
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </NavigationMenuItem>
          ) : (
            <NavigationMenuItem>
              <Link href="/api/auth/signin" legacyBehavior passHref>
                <NavigationMenuLink
                  className={
                    "bg-transparent hover:bg-transparent" +
                    navigationMenuTriggerStyle()
                  }
                >
                  Sign In
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default NavBar;
