import React from "react";
import Link from "next/link";
import { Heart, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full py-6 mt-auto border-t border-gray-200/80 bg-white/60 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-gray-600">
        <p className="flex items-center gap-1.5 font-medium">
          Made with{" "}
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500 inline-block animate-pulse" />{" "}
          by{" "}
          <Link
            href="https://github.com/Tanishpal23"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors inline-flex items-center gap-1"
          >
            Tanish
            <Github className="w-3.5 h-3.5 inline-block text-gray-700 hover:text-black transition-colors" />
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
