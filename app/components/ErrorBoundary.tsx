import { useEffect } from "react";
import { isRouteErrorResponse, useRouteError } from "@remix-run/react";

interface ErrorBoundaryProps {
  error: Error;
  componentStack?: string;
}

export function RootErrorBoundary() {
  const error = useRouteError();
  const isRouteError = isRouteErrorResponse(error);

  useEffect(() => {
    // TODO: Replace with actual error logging service
    console.error("Unhandled error:", {
      error: isRouteError ? error.data : error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });
  }, [error, isRouteError]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <img
            src="/error-illustration.svg"
            alt="Error illustration"
            className="w-48 h-48 mx-auto"
          />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-4">
          {isRouteError ? `${error.status} ${error.statusText}` : "Oops! Something went wrong"}
        </h1>
        
        <p className="text-gray-400 mb-8">
          {isRouteError 
            ? error.data
            : "We're sorry for the inconvenience. Our team has been notified and is working to fix this issue."}
        </p>

        <div className="space-y-4">
          <button
            onClick={() => isRouteError ? window.history.back() : window.location.reload()}
            className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 
                     text-white rounded-lg transition-colors duration-200"
          >
            {isRouteError ? "Go Back" : "Try Again"}
          </button>
          
          <a
            href="mailto:support@omniai.com"
            className="block text-purple-400 hover:text-purple-300 
                     transition-colors duration-200"
          >
            Contact Support →
          </a>
        </div>

        {process.env.NODE_ENV === "development" && !isRouteError && error instanceof Error && (
          <div className="mt-8 p-4 bg-red-900/20 rounded-lg text-left">
            <p className="text-red-400 font-mono text-sm break-all">
              {error.message}
            </p>
            {error.stack && (
              <pre className="mt-2 text-red-400/70 font-mono text-xs overflow-x-auto">
                {error.stack}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 