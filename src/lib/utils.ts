import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { isApiError } from "@/lib/api/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorInfo(error: unknown): string {
  if (isApiError(error)) {
    return `[${error.code}] ${error.message}`;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "알 수 없는 오류";
}
