import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import { 
  motion, 
  useMotionValue, 
  useMotionTemplate, 
  useAnimationFrame,
  useTransform
} from "motion/react";

export const InfiniteGrid = ({ children, className }) => {
  const containerRef = useRef(null);

  const mouseX = useMotionValue(-1000); // Start off-screen
  const mouseY = useMotionValue(-1000);

  const handleMouseMove = (e) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const gridOffsetX = useMotionValue(0);
  const gridOffsetY = useMotionValue(0);

  const speedX = 0.5; 
  const speedY = 0.5;

  useAnimationFrame(() => {
    gridOffsetX.set((gridOffsetX.get() + speedX) % 40);
    gridOffsetY.set((gridOffsetY.get() + speedY) % 40);
  });

  const maskImage = useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        mouseX.set(-1000);
        mouseY.set(-1000);
      }}
      className={cn(
        "relative w-full min-h-screen overflow-hidden bg-[#f0f9ff]",
        className
      )}
    >
      <div className="absolute inset-0 z-0 opacity-[0.1]">
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} id="grid-bg-static" />
      </div>
      <motion.div 
        className="absolute inset-0 z-0 opacity-60"
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} id="grid-bg-masked" />
      </motion.div>

      {/* Decorative Blurs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute right-[-20%] top-[-20%] w-[40%] h-[40%] rounded-full bg-sky-200/40 blur-[120px]" />
        <div className="absolute left-[-10%] bottom-[-20%] w-[40%] h-[40%] rounded-full bg-sky-100/40 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};

const GridPattern = ({ offsetX, offsetY, id }) => {
  const transform = useMotionTemplate`translate(${offsetX}, ${offsetY})`;
  return (
    <svg className="w-full h-full">
      <defs>
        <motion.pattern
          id={id}
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
          patternTransform={transform}
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-sky-900/40" 
          />
        </motion.pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
};
