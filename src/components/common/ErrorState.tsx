import * as React from "react";
import { Link } from "react-router-dom";
import { LucideIcon, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

export interface ErrorStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionLink?: string;
  className?: string;
  iconBg?: string;
  iconColor?: string;
}

// 에러 상태 표시
export const ErrorState = React.forwardRef<HTMLDivElement, ErrorStateProps>(
  (
    {
      icon: Icon = AlertCircle,
      title,
      description,
      actionLabel,
      onAction,
      actionLink,
      className,
      iconBg = "bg-accent-50",
      iconColor = "text-accent-dark",
      ...props
    },
    ref
  ) => {
    const iconSize = "h-8 w-8";

    const actionButton = actionLabel && (
      <div className="mt-6">
        {actionLink ? (
          <Link
            to={actionLink}
            className="bg-primary hover:bg-primary-dark inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium text-white transition-colors"
          >
            {actionLabel}
          </Link>
        ) : onAction ? (
          <Button onClick={onAction} size="md">
            {actionLabel}
          </Button>
        ) : null}
      </div>
    );

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center rounded-xl bg-white py-20 shadow-sm",
          className
        )}
        {...props}
      >
        <div className={cn("rounded-full p-4", iconBg)}>
          <Icon className={cn(iconSize, iconColor)} />
        </div>
        <h2 className="mt-4 text-xl font-semibold text-gray-900">{title}</h2>
        {description && (
          <p className="mt-2 text-sm text-gray-500">{description}</p>
        )}
        {actionButton}
      </div>
    );
  }
);

ErrorState.displayName = "ErrorState";
