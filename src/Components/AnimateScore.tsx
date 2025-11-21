
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";

export const AnimatedScore = ({ value }: { value: number }) => {
  const controls = useAnimation();
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    controls.start({
      x: [0, 0], // no movemos, solo usamos update callback
      transition: { duration: 1, ease: "easeOut" }
    });

    let start = display;
    let end = value;
    let diff = end - start;
    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      let progress = Math.min((timestamp - startTime) / 1000, 1);
      setDisplay(Math.round(start + diff * progress));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [value]);

  return <motion.span animate={controls}>{display}</motion.span>;
};
