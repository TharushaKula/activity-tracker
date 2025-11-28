"use client";

import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
}

export function GradientText({
  children,
  className,
  gradient = "from-blue-600 via-purple-600 to-pink-600",
}: GradientTextProps) {
  return (
    <span
      className={cn(
        `bg-gradient-to-r ${gradient} bg-clip-text text-transparent font-bold`,
        className
      )}
    >
      {children}
    </span>
  );
}

