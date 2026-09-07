"use client";
import React, { useState } from "react";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

const Header = () => {
  const router = useRouter();
  const path = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Questions", path: "/dashboard/question" },
    { name: "Upgrade", path: "/dashboard/upgrade" },
    { name: "How it Works", path: "/dashboard/how" },
  ];

  const handleNavigate = (route) => {
    router.push(route);
    setIsOpen(false);
  };

  return (
    <header className="relative bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-xs z-50">
      <div className="flex px-4 md:px-12 py-3.5 items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => handleNavigate("/dashboard")}
        >
          <Image src="/logo.svg" width={44} height={44} alt="logo" priority />
        </div>

        {/* Desktop Navigation with expanded spacing */}
        <ul className="hidden md:flex items-center gap-8 lg:gap-12">
          {navLinks.map((link) => {
            const isActive = path === link.path;
            return (
              <li
                key={link.path}
                onClick={() => handleNavigate(link.path)}
                className={`text-sm lg:text-base font-medium transition-all cursor-pointer py-1 border-b-2 ${
                  isActive
                    ? "text-blue-600 font-bold border-blue-600"
                    : "text-gray-600 border-transparent hover:text-blue-600 hover:border-blue-400"
                }`}
              >
                {link.name}
              </li>
            );
          })}
        </ul>

        {/* Right Section: User Profile & Mobile Hamburger Menu */}
        <div className="flex items-center gap-3 md:gap-4">
          <UserButton />

          {/* Three horizontal lines (Hamburger icon) on phone / mobile */}
          <button
            type="button"
            className="md:hidden p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-6 h-6 text-gray-800" /> : <Menu className="w-6 h-6 text-gray-800" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-5 py-4 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <ul className="flex flex-col gap-2.5">
            {navLinks.map((link) => {
              const isActive = path === link.path;
              return (
                <li
                  key={link.path}
                  onClick={() => handleNavigate(link.path)}
                  className={`p-3 rounded-lg text-base font-medium cursor-pointer transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-bold"
                      : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                  }`}
                >
                  {link.name}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
