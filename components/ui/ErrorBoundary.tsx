"use client";

import React, { ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Error caught:", error, info);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      return this.props.fallback ? (
        this.props.fallback(this.state.error, this.reset)
      ) : (
        <div className="flex flex-col items-center justify-center p-8 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-lg font-semibold text-red-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-red-700 mb-4">{this.state.error.message}</p>
          <button
            onClick={this.reset}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading skeleton component
export function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-20 bg-gray-200 rounded"></div>
      ))}
    </div>
  );
}

// Loading spinner component
export function LoadingSpinner({
  size = "md",
  text,
}: {
  size?: "sm" | "md" | "lg";
  text?: string;
}) {
  const sizeClass = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  }[size];

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizeClass} animate-spin`}>
        <div className="w-full h-full border-4 border-gray-200 border-t-green-600 rounded-full"></div>
      </div>
      {text && <p className="text-gray-600">{text}</p>}
    </div>
  );
}

// Empty state component
export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: string;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
      {icon && <div className="text-5xl mb-4">{icon}</div>}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-gray-600 mb-6 text-center">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

// Toast notification component
export interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
  duration?: number;
}

export function Toast({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const colors = {
    success: "bg-green-100 text-green-800 border-green-300",
    error: "bg-red-100 text-red-800 border-red-300",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-300",
    info: "bg-blue-100 text-blue-800 border-blue-300",
  };

  return (
    <div
      className={`border rounded-lg p-4 mb-4 flex justify-between items-center ${colors[toast.type]}`}
      role="alert"
    >
      <span>{toast.message}</span>
      <button
        onClick={onClose}
        className="font-bold hover:opacity-70"
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  );
}

// Safe async component wrapper
export async function SafeAsyncComponent<T>({
  promise,
  fallback,
  error,
}: {
  promise: Promise<T>;
  fallback?: ReactNode;
  error?: (error: Error) => ReactNode;
}): Promise<ReactNode> {
  try {
    const data = await promise;
    return data as ReactNode;
  } catch (err) {
    const errorObj = err instanceof Error ? err : new Error(String(err));
    return error ? error(errorObj) : <LoadingSpinner text="Error loading content" />;
  }
}

// Retry wrapper for failed operations
export function WithRetry({
  operation,
  maxRetries = 3,
  delayMs = 1000,
}: {
  operation: () => Promise<any>;
  maxRetries?: number;
  delayMs?: number;
}) {
  let retries = 0;

  const execute = async (): Promise<any> => {
    try {
      return await operation();
    } catch (error) {
      if (retries < maxRetries) {
        retries++;
        await new Promise((resolve) => setTimeout(resolve, delayMs * retries));
        return execute();
      }
      throw error;
    }
  };

  return execute();
}

// Request timeout utility
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(
        () => reject(new Error(`Operation timed out after ${timeoutMs}ms`)),
        timeoutMs
      )
    ),
  ]);
}

// Debounce utility for input handlers
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delayMs: number
): T {
  let timeoutId: NodeJS.Timeout;

  return ((...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delayMs);
  }) as T;
}
