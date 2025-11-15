"use client";
import React from "react";
import { cn } from "../../lib/utils";

export const ShineBorder = ({
  className,
  children,
  shineColor = ["#a472ea", "#C89BFF", "#432BA0"],
}) => {
  return (
    <div
      className={cn(
        "relative inline-flex rounded-[inherit]",
        className
      )}
    >
      <div
        className="absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 hover:opacity-100"
        style={{
          background: `linear-gradient(0deg, transparent 40%, ${shineColor[0]}, ${shineColor[1]}, ${shineColor[2]}, transparent 60%), linear-gradient(90deg, transparent 40%, ${shineColor[0]}, ${shineColor[1]}, ${shineColor[2]}, transparent 60%)`,
          backgroundSize: "200% 200%, 200% 200%",
          backgroundPosition: "0% 0%, 100% 100%",
          backgroundRepeat: "no-repeat",
          filter: "blur(10px)",
        }}
      />
      <div className="relative z-10 rounded-[inherit]">{children}</div>
    </div>
  );
};

