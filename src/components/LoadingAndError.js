import React from "react";

export function DashboardSkeleton() {
  return (
    <div className="skeleton-grid" aria-hidden="true">
      <div className="skel skel-hero" />
      <div className="skel skel-card" />
      <div className="skel skel-card" />
      <div className="skel skel-wide" />
      <div className="skel skel-wide" />
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="error-state" role="alert">
      <WarningIcon />
      <p className="error-title">We hit a snag</p>
      <p className="error-message">{message}</p>
      {onRetry && (
        <button type="button" className="error-retry" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
}

function WarningIcon() {
  return (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 3 2 20h20L12 3Z" strokeLinejoin="round" />
      <path d="M12 10v4M12 17.5h.01" strokeLinecap="round" />
    </svg>
  );
}
