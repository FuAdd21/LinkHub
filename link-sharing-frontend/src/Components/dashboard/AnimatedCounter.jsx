import { animate, useMotionValue, useTransform, motion } from "framer-motion";
import { useEffect } from "react";
import { formatCompactNumber } from "./dashboardUtils";

export default function AnimatedCounter({ value, className = "" }) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) =>
    formatCompactNumber(Math.round(latest)),
  );

  useEffect(() => {
    const controls = animate(motionValue, Number(value || 0), {
      duration: 0.7,
      ease: "easeOut",
    });

    return () => controls.stop();
  }, [motionValue, value]);

  return <motion.span className={className}>{rounded}</motion.span>;
}


