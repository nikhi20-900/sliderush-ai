"use client";

import React from "react";

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    onError?: (error: Error, info: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

/**
 * Error boundary component that catches rendering errors
 * and displays a friendly fallback UI.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("ErrorBoundary caught:", error, errorInfo);
        this.props.onError?.(error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex flex-col items-center justify-center min-h-[200px] p-8 rounded-xl border border-red-200 bg-red-50">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="font-semibold text-red-900 mb-1">Something went wrong</h3>
                    <p className="text-sm text-red-600 mb-4 text-center max-w-md">
                        {this.state.error?.message || "An unexpected error occurred. Please try again."}
                    </p>
                    <button
                        onClick={this.handleRetry}
                        className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

/**
 * Wrapper for specific editor panels that provides
 * a section-level error boundary.
 */
export function EditorErrorBoundary({
    children,
    section,
}: {
    children: React.ReactNode;
    section: string;
}) {
    return (
        <ErrorBoundary
            fallback={
                <div className="p-4 text-center text-sm text-gray-500">
                    <p className="font-medium">Failed to load {section}</p>
                    <p className="mt-1">Please refresh the page.</p>
                </div>
            }
            onError={(error) => {
                console.error(`Error in ${section}:`, error);
            }}
        >
            {children}
        </ErrorBoundary>
    );
}
