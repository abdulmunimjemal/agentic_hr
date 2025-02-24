"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import KifiyaLogo from "@/components/kifiya-logo";

export function MainNav() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-primary/10">
      <nav className="container flex items-center justify-between h-16">
        {/* Logo Section */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-3"
        >
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2 rounded-lg bg-primary group-hover:bg-primary/90 transition-colors">
              <KifiyaLogo className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-semibold text-primary tracking-tighter">
              Kifiya Careers
              <span className="text-primary/60 font-light"> 2025</span>
            </span>
          </Link>
        </motion.div>

        {/* Right Side - Auth */}
      </nav>
    </header>
  );
}