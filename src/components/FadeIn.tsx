import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  opacityDuration?: number;
  viewportMargin?: string;
  y?: number;
  className?: string;
}

export default function FadeIn({
  children,
  delay = 0,
  duration = 2.0,
  opacityDuration,
  y = 30,
  viewportMargin = "-300px",
  className = "",
}: FadeInProps & { opacityDuration?: number; viewportMargin?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: viewportMargin }}
      transition={{
        y: { duration, delay, ease: "easeOut" },
        opacity: { duration: opacityDuration ?? duration, delay, ease: "easeOut" },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
