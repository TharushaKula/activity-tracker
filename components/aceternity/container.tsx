"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function Container({ children, className, delay = 0 }: ContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn("w-full", className)}
    >
      {children}
    </motion.div>
  );
}

