"use client";
import { motion } from "framer-motion";

export function Loading() {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className="h-8 w-8 text-primary"
      fill="none"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4 }}>
      <path
        d="M6 2h7l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M13 2v5h5" stroke="currentColor" strokeWidth="1.6" />
      <motion.path
        d="M8 12h8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ repeat: Infinity, duration: 1.6 }}
      />
    </motion.svg>
  );
}
