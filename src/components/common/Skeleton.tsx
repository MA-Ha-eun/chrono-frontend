import * as React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "full";
}

// 기본 스켈레톤 박스
export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, width, height, rounded = "md", ...props }, ref) => {
    const roundedClasses = {
      none: "",
      sm: "rounded-sm",
      md: "rounded",
      lg: "rounded-lg",
      xl: "rounded-xl",
      full: "rounded-full",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "animate-pulse bg-gray-200",
          width || "w-full",
          height || "h-4",
          roundedClasses[rounded],
          className
        )}
        {...props}
      />
    );
  }
);

Skeleton.displayName = "Skeleton";

// 텍스트 라인 스켈레톤
export interface SkeletonTextProps extends Omit<SkeletonProps, "height"> {
  lines?: number;
  widths?: string[];
}

export const SkeletonText = React.forwardRef<HTMLDivElement, SkeletonTextProps>(
  ({ className, lines = 1, widths, ...props }, ref) => {
    const defaultWidths =
      lines === 1 ? ["w-full"] : ["w-full", ...Array(lines - 1).fill("w-3/4")];
    const lineWidths = widths || defaultWidths;

    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        {Array.from({ length: lines }).map((_, idx) => (
          <Skeleton
            key={idx}
            width={lineWidths[idx] || "w-full"}
            height="h-4"
            rounded="md"
          />
        ))}
      </div>
    );
  }
);

SkeletonText.displayName = "SkeletonText";

// 원형 스켈레톤 (아바타 등)
export interface SkeletonCircleProps extends Omit<
  SkeletonProps,
  "width" | "height" | "rounded"
> {
  size?: string;
}

export const SkeletonCircle = React.forwardRef<
  HTMLDivElement,
  SkeletonCircleProps
>(({ className, size = "w-10 h-10", ...props }, ref) => {
  const sizeParts = size.split(" ");
  const width = sizeParts[0] || "w-10";
  const height = sizeParts[1] || width;

  return (
    <Skeleton
      ref={ref}
      width={width}
      height={height}
      rounded="full"
      className={className}
      {...props}
    />
  );
});

SkeletonCircle.displayName = "SkeletonCircle";

// 카드 형태 스켈레톤
export interface SkeletonCardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: string;
  height?: string;
}

export const SkeletonCard = React.forwardRef<HTMLDivElement, SkeletonCardProps>(
  (
    { className, padding = "p-6", height = "h-96", children, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl bg-white shadow-sm",
          padding,
          height,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

SkeletonCard.displayName = "SkeletonCard";

// 카드 내부 콘텐츠 (제목 + 본문)
export interface SkeletonCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  titleWidth?: string;
  contentHeight?: string;
  spacing?: string;
}

export const SkeletonCardContent = React.forwardRef<
  HTMLDivElement,
  SkeletonCardContentProps
>(
  (
    {
      className,
      titleWidth = "w-48",
      contentHeight = "h-64",
      spacing = "space-y-4",
      ...props
    },
    ref
  ) => {
    return (
      <div ref={ref} className={cn(spacing, className)} {...props}>
        <Skeleton width={titleWidth} height="h-6" rounded="md" />
        <Skeleton width="w-full" height={contentHeight} rounded="lg" />
      </div>
    );
  }
);

SkeletonCardContent.displayName = "SkeletonCardContent";
