import React, { useState, useEffect } from "react";
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
  Menu,
  Bell,
  Search,
  LogOut,
  Sun,
  Moon,
  Droplets,
} from "lucide-react";
import Header from "@/components/admin/Header";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// Tạm bỏ useMobile, có thể thay bằng logic window.innerWidth nếu cần
// Dark mode toggle đơn giản (class toggle hoặc context)

export default function Dashboard() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => setDarkMode(!darkMode);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return <div>{/* <Header /> */}</div>;
}
