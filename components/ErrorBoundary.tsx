"use client";

import React from "react";

interface Props {
  children: React.ReactNode;
  sectionName?: string;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(`[ErrorBoundary: ${this.props.sectionName || "section"}]`, error, info);
    // TODO: send to Sentry when integrated
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="w-full py-8 px-4 flex items-center justify-center">
          <div className="max-w-sm w-full bg-surface-container dark:bg-[#1C1B1B] border border-on-surface/20 dark:border-[rgba(250,247,242,0.15)] rounded-2xl p-8 text-center flex flex-col items-center gap-4">
            <span className="material-symbols-outlined text-[40px] text-outline dark:text-[rgba(250,247,242,0.35)]">
              travel_explore
            </span>
            <div>
              <p className="font-sans text-sm text-on-surface dark:text-[#FAF7F2] font-medium">
                Something went wrong
              </p>
              <p className="font-sans text-xs text-outline dark:text-[rgba(250,247,242,0.5)] mt-1">
                Could not load {this.props.sectionName || "this section"}.
              </p>
            </div>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="font-sans text-xs font-semibold uppercase tracking-wider px-5 py-2 rounded-full border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] bg-surface-container-low dark:bg-[#1C1B1B] text-on-surface dark:text-[#FAF7F2] hover:bg-surface-container dark:hover:bg-[#2A2A2A] transition-all hover:scale-105 cursor-pointer"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
