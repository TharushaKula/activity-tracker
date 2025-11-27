"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ReminderBanner() {
  const [showReminder, setShowReminder] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if user has logged activities today
    const checkReminder = () => {
      const lastDismissal = localStorage.getItem("reminderDismissed");
      const today = new Date().toDateString();

      // Show reminder if:
      // 1. It's evening (after 6 PM)
      // 2. User hasn't dismissed it today
      // 3. User hasn't logged activities recently (this would be checked with API in real app)
      const now = new Date();
      const isEvening = now.getHours() >= 18;

      if (isEvening && lastDismissal !== today && !dismissed) {
        setShowReminder(true);
      }
    };

    checkReminder();
    const interval = setInterval(checkReminder, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [dismissed]);

  const handleDismiss = () => {
    setShowReminder(false);
    setDismissed(true);
    localStorage.setItem(
      "reminderDismissed",
      new Date().toDateString()
    );
  };

  return (
    <AnimatePresence>
      {showReminder && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-2 border-[#0D7AB8] shadow-md bg-gradient-to-r from-blue-50 to-white">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-[#0D7AB8]">
                    <Bell className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Don't forget to log your activities!</p>
                    <p className="text-sm text-gray-600">
                      It's evening - make sure to record what you did today.
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDismiss}
                  className="hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

