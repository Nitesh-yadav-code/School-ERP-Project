import * as Sentry from "@sentry/react";

const ErrorBoundary = Sentry.withErrorBoundary(
  ({ children }) => children,
  {
    fallback: <h2>Something went wrong.</h2>, // UI shown if component crashes
  }
);

export default ErrorBoundary;
