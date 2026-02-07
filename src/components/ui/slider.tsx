"use client";

import { cn } from "@/lib/utils";
import * as React from "react";

interface SliderProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number[];
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({ className, value = [0], onValueChange, min = 0, max = 100, step = 1, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(value[0] ?? min);

    React.useEffect(() => {
      setInternalValue(value[0] ?? min);
    }, [value, min]);

    const handleChange = (newValue: number) => {
      const clampedValue = Math.min(Math.max(newValue, min), max);
      setInternalValue(clampedValue);
      onValueChange?.([clampedValue]);
    };

    const percentage = ((internalValue - min) / (max - min)) * 100;

    return (
      <div
        ref={ref}
        className={cn("relative flex w-full touch-none select-none items-center", className)}
        {...props}
      >
        <div className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-200">
          <div
            className="absolute h-full bg-blue-600 transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div
          className="absolute block h-5 w-5 rounded-full border-2 border-blue-600 bg-white ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          style={{ left: `calc(${percentage}% - 10px)` }}
          onMouseDown={(e) => {
            e.preventDefault();
            const rect = e.currentTarget.parentElement?.getBoundingClientRect();
            if (rect) {
              const handleMove = (moveEvent: MouseEvent) => {
                const newValue = ((moveEvent.clientX - rect.left) / rect.width) * (max - min) + min;
                handleChange(newValue);
              };
              const handleUp = () => {
                document.removeEventListener("mousemove", handleMove);
                document.removeEventListener("mouseup", handleUp);
              };
              document.addEventListener("mousemove", handleMove);
              document.addEventListener("mouseup", handleUp);
            }
          }}
        />
      </div>
    );
  }
);
Slider.displayName = "Slider";

export { Slider };

