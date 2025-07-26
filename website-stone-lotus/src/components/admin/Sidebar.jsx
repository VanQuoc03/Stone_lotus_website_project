import React from "react";
import { useLocation, Link } from "react-router-dom";
import {
  BarChart3,
  ShoppingCart,
  Users,
  Leaf,
  Tag,
  Package,
  BookOpen,
  Megaphone,
  Settings,
  Tag as DiscountIcon,
} from "lucide-react";

const navItems = [
  {
    title: "Tổng quan",
    href: "/admin/dashboard",
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    title: "Sản phẩm",
    href: "/admin/products",
    icon: <Leaf className="h-5 w-5" />,
  },
  {
    title: "Đơn hàng",
    href: "/admin/orders",
    icon: <ShoppingCart className="h-5 w-5" />,
  },
  {
    title: "Khách hàng",
    href: "/admin/customers",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Danh mục",
    href: "/admin/categories",
    icon: <Tag className="h-5 w-5" />,
  },
  {
    title: "Giảm giá",
    href: "/admin/promotions",
    icon: <DiscountIcon className="h-5 w-5" />,
  },
  {
    title: "Kho hàng",
    href: "/inventory",
    icon: <Package className="h-5 w-5" />,
  },
  {
    title: "Hướng dẫn chăm sóc",
    href: "/admin/care-guides",
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    title: "Marketing",
    href: "/marketing",
    icon: <Megaphone className="h-5 w-5" />,
  },
  {
    title: "Cài đặt",
    href: "/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className={`flex min-h-screen flex-col`}>
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-background md:block">
          <nav className="grid gap-2 p-4 text-sm">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  location.pathname === item.href
                    ? "bg-green-50 text-green-900 dark:bg-green-900/20 dark:text-green-600"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
          </nav>
        </aside>
      </div>
    </div>
  );
}
