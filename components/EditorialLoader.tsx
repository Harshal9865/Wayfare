import React from "react";

interface EditorialLoaderProps {
  size?: "sm" | "md" | "lg";
  label?: string;
  sublabel?: string;
}

export default function EditorialLoader({
  size = "md",
  label,
  sublabel,
}: EditorialLoaderProps) {
  const sizeClasses = {
    sm: "w-5 h-5 border-[2px]",
    md: "w-8 h-8 border-[2.5px]",
    lg: "w-12 h-12 border-[3px]",
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 text-center">
      {/* Compass / Ring Minimalist Spinner */}
      <div className="relative flex items-center justify-center mb-3">
        <div
          className={`${sizeClasses[size]} rounded-full border-on-surface/20 dark:border-[rgba(250,247,242,0.2)] border-t-primary dark:border-t-[#1E8C80] animate-spin`}
        />
        <div className="absolute w-1.5 h-1.5 rounded-full bg-secondary dark:bg-[#1E8C80] animate-ping" />
      </div>

      {label && (
        <p className="font-serif text-base md:text-lg text-on-surface dark:text-[#FAF7F2] font-normal tracking-wide">
          {label}
        </p>
      )}

      {sublabel && (
        <span className="font-sans text-[11px] uppercase tracking-widest text-on-surface-variant dark:text-[rgba(250,247,242,0.6)] mt-1">
          {sublabel}
        </span>
      )}
    </div>
  );
}
