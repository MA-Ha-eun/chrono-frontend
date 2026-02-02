import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface InfoCardProps {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  backgroundColor?: "zinc" | "accent";
}

export function InfoCard({
  icon: Icon,
  label,
  value,
  backgroundColor = "zinc",
}: InfoCardProps) {
  return (
    <div
      className={cn(
        "flex min-h-[85px] items-center justify-between rounded-lg p-5",
        backgroundColor === "accent" ? "bg-accent-50" : "bg-zinc-50"
      )}
    >
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Icon className="text-primary h-4 w-4" />
        <span>{label}</span>
      </div>
      <div className="text-base font-semibold text-gray-900">{value}</div>
    </div>
  );
}
