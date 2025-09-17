"use client";
import React from "react";

type Props = { children: React.ReactNode };

type State = { hasError: boolean };

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error Boundary Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-center">
          <h2 className="text-xl font-semibold">Something went wrong.</h2>
          <p className="text-sm text-gray-500">Please try again later.</p>

          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
