import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ShoppingBag,
  LayoutDashboard,
  Users,
  Store,
  Tag,
  BarChart,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  User,
  Bell,
  Percent,
  ShoppingCart,
} from "lucide-react";

interface DashboardSidebarProps {
  isMobile?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
}

export function DashboardSidebar({ isMobile, setIsMobileOpen }: DashboardSidebarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [businessOpen, setBusinessOpen] = useState(true);
  const [adminOpen, setAdminOpen] = useState(true);

  if (!user) return null;

  const isAdmin = user.role === "admin";
  const isBusiness = user.role === "business" || user.role === "admin";

  const sidebarLinks = [
    {
      title: "User",
      links: [
        {
          title: "Profile",
          icon: <User className="h-4 w-4" />,
          href: "/user/profile",
          show: true,
        },
        {
          title: "Settings",
          icon: <Settings className="h-4 w-4" />,
          href: "/user/settings",
          show: true,
        },
      ],
    },
    {
      title: "Business",
      show: isBusiness,
      isOpen: businessOpen,
      setIsOpen: setBusinessOpen,
      links: [
        {
          title: "Dashboard",
          icon: <LayoutDashboard className="h-4 w-4" />,
          href: "/business/dashboard",
          show: true,
        },
        {
          title: "Promotions",
          icon: <Tag className="h-4 w-4" />,
          href: "/business/promotions",
          show: true,
        },
        {
          title: "Analytics",
          icon: <BarChart className="h-4 w-4" />,
          href: "/business/analytics",
          show: true,
        },
        {
          title: "Profile",
          icon: <Store className="h-4 w-4" />,
          href: "/business/profile",
          show: true,
        },
        {
          title: "Settings",
          icon: <Settings className="h-4 w-4" />,
          href: "/business/settings",
          show: true,
        },
      ],
    },
    {
      title: "Admin",
      show: isAdmin,
      isOpen: adminOpen,
      setIsOpen: setAdminOpen,
      links: [
        {
          title: "Dashboard",
          icon: <LayoutDashboard className="h-4 w-4" />,
          href: "/admin/dashboard",
          show: true,
        },
        {
          title: "Users",
          icon: <Users className="h-4 w-4" />,
          href: "/admin/users",
          show: true,
        },
        {
          title: "Businesses",
          icon: <Store className="h-4 w-4" />,
          href: "/admin/businesses",
          show: true,
        },
        {
          title: "Promotions",
          icon: <Percent className="h-4 w-4" />,
          href: "/admin/promotions",
          show: true,
        },
        {
          title: "Analytics",
          icon: <BarChart className="h-4 w-4" />,
          href: "/admin/analytics",
          show: true,
        },
        {
          title: "Settings",
          icon: <Settings className="h-4 w-4" />,
          href: "/admin/settings",
          show: true,
        },
      ],
    },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleSwitchToShopping = () => {
    navigate("/");
    if (isMobile && setIsMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <div className={cn("pb-12 h-full flex flex-col", isMobile && "w-[280px]")}>
      {/* Logo and App title */}
      <div className="flex h-14 items-center border-b px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <ShoppingBag className="h-5 w-5" />
          <span>DealFinder</span>
        </Link>
      </div>

      {/* Main navigation */}
      <ScrollArea className="flex-1 px-2 py-2">
        <div className="space-y-4 py-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 font-normal"
            onClick={handleSwitchToShopping}
          >
            <ShoppingCart className="h-4 w-4" />
            Switch to Shopping
          </Button>

          {sidebarLinks.map(
            (section) =>
              section.show && (
                <div key={section.title} className="py-2">
                  {section.setIsOpen ? (
                    <button
                      onClick={() => section.setIsOpen(!section.isOpen)}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium"
                    >
                      {section.title}
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          section.isOpen && "rotate-180"
                        )}
                      />
                    </button>
                  ) : (
                    <div className="px-3 py-2 text-sm font-medium">{section.title}</div>
                  )}

                  {(!section.setIsOpen || section.isOpen) && (
                    <div className="mt-1 space-y-1 pl-2">
                      {section.links.map(
                        (link) =>
                          link.show && (
                            <Button
                              key={link.href}
                              asChild
                              variant={location.pathname === link.href ? "secondary" : "ghost"}
                              size="sm"
                              className="w-full justify-start"
                              onClick={() => isMobile && setIsMobileOpen && setIsMobileOpen(false)}
                            >
                              <Link to={link.href} className="gap-2">
                                {link.icon}
                                <span>{link.title}</span>
                              </Link>
                            </Button>
                          )
                      )}
                    </div>
                  )}
                </div>
              )
          )}
        </div>
      </ScrollArea>

      {/* Logout button */}
      <div className="mt-auto border-t p-4">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Log out
        </Button>
      </div>
    </div>
  );
}