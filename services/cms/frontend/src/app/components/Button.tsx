// components/Button.tsx
"use client";

import { ReactNode } from "react";

export function Button({
  children,
  variant = "default",
  disabled = false,
  onClick,
}: {
  children: ReactNode;
  variant?: "default" | "outline" | "secondary";
  disabled?: boolean;
  onClick?: () => void;
}) {
  const baseStyles =
    "px-4 py-2 rounded-md font-medium transition-all duration-300";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-400 text-gray-700 hover:bg-gray-200",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-300",
  };
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
      {children}
    </div>
  );
}

export function CardContent({ children }: { children: ReactNode }) {
  return <div className="p-6">{children}</div>;
}
