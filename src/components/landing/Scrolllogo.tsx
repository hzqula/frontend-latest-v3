import React, { useRef, useLayoutEffect, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from "framer-motion";

interface VelocityItemProps {
  children: React.ReactNode;
  baseVelocity: number;
  scrollContainerRef?: React.RefObject<HTMLElement>;
  className?: string;
  damping?: number;
  stiffness?: number;
  numCopies?: number;
  velocityMapping?: {
    input: [number, number];
    output: [number, number];
  };
  style?: React.CSSProperties;
}

interface ScrollLogoBarProps {
  scrollContainerRef?: React.RefObject<HTMLElement>;
  items: Array<{
    type: 'text' | 'logo';
    content: string;
    logo?: string;
    logoAlt?: string;
    logoWidth?: number;
    logoHeight?: number;
  }>;
  velocity?: number;
  className?: string;
  itemClassName?: string;
  damping?: number;
  stiffness?: number;
  numCopies?: number;
  velocityMapping?: {
    input: [number, number];
    output: [number, number];
  };
  containerStyle?: React.CSSProperties;
  scrollerStyle?: React.CSSProperties;
}

function useElementWidth(ref: React.RefObject<HTMLElement | null>): number {
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    function updateWidth() {
      if (ref.current) {
        setWidth(ref.current.offsetWidth);
      }
    }
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [ref]);

  return width;
}

const VelocityItem: React.FC<VelocityItemProps> = ({
  children,
  baseVelocity,
  scrollContainerRef,
  className = "",
  damping = 50,
  stiffness = 400,
  numCopies = 6,
  velocityMapping = { input: [0, 1000], output: [0, 5] },
  style,
}) => {
  const baseX = useMotionValue(0);
  const scrollOptions = scrollContainerRef
    ? { container: scrollContainerRef }
    : {};
  const { scrollY } = useScroll(scrollOptions);
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping,
    stiffness,
  });
  const velocityFactor = useTransform(
    smoothVelocity,
    velocityMapping.input,
    velocityMapping.output,
    { clamp: false }
  );

  const copyRef = useRef<HTMLDivElement>(null);
  const copyWidth = useElementWidth(copyRef);

  function wrap(min: number, max: number, v: number): number {
    const range = max - min;
    const mod = (((v - min) % range) + range) % range;
    return mod + min;
  }

  const x = useTransform(baseX, (v) => {
    if (copyWidth === 0) return "0px";
    return `${wrap(-copyWidth, 0, v)}px`;
  });

  const directionFactor = useRef<number>(1);
  useAnimationFrame(( delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  const copies = [];
  for (let i = 0; i < numCopies; i++) {
    copies.push(
      <div
        className={`flex-shrink-0 ${className}`}
        key={i}
        ref={i === 0 ? copyRef : null}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className="flex whitespace-nowrap"
      style={{ x, ...style }}
    >
      {copies}
    </motion.div>
  );
};

export const ScrollLogoBar: React.FC<ScrollLogoBarProps> = ({
  scrollContainerRef,
  items = [],
  velocity = 100,
  className = "",
  itemClassName = "",
  damping = 50,
  stiffness = 400,
  numCopies = 6,
  velocityMapping = { input: [0, 1000], output: [0, 5] },
  containerStyle,
  scrollerStyle,
}) => {
  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={containerStyle}
    >
      <VelocityItem
        baseVelocity={velocity}
        scrollContainerRef={scrollContainerRef}
        damping={damping}
        stiffness={stiffness}
        numCopies={numCopies}
        velocityMapping={velocityMapping}
        style={scrollerStyle}
        className={itemClassName}
      >
        <div className="flex items-center gap-4">
          {items.map((item, index) => (
            <React.Fragment key={index}>
              {item.type === 'text' ? (
                <span className="mx-4">{item.content}</span>
              ) : (
                <img 
                  src={item.logo} 
                  alt={item.logoAlt || "Logo"} 
                  width={item.logoWidth || 40} 
                  height={item.logoHeight || 40}
                  className="mx-4"
                />
              )}
              <span className="text-gray-400 mx-2">•</span>
            </React.Fragment>
          ))}
        </div>
      </VelocityItem>
    </div>
  );
};

export default ScrollLogoBar;